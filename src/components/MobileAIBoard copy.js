import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { getFontSize } from "../utility/fontsize";

const HARO_CHAT_ID = "haro_fixed_chat_id"; // TODO: 실제 ID로 교체

const presets = [
  // 메인 하루: 가로 2칸, 높이 넉넉
  { id: "haro", title: "하루", sub: "고민 상담을 도와주는 AI", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.airoom },
  { id: "work", title: "일자리", sub: "일자리", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aiworkroom }, // ← 크게도 가능
  // 나머지: 기본 1칸(=반), 필요하면 어떤 카드든 span:2로 키움
  { id: "forune", title: "운세", sub: "오늘의 운세", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aifortuneroom },
  { id: "camp", title: "캠핑, 관광지 도우미", sub: "주말 캠핑장 추천", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aicampingroom },
  { id: "event", title: "공연/행사", sub: "일정·예매·주의", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aifestivalroom },
  { id: "drug", title: "약 건강삭룸", sub: "약 건강식품", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aidrugroom },


];

const HaroCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.airoom} onClick={onClick}>
      <Character
        src={imageDB.maincharacter}
        alt="하루"
        loading="lazy"
        style={{
          right: -8,       // 👉 더 바깥으로 빼려면 절대값 키우기
          bottom: 20,      // 👉 아래로 빼려면 절대값 키우기
          width: "38%",    // 👉 전체 대비 캐릭터 크기
          maxWidth: 160    // 👉 너무 커지는 것 방지
        }}
      />
      <TextBox>
        <Name $size={24}>고민 상담 AI</Name>       {/* 타이틀 크기 */}
        <Sub $size={16}>고민 상담을 도와주는 AI</Sub> {/* 서브 크기 */}
      </TextBox>
    </CardBase>
  );
}

const WorkCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aiworkroom} onClick={onClick}>
      <Character
        src={imageDB.workercharacter}
        alt="일자리"
        loading="lazy"
        style={{
          left: 10,                // 👉 왼쪽으로 이동
          bottom: -4,
          width: "38%",
          maxWidth: 160
        }}
      />
      <TextBox style={{ position: "absolute", right: 16, bottom: 18, textAlign: "right" }}>
        <Name $size={24}>일자리 AI</Name>
        <Sub $size={16}>
          당신에게 꼭 맞는
          <br />
          맞춤형 일자리 찾아드립니다
        </Sub>
      </TextBox>
    </CardBase>
  );
}


const FortuneCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={2.0} $bg={imageDB.aifortuneroom} onClick={onClick}>
      <TextBox style={{
        position: "absolute",
        bottom: 20,
        left: 0,
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}>
        <Name $size={24}>운세전문가 AI</Name>
        <Sub $size={16}>행운과 조언</Sub>
      </TextBox>

      {/* <TextBox style={{
        position: "absolute",
        top: 0,
        right: 10,
        zIndex: 4,
        textAlign: "right"
      }}>
        <Name $size={22}>사랑 · 재물 · 건강</Name>

      </TextBox> */}

      <Character
        src={imageDB.fortunecharacter}
        alt="운세"
        loading="lazy"
        style={{
          left: "70%",
          transform: "translateX(-50%)",
          bottom: 10,
          width: "42%",
          maxWidth: 200
        }}
      />
    </CardBase>
  );
}

const CampCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aicampingroom} onClick={onClick}>
      <Character
        src={imageDB.campingcharacter}
        alt="캠핑·관광지"
        loading="lazy"
        style={{ right: -10, bottom: -6, width: "44%", maxWidth: 190 }}
      />

      <TextBox style={{
        position: "absolute",
        top: 50,
        left: 10,
        zIndex: 4,
        textAlign: "right"
      }}>
        <Name $size={24}>캠핑·관광지 AI</Name>
        <Sub $size={16}>주말 여행지와 캠핑 명소 추천</Sub>
      </TextBox>


    </CardBase>
  );


}


const EventCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aifestivalroom} onClick={onClick}>
      <Character
        src={imageDB.festivalcharacter}
        alt="캠핑·관광지"
        loading="lazy"
        style={{ right: -10, bottom: -6, width: "44%", maxWidth: 190 }}
      />
      <TextBox>
        <Name $size={24}>이벤트·축제 AI</Name>
        <Sub $size={16}>전국 공연·축제 일정</Sub>
      </TextBox>
    </CardBase>
  );
}


const DrugCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aidrugroom} onClick={onClick}>
      <Character
        src={imageDB.drugcharacter}
        alt="캠핑·관광지"
        loading="lazy"
        style={{ right: -10, bottom: -6, width: "38%", maxWidth: 190 }}
      />
      <TextBox>
        <Name $size={24}>약 도우미 AI</Name>
        <Sub $size={16}>건강에 꼭 맞는 약·건강식품 추천</Sub>
      </TextBox>
    </CardBase>
  );
}


const MobileAIBoard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const goChat = () => {
    navigate("/MobileAIcontent", {
      state: {
        ITEM: {
          CHAT_ID: `ai_friend_fixed_${user.USERS_ID}`,
          SUPPORTER: {
            USERINFO: { nickname: "AI 친구 하루", userimg: imageDB.aiicon },
          },
          OWNER_ID: user.USERS_ID,
        },
        OWNER: true,
        NAME: "AI 친구 하루",
        LEFTIMAGE: "",
        LEFTNAME: "AI 친구 하루",
        IS_AI_CHAT: true,
      },
    });
  };
  const openPreset = (id) => {
    if (id === "haro") {
      goChat();
    } else {
      // 다른 프리셋에 대한 동작 정의
      console.log(`Open preset: ${id}`);
    }
  }

  return (
    <Grid>
      <HaroCard onClick={() => openChat("haro", "하루")} />
      <WorkCard onClick={() => openChat("work", "일자리")} />
      <FortuneCard onClick={() => openChat("fortune", "운세")} />
      <CampCard onClick={() => openChat("camp", "캠핑·관광지 도우미")} />
      <EventCard onClick={() => openChat("camp", "캠핑·관광지 도우미")} />
      <DrugCard onClick={() => openChat("camp", "캠핑·관광지 도우미")} />

    </Grid>
  );
};

export default MobileAIBoard;





const CardBase = styled.button`
  position: relative;
  border: 0;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,.25);
  display: flex;
  align-items: stretch;
  transform: translateZ(0);

  /* 배치/비율 */
  grid-column: span ${p => p.$span || 1};
  aspect-ratio: ${p => p.$ratio || 1.2};

  &:active { transform: scale(.985); }

  /* 배경 */
  &::before{
    content:"";
    position:absolute; inset:0;
    background-image: url(${p => p.$bg});
    background-size: cover;
    background-position: center;
    filter: brightness(${p => p.$brightness ?? .92});
  }

  /* 텍스트 가독성 */
  &::after{
    content:""; position:absolute; inset:0;
    background:
      linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.1) 40%, rgba(0,0,0,0) 70%),
      linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.75) 100%);
  }
`;

const TextBox = styled.div`
  position: relative; z-index: 4;
  margin-top: auto; padding: 18px 16px 16px;
  color: #fff; text-align: left;
`;

const Name = styled.div`
  font-weight: 900;
  font-size: ${p => p.$size || 20}px !important;
  letter-spacing: .2px;
  text-shadow: 0 3px 8px rgba(0,0,0,.55);
`;

const Sub = styled.div`
  margin-top: 8px;
  font-size: ${p => p.$size || 14}px !important;
  line-height: 1.25;
  opacity: .98;
  text-shadow: 0 2px 6px rgba(0,0,0,.5);
`;

const Character = styled.img`
  position: absolute;
  z-index: 3;
  pointer-events: none;
  height: auto;
  filter: drop-shadow(0 12px 18px rgba(0,0,0,.35));
`;





const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 10px 16px 16px;
  margin-bottom: 64px; /* 입력창 높이만큼 여백 */
`;
