/* 백그라운드 푸시 처리 (2026-08-12)
   탭이 닫혀 있거나 다른 탭을 보고 있을 때 오는 알림을 OS 알림으로 띄운다.
   화면을 보고 있을 때(포그라운드)는 여기로 오지 않고 앱의 onMessage 가 받는다.

   ※ 서비스워커는 모듈 import 를 못 쓰므로 compat 스크립트를 쓴다.
   ※ 이 파일은 반드시 도메인 루트(/firebase-messaging-sw.js)에서 서빙되어야 한다. */

importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBe1PFtU89t61ULsIPIfowduJyy6PgpFB4",
  authDomain: "help-bbcb5.firebaseapp.com",
  projectId: "help-bbcb5",
  storageBucket: "help-bbcb5.appspot.com",
  messagingSenderId: "78320292657",
  appId: "1:78320292657:web:53aedeeae92644a2da9610",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const d = payload.data || {};
  self.registration.showNotification(n.title || '구해줘 홍여사', {
    body: n.body || d.body || '',
    icon: '/logo.png',
    badge: '/logo.png',
    data: { link: d.link || '/Mobilemain' },
    tag: d.notiId || undefined,
  });
});

// 알림을 누르면 해당 화면으로. 이미 열린 탭이 있으면 그 탭을 쓴다.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || '/Mobilemain';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) { c.navigate(link); return c.focus(); }
      }
      if (clients.openWindow) return clients.openWindow(link);
    }),
  );
});
