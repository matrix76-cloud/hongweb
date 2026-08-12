// components/EditToggle.jsx
import React from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";

const THEMES = {
  seek: {
    // 구직하기(파랑) – WorkBannerBox 'seek'와 동일 톤
    bg: "#ecebea",
    fg: "#131313",
    pillBg: "rgba(255,255,255,.20)",
    pillBorder: "rgba(255,255,255,.35)",
  },
  hire: {
    // 구인하기(보라) – WorkBannerBox 'hire'와 동일 톤
    bg: "#ecebea",
    fg: "#131313",
    pillBg: "rgba(255,255,255,.20)",
    pillBorder: "rgba(255,255,255,.35)",
  },
};

export default function EditToggle({ variant = "hire", isEditing, onClick }) {
  const t = THEMES[variant] || THEMES.hire;
  return (
    <Wrap
      type="button"
      onClick={onClick}
      aria-pressed={!!isEditing}
      $bg={t.bg}
      $fg={t.fg}
    >
      <TextGroup>
        <Title>편집 모드</Title>
      </TextGroup>
      <Pill $bg={t.pillBg} $bd={t.pillBorder}>{isEditing ? "✔" : "+"}</Pill>
    </Wrap>
  );
}

/* styles */
const Wrap = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
  &:active { transform: scale(.985); box-shadow: 0 6px 18px rgba(0,0,0,.12); }
`;

const TextGroup = styled.div`text-align: left;`;
const Title = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(14)}px !important;
  letter-spacing: -0.2px;
`;
const Sub = styled.div`
  margin-top: 4px;
  font-size: ${() => getFontSize(14)}px !important;
  opacity: .9;
`;

const Pill = styled.div`
  width: 34px;
  height: 34px;                 /* ✅ 정사각형 고정 */
  border-radius: 50%;

  display: flex;                 /* ✅ 완전 중앙 정렬 */
  align-items: center;
  justify-content: center;

  background: ${({ $bg }) => $bg || "rgba(255, 255, 255, .20)"};
  border: 1.5px solid ${({ $bd }) => $bd || "rgba(255, 255, 255, .35)"};

  font-size: ${() => getFontSize(18)}px !important;
  font-weight: 700;
  line-height: 1;                /* ✅ 베이스라인 영향 제거 */

`;
