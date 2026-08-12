/**
 * 푸시 알림 (FCM) — seekone 구조를 홍여사에 맞춰 이식 (2026-08-12)
 *
 * 흐름
 *   앱/서버가 notifications 컬렉션에 문서 하나 생성
 *     -> onNotificationCreate 트리거가 대상들의 토큰을 모아 발송
 *     -> 결과를 문서에 기록, 죽은 토큰은 정리
 *
 * 컬렉션
 *   notifications  { type, title, body, targetUids[], link, sent, sentAt, sendResult }
 *   fcmTokens      { uid, token, platform, updatedAt }   문서 id = `${uid}_${platform}`
 *
 * ※ 토큰은 반드시 "USERS 문서의 USERS_ID" 로 저장해야 한다.
 *    Firebase Auth UID 와 다를 수 있어(소셜 로그인) 섞이면 알림이 안 간다.
 */
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

const REGION = 'asia-northeast3';
const db = () => admin.firestore();

/** 대상 uid 들의 토큰을 모은다 */
async function tokensForUids(uids) {
  const out = [];
  for (const uid of uids) {
    const q = await db().collection('fcmTokens').where('uid', '==', uid).get();
    q.forEach((d) => {
      const t = d.data().token;
      if (t) out.push({ ref: d.ref, token: t });
    });
  }
  // 같은 토큰이 여러 문서에 있으면 한 번만
  const seen = new Set();
  return out.filter((t) => (seen.has(t.token) ? false : seen.add(t.token)));
}

/** 실제 발송 + 죽은 토큰 정리 */
async function pushToTokens({ toks, title, body, data }) {
  if (!toks.length) return { successCount: 0, failureCount: 0 };

  const resp = await admin.messaging().sendEachForMulticast({
    tokens: toks.map((t) => t.token),
    notification: { title: title || '구해줘 홍여사', body: body || '' },
    data: Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [k, String(v ?? '')])),
    android: { priority: 'high', notification: { sound: 'default' } },
    apns: { payload: { aps: { sound: 'default' } } },
    webpush: {
      headers: { Urgency: 'high' },
      notification: { icon: '/logo.png', badge: '/logo.png' },
      fcmOptions: { link: (data && data.link) || '/Mobilemain' },
    },
  });

  // 앱 삭제·재설치 등으로 죽은 토큰은 지운다 (남겨두면 실패가 계속 쌓인다)
  const dead = [];
  resp.responses.forEach((r, i) => {
    if (r.success) return;
    const code = (r.error && r.error.code) || '';
    if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
      dead.push(toks[i].ref);
    }
  });
  await Promise.all(dead.map((d) => d.delete().catch(() => {})));
  if (dead.length) logger.info('무효 토큰 정리', { count: dead.length });

  return { successCount: resp.successCount, failureCount: resp.failureCount };
}

/** ① notifications 문서 생성 -> 발송 */
exports.onNotificationCreate = onDocumentCreated(
  { document: 'notifications/{id}', region: REGION },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const n = snap.data();
    if (n.sent || n.canceled) return;

    const targets = Array.isArray(n.targetUids) ? n.targetUids.filter(Boolean) : [];
    if (!targets.length) {
      await snap.ref.update({ sent: true, sendResult: { reason: 'no-targets' } });
      return;
    }

    const toks = await tokensForUids(targets);
    const { successCount, failureCount } = await pushToTokens({
      toks,
      title: n.title,
      body: n.body,
      data: { type: n.type || '', link: n.link || '/Mobilemain', notiId: event.params.id },
    });

    await snap.ref.update({
      sent: true,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sendResult: { targets: targets.length, tokens: toks.length, successCount, failureCount },
    });

    logger.info('알림 발송', { type: n.type, targets: targets.length, tokens: toks.length, successCount, failureCount });
  },
);

/** ② 즉시 발송 테스트 — 스케줄 기다리지 않고 바로 확인용
 *    POST { uid, title, body }
 */
exports.sendTestPush = onRequest({ cors: true, region: REGION }, async (req, res) => {
  try {
    const { uid, title, body } = req.body || {};
    if (!uid) {
      res.status(400).json({ ok: false, error: 'uid 가 필요합니다' });
      return;
    }
    const toks = await tokensForUids([uid]);
    if (!toks.length) {
      res.json({ ok: false, error: '등록된 토큰이 없습니다', uid });
      return;
    }
    const result = await pushToTokens({
      toks,
      title: title || '구해줘 홍여사',
      body: body || '테스트 알림입니다',
      data: { type: 'test', link: '/Mobilemain' },
    });
    res.json({ ok: true, tokens: toks.length, ...result });
  } catch (e) {
    logger.error('sendTestPush 실패', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/** ③ 오래된 알림 정리 — 30일 지난 문서 삭제 */
exports.notificationCleanup = onSchedule(
  { schedule: 'every day 04:00', timeZone: 'Asia/Seoul', region: REGION },
  async () => {
    const cut = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const q = await db().collection('notifications').where('createdAt', '<', cut).limit(400).get();
    if (q.empty) return;
    const batch = db().batch();
    q.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    logger.info('오래된 알림 정리', { count: q.size });
  },
);
