// 🔧 최신 탭 + 구분선 연동 완전 적용 (UI 구조 반영)
import ReactDOM from "react-dom";
import React from "react";
import styled from 'styled-components';
import { getFontSize } from "../utility/fontsize";

const Overlay = styled.div`
  position: fixed;
  top: 20px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SimulatorWrapper = styled.div`
  transform: scale(0.8);
  transform-origin: center;
`;

const SimulatorFrame = styled.div`
  width: 300px;
  height: 620px;
  background: #fff;
  border: 12px solid #000;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 24px rgba(0,0,0,0.4);
`;

const Notch = styled.div`
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 20px;
  background: black;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  z-index: 1;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 32px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  font-size: ${() => getFontSize(28)}px !important;
  color: #fff;
  background: rgba(0,0,0,0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-Bold';
  text-align: center;
  margin-bottom: 12px;
  color: #fff;
`;

const IntroVideoModal = ({ videoUrl, onClose }) => {
    return ReactDOM.createPortal(
        <Overlay onClick={onClose}>
            <SimulatorWrapper>
                <SimulatorFrame onClick={(e) => e.stopPropagation()}>
                    <Notch />
                    <Title>자기소개 영상</Title>
                    <VideoPlayer controls autoPlay>
                        <source src={videoUrl} type="video/mp4" />
                        영상이 지원되지 않는 브라우저입니다.
                    </VideoPlayer>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </SimulatorFrame>
            </SimulatorWrapper>
        </Overlay>,
        document.getElementById("modal-root")
    );
};

export default IntroVideoModal;