// components/CommonHeaderMap.jsx
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdMyLocation } from 'react-icons/md';
import { FiFilter, FiRepeat } from 'react-icons/fi';
import { getFontSize, HEADER_TOP_EXTRA } from '../utility/fontsize';
import { UserContext } from '../context/User';
import { SubKeywordAddress } from '../utility/region';
import { useNavigate } from 'react-router-dom';

const CommonHeaderWork = ({ onLocationClick, onFilterClick, onBackPressed, filterSummary, onFilterReset }) => {
  const { user } = useContext(UserContext);
  const address_name = user?.USERINFO?.address_name || '위치 확인중';

  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event) => {
      try {
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg.type === 'BACK_PRESSED') {
          if (onBackPressed) onBackPressed();
        }
      } catch (e) {
        console.error("BACK_PRESSED 메시지 파싱 오류:", e, event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onBackPressed]);

  useEffect(() => {
    return () => {
      const mapDiv = document.getElementById("map");
      if (mapDiv) mapDiv.remove();
    };
  }, []);

  const [parsedFilterCount, setParsedFilterCount] = useState(0);

  const _handleChange = () => {

    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      console.log("🧹 map div 제거");
      mapDiv.remove(); // 제거 시도
    }

    navigate("/Mobileworkermap");
  }


  useEffect(() => {
    return () => {
      const mapDiv = document.getElementById("map");
      if (mapDiv) mapDiv.remove();
    };
  }, []);


  return (
    <>
      <HeaderWrapper>
     
        <CenterArea>
          <LocationRow onClick={onLocationClick}>
            <LocationText>{SubKeywordAddress(address_name)}</LocationText>
            <MdMyLocation size={18} color="#000" />
          </LocationRow>
        </CenterArea>
 
      </HeaderWrapper>

    </>
  );
};

export default CommonHeaderWork;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  /* ✅ 메인 헤더와 동일 */
  padding-top: calc(env(safe-area-inset-top, 0px) + ${8 + HEADER_TOP_EXTRA}px);
  padding-bottom: ${8 + HEADER_TOP_EXTRA}px;
  padding-left: 16px;
  padding-right: 16px;
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

  /* ✅ 상태바(safe-area) 영역 배경 */
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

const LeftArea = styled.div`
  display: flex;
  align-items: center;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px; /* ✅ 오른쪽에서 살짝 왼쪽으로 이동 */
`;

const BrandName = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: ${() => getFontSize(18)}px !important;
  color: #1A1E28;

  padding: 6px 12px;

  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px; /* 텍스트와 아이콘 간 간격 */

  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f9fafb;
    border-color: #a3a3a3;
  }

  &:active {
    background-color: #f3f4f6;
    transform: scale(0.98);
  }
`;

const CenterArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${() => getFontSize(18)}px !important;
  color: #333;
  cursor: pointer;
`;

const LocationText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(18)}px !important;
  color:#000;
`;


const FilterSummaryBar = styled.div`
  background: #fff7ed;
  color: #92400e;
  font-size: ${() => getFontSize(12)}px !important;
  padding: 6px 12px;
  margin: 4px 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
`;

const ResetButton = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #92400e;
  padding: 2px 8px;
  border: 1px solid #f0c69c;
  border-radius: 6px;
  margin-left: 8px;
  background: #fff;
`;

const FilterButton = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterBadgeBubble = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff7e19;
  color: #fff;
  font-size: ${() => getFontSize(12)}px !important;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;
