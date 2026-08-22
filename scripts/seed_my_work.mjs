/**
 * 어떤 계정이 "올린 일감" 을 만들어준다. (형 지시 2026-08-21 — 심사용 계정)
 *
 * 심사하는 분이 로그인해서 내 정보 > 등록한 일감을 눌렀을 때 비어 있으면
 * 볼 것이 없다. 이미 들어가 있는 시드 일감을 그 계정 이름으로 몇 개 복제한다.
 *
 *   node scripts/seed_my_work.mjs <USERS_ID> [개수]
 *
 * 만든 문서에는 SEEDED:true 를 남긴다.
 */
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const ID = process.argv[2];
const COUNT = Number(process.argv[3] || 3);
if (!ID) { console.error('사용법: node scripts/seed_my_work.mjs <USERS_ID> [개수]'); process.exit(1); }

const me = await db.collection('USERS').doc(ID).get();
if (!me.exists) { console.error('그 계정을 찾지 못했습니다:', ID); process.exit(1); }

// 이미 이 계정 이름으로 만들어둔 것은 지우고 다시 넣는다 (여러 번 돌려도 늘어나지 않게)
const mine = await db.collection('WORK').where('USERS_ID', '==', ID).get();
await Promise.all(mine.docs.filter((d) => d.data().SEEDED === true).map((d) => d.ref.delete()));

const src = await db.collection('WORK')
  .where('USERS_ID', '>=', 'seed_').where('USERS_ID', '<', 'seed`').limit(30).get();
const pool = src.docs.map((d) => d.data());
if (!pool.length) { console.error('복제할 시드 일감이 없습니다. node scripts/seed_work.mjs 를 먼저 돌려주세요.'); process.exit(1); }

const day = 24 * 60 * 60 * 1000;
const made = [];
for (let i = 0; i < Math.min(COUNT, pool.length); i++) {
  const base = pool[i * 3 % pool.length];
  const ref = db.collection('WORK').doc();
  const doc = {
    ...base,
    WORK_ID: ref.id,
    USERS_ID: ID,
    VIEW_COUNT: 12 + i * 7,
    APPLY_COUNT: 1 + (i % 3),
    CREATEDT: Date.now() - (i + 1) * day,
    SEEDED: true,
  };
  await ref.set(doc);
  made.push(`${doc.WORKTYPE} (${ref.id})`);
}

console.log(`${me.data().USERINFO?.nickname || ID} 님이 올린 일감 ${made.length}개를 넣었습니다.`);
made.forEach((m) => console.log('  ·', m));
process.exit(0);
