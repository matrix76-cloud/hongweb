// 대화방 시드 (서버에서 직접) — 형 지시 2026-08-20 "걍 넣어줘 세팅 알아서"
//
// 리뷰페이지 버튼은 브라우저에 로그인된 계정에 붙이는 방식이라,
// 여기서는 붙일 계정을 직접 골라 넣는다. 기본은 데모 계정(demo_review)이다.
//
//   node scripts/seed_chat.mjs            → 데모 계정에 3개
//   node scripts/seed_chat.mjs 5          → 5개
//   node scripts/seed_chat.mjs 3 <USERS_ID>  → 그 계정에
//
// 만든 문서에는 SEEDED:true 를 남긴다. 지울 때는 scripts/clear_chat.mjs
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();

const count = Number(process.argv[2] || 3);
const wantId = process.argv[3] || null;

/* 결이 다른 상황으로 고른 대화들 — 인사만 반복되면 화면 확인에 도움이 안 된다 */
const SCRIPTS = [
  [
    ['supporter', '안녕하세요. 올려주신 조건 봤는데 하나만 여쭤볼게요.'],
    ['owner', '네 말씀하세요.'],
    ['supporter', '평수가 생각보다 넓어 보여서요. 짐 정리까지 포함인가요?'],
    ['owner', '아 그건 제가 미리 치워둘게요. 청소만 해주시면 됩니다.'],
    ['supporter', '그러면 올려주신 금액으로 맞출 수 있습니다.'],
    ['owner', '감사합니다. 그럼 그대로 진행할게요.'],
    ['supporter', '네, 당일에 10분 정도 일찍 도착하겠습니다.'],
  ],
  [
    ['supporter', '오늘 일 마쳤습니다. 확인 부탁드려요.'],
    ['owner', '방금 봤어요. 생각보다 훨씬 깔끔하네요.'],
    ['owner', '베란다까지 해주실 줄은 몰랐어요. 감사합니다.'],
    ['supporter', '하는 김에 같이 했습니다. 편하게 쓰세요.'],
    ['owner', '다음에 또 부탁드릴게요.'],
    ['supporter', '언제든 연락 주세요. 고맙습니다.'],
  ],
  [
    ['owner', '죄송한데 날짜를 하루만 미룰 수 있을까요?'],
    ['supporter', '괜찮습니다. 어느 날로 하실까요?'],
    ['owner', '수요일 같은 시간으로 부탁드려요.'],
    ['supporter', '네 수요일 오전 10시로 옮기겠습니다.'],
    ['owner', '갑자기 말씀드려서 죄송해요.'],
    ['supporter', '아닙니다. 미리 알려주셔서 오히려 좋습니다.'],
  ],
  [
    ['owner', '안녕하세요, 올린 일감 보고 연락 주셨네요.'],
    ['supporter', '네 안녕하세요. 이 일 제가 도와드릴 수 있을 것 같아서요.'],
    ['owner', '혹시 이런 일 해보신 적 있으세요?'],
    ['supporter', '3년 정도 했습니다. 비슷한 집도 여러 번 해봤어요.'],
    ['owner', '좋네요. 시간은 오전 10시쯤 가능하실까요?'],
    ['supporter', '네 그 시간 괜찮습니다.'],
  ],
  [
    ['supporter', '안녕하세요, 일감 보고 지원했습니다.'],
    ['owner', '네 반갑습니다. 언제부터 가능하세요?'],
    ['supporter', '이번 주 목요일부터 가능합니다.'],
    ['owner', '금액은 올린 그대로 생각하시면 될까요?'],
    ['supporter', '네 괜찮습니다. 다만 주차가 어려우면 미리 알려주세요.'],
  ],
];

const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(([, v]) => v);

/** 붙일 계정 */
const loadMe = async () => {
  if (wantId) {
    const d = await db.collection('USERS').doc(wantId).get();
    if (d.exists) return d.data();
    const q = await db.collection('USERS').where('USERS_ID', '==', wantId).limit(1).get();
    if (!q.empty) return q.docs[0].data();
    throw new Error(`그 계정을 찾지 못했습니다: ${wantId}`);
  }
  // 기본은 리뷰용 데모 계정 — 리뷰페이지에서 ?demo=1 로 보는 그 계정이다
  const d = await db.collection('USERS').doc('demo_review').get();
  if (d.exists) return d.data();
  throw new Error('demo_review 계정이 없습니다. USERS_ID 를 인자로 넘겨주세요.');
};

