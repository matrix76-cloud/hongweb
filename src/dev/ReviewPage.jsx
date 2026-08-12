import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DOMAINS, STATUS_LABEL, STATUS_COLOR } from './reviewData';
import { captureFrame, describeTarget } from './reviewCapture';
import FcmTestBoard from './FcmTestBoard';
import { seedChatRooms, clearSeededChats } from './seedChat';

/**
 * 개발 전용 리뷰 허브 (/review · DEV 게이트)
 *
 *   좌 = 실제 화면(iframe) + 핀 찍기 + 스샷 캡처
 *   우상 = 도메인 탭 → 화면 버튼 (2단계)
 *   우하 = 기록 스레드 (핀 위치 · 첨부 스샷)
 *
 * 기획 사양(spec) 패널은 형 지시로 화면에서 걷어냈다(2026-08-12).
 * reviewData.js 의 spec 필드는 기록용으로 남겨둔다.
 *
 * 기록은 _docs/review_thread.json, 스샷은 _docs/review_images/ 에 파일로 저장된다.
 * 형이 핀 찍고 캡처해서 메모 남기면 카스가 읽고 조치한 뒤 답글을 단다.
 */

const C = {
  ink: '#131313', gray: '#71717a', gray2: '#a3a3a3',
  line: '#e3e3e3', bg: '#f4f5f7', card: '#fff', brand: '#FF4E19', blue: '#2563eb',
  red: '#e11d48',   // 아직 답 안 단 표시 (형 지시 2026-08-12)
};
const FONT = "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif";

// 좌측 미리보기 = 실제 폰 사이즈. 360x800 (안드로이드 20:9 표준)
const PHONE = { w: 360, h: 800 };

const ALL = DOMAINS.flatMap((d) => d.screens.map((s) => ({ ...s, domain: d.key })));

const btn = (on) => ({
  fontSize: 14, fontWeight: on ? 700 : 500, padding: '7px 13px', borderRadius: 8, cursor: 'pointer',
  border: `1px solid ${on ? C.brand : C.line}`,
  background: on ? C.brand : '#fff',
  color: on ? '#fff' : C.ink,
});

