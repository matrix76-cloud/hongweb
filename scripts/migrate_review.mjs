// 로컬 파일(_docs/review_thread.json)에 쌓인 리뷰 기록을 Firestore 로 옮긴다.
// 배포본에서도 지금까지의 대화를 그대로 이어보기 위함. (2026-08-13)
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'fs';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const data = JSON.parse(fs.readFileSync('_docs/review_thread.json', 'utf8'));

// 이미 옮긴 게 있으면 중복으로 쌓이지 않게 확인
const exist = await db.collection('reviewThreads').limit(1).get();
if (!exist.empty && !process.argv.includes('--force')) {
  console.log('reviewThreads 에 이미 기록이 있습니다. 덮어쓰려면 --force');
  process.exit(0);
}

let n = 0;
const idMap = new Map();               // 파일의 pid -> Firestore 문서 id (답글 연결용)
const batchAll = [];

for (const [screenId, items] of Object.entries(data)) {
  // 원글 먼저, 답글 나중 (replyTo 를 새 id 로 바꿔야 하므로)
  const roots = items.filter((x) => !x.replyTo);
  const replies = items.filter((x) => x.replyTo);
  batchAll.push(...roots, ...replies);
  for (const it of [...roots, ...replies]) it.__screenId = screenId;
}

for (const it of batchAll) {
  const payload = {
    screenId: it.__screenId,
    by: it.by || '형',
    text: it.text || '',
    at: it.at || '',
    ts: it.at ? Timestamp.fromDate(new Date(it.at.replace(' ', 'T') + ':00+09:00')) : Timestamp.now(),
  };
  if (it.pins?.length) payload.pins = it.pins;
  if (it.imgs?.length) payload.imgs = it.imgs;          // 경로만 (파일은 로컬에 있다)
  if (it.replyTo) payload.replyTo = idMap.get(it.replyTo) || it.replyTo;

  const ref = await db.collection('reviewThreads').add(payload);
  idMap.set(it.pid, ref.id);
  n += 1;
}

console.log(`옮긴 기록: ${n}건`);
const check = await db.collection('reviewThreads').get();
console.log(`reviewThreads 총 ${check.size}건`);
process.exit(0);
