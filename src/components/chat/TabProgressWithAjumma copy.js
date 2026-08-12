import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getFontSize } from '../../utility/fontsize';
import { imageDB } from '../../utility/imageData';

const steps = ["체팅", "계약", "결제", "완료", "평가"];

const guideMap = {
  0: "채팅을 통해 협의를 진행해보세요",
  1: "충분히 협의 후 계약서를 작성해주세요",
  2: "의뢰자는 계약서 작성 후 결제를 진행해주세요",
  3: "결제 완료! 지원자는 작업을 시작하세요",
  4: "작업 완료 후 결과를 등록해주세요",
  5: "의뢰자가 평가하면 입금됩니다",
  6: "모든 절차가 완료되었습니다 🎉"
};

const stepKey = (index) => {
  switch (index) {
    case 0: return "chat";
    case 1: return "contract";
    case 2: return "payment";
    case 3: return "complete";
    case 4: return "review";
    default: return "chat";
  }
};

const TabProgressWithAjumma = ({ currentStep = 0, setTab }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(currentStep);
  const [guide, setGuide] = useState(guideMap[currentStep]);

  const handleTabClick = (i) => {
    setSelectedTabIndex(i);
    setTab(stepKey(i));
  };

  useEffect(() => {
    setGuide(guideMap[currentStep] || "");
    setSelectedTabIndex(currentStep);
  }, [currentStep]);

  return (
    <Wrapper>
      <TabsWrapper>
        <TabsContainer>
          {steps.map((label, i) => (
            <Step key={i} onClick={() => handleTabClick(i)}>
              <StepLabel selected={i === selectedTabIndex}>{label}</StepLabel>
            </Step>
          ))}
        </TabsContainer>
      </TabsWrapper>

      <StatusBox>
        <StatusText>현재 상태: {steps[currentStep] || "진행중"}</StatusText>
        <WalkerLine>
          <WalkingHongGif
            src={imageDB.chatwoman}
            alt="홍여사"
            step={currentStep}
            direction="right"
          />
        </WalkerLine>
        <GuideText>{guide}</GuideText>
      </StatusBox>
    </Wrapper>
  );
};

export default TabProgressWithAjumma;

// ------------------- styled -------------------
const Wrapper = styled.div`
  padding-top: 20px;
  background: #fff;
`;

const TabsWrapper = styled.div`
  background: #f9f9f9;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 12px 16px;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
`;

const StepLabel = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-family: ${({ selected }) => (selected ? 'Pretendard-SemiBold' : 'Pretendard')};
  color: ${({ selected }) => (selected ? '#FF7125' : '#999')};
`;

const StatusBox = styled.div`
  margin: 16px;
  background: #FFF7DC;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const StatusText = styled.div`
  font-weight: bold;
  font-size: ${() => getFontSize(15)}px;
`;

const GuideText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #555;
  text-align: center;
`;

const WalkerLine = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  background: #f2f2f2;
  border-radius: 24px;
  overflow: hidden;
`;

const WalkingHongGif = styled.img`
  width: 48px;
  height: auto;
  position: absolute;
  top: 4px;
  left: ${({ step }) => `${step * 20}%`};
  transition: left 0.5s ease-in-out;
  transform: ${({ direction }) =>
    direction === "right" ? "scaleX(-1)" : "scaleX(1)"};
`;
