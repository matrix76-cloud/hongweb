import { ensureKakao } from "./kakaoReady";

/**
 * 좌표 → 주소 한 줄.
 *
 * 못 구하면 null 을 준다. 절대 예외를 던지지 않는다 —
 * 이 값을 기다리다 화면이 멈추면 안 된다.
 */
export const coordToAddress = async (latitude, longitude) => {
  try {
    const kakao = await ensureKakao();
    if (!kakao?.maps?.services) return null;

    return await new Promise((resolve) => {
      const geocoder = new kakao.maps.services.Geocoder();
      const giveup = setTimeout(() => resolve(null), 4000);
      geocoder.coord2Address(longitude, latitude, (result, status) => {
        clearTimeout(giveup);
        if (status !== kakao.maps.services.Status.OK) { resolve(null); return; }
        resolve(result?.[0]?.address?.address_name || null);
      });
    });
  } catch {
    return null;
  }
};

export default coordToAddress;
