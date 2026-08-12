import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { WORKNAME } from '../utility/work';
import { imageDB } from '../utility/imageData';
import { style } from './config/etc/MobileRulletEvent';

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 100%;
`;

const SectionTitle = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(15)}px !important;


   

`;

const borderPulse = keyframes`
  0% {
    border-color: #e0e7ff;
 
  }
  50% {
    border-color: #6366f1;

  }
  100% {
    border-color: #e0e7ff;
  
  }
`;

const ItemBox = styled.div`
  border: 1px solid #e0e7ff;
  box-sizing: border-box;

  background: linear-gradient(to bottom, #fdfdfd, #f6f7fb); /* 부드러운 톤 */
  border-radius: 16px;
  padding: 16px 12px;
  margin: 16px 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.015); /* 마우스 hover시 살짝 확대 */
  }
`;

const ItemSumBox = styled.div`
  border: 1px solid #e0e7ff;
  background: linear-gradient(to bottom, #fdfdfd, #f6f7fb); /* 부드러운 톤 */
  border-radius: 16px;
  padding: 16px 12px;
  margin: 16px 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.015); /* 마우스 hover시 살짝 확대 */
  }
`;


const ProgressRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  justify-content: space-between;
`;

const Label = styled.div`
  width: 100px;
  font-size: ${() => getFontSize(18)}px !important;
  font-family : Pretendard-SemiBold;
  white-space: nowrap;
  display:flex;
  flex-direction:row;
`;

const CategoryLabel = styled.div`
  display: inline-block;

  color: #131313;
  padding: 4px 12px;
  font-size: ${() => getFontSize(13)}px;
  font-family : Pretendard-SemiBold;
  border-radius: 999px;

`;

const CategoryProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  
`;




const Count = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
`;

const CountBold = styled.span`
   font-family : Pretendard-SemiBold;

`

const GenderLine = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #555;
  margin-top: 2px;
  text-align: right;
`;

const MoreButton = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: ${() => getFontSize(14)}px !important;
  font-family : Pretendard-SemiBold;
  color: #2D6FF7;
  cursor: pointer;
`;

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 24px;
  width: 90%;
  max-height: 75vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: bold;
  cursor: pointer;
  color: #333;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const PiePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PieText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  white-space: nowrap;
  color: #333;
  font-weight: 500;
`;

const SimpleTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed; /* ✅ 균등 너비 강제 */
  margin-top: 8px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #333;

  th, td {
    width: 20%;
    padding: 8px 0;
    text-align: center; /* ✅ 가운데 정렬 */
    vertical-align: middle; /* ✅ 세로축 정렬도 중앙 */
    font-size: ${() => getFontSize(13)}px !important;
    border: 1px solid #eee;
  }
  td:first-child {
    text-align: center;       /* ✅ 가로 중앙 */
    vertical-align: middle;   /* ✅ 세로 중앙 */
  }

  thead {
    background: #f9f9f9;
    font-weight: 600;
  }

  tbody tr {
    background: #fff;
  }
`;

const CategoryImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 8px auto;
  display: block;
`;
const UnifiedStatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 80px;
  font-size: ${() => getFontSize(14)}px !important;
`;

const BarContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const GenderText = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #555;
  white-space: nowrap;
`;

const Bar = styled.div`
  flex: 1;
  background: #eee;
  border-radius: 9999px;
  height: 14px;
  min-width: 120px;
`;

const Fill = styled.div`
  height: 100%;
  background: #2D6FF7;
  border-radius: 9999px;
`;

const ButtonWrapper = styled.div`
  width: 80%;
  max-width: 360px;
  margin: 0 auto;
  padding: 12px 0;

`;

const ActionButton = styled.div`
  padding: 14px 18px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  background-color: #fff6e0;
  color: #333;
  border: 1px solid #e0d3b8;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #ffeec0;
  }

  &:active {
    background-color: #ffdf96;
  }
`;

// 일감 등록하기 (파랑 배경, 흰 글씨)
const OrangeButton = styled(ActionButton)`
  background-color: #ff7e19;
  color: white;
  border: none;
  
  &:hover {
    background-color: #e55d00; // 좀 더 어두운 주황
  }
`;

// 일감 둘러보기 (흰 배경, 파랑 테두리/글씨)
const WhiteOrangeButton = styled(ActionButton)`
  background-color: white;
  color: #ff6b00;
  border: 2px solid #ff6b00;

  &:hover {
    background-color: #fff3eb; // 주황 느낌 나는 연한 배경
  }

`;

const WorkStatsCard = ({onWorkClickApply, onWorkClickBrowse }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showAll, setShowAll] = useState(false);



    return (
        <CardContainer>
          <ButtonWrapper>
          <OrangeButton onClick={onWorkClickApply}>일감 등록하기</OrangeButton>

          </ButtonWrapper>
        </CardContainer>
    );
};

export default WorkStatsCard;
