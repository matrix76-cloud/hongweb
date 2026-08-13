// 리뷰 스레드 저장소 (2026-08-13)
//
// 로컬에서는 Vite 개발 플러그인이 _docs/review_thread.json 에 저장한다.
// 그런데 그 플러그인은 apply:'serve' 라 배포본에는 없다 — 그래서 배포한 주소에서는
// /review 가 동작하지 않았다(형 지적).
//
// 배포본에서도 폰으로 실물을 보며 메모를 남길 수 있어야 하므로 Firestore 를 쓴다.
//   · 로컬(dev)  : 기존 파일 API 그대로 (지금까지 쌓인 기록을 계속 본다)
//   · 배포(prod) : Firestore reviewThreads 컬렉션
//
// 문서 하나 = 기록 하나 { screenId, by, at, text, replyTo, pins, imgs, ts }

import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where,
} from 'firebase/firestore';
import { db } from '../api/config';

const COL = 'reviewThreads';
const isDev = import.meta.env.DEV;

const kstNow = () =>
  new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 16);

/** 화면별로 묶어서 돌려준다 — { screenId: [기록, ...] } */
export const loadThread = async () => {
  if (isDev) {
    try {
      const r = await fetch('/__review_thread');
      return await r.json();
    } catch {
      return {};
    }
  }

  const snap = await getDocs(query(collection(db, COL), orderBy('ts', 'asc')));
  const all = {};
  snap.forEach((d) => {
    const v = d.data();
    if (!v.screenId) return;
    if (!all[v.screenId]) all[v.screenId] = [];
    all[v.screenId].push({
      pid: d.id,
      by: v.by,
      at: v.at,
      text: v.text || '',
      replyTo: v.replyTo || undefined,
      pins: v.pins || undefined,
      imgs: v.imgs || undefined,
    });
  });
  return all;
};

/** 기록 추가 */
export const postEntry = async ({ id, by, text, pins, images, replyTo }) => {
  if (isDev) {
    await fetch('/__review_thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, by, text, pins, images, replyTo }),
    });
    return true;
  }

  const payload = {
    screenId: id,
    by: by || '형',
    text: (text || '').trim(),
    at: kstNow(),
    ts: serverTimestamp(),
  };
  if (replyTo) payload.replyTo = replyTo;
  if (Array.isArray(pins) && pins.length) payload.pins = pins.slice(0, 30);
  // 배포본에서는 스샷을 dataURL 그대로 넣는다. 문서 1MB 제한이 있어 한 장만, 그리고 작게.
  if (Array.isArray(images) && images.length) payload.imgs = images.slice(0, 1);

  await addDoc(collection(db, COL), payload);
  return true;
};

/** 삭제 — 글을 지우면 그 글의 답글도 함께 */
export const deleteEntry = async ({ id, pid }) => {
  if (isDev) {
    await fetch('/__review_thread', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pid }),
    });
    return true;
  }

  await deleteDoc(doc(db, COL, pid));
  const snap = await getDocs(query(collection(db, COL), where('replyTo', '==', pid)));
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, COL, d.id))));
  return true;
};
