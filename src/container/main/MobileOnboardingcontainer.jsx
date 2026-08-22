import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { enterGuest, isGuest } from "../../utility/guest";
import { imageDB } from "../../utility/imageData";
import { useNoScroll } from "../../utility/useNoScroll";
import illustStep1 from "../../assets/imageset/honggroup.png";
import { onboardVariant } from "../../components/OnboardStages";

// 온보딩 그림 안 — /onboardlab 에서 고른 것 (형 확정 전까지 1안 "cards")
const ONBOARD_VARIANT = "town5";   // 형 확정 2026-08-23: 9안 = 올리기·동네(여성만·같은 동네)·채팅·알림·안심

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

/* 세 장을 넘겨도 아래 글·점·버튼이 제자리에 있어야 한다.
   예전에는 Wrap 이 min-height 라 1장(큰 일러스트)에서만 화면보다 길어졌고,
   2·3장(작은 그림)에서는 짧아져서 '다음' 버튼이 위아래로 튀었다.
   버튼이 움직이니 연달아 누르면 두 번째 탭이 헛나갔다. (형 지적 2026-08-18) */
const Wrap = styled.div`
  /* 100dvh 로 잡으면 앱 웹뷰에서 실제 화면보다 짧게 계산돼 아래가 뜬다.
     화면 틀(.app-frame)의 높이를 그대로 따라간다. (형 지적 2026-08-18) */
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 24px calc(20px + var(--safe-bottom));
`;

/* 그림 칸이 남는 높이를 전부 먹는다 — 그림 크기가 달라도 칸 높이는 그대로다 */
const Illust = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
`;

const IllustImg = styled.img`
  width: 100%;
  max-width: 300px;
  height: 100%;
  object-fit: contain;
`;

/* 제목이 두 줄이든 세 줄이든 아래가 안 밀리게 최소 높이를 잡아둔다 */
const Copy = styled.div`
  flex: 0 0 auto;
  min-height: 186px;
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
  const VARIANT = onboardVariant(ONBOARD_VARIANT);
  const PAGES = VARIANT.copy || STEPS;   // 특징형 안은 문구도 같이 갖고 있다
  const navigate = useNavigate();
  const [i, setI] = useState(0);

  useNoScroll();   // 한 화면에 다 들어간다 — 스크롤 막대도 밀리는 느낌도 없앤다

  const s = PAGES[i];
  const last = i === PAGES.length - 1;

  const markSeen = async () => {
    try { await localforage.setItem(ONBOARDING_KEY, true); } catch { /* noop */ }
  };

  /* 마지막 장의 '시작하기' — 로그인 안 한 사람은 로그인 화면으로 바로 보낸다.
     홈에 들렀다가 가는 게 아니라 곧장 로그인이다 (형 지시 2026-08-18). */
  const start = async () => {
    await markSeen();
    if (await isGuest()) { navigate("/Mobilelogin", { replace: true }); return; }
    navigate("/Mobilemain", { replace: true });
  };

  /* '건너뛰기' 는 말 그대로 둘러보기 — 로그인 없이 홈으로 간다.
     가입은 무언가 하려는 순간(등록·지원·채팅)에 받는다 (형 지시 2026-08-13). */
  const skip = async () => {
    await markSeen();
    await enterGuest();
    navigate("/Mobilemain");
  };

  const next = () => (last ? start() : setI(i + 1));

  return (
    <Wrap style={containerStyle}>
      <Illust>
        {React.createElement(VARIANT.steps[i])}
      </Illust>

      <Copy>
        <Step>{s.step}</Step>
        <Title>
          {/* 홀수 번째 조각만 포인트색 — 문장을 끊지 않고 강조한다 */}
          {s.title.map((seg, k) => (k % 2 === 1 ? <span key={k}>{seg}</span> : <React.Fragment key={k}>{seg}</React.Fragment>))}
        </Title>
        <Sub>{s.sub}</Sub>
      </Copy>

      <Dots>
        {PAGES.map((_, k) => <Dot key={k} $on={k === i} />)}
      </Dots>

      <Foot>
        {last ? (
          <StartBtn onClick={start}>시작하기</StartBtn>
        ) : (
          <>
            <Skip onClick={skip}>건너뛰기</Skip>
            <NextBtn onClick={next}>다음</NextBtn>
          </>
        )}
      </Foot>
    </Wrap>
  );
};

export default MobileOnboardingcontainer;
