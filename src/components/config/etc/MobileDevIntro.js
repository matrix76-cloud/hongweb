// 📄 src/components/config/etc/MobileDevIntro.jsx
import React, { useMemo, useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { getFontSize } from "../../../utility/fontsize";
import { CONFIGMOVE } from "../../../utility/screen";
import DevHeroParticles from "../../DevHeroParticles";

export default function MobileDevIntro() {
  const navigate = useNavigate();

  const goDevContact = () => {
    navigate("/Mobileconfigcontent", {
      state: { NAME: CONFIGMOVE.DEVCONTACT },
    });
  };

  // ✅ 키워드 라인업
  const keywords = useMemo(
    () => [
      "소셜 로그인",
      "채팅",
      "PG 결제",
      "푸시 알림",
      "관리자 페이지",
      "쇼핑몰",
      "예약/스케줄",
      "지도/위치기반",
      "포인트/쿠폰",
      "정산/매출",
      "알림톡/SMS",
      "외부 API 연동",
      "Firebase",
      "React Native",
      "웹앱(PWA)",
    ],
    []
  );

  const painRef = useRef(null);
  const [painOn, setPainOn] = useState(false);

  useEffect(() => {
    const el = painRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPainOn(true);
          io.disconnect(); // ✅ 1번만 실행
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Wrap>
      <Section>
        <SectionTitle>이런 고민, 해보셨죠?</SectionTitle>
        <Card ref={painRef}>
          {[
            "아이디어는 있는데 개발은 어렵고",
            "견적은 천차만별이고",
            "누가 제대로 해줄지 모르겠고",
            "만들고 나서 운영도 막막하고",
          ].map((t, idx) => (
            <Bullet key={idx} $on={painOn} $idx={idx}>
              • {t}
            </Bullet>
          ))}
        </Card>
      </Section>

      {/* ✅ three.js(DevHeroParticles) 구간 */}
      <Section>
        <SectionTitle>실제 제작 흐름 기준으로 진행합니다</SectionTitle>

        <ImgCard>
          {/* ✅ 배경 비주얼 */}
          <ParticlesWrap>
            <DevHeroParticles height="100%" style={{ borderRadius: 0 }} />
          </ParticlesWrap>
         

          {/* ✅ 의미 전달 오버레이(문구 + 하단 페이드) */}
          <HeroOverlay>
            <HeroCopy>
              <HeroKicker>아이디어를</HeroKicker>
              <HeroHeadline>
                <b>실제로 움직이는 서비스</b>로 만듭니다
              </HeroHeadline>
              <HeroDesc>기획 · 개발 · 배포 · 운영까지, 끝까지 책임집니다</HeroDesc>
            </HeroCopy>
            <HeroFade />
          </HeroOverlay>
        </ImgCard>
      </Section>

      {/* ✅ 키워드(움직이는 라인) */}
      {/* <Section>
        <SectionTitle>이런 기능들, 기본으로 붙여요</SectionTitle>

        <MarqueeBox>
          <MarqueeTrack>
            {[...keywords, ...keywords].map((k, idx) => (
              <Chip key={`${k}-${idx}`}>
                <span className="dot" />
                {k}
              </Chip>
            ))}
          </MarqueeTrack>
        </MarqueeBox>

        <MarqueeBox2>
          <MarqueeTrack2>
            {[...keywords.slice().reverse(), ...keywords.slice().reverse()].map((k, idx) => (
              <Chip2 key={`${k}-r-${idx}`}>
                <span className="dot" />
                {k}
              </Chip2>
            ))}
          </MarqueeTrack2>
        </MarqueeBox2>
      </Section> */}

      {/* <Section>
        <SectionTitle>이런 분께 딱 맞아요</SectionTitle>
        <Grid>
          <MiniCard>
            <MiniTitle>아이디어만 있는 분</MiniTitle>
            <MiniDesc>기획부터 MVP까지 같이 잡아드립니다</MiniDesc>
          </MiniCard>
          <MiniCard>
            <MiniTitle>빠르게 검증하고 싶은 분</MiniTitle>
            <MiniDesc>시장 반응 확인용 MVP에 최적화</MiniDesc>
          </MiniCard>
          <MiniCard>
            <MiniTitle>운영까지 생각하는 분</MiniTitle>
            <MiniDesc>관리자/정산/알림까지 고려</MiniDesc>
          </MiniCard>
          <MiniCard>
            <MiniTitle>기존 서비스 고도화</MiniTitle>
            <MiniDesc>기능 추가·개선·유지보수 가능</MiniDesc>
          </MiniCard>
        </Grid>
      </Section> */}

      <BottomSpace />

      {/* ✅ 하단 고정 CTA */}
      <Dock>
        <DockInner>
          <DockText>
            <DockTitle>대표님은 아이디어만 준비하세요</DockTitle>
            <DockDesc>
              <PriceAccent>300만원</PriceAccent>이면 <PriceAccent>MVP</PriceAccent> 시작 가능합니다
            </DockDesc>
          </DockText>

          <CtaBtn onClick={goDevContact} role="button" aria-label="상담하기">
            지금 상담하기
          </CtaBtn>
        </DockInner>
      </Dock>
    </Wrap>
  );
}

/* =========================
   styles
========================= */

const Wrap = styled.div`
  padding: 12px;
  padding-bottom: 110px; /* 하단 Dock 공간 */
  background: #fcfbf7;
`;

const Section = styled.div`
  margin-top: 16px;
`;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.2px;
  margin: 0 2px 10px;
`;

const Card = styled.div`
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.06);
  padding: 16px;
`;

const Bullet = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.82);
  line-height: 1.65;

  opacity: ${(p) => (p.$on ? 1 : 0)};
  transform: ${(p) => (p.$on ? "translateY(0px)" : "translateY(8px)")};
  transition: opacity 520ms ease, transform 520ms ease;
  transition-delay: ${(p) => (p.$on ? `${p.$idx * 180}ms` : "0ms")};

  & + & {
    margin-top: 10px;
  }
`;



/* ✅ 오버레이: 텍스트 + 페이드 */
const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none; /* ✅ 드래그/터치 방해 안 함 */
`;

const HeroCopy = styled.div`
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  z-index: 3;

  padding: 12px 12px 10px;
  border-radius: 16px;

  background: rgba(2, 6, 23, 0.38);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.40);
  backdrop-filter: blur(10px);
