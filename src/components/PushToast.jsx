import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { onForegroundMessage } from "../service/fcmService";
import { imageDB } from "../utility/imageData";
import { IoCall, IoCallOutline } from "react-icons/io5";

/**
 * 화면 상단 인앱 푸시 (형 지시 2026-08-12)
 *
 * 화면을 보고 있을 때는 OS 알림이 뜨지 않는다(브라우저 규칙).
 * 그래서 포그라운드 메시지를 받아 상단에 직접 띄운다. 카톡 배너와 같은 자리.
 * 누르면 해당 화면으로 이동, 5초 뒤 자동으로 사라진다.
 */

const slideIn = keyframes`
  from { transform: translate(-50%, -120%); opacity: 0; }
  to   { transform: translate(-50%, 0);     opacity: 1; }
`;

const Bar = styled.div`
  position: fixed;
  top: calc(10px + env(safe-area-inset-top));
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(92vw, 420px);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  box-shadow: 0 6px 24px rgba(0, 0, 0, .16);
  cursor: pointer;
  animation: ${slideIn} .22s ease-out;
`;

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: contain;
  flex: none;
`;

const Texts = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Body = styled.div`
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.4;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* 보이스톡은 "지금 받아야" 의미가 있어 다른 알림과 다르게 보여준다 (형 지시 2026-08-12) */
const CallActions = styled.div`
  display: flex;
  gap: 8px;
  flex: none;
`;

const CallBtn = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 22px;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $deny }) => ($deny ? '#E5484D' : '#1a9a4b')};
  &:active { transform: scale(0.94); }
  transition: transform .1s ease;
`;

const Close = styled.button`
  flex: none;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #A3A3A3;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  &:active { background: #F4F4F4; }
`;

const PushToast = () => {
  const [noti, setNoti] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let unsub = () => {};
    let timer = null;

    (async () => {
      unsub = await onForegroundMessage((n) => {
        setNoti(n);
        clearTimeout(timer);
        // 통화 요청은 받을 시간을 줘야 하므로 오래 띄운다
        timer = setTimeout(() => setNoti(null), n.type === 'voicecall' ? 30000 : 5000);
      });
    })();

    // 리뷰 화면 등에서 실제 발송 없이 모양을 확인할 때 쓴다
    const onPreview = (e) => {
      setNoti(e.detail);
      clearTimeout(timer);
      timer = setTimeout(() => setNoti(null), e.detail?.type === 'voicecall' ? 30000 : 5000);
    };
    window.addEventListener('push:preview', onPreview);

    return () => {
      try { unsub(); } catch { /* noop */ }
      window.removeEventListener('push:preview', onPreview);
      clearTimeout(timer);
    };
  }, []);

  if (!noti) return null;

  const go = () => {
    setNoti(null);
    if (noti.link) navigate(noti.link);
  };

  const isCall = noti.type === 'voicecall';

  return (
    <Bar onClick={isCall ? undefined : go}>
      <Logo src={imageDB.logo2} alt="" />
      <Texts>
        <Title>{noti.title}</Title>
        {noti.body && <Body>{noti.body}</Body>}
      </Texts>

      {isCall ? (
        <CallActions>
          <CallBtn title="거절" $deny onClick={(e) => { e.stopPropagation(); setNoti(null); }}>
            <IoCallOutline style={{ transform: 'rotate(135deg)' }} />
          </CallBtn>
          <CallBtn title="받기" onClick={(e) => { e.stopPropagation(); go(); }}>
            <IoCall />
          </CallBtn>
        </CallActions>
      ) : (
        <Close onClick={(e) => { e.stopPropagation(); setNoti(null); }}>×</Close>
      )}
    </Bar>
  );
};

export default PushToast;
