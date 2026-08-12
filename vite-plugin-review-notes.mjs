// 리뷰 기록 파일 백엔드 (개발 전용) — 노트/스레드를 레포 파일에 저장.
// 브라우저를 지워도, 다른 기기/브라우저에서 열어도 항상 같은 기록을 본다. apply:'serve'라 프로덕션 미포함.
//
//  [노트 — legacy 단일 텍스트]  _docs/review_notes.json
//    GET  /__review_notes            → { id: text }
//    POST /__review_notes  {id,note}  → 병합 저장
//
//  [스레드 — 시간 찍힌 기록 타임라인]  _docs/review_thread.json  ★현재 표준
//    GET  /__review_thread                 → { id: [{by, at, text}, ...] }
//    POST /__review_thread  {id,by,text}   → 항목 추가(서버가 KST 시간 at 자동 기록)
//    by = '형' | '카스' | 도메인 에이전트명. 다른 에이전트도 curl 로 남길 수 있다.
import fs from 'node:fs'
import path from 'node:path'

// KST(Asia/Seoul) "YYYY-MM-DD HH:MM"
function kstNow() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 16)
}

function fileApi(fileRel) {
  const FILE = path.resolve(process.cwd(), fileRel)
  const read = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')) } catch { return {} } }
  const write = (obj) => {
    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(obj, null, 2) + '\n', 'utf-8')
  }
  return { read, write }
}

function body(req) {
  return new Promise((resolve) => {
    let b = ''
    req.on('data', (c) => (b += c))
    req.on('end', () => { try { resolve(JSON.parse(b || '{}')) } catch { resolve(null) } })
  })
}

export default function reviewNotes() {
  const notes = fileApi('_docs/review_notes.json')
  const thread = fileApi('_docs/review_thread.json')
  let pidSeq = 0

  return {
    name: 'review-notes',
    apply: 'serve',
    configureServer(server) {
      // ── 노트(legacy) ──
      server.middlewares.use('/__review_notes', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'GET') return res.end(JSON.stringify(notes.read()))
        if (req.method === 'POST') {
          const d = await body(req)
          if (!d || !d.id) { res.statusCode = 400; return res.end('{"ok":false}') }
          const all = notes.read()
          if (d.note == null || d.note === '') delete all[d.id]; else all[d.id] = d.note
          notes.write(all)
          return res.end('{"ok":true}')
        }
        res.statusCode = 405; res.end('{"ok":false}')
      })

      // ── 스레드(표준) ──
      server.middlewares.use('/__review_thread', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'GET') return res.end(JSON.stringify(thread.read()))
        if (req.method === 'POST') {
          const d = await body(req)
          const text = d && d.text ? String(d.text).trim() : ''
          const images = Array.isArray(d?.images) ? d.images : []
          if (!d || !d.id || (!text && !images.length)) { res.statusCode = 400; return res.end('{"ok":false}') }
          const item = { pid: `p${Date.now()}_${pidSeq++}`, by: d.by || '개발자', at: kstNow(), text }
          if (d.replyTo) item.replyTo = String(d.replyTo) // 부모 글 pid → 그 글 밑에 댓글로 달림
          if (Array.isArray(d.pins) && d.pins.length) item.pins = d.pins.slice(0, 30)
          // 첨부 이미지(dataURL) → _docs/review_images/ 파일 저장 → /review_images/ 경로
          if (images.length) {
            const dir = path.resolve(process.cwd(), '_docs/review_images')
            fs.mkdirSync(dir, { recursive: true })
            const stamp = kstNow().replace(/[^0-9]/g, '')
            item.imgs = []
            images.forEach((b64, i) => {
              const m = /^data:image\/(\w+);base64,(.+)$/.exec(b64 || '')
              if (!m) return
              const ext = m[1] === 'jpeg' ? 'jpg' : m[1]
              const fname = `${d.id}_${stamp}_${i}.${ext}`
              fs.writeFileSync(path.join(dir, fname), Buffer.from(m[2], 'base64'))
              item.imgs.push('/review_images/' + fname)
            })
            if (!item.imgs.length) delete item.imgs
          }
          const all = thread.read()
          all[d.id] = [...(all[d.id] || []), item]
          thread.write(all)
          return res.end(JSON.stringify({ ok: true, item }))
        }
        if (req.method === 'DELETE') {
          const d = await body(req)
          if (!d || !d.id || (d.pid == null && d.index == null)) { res.statusCode = 400; return res.end('{"ok":false}') }
          const all = thread.read()
          if (Array.isArray(all[d.id])) {
            if (d.pid != null) all[d.id] = all[d.id].filter((e) => e.pid !== d.pid && e.replyTo !== d.pid) // 글 삭제 시 그 댓글도 함께
            else all[d.id].splice(d.index, 1)
            if (all[d.id].length === 0) delete all[d.id]
            thread.write(all)
          }
          return res.end('{"ok":true}')
        }
        res.statusCode = 405; res.end('{"ok":false}')
      })

      // ── 첨부 이미지 서빙 (_docs/review_images/) ──
      server.middlewares.use('/review_images', (req, res) => {
        const name = decodeURIComponent((req.url || '').split('?')[0].replace(/^\//, ''))
        const base = path.resolve(process.cwd(), '_docs/review_images')
        const fp = path.resolve(base, name)
        if (name && fp.startsWith(base) && fs.existsSync(fp)) {
          const ext = path.extname(fp).slice(1).toLowerCase()
          res.setHeader('Content-Type', `image/${ext === 'jpg' ? 'jpeg' : ext}`)
          fs.createReadStream(fp).pipe(res)
        } else {
          res.statusCode = 404
          res.end()
        }
      })
    },
  }
}
