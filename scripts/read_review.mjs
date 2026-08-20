// 리뷰 최신글 확인
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const N = Number(process.argv[2] || 20);
const snap = await db.collection('reviewThreads').get();
const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
console.log('전체', rows.length, '건 / 필드샘플:', Object.keys(rows[0] || {}).join(', '));
const when = (r) => (r.ts?.toDate ? r.ts.toDate().getTime() : r.at ? new Date(r.at.replace(' ', 'T') + ':00+09:00').getTime() : 0);
rows.sort((a, b) => when(a) - when(b));
for (const r of rows.slice(-N)) {
  const t = new Date(when(r)).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  console.log(`\n[${r.screenId}] ${t} · ${r.by}${r.replyTo ? ' (답글)' : ''}  id=${r.id}\n${r.text}`);
}
process.exit(0);
