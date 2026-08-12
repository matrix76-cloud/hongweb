import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { getFontSize } from "../utility/fontsize";
import { AI_PRESETS } from "./chat/AIPresets";


const HARO_CHAT_ID = "haro_fixed_chat_id"; // TODO: 실제 ID로 교체

const presets = [
  // 메인 하루: 가로 2칸, 높이 넉넉
  { id: "haro", title: "하루", sub: "고민 상담을 도와주는 AI", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.airoom },
  // { id: "work", title: "일자리", sub: "일자리", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aiworkroom }, // ← 크게도 가능
  // 나머지: 기본 1칸(=반), 필요하면 어떤 카드든 span:2로 키움
  { id: "forune", title: "운세", sub: "오늘의 운세", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aifortuneroom },
  { id: "camp", title: "캠핑, 관광지 도우미", sub: "주말 캠핑장 추천", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aicampingroom },
  { id: "event", title: "공연/행사", sub: "일정·예매·주의", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aifestivalroom },
  { id: "drug", title: "약 건강삭룸", sub: "약 건강식품", span: 2, ratio: 16 / 9, img: imageDB.maincharacter, bg: imageDB.aidrugroom },


];

const HaroCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.airoom} onClick={onClick} $variant="counsel">
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
      <TextBox style={{
        position: "absolute",
        top: 20,
        left: 0,
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}>
        <Name $size={24}>고민 상담 AI</Name>       {/* 타이틀 크기 */}
        <Sub $size={16}>고민 상담을 도와주는 AI</Sub> {/* 서브 크기 */}
      </TextBox>
    </CardBase>
  );
}

const WorkCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aiworkroom} onClick={onClick} $variant="work">
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
    <CardBase $span={2} $ratio={2.0} $bg={imageDB.aifortuneroom} onClick={onClick} $variant="fortune">
      <div className="stars" />        {/* ★ 반짝이는 오버레이 */}
      <TextBox style={{
        position: "absolute",
        top: 20,
        left: 0,
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}>
        <Name $size={24}>운세전문가 AI</Name>
        <Sub $size={16}>행운과 조언을 줍니다</Sub>
      </TextBox>

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
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aicampingroom} onClick={onClick} $variant="camp">
      <Character
        src={imageDB.campingcharacter}
        alt="캠핑·관광지"

        loading="lazy"
        style={{ left: 10, bottom: 10, width: "44%", maxWidth: 190 }}
      />

      <TextBox style={{
        position: "absolute",
        right: 10,
        zIndex: 4,
        textAlign: "right"
      }}>
        <Name $size={24}>캠핑 전문가 AI</Name>
        <Sub $size={16}>캠핑 명소 추천<br /> 및 다양한 캠핑정보</Sub>
      </TextBox>


    </CardBase>
  );


}


const EventCard = ({ onClick }) => {
  return (
    <CardBase $span={2} $ratio={16 / 9} $bg={imageDB.aifestivalroom} onClick={onClick} $variant="event">
      <Character
        src={imageDB.festivalcharacter}
        alt="캠핑·관광지"
        loading="lazy"
        style={{ right: -10, bottom: 16, width: "44%", maxWidth: 190 }}
      />
      <TextBox style={{
        position: "absolute",
        left: 10,
        zIndex: 4,
        textAlign: "left"
      }}>
        <Name $size={24}>관광전문가 AI</Name>
        <Sub $size={16}>전국관광지 공연·축제 일정</Sub>
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
      <TextBox style={{
        position: "absolute",
        left: -10,
        zIndex: 4,
        textAlign: "center"
      }}>
        <Name $size={24}>약 도우미 AI</Name>
        <Sub $size={16}>건강에 꼭 맞는 약·건강식품 추천</Sub>
      </TextBox>
    </CardBase>
  );
}


