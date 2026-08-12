// components/CommonHeaderChat.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { getFontSize, HEADER_TOP_EXTRA } from '../utility/fontsize';

const CommonHeaderProfile = ({title, onBackPressed }) => {
  useEffect(() => {
    return () => {
      const mapDiv = document.getElementById("map");
      if (mapDiv) mapDiv.remove(); // ✅ 지도 DOM 제거 (예외적으로 포함)
    };
  }, []);

  useEffect(() => {
    const handler = (event) => {
      try {
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg.type === 'BACK_PRESSED') {
          if (onBackPressed) onBackPressed();
          else window.history.back();
        }
      } catch (e) {
        console.error("BACK_PRESSED 메시지 파싱 오류:", e, event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onBackPressed]);

  return (
    <HeaderWrapper>
      <Title>{title}</Title>
    </HeaderWrapper>
  );
};

export default CommonHeaderProfile;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  /* ✅ iOS safe-area + 안드로이드 살짝 여유 */
  padding-top: calc(env(safe-area-inset-top, 0px) + 8px);

  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;

  min-height: 52px;

  background-color: #FFFFFF;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  z-index: 999;

  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  /* ✅ 상태바(safe-area) 영역만 어둡게 깔아서 아이콘 가독성 확보 */
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


const Title = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: ${() => getFontSize(18)}px !important;
  color: #1A1E28;
`;
