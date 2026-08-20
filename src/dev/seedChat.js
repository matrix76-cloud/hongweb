/**
 * 채팅 시드 (개발 전용) — 리뷰페이지에서 버튼으로 실행한다. (형 요청 2026-08-12)
 *
 * 채팅 화면을 보려면 대화방이 있어야 하는데, 방은 "지원하기"를 눌러야만 생긴다.
 * 화면 확인용으로 실제 사용자·실제 일감을 물린 방과 대화를 만들어 넣는다.
 *
 * 어느 계정에 붙일지는 묻지 않는다 — 지금 앱에 로그인된 계정(localforage userconfig)에 붙인다.
 * 만든 문서에는 SEEDED:true 를 남겨서 언제든 지울 수 있다.
 */
import localforage from 'localforage';
import {
  collection, doc, getDocs, limit, query, setDoc, where, writeBatch, orderBy,
} from 'firebase/firestore';
import { db } from '../api/config';
import { FIXED_LOCATION } from '../utility/devLocation';

// 일감 종류와 무관하게 자연스럽게 읽히는 대화 묶음. 방마다 하나를 골라 쓴다.
const SCRIPTS = [
  [
    ['owner', '안녕하세요, 올린 일감 보고 연락 주셨네요.'],
    ['supporter', '네 안녕하세요. 이 일 제가 도와드릴 수 있을 것 같아서요.'],
    ['owner', '혹시 이런 일 해보신 적 있으세요?'],
    ['supporter', '3년 정도 했습니다. 비슷한 집도 여러 번 해봤어요.'],
    ['owner', '좋네요. 시간은 오전 10시쯤 가능하실까요?'],
    ['supporter', '네 그 시간 괜찮습니다.'],
    ['owner', '그럼 그때 뵐게요. 주소는 등록해둔 그대로예요.'],
  ],
  [
    ['supporter', '안녕하세요, 일감 보고 지원했습니다.'],
    ['owner', '네 반갑습니다. 언제부터 가능하세요?'],
    ['supporter', '이번 주 목요일부터 가능합니다.'],
    ['owner', '금액은 올린 그대로 생각하시면 될까요?'],
    ['supporter', '네 괜찮습니다. 다만 주차가 어려우면 미리 알려주세요.'],
    ['owner', '건물 앞에 자리 있어요. 걱정 안 하셔도 됩니다.'],
  ],
  [
    ['owner', '안녕하세요. 프로필 보고 연락드려요.'],
    ['supporter', '네 안녕하세요.'],
    ['owner', '이번 주말도 혹시 되실까요?'],
    ['supporter', '토요일은 선약이 있고 일요일은 괜찮습니다.'],
    ['owner', '그럼 일요일로 할게요.'],
    ['supporter', '네 시간 정해지면 알려주세요.'],
    ['owner', '오후 2시 어떠세요?'],
    ['supporter', '좋습니다. 그때 뵙겠습니다.'],
  ],
  [
    ['supporter', '안녕하세요, 아직 사람 구하시나요?'],
    ['owner', '네 아직 구하고 있어요.'],
    ['supporter', '그럼 제가 하고 싶습니다. 필요한 준비물 있을까요?'],
    ['owner', '따로 없어요. 몸만 오시면 됩니다.'],
  ],
  [
    ['owner', '지원 감사합니다. 몇 가지만 여쭤볼게요.'],
    ['supporter', '네 편하게 물어보세요.'],
    ['owner', '혹시 근처에 사시나요?'],
    ['supporter', '차로 15분 거리예요. 이동은 문제없습니다.'],
    ['owner', '알겠습니다. 조율해서 다시 연락드릴게요.'],
  ],
  /* 아래 셋은 나중에 더 넣은 것 (형 지시 2026-08-20 "대화 두세 개 더 넣어주고").
     앞의 것들이 다 비슷하게 흘러가서, 결이 다른 상황을 골랐다 —
     금액을 조정하는 대화 · 일이 끝난 뒤의 대화 · 날짜를 미루는 대화. */
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
];