const MobileAIBoard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const goChat = (presetKey) => {
    // navigate("/MobileAIcontent", {
    //   state: {
    //     ITEM: {
    //       CHAT_ID: `ai_friend_fixed_${user.USERS_ID}`,
    //       SUPPORTER: {
    //         USERINFO: { nickname: "AI 친구 하루", userimg: imageDB.aiicon },
    //       },
    //       OWNER_ID: user.USERS_ID,
    //     },
    //     OWNER: true,
    //     NAME: "AI 친구 하루",
    //     LEFTIMAGE: "",
    //     LEFTNAME: "AI 친구 하루",
    //     IS_AI_CHAT: true,
    //   },
    // });


    const preset = AI_PRESETS[presetKey];
    if (!preset) return;
    navigate("/MobileAIcontent", {
      state: {
        IS_AI_CHAT: true,
        AI_PRESET: preset,                     // ★ 프리셋 통째로 전달
        ITEM: {
          CHAT_ID: `${preset.chatIdPrefix}_${user.USERS_ID}`,  // 방 고정
          SUPPORTER: { USERINFO: { nickname: preset.leftname, userimg: preset.leftimage } },
          OWNER_ID: user.USERS_ID,
        },
        LEFTNAME: preset.leftname,
        LEFTIMAGE: preset.leftimage,
      },
    });
  };

  const navigateToAI = (presetKey) => {
    const preset = AI_PRESETS[presetKey];
    if (!preset) return;

    navigate("/MobileAIcontent", {
      state: {
        IS_AI_CHAT: true,
        AI_PRESET: preset,                     // ★ 프리셋 통째로 전달
        ITEM: {
          CHAT_ID: `${preset.chatIdPrefix}_${user.USERS_ID}`,  // 방 고정
          SUPPORTER: { USERINFO: { nickname: preset.leftname, userimg: preset.leftimage } },
          OWNER_ID: user.USERS_ID,
        },
        LEFTNAME: preset.leftname,
        LEFTIMAGE: preset.leftimage,
      },
    });
  };



  return (
    <Grid>
      <HaroCard onClick={() => navigateToAI("haro")} />
      {/* <WorkCard onClick={() => navigateToAI("work")} /> */}
      {/* <FortuneCard onClick={() => navigateToAI("fortune")} /> */}
      <CampCard onClick={() => navigateToAI("camp")} />
      {/* <EventCard onClick={() => navigateToAI("event")} />
      <DrugCard onClick={() => navigateToAI("drug")} /> */}

    </Grid>
  );
};

export default MobileAIBoard;




/* ---- keyframes ---- */
export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px) }
  to   { opacity: 1; transform: translateY(0) }
`;
export const floatY = keyframes`
  0%,100% { transform: translateY(0) }
  50%     { transform: translateY(-6px) }
`;
export const shine = keyframes`
  0%   { transform: translateX(-120%) }
  100% { transform: translateX(120%) }
`;
export const flicker = keyframes`
  0%,100% { opacity: .0 }
  50%     { opacity: .22 }
`;
export const twinkle = keyframes`
  0%,100% { opacity:.2; transform:scale(1) }
  50%     { opacity:.55; transform:scale(1.06) }
`;
export const confetti = keyframes`
  0%   { background-position: 0 0, 0 0, 0 0 }
  100% { background-position: 120px 180px, -140px 200px, 160px -160px }
`;

/* 접근성: 애니메이션 최소화 */
const motionSafe = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`;




