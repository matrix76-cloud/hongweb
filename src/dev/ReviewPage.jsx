import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DOMAINS, STATUS_LABEL, STATUS_COLOR } from './reviewData';

/**
 * 개발 전용 리뷰 허브 (/review · DEV 게이트)
 *
 *   좌 = 실제 화면(iframe) + 핀 찍기
 *   우상 = 도메인 탭 → 화면 버튼 (2단계)
 *   우중 = 그 화면의 기획 사양(spec)
 *   우하 = 기록 스레드
 *
 * 기록은 _docs/review_thread.json 에 파일로 저장된다 (vite-plugin-review-notes).
 * 형이 핀 찍고 메모 남기면 카스가 읽고 조치한 뒤 답글을 단다.
 */

const C = {
  ink: '#131313', gray: '#71717a', gray2: '#a3a3a3',
  line: '#e3e3e3', bg: '#f4f5f7', card: '#fff', brand: '#FF4E19', blue: '#2563eb',
};
const FONT = "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif";

const ALL = DOMAINS.flatMap((d) => d.screens.map((s) => ({ ...s, domain: d.key, domainLabel: d.label })));

const btn = (on) => ({
  fontSize: 14, fontWeight: on ? 700 : 500, padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
  border: `1px solid ${on ? C.brand : C.line}`,
  background: on ? C.brand : '#fff',
  color: on ? '#fff' : C.ink,
});

