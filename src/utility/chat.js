/**
 * 채팅 문서 읽기 도우미 (형 리뷰 2026-08-12)
 *
 * 실제 Firestore 에 쌓인 CHAT 문서(176건)와 코드가 서로 다른 필드명을 쓰고 있었다.
 *   · 일감 정보  : DB=INFO        / 코드=WORK_INFO
 *   · 메시지 시각: DB=CREATEDT    / 코드=CREATEDAT
 *
 * 특히 대화방이 orderBy("CREATEDAT") 로 메시지를 읽고 있어서, CREATEDAT 가 없는
 * 기존 메시지는 쿼리 결과에서 통째로 빠졌다(= 방을 열어도 대화가 하나도 안 보였다).
 * 여기서 양쪽을 모두 받아주고, 새로 쓰는 값은 DB 쪽(INFO · CREATEDT)에 맞춘다.
 */

/** 방 문서에서 일감 정보를 꺼낸다 */
export const workOf = (room) => (room && (room.INFO || room.WORK_INFO)) || {};

/** 메시지의 작성 시각 */
export const msgTimeOf = (msg) => (msg && (msg.CREATEDT ?? msg.CREATEDAT)) || 0;

/** 방에서 내 상대의 users_id */
export const otherIdOf = (room, USERS_ID) =>
  (room && (room.OWNER_ID === USERS_ID ? room.SUPPORTER_ID : room.OWNER_ID)) || null;

/** 내가 이 방의 일감 주인인가 */
export const isOwnerOf = (room, USERS_ID) => !!room && room.OWNER_ID === USERS_ID;
