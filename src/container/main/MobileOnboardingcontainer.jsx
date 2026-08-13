import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { enterGuest } from "../../utility/guest";
import { imageDB } from "../../utility/imageData";
import illustStep1 from "../../assets/imageset/honggroup.png";

/**
 * 온보딩 3단계 (형 지시 2026-08-12 — doum 프로젝트 OnboardingStepsPage 구조를 따랐다)
 *
 * 처음 들어온 사람에게 이 앱이 무엇을 해주는지 CORE 의 흐름 그대로 세 장으로 보여준다.
 *   ① 필요한 일을 올린다  ② 홍여사들이 지원한다  ③ 마음에 드는 분을 고른다
 *
 * 한 번 보면 다시 안 뜬다 — localforage 에 표시를 남기고 스플래시가 그걸 본다.
 */
const ONBOARDING_KEY = "onboarding.done";

export const isOnboardingDone = async () => {
  try { return (await localforage.getItem(ONBOARDING_KEY)) === true; }
  catch { return false; }
};

const Wrap = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  padding: 0 24px calc(28px + env(safe-area-inset-bottom, 0px));
`;

const Illust = styled.div`
  flex: 1;
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
`;

const IllustImg = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
`;

/* 2·3단계 그림 — 에셋이 제각각이라 로고 심볼로 통일해서 직접 그린다 */
const Stage = styled.div`
  position: relative;
  width: 260px;
  height: 240px;
`;
const Symbol = styled.img`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  border-radius: 50%;
  background: #FFF3EE;
  padding: 6px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`;
const Bubble = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? "#FF4E19" : "#F4F4F5")};
  color: ${({ $on }) => ($on ? "#fff" : "#71717a")};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`;
const PickRing = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 3px solid #FF4E19;
  box-sizing: border-box;
`;
const PickMark = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #FF4E19;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
`;

const Step = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #FF4E19;
`;

const Title = styled.h1`
  margin: 14px 0 0;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.4;
  color: var(--text);
  white-space: pre-line;

  span {
    color: #FF4E19;
  }
`;

const Sub = styled.p`
  margin: 14px 0 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  color: #71717a;
  white-space: pre-line;
`;

const Dots = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
`;
const Dot = styled.span`
  height: 8px;
  width: ${({ $on }) => ($on ? "22px" : "8px")};
  border-radius: 100px;
  background: ${({ $on }) => ($on ? "#FF4E19" : "#E3E3E3")};
  transition: width .2s;
`;

const Foot = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
`;
const Skip = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #A3A3A3;
  cursor: pointer;
  padding: 8px 4px;
`;
/* 화살표만 있으니 뭘 하는 버튼인지 안 보였다 — 글자로 (형 리뷰 2026-08-12).
   채운 버튼은 과하다고 해서 글자만 남겼다 (형 리뷰 2026-08-13). */
const NextBtn = styled.button`
  border: none;
  background: none;
  padding: 8px 4px;
  color: #FF4E19;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  &:active { opacity: .6; }
`;
const StartBtn = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: #FF4E19;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
`;

// ② 홍여사들이 지원한다 — 심볼 여럿이 손을 드는 그림
const StageApply = () => (
  <Stage>
    <Symbol src={imageDB.logo} $size={72} $x={14} $y={92} />
    <Symbol src={imageDB.logo} $size={88} $x={92} $y={64} />
    <Symbol src={imageDB.logo} $size={72} $x={186} $y={92} />
    <Bubble $x={0} $y={44} $on>지원할게요</Bubble>
    <Bubble $x={150} $y={26}>저도요</Bubble>
  </Stage>
);

// ③ 마음에 드는 분을 고른다 — 가운데 한 명만 고른 그림
const StagePick = () => (
  <Stage>
    <Symbol src={imageDB.logo} $size={64} $x={12} $y={112} style={{ opacity: .35 }} />
    <Symbol src={imageDB.logo} $size={104} $x={80} $y={72} />
    <PickRing $size={116} $x={74} $y={66} />
    <PickMark $x={158} $y={140}>✓</PickMark>
    <Symbol src={imageDB.logo} $size={64} $x={186} $y={112} style={{ opacity: .35 }} />
    <Bubble $x={64} $y={24} $on>이분으로 할게요</Bubble>
  </Stage>
);

const STEPS = [
  {
    step: "STEP 01",
    title: ["필요한 일을\n", "올리세요"],
    sub: "집 청소부터 병원 동행까지,\n필요한 일을 골라 올리면 됩니다.",
    illust: "image",
  },
  {
    step: "STEP 02",
    title: ["가까운 ", "홍여사들이\n", "지원합니다"],
    sub: "일을 올려두면 근처에 있는 분들이\n먼저 손을 듭니다.",
    illust: "apply",
  },
  {
    step: "STEP 03",
    title: ["마음에 드는 분을\n", "고르세요"],
    sub: "고른 뒤 채팅으로 이야기하고,\n결제까지 앱 안에서 끝납니다.",
    illust: "pick",
  },
];

const MobileOnboardingcontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const [i, setI] = useState(0);

  const s = STEPS[i];
  const last = i === STEPS.length - 1;

  /* 온보딩을 마치면 홈으로 — 로그인 없이 둘러볼 수 있게 한다 (형 지시 2026-08-13).
     가입은 무언가 하려는 순간(등록·지원·채팅)에 받는다. */
  const finish = async () => {
    try { await localforage.setItem(ONBOARDING_KEY, true); } catch { /* noop */ }
    await enterGuest();
    navigate("/Mobilemain");
  };

  const next = () => (last ? finish() : setI(i + 1));

  return (
    <Wrap style={containerStyle}>
      <Illust>
        {s.illust === "image" && <IllustImg src={illustStep1} alt="" />}
        {s.illust === "apply" && <StageApply />}
        {s.illust === "pick" && <StagePick />}
      </Illust>

      <Step>{s.step}</Step>
      <Title>
        {/* 홀수 번째 조각만 포인트색 — 문장을 끊지 않고 강조한다 */}
        {s.title.map((seg, k) => (k % 2 === 1 ? <span key={k}>{seg}</span> : <React.Fragment key={k}>{seg}</React.Fragment>))}
      </Title>
      <Sub>{s.sub}</Sub>

      <Dots>
        {STEPS.map((_, k) => <Dot key={k} $on={k === i} />)}
      </Dots>

      <Foot>
        {last ? (
          <StartBtn onClick={finish}>시작하기</StartBtn>
        ) : (
          <>
            <Skip onClick={finish}>건너뛰기</Skip>
            <NextBtn onClick={next}>다음</NextBtn>
          </>
        )}
      </Foot>
    </Wrap>
  );
};

export default MobileOnboardingcontainer;
