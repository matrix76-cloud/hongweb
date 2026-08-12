import localforage from "localforage";

/**
 * 찜한 일감 (형 리뷰 2026-08-13 "모두 처리 해줘").
 *
 * 찜은 그 사람 기기에만 남기면 충분한 정보다 — 서버에 둘 이유가 없고,
 * 로그인 전에도 눌러둘 수 있어야 해서 기기 저장으로 간다.
 * 계정별로 나눠 담아서 한 기기를 같이 써도 섞이지 않는다.
 */

const keyOf = (usersId) => `hong.favorite.${usersId || 'guest'}`;

export const ReadFavorites = async (usersId) => {
  const list = await localforage.getItem(keyOf(usersId)).catch(() => null);
  return Array.isArray(list) ? list : [];
};

export const IsFavorite = async (usersId, workId) => {
  const list = await ReadFavorites(usersId);
  return list.includes(workId);
};

/** 켜고 끄기. 끝난 뒤의 상태(true=찜함)를 돌려준다 */
export const ToggleFavorite = async (usersId, workId) => {
  const list = await ReadFavorites(usersId);
  const next = list.includes(workId) ? list.filter((x) => x !== workId) : [workId, ...list];
  await localforage.setItem(keyOf(usersId), next).catch(() => {});
  return next.includes(workId);
};
