import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SIGNALING_COLLECTION, VIDEO_LAYER_Z_INDEX } from './constants';
import { getFontSize } from '../../utility/fontsize';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/config";
import { Toaster, toast } from 'sonner';
import { imageDB } from '../../utility/imageData';

const VideoChatModal = ({
  localRef,
  remoteRef,
  inCall,
  isCaller,
  startCall,
  chatId,
  acceptCall,
  endCall,
  waiting,
  onClose,
  calleeName,
  calleeProfileImg
}) => {
  const [isLocalFull, setIsLocalFull] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (!chatId) return;
    let wasEverConnected = false;

    const unsub = onSnapshot(
      doc(db, SIGNALING_COLLECTION, `${chatId}_offer`),
      (docSnap) => {
        if (docSnap.exists()) {
          wasEverConnected = true;
        } else if (wasEverConnected) {
          console.log("👋 상대방이 통화를 종료했습니다");
          toast("상대방이 통화를 종료했습니다");
          onClose();
        }
      }
    );

    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    if (!inCall) return;
    if (isCaller) {
      console.log("📞 발신자: startCall 실행");
      const cleanup = startCall();
      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    } else {
      console.log("📞 수신자: acceptCall 실행");
      acceptCall();
    }
  }, [inCall, isCaller]);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Backdrop>
      <Container>
        <VideoHeaderLabel>구해줘 알바 영상채팅</VideoHeaderLabel>

        {isLocalFull ? (
          <>
            <LargeVideo ref={localRef} autoPlay muted playsInline />
            <MiniVideoWrapper onClick={() => setIsLocalFull(false)}>
              <MiniVideo ref={remoteRef} autoPlay playsInline muted={false} />
              <SwapIcon>↔️</SwapIcon>
            </MiniVideoWrapper>
          </>
        ) : (
          <>
            <LargeVideo ref={remoteRef} autoPlay playsInline muted={false} />
            <MiniVideoWrapper onClick={() => setIsLocalFull(true)}>
              <MiniVideo ref={localRef} autoPlay muted playsInline />
              <SwapIcon>↔️</SwapIcon>
            </MiniVideoWrapper>
          </>
        )}

        <CloseButton onClick={onClose}>통화 종료</CloseButton>

        {!introDone && (
          <IntroOverlay>
            <IntroImage src={imageDB.hongchatsplash} alt="intro" />
          </IntroOverlay>
        )}

        {introDone && waiting && (
          <LargeImageOverlay>
            <FullProfileImage src={calleeProfileImg} alt="callee" />
            <WaitingMessage>
              <CalleeName>{calleeName}</CalleeName>
              <SubText>응답 대기중...</SubText>
            </WaitingMessage>
          </LargeImageOverlay>
        )}
      </Container>
    </Backdrop>
  );
};

export default VideoChatModal;


const LargeImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FullProfileImage = styled.img`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const WaitingMessage = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: ${VIDEO_LAYER_Z_INDEX};
  background: #FFF;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #FFF;
`;

const VideoHeaderLabel = styled.div`
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(0 0 0 / 10%)
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  color: #FFF;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const LargeVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MiniVideoWrapper = styled.div`
  position: absolute;
  bottom: 100px;
  right: 20px;
  width: 120px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 10;
`;

const MiniVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SwapIcon = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #FF7125;
  color: #fff;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: bold;
  border: none;
  width: auto;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  font-size: 16px;
  z-index: 9999;
`;

const IntroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #fff;
`;

const IntroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 999;
  background: #fff;
`;

const RemoteOverlayAtSameSpot = styled.div`
  position: absolute;
  top: 120px;
  left: 20px;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RotatingCircle = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
`;

const rotateLoading = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CircleOutline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid #eee;
  border-top-color: #FF7125;
  animation: ${rotateLoading} 1.5s linear infinite;
  box-sizing: border-box;
`;

const ProfileImageWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 94px;
  height: 94px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 94px;
  height: 94px;
  object-fit: cover;
  border-radius: 50%;
`;

const NameRow = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CalleeName = styled.div`
  font-size: ${() => `${getFontSize(14)}px`} !important;
  font-weight: 600;
  color: #000;
  margin-right: 6px;
`;

const SubText = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  color: #666;
`;
