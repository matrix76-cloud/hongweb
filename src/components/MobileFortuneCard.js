// 📦 MobileFortuneCard.jsx (오늘/주간 운세 2버튼 감성 카드)
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { imageDB } from '../utility/imageData';
import { LIFEMENU } from '../utility/life';
import { getFontSize } from '../utility/fontsize';

const CardWrapper = styled.div`
  width: 90%;
  margin: 26px auto;
  background: #f5f6f9;
  border-radius: 10px;
  padding: 28px 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color :#dbd5d5;
`;

const FortuneTitle = styled.div`
  font-size: ${()=>getFontSize(18)}px !important;

  color: #333;
  margin-bottom: 16px;
`;

const FortuneDesc= styled.div`
  font-size: ${() => getFontSize(16)}px !important;

  color: #333;

`;

const FortuneImage = styled.img`
  width: 120px;
  margin-bottom: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
`;

const FortuneButton = styled.button`
  flex: 1;
  background: #f38d13;
  color: white;
  border: none;
  padding: 12px;
  font-size: ${()=>getFontSize(15)}px !important;
  border-radius: 12px;
  cursor: pointer;
  font-family: Pretendard-SemiBold;

  &:hover {
    background: #d97706;
  }
`;

const ImageBox = styled.div`
  width: 100%;
  height: 120px; // or 고정 높이
  overflow: hidden;
  border-radius: 12px; // 있으면 더 고급
  position: relative;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;   // or contain
  object-position: center;
  display: block;
`;

const FortuneIntroWrapper = styled.div`
  width: 90%;
  margin: 20px auto 10px auto;
  padding-top: 10px;
  text-align: center;
`;

const FortuneIntroTitle = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(17)}px !important;
  color: #2C2C2C;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
  letter-spacing: -0.5px;
`;



const MobileFortuneCard = () => {
  const navigate = useNavigate();

  const goToDailyFortunePage = () => {

    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.FORTUNEDAILY, search: "" } });
  };

  const goToWeeklyPage = () => {

    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.FORTUNEWEEKLY, search: "" } });
  };


  return (
    <>
   
      <FortuneIntroWrapper>
        <FortuneIntroTitle>
        구해줘 알바가 오늘의 운세를 알려드릴게요
        </FortuneIntroTitle>

      </FortuneIntroWrapper>

      <CardWrapper>
        <FortuneTitle>오늘의 운세 보기</FortuneTitle>
        <ImageBox>
          <StyledImg src={imageDB.fortune} alt="운세 캐릭터" />
        </ImageBox>

        <FortuneDesc>
          오늘도 구해줘 알바가 조용히 속삭입니다.<br />지금 하루의 기운을 받아보세요.
        </FortuneDesc>

        <ButtonRow>
          <FortuneButton onClick={goToDailyFortunePage}>오늘의 운세</FortuneButton>
          <FortuneButton onClick={goToWeeklyPage}>주간 운세</FortuneButton>
        </ButtonRow>
      </CardWrapper>
    </>

  );
};

export default MobileFortuneCard;