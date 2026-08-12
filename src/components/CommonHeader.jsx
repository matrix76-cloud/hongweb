// CommonHeader.jsx - 구해줘 홍여사 전용 헤더 컴포넌트

import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getFontSize, HEADER_TOP_EXTRA } from '../utility/fontsize';
import { IoArrowBackOutline, IoCloseOutline } from 'react-icons/io5';
import { UserContext } from '../context/User';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../api/config';
import { getBackTarget } from '../utility/navigationUtil';

const headerPresets = {
    default: {
        hasBackButton: true,
        hasRightButton: false,
        shadow: true,
    },
    confirm: {
        hasBackButton: true,
        hasRightButton: true,
        rightButtonText: '완료',
        shadow: true,
    },
    modal: {
        hasBackButton: 'close',
        hasRightButton: false,
        shadow: false,
    },
    clean: {
        hasBackButton: false,
        hasRightButton: false,
        shadow: false,
    }
};



const CommonHeader = ({
    title = '',
    pattern = '',
    pageId ='',
    hasBackButton,
    hasRightButton,
    rightButtonText,
    onRightButtonClick,
    onRightImageClick,
    backTo,
    onBackPressed,
    fixed = true,
    rightImage,
    videoCallIcon,
    shadow,
    variant = 'default',
    titleAlign = 'center'
}) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const preset = pattern && headerPresets[pattern] ? headerPresets[pattern] : {};

    const finalProps = {
        hasBackButton: preset.hasBackButton ?? hasBackButton,
        hasRightButton: preset.hasRightButton ?? hasRightButton,
        rightButtonText: preset.rightButtonText ?? rightButtonText,
        shadow: preset.shadow ?? shadow,
    };

    useEffect(() => {
        const handler = (event) => {
            console.log("메시지 수신:", event);
            try {


                // 문자열일 때만 JSON 파싱 시도
                const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

                if (msg.type === 'BACK_PRESSED') {

                    if (user?.popupOpen) {
                        console.log("팝업 열려있어서 뒤로가기 무시됨");
                        return;
                    }
                    

                    console.error("BACK_PRESSED 이벤트 수신:", msg);
                    if (onBackPressed) {
                        console.error("사용자 정의 onBackPressed 호출");
                        onBackPressed();
                    }
                    else if (backTo) {
                        console.error("backTo 경로로 이동:", backTo);
                        navigate(backTo);  
                    }
                    else {
                        console.error("기본 뒤로가기 동작 실행");
                        navigate(-1);
                    } 
                }
            } catch (e) { 
                console.error("메시지 파싱 오류:", e, "받은 데이터:", event.data);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [onBackPressed, backTo]);

    // ✅ 실사용자만 5초 후부터 활동 기록 시작
    // simulate 유저는 기록 차단 (시뮬레이터는 조용히 관찰만)
    useEffect(() => {
        if (!user?.USERS_ID || user.simulate) return;

        const timeout = setTimeout(() => {
            const updateLastActive = () => {
                const userRef = doc(db, 'USERS', user.USERS_ID);
                updateDoc(userRef, {
                    lastActiveAt: serverTimestamp(),
                });
            };

            updateLastActive(); // 1회 전송
            const interval = setInterval(updateLastActive, 60000); // 이후 1분 간격

            // ✅ 정리
            return () => clearInterval(interval);
        }, 5000); // ✅ 5초 지연 후 시작

        return () => clearTimeout(timeout);
    }, [user?.USERS_ID, user?.simulate]);

    useEffect(() => {
        return () => {
            const mapDiv = document.getElementById("map");
            if (mapDiv) mapDiv.remove(); // ✅ 지도 DOM 제거
        };
    }, []);

    const handleBack = () => {
        if (onBackPressed) {
            return onBackPressed();   // ✅ 사용자 정의 동작이 있다면 우선 실행
          }
        const target = getBackTarget(pageId);
        if (target) {
            navigate(target);
        } else {
            window.history.back();
        }
    }

    return (
        <HeaderWrapper fixed={fixed} shadow={finalProps.shadow}>
            {finalProps.hasBackButton && (
                <IconWrapper onClick={handleBack}>
                    {finalProps.hasBackButton === 'close' ? (
                        <IoCloseOutline size={24} color="#333" />
                    ) : (
                        <IoArrowBackOutline size={24} color="#333" />
                    )}
                </IconWrapper>
            )}
            <TitleArea align={titleAlign}>
                <Title>{title}</Title>
            </TitleArea>
            {finalProps.hasRightButton && (
                <StyledRightButton onClick={onRightButtonClick}>
                    {finalProps.rightButtonText}
                </StyledRightButton>
            )}

            <RightSection>
                {videoCallIcon}
                {rightImage && (
                    
                    <RightImg src={rightImage} alt="우측 이미지"
                        effect="blur"
                        onClick={onRightImageClick} // ✅ 클릭 핸들러 추가
                    />
                )}
            </RightSection>

     

        </HeaderWrapper>
    );
};

export default CommonHeader;

const RightSection = styled.div`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RightImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const HeaderWrapper = styled.div`
  position: ${({ fixed }) => (fixed ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  width: 100%;

  padding-top: calc(env(safe-area-inset-top, 0px) + ${8 + HEADER_TOP_EXTRA}px);
  padding-bottom: ${8 + HEADER_TOP_EXTRA}px;
  padding-left: 16px;
  padding-right: 16px;
  min-height: 52px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--surface);
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
  box-sizing: border-box;
  z-index: 999;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  &::before{
    content:"";
    position: fixed;
    top: 0; left: 0; right: 0;
    height: env(safe-area-inset-top, 0px);
    background: rgba(0,0,0,0.72);
    z-index: 998;
    pointer-events: none;
  }
`;

const TitleArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align === 'left' ? 'flex-start' : 'center'};
  text-align: ${({ align }) => align === 'left' ? 'left' : 'center'};
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 32px;
  height: 32px;
  margin-left: -8px; // ✅ 왼쪽 여백 줄이기
`;

const StyledRightButton = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  font-family: 'Pretendard-Regular';
  background: #ff7e19;
  color: #fff;
  padding: 3px 8px;
  border-radius: 8px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right:20px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #111;
  }
`;