export default function ReviewPage() {
  const [thread, setThread] = useState({});
  const [domain, setDomain] = useState(DOMAINS[1].key);   // 기본 = ① 일 올리기
  const [curId, setCurId] = useState(DOMAINS[1].screens[0].id);
  const [pinMode, setPinMode] = useState(false);
  const [pins, setPins] = useState([]);
  const [viewPins, setViewPins] = useState(null);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const frameRef = useRef(null);

  const cur = ALL.find((s) => s.id === curId) || ALL[0];
  const entries = thread[curId] || [];
  const curDomain = DOMAINS.find((d) => d.key === domain) || DOMAINS[0];

  const load = () =>
    fetch('/__review_thread').then((r) => r.json()).then(setThread).catch(() => setThread({}));

  useEffect(() => { load(); }, []);
  useEffect(() => { setPins([]); setViewPins(null); setPinMode(false); setReplyTo(null); }, [curId]);

  const countOf = (id) => (thread[id] || []).length;

  // 미답변 = 형 글에 답글이 없는 것
  const unanswered = useMemo(() => {
    let n = 0;
    for (const items of Object.values(thread)) {
      const replied = new Set(items.filter((x) => x.replyTo).map((x) => x.replyTo));
      n += items.filter((x) => !x.replyTo && x.by !== '카스' && !replied.has(x.pid)).length;
    }
    return n;
  }, [thread]);

  const addPin = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    setPins((p) => [...p, {
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100,
      label: String(p.length + 1),
    }]);
  };

  const post = async () => {
    const t = text.trim();
    if (!t && !pins.length) return;
    await fetch('/__review_thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: curId, by: '형', text: t, pins: pins.length ? pins : undefined, replyTo: replyTo || undefined }),
    });
    setText(''); setPins([]); setPinMode(false); setReplyTo(null);
    load();
  };

  const del = async (pid) => {
    await fetch('/__review_thread', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: curId, pid }),
    });
    load();
  };

  const shownPins = viewPins || pins;
  const roots = entries.filter((e) => !e.replyTo);
  const repliesOf = (pid) => entries.filter((e) => e.replyTo === pid);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.ink, fontFamily: FONT, padding: '16px 20px' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>홍여사 리뷰</h1>
        <span style={{ fontSize: 14, color: C.gray }}>
          화면 {ALL.length}개 · <b style={{ color: C.brand }}>미답변 {unanswered}</b>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* ── 좌: 실제 화면 + 핀 ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <button style={btn(pinMode)} onClick={() => { setPinMode((v) => !v); setViewPins(null); }}>
              {pinMode ? '핀 찍는 중 — 화면 클릭' : '핀 찍기'}
            </button>
            {pins.length > 0 && (
              <>
                <span style={{ fontSize: 14, color: C.brand, fontWeight: 700 }}>핀 {pins.length}</span>
                <button style={{ ...btn(false), padding: '6px 10px' }} onClick={() => setPins([])}>지우기</button>
              </>
            )}
            {viewPins && <button style={{ ...btn(false), padding: '6px 10px' }} onClick={() => setViewPins(null)}>핀 보기 끄기</button>}
            <div style={{ flex: 1 }} />
            {cur.path && (
              <button style={{ ...btn(false), padding: '6px 10px' }}
                onClick={() => frameRef.current && (frameRef.current.src = cur.path)}>새로고침</button>
            )}
          </div>

          <div style={{ position: 'relative', width: 390, height: 780, border: `1px solid ${C.line}`, borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            {cur.path ? (
              <iframe ref={frameRef} title={cur.name} src={cur.path}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', padding: 34, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#c02020' }}>아직 화면이 없습니다</div>
                <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.7 }}>
                  {(cur.spec || []).filter((s) => s.startsWith('★'))[0] || '미구현'}
                </div>
              </div>
            )}

            <div onClick={pinMode ? addPin : undefined}
              style={{
                position: 'absolute', inset: 0,
                cursor: pinMode ? 'crosshair' : 'default',
                background: pinMode ? 'rgba(255,78,25,0.05)' : 'transparent',
                pointerEvents: pinMode ? 'auto' : 'none',
              }} />

            {shownPins.map((p, i) => (
              <div key={i} style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)',
                width: 26, height: 26, borderRadius: 13, background: C.brand, color: '#fff',
                fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff', boxShadow: '0 1px 5px rgba(0,0,0,.35)', pointerEvents: 'none',
              }}>{p.label || i + 1}</div>
            ))}
          </div>
        </div>

        {/* ── 우 ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* 1단계: 도메인 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DOMAINS.map((d) => {
              const on = d.key === domain;
              const n = d.screens.reduce((a, s) => a + countOf(s.id), 0);
              return (
                <button key={d.key} style={btn(on)}
                  onClick={() => { setDomain(d.key); setCurId(d.screens[0].id); }}>
                  {d.label}
                  {n > 0 && <span style={{ marginLeft: 6, fontSize: 13, opacity: .85 }}>{n}</span>}
                </button>
              );
            })}
          </div>

          {/* 2단계: 화면 */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {curDomain.screens.map((s) => {
              const on = s.id === curId;
              const n = countOf(s.id);
              return (
                <button key={s.id} onClick={() => setCurId(s.id)} style={{
                  ...btn(on), display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 13, opacity: .6 }}>{s.no}</span>
                  {s.name}
                  <span style={{ fontSize: 13, fontWeight: 700, color: on ? 'rgba(255,255,255,.9)' : STATUS_COLOR[s.status] }}>
                    {STATUS_LABEL[s.status]}
                  </span>
                  {n > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, minWidth: 18, height: 18, lineHeight: '18px',
                      borderRadius: 9, padding: '0 5px', textAlign: 'center',
                      background: on ? '#fff' : C.brand, color: on ? C.brand : '#fff',
                    }}>{n}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 기획 사양 */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{cur.no} {cur.name}</div>
              {cur.path
                ? <a href={cur.path} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: C.blue }}>{cur.path}</a>
                : <span style={{ fontSize: 14, color: '#c02020', fontWeight: 600 }}>화면 없음</span>}
            </div>
            {(cur.spec || []).length === 0
              ? <div style={{ fontSize: 15, color: C.gray2 }}>작성된 사양 없음</div>
              : (cur.spec || []).map((line, i) => {
                const key = line.startsWith('★');
                return (
                  <div key={i} style={{
                    fontSize: 15, lineHeight: 1.7, marginBottom: 5,
                    color: key ? C.ink : C.gray, fontWeight: key ? 600 : 400,
                  }}>{line}</div>
                );
              })}
          </div>

          {/* 스레드 */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, minHeight: 240 }}>
            {roots.length === 0 && (
              <div style={{ fontSize: 15, color: C.gray2, padding: '10px 0 16px' }}>아직 기록이 없습니다.</div>
            )}

            {roots.map((e) => (
              <div key={e.pid} style={{ borderTop: `1px solid #f2f2f2`, padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <b style={{ fontSize: 15, color: e.by === '카스' ? C.blue : C.ink }}>{e.by}</b>
                  <span style={{ fontSize: 13, color: C.gray2 }}>{e.at}</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setReplyTo(replyTo === e.pid ? null : e.pid)}
                    style={{ fontSize: 13, color: replyTo === e.pid ? C.brand : C.gray2, background: 'none', border: 'none', cursor: 'pointer', fontWeight: replyTo === e.pid ? 700 : 400 }}>
                    {replyTo === e.pid ? '답글 취소' : '답글'}
                  </button>
                  <button onClick={() => del(e.pid)} style={{ fontSize: 13, color: C.gray2, background: 'none', border: 'none', cursor: 'pointer' }}>삭제</button>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{e.text}</div>

                {e.pins?.length > 0 && (
                  <button onClick={() => { setViewPins(e.pins); setPinMode(false); }} style={{
                    marginTop: 7, fontSize: 13, fontWeight: 700, color: '#c2410c',
                    background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                  }}>화면 핀 {e.pins.length}개 위치 보기</button>
                )}

                {repliesOf(e.pid).map((r) => (
                  <div key={r.pid} style={{ marginTop: 10, marginLeft: 12, paddingLeft: 12, borderLeft: `2px solid #eee` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <b style={{ fontSize: 14, color: r.by === '카스' ? C.blue : C.ink }}>{r.by}</b>
                      <span style={{ fontSize: 13, color: C.gray2 }}>{r.at}</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{r.text}</div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ marginTop: 14, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
              {(pins.length > 0 || replyTo) && (
                <div style={{ fontSize: 14, color: C.brand, fontWeight: 600, marginBottom: 6 }}>
                  {replyTo ? '답글로 달립니다' : ''}
                  {replyTo && pins.length > 0 ? ' · ' : ''}
                  {pins.length > 0 ? `핀 ${pins.length}개 함께 저장` : ''}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea
                  value={text}
                  onChange={(ev) => setText(ev.target.value)}
                  onKeyDown={(ev) => { if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) post(); }}
                  placeholder="이 화면에서 고칠 것 (Cmd+Enter 로 남기기)"
                  style={{
                    flex: 1, minHeight: 64, padding: '11px 13px', border: `1px solid #d8d8d8`, borderRadius: 8,
                    fontSize: 15, fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical', outline: 'none',
                  }} />
                <button onClick={post} style={{
                  flexShrink: 0, alignSelf: 'flex-end', padding: '0 20px', height: 44, border: 'none', borderRadius: 8,
                  background: C.brand, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}>남기기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
