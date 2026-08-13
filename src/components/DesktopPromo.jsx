import React from "react";
import styled from "styled-components";
import { PiNotePencilBold, PiHandHeartBold, PiUserCheckBold, PiChatCircleTextBold } from "react-icons/pi";
import { imageDB } from "../utility/imageData";

/**
 * PC 랜딩 (형 지시 2026-08-13 — seekone DesktopPromo 방식)
 *
 * 모바일에서는 아무것도 안 보인다(CSS 에서 숨김).
 * PC 에서만 왼쪽에 소개가 깔리고, 오른쪽 폰 목업 안에서 앱이 그대로 돈다.
 * 화면 라우트는 건드리지 않는다 — App 에 이 컴포넌트를 한 번 얹는 것으로 끝.
 */
const Head = styled.header.attrs({ className: "hg-lhead" })`
  gap: 10px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  img { width: 34px; height: 34px; }
  b { font-size: 19px; font-weight: 800; color: #1B1B1F; letter-spacing: -0.02em; }
`;

const Landing = styled.div.attrs({ className: "hg-landing" })``;

const Hero = styled.h1`
  margin: 0;
  font-size: clamp(34px, 3.4vw, 48px);
  font-weight: 800;
  line-height: 1.28;
  letter-spacing: -0.03em;
  color: #1B1B1F;
  white-space: pre-line;

  span { color: #FF4E19; }
`;

const Sub = styled.p`
  margin: 20px 0 0;
  font-size: 18px;
  line-height: 1.65;
  color: #5C5C66;
  white-space: pre-line;
`;

const Steps = styled.div`
  margin-top: 38px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  max-width: 620px;
`;

const StepCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
`;

const StepIcon = styled.div`
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #FFEDE6;
  color: #FF4E19;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepText = styled.div`
  min-width: 0;

  b {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #1B1B1F;
  }
  span {
    display: block;
    margin-top: 3px;
    font-size: 14px;
    line-height: 1.5;
    color: #6B6B75;
    white-space: pre-line;
  }
`;

const Note = styled.div`
  margin-top: 30px;
  font-size: 15px;
  color: #8A8A94;
`;

// CORE 의 네 단계를 그대로 소개한다
const STEPS = [
  { Icon: PiNotePencilBold, t: "① 일을 올린다", d: "집 청소부터 병원 동행까지\n필요한 일을 골라 올립니다" },
  { Icon: PiHandHeartBold, t: "② 홍여사가 지원한다", d: "가까이 있는 분들이\n먼저 손을 듭니다" },
  { Icon: PiUserCheckBold, t: "③ 고른다", d: "지원한 분들 중에서\n마음에 드는 분을 고릅니다" },
  { Icon: PiChatCircleTextBold, t: "④ 연결된다", d: "채팅으로 이야기하고\n결제까지 앱 안에서" },
];

const DesktopPromo = () => (
  <>
    <div className="hg-landing-bg" aria-hidden="true" />

    <Head>
      <Brand onClick={() => { window.location.href = "/"; }}>
        <img src={imageDB.logo} alt="" />
        <b>구해줘 홍여사</b>
      </Brand>
    </Head>

    <Landing>
      <Hero>{"필요한 일,\n가까운 "}<span>홍여사</span>{"에게"}</Hero>
      <Sub>{"일을 올리면 근처 홍여사들이 지원합니다.\n그중에서 마음에 드는 분을 고르기만 하면 됩니다."}</Sub>

      <Steps>
        {STEPS.map(({ Icon, t, d }) => (
          <StepCard key={t}>
            <StepIcon><Icon size={20} /></StepIcon>
            <StepText>
              <b>{t}</b>
              <span>{d}</span>
            </StepText>
          </StepCard>
        ))}
      </Steps>

      <Note>오른쪽 화면에서 지금 바로 써보실 수 있습니다.</Note>
    </Landing>
  </>
);

export default DesktopPromo;
