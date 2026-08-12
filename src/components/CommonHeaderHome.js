// components/CommonHeaderHome.jsx
import React, { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoChatbubbleEllipsesOutline, IoSearchOutline } from 'react-icons/io5';
import { getFontSize, HEADER_TOP_EXTRA } from '../utility/fontsize';
import { UserContext } from '../context/User';
import { SubKeywordAddress } from '../utility/region';
import { useNoticeStatus } from '../hooks/useNoticeStatus';
import { useUnreadChatCount } from '../hooks/useUnreadChatCount';
import { CONFIGMOVE } from '../utility/screen';
import { imageDB } from '../utility/imageData';
import { useNavigate } from 'react-router-dom';
import { Row } from '../common/Row';
import AIQuickAskBar from './AIQuickAskBar';
import { usePolicyNewsStatus } from '../hooks/usePolicyNewsStatus';
import { LIFEMENU } from '../utility/life';
import MobileGpsPopup from '../modal/MobileGpsPopup/MobileGpsPopup';
import { REGION_COORDS } from '../utility/constants';

const CommonHeaderHome = ({ onBackPressed }) => {
  const { user, dispatch } = useContext(UserContext);

  const address_name = user?.USERINFO?.address_name || '위치 확인중';
  const hasUnread = useNoticeStatus();
  const { hasNewNews } = usePolicyNewsStatus();
  const { totalUnread } = useUnreadChatCount(user?.USERS_ID);
  const [showRegionPopup, setShowRegionPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      const mapDiv = document.getElementById("map");
      if (mapDiv) mapDiv.remove(); // ✅ 지도 DOM 제거
    };
  }, []);

  const handleNoticeClick = () => {
    navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.NEWS, TYPE: "" } });
  };

  const handleAIClick = () => {
    navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.AIBOARD, TYPE: "" } });
  };

  const handleDevCenterClick = () => {
    navigate("/Mobileconfigcontent", {
      state: { NAME: CONFIGMOVE.DEVINTRO },
    });
  };

  const handleChatClick = () => {
    navigate("/Mobilechat");
  };

  const handleRegionSelect = ({ sido, gu }) => {
    const key = gu === "전체" ? sido : `${sido} ${gu}`;
    const coords = REGION_COORDS[key] || REGION_COORDS[sido];
    const newRadius = gu === "전체" ? 30 : 10;

    dispatch({
      USERINFO: {
        latitude: coords.lat,
        longitude: coords.lng,
        address_name: gu === "전체" ? `${sido} 전체` : `${sido} ${gu}`,
        radiusKm: newRadius,
      },
    });
    setShowRegionPopup(false);
  };

  useEffect(() => {
    const handler = (event) => {
      try {
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (msg.type === 'BACK_PRESSED') {
          if (user?.popupOpen) {
            console.log("팝업 열려있어서 뒤로가기 무시됨");
            return;
          }

          if (onBackPressed) {
            onBackPressed();
          } else {
            navigate(-1);
          }
        }
      } catch (e) {
        console.error("메시지 파싱 오류:", e, "받은 데이터:", event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onBackPressed, navigate, user?.popupOpen]);

  return (
    <>
      <HeaderWrapper>
        <FlexHeader>
          <LeftSection onClick={() => setShowRegionPopup(true)}>
            <HiOutlineLocationMarker size={20} color="#F75100" />
            <LocationText>{SubKeywordAddress(address_name)}</LocationText>
          </LeftSection>

          <CenterSection />

          <RightSection>
            <SearchBtn onClick={() => navigate("/MobileJobSearch")} aria-label="검색">
              <IoSearchOutline size={22} color="#555" />
            </SearchBtn>

            <ChatIconWrapper onClick={handleChatClick}>
              <IoChatbubbleEllipsesOutline size={24} color="#555" />
              {totalUnread > 0 && (
                <ChatUnreadBadge>{totalUnread > 99 ? '99+' : totalUnread}</ChatUnreadBadge>
              )}
            </ChatIconWrapper>

            <NoticeIconWrapper onClick={handleNoticeClick}>
              <img src={imageDB.ic_myinfo_menu_alert} style={{ width: 24 }} alt="알림" />
              {hasUnread && <RedDot />}
            </NoticeIconWrapper>
          </RightSection>
        </FlexHeader>
      </HeaderWrapper>

      {showRegionPopup && (
        <MobileGpsPopup
          onClose={() => setShowRegionPopup(false)}
          onSelect={handleRegionSelect}
        />
      )}
    </>
  );
};

export default CommonHeaderHome;

/* =========================
   styles
========================= */

const progressAnim = keyframes`
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 20; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const TopRow = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const LocationText = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #1A1A1A;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  max-width: 140px;
`;

const NoticeIconWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const RedDot = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
`;

const ChatIconWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ChatUnreadBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: #FF4D4F;
  color: #fff;
  font-size: ${() => getFontSize(10)}px !important;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  line-height: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  z-index: 1;
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  min-height: 52px;

  /* 헤더 본문 배경 */
  background-color: #FFFFFF;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);

  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 999;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  /* ✅ 상태바(safe-area) 영역 배경만 따로 깔기 */
  &::before{
    content:"";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: env(safe-area-inset-top, 0px);
    background: rgba(0,0,0,0.72);
    z-index: 998;
    pointer-events: none;
  }
`;


const FlexHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-grow: 2;
  flex-shrink: 1;
  min-width: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex: 0 0 auto;
  min-width: 0;
  flex-shrink: 0;
`;

const SearchBtn = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.95);
  }
`;

/* ✅ AI 아이콘 버튼(링 제거 버전) */
const AIIconBtn = styled.button`
  width: 35px;
  height: 35px;
  border: 0;
  padding: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-120%);
    opacity: 0;
  }
  10% {
    opacity: .25;
  }
  50% {
    opacity: .35;
  }
  90% {
    opacity: .25;
  }
  100% {
    transform: translateX(120%);
    opacity: 0;
  }
`;


const devShimmer = keyframes`
  0%   { transform: translateX(-160%); opacity: 0; }
  10%  { opacity: .55; }
  35%  { opacity: .65; }
  60%  { opacity: .45; }
  100% { transform: translateX(160%); opacity: 0; }
`;

const DevCenterBtn = styled.div`
  position: relative;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;

  background: #00C7AE;
  color: #fff;

  font-size: ${() => getFontSize(12)}px !important;
  font-family: 'Pretendard-Bold';
  font-weight: 900;
  letter-spacing: -0.2px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  white-space: nowrap;
  min-width: 0;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.98);
    background: #00B493;
  }

  @media (max-width: 380px) {
    height: 26px;
    padding: 0 8px;
    max-width: 78px;
    font-size: ${() => getFontSize(11)}px !important;
  }

  @media (max-width: 340px) {
    max-width: 58px;
  }
`;

