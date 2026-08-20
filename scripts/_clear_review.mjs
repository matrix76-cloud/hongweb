// 리뷰 글 전체 삭제 (형 지시 2026-08-18). 지우기 전 _docs/review_backup_*.json 에 백업해둔다.
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const snap = await db.collection('reviewThreads').get();
console.log('지울 글:', snap.size, '건');

let n = 0;
while (n < snap.docs.length) {
  const batch = db.batch();
  snap.docs.slice(n, n + 400).forEach((d) => batch.delete(d.ref));
  await batch.commit();
  n += 400;
}

const after = await db.collection('reviewThreads').get();
console.log('삭제 완료. 남은 글:', after.size, '건');
process.exit(0);
