import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('/Users/a1111/Downloads/2026Dev/mainproject/2026Web/hong/hongweb/functions/serviceAccountKey.json')) });
const db = getFirestore();

const snap = await db.collection('reviewThreads').get();
const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
const when = (r) => (r.ts?.toDate ? r.ts.toDate().getTime() : r.at ? new Date(r.at.replace(' ', 'T') + ':00+09:00').getTime() : 0);
rows.sort((a, b) => when(a) - when(b));

fs.writeFileSync(process.argv[2], JSON.stringify(rows, null, 2));
console.log('백업', rows.length, '건 ->', process.argv[2]);

// 형 글 중 뒤에 카스 답글이 없는 것 = 미처리
const mine = rows.filter(r => r.by === '형' && !r.replyTo);
const replies = rows.filter(r => r.by !== '형');
console.log('\n--- 형 글 중 답글 없는 것 ---');
for (const m of mine) {
  const answered = replies.some(rp => rp.replyTo === m.id || (rp.screenId === m.screenId && when(rp) > when(m)));
  if (!answered) console.log(`[${m.screenId}] ${m.at || ''} id=${m.id}\n  ${String(m.text).slice(0,200)}\n  pins=${JSON.stringify(m.pins||[])} imgs=${(m.imgs||m.images||[]).length}`);
}
process.exit(0);
