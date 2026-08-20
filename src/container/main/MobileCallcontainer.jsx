import React, { useContext, useEffect, useMemo, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from "react-router-dom";
import { IoCall, IoCallOutline, IoMicOff, IoMic, IoVolumeHigh } from "react-icons/io5";
import { UserContext } from "../../context/User";
import { useVoiceCall } from "../../hooks/useVoiceCall";
import {
  CALL_STATUS, CALL_END_REASON, RING_TIMEOUT_MS,
  acceptCall, endCall, readCall,
} from "../../service/CallService";
import ChatprofileImage from "../../components/ChatprofileImage";

/**
 * 보이스톡 화면 (2026-08-13)
 *
 * 들어오는 길은 둘이지만 화면은 하나다.
 *   앱을 보고 있을 때  : 상단 배너 [받기] -> 여기로
 *   앱을 안 보고 있을 때: OS 알림 -> 딥링크 -> 여기로
 *
 * 열렸을 때 이미 끝난 통화면(상대가 취소·시간초과) 부재중으로 알려준다.
 */

const pulse = keyframes`
  0%   { transform: scale(1);    opacity: 1; }
  70%  { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
`;

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #131313;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(60px + env(safe-area-inset-top)) 24px calc(40px + var(--safe-bottom));
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-top: 22px;
`;

const Status = styled.div`
  font-size: 16px;
  color: #B8B8BD;
  margin-top: 8px;
  min-height: 22px;
`;

const AvatarWrap = styled.div`
  position: relative;
  margin-top: 48px;
`;

const Ring = styled.div`
  position: absolute;
  inset: -8px;
  border-radius: 999px;
  border: 2px solid #FF4E19;
  animation: ${pulse} 1.6s ease-out infinite;
`;

const Spacer = styled.div`flex: 1;`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap || 60}px;
  width: 100%;
`;

const RoundBtn = styled.button`
  width: ${({ $size }) => $size || 72}px;
  height: ${({ $size }) => $size || 72}px;
  border-radius: 999px;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ $kind }) =>
    $kind === 'deny' ? '#E5484D' : $kind === 'accept' ? '#1a9a4b' : 'rgba(255,255,255,.16)'};
  &:active { transform: scale(0.94); }
  transition: transform .1s ease;
`;

const BtnLabel = styled.div`
  font-size: 14px;
  color: #B8B8BD;
  text-align: center;
  margin-top: 10px;
`;

const Notice = styled.div`
  font-size: 15px;
  color: #FFB4A6;
  line-height: 1.6;
  text-align: center;
  margin-top: 16px;
`;

const MobileCallcontainer = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const callId = useMemo(() => {
    const q = new URLSearchParams(location.search);
    return q.get('id') || location.state?.CALL_ID || '';
  }, [location]);

  const [initial, setInitial] = useState(null);   // 처음 읽은 문서 (부재중 판정용)
  const [accepted, setAccepted] = useState(false);
  const [ringOver, setRingOver] = useState(false);

  const isCaller = initial ? initial.callerId === user?.users_id : false;

  const {
    call, micDenied, muted, error, remoteAudioRef, connect, toggleMute, cleanup,
  } = useVoiceCall({ callId, isCaller, enabled: true });

  /* 열자마자 상태 확인 — 이미 끝난 통화일 수 있다 */
  useEffect(() => {
    if (!callId) return;
    readCall(callId).then((c) => {
      setInitial(c);
      // 건 사람이면 벨이 울리는 동안 바로 연결 준비를 시작한다
      if (c && c.callerId === user?.users_id) connect();
    });
  }, [callId, user?.users_id, connect]);

  /* 벨 시간 초과 — 건 사람 쪽에서 부재중 처리 */
  useEffect(() => {
    if (!isCaller || !call || call.status !== CALL_STATUS.CALLING) return undefined;
    const left = RING_TIMEOUT_MS - (Date.now() - (call.createdAt || Date.now()));
    const t = setTimeout(() => {
      setRingOver(true);
      endCall(callId, CALL_END_REASON.MISSED);
    }, Math.max(0, left));
    return () => clearTimeout(t);
  }, [isCaller, call?.status, call?.createdAt, callId]);

  /* 끝나면 잠깐 보여주고 닫는다 */
  useEffect(() => {
    if (call?.status !== CALL_STATUS.ENDED) return undefined;
    cleanup();
    const t = setTimeout(() => navigate('/Mobilechat', { replace: true }), 1600);
    return () => clearTimeout(t);
  }, [call?.status, cleanup, navigate]);

  const onAccept = async () => {
    setAccepted(true);
    await acceptCall(callId);
  };

  const onEnd = () => {
    const reason = call?.status === CALL_STATUS.CALLING
      ? (isCaller ? CALL_END_REASON.CANCELED : CALL_END_REASON.DECLINED)
      : CALL_END_REASON.HANGUP;
    endCall(callId, reason);
    cleanup();
    navigate('/Mobilechat', { replace: true });
  };

  const other = isCaller ? '상대방' : (initial?.callerName || '상대방');
  const status = (() => {
    if (!callId) return '통화 정보를 찾을 수 없어요';
    if (!call) return '연결 중...';
    if (call.status === CALL_STATUS.ENDED) {
      const map = {
        [CALL_END_REASON.DECLINED]: '통화를 거절했어요',
        [CALL_END_REASON.CANCELED]: '상대가 통화를 취소했어요',
        [CALL_END_REASON.MISSED]: '받지 않았어요',
        [CALL_END_REASON.FAILED]: '연결하지 못했어요',
      };
      return map[call.endReason] || '통화가 종료되었어요';
    }
    if (call.status === CALL_STATUS.CONNECTED) return '통화 중';
    if (call.status === CALL_STATUS.ACCEPTED) return '연결하는 중...';
    return isCaller ? '전화를 거는 중...' : '보이스톡이 왔어요';
  })();

  const ringing = call?.status === CALL_STATUS.CALLING;
  const talking = call?.status === CALL_STATUS.CONNECTED || call?.status === CALL_STATUS.ACCEPTED;
  const ended = call?.status === CALL_STATUS.ENDED;

  return (
    <Screen>
      <Name>{other}</Name>
      <Status>{status}</Status>

      <AvatarWrap>
        {ringing && <Ring />}
        <ChatprofileImage source={initial?.callerImg} size={120} />
      </AvatarWrap>

      {micDenied && (
        <Notice>
          마이크 권한이 없어 통화할 수 없어요.<br />
          설정에서 허용하거나 채팅으로 이어가 주세요.
        </Notice>
      )}
      {!!error && !micDenied && <Notice>{error}</Notice>}

      <Spacer />

      {/* 받는 사람이 아직 안 받았을 때 — 받기/거절 */}
      {ringing && !isCaller && !accepted && (
        <Row>
          <div>
            <RoundBtn $kind="deny" onClick={onEnd}>
              <IoCallOutline size={30} style={{ transform: 'rotate(135deg)' }} />
            </RoundBtn>
            <BtnLabel>거절</BtnLabel>
          </div>
          <div>
            <RoundBtn $kind="accept" onClick={onAccept}>
              <IoCall size={30} />
            </RoundBtn>
            <BtnLabel>받기</BtnLabel>
          </div>
        </Row>
      )}

      {/* 통화 중 — 음소거 / 끊기 */}
      {(talking || (ringing && isCaller)) && (
        <Row $gap={40}>
          <div>
            <RoundBtn $size={60} onClick={toggleMute}>
              {muted ? <IoMicOff size={24} /> : <IoMic size={24} />}
            </RoundBtn>
            <BtnLabel>{muted ? '음소거 해제' : '음소거'}</BtnLabel>
          </div>
          <div>
            <RoundBtn $kind="deny" onClick={onEnd}>
              <IoCallOutline size={30} style={{ transform: 'rotate(135deg)' }} />
            </RoundBtn>
            <BtnLabel>{ringing && isCaller ? '취소' : '통화 종료'}</BtnLabel>
          </div>
          <div>
            <RoundBtn $size={60}><IoVolumeHigh size={24} /></RoundBtn>
            <BtnLabel>스피커</BtnLabel>
          </div>
        </Row>
      )}

      {ended && (
        <Row>
          <div>
            <RoundBtn onClick={() => navigate('/Mobilechat', { replace: true })}>
              <IoCallOutline size={26} />
            </RoundBtn>
            <BtnLabel>대화방으로</BtnLabel>
          </div>
        </Row>
      )}

      {/* 상대 목소리 */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
    </Screen>
  );
};

export default MobileCallcontainer;