`;

const HeroKicker = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.84);
  letter-spacing: -0.2px;
`;

const HeroHeadline = styled.div`
  margin-top: 6px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.96);
  letter-spacing: -0.4px;
  line-height: 1.18;

  b {
    background: linear-gradient(180deg, #ffd84d 0%, #ff7a00 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    font-weight: 900;
  }
`;

const HeroDesc = styled.div`
  margin-top: 6px;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.35;
`;

const HeroFade = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160px;
  z-index: 2;

  background: linear-gradient(
    180deg,
    rgba(2, 6, 23, 0.00) 0%,
    rgba(2, 6, 23, 0.18) 35%,
    rgba(2, 6, 23, 0.55) 100%
  );
`;

/* ✅ 키워드 마퀴 */
const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;
const marquee2 = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

const MarqueeBox = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.06);
  padding: 12px 0;
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  padding: 0 12px;
  animation: ${marquee} 16s linear infinite;
  will-change: transform;
`;

const MarqueeBox2 = styled.div`
  margin-top: 10px;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.06);
  padding: 12px 0;
`;

const MarqueeTrack2 = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  padding: 0 12px;
  animation: ${marquee2} 18s linear infinite;
  will-change: transform;
`;

const Chip = styled.div`
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.10);
  border: 1px solid rgba(99, 102, 241, 0.18);
  color: rgba(15, 23, 42, 0.82);

  display: inline-flex;
  align-items: center;
  gap: 8px;

  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  white-space: nowrap;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #6366f1;
  }
`;

const Chip2 = styled(Chip)`
  background: rgba(14, 165, 233, 0.10);
  border: 1px solid rgba(14, 165, 233, 0.18);

  .dot {
    background: #0ea5e9;
  }
`;

/* ✅ 추천 카드 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const MiniCard = styled.div`
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.06);
  padding: 12px;
  min-height: 92px;
`;

const MiniTitle = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.2px;
`;

const MiniDesc = styled.div`
  margin-top: 6px;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 800;
  color: rgba(15, 23, 42, 0.70);
  line-height: 1.35;
`;

/* ✅ 하단 Dock */
const BottomSpace = styled.div`
  height: 12px;
`;

const Dock = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 65px; /* 탭바 높이 */
  width: min(94vw, 520px);
  z-index: 9999;
`;

const DockInner = styled.div`
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.22);

  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #a855f7 100%);
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const DockText = styled.div`
  flex: 1;
  min-width: 0;
  color: #fff;
`;

const DockTitle = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;
  letter-spacing: -0.2px;
  text-shadow: 0 10px 22px rgba(2, 6, 23, 0.35);
`;

const DockDesc = styled.div`
  margin-top: 6px;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 10px 22px rgba(2, 6, 23, 0.28);
`;

const PriceAccent = styled.span`
  background: linear-gradient(180deg, #ffd84d 0%, #ff7a00 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

const CtaBtn = styled.div`
  flex: 0 0 auto;
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.95);
  color: #1d4ed8;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  box-shadow: 0 12px 22px rgba(2, 6, 23, 0.18);

  &:active {
    transform: scale(0.99);
    opacity: 0.96;
  }
`;

const ImgCard = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;

  /* ✅ 모바일에서 너무 길면 위쪽 검은 여백/짤림 체감 커짐 */
  height: 520px;
  background: #000;

  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 12px 26px rgba(2, 6, 23, 0.12);

  /* ✅ 모바일 최적 높이 */
  @media (max-width: 420px) {
    height: 380px;
  }
`;

/* ✅ 캔버스가 무조건 카드 꽉 채우고, 위쪽 검은 영역을 “크롭” */
const ParticlesWrap = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  /* DevHeroParticles 내부 canvas가 작게 잡힐 때 대비 */
  & > * {
    width: 100%;
    height: 100%;
  }

  /* ✅ 위쪽 검은 부분 살짝 잘라내기(필요하면 값만 조절) */
  transform: translateY(-22px) scale(1.06);
  transform-origin: center;

  @media (max-width: 420px) {
    transform: translateY(-28px) scale(1.10);
  }
`;

