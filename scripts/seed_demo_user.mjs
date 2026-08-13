// 리뷰용 데모 계정 (2026-08-13)
// 리뷰 페이지의 왼쪽 화면을 "로그인한 상태"로 보기 위한 계정.
// 실제 사용자와 섞이지 않게 USERS_ID 를 demo_ 로 시작시킨다.
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const DEMO = {
  USERS_ID: 'demo_review',
  NICKNAME: '데모 사용자',
  nickname: '데모 사용자',
  ADDRESS_NAME: '경기도 남양주시 다산동',
  address_name: '경기도 남양주시 다산동',
  LATITUDE: 37.6115,
  LONGITUDE: 127.1560,
  latitude: 37.6115,
  longitude: 127.1560,
  USERIMG: '',
  PHONE: '01000000000',
  CREATEDT: Date.now(),
  DEMO: true,
};

await db.collection('USERS').doc('demo_review').set(DEMO, { merge: true });
console.log('데모 계정 준비 완료: demo_review (데모 사용자 · 남양주시 다산동)');

// 이 계정이 올린 일감이 있으면 "등록한 일감" 화면도 채워진다
const mine = await db.collection('WORK').where('USERS_ID', '==', 'demo_review').get();
console.log('demo_review 가 올린 일감:', mine.size, '건');
process.exit(0);