const loadPartners = async (myId, n) => {
  const snap = await db.collection('USERS').limit(80).get();
  const users = [];
  snap.forEach((d) => {
    const x = d.data();
    if (x.USERS_ID === myId) return;
    if (!x.USERINFO || !x.USERINFO.nickname) return;
    users.push(x);
  });
  if (!users.length) throw new Error('상대로 쓸 사용자를 찾지 못했습니다.');
  const out = shuffle(users);
  while (out.length < n) out.push(out[out.length % users.length]);
  return out.slice(0, n);
};

const loadWorks = async (n) => {
  const snap = await db.collection('WORK').limit(40).get();
  const works = [];
  snap.forEach((d) => works.push(d.data()));
  if (!works.length) throw new Error('일감을 찾지 못했습니다.');
  const out = shuffle(works);
  while (out.length < n) out.push(out[out.length % works.length]);
  return out.slice(0, n);
};

const me = await loadMe();
const myId = me.USERS_ID;
const partners = await loadPartners(myId, count);
const works = await loadWorks(count);

const meDoc = {
  USERS_ID: myId,
  USERINFO: {
    nickname: me.USERINFO?.nickname || '나',
    userimg: me.USERINFO?.userimg || '',
    address_name: me.USERINFO?.address_name || '',
    phone: me.USERINFO?.phone || '',
    latitude: me.USERINFO?.latitude ?? null,
    longitude: me.USERINFO?.longitude ?? null,
    users_id: myId,
  },
};

const now = Date.now();
const made = [];

for (let i = 0; i < count; i++) {
  const partner = partners[i];
  const work = works[i];
  const iAmOwner = i % 2 === 0;

  const chatRef = db.collection('CHAT').doc();
  const CHAT_ID = chatRef.id;

  const OWNER = iAmOwner ? meDoc : partner;
  const SUPPORTER = iAmOwner ? partner : meDoc;
  const OWNER_ID = OWNER.USERS_ID;
  const SUPPORTER_ID = SUPPORTER.USERS_ID;

  const script = SCRIPTS[i % SCRIPTS.length];
  const base = now - (i + 1) * 1000 * 60 * 60 * 20;   // 하루씩 벌려 목록 정렬이 보이게

  const batch = db.batch();
  let lastText = '';
  let lastAt = base;

  script.forEach((line, k) => {
    const [role, text] = line;
    const writer = role === 'owner' ? OWNER_ID : SUPPORTER_ID;
    const at = base + k * 1000 * 60 * (3 + (k % 4));
    const msgRef = db.collection(`CHAT/${CHAT_ID}/messages`).doc();
    batch.set(msgRef, {
      MESSAGE_ID: msgRef.id,
      TEXT: text,
      CREATEDT: at,
      USERS_ID: writer,
      // 상대가 남긴 마지막 몇 개는 안읽음으로 둬서 뱃지를 볼 수 있게 한다
      READ: writer === myId ? [myId] : (k < script.length - 2 ? [OWNER_ID, SUPPORTER_ID] : [writer]),
      CHAT_CONTENT_TYPE: 'TEXT',
      SEEDED: true,
    });
    lastText = text;
    lastAt = at;
  });

  const unreadForMe = script.slice(-2)
    .filter(([role]) => (role === 'owner' ? OWNER_ID : SUPPORTER_ID) !== myId).length;

  batch.set(chatRef, {
    CHAT_ID,
    OWNER, OWNER_ID,
    SUPPORTER, SUPPORTER_ID,
    INFO: work,
    TYPE: '도움요청',
    CREATEDT: base,
    PARTICIPANTS: [OWNER_ID, SUPPORTER_ID],
    LASTMESSAGE: lastText,
    LASTMESSAGE_AT: lastAt,
    UNREAD: { [OWNER_ID]: 0, [SUPPORTER_ID]: 0, [myId]: unreadForMe },
    SEEDED: true,
  });

  await batch.commit();
  made.push(`${CHAT_ID}  ${iAmOwner ? '내가 의뢰' : '내가 지원'}  상대=${partner.USERINFO.nickname}  일감=${work.WORKTYPE}  대화 ${script.length}개`);
}

console.log(`계정 ${me.USERINFO?.nickname || myId} (${myId}) 에 대화방 ${made.length}개를 넣었습니다.\n`);
made.forEach((m) => console.log('  ' + m));
process.exit(0);
