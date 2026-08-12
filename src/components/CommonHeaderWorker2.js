// components/CommonHeaderMap.jsx (CommonHeaderWorker2)

import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { MdMyLocation } from "react-icons/md";
import { getFontSize, HEADER_TOP_EXTRA } from "../utility/fontsize";
import { UserContext } from "../context/User";
import { SubKeywordAddress } from "../utility/region";
import { useNavigate } from "react-router-dom";

const CommonHeaderWorker2 = ({
  onLocationClick,
  onFilterClick,
  onBackPressed,
  filterSummary,
  onFilterReset,
}) => {
  const { user } = useContext(UserContext);
  const address_name = user?.USERINFO?.address_name || "위치 확인중";
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event) => {
      try {
        const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (msg.type === "BACK_PRESSED") {
          if (onBackPressed) onBackPressed();
        }
      } catch (e) {
        console.error("BACK_PRESSED 메시지 파싱 오류:", e, event.data);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onBackPressed]);

  useEffect(() => {
    return () => {
      const mapDiv = document.getElementById("map");
      if (mapDiv) mapDiv.remove();
    };
  }, []);

  const [parsedFilterCount, setParsedFilterCount] = useState(0);

  useEffect(() => {
    const updateFilterCount = () => {
      const categories = JSON.parse(localStorage.getItem("filter_categories") || "[]");
      const genders = JSON.parse(localStorage.getItem("filter_genders") || "[]");
      const ages = JSON.parse(localStorage.getItem("filter_ages") || "[]");
      const distance = parseInt(localStorage.getItem("filter_distance") || "7", 10);

      let count = 0;
      count += categories.length;
      count += genders.length;
      count += ages.length;
      if (distance !== 7) count += 1;

      setParsedFilterCount(count);
    };

    updateFilterCount();
    const interval = setInterval(updateFilterCount, 5000);
    window.addEventListener("storage", updateFilterCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateFilterCount);
    };
  }, []);

  // ✅ 지금은 “생기는 바” 자체를 없애자 (요청대로 완전 제거)
  const renderFilterSummaryBar = () => null;

  const _handleChange = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) mapDiv.remove();
    navigate("/Mobilelist", { state: { WORK_ID: "", TYPE: "" } });
  };

  return (
    <>
      <HeaderWrapper>

        <CenterArea>
          <LocationRow onClick={onLocationClick}>
            <LocationText>{SubKeywordAddress(address_name)}</LocationText>
            <MdMyLocation size={18} color="#000" />
          </LocationRow>
        </CenterArea>

        <RightArea />
      </HeaderWrapper>

      {renderFilterSummaryBar()}
    </>
  );
};

export default CommonHeaderWorker2;

/* ✅ 헤더: safe-area 포함(헤더가 먹음), 고정 높이 제거 */
const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  /* ✅ iOS safe-area + 안드로이드 살짝 여유 */
  padding-top: calc(env(safe-area-inset-top, 0px) + ${8 + HEADER_TOP_EXTRA}px);

  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: ${8 + HEADER_TOP_EXTRA}px;

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

const LeftArea = styled.div`
  display: flex;
  align-items: center;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const BrandName = styled.div`
  font-family: "Pretendard-Bold";
  font-size: ${() => getFontSize(18)}px !important;
  color: #1a1e28;

  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f9fafb;
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
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(18)}px !important;
  color: #000;
`;
