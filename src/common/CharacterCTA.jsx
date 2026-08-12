// src/components/common/CharacterCTA.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { getFontSize } from "../utility/fontsize";

const PALETTES = {
    orange: { from: "#FF8A00", to: "#FF5E62" },
    purple: { from: "#7C3AED", to: "#5336E3" },
    blue: { from: "#2E5FFF", to: "#2EC9FF" },
    green: { from: "#13C39C", to: "#0EA5A7" },
};

export default function CharacterCTA({
    title,
    subtitle,
    badge,
    tone = "purple",
    character,
    bg,
    onClick,
    btnText = "시작하기",
    height = 110,                      // ⬅️ 기본 높이 살짝 낮춤(기존 136)
}) {
    const c = PALETTES[tone] ?? PALETTES.purple;

    return (
        <Wrap
            as="button"
            type="button"
            $h={height}
            $from={c.from}
            $to={c.to}
            onClick={onClick}
            aria-label={title || subtitle}
        >
            {bg ? <BG style={{ backgroundImage: `url(${bg})` }} aria-hidden /> : null}
            <Shine aria-hidden />

            <Texts $h={height}>
                {badge ? <Badge>{badge}</Badge> : null}
                {title ? <Title>{title}</Title> : null}
                {subtitle ? <Sub $h={height}>{subtitle}</Sub> : null}
            </Texts>

            {character ? (
                <Character
                    src={character}
                    alt=""
                    aria-hidden
                    draggable={false}
                    $h={height}                 // ⬅️ 높이에 맞춰 캐릭터 픽셀 높이 계산
                />
            ) : null}
        </Wrap>
    );
}

/* -------- styles -------- */
const shine = keyframes`
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
`;

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: ${p => p.$h}px;
  margin:20px auto;
  border-radius: 18px;
  padding: ${p => (p.$h <= 112 ? "12px 14px" : "16px 18px")}; /* ⬅️ 컴팩트 패딩 */
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.15);
  background: linear-gradient(135deg, ${p => p.$from}, ${p => p.$to});
  color: #fff;
  box-shadow: 0 10px 24px rgba(0,0,0,.18);
  cursor: pointer;
  transition: transform .06s ease, box-shadow .15s ease, filter .15s ease;

  &:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(0,0,0,.22); }
  &:active { transform: translateY(0); filter: brightness(.98); }
  &:focus-visible { outline: 0; box-shadow: 0 0 0 3px rgba(255,255,255,.35), 0 10px 24px rgba(0,0,0,.18); }
`;

const BG = styled.div`
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: .18; filter: blur(1px);
`;

const Shine = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(75deg, transparent 0%, rgba(255,255,255,.28) 40%, transparent 70%);
  transform: translateX(-120%);
  animation: ${shine} 2.4s ease-in-out infinite;
  pointer-events: none;
`;

const Texts = styled.div`
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  gap: ${p => (p.$h <= 112 ? "4px" : "6px")};
  max-width: 62%;
`;

const Badge = styled.span`
  align-self: flex-start;
  font-size: 12px; font-weight: 700;
  color: #1A1E28;
  background: var(--surface); border-radius: 999px;
  padding: 4px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
`;

const Title = styled.div`
font-size: ${() => getFontSize(20)}px !important;
  
  font-weight: 900; line-height: 1.18;
  text-shadow: 0 2px 8px rgba(0,0,0,.25);
`;

const Sub = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  line-height: 1.35;
  white-space: pre-line;   /* '\n' 줄바꿈 표시 */
  word-break: keep-all;    /* 단어 단위 줄바꿈 */
  overflow: visible;       /* 잘림 제거 */
`;

const MiniBtn = styled.div`
  margin-top: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; padding: 8px 12px;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 12px;
  font-size: 13px; font-weight: 700; color: #fff;
  backdrop-filter: blur(4px);
`;

const Character = styled.img`
  position: absolute;
  right: 6px;
  bottom: 10px;
  height: ${p => Math.round(p.$h * 0.78)}px;  /* ⬅️ 배너 높이에 맞춰 픽셀 고정 */
  transform: translateY(4px) rotate(-2deg);
  filter: drop-shadow(0 12px 16px rgba(0,0,0,.35));
  pointer-events: none;
  transition: transform .18s ease;

  ${Wrap}:hover & { transform: translateY(0) rotate(-1deg) scale(1.02); }
  @media (max-width: 420px) { right: -4px; }
`;
