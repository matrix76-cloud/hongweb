import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getFontSize } from '../../utility/fontsize';
import { imageDB } from '../../utility/imageData';


const steps = ["채팅", "계약", "결제", "완료", "평가"];

const guideMap = {
  0: "채팅을 통해 협의를 진행한 다음 계약서를 작성해주세요",
  1: "충분히 협의 후 계약서를 작성해주세요",
  2: "의뢰자는 계약서 작성 후 결제를 진행해주세요",
  3: "결제 완료! 지원자는 작업을 시작하세요",
  4: "작업 완료 후 결과를 등록해주세요",
  5: "의뢰자가 평가하면 입금됩니다",
  6: "모든 절차가 완료되었습니다 🎉"
};

const ajummaPositionMap = [
  "5%",
  "33%",
  "50%",
  "50%",
  "67%",
  "85%"
];

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


const TabProgressWithAjumma = ({ chatId, currentStep = 0, setTab, isBlocked }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [guide, setGuide] = useState(guideMap[0]);
  


  useEffect(() => {
    setGuide(guideMap[currentStep] || "");
  }, [currentStep]);


  const handleTabClick = (i) => {
    if (i > currentStep + 1) return; // ✅ 다음 단계까지만 클릭 가능
    setSelectedTabIndex(i);
    setTab(stepKey(i));
  };


  return (
    <Wrapper>
      <TooltipWrapper>
        {/* <Tooltip>{guide}</Tooltip> */}
        <TabsWrapper>
    

          <ActiveLine currentStep={currentStep +1} />
          {steps.map((label, i) => {
    

            const isActive = i === currentStep +1;
            const isDisabled = i > currentStep + 1;

            return (
              <StepItem
                key={i}
                onClick={() => !isDisabled && handleTabClick(i)}
              >
                <StepCircleWrapper>
                  {!isBlocked && i === currentStep + 1 && <CircleOutline />}
                  <StepCircle active={selectedTabIndex == i} disabled={isDisabled} >
                    {i + 1}
                  </StepCircle>  
                </StepCircleWrapper>
                <StepLabel active={selectedTabIndex === i} disabled={isDisabled} >
                  {label}
                </StepLabel>
              </StepItem>
            );
          })}
        </TabsWrapper>
      </TooltipWrapper>

    </Wrapper>
  );
};

export default TabProgressWithAjumma;


const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  position: relative;

  &::before {
  content: "";
  position: absolute;
  top: 18px;
  left: 5%;
  width: 90%;
  height: 2px;
  background-color: transparent;
  border-top: 2px dotted #ccc;  // ✅ 핵심 변경!
  z-index: 0;
  }
`;

const ActiveLine = styled.div`
  position: absolute;
  top: 18px;
  left: 5%;
  height: 3px;
  background-color: #FF7125;
  z-index: 1;
  width: ${({ currentStep }) => {
    const percent = (currentStep) / (steps.length - 1);
    return `${percent * 90}%`;
  }};
  transition: width 0.3s ease-in-out;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  z-index: 1;
`;

const fadeScale = keyframes`
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;


const StepCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ active }) => active ? '#FF7125' : '#ffffff'};
  animation: ${ fadeScale } 0.3s ease - out;

    border: ${({ active, disabled }) => {
    if (disabled) return '2px dotted #ccc';     // ✅ 점선 border
    return active ? '2px solid #ff7125' : '2px solid #ccc';
}};
  


  color: ${({ active, disabled }) =>
  disabled ? '#bbb7b7' : active ? '#ffffff' : '#000'};
    
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 6px;
  z-index: 1;
`;

const StepLabel = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  margin-top: 8px;

  color: ${({ active, disabled }) =>
  disabled ? '#bbb7b7' : active ? '#FF7125' : '#000'};
  
`;



const rotateLoading = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CircleOutline = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #eee;
  border-top-color: #FF7125;
  animation: ${rotateLoading} 1.5s linear infinite;
  box-sizing: border-box;
  box-shadow: 0 0 6px rgba(255, 113, 37, 0.6);
`;


// ------------------- styled -------------------
const Wrapper = styled.div`
  padding-top: 60px;  
  background: #fff;
`;



const TooltipWrapper = styled.div`
  display: inline-block;
  width: 100%;
`;

const StepCircleWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;


