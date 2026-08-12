// 알림 생성 — notifications 컬렉션에 문서 하나 넣으면 functions 가 받아 발송한다.
// (functions/fcm.js onNotificationCreate)
//
// 알림은 CORE.md 의 ①~④ 흐름에서만 발생한다.
// 일 올림 -> 홍여사 지원 -> 픽 -> 연결(채팅) -> 결제

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../api/config';

export const NOTI_TYPE = {
  APPLY: 'apply',        // ② 내 일감에 홍여사가 지원함        -> 구인자에게
  PICKED: 'picked',      // ③ 내가 픽됨                        -> 홍여사에게
  CHAT: 'chat',          // ④ 새 메시지                        -> 상대에게
  PAY: 'pay',            // ④ 결제/정산                        -> 양쪽
  NEARBY: 'nearby',      // ① 내 주변에 새 일감                -> 홍여사에게
  NOTICE: 'notice',      // 공지
};

/**
 * 알림 한 건 생성.
 * targetUids 는 반드시 USERS 문서의 USERS_ID 를 넣는다 (Auth UID 아님).
 */
export const createNotification = async ({ type, title, body, link, targetUids }) => {
  const uids = (Array.isArray(targetUids) ? targetUids : [targetUids]).filter(Boolean);
  if (!uids.length) return null;

  return addDoc(collection(db, 'notifications'), {
    type: type || NOTI_TYPE.NOTICE,
    title: title || '구해줘 홍여사',
    body: body || '',
    link: link || '/Mobilemain',
    targetUids: uids,
    sent: false,
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
  });
};

/* ── 코어 흐름에서 부르는 것들 ────────────────────────── */

/** ② 홍여사가 내 일감에 지원했을 때 -> 일 맡긴 사람에게 */
export const notifyApplied = ({ ownerId, workType, supporterName }) =>
  createNotification({
    type: NOTI_TYPE.APPLY,
    title: '새로운 지원이 있어요',
    body: `${supporterName || '홍여사'}님이 「${workType}」에 지원했어요`,
    link: '/Mobilechat',
    targetUids: [ownerId],
  });

/** ③ 지원자가 선택됐을 때 -> 홍여사에게 */
export const notifyPicked = ({ supporterId, workType }) =>
  createNotification({
    type: NOTI_TYPE.PICKED,
    title: '일감에 선택되었어요',
    body: `「${workType}」 일감에 선택되었어요. 대화방에서 일정을 정해보세요`,
    link: '/Mobilechat',
    targetUids: [supporterId],
  });

/** ④ 새 채팅 메시지 -> 상대에게 */
export const notifyChat = ({ targetId, senderName, text }) =>
  createNotification({
    type: NOTI_TYPE.CHAT,
    title: senderName || '새 메시지',
    body: (text || '').slice(0, 60),
    link: '/Mobilechat',
    targetUids: [targetId],
  });

/* ── 리뷰 > FCM 테스트에서 쓰는 케이스 목록 ───────────── */
export const PUSH_CASES = [
  {
    type: NOTI_TYPE.APPLY, label: '② 지원 알림 (구인자에게)',
    title: '새로운 지원이 있어요',
    body: '김영희님이 「집 청소」에 지원했어요',
    link: '/Mobilechat',
  },
  {
    type: NOTI_TYPE.PICKED, label: '③ 선택 알림 (홍여사에게)',
    title: '일감에 선택되었어요',
    body: '「집 청소」 일감에 선택되었어요. 대화방에서 일정을 정해보세요',
    link: '/Mobilechat',
  },
  {
    type: NOTI_TYPE.CHAT, label: '④ 새 메시지',
    title: '김영희',
    body: '네 아직 구하고 있어요. 언제 가능하실까요?',
    link: '/Mobilechat',
  },
  {
    type: NOTI_TYPE.PAY, label: '④ 결제 완료',
    title: '결제가 완료되었어요',
    body: '「집 청소」 150,000원 결제가 완료되었어요',
    link: '/Mobileconfig',
  },
  {
    type: NOTI_TYPE.NEARBY, label: '① 내 주변 새 일감',
    title: '가까운 곳에 새 일감이 있어요',
    body: '다산동에 「식사 준비」 일감이 올라왔어요 · 60,000원',
    link: '/Mobilemain',
  },
  {
    type: NOTI_TYPE.NOTICE, label: '공지',
    title: '홍여사 공지',
    body: '서비스 이용 안내가 업데이트되었어요',
    link: '/Mobileconfig',
  },
];
