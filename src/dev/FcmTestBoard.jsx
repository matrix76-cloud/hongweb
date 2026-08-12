import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../api/config";
import { UserContext } from "../context/User";
import { registerWebPushToken, requestNotiPermission, VAPID_KEY } from "../service/fcmService";
import { createNotification, PUSH_CASES } from "../service/notiService";

/**
 * 개발 전용 — 푸시 알림 발송 테스트 (형 지시 2026-08-12)
 * 케이스별 버튼을 눌러 실제로 알림이 오는지 확인한다. 리뷰 글은 남기지 않는다.
 *
 * 확인 순서
 *   ① 알림 허용 -> ② 토큰 등록 -> ③ 케이스 버튼
 *   화면을 보고 있으면 상단 인앱 배너, 탭을 내리거나 다른 탭이면 OS 알림.
 */

const C = { ink: '#131313', gray: '#71717a', line: '#e3e3e3', brand: '#FF4E19', ok: '#1a7f37', bad: '#c02020' };

const box = { background: 'var(--surface)', border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, marginBottom: 12 };
const btn = (kind = 'normal') => ({
  fontSize: 15, fontWeight: 700, padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
  border: kind === 'primary' ? 'none' : `1px solid ${C.line}`,
  background: kind === 'primary' ? C.brand : 'var(--surface)',
  color: kind === 'primary' ? '#fff' : C.ink,
});

export default function FcmTestBoard() {
  const { user } = useContext(UserContext);
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');
  const [token, setToken] = useState(null);
  const [tokenRows, setTokenRows] = useState([]);
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState('');

  const USERS_ID = user?.users_id || '';

  const say = (msg, kind = 'info') =>
    setLog((l) => [{ msg, kind, at: new Date().toLocaleTimeString('ko-KR') }, ...l].slice(0, 12));

  const loadTokens = async () => {
    if (!USERS_ID) return;
    const q = await getDocs(query(collection(db, 'fcmTokens'), where('uid', '==', USERS_ID)));
    setTokenRows(q.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadTokens(); }, [USERS_ID]);

  const askPermission = async () => {
    const p = await requestNotiPermission();
    setPerm(p);
    say(p === 'granted' ? '알림 권한 허용됨' : `알림 권한: ${p}`, p === 'granted' ? 'ok' : 'bad');
  };

  const register = async () => {
    setBusy('토큰 등록 중');
    const t = await registerWebPushToken({ USERS_ID });
    setBusy('');
    if (t) { setToken(t); say('토큰 등록 완료', 'ok'); loadTokens(); }
    else say('토큰 등록 실패 — 권한/VAPID 키를 확인하세요', 'bad');
  };

  const fire = async (c) => {
    if (!USERS_ID) { say('로그인 정보(users_id)가 없습니다', 'bad'); return; }
    setBusy(`${c.label} 발송 중`);
    try {
      await createNotification({
        type: c.type,
        title: c.title,
        body: c.body,
        link: c.link,
        targetUids: [USERS_ID],
      });
      say(`${c.label} — notifications 문서 생성됨 (곧 도착)`, 'ok');
    } catch (e) {
      say(`${c.label} 실패: ${e.message}`, 'bad');
    }
    setBusy('');
  };

  // 실제 발송 없이 배너 모양만 확인.
  // 왼쪽 미리보기(iframe) 안의 앱에도 같이 전달한다 — 거기서 실제 모양을 봐야 한다.
  const preview = (c) => {
    const detail = { title: c.title, body: c.body, link: c.link, type: c.type };
    window.dispatchEvent(new CustomEvent('push:preview', { detail }));
    document.querySelectorAll('iframe').forEach((f) => {
      try {
        f.contentWindow?.dispatchEvent(new f.contentWindow.CustomEvent('push:preview', { detail }));
      } catch { /* 다른 origin 이면 무시 */ }
    });
  };

  return (
    <div style={{ padding: '4px 2px' }}>
      <div style={box}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>준비 상태</div>
        <Row label="알림 권한" value={perm} good={perm === 'granted'} />
        <Row label="VAPID 키" value={VAPID_KEY ? '설정됨' : '없음 (.env VITE_FCM_VAPID_KEY)'} good={!!VAPID_KEY} />
        <Row label="내 users_id" value={USERS_ID || '없음'} good={!!USERS_ID} />
        <Row label="등록된 토큰" value={`${tokenRows.length}개`} good={tokenRows.length > 0} />
        {token && <div style={{ fontSize: 12, color: C.gray, wordBreak: 'break-all', marginTop: 8 }}>{token.slice(0, 60)}…</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button style={btn()} onClick={askPermission}>① 알림 허용</button>
          <button style={btn('primary')} onClick={register} disabled={!!busy}>② 토큰 등록</button>
          <button style={btn()} onClick={loadTokens}>토큰 새로고침</button>
        </div>
      </div>

      <div style={box}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>③ 케이스별 발송</div>
        <div style={{ fontSize: 14, color: C.gray, marginBottom: 12, lineHeight: 1.6 }}>
          화면을 보고 있으면 상단 배너로, 탭을 내리거나 다른 탭이면 OS 알림으로 옵니다.<br />
          [미리보기]는 발송 없이 배너 모양만 확인합니다.
        </div>
        {PUSH_CASES.map((c) => (
          <div key={c.type} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
            borderTop: `1px solid #f2f2f2`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontSize: 13, color: C.gray, marginTop: 2 }}>{c.title} · {c.body}</div>
            </div>
            <button style={{ ...btn(), padding: '8px 12px', fontSize: 14 }} onClick={() => preview(c)}>미리보기</button>
            <button style={{ ...btn('primary'), padding: '8px 14px', fontSize: 14 }} onClick={() => fire(c)} disabled={!!busy}>발송</button>
          </div>
        ))}
      </div>

      <div style={box}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>기록 {busy && <span style={{ fontSize: 14, color: C.brand }}>· {busy}</span>}</div>
        {log.length === 0 && <div style={{ fontSize: 14, color: C.gray }}>아직 없음</div>}
        {log.map((l, i) => (
          <div key={i} style={{ fontSize: 14, padding: '5px 0', color: l.kind === 'bad' ? C.bad : l.kind === 'ok' ? C.ok : C.ink }}>
            <span style={{ color: C.gray, marginRight: 8 }}>{l.at}</span>{l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

const Row = ({ label, value, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 15 }}>
    <span style={{ color: C.gray }}>{label}</span>
    <b style={{ color: good ? C.ok : C.bad }}>{value}</b>
  </div>
);
