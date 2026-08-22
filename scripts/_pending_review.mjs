// 미답변(형 글 중 카스 답글 없는 것) 목록 — 임시 확인용
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();
const snap = await db.collection('reviewThreads').get();
const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
const when = (r) => (r.ts?.toDate ? r.ts.toDate().getTime() : r.at ? new Date(r.at.replace(' ', 'T') + ':00+09:00').getTime() : 0);
rows.sort((a,b)=>when(a)-when(b));
const repliedTo = new Set(rows.filter(r=>r.replyTo).map(r=>r.replyTo));
const mine = rows.filter(r=> r.by === '형');
const pending = mine.filter(r=> !repliedTo.has(r.id));
console.log('전체', rows.length, '/ 형 글', mine.length, '/ 미답변', pending.length);
for (const r of pending) {
  console.log(`\n--- [${r.screenId}] ${new Date(when(r)).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} id=${r.id}${r.imgs?' (스샷있음)':''}${r.pins?' (핀'+r.pins.length+')':''}\n${r.text}`);
}
process.exit(0);
