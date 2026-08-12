// src/components/DevBottomBanner.jsx
import React from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";

export default function DevBottomBanner({
    visible,
    bgImage,
    title = "개발 문의",
    priceLeft = "300만원",
    priceRight = "MVP 개발",
    desc = "앱 · 웹 · 관리자까지 한 번에 제작",
    cta = "상담하기",
    onClick,
    onCtaClick,
    onHideToday,
}) {
    if (!visible) return null;

    return (
        <Dock>
            <Card role="button" onClick={onClick}>
                {/* ✅ 배경 이미지 풀커버 */}
                <Bg $bg={bgImage} />
                <Shade />

                <Body>
                    <Title>{title}</Title>

                    <BadgeLine>
                        <BadgeAccent>{priceLeft}</BadgeAccent>이면{" "}
                        <BadgeAccent>{priceRight}</BadgeAccent>
                    </BadgeLine>

                    <Desc>{desc}</Desc>

                    <Actions>
                        <Cta
                            onClick={(e) => {
                                e.stopPropagation();
                                onCtaClick?.();
                            }}
                        >
                            {cta}
                        </Cta>

                        <HideToday
                            onClick={(e) => {
                                e.stopPropagation();
                                onHideToday?.(); // ✅ 오늘 하루 그만보기 + 즉시 닫힘은 이 함수에서
                            }}
                        >
                            그만보기
                        </HideToday>
                    </Actions>
                </Body>
            </Card>
        </Dock>
    );
}

/* ================= styles ================= */

const Dock = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: min(94vw, 520px);
  bottom: 65px; /* 탭바 높이 */
  z-index: 9999;
`;

const Card = styled.div`
  position: relative;
  height: 190px;
  border-radius: 26px;
  overflow: hidden;

  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.22);

  cursor: pointer;
  user-select: none;

  &:active {
    transform: scale(0.995);
    opacity: 0.98;
  }
`;

const Bg = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.$bg || "none"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Shade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(58, 85, 255, 0.78) 0%,
    rgba(113, 66, 222, 0.55) 45%,
    rgba(2, 6, 23, 0.12) 100%
  );
`;

const Body = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  min-width: 0;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 900;
  letter-spacing: -0.2px;
  text-shadow: 0 10px 22px rgba(2, 6, 23, 0.35);
`;

const BadgeLine = styled.div`
  margin-top: 10px;
  font-size: ${() => getFontSize(18)}px !important;
  font-weight: 900;
  letter-spacing: -0.3px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: baseline;
  text-shadow: 0 10px 22px rgba(2, 6, 23, 0.28);
`;

const BadgeAccent = styled.span`
  font-weight: 1000;
  background: linear-gradient(180deg, #ffe07a 0%, #ffb020 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Desc = styled.div`
  margin-top: 10px;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.35;
  text-shadow: 0 10px 22px rgba(2, 6, 23, 0.28);

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
`;

const Cta = styled.div`
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.92);
  color: #1d4ed8;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;
  box-shadow: 0 12px 22px rgba(2, 6, 23, 0.18);
`;

const HideToday = styled.div`
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.25);

  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;
`;
