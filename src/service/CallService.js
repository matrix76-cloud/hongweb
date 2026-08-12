// 보이스톡 (2026-08-13)
//
// 통화 한 건 = CALL 문서 하나. 양쪽이 이 문서를 보면서 상태를 맞춘다.
//   calling   건 사람이 대기 중 (벨 울리는 중)
//   accepted  받는 사람이 받기를 눌렀다 -> 연결 시작
//   connected 서로 소리가 오간다
//   ended     끝났다 (거절·부재중·정상종료 전부 여기로, reason 으로 구분)
//
// 시그널링(offer/answer/candidate)도 이 문서 안에서 주고받는다.
// 별도 서버 없이 Firestore 만으로 된다.
//
// 받는 입구는 둘이지만(인앱 배너 / OS 알림) 나가는 문은 하나다 — /Mobilecall?id=xxx

import {
  addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp,
  setDoc, updateDoc, arrayUnion,
} from 'firebase/firestore';
import { db } from '../api/config';
import { notifyVoiceCall } from './notiService';

export const CALL_STATUS = {
  CALLING: 'calling',
  ACCEPTED: 'accepted',
  CONNECTED: 'connected',
  ENDED: 'ended',
};

export const CALL_END_REASON = {
  DECLINED: 'declined',     // 받는 사람이 거절
  CANCELED: 'canceled',     // 건 사람이 취소
  MISSED: 'missed',         // 45초 안에 안 받음
  HANGUP: 'hangup',         // 통화 후 정상 종료
  FAILED: 'failed',         // 연결 실패
};

/** 벨이 울리는 시간. 서버 푸시 만료(45초)와 맞춘다. */
export const RING_TIMEOUT_MS = 45 * 1000;

const callRef = (CALL_ID) => doc(collection(db, 'CALL'), CALL_ID);

/**
 * 통화 걸기 — 문서를 만들고 상대에게 푸시를 보낸다.
 * 푸시의 link 가 곧 "받기"의 실체다. 누르면 그 화면이 열린다.
 */
export const startCall = async ({ callerId, callerName, calleeId, chatId }) => {
  const ref = await addDoc(collection(db, 'CALL'), {
    callerId,
    callerName: callerName || '',
    calleeId,
    chatId: chatId || null,
    status: CALL_STATUS.CALLING,
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
  });

  await notifyVoiceCall({
    targetId: calleeId,
    callerName,
    callId: ref.id,
  });

  return ref.id;
};

/** 받기 */
export const acceptCall = (CALL_ID) =>
  updateDoc(callRef(CALL_ID), { status: CALL_STATUS.ACCEPTED, acceptedAt: Date.now() });

/** 연결 완료 표시 */
export const markConnected = (CALL_ID) =>
  updateDoc(callRef(CALL_ID), { status: CALL_STATUS.CONNECTED, connectedAt: Date.now() });

/** 끝내기 — 거절·취소·부재중·정상종료 전부 이 함수로 */
export const endCall = (CALL_ID, reason = CALL_END_REASON.HANGUP) =>
  updateDoc(callRef(CALL_ID), {
    status: CALL_STATUS.ENDED,
    endReason: reason,
    endedAt: Date.now(),
  }).catch(() => {});

export const readCall = async (CALL_ID) => {
  const snap = await getDoc(callRef(CALL_ID));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/** 통화 상태 구독 — 양쪽 화면이 이걸로 서로를 본다 */
export const subscribeCall = (CALL_ID, cb) =>
  onSnapshot(callRef(CALL_ID), (snap) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });

/* ── 시그널링 (WebRTC) ─────────────────────────────
   offer/answer 는 문서 필드에, candidate 는 하위 컬렉션에 쌓는다.
   candidate 는 수십 개가 오가므로 배열보다 컬렉션이 안전하다. */

export const setOffer = (CALL_ID, offer) =>
  updateDoc(callRef(CALL_ID), { offer: JSON.stringify(offer) });

export const setAnswer = (CALL_ID, answer) =>
  updateDoc(callRef(CALL_ID), { answer: JSON.stringify(answer) });

export const addCandidate = (CALL_ID, who, candidate) =>
  addDoc(collection(db, 'CALL', CALL_ID, `${who}Candidates`), {
    ...candidate.toJSON ? candidate.toJSON() : candidate,
    at: Date.now(),
  });

export const subscribeCandidates = (CALL_ID, who, cb) =>
  onSnapshot(collection(db, 'CALL', CALL_ID, `${who}Candidates`), (snap) => {
    snap.docChanges().forEach((c) => {
      if (c.type === 'added') cb(c.doc.data());
    });
  });
