// 리뷰 스레드에 답글 남기기 (Firestore)
//
// 예전 review_reply.mjs 는 dev 서버(vite-plugin-review-notes)에 POST 하는 방식이었다.
// 리뷰 저장소가 Firestore(reviewThreads)로 옮겨가면서 그 길이 끊겨 답글이 안 달렸다.
// (형 지적 2026-08-20 "왜 리뷰에 댓글 안 담?")
//
//   node scripts/reply_review.mjs <replyTo문서id> "<본문>"
//   node scripts/reply_review.mjs <replyTo문서id> "$(cat /tmp/reply.txt)"
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const [replyTo, text] = process.argv.slice(2);
if (!replyTo || !text) {
  console.error('사용법: node scripts/reply_review.mjs <replyTo문서id> "<본문>"');
  process.exit(1);
}

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const parent = await db.collection('reviewThreads').doc(replyTo).get();
if (!parent.exists) {
  console.error('그 글을 찾지 못했습니다:', replyTo);
  process.exit(1);
}

// 한국시간으로 적는다 — 리뷰 페이지가 이 형식을 그대로 보여준다
const at = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ');

const ref = await db.collection('reviewThreads').add({
  screenId: parent.data().screenId,
  by: '카스',
  text,
  replyTo,
  at,
  pins: [],
  ts: FieldValue.serverTimestamp(),
});

console.log('답글 등록:', ref.id, '->', replyTo);
process.exit(0);