const pick = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
};

// 로그인 없이 흐름만 보기 위한 데모 계정 (형 지시 2026-08-12 — 로그인은 나중에 붙인다)
const DEMO_DEVICEID = 'demo-review-device';

/**
 * 지금 앱에 로그인된 사용자.
 * 없으면 데모 계정을 만들어 USERS 에 넣고 userconfig 에 심는다.
 * 스플래시가 userconfig.deviceid 로 사용자를 찾으므로, 이걸 심어두면 로그인 화면을 안 거친다.
 */
const loadMe = async () => {
  const cfg = await localforage.getItem('userconfig');
  if (cfg && cfg.users_id) return cfg;

  // 이미 만들어 둔 데모 계정이 있으면 재사용
  const found = await getDocs(query(collection(db, 'USERS'), where('DEVICEID', '==', DEMO_DEVICEID), limit(1)));
  let demo = null;
  found.forEach((d) => { demo = d.data(); });

  if (!demo) {
    const ref = doc(collection(db, 'USERS'));
    demo = {
      USERS_ID: ref.id,
      DEVICEID: DEMO_DEVICEID,
      DEVICETYPE: 'web',
      CREATEDT: Date.now(),
      LASTLOGINDT: Date.now(),
      ACTIVITY: [],
      REVIEWITEMS: [],
      COMMUNITYITEMS: [],
      CHATINFO: [],
      USERINFO: {
        nickname: '데모 사용자',
        userimg: '',
        phone: '01000000000',
        token: '',
        address_name: FIXED_LOCATION.address_name,
        latitude: FIXED_LOCATION.latitude,
        longitude: FIXED_LOCATION.longitude,
        users_id: ref.id,
      },
      SEEDED: true,
    };
    await setDoc(ref, demo);
  }

  // 앱(UserContext)이 쓰는 납작한 형태로 저장한다
  const flat = {
    deviceid: DEMO_DEVICEID,
    users_id: demo.USERS_ID,
    nickname: demo.USERINFO.nickname,
    userimg: demo.USERINFO.userimg || '',
    phone: demo.USERINFO.phone || '',
    token: '',
    address_name: demo.USERINFO.address_name,
    latitude: demo.USERINFO.latitude,
    longitude: demo.USERINFO.longitude,
  };
  await localforage.setItem('userconfig', flat);
  return flat;
};

/** 상대로 쓸 실제 사용자 — 닉네임이 있는 사람만 */
const loadPartners = async (myId, n) => {
  const snap = await getDocs(query(collection(db, 'USERS'), orderBy('LASTLOGINDT', 'desc'), limit(60)));
  const users = [];
  snap.forEach((d) => {
    const x = d.data();
    if (x.USERS_ID === myId) return;
    if (!x.USERINFO || !x.USERINFO.nickname) return;
    users.push(x);
  });
  if (!users.length) throw new Error('상대로 쓸 사용자를 찾지 못했습니다.');
  return pick(users, n);
};

/** 방에 물릴 실제 일감 */
const loadWorks = async (n) => {
  const snap = await getDocs(query(collection(db, 'WORK'), limit(40)));
  const works = [];
  snap.forEach((d) => works.push(d.data()));
  if (!works.length) throw new Error('일감을 찾지 못했습니다.');
  return pick(works, n);
};

/**
 * 대화방 N개와 대화를 만든다.
 * 절반은 내가 일감 주인(지원을 받은 쪽), 절반은 내가 지원한 쪽으로 섞는다.
 */
