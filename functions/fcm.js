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

/**
 * 알림음 (형 지시 2026-08-22, 도우미 앱과 같은 방식)
 *   사용자가 내 정보 > 알림음 설정에서 고른 값이 USERS.notisound 에 있다 (src/utility/notiSound.js 와 같은 키).
 *   안드로이드 8+ 는 소리가 알림이 아니라 "채널"에 묶이므로, 앱(HongLady)이 음원마다 채널 `sound_<key>` 를
 *   미리 만들어 두고 여기서는 그 채널 id 를 지정해 보낸다. iOS 는 번들에 실린 `<key>.caf` 를 지정한다.
 *   앱에 아직 그 채널·음원이 없으면 기기 기본음으로 울린다(조용히 사라지는 것보단 낫다).
 */
const NOTI_SOUNDS = ['honglady', 'bell', 'chime', 'soft', 'system'];
const DEFAULT_NOTI_SOUND = 'honglady';

/** uid -> 알림음 키 */
async function soundForUid(uid) {
  try {
    const q = await db().collection('USERS').where('USERS_ID', '==', uid).limit(1).get();
    const v = q.empty ? null : q.docs[0].data().notisound;
    return NOTI_SOUNDS.includes(v) ? v : DEFAULT_NOTI_SOUND;
  } catch (e) {
    return DEFAULT_NOTI_SOUND;
  }
}

/** 대상 uid 들의 토큰을 모은다 (사람마다 고른 알림음도 같이) */
async function tokensForUids(uids) {
  const out = [];
  for (const uid of uids) {
    const [q, sound] = await Promise.all([
      db().collection('fcmTokens').where('uid', '==', uid).get(),
      soundForUid(uid),
    ]);
    q.forEach((d) => {
      const t = d.data().token;
      if (t) out.push({ ref: d.ref, token: t, sound });
    });
  }
  // 같은 토큰이 여러 문서에 있으면 한 번만
  const seen = new Set();
  return out.filter((t) => (seen.has(t.token) ? false : seen.add(t.token)));
}

/** 실제 발송 + 죽은 토큰 정리 — 알림음이 다른 사람끼리는 따로 묶어 보낸다 */
async function pushToTokens({ toks, title, body, data }) {
  if (!toks.length) return { successCount: 0, failureCount: 0 };

  const groups = new Map();
  toks.forEach((t) => {
    const k = t.sound || DEFAULT_NOTI_SOUND;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(t);
  });

  let successCount = 0;
  let failureCount = 0;
  for (const [sound, group] of groups) {
    const r = await pushGroup({ toks: group, sound, title, body, data });
    successCount += r.successCount;
    failureCount += r.failureCount;
  }
  return { successCount, failureCount };
}

async function pushGroup({ toks, sound, title, body, data }) {
  // 보이스톡은 "지금 받아야" 의미가 있다. 잠금화면에서도 즉시 뜨도록 최고 우선순위로 보낸다.
  const isCall = (data && data.type) === 'voicecall';
  const isSystem = sound === 'system';

  const resp = await admin.messaging().sendEachForMulticast({
    tokens: toks.map((t) => t.token),
    notification: { title: title || '구해줘 홍여사', body: body || '' },
    data: Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [k, String(v ?? '')])),
    android: {
      priority: 'high',
      ttl: isCall ? 45 * 1000 : undefined,   // 통화는 45초 안에 못 받으면 의미가 없다
      notification: {
        sound: isSystem ? 'default' : sound,
        // 앱이 만들어 둔 음원별 채널. 통화는 예전처럼 voicecall 채널 (앱에 있으면) 로.
        channelId: isCall ? 'voicecall' : `sound_${sound}`,
        ...(isCall ? { priority: 'max', visibility: 'public' } : {}),
      },
    },
    apns: {
      headers: isCall ? { 'apns-priority': '10', 'apns-expiration': String(Math.floor(Date.now() / 1000) + 45) } : undefined,
      payload: { aps: { sound: isSystem ? 'default' : `${sound}.caf`, ...(isCall ? { 'interruption-level': 'time-sensitive' } : {}) } },
    },
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
