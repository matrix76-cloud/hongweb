/**
 * 토스페이먼츠 설정 (2026-08-20)
 *
 * 바꿀 값은 전부 여기 한 곳에 있다. 키를 받으면 아래 두 줄만 고치면 된다.
 *
 * 키 받는 곳 — https://developers.tosspayments.com  (가입만 하면 테스트 키가 바로 나온다.
 * 계약 전에도 실제 카드 승인 없이 전 과정을 돌려볼 수 있다.)
 *
 *   · 클라이언트 키(test_ck_… 또는 test_gck_…) — 앞단에서 결제창을 띄울 때 쓴다. 공개돼도 된다.
 *   · 시크릿 키(test_sk_…) — 서버에서 결제를 승인할 때 쓴다. 절대 앞단에 두면 안 된다.
 *     그래서 시크릿 키는 여기 없고 Cloud Function(functions/tossPay.js) 에 있다.
 */

/* 토스가 문서에 공개해둔 테스트 클라이언트 키. 가입·계약 없이 바로 결제창이 열리고
   실제로 돈이 빠지지 않는다. 계약 뒤 받은 키로 이 한 줄만 바꾸면 된다.
   짝이 되는 시크릿 키는 functions/tossPay.js 에 있다. */
export const TOSS_CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

/** 아직 진짜 키를 안 넣었으면 화면에서 알려주려고 본다 */
export const isTossKeyReady = () =>
  typeof TOSS_CLIENT_KEY === 'string' && TOSS_CLIENT_KEY.startsWith('test_') && TOSS_CLIENT_KEY.length > 20;

/** 결제가 끝나고 돌아올 주소 */
export const TOSS_SUCCESS_PATH = '/Mobilepaysuccess';
export const TOSS_FAIL_PATH = '/Mobilepayfail';

/** 주문번호 — 가게 안에서 겹치지 않기만 하면 된다 */
export const makeOrderId = () =>
  `hong_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 화면에 보여줄 금액 표기 */
export const won = (n) => `${Number(n || 0).toLocaleString('ko-KR')}원`;
