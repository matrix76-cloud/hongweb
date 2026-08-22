import { isDemoMode } from './devLocation';

/**
 * 지금 보고 있는 것이 PC 브라우저인가. (형 지시 2026-08-21)
 *
 * 구해줘 홍여사는 휴대폰에서 쓰는 서비스다. PC 로 첫 주소(/)에 들어오면
 * 앱을 돌리지 않고 "휴대폰에서 열어주세요" 안내만 보여준다.
 *
 * 다음은 PC 로 보지 않는다 — 안내를 띄우면 안 되는 자리들이다.
 *   · 우리 앱(WebView) 안       — 앱은 첫 주소로 들어온다. 여기서 막으면 앱이 안 열린다
 *   · 리뷰 페이지의 미리보기(?demo=1) — PC 에서 폰 화면을 봐야 하는 자리다
 *   · 손가락으로 만지는 기기      — 아이패드 사파리는 PC 인 척하는 UA 를 보낸다
 *
 * 창 너비는 보지 않는다. 창을 줄인 PC 도 PC 다.
 */
export const isDesktopBrowser = () => {
  if (typeof window === 'undefined') return false;
  if (window.ReactNativeWebView) return false;
  try { if (isDemoMode()) return false; } catch { /* noop */ }

  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  if (/Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(ua)) return false;
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1) return false;

  return true;
};
