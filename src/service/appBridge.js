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
};

export const WEB_TO_APP = {
  READY: 'ready',
  MAIN: 'mainpage',
  SUB: 'subpage',
  POSITION: 'requestposition',
  SHARE: 'share',
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
