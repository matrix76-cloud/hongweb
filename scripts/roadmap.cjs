// 9월 마스터 플랜(리뷰 페이지 달력) 읽고 쓰기 — 카스가 형과 플랜으로 소통하는 도구 (형 지시 2026-08-23)
//   node scripts/roadmap.cjs list                         전체 (날짜순, 상태 포함)
//   node scripts/roadmap.cjs today                        오늘·지난 것 중 미완료 + 이번 주
//   node scripts/roadmap.cjs add <date> <owner> "<제목>" [end] [milestone]
//   node scripts/roadmap.cjs status <id|제목앞부분> <대기|진행|완료>
//   node scripts/roadmap.cjs move <id|제목앞부분> <date> [end]
//   node scripts/roadmap.cjs remove <id|제목앞부분>
// 데이터: Firestore reviewMeta/roadmap { items:[{id,date,end,title,owner,kind,note}], status:{id:상태} }
const path = require('path');
const admin = require(path.join(__dirname, '../functions/node_modules/firebase-admin'));
admin.initializeApp({ credential: admin.credential.cert(require(path.join(__dirname, '../functions/serviceAccountKey.json'))) });
const ref = admin.firestore().doc('reviewMeta/roadmap');
const kst = (d = new Date()) => new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const find = (items, key) => items.find((it) => it.id === key) || items.find((it) => it.title.startsWith(key));
const line = (it, st) => `${it.date}${it.end ? '~' + it.end.slice(5) : ''}  [${it.owner}]${it.kind === 'milestone' ? ' ★' : ''} ${it.title}  — ${st[it.id] || '대기'}  (${it.id})`;

(async () => {
  const [cmd, ...a] = process.argv.slice(2);
  const d = (await ref.get()).data() || {}; const items = d.items || []; const status = d.status || {};
  const save = (ni, ns) => ref.set({ items: ni, status: ns, updatedAt: Date.now() }, { merge: true });
  const sorted = [...items].sort((x, y) => x.date.localeCompare(y.date));
  if (cmd === 'list' || !cmd) { sorted.forEach((it) => console.log(line(it, status))); console.log(`total ${items.length} · 진행 ${Object.values(status).filter((s) => s === '진행').length} · 완료 ${Object.values(status).filter((s) => s === '완료').length}`); }
  else if (cmd === 'today') {
    const t = kst(); const wk = kst(new Date(Date.now() + 7 * 86400000));
    console.log(`오늘 ${t}`); console.log('--- 지났거나 오늘인데 미완료');
    sorted.filter((it) => it.date <= t && (status[it.id] || '대기') !== '완료').forEach((it) => console.log(line(it, status)));
    console.log('--- 앞으로 7일'); sorted.filter((it) => it.date > t && it.date <= wk).forEach((it) => console.log(line(it, status)));
  }
  else if (cmd === 'add') { const [date, owner, title, end = '', ms = ''] = a; const it = { id: 'r' + Date.now().toString(36), date, end: end && end > date ? end : '', title, owner, kind: ms === 'milestone' ? 'milestone' : 'task', note: '' }; await save([...items, it], status); console.log('added', line(it, status)); }
  else if (cmd === 'status') { const [key, st] = a; const it = find(items, key); if (!it) return console.log('없음'); await save(items, { ...status, [it.id]: st }); console.log('status', line(it, { ...status, [it.id]: st })); }
  else if (cmd === 'move') { const [key, date, end = ''] = a; const it = find(items, key); if (!it) return console.log('없음'); const ni = items.map((x) => x.id === it.id ? { ...x, date, end: end && end > date ? end : '' } : x); await save(ni, status); console.log('moved', line(ni.find((x) => x.id === it.id), status)); }
  else if (cmd === 'remove') { const it = find(items, a[0]); if (!it) return console.log('없음'); const ns = { ...status }; delete ns[it.id]; await save(items.filter((x) => x.id !== it.id), ns); console.log('removed', it.title); }
  process.exit(0);
})();
