/**
 * 기존 CHAT 문서 상세 확인 (읽기 전용).
 *   node scripts/inspect_chat.mjs
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const key = JSON.parse(readFileSync(new URL('../functions/serviceAccountKey.json', import.meta.url)));
initializeApp({ credential: cert(key) });
const db = getFirestore();

const snap = await db.collection('CHAT').limit(3).get();
for (const d of snap.docs) {
  const x = d.data();
  console.log('\n===== CHAT', d.id, '=====');
  console.log('keys:', Object.keys(x).join(', '));
  console.log('TYPE:', x.TYPE, '| isVirtualWork:', x.isVirtualWork);
  console.log('OWNER_ID:', x.OWNER_ID, '| SUPPORTER_ID:', x.SUPPORTER_ID);
  console.log('OWNER keys:', x.OWNER ? Object.keys(x.OWNER).join(', ') : null);
  if (x.OWNER?.USERINFO) console.log('  OWNER.USERINFO keys:', Object.keys(x.OWNER.USERINFO).join(', '));
  console.log('INFO keys:', x.INFO ? Object.keys(x.INFO).join(', ') : null);
  console.log('WORK_INFO 있음?', 'WORK_INFO' in x);

  const msgs = await db.collection(`CHAT/${d.id}/messages`).limit(3).get();
  console.log('messages:', msgs.size);
  msgs.forEach((m) => console.log('  -', JSON.stringify(m.data())));
}

// WORK_INFO 필드를 가진 방이 하나라도 있는지
const all = await db.collection('CHAT').get();
let withWork = 0, withInfo = 0, msgTotal = 0;
const owners = new Map();
for (const d of all.docs) {
  const x = d.data();
  if ('WORK_INFO' in x) withWork++;
  if ('INFO' in x) withInfo++;
  owners.set(x.OWNER_ID, (owners.get(x.OWNER_ID) || 0) + 1);
}
console.log('\n===== 요약 =====');
console.log('전체 방:', all.size, '| WORK_INFO 보유:', withWork, '| INFO 보유:', withInfo);
console.log('방이 많은 OWNER_ID 상위 5:', [...owners.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5));

process.exit(0);
