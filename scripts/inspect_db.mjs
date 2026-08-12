/**
 * 시드를 넣기 전에 실제 데이터 모양을 확인만 하는 스크립트 (읽기 전용).
 *   node scripts/inspect_db.mjs
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const key = JSON.parse(readFileSync(new URL('../functions/serviceAccountKey.json', import.meta.url)));
initializeApp({ credential: cert(key) });
const db = getFirestore();

const peek = async (name, n = 2) => {
  const snap = await db.collection(name).limit(n).get();
  console.log(`\n===== ${name} (문서 ${snap.size}개 표본) =====`);
  snap.forEach((d) => {
    const data = d.data();
    console.log('- id:', d.id);
    console.log('  keys:', Object.keys(data).join(', '));
  });
  const total = await db.collection(name).count().get();
  console.log('  총 문서 수:', total.data().count);
};

await peek('USERS', 2);
await peek('WORK', 2);
await peek('CHAT', 2);

// USERS 한 건 상세 (닉네임·이미지 필드명 확인용)
const u = await db.collection('USERS').limit(3).get();
u.forEach((d) => {
  const x = d.data();
  console.log('\n[USERS 상세]', d.id, JSON.stringify({
    users_id: x.users_id, USERS_ID: x.USERS_ID, nickname: x.nickname,
    userimg: x.userimg, address_name: x.address_name, name: x.name, phone: x.phone,
  }, null, 1));
});

const w = await db.collection('WORK').limit(1).get();
w.forEach((d) => {
  const x = d.data();
  console.log('\n[WORK 상세]', d.id, 'keys:', Object.keys(x).join(', '));
  console.log('  WORKTYPE:', x.WORKTYPE, '| USERS_ID:', x.USERS_ID, '| WORK_ID:', x.WORK_ID);
  if (Array.isArray(x.WORK_INFO)) console.log('  WORK_INFO 길이:', x.WORK_INFO.length, '첫 항목:', JSON.stringify(x.WORK_INFO[0]));
});

process.exit(0);
