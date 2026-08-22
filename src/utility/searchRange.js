// 일감을 찾는 범위(km) — 내 정보 > 나의 범위설정
//
// 예전에는 5km 로 고정돼 있었다(INCLUDEDISTANCE/CHECKDISTANCE = "5").
// 동네에 일감이 적으면 아무것도 안 보이고, 많으면 너무 멀리까지 떠서
// 사용자가 직접 조절할 수 있어야 한다. (형 지시 2026-08-12)

// 0 = 지역 상관 없음(거리로 거르지 않음). 처음 설치했을 때의 기본값이다. (형 리뷰 2026-08-21)
const KEY = 'honglady.search.range';

export const ANY_RANGE = 0;
export const RANGE_OPTIONS = [ANY_RANGE, 1, 3, 5, 10, 20];
export const DEFAULT_RANGE = ANY_RANGE;

export const rangeLabel = (km) => (km === ANY_RANGE ? '지역 상관 없음' : `${km}km 이내`);

export const getSearchRange = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_RANGE;   // 한 번도 고른 적 없으면 기본값
    const v = Number(raw);
    return RANGE_OPTIONS.includes(v) ? v : DEFAULT_RANGE;
  } catch {
    return DEFAULT_RANGE;
  }
};

export const setSearchRange = (km) => {
  try {
    localStorage.setItem(KEY, String(km));
  } catch { /* noop */ }
  // 목록을 보고 있는 화면이 곧바로 반영할 수 있게 알린다
  try {
    window.dispatchEvent(new CustomEvent('searchrange:changed', { detail: km }));
  } catch { /* noop */ }
};
