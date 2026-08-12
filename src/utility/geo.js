/**
 * 위치 처리 — seekone 프로젝트(services/geo.js)의 방식을 그대로 옮겼다. (형 리뷰 2026-08-12)
 *
 * 기존 hongweb 은 coord2Address(번지까지 나오는 전체 주소)를 쓰고 화면마다 잘라 썼다.
 * seekone 은 coord2RegionCode 로 행정동을 받아 "시 구 동" 한 줄로 만들고,
 * 표시·거리 계산이 같은 값 하나만 보게 한다. 그 방식을 따른다.
 *
 * 카카오 SDK 는 index.html 에서 전역 로드되므로(services 라이브러리 포함) 로드 완료만 기다린다.
 */

// 위치를 못 잡았을 때 화면에 내보낼 임시 지역
export const DEFAULT_REGION_LABEL = "남양주시 다산동";

// 특별·광역시(시도가 곧 '시') — 이 경우만 시도를 앞에 붙인다. 도(경기/강원…)는 2depth 에 이미 '시'가 들어있다.
const METRO = /^(서울|부산|대구|인천|광주|대전|울산|세종)/;

// index.html 의 카카오 SDK 로드 대기
const waitKakao = () =>
  new Promise((resolve, reject) => {
    const ok = () => window.kakao && window.kakao.maps && window.kakao.maps.services;
    if (ok()) return resolve(window.kakao);
    let waited = 0;
    const timer = setInterval(() => {
      if (ok()) {
        clearInterval(timer);
        resolve(window.kakao);
      } else if ((waited += 100) >= 5000) {
        clearInterval(timer);
        reject(new Error("kakao-sdk-timeout"));
      }
    }, 100);
  });

/**
 * 좌표 → 지역 라벨 "시 구 동"
 * 예) 서울 강남구 역삼동 / 수원시 팔달구 인계동 / 남양주시 다산동
 * 행정동 번호는 뗀다 (다산2동 → 다산동). 형: 번호 없이 깔끔하게.
 */
export function coordToRegion(lat, lng) {
  return waitKakao().then(
    (kakao) =>
      new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(lng, lat, (res, status) => {
          if (status === kakao.maps.services.Status.OK && res && res.length) {
            const r = res.find((x) => x.region_type === "H") || res[0]; // 행정동(H) 우선
            const d1 = r.region_1depth_name || "";
            const d2 = r.region_2depth_name || "";
            const d3 = (r.region_3depth_name || "").replace(/\d+(동|가)$/, "$1");
            const head = METRO.test(d1) ? d1 : "";
            const label = [head, d2, d3].filter(Boolean).join(" ");
            resolve({ label, lat, lng });
          } else reject(new Error("geocode-fail"));
        });
      })
  );
}

// 기기 현재 위치 좌표만 (역지오코딩 없이)
export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("no-geolocation"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

// 기기 현재 위치 → 지역 라벨. 실패 시 reject (호출부가 기존 지역을 유지한다)
export function getCurrentRegion() {
  return getCurrentCoords().then(({ lat, lng }) => coordToRegion(lat, lng));
}

/**
 * 표시용 지역 라벨.
 * 저장된 값이 무엇이든(전체 주소 "경기도 남양주시 다산동 123-4" / 정제 라벨 / 빈 값)
 * 헤더에 넣을 "시·구 + 동" 두 토막으로 안전하게 줄인다.
 */
export function regionLabel(address) {
  const p = String(address ?? "").trim().split(" ").filter(Boolean);
  if (!p.length) return DEFAULT_REGION_LABEL;

  const i = p.findIndex((s) => /(동|읍|면|가|리)\d*$/.test(s));
  if (i > 0) return p[i - 1] + " " + p[i];
  if (i === 0) return p[0];

  return p.slice(0, 2).join(" ");
}

// 두 좌표 간 거리(km, 소수 1자리). 하버사인. 좌표 없으면 null.
export function haversineKm(a, b) {
  if (!a || !b || a.lat == null || b.lat == null) return null;
  const R = 6371;
  const toR = (d) => (d * Math.PI) / 180;
  const dLat = toR(b.lat - a.lat);
  const dLng = toR(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
}
