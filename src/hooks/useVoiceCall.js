import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CALL_STATUS, CALL_END_REASON, addCandidate, endCall, markConnected,
  setAnswer, setOffer, subscribeCall, subscribeCandidates,
} from '../service/CallService';

/**
 * 보이스톡 연결 (2026-08-13)
 *
 * 서버를 따로 두지 않는다. 주고받는 신호는 전부 Firestore(CALL 문서)를 거친다.
 *   건 사람  : offer 만듦 -> answer 기다림
 *   받은 사람: offer 보고 answer 만듦
 * 서로의 후보(candidate)는 하위 컬렉션으로 흘려보낸다.
 *
 * ※ 같은 통신사·공유기 뒤에 있으면 STUN 만으로 대개 붙는다.
 *   회사망처럼 막힌 곳에서는 TURN 이 있어야 하는데, 그건 유료라 나중에 붙인다.
 */

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export const useVoiceCall = ({ callId, isCaller, enabled }) => {
  const [call, setCall] = useState(null);          // CALL 문서
  const [micReady, setMicReady] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState('');

  const pcRef = useRef(null);
  const localRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const startedRef = useRef(false);

  /* 통화 문서 구독 — 양쪽 상태를 여기서 맞춘다 */
  useEffect(() => {
    if (!callId) return undefined;
    return subscribeCall(callId, setCall);
  }, [callId]);

  /** 마이크 확보 */
  const getMic = useCallback(async () => {
    if (localRef.current) return localRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localRef.current = stream;
      setMicReady(true);
      return stream;
    } catch (e) {
      console.error('[call] 마이크 실패', e);
      setMicDenied(true);
      setError('마이크를 사용할 수 없어요');
      return null;
    }
  }, []);

  /** 연결 시작 — 받기 이후에만 부른다 */
  const connect = useCallback(async () => {
    if (startedRef.current || !callId) return;
    startedRef.current = true;

    const stream = await getMic();
    if (!stream) { endCall(callId, CALL_END_REASON.FAILED); return; }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = e.streams[0];
        remoteAudioRef.current.play?.().catch(() => {});
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') markConnected(callId);
      if (['failed', 'disconnected'].includes(pc.connectionState)) {
        setError('연결이 끊겼어요');
      }
    };

    const me = isCaller ? 'caller' : 'callee';
    const peer = isCaller ? 'callee' : 'caller';

    pc.onicecandidate = (e) => {
      if (e.candidate) addCandidate(callId, me, e.candidate).catch(() => {});
    };
    const stopCand = subscribeCandidates(callId, peer, (c) => {
      pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
    });

    if (isCaller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await setOffer(callId, offer);
    }

    return stopCand;
  }, [callId, isCaller, getMic]);

  /* 받는 사람: offer 가 오면 answer 를 만든다 */
  useEffect(() => {
    const pc = pcRef.current;
    if (!pc || isCaller || !call?.offer || pc.currentRemoteDescription) return;
    (async () => {
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(call.offer)));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await setAnswer(callId, answer);
    })().catch((e) => console.error('[call] answer 실패', e));
  }, [call?.offer, isCaller, callId]);

  /* 건 사람: answer 가 오면 받는다 */
  useEffect(() => {
    const pc = pcRef.current;
    if (!pc || !isCaller || !call?.answer || pc.currentRemoteDescription) return;
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(call.answer)))
      .catch((e) => console.error('[call] answer 적용 실패', e));
  }, [call?.answer, isCaller]);

  /* 수락되면 연결 시작 */
  useEffect(() => {
    if (!enabled) return;
    if (call?.status === CALL_STATUS.ACCEPTED || call?.status === CALL_STATUS.CONNECTED) {
      connect();
    }
  }, [call?.status, enabled, connect]);

  /** 마이크 음소거 */
  const toggleMute = useCallback(() => {
    const stream = localRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((t) => { t.enabled = !next; });
    setMuted(next);
  }, [muted]);

  /** 정리 — 화면을 벗어나면 반드시 마이크를 놓아준다 */
  const cleanup = useCallback(() => {
    try { pcRef.current?.close(); } catch { /* noop */ }
    pcRef.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    startedRef.current = false;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  return { call, micReady, micDenied, muted, error, remoteAudioRef, connect, toggleMute, cleanup };
};