/* ===== CardBase 업그레이드 ===== */
export const CardBase = styled.button`
  position: relative;
  grid-column: span ${p => p.$span || 1};
  aspect-ratio: ${p => p.$ratio || 1.2};
  border: 0;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: stretch;
  transform: translateZ(0);
  box-shadow: 0 8px 24px rgba(0,0,0,.22);
  transition: transform .18s ease, box-shadow .18s ease;
  ${motionSafe}

  &:active { transform: scale(.985) }

  /* 배경 */
  &::before{
    content:"";
    position:absolute; inset:0;
    background-image: url(${p => p.$bg});
    background-size: cover; background-position: center;
    filter: brightness(${p => p.$brightness ?? .92});
    /* 입장 시 은은한 페이드 업 */
    animation: ${fadeUp} .34s ease both;
    ${motionSafe}
  }

  /* 텍스트 가독성 */
  &::after{
    content:""; position:absolute; inset:0;
    background:
      linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.1) 40%, rgba(0,0,0,0) 70%),
      linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,.78) 100%);
  }

  /* 공통 hover 반응 */
  &:hover{
    transform: translateY(-2px) scale(1.008);
    box-shadow: 0 14px 34px rgba(0,0,0,.28);
  }

  /* ---- variant별 특수 이펙트 ---- */
  /* 1) 고민상담: 좌->우 light sweep */
  ${p => p.$variant === "counsel" && css`
    & > .sweep {
      position:absolute; inset:0; pointer-events:none; overflow:hidden;
    }
    & > .sweep::before{
      content:""; position:absolute; top:0; bottom:0; width:45%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
      transform: translateX(-120%);
    }
    &:hover > .sweep::before{
      animation: ${shine} 900ms ease;
    }
  `}

  /* 2) 일자리: 우측 텍스트 박스에 sweep */
  ${p => p.$variant === "work" && css`
    &:hover .text-sweep::before{
      content:""; position:absolute; left:-40%; top:0; bottom:0; width:40%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
      animation: ${shine} 900ms ease;
    }
  `}

  /* 3) 운세: 별 반짝임 */
  ${p => p.$variant === "fortune" && css`
    & > .stars{
      position:absolute; inset:0; pointer-events:none;
      background-image:
        radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.9) 50%, transparent 51%),
        radial-gradient(1.5px 1.5px at 65% 25%, rgba(255,255,255,.8) 50%, transparent 51%),
        radial-gradient(1.8px 1.8px at 80% 60%, rgba(255,255,255,.85) 50%, transparent 51%);
      animation: ${twinkle} 2.6s ease-in-out infinite;
      ${motionSafe}
    }
  `}

  /* 4) 캠핑: 모닥불 깜빡임 */
  ${p => p.$variant === "camp" && css`
    & > .fire{
      position:absolute; right:18%; bottom:12%;
      width:140px; height:140px; pointer-events:none;
      background: radial-gradient(closest-side, rgba(255,118,20,.35), transparent 70%);
      animation: ${flicker} 1.4s infinite ease-in-out;
      filter: blur(2px);
      ${motionSafe}
    }
  `}

  /* 5) 이벤트: 컨페티(hover시에만) */
  ${p => p.$variant === "event" && css`
    &:hover > .confetti{
      position:absolute; inset:0; pointer-events:none; opacity:.7;
      background:
        radial-gradient(circle at 20% 20%, #ff5a5a 3px, transparent 4px),
        radial-gradient(circle at 70% 30%, #ffd23f 3px, transparent 4px),
        radial-gradient(circle at 40% 70%, #6bd6ff 3px, transparent 4px);
      background-size: 120px 180px, 140px 200px, 160px 160px;
      animation: ${confetti} 1400ms linear forwards;
      ${motionSafe}
    }
  `}

  /* 6) 약 도우미: 은은한 상단 조명 스윕 */
  ${p => p.$variant === "drug" && css`
    &:hover > .ceiling{
      position:absolute; left:0; right:0; top:0; height:42%;
      background: linear-gradient(180deg, rgba(255,255,255,.16), transparent);
      animation: ${fadeUp} .35s ease both;
      ${motionSafe}
    }
  `}
`;

/* 공통 텍스트/캐릭터 (그대로 사용) */
 const TextBox = styled.div`
  position: relative; z-index: 4;
  margin-top: auto; padding: 18px 16px 16px;
  color: #fff; text-align: left;
  animation: ${fadeUp} .35s ease both .05s;
  ${motionSafe}
`;
 const Name = styled.div`
  font-weight: 900; letter-spacing:.2px;
  font-size: ${p => p.$size || 20}px !important;
  text-shadow: 0 3px 8px rgba(0,0,0,.55);
`;
 const Sub = styled.div`
  margin-top: 8px; line-height:1.25; opacity:.98;
  font-size: ${p => p.$size || 14}px !important;
  text-shadow: 0 2px 6px rgba(0,0,0,.5);
`;
 const Character = styled.img`
  position:absolute; z-index:3; pointer-events:none; height:auto;
  filter: drop-shadow(0 12px 18px rgba(0,0,0,.35));
  transition: transform .18s ease;
  ${motionSafe}
`;






const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 10px 16px 16px;
  margin-bottom: 64px; /* 입력창 높이만큼 여백 */
`;
