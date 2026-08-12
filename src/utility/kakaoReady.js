// 카카오맵 SDK 준비 대기
//
// index.html 에서 autoload=false 로 로드하고 kakao.maps.load() 콜백으로 준비되면
// window.__kakaoReady 프로미스가 resolve 된다.
// 지도를 그리기 직전에 await ensureKakao() 를 한 번 태우면 된다.
//
// 왜 필요한가: Vite 는 ES 모듈(defer)이라 CRA 때와 스크립트 실행 순서가 다르다.
// 예전처럼 동기 로드하면 모듈 최상단의 const { kakao } = window 가 undefined 로 굳어
// "Cannot read properties of undefined (reading 'maps')" 가 났다. (2026-08-12)

export const ensureKakao = async () => {
  if (window.kakao?.maps?.Map) return window.kakao;

  if (window.__kakaoReady) {
    const k = await window.__kakaoReady;
    if (k?.maps?.Map) return k;
  }

  // 혹시 SDK 태그가 늦게 붙는 경우를 대비해 잠깐 폴링
  for (let i = 0; i < 40; i += 1) {
    if (window.kakao?.maps?.Map) return window.kakao;
    if (window.kakao?.maps?.load) {
      await new Promise((r) => window.kakao.maps.load(r));
      if (window.kakao?.maps?.Map) return window.kakao;
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  console.error('[kakao] SDK 를 불러오지 못했습니다. 앱키·도메인 등록을 확인하세요.');
  return null;
};