export const seedChatRooms = async (count = 5) => {
  const me = await loadMe();
  const partners = await loadPartners(me.users_id, count);
  const works = await loadWorks(count);

  const now = Date.now();
  const made = [];

  for (let i = 0; i < partners.length; i++) {
    const partner = partners[i];
    const work = works[i % works.length];
    const iAmOwner = i % 2 === 0;

    const chatRef = doc(collection(db, 'CHAT'));
    const CHAT_ID = chatRef.id;

    // 내 쪽 문서는 앱이 들고 있는 형태(users_id + USERINFO)로 맞춘다
    const meDoc = { USERS_ID: me.users_id, USERINFO: {
      nickname: me.nickname || me.USERINFO?.nickname || '나',
      userimg: me.userimg || me.USERINFO?.userimg || '',
      address_name: me.address_name || me.USERINFO?.address_name || '',
      phone: me.phone || me.USERINFO?.phone || '',
      latitude: me.latitude ?? null,
      longitude: me.longitude ?? null,
      users_id: me.users_id,
    } };

    const OWNER = iAmOwner ? meDoc : partner;
    const SUPPORTER = iAmOwner ? partner : meDoc;
    const OWNER_ID = OWNER.USERS_ID;
    const SUPPORTER_ID = SUPPORTER.USERS_ID;

    // 방마다 다른 대화. 시작 시각을 하루씩 벌려 목록 정렬이 눈에 보이게 한다.
    const script = SCRIPTS[i % SCRIPTS.length];
    const base = now - (i + 1) * 1000 * 60 * 60 * 20;

    const batch = writeBatch(db);
    let lastText = '';
    let lastAt = base;

    script.forEach((line, k) => {
      const [role, text] = line;
      const writer = role === 'owner' ? OWNER_ID : SUPPORTER_ID;
      const at = base + k * 1000 * 60 * (3 + (k % 4));
      const msgRef = doc(collection(db, `CHAT/${CHAT_ID}/messages`));
      batch.set(msgRef, {
        MESSAGE_ID: msgRef.id,
        TEXT: text,
        CREATEDT: at,
        USERS_ID: writer,
        // 내가 쓴 건 읽음, 상대가 쓴 마지막 몇 개는 안읽음으로 남겨 뱃지를 확인할 수 있게 한다
        READ: writer === me.users_id ? [me.users_id] : (k < script.length - 2 ? [OWNER_ID, SUPPORTER_ID] : [writer]),
        CHAT_CONTENT_TYPE: 'TEXT',
        SEEDED: true,
      });
      lastText = text;
      lastAt = at;
    });

    // 상대가 마지막에 남긴 안읽음 수
    const unreadForMe = script.slice(-2).filter(([role]) =>
      (role === 'owner' ? OWNER_ID : SUPPORTER_ID) !== me.users_id).length;

    batch.set(chatRef, {
      CHAT_ID,
      OWNER, OWNER_ID,
      SUPPORTER, SUPPORTER_ID,
      INFO: work,                       // 실제 DB 스키마와 동일하게 INFO 로 넣는다
      TYPE: '도움요청',
      CREATEDT: base,
      PARTICIPANTS: [OWNER_ID, SUPPORTER_ID],
      LASTMESSAGE: lastText,
      LASTMESSAGE_AT: lastAt,
      UNREAD: { [OWNER_ID]: 0, [SUPPORTER_ID]: 0, [me.users_id]: unreadForMe },
      SEEDED: true,
    });

    await batch.commit();
    made.push({ CHAT_ID, with: partner.USERINFO.nickname, work: work.WORKTYPE, messages: script.length });
  }

  return made;
};

/** 시드로 만든 방만 지운다 */
export const clearSeededChats = async () => {
  const snap = await getDocs(query(collection(db, 'CHAT'), where('SEEDED', '==', true)));
  let rooms = 0;
  for (const d of snap.docs) {
    const msgs = await getDocs(collection(db, `CHAT/${d.id}/messages`));
    const batch = writeBatch(db);
    msgs.forEach((m) => batch.delete(m.ref));
    batch.delete(d.ref);
    await batch.commit();
    rooms++;
  }
  return rooms;
};
