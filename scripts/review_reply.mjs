// 리뷰 스레드에 답글 남기기 — dev 서버(vite-plugin-review-notes)에 POST 한다.
// 파일을 직접 쓰지 않는 이유: 형이 같은 파일에 계속 글을 쓰고 있어서 덮어쓰기 사고가 난다.
//
//   node scripts/review_reply.mjs <screen> <replyToPid> "<본문>"
//   node scripts/review_reply.mjs main p1786840456267_3 "$(cat /tmp/reply.txt)"
//
// 포트가 5188 이 아니면 REVIEW_PORT=5173 처럼 넘긴다.
const [screen, replyTo, text] = process.argv.slice(2);
if (!screen || !replyTo || !text) {
  console.error('사용법: node scripts/review_reply.mjs <screen> <replyToPid> "<본문>"');
  process.exit(1);
}

const port = process.env.REVIEW_PORT || 5188;
const r = await fetch(`http://localhost:${port}/__review_thread`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: screen, by: '카스', text, replyTo }),
});
const out = await r.text();
console.log(r.status, out.slice(0, 200));
