// 앱(WebView) <-> 웹 다리 (2026-08-13)
//
// 앱은 껍데기고 화면은 전부 웹이다. 앱이 웹에 넘겨주는 건 셋뿐이다.
//   ① FCM 토큰   — 저장은 여기서 한다 (fcmTokens)
//   ② 현재 위치
//   ③ 알림을 눌러 들어왔다는 사실(딥링크)
//
// ※ 토큰은 USERS 문서의 USERS_ID 로 저장한다. Auth UID 와 다를 수 있다.

import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../api/config';

export const APP_TO_WEB = {
  INIT: 'APP_INIT',
  PUSH_OPENED: 'PUSH_OPENED',
  BACK: 'APP_BACK',
  SOCIAL_RESULT: 'SOCIAL_RESULT',   // 네이티브 소셜 로그인 결과
};

export const WEB_TO_APP = {
  READY: 'ready',
  MAIN: 'mainpage',
  SUB: 'subpage',
  POSITION: 'requestposition',
  SHARE: 'share',
  SOCIAL_LOGIN: 'sociallogin',      // 네이티브 소셜 로그인을 앱에 부탁한다
};

/** 앱 안에서 열렸는가 */
export const isInApp = () => typeof window !== 'undefined' && !!window.ReactNativeWebView;

/** 앱으로 보내기 */
export const sendToApp = (command, payload = {}) => {
  if (!isInApp()) return;
  try {
    window.ReactNativeWebView.postMessage(JSON.stringify({ command, ...payload }));
  } catch { /* noop */ }
};

/** 지금 화면이 메인인지 알려준다 — 앱의 뒤로가기 동작이 이 값으로 갈린다 */
export const setAppMainScreen = (isMain) => sendToApp(isMain ? WEB_TO_APP.MAIN : WEB_TO_APP.SUB);

/** 앱이 준 토큰을 저장한다 (플랫폼별로 한 문서) */
export const saveAppPushToken = async ({ USERS_ID, token, platform }) => {
  if (!USERS_ID || !token) return false;
  try {
    await setDoc(doc(collection(db, 'fcmTokens'), `${USERS_ID}_${platform || 'app'}`), {
      uid: USERS_ID,
      token,
      platform: platform || 'app',
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error('[bridge] 토큰 저장 실패', e);
    return false;
  }
};

/**
 * 앱 메시지 수신 시작.
 * 안드로이드는 document, iOS 는 window 로 오므로 둘 다 듣는다.
 */
export const listenApp = (handler) => {
  if (typeof window === 'undefined') return () => {};

  const onMessage = (e) => {
    try {
      const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (msg && msg.type) handler(msg.type, msg.data || {});
    } catch { /* 앱이 보낸 게 아니면 무시 */ }
  };

  window.addEventListener('message', onMessage);
  document.addEventListener('message', onMessage);
  return () => {
    window.removeEventListener('message', onMessage);
    document.removeEventListener('message', onMessage);
  };
};


/* ── 네이티브 소셜 로그인 ────────────────────────────────────────────────
 *
 * 웹뷰 안에서 구글·카카오 로그인 페이지를 여는 방식은 폰에 이미 로그인된 계정을
 * 못 본다. 웹뷰는 쿠키 저장소가 따로라, 크롬에 로그인돼 있어도 아이디·비번을
 * 다시 받아야 한다. 그래서 로그인 자체는 앱(네이티브)이 하고, 웹은 그 결과로
 * 받은 토큰만 파이어베이스에 넘긴다. (형 지시 2026-08-18)
 *
 * ※ 마켓에 이미 깔린 옛 앱에는 이 기능이 없다. 그래서 앱이 할 수 있다고
 *   알려온 경우에만 부탁하고, 아니면 웹 방식으로 물러선다.
 */

let appAbilities = {};

/** 앱이 INIT 으로 알려준 기능 목록을 기억해둔다 */
export const rememberAppAbilities = (data) => {
  appAbilities = (data && data.can) || {};
};

/** 앱이 이 소셜 로그인을 직접 할 수 있는가 */
export const appCanSocial = (provider) => isInApp() && !!appAbilities[provider];

/**
 * 앱에 네이티브 로그인을 부탁하고 결과를 기다린다.
 * 성공하면 { idToken } (구글) 또는 { accessToken } (카카오), 실패하면 { error }.
 */
export const requestNativeSocial = (provider, timeoutMs = 120000) => new Promise((resolve) => {
  if (!isInApp()) { resolve({ error: '앱에서만 쓸 수 있습니다' }); return; }

  let settled = false;
  const finish = (v) => {
    if (settled) return;
    settled = true;
    window.removeEventListener('message', onMessage);
    document.removeEventListener('message', onMessage);
    clearTimeout(timer);
    resolve(v);
  };

  const onMessage = (e) => {
    try {
      const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (msg && msg.type === APP_TO_WEB.SOCIAL_RESULT && msg.data?.provider === provider) {
        finish(msg.data);
      }
    } catch { /* 앱이 보낸 게 아니면 무시 */ }
  };

  window.addEventListener('message', onMessage);
  document.addEventListener('message', onMessage);

  // 계정을 고르는 데 시간이 걸린다 — 넉넉히 기다리되 영영 매달리지는 않는다
  const timer = setTimeout(() => finish({ error: '로그인이 끝나지 않았습니다' }), timeoutMs);

  sendToApp(WEB_TO_APP.SOCIAL_LOGIN, { provider });
});
