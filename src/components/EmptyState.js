import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { imageDB } from "../utility/imageData"; // ✅ 이미지 DB 연결
import { getFontSize } from "../utility/fontsize";

const emptyContentMap = {
    chat: {
        image: imageDB.ChatMsg,
        title: "아직 아무런 채팅이 없어요",
        sub: "대화가 시작되면 이곳에 표시돼요",
        buttonText: "채팅하러 가기",
        buttonAction: "/mobileworkerlist",
    },
    contact: {
        image: imageDB.doc,
        title: "작성된 계약서가 없습니다.",
        sub: "계약 완료 시 자동으로 기록되며 이곳에서 확인할 수 있어요.",
        buttonText: "홈으로 가기",
        buttonAction: "/Mobilemain",
    },
    jobList: {
        image: imageDB.ChatMsg,
        title: "등록된 알바가 없어요",
        sub: "지금 바로 알바를 등록해보세요",
        buttonText: "알바 등록하기",
        buttonAction: "/Mobileworkwrite",
    },
    myWorker: {
        image: imageDB.myjob,
        title: "등록한 알바가 아직 없어요",
        sub: "알바를 등록하면 바로 AI 추천이 시작돼요",
        buttonText: "알바 등록하기",
        buttonAction: "/Mobileworkerregist",
    },
    myWork: {
        image: imageDB.workempty,
        title: "등록한 일감이 아직 없어요!",
        sub: "지금 바로 도움받을 일을 등록해보세요",
        buttonText: "일감등록 하러가기",
        buttonAction: "/Mobilecategory",
    },
    praise: {
        image: imageDB.emptypraise,
        title: "아직 칭찬한 가게가 없어요!",
        sub: "따뜻한 응원 한마디가 큰 힘이 돼요 💛",
        buttonText: "",
        buttonAction: "",
    },
    pay: {
        image: imageDB.payment_card,
        title: "결제 내역이 없습니다!",
        sub: "지금 원하는 일을 등록하고 간편하게 도움을 받아보세요.",
        buttonText: "일감등록 하러가기",
        buttonAction: "/Mobilecategory",
    },
    default: {
        image: imageDB.Empty,
        title: "표시할 데이터가 없습니다",
        sub: "관련 정보가 생기면 여기에 표시돼요",
        buttonText: "홈으로",
        buttonAction: "/mobilemain",
    },
};

const EmptyState = ({ type = "default", hideButton = false }) => {
    const navigate = useNavigate();
    const content = emptyContentMap[type] || emptyContentMap.default;

    return (
        <EmptyWrapper>
            <EmptyImageStyled src={content.image} alt={type} />
            <EmptyTextTitle>{content.title}</EmptyTextTitle>
            <EmptyTextSub>{content.sub}</EmptyTextSub>

            {!hideButton && (
                <EmptyButtonWrapper>
                    <WhiteOrangeButton onClick={() => navigate(content.buttonAction)}>
                        {content.buttonText}
                    </WhiteOrangeButton>
                </EmptyButtonWrapper>
            )}
        </EmptyWrapper>
    );
};

export default EmptyState;


const EmptyWrapper = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  text-align: center;
`;

const EmptyImageStyled = styled.img`
  width: 120px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 20px;
`;

const EmptyTextTitle = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  font-family: Pretendard-SemiBold;
`;

const EmptyTextSub = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #666;
  margin-bottom: 24px;
`;

const EmptyButtonWrapper = styled.div`
  width: 100%;
  max-width: 260px;
`;


const ActionButton = styled.div`
  padding: 10px 18px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  background-color: #fff6e0;
  color: #333;
  border: 1px solid #e0d3b8;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #ffeec0;
  }

  &:active {
    background-color: #ffdf96;
  }
`;



const WhiteOrangeButton = styled(ActionButton)`
  background-color: white;
  color: #ff6b00;
  border: 2px solid #ff6b00;

  &:hover {
    background-color: #fff3eb; // 주황 느낌 나는 연한 배경
  }

`;