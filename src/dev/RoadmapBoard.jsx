import React, { useEffect, useMemo, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../api/config';
import { ROADMAP_ITEMS, ROADMAP_START, ROADMAP_END, OPEN_DATE } from './roadmapData';

/**
 * 9월 마스터 플랜 — 캘린더 (리뷰 페이지 '마스터 플랜' 탭, 형 지시 2026-08-23)
 *   · 8/23(일) ~ 10/3(토) 주 단위 달력. 9/30 = 정식 오픈.
 *   · 형이 날짜 칸에서 바로 항목을 넣는다 — 당일 항목이든 기간(시작~끝) 항목이든. (형 지시: "남은 일을 정리")
 *   · 항목 클릭 = 대기 → 진행 → 완료. × = 삭제(한 번 더 눌러 확정). 전부 Firestore reviewMeta/roadmap 에 저장.
 *   · roadmapData.js 의 계획은 문서가 비어 있을 때 한 번만 시드로 깔린다 — 그 뒤로는 화면에서 고친 게 진실.
 */
const C = { ink: '#131313', line: '#e3e3e3', soft: '#f4f5f7', brand: '#FF4E19', blue: '#2563eb', green: '#1a7f4b', muted: '#8a8f98' };
const STATUS = ['대기', '진행', '완료'];
const STATUS_COLOR = { 대기: C.muted, 진행: C.brand, 완료: C.green };
const OWNERS = ['형', '카스', '같이', '외부'];
const OWNER_COLOR = { 형: '#1b1f27', 카스: C.blue, 같이: '#1f6f6b', 외부: '#7a5a14' };
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const toISO = (d) => new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);   // KST 날짜
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00+09:00'); d.setDate(d.getDate() + n); return toISO(d); };
const todayISO = () => toISO(new Date());
const md = (iso) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
const newId = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const inputStyle = { width: '100%', boxSizing: 'border-box', height: 34, padding: '0 8px', border: `1px solid ${C.line}`, fontSize: 14, fontFamily: 'inherit', color: C.ink, background: '#fff' };
const btn = (primary) => ({ height: 32, padding: '0 10px', border: `1px solid ${primary ? C.ink : C.line}`, background: primary ? C.ink : '#fff', color: primary ? '#fff' : C.ink, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' });

/* 칸 안의 추가 폼 — 제목 · 담당 · 끝나는 날(비우면 당일) · 마일스톤 */
function AddForm({ date, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('형');
  const [end, setEnd] = useState('');
  const [milestone, setMilestone] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const save = () => {
    const t = title.trim(); if (!t) return;
    onSave({ id: newId(), date, end: end && end > date ? end : '', title: t, owner, kind: milestone ? 'milestone' : 'task', note: '' });
  };
  return (
    <div style={{ border: `1px solid ${C.ink}`, padding: 8, background: '#fff', marginTop: 4 }} onClick={(e) => e.stopPropagation()}>
      <input ref={ref} style={inputStyle} placeholder="할 일" value={title} onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === 'Enter') save(); if (e.key === 'Escape') onCancel(); }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        <select style={{ ...inputStyle, width: 'auto', flex: '0 0 auto', padding: '0 6px' }} value={owner} onChange={(e) => setOwner(e.target.value)}>
          {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <input type="date" style={{ ...inputStyle, flex: 1 }} value={end} min={date} onChange={(e) => setEnd(e.target.value)} title="끝나는 날 — 비우면 당일" />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, marginTop: 6, cursor: 'pointer' }}>
        <input type="checkbox" checked={milestone} onChange={(e) => setMilestone(e.target.checked)} /> 마일스톤
      </label>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <button style={btn(true)} onClick={save}>저장</button>
        <button style={btn(false)} onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

export default function RoadmapBoard() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(null);        // 추가 폼이 열린 날짜
  const [confirmDel, setConfirmDel] = useState(null); // 삭제 확정 대기 중인 id
  const ref = useMemo(() => doc(db, 'reviewMeta', 'roadmap'), []);

  useEffect(() => {
    getDoc(ref).then(async (s) => {
      const d = s.exists() ? s.data() : {};
      // 시드는 문서가 아예 없을 때 한 번만 — 형이 전부 지운 빈 상태도 그대로 둔다 (형 2026-08-23 "모두 제거, 하나씩 불러줄게")
      if (s.exists() && d.seededAt) { setItems(Array.isArray(d.items) ? d.items : []); setStatus(d.status || {}); }
      else {
        // 처음 한 번 — 카스가 짠 계획을 시드로 깔고 그 뒤로는 문서가 진실
        const seed = ROADMAP_ITEMS.map((it) => ({ ...it, end: it.end || '' }));
        setItems(seed); setStatus(d.status || {});
        await setDoc(ref, { items: seed, status: d.status || {}, seededAt: Date.now() }, { merge: true });
      }
    }).finally(() => setLoaded(true));
  }, [ref]);

  const persist = async (nextItems, nextStatus) => {
    await setDoc(ref, { items: nextItems, status: nextStatus, updatedAt: Date.now() }, { merge: true });
  };
  const cycle = (id) => {
    const cur = status[id] || '대기';
    const nextStatus = { ...status, [id]: STATUS[(STATUS.indexOf(cur) + 1) % STATUS.length] };
    setStatus(nextStatus); persist(items, nextStatus);
  };
  const add = (it) => { const next = [...items, it]; setItems(next); setAdding(null); persist(next, status); };
  const remove = (id) => {
    const next = items.filter((x) => x.id !== id); const ns = { ...status }; delete ns[id];
    setItems(next); setStatus(ns); setConfirmDel(null); persist(next, ns);
  };

  const weeks = useMemo(() => {
    const out = []; let d = ROADMAP_START;
    while (d <= ROADMAP_END) { const w = []; for (let i = 0; i < 7; i++) { w.push(d); d = addDays(d, 1); } out.push(w); }
    return out;
  }, []);
  // 주마다 막대(레인) 배치 — 기간 항목은 그 주 안에서 가로로 이어지는 한 개의 막대. 같은 줄에 겹치지 않게 레인을 나눈다
  const laneOf = (week) => {
    const ws = week[0], we = week[6];
    const rows = items
      .map((it) => ({ it, s: it.date, e: it.end && it.end > it.date ? it.end : it.date }))
      .filter(({ s, e }) => s <= we && e >= ws)
      .sort((a, b) => a.s.localeCompare(b.s) || b.e.localeCompare(a.e));
    const lanes = [];   // lanes[i] = 그 레인이 차 있는 마지막 날짜
    return rows.map((r) => {
      const from = r.s < ws ? 0 : week.indexOf(r.s);
      const to = r.e > we ? 6 : week.indexOf(r.e);
      let lane = lanes.findIndex((last) => last < r.s);
      if (lane < 0) { lane = lanes.length; lanes.push(r.e); } else lanes[lane] = r.e;
      return { ...r, from, to, lane, cont: r.s < ws, more: r.e > we };
    });
  };
  const today = todayISO();
  const done = items.filter((it) => status[it.id] === '완료').length;
  const doing = items.filter((it) => status[it.id] === '진행').length;
  const daysLeft = Math.round((new Date(OPEN_DATE + 'T00:00:00+09:00') - new Date(today + 'T00:00:00+09:00')) / 86400000);

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, color: C.ink }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ fontSize: 19, fontWeight: 800 }}>9월 마스터 플랜</div>
        <div style={{ fontSize: 15 }}>정식 오픈 <b>{OPEN_DATE.replace(/-/g, '.')}</b> · D-{daysLeft}</div>
        <div style={{ fontSize: 15, marginLeft: 'auto' }}>
          전체 {items.length} · <span style={{ color: C.brand, fontWeight: 700 }}>진행 {doing}</span> · <span style={{ color: C.green, fontWeight: 700 }}>완료 {done}</span>
          {!loaded && <span style={{ color: C.muted }}> · 불러오는 중</span>}
        </div>
      </div>
      <div style={{ fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
        날짜 칸의 <b>+ 추가</b>로 할 일을 넣어요 (끝나는 날을 주면 기간 막대). 막대를 누르면 대기(테두리만) → 진행(채움) → 완료(회색 취소선), × 는 삭제. 바로 저장돼요.
        막대 색 = 담당: <b style={{ color: OWNER_COLOR.형 }}>형</b> · <b style={{ color: OWNER_COLOR.카스 }}>카스</b> · <b style={{ color: OWNER_COLOR.같이 }}>같이</b> · <b style={{ color: OWNER_COLOR.외부 }}>외부</b>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: `1px solid ${C.line}`, borderBottom: 'none' }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ padding: '8px 10px', fontSize: 14, fontWeight: 700, background: C.soft, borderBottom: `1px solid ${C.line}`, borderRight: i < 6 ? `1px solid ${C.line}` : 'none', color: i === 0 ? '#c02020' : i === 6 ? C.blue : C.ink }}>{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => {
        return (
          <div key={wi}>
            {(() => {
              const bars = laneOf(week);
              const laneCount = bars.reduce((m, b) => Math.max(m, b.lane + 1), 0);
              const HEAD = 34, BAR = 46, FOOT = 30;   // 날짜 줄 · 막대 한 줄(두 줄 글) · 아래 + 추가 줄
              const cellH = HEAD + laneCount * BAR + FOOT + 8;
              return (
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: `1px solid ${C.line}`, borderBottom: wi === weeks.length - 1 ? `1px solid ${C.line}` : 'none' }}>
                  {week.map((iso, di) => {
                    const isOpen = iso === OPEN_DATE; const isToday = iso === today;
                    return (
                      <div key={iso} style={{ minHeight: cellH, padding: '8px 8px 6px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                        borderRight: di < 6 ? `1px solid ${C.line}` : 'none', background: isOpen ? '#FFF3EC' : isToday ? '#F7F9FC' : '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, height: HEAD - 8 }}>
                          <span style={{ fontSize: 15, fontWeight: isToday || isOpen ? 800 : 600, color: di === 0 ? '#c02020' : di === 6 ? C.blue : C.ink }}>{Number(iso.slice(8, 10))}</span>
                          {iso.slice(8, 10) === '01' && <span style={{ fontSize: 13, fontWeight: 700 }}>{Number(iso.slice(5, 7))}월</span>}
                          {isToday && <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>오늘</span>}
                          {isOpen && <span style={{ fontSize: 13, fontWeight: 800, color: C.brand }}>오픈</span>}
                        </div>
                        <div style={{ flex: 1 }} />
                        {adding === iso
                          ? <AddForm date={iso} onSave={add} onCancel={() => setAdding(null)} />
                          : <button onClick={() => { setAdding(iso); setConfirmDel(null); }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: '4px 0', fontSize: 13, fontWeight: 700, color: C.muted, cursor: 'pointer', fontFamily: 'inherit' }}>+ 추가</button>}
                      </div>
                    );
                  })}
                  {/* 막대 — 칸 위에 겹쳐 그린다. 왼쪽/폭은 요일 칸 비율, 위는 레인 */}
                  {bars.map((b) => {
                    const st = status[b.it.id] || '대기';
                    const col = b.it.kind === 'milestone' ? C.brand : (OWNER_COLOR[b.it.owner] || C.ink);
                    // 색 = 담당. 대기는 연하게 채우고, 진행은 진하게, 완료는 회색 (형 2026-08-23 "색깔 넣고")
                    const bg = st === '완료' ? '#E9E9EC' : st === '진행' ? col : col + '2B';
                    const fg = st === '완료' ? '#8a8f98' : st === '진행' ? '#fff' : C.ink;
                    const isDel = confirmDel === b.it.id;
                    return (
                      <div key={b.it.id + wi} onClick={() => cycle(b.it.id)} title={`${b.it.owner} · ${st}${b.it.end ? ` · ${md(b.it.date)}~${md(b.it.end)}` : ''}`} style={{
                        position: 'absolute', left: `calc(${b.from} * 100% / 7 + ${b.cont ? 0 : 6}px)`, width: `calc(${b.to - b.from + 1} * 100% / 7 - ${(b.cont ? 0 : 6) + (b.more ? 0 : 6)}px)`,
                        top: HEAD + b.lane * BAR, height: BAR - 6, boxSizing: 'border-box',
                        background: bg, border: `${b.it.kind === 'milestone' ? 2 : 1}px solid ${st === '완료' ? '#d9d9de' : col}`, color: fg,
                        borderTopLeftRadius: b.cont ? 0 : 4, borderBottomLeftRadius: b.cont ? 0 : 4, borderTopRightRadius: b.more ? 0 : 4, borderBottomRightRadius: b.more ? 0 : 4,
                        padding: '0 24px 0 8px', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700, lineHeight: 1.3, cursor: 'pointer',
                        textDecoration: st === '완료' ? 'line-through' : 'none', overflow: 'hidden',
                      }}>
                        {/* 요약은 두 줄까지 — 하루짜리 칸에서도 읽히게 */}
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'keep-all' }}>{b.it.title}</span>
                        {!b.cont && (
                          <span onClick={(e) => { e.stopPropagation(); isDel ? remove(b.it.id) : setConfirmDel(b.it.id); }}
                            style={{ position: 'absolute', right: 6, top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: isDel ? '#c02020' : fg, fontSize: isDel ? 12 : 15, background: isDel ? '#fff' : 'transparent', padding: isDel ? '0 4px' : 0 }}>
                            {isDel ? '삭제' : '×'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}
