/**
 * 시드 대화방에 수수료 계약 상태를 심는다. (형 지시 2026-08-21)
 *
 * "시드 데이터 중에 세 개 모두 계약 수립된 단계로 — 결제 버튼 바로 누르게" 를 위한 것이다.
 * 새로 만드는 시드(src/dev/seedChat.js)는 처음부터 계약을 물고 나오지만,
 * 이미 DB 에 쌓여 있는 방들은 그렇지 않아서 여기서 손봐준다.
 *
 *   · 데모 계정이 의뢰자인 방 3개 → 계약 완료(ACCEPTED). 열면 [결제] 가 바로 눌린다.
 *   · 데모 계정이 지원한 방 1개  → 제안 대기(OFFERED). 열면 수락/거절 창이 뜬다.
 *
 * 손댄 방은 마지막 대화 시각이 지금으로 바뀌어 목록 맨 위로 올라온다.
 *
 *   node scripts/seed_contract.mjs
 */
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const DEMO_DEVICEID = 'demo-review-device';
const FEE = [50000, 80000, 120000, 65000];
const won = (n) => n.toLocaleString('ko-KR');

/* 데모 계정이 둘이다 — 어느 쪽으로 보게 될지 몰라 양쪽 다 손본다.
     · demo_review           : 주소에 ?demo=1 을 붙였을 때 잡히는 계정 (utility/devLocation.js)
     · DEVICEID=demo-review-device : 시드가 만들어 localforage 에 심어두는 계정 (dev/seedChat.js)
   저장된 계정이 있으면 그쪽이 이기기 때문에 상황에 따라 달라진다. */
/* 계정을 직접 넘기면 그 계정만 손본다 — 심사용 계정을 준비할 때 쓴다.
     node scripts/seed_contract.mjs <USERS_ID>                        */
const only = process.argv[2] || null;
const ids = only ? [only] : ['demo_review'];
if (!only) {
  const users = await db.collection('USERS').where('DEVICEID', '==', DEMO_DEVICEID).get();
  users.forEach((d) => { const id = d.data().USERS_ID; if (id && !ids.includes(id)) ids.push(id); });
}
console.log('데모 계정', ids.join(', '));

const seeded = await db.collection('CHAT').where('SEEDED', '==', true).get();
const rooms = seeded.docs.map((d) => ({ id: d.id, ...d.data() }));
const recent = (a, b) => (b.LASTMESSAGE_AT || b.CREATEDT || 0) - (a.LASTMESSAGE_AT || a.CREATEDT || 0);

// 계정마다 의뢰자 방 3개 · 지원한 방 1개
const asOwner = ids.flatMap((ME) => rooms.filter((r) => r.OWNER_ID === ME).sort(recent).slice(0, 3));
const asSupporter = ids.flatMap((ME) => rooms.filter((r) => r.SUPPORTER_ID === ME).sort(recent).slice(0, 1));

/* 여러 번 돌려도 카드가 겹치지 않게, 그 방의 계약 카드를 먼저 지우고 다시 넣는다 */
const clearCards = async (room) => {
  const snap = await db.collection(`CHAT/${room.id}/messages`).where('CHAT_CONTENT_TYPE', '==', '계약').get();
  await Promise.all(snap.docs.map((d) => d.ref.delete()));
};

const addCard = async (room, { by, at, state, amount, text }) => {
  const ref = db.collection(`CHAT/${room.id}/messages`).doc();
  await ref.set({
    MESSAGE_ID: ref.id,
    TEXT: text,
    CREATEDT: at,
    USERS_ID: by,
    READ: [room.OWNER_ID, room.SUPPORTER_ID],
    CHAT_CONTENT_TYPE: '계약',
    CONTRACT_STATE: state,
    CONTRACT_AMOUNT: amount,
    SEEDED: true,
  });
};

let n = 0;
for (const room of asOwner) {
  await clearCards(room);
  const fee = FEE[n % FEE.length];
  const offeredAt = Date.now() - 1000 * 60 * 30;
  const decidedAt = Date.now() - 1000 * 60 * 25;

  await addCard(room, { by: room.OWNER_ID, at: offeredAt, state: 'OFFERED', amount: fee,
    text: `수수료 ${won(fee)}원을 제안했습니다.` });
  await addCard(room, { by: room.SUPPORTER_ID, at: decidedAt, state: 'ACCEPTED', amount: fee,
    text: `수수료 ${won(fee)}원에 계약이 성사되었습니다.` });

  await db.collection('CHAT').doc(room.id).update({
    CONTRACT: {
      STATUS: 'ACCEPTED', AMOUNT: fee,
      OFFERED_BY: room.OWNER_ID, OFFERED_AT: offeredAt,
      DECIDED_BY: room.SUPPORTER_ID, DECIDED_AT: decidedAt,
    },
    LASTMESSAGE: `수수료 ${won(fee)}원에 계약이 성사되었습니다.`,
    LASTMESSAGE_AT: decidedAt,
  });
  console.log(`계약 완료 · ${won(fee)}원 — ${room.id} (상대 ${room.SUPPORTER?.USERINFO?.nickname || ''})`);
  n++;
}

for (const room of asSupporter) {
  await clearCards(room);
  const fee = 45000;
  const offeredAt = Date.now() - 1000 * 60 * 10;
  await addCard(room, { by: room.OWNER_ID, at: offeredAt, state: 'OFFERED', amount: fee,
    text: `수수료 ${won(fee)}원을 제안했습니다.` });
  await db.collection('CHAT').doc(room.id).update({
    CONTRACT: { STATUS: 'OFFERED', AMOUNT: fee, OFFERED_BY: room.OWNER_ID, OFFERED_AT: offeredAt },
    LASTMESSAGE: `수수료 ${won(fee)}원을 제안했습니다.`,
    LASTMESSAGE_AT: offeredAt,
  });
  console.log(`제안 대기 · ${won(fee)}원 — ${room.id} (의뢰 ${room.OWNER?.USERINFO?.nickname || ''})`);
}

console.log(`\n계약 완료 ${asOwner.length}개 / 제안 대기 ${asSupporter.length}개`);
process.exit(0);
