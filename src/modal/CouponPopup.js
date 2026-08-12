// ✅ 실제 이미지 크기 기반 + 패딩 없는 이미지 + 버튼 영역 여백 있음
import React from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";

const CouponPopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PopupBox = styled.div`
  width: 90vw;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 9999;
`;
const PopupImage = styled.img`
  width: 100%;
  height: auto;
  display: block;

`;

const OverlayButtonRow = styled.div`
   position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 6px;
  z-index: 2;
`;


const InstagramButton = styled.div`
  padding: 6px 12px;
  font-size: ${() => getFontSize(12)}px !important;
  color: white;
  background: #222;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  position: absolute;
  bottom: 120px;
  right: 0px;
}
`; 

const TextButton = styled.div`
  padding: 4px 10px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #333;
  background: #f1f1f1;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;


const CouponPopup = ({ image, handleOneDay, handleSevenDays }) => {
  return (
    <CouponPopupWrapper>
      <PopupBox>
        <PopupImage src={image} alt="이벤트 이미지" />
    
 

        <OverlayButtonRow>
          <InstagramButton
            onClick={() =>
              window.open("https://www.instagram.com/p/DKs1R42uT5d/", "_blank", "noopener,noreferrer")
        }
          >
            인스타에서 보기
          </InstagramButton>

          <TextButton onClick={handleOneDay}>오늘 그만 보기</TextButton>
          <TextButton onClick={handleSevenDays}>7일 동안 안보기</TextButton>
        </OverlayButtonRow>
      </PopupBox>
    </CouponPopupWrapper>
  );
};

export default CouponPopup;