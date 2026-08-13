import localforage from "localforage";

/**
 * 둘러보기(비로그인 체험) — 형 리뷰 2026-08-13.
 *
 * 동네에 일감이 있는지 보고 가입을 정하는 서비스라, 보는 것까지는 로그인 없이 연다.
 * 대신 무언가 "하려는" 순간(등록·지원·채팅)에는 로그인을 받는다.
 *
 * 로그인한 사람은 userconfig 에 users_id 가 있다. 게스트는 그게 없는 상태다.
 */

const KEY = 'hong.guest';

/** 둘러보기로 들어왔다고 표시 */
export const enterGuest = async () => {
  await localforage.setItem(KEY, true).catch(() => {});
};

/** 로그인에 성공하면 지운다 */
export const clearGuest = async () => {
  await localforage.removeItem(KEY).catch(() => {});
};

/** 지금 게스트인가 — 계정이 없으면 게스트로 본다 */
export const isGuest = async () => {
  const cfg = await localforage.getItem('userconfig').catch(() => null);
  return !(cfg && cfg.users_id);
};

/** UserContext 의 user 로 즉시 판정 (비동기 대기 없이 쓰는 자리용) */
export const isGuestUser = (user) => !(user && user.users_id);

/** 로그인이 필요한 동작에 붙이는 안내 문구 */
export const LOGIN_NEEDED = {
  REGIST:  '일감을 올리려면 로그인이 필요합니다.',
  SUPPORT: '일감에 지원하려면 로그인이 필요합니다.',
  CHAT:    '채팅을 쓰려면 로그인이 필요합니다.',
  CONFIG:  '내 정보를 보려면 로그인이 필요합니다.',
  FAVORITE:'찜하려면 로그인이 필요합니다.',
};
