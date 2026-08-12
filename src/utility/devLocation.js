// 개발용 고정 위치 — 남양주시 다산동 (형 지시 2026-08-12, 임시)
//
// 일감 목록이 5km 이내만 보여주는데(WorkService.ReadWork checkdistance=5),
// 시드 데이터를 다산동 기준으로 넣어놔서 실제 GPS 위치로는 아무것도 안 보인다.
// 그래서 개발 중에는 위치를 다산동으로 고정한다.
//
// 끄는 방법: USE_FIXED_LOCATION 을 false 로. (프로덕션 빌드에서는 자동으로 꺼진다)

export const FIXED_LOCATION = {
  latitude: 37.6115,
  longitude: 127.1560,
  address_name: '경기도 남양주시 다산동',
};

export const USE_FIXED_LOCATION = import.meta.env.DEV;

/**
 * GPS 콜백 자리에 끼워 쓴다.
 *   getFixedPosition() -> {coords:{latitude, longitude}} | null
 * null 이면 실제 GPS 를 쓰라는 뜻.
 */
export const getFixedPosition = () =>
  USE_FIXED_LOCATION
    ? { coords: { latitude: FIXED_LOCATION.latitude, longitude: FIXED_LOCATION.longitude } }
    : null;
