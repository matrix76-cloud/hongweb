// 공지사항 시드 — NOTICE 컬렉션에 넣는다. (형 리뷰 2026-08-12)
//   node scripts/seed_notice.mjs          기존 시드 지우고 새로 넣기
//   node scripts/seed_notice.mjs --clean  시드만 지우기
//
// 시드는 SEED:true 로 표시해 나중에 골라서 지울 수 있다.
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

// [며칠 전, 고정여부, 제목, 내용]
const NOTICES = [
  [0, true, '구해줘 홍여사 서비스 안내',
`구해줘 홍여사는 집안일·돌봄·심부름처럼 사람 손이 필요한 일을 이웃과 이어주는 서비스입니다.

일이 필요하신 분은 홈 화면에서 필요한 일을 골라 등록하시면 됩니다. 가까운 홍여사님들이 지원하고, 마음에 드는 분을 고르시면 채팅으로 연결됩니다.

일을 하고 싶으신 분은 내 정보에서 홍여사 등록을 마치시면 모든 일감에 지원할 수 있습니다.`],

  [1, false, '일감 등록할 때 사진을 넣을 수 있습니다',
`일감을 등록하실 때 마지막 단계에서 참고 사진을 올릴 수 있습니다.

짐 나르기라면 옮길 짐을, 청소라면 공간을 찍어 올려주시면 홍여사님이 상황을 훨씬 빨리 파악합니다. 그만큼 견적도 정확해집니다.

사진은 최대 6장까지 올릴 수 있고, 올리실 때 자동으로 용량을 줄이니 데이터 걱정은 안 하셔도 됩니다.`],

  [3, false, '대화명은 하루에 한 번만 바꿀 수 있습니다',
`내 정보 화면에서 대화명 옆 연필을 누르면 그 자리에서 바로 바꾸실 수 있습니다.

대화명은 6자까지 쓸 수 있고, 하루에 한 번만 바꿀 수 있습니다. 거래 중에 이름이 자주 바뀌면 상대방이 혼란스럽기 때문입니다.

바꾸시면 참여 중인 대화방에 변경 안내가 남습니다.`],

  [5, false, '안전하게 거래하세요',
`거래 전에 아래 세 가지만 지켜주세요.

첫째, 대화는 앱 안에서 나눠주세요. 다른 곳으로 옮기자고 하면 한 번 더 생각하시는 게 좋습니다.
둘째, 일을 시작하기 전에 시간과 금액을 글로 남겨 서로 확인하세요.
셋째, 선입금을 요구하거나 개인 계좌로 보내달라는 요청은 응하지 마세요.

이상한 점이 있으면 고객센터로 알려주세요.`],

  [8, false, '일감 찾는 범위를 직접 정할 수 있습니다',
`내 정보 > 나의 범위설정에서 일감을 찾는 거리를 고르실 수 있습니다.

동네에 일감이 적으면 범위를 넓혀보세요. 범위를 고르면 그 자리에서 몇 건이 잡히는지 바로 보여드립니다.`],

  [14, false, '서비스 점검 안내',
`더 나은 서비스를 위해 정기 점검을 진행합니다.

점검 중에는 일감 등록과 채팅이 잠시 멈출 수 있습니다. 점검이 끝나면 별도 안내 없이 정상 이용하실 수 있습니다.

이용에 불편을 드려 죄송합니다.`],
];

const clean = async () => {
  const snap = await db.collection('NOTICE').where('SEED', '==', true).get();
  if (snap.empty) { console.log('지울 공지 시드 없음'); return; }
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`공지 시드 ${snap.size}건 삭제`);
};

const seed = async () => {
  const batch = db.batch();
  NOTICES.forEach(([daysAgo, pinned, title, content]) => {
    const ref = db.collection('NOTICE').doc();
    batch.set(ref, {
      NOTICE_ID: ref.id,
      TITLE: title,
      CONTENT: content,
      PINNED: pinned,
      CREATEDT: now - daysAgo * DAY,
      SEED: true,
    });
  });
  await batch.commit();
  console.log(`공지 ${NOTICES.length}건 등록`);
};

const main = async () => {
  await clean();
  if (!process.argv.includes('--clean')) await seed();
  const total = await db.collection('NOTICE').get();
  console.log(`NOTICE 컬렉션 총 ${total.size}건`);
  process.exit(0);
};

main().catch((e) => { console.error('실패:', e.message); process.exit(1); });