export default function ReviewPage() {
  const [thread, setThread] = useState({});
  const [domain, setDomain] = useState(DOMAINS[1].key);
  const [curId, setCurId] = useState(DOMAINS[1].screens[0].id);
  const [pinMode, setPinMode] = useState(false);
  const [pins, setPins] = useState([]);
  const [viewPins, setViewPins] = useState(null);
  const [attachImgs, setAttachImgs] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [busy, setBusy] = useState('');
  const [sharing, setSharing] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [seedmsg, setSeedmsg] = useState('');

  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const cur = ALL.find((s) => s.id === curId) || ALL[0];
  const entries = thread[curId] || [];
  const curDomain = DOMAINS.find((d) => d.key === domain) || DOMAINS[0];

  const load = () =>
    fetch('/__review_thread').then((r) => r.json()).then(setThread).catch(() => setThread({}));

  useEffect(() => { load(); }, []);
  useEffect(() => {
    setPins([]); setViewPins(null); setPinMode(false); setReplyTo(null); setAttachImgs([]);
  }, [curId]);

  // ── 화면공유 ──
  const stopShare = useCallback(() => {
    const s = streamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setSharing(false);
  }, []);

  const startShare = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) return null;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 }, audio: false, preferCurrentTab: true, selfBrowserSurface: 'include',
      });
      streamRef.current = stream;
      setSharing(true);
      const v = videoRef.current;
      if (v) { v.srcObject = stream; try { await v.play(); } catch { /* noop */ } }
      const track = stream.getVideoTracks()[0];
      if (track) track.addEventListener('ended', stopShare);
      return stream;
    } catch { return null; }
  }, [stopShare]);

  useEffect(() => () => stopShare(), [stopShare]);

  /**
   * 그 화면에서 아직 답을 안 단 글 수.
   * 전에는 전체 글 수를 보여줘서 이미 처리한 화면에도 숫자가 남아 헷갈렸다. (형 지시 2026-08-12)
   */
  const countOf = (id) => {
    const items = thread[id] || [];
    const replied = new Set(items.filter((x) => x.replyTo).map((x) => x.replyTo));
    return items.filter((x) => !x.replyTo && x.by !== '카스' && !replied.has(x.pid)).length;
  };

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
    const target = describeTarget(frameRef.current, e.clientX, e.clientY);
    setPins((p) => [...p, {
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100,
      label: String(p.length + 1),
      ...(target ? { target } : {}),
    }]);
  };

  // 핀 박아 캡처 → 첨부에 추가
  const captureWithPins = async () => {
    if (busy) return;
    if (!streamRef.current) {
      const s = await startShare();
      if (!s) console.info('[review] 화면공유 거부 — html2canvas 로 캡처합니다(지도 배경은 빠질 수 있음).');
    }
    setBusy('캡처 중...');
    setPinMode(false);
    await new Promise((r) => setTimeout(r, 280));
    let dataUrl = '';
    try {
      dataUrl = await captureFrame({
        iframeEl: frameRef.current,
        videoEl: videoRef.current,
        hasStream: !!streamRef.current,
        pins,
      });
    } catch { /* noop */ }
    if (dataUrl) setAttachImgs((p) => [...p, dataUrl]);
    setBusy('');
  };

  const post = async () => {
    const t = text.trim();
    if (!t && !pins.length && !attachImgs.length) return;
    setBusy('저장 중...');
    await fetch('/__review_thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: curId, by: '형', text: t,
        pins: pins.length ? pins : undefined,
        images: attachImgs.length ? attachImgs : undefined,
        replyTo: replyTo || undefined,
      }),
    });
    setText(''); setPins([]); setAttachImgs([]); setPinMode(false); setReplyTo(null);
    setBusy('');
    load();
  };

  const del = async (pid) => {
    await fetch('/__review_thread', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: curId, pid }),
    });
    load();
  };

  // ── 채팅 시드 ──
  const makeSeed = async () => {
    if (busy) return;
    setBusy('시드 만드는 중...');
    setSeedmsg('');
    try {
      const made = await seedChatRooms(5);
      setSeedmsg(
        `대화방 ${made.length}개를 만들었습니다.\n` +
        made.map((m) => `  · ${m.with} 님 — ${m.work} (대화 ${m.messages}개)`).join('\n') +
        '\n좌측 화면에서 채팅 탭을 눌러 확인하세요.'
      );
    } catch (e) {
      setSeedmsg(`시드 실패: ${e.message}`);
    }
    setBusy('');
    if (frameRef.current) frameRef.current.src = frameRef.current.src;
  };

  const dropSeed = async () => {
    if (busy) return;
    setBusy('시드 지우는 중...');
    setSeedmsg('');
    try {
      const n = await clearSeededChats();
      setSeedmsg(`시드로 만든 대화방 ${n}개를 지웠습니다.`);
    } catch (e) {
      setSeedmsg(`삭제 실패: ${e.message}`);
    }
    setBusy('');
    if (frameRef.current) frameRef.current.src = frameRef.current.src;
  };

  const shownPins = viewPins || pins;
  const roots = entries.filter((e) => !e.replyTo);
  const repliesOf = (pid) => entries.filter((e) => e.replyTo === pid);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.ink, fontFamily: FONT, padding: '16px 20px' }}>

      {/* 화면공유 수신용 (화면에 안 보임) */}
      <video ref={videoRef} muted playsInline style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>홍여사 리뷰</h1>
        <span style={{ fontSize: 14, color: C.gray }}>
          화면 {ALL.length}개 · <b style={{ color: unanswered > 0 ? C.red : C.gray2 }}>미답변 {unanswered}</b>
        </span>
        {sharing && <span style={{ fontSize: 13, fontWeight: 700, color: '#1a7f37' }}>화면공유 중 — 지도까지 캡처됩니다</span>}
        {busy && <span style={{ fontSize: 14, color: C.brand, fontWeight: 700 }}>{busy}</span>}

        <div style={{ flex: 1 }} />
        {/* 채팅 화면을 보려면 대화방이 있어야 하는데 방은 지원하기를 눌러야 생긴다.
            지금 앱에 로그인된 계정으로 방과 대화를 만들어 넣는다. (형 요청 2026-08-12) */}
        <button style={{ ...btn(false), padding: '6px 11px' }} onClick={makeSeed} disabled={!!busy}>채팅 시드 5개</button>
        <button style={{ ...btn(false), padding: '6px 11px' }} onClick={dropSeed} disabled={!!busy}>시드 삭제</button>
      </div>

      {seedmsg && (
        <div style={{ marginBottom: 12, fontSize: 14, color: C.ink, background: 'var(--surface)', border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px', whiteSpace: 'pre-wrap' }}>
          {seedmsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* ── 좌: 실제 화면 (스크롤해도 붙어있게 고정 — 우측 기록만 흐른다) ── */}
        <div style={{ flexShrink: 0, position: 'sticky', top: 12, alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap', width: PHONE.w }}>
            <button style={btn(pinMode)} onClick={() => { setPinMode((v) => !v); setViewPins(null); }}>
              {pinMode ? '핀 찍는 중' : '핀 찍기'}
            </button>
            <button style={btn(false)} onClick={captureWithPins} disabled={!cur.path}>스샷 찍기</button>
            {pins.length > 0 && (
              <>
                <span style={{ fontSize: 14, color: C.brand, fontWeight: 700 }}>핀 {pins.length}</span>
                <button style={{ ...btn(false), padding: '6px 9px' }} onClick={() => setPins([])}>핀 지우기</button>
              </>
            )}
            {viewPins && <button style={{ ...btn(false), padding: '6px 9px' }} onClick={() => setViewPins(null)}>보기 끄기</button>}
            {sharing && <button style={{ ...btn(false), padding: '6px 9px' }} onClick={stopShare}>공유 중지</button>}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: C.gray2 }}>{PHONE.w} × {PHONE.h}</span>
          </div>

          <div style={{ position: 'relative', width: PHONE.w, height: PHONE.h, border: `1px solid ${C.line}`, borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
            {cur.path ? (
              <iframe ref={frameRef} title={cur.name} src={cur.path}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', padding: 34, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#c02020' }}>아직 화면이 없습니다</div>
                <div style={{ fontSize: 15, color: C.gray, lineHeight: 1.7 }}>
                  아직 만들지 않은 화면입니다.
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
              <div key={i} title={p.target ? `${p.target.tag} ${p.target.text}` : ''} style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)',
                width: 26, height: 26, borderRadius: 13, background: C.brand, color: '#fff',
                fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff', boxShadow: '0 1px 5px rgba(0,0,0,.35)', pointerEvents: 'none',
              }}>{p.label || i + 1}</div>
            ))}
          </div>

          {/* 첨부 예정 스샷 */}
          {attachImgs.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', width: PHONE.w }}>
              {attachImgs.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt="" onClick={() => setZoom(src)}
                    style={{ width: 84, height: 168, objectFit: 'cover', objectPosition: 'top', borderRadius: 8, border: `1px solid ${C.line}`, cursor: 'zoom-in' }} />
                  <button onClick={() => setAttachImgs((p) => p.filter((_, k) => k !== i))}
                    style={{
                      position: 'absolute', top: -7, right: -7, width: 22, height: 22, borderRadius: 11,
                      border: '1px solid #fff', background: '#131313', color: '#fff', fontSize: 13, cursor: 'pointer', lineHeight: 1,
                    }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 우 ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DOMAINS.map((d) => {
              const on = d.key === domain;
              const n = d.screens.reduce((a, s) => a + countOf(s.id), 0);
              return (
                <button key={d.key} style={btn(on)}
                  onClick={() => { setDomain(d.key); setCurId(d.screens[0].id); }}>
                  {d.label}
                  {n > 0 && (
                    <span style={{
                      marginLeft: 6, fontSize: 12, fontWeight: 700,
                      minWidth: 18, height: 18, lineHeight: '18px', borderRadius: 9,
                      padding: '0 5px', textAlign: 'center', display: 'inline-block',
                      background: C.red, color: '#fff',
                    }}>{n}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {curDomain.screens.map((s) => {
              const on = s.id === curId;
              const n = countOf(s.id);
              return (
                <button key={s.id} onClick={() => setCurId(s.id)} style={{ ...btn(on), display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, opacity: .6 }}>{s.no}</span>
                  {s.name}
                  <span style={{ fontSize: 13, fontWeight: 700, color: on ? 'rgba(255,255,255,.9)' : STATUS_COLOR[s.status] }}>
                    {STATUS_LABEL[s.status]}
                  </span>
                  {n > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, minWidth: 18, height: 18, lineHeight: '18px',
                      borderRadius: 9, padding: '0 5px', textAlign: 'center',
                      background: C.red, color: '#fff',
                      border: on ? '1px solid #fff' : 'none',
                    }}>{n}</span>
                  )}
                </button>
              );
            })}
          </div>

          {cur.board === 'fcm' ? <FcmTestBoard /> : (
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, minHeight: 240 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{cur.no} {cur.name}</div>
              {cur.path
                ? <a href={cur.path} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: C.blue }}>{cur.path}</a>
                : <span style={{ fontSize: 14, color: '#c02020', fontWeight: 600 }}>화면 없음</span>}
            </div>

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

                {e.imgs?.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {e.imgs.map((src, i) => (
                      <img key={i} src={src} alt="" onClick={() => setZoom(src)}
                        style={{ width: 96, height: 190, objectFit: 'cover', objectPosition: 'top', borderRadius: 8, border: `1px solid ${C.line}`, cursor: 'zoom-in' }} />
                    ))}
                  </div>
                )}

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
              {(pins.length > 0 || attachImgs.length > 0 || replyTo) && (
                <div style={{ fontSize: 14, color: C.brand, fontWeight: 600, marginBottom: 6 }}>
                  {[replyTo ? '답글로 달림' : '', pins.length ? `핀 ${pins.length}개` : '', attachImgs.length ? `스샷 ${attachImgs.length}장` : '']
                    .filter(Boolean).join(' · ')} 함께 저장
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
          )}
        </div>
      </div>

      {/* 이미지 확대 */}
      {zoom && (
        <div onClick={() => setZoom(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 30,
        }}>
          <img src={zoom} alt="" style={{ maxWidth: '92vw', maxHeight: '92vh', borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
}
