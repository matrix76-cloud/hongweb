// 웹 푸시 (FCM) — 토큰 발급·저장, 포그라운드 수신 (2026-08-12)
//
// 백그라운드(탭이 닫혀 있거나 다른 탭)  : public/firebase-messaging-sw.js 가 처리해 OS 알림으로 뜬다
// 포그라운드(화면을 보고 있을 때)        : onMessage 로 받아 화면 상단에 직접 띄운다
//
// ※ 토큰은 USERS 문서의 USERS_ID 로 저장한다.
//   Firebase Auth UID 와 다를 수 있어(소셜 로그인) 섞이면 알림이 엉뚱한 사람에게 간다.

import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseApp } from '../api/config';

// Firebase 콘솔 > 프로젝트 설정 > 클라우드 메시징 > 웹 푸시 인증서(VAPID) 키 쌍
export const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY || '';

let messagingRef = null;

const getMessagingSafe = async () => {
  if (messagingRef) return messagingRef;
  if (!(await isSupported().catch(() => false))) return null;
  messagingRef = getMessaging(firebaseApp);
  return messagingRef;
};

/** 알림 권한 요청 — 사용자가 버튼을 눌렀을 때만 부르는 게 좋다 */
export const requestNotiPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
};

/**
 * 토큰을 발급받아 fcmTokens 에 저장한다.
 * 문서 id = `${USERS_ID}_web` — 같은 사람이 여러 번 눌러도 하나만 남는다.
 */
export const registerWebPushToken = async ({ USERS_ID }) => {
  if (!USERS_ID) return null;
  if (!VAPID_KEY) {
    console.warn('[fcm] VAPID 키가 없습니다. .env 에 VITE_FCM_VAPID_KEY 를 넣어주세요.');
    return null;
  }

  const permission = await requestNotiPermission();
  if (permission !== 'granted') return null;

  const messaging = await getMessagingSafe();
  if (!messaging) return null;

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return null;

    await setDoc(doc(collection(db, 'fcmTokens'), `${USERS_ID}_web`), {
      uid: USERS_ID,
      token,
      platform: 'web',
      updatedAt: serverTimestamp(),
    });
    return token;
  } catch (e) {
    console.error('[fcm] 토큰 등록 실패', e);
    return null;
  }
};

/** 로그아웃 등으로 이 기기에서 알림을 끊는다 */
export const unregisterWebPushToken = async ({ USERS_ID }) => {
  if (!USERS_ID) return;
  try {
    await deleteDoc(doc(collection(db, 'fcmTokens'), `${USERS_ID}_web`));
  } catch { /* noop */ }
};

/**
 * 화면을 보고 있을 때 오는 알림.
 * 이때는 OS 알림이 뜨지 않으므로 직접 화면에 띄워야 한다.
 */
export const onForegroundMessage = async (handler) => {
  const messaging = await getMessagingSafe();
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    const n = payload.notification || {};
    const d = payload.data || {};
    handler({
      title: n.title || d.title || '구해줘 홍여사',
      body: n.body || d.body || '',
      link: d.link || '/Mobilemain',
      type: d.type || '',
    });
  });
};
