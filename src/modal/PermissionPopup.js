// ✅ 권한 팝업 리팩 (형님 스타일 감성 반영: 문구 다듬기)

import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { postLog } from '../utility/common';

const PermissionPopup = ({ checkingPermission, popupStep, locationGranted, pushGranted, onClose, onConfirm, isPermissionRetried, setIsPermissionRetried }) => {
  if (locationGranted && pushGranted && popupStep === 'confirmed') {
    return null;
  }
  if (checkingPermission) return null; 

  postLog(`PermissionPopup   popupStep :${popupStep} isPermissionRetried : ${isPermissionRetried} `);

  const openSettings = (type) => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "OPEN_SETTINGS", target: type })
    );
  };

  const handleInitialPermissionRequest = () => {
    setIsPermissionRetried(true);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "REQUEST_PERMISSION" })
    );
  };

  const handleCheckOnly = () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "CHECK_INITIAL_PERMISSION" })
    );
  };

  return (
    <Overlay>
      <PopupBox>
        <Title>서비스 이용을 위한 설정 안내</Title>

        <div style={{ padding: "10px 15px", background: "#ededed" }}>
          <SubTitle>
            위치 권한
            {(!locationGranted && popupStep === 'denied_retry') && (
              <NoticeLayer>설정필요</NoticeLayer>
            )}
          </SubTitle>
          <Bullet>・주변 일감 자동 추천</Bullet>
          <Bullet>・근처 축제, 행사 정보 안내</Bullet>

          
          <SubTitle style={{ marginTop: "16px" }}>
            알림 권한
            {(!pushGranted && popupStep === 'denied_retry') && (
              <NoticeLayer>설정필요</NoticeLayer>
            )}
          </SubTitle>
          <Bullet>・실시간 요청/게시 알림</Bullet>
          <Bullet>・중요한 소식 놓치지 않게</Bullet>

          <FooterText>
             위치 기능능은  주변 정보 추천에 사용돼요.<br />
             나중에 설정하셔도 대부분 기능은 사용할 수 있어요.
          </FooterText>
        </div>

        {/* {popupStep === 'denied' && (
        <>
            <Description>
              위치 권한이 꺼져 있어요
            </Description>
            <ButtonRow>
              <ConfirmButton onClick={handleInitialPermissionRequest}>지금 설정하기</ConfirmButton>

            </ButtonRow>
          </>
        )} */}

        {/* {(popupStep === 'denied_retry' || popupStep === 'denied') && (
          <>
            <Description>
              일부 권한이 아직 허용되지 않았어요.<br />
              필요한 항목을 설정하거나 다시 확인해 주세요.<br />

            </Description>
            <ButtonRow>
              <ConfirmButton onClick={() => openSettings("all")}>설정하기</ConfirmButton>
              <ConfirmButton onClick={handleCheckOnly}>다시 확인하기</ConfirmButton>
            </ButtonRow>
          </>
        )} */}

        {popupStep === 'confirmed' && (
          <>
            <Description>
              권한이 모두 확인되었어요.<br />
              아래 버튼을 눌러 시작해 주세요.
            </Description>
            <ButtonRow>
              <ConfirmButton onClick={onConfirm}>시작하기</ConfirmButton>
            </ButtonRow>
          </>
        )}

        {popupStep === 'waiting' && (
          <Description>
            설정 확인 중입니다... 잠시만 기다려 주세요.
          </Description>
        )}
      </PopupBox>
    </Overlay>
  );
};

export default PermissionPopup;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PopupBox = styled.div`
  width: 75%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: Pretendard-SemiBold;
  color: #111;
  margin-bottom: 12px;
`;

const SubTitle = styled.div`
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-SemiBold;
  color: #222;
  margin: 12px 0 4px;
`;

const Description = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: #444;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
`;

const ConfirmButton = styled.button`
  padding: 14px 20px;
  border-radius: 10px;
  background: #1A1E28;
  color: #fff;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-SemiBold;
  border: none;
  transition: all 0.2s;
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

const NoticeLayer = styled.div`
  padding: 14px 20px;
  border-radius: 10px;
  color: #ff7e19;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-SemiBold;
  border: none;
  transition: all 0.2s;
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

const Bullet = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #444;
  margin-left: 8px;
  margin-bottom: 4px;
`;

const FooterText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #777;
  margin-top: 20px;
  line-height: 1.5;
`;
