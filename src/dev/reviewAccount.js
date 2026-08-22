/**
 * 심사용 계정 되돌리기 (개발 전용) — 리뷰 페이지 버튼으로 실행한다. (형 지시 2026-08-21)
 *
 * 마켓 심사 동안에는 심사하는 분이 아이디·비밀번호로 들어와 앱을 둘러본다.
 * 그런데 그 계정으로 결제를 눌러보거나 수수료를 수락·거절해버리면 상태가 바뀌어,
 * 다음 심사 때는 "계약 완료 · 결제 바로 가능" 한 방이 하나도 없게 된다.
 *
 * 이 버튼 하나로 처음 만들어둔 모습으로 되돌린다 —
 * 대화방 여섯 개(계약 완료 셋 포함)와 이 계정이 올린 일감 셋.
 */
import {
  collection, deleteDoc, doc, getDoc, getDocs, limit, query, where, writeBatch,
} from 'firebase/firestore';
import { db } from '../api/config';
import { seedChatRooms } from './seedChat';

/** 심사에 넘기는 계정. scripts/make_test_account.mjs 가 만드는 것과 같아야 한다. */
export const REVIEW_ACCOUNT = {
  email: 'test@hongyeosa.com',
  password: 'hong1234',
};

/** 심사 계정의 USERS 문서를 찾는다 */
const loadReviewUser = async () => {
  const snap = await getDocs(query(
    collection(db, 'USERS'), where('EMAIL', '==', REVIEW_ACCOUNT.email), limit(1),
  ));
  let found = null;
  snap.forEach((d) => { found = d.data(); });
  if (!found) {
    throw new Error(`${REVIEW_ACCOUNT.email} 계정이 없습니다. 터미널에서 node scripts/make_test_account.mjs 를 한 번 돌려주세요.`);
  }
  // seedChatRooms 가 쓰는 납작한 형태로 맞춘다
  return {
    users_id: found.USERS_ID,
    nickname: found.USERINFO?.nickname || '테스트계정',
    userimg: found.USERINFO?.userimg || '',
    phone: found.USERINFO?.phone || '',
    address_name: found.USERINFO?.address_name || '',
    latitude: found.USERINFO?.latitude ?? null,
    longitude: found.USERINFO?.longitude ?? null,
  };
};

/** 이 계정에 물려 있던 시드 대화방을 지운다 (사람이 실제로 만든 방은 건드리지 않는다) */
const clearRooms = async (USERS_ID) => {
  const seen = new Set();
  for (const field of ['OWNER_ID', 'SUPPORTER_ID']) {
    const snap = await getDocs(query(collection(db, 'CHAT'), where(field, '==', USERS_ID)));
    for (const d of snap.docs) {
      if (seen.has(d.id) || d.data().SEEDED !== true) continue;
      seen.add(d.id);
      const msgs = await getDocs(collection(db, `CHAT/${d.id}/messages`));
      const batch = writeBatch(db);
      msgs.forEach((m) => batch.delete(m.ref));
      batch.delete(d.ref);
      await batch.commit();
    }
  }
  return seen.size;
};

/** 이 계정이 올린 일감을 다시 만든다 — 내 정보 > 등록한 일감이 비어 있으면 볼 것이 없다 */
const remakeWorks = async (USERS_ID, count = 3) => {
  // 전에 만들어둔 것은 지운다 (여러 번 눌러도 늘어나지 않게)
  const mine = await getDocs(query(collection(db, 'WORK'), where('USERS_ID', '==', USERS_ID)));
  for (const d of mine.docs) {
    if (d.data().SEEDED === true) await deleteDoc(d.ref);
  }

  // 이미 들어가 있는 시드 일감을 이 계정 이름으로 복제한다
  const src = await getDocs(query(collection(db, 'WORK'), limit(40)));
  const pool = [];
  src.forEach((d) => {
    const v = d.data();
    if (String(v.USERS_ID || '').startsWith('seed_')) pool.push(v);
  });
  if (!pool.length) throw new Error('복제할 시드 일감이 없습니다.');

  const day = 24 * 60 * 60 * 1000;
  const made = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const base = pool[(i * 3) % pool.length];
    const ref = doc(collection(db, 'WORK'));
    const batch = writeBatch(db);
    batch.set(ref, {
      ...base,
      WORK_ID: ref.id,
      USERS_ID,
      VIEW_COUNT: 12 + i * 7,
      APPLY_COUNT: 1 + (i % 3),
      CREATEDT: Date.now() - (i + 1) * day,
      SEEDED: true,
    });
    await batch.commit();
    made.push(base.WORKTYPE || '일감');
  }
  return made;
};

/**
 * 심사 계정을 처음 상태로 되돌린다.
 * 돌려주는 값으로 리뷰 페이지가 무엇이 만들어졌는지 보여준다.
 */
export const restoreReviewAccount = async () => {
  const me = await loadReviewUser();

  const removed = await clearRooms(me.users_id);
  const rooms = await seedChatRooms(undefined, me);
  const works = await remakeWorks(me.users_id, 3);

  return {
    email: REVIEW_ACCOUNT.email,
    password: REVIEW_ACCOUNT.password,
    nickname: me.nickname,
    removed,
    rooms,
    works,
  };
};
