import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
const key = JSON.parse(readFileSync(new URL('../functions/serviceAccountKey.json', import.meta.url)));
initializeApp({ credential: cert(key) });
const db = getFirestore();
const snap = await db.collection('USERS').orderBy('LASTLOGINDT', 'desc').limit(8).get();
snap.forEach((d) => {
  const x = d.data();
  const u = x.USERINFO || {};
  console.log(`${x.USERS_ID}  | ${u.nickname || '-'} | ${u.phone || '-'} | ${u.address_name || '-'} | 최근로그인 ${x.LASTLOGINDT}`);
});
process.exit(0);
