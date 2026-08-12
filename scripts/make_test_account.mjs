/**
 * 테스트용 계정 하나 만들기 (형 요청 2026-08-13)
 *   node scripts/make_test_account.mjs
 *
 * 이메일·비밀번호로 로그인해볼 계정이 필요해서 만든다.
 * Firebase Auth 계정 + 우리 USERS 문서를 함께 만들고, 이미 있으면 비밀번호만 다시 맞춘다.
 * SEEDED 표시를 남겨서 나중에 골라 지울 수 있게 한다.
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const key = JSON.parse(readFileSync(new URL('../functions/serviceAccountKey.json', import.meta.url)));
initializeApp({ credential: cert(key) });

const auth = getAuth();
const db = getFirestore();

const EMAIL = 'test@hongyeosa.com';
const PASSWORD = 'hong1234';
const NICKNAME = '테스트계정';

// 개발 중 고정 위치(다산동)와 맞춘다 — 안 그러면 일감이 하나도 안 보인다
const LOC = { latitude: 37.6115, longitude: 127.1560, address_name: '경기도 남양주시 다산동' };

// ── Auth 계정 ──
let uid;
try {
  const u = await auth.getUserByEmail(EMAIL);
  uid = u.uid;
  await auth.updateUser(uid, { password: PASSWORD, displayName: NICKNAME, emailVerified: true });
  console.log('이미 있던 계정 — 비밀번호를 다시 맞췄습니다.');
} catch {
  const u = await auth.createUser({ email: EMAIL, password: PASSWORD, displayName: NICKNAME, emailVerified: true });
  uid = u.uid;
  console.log('Auth 계정을 만들었습니다.');
}

// ── USERS 문서 ──
const snap = await db.collection('USERS').where('AUTH_UID', '==', uid).limit(1).get();
let usersId;

if (!snap.empty) {
  usersId = snap.docs[0].data().USERS_ID;
  await snap.docs[0].ref.update({ LASTLOGINDT: Date.now() });
  console.log('USERS 문서가 이미 있습니다.');
} else {
  const ref = db.collection('USERS').doc();
  usersId = ref.id;
  await ref.set({
    USERS_ID: usersId,
    AUTH_UID: uid,
    EMAIL: EMAIL,
    PROVIDER: 'email',
    DEVICEID: uid,
    DEVICETYPE: 'web',
    CREATEDT: Date.now(),
    LASTLOGINDT: Date.now(),
    ACTIVITY: [],
    REVIEWITEMS: [],
    COMMUNITYITEMS: [],
    CHATINFO: [],
    AGREE: { agreed: true, at: Date.now(), use: true, privacy: true, gps: true, marketing: false },
    SEEDED: true,
    USERINFO: {
      nickname: NICKNAME,
      userimg: '',
      phone: '',
      token: '',
      address_name: LOC.address_name,
      latitude: LOC.latitude,
      longitude: LOC.longitude,
      users_id: usersId,
    },
  });
  console.log('USERS 문서를 만들었습니다.');
}

console.log('\n─────────────────────────────');
console.log('  이메일   :', EMAIL);
console.log('  비밀번호 :', PASSWORD);
console.log('  대화명   :', NICKNAME);
console.log('  USERS_ID :', usersId);
console.log('─────────────────────────────');

process.exit(0);
