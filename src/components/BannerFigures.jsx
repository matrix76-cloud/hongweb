// 홈 배너 인물 — 버스(SVG)와 같은 평면 그림체로 직접 그린 할머니·청소 아줌마 (2026-08-22)
// 기존 그림(걷기 gif 정지컷 · 온보딩 홍여사)은 그림체가 서로 달라서, 버스 톤에 맞춰 단순한 도형으로 그렸다.
// 크기는 viewBox 기준이고 width 만 주면 비율대로 커진다.
import React from "react";
import styled, { keyframes, css } from "styled-components";

const SKIN = "#F6C9A6";
const INK = "#1F2A44";
const ORANGE = "#F0752B";
const YELLOW = "#F7C32E";
const CREAM = "#FFF1DC";
const BLUE = "#2E4FA8";
const APRON = "#3A5BB8";   // 청소 아줌마 앞치마 — 할머니(주황)와 구분되는 파랑 (형 지시 2026-08-23)

const reduce = css`@media (prefers-reduced-motion: reduce) { animation: none; }`;

/* 대걸레 — 손목을 축으로 좌우로 쓸기 */
const kSweep = keyframes`
  0%, 100% { transform: rotate(-9deg); }
  50% { transform: rotate(9deg); }
`;
const Sweep = styled.g`
  transform-box: fill-box; transform-origin: 50% 18%;
  animation: ${kSweep} 1.6s ease-in-out infinite;
  ${reduce}
`;
/* 할머니 손 — 아이들 쪽으로 토닥이듯 */
const kPat = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-14deg); }
`;
const Pat = styled.g`
  transform-box: fill-box; transform-origin: 15% 20%;
  animation: ${kPat} 1.8s ease-in-out infinite;
  ${reduce}
`;

/** 청소 아줌마 — 둥근 어깨, A라인 주황 앞치마, 낮은 쪽머리와 앞머리, 웃는 눈. 인자한 인상 */
export const CleanerSvg = ({ width = 72 }) => (
  <svg width={width} viewBox="0 0 72 104" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 대걸레 (뒤) */}
    <Sweep>
      <rect x="50" y="34" width="3" height="56" rx="1.5" fill="#B07A3B" />
      {/* 대걸레 머리 — 흰색이 너무 떠서 연한 황토색 실 느낌으로 */}
      <path d="M42 88 Q51 84 62 88 L64 100 Q51 104 40 100 Z" fill="#D9B98A" />
      <path d="M45 92 L46 101 M50 91 L51 102 M55 91 L56 102 M60 92 L61 101" stroke="#B9945F" strokeWidth="1.4" strokeLinecap="round" />
    </Sweep>
    {/* 다리 */}
    <rect x="23" y="78" width="8" height="18" rx="3" fill={SKIN} />
    <rect x="34" y="78" width="8" height="18" rx="3" fill={SKIN} />
    <rect x="20" y="93" width="13" height="6" rx="3" fill="#5B3A1E" />
    <rect x="33" y="93" width="13" height="6" rx="3" fill="#5B3A1E" />
    {/* 몸통 — 둥근 어깨의 크림 블라우스 위에 A라인 주황 앞치마 */}
    <path d="M19 44 Q19 36 28 36 H38 Q47 36 47 44 V60 H19 Z" fill={CREAM} />
    <path d="M22 46 H44 L50 82 H16 Z" fill={APRON} />
    <path d="M28 38 H38 V46 H28 Z" fill={APRON} />
    <path d="M24 58 H42" stroke="#2A4590" strokeWidth="1.5" opacity=".8" />
    {/* 팔 — 가늘고 부드럽게 몸을 따라 내려온다. 오른손은 대걸레 자루를 가볍게 쥔다 */}
    <path d="M20 47 Q13 56 16 67" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
    <path d="M46 47 Q51 56 50 67" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="16" cy="68" r="3.2" fill={SKIN} />
    <circle cx="50.5" cy="68" r="3.2" fill={SKIN} />
    {/* 머리 — 턱선 단발(옆가르마). 얼굴은 몸에 비해 작게(0.8배) */}
    <g transform="translate(33 37) scale(0.7) translate(-33 -37)">
    <path d="M20 24 Q20 8 33 8 Q46 8 46 24 V37 Q46 42 41 42 H25 Q20 42 20 37 Z" fill="#4A2E1B" />
    <ellipse cx="33" cy="25.5" rx="11.5" ry="14" fill={SKIN} />
    <path d="M21.5 24 Q21.5 9 33 9 Q44.5 9 44.5 24 Q42.5 16 37 17 Q31.5 13 27.5 19 Q24 17 21.5 24 Z" fill="#4A2E1B" />
    {/* 웃는 눈 */}
    <path d="M26 24 Q28.5 21.5 31 24" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M35 24 Q37.5 21.5 40 24" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M29 31 Q33 34 37 31" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="26" cy="29" r="2.4" fill="#F5A38C" opacity=".65" />
    <circle cx="40" cy="29" r="2.4" fill="#F5A38C" opacity=".65" />
    </g>
  </svg>
);

/** 할머니 — 연한 갈색 섞인 회색 머리, 안경 없이 웃는 눈, 주황 가디건, 베이지 치마. 아이들 쪽으로 손을 내민다 */
export const GrandmaSvg = ({ width = 64 }) => (
  <svg width={width} viewBox="0 0 64 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 다리 */}
    <rect x="22" y="78" width="8" height="16" rx="3" fill={SKIN} />
    <rect x="33" y="78" width="8" height="16" rx="3" fill={SKIN} />
    <rect x="19" y="91" width="13" height="6" rx="3" fill="#5B3A1E" />
    <rect x="32" y="91" width="13" height="6" rx="3" fill="#5B3A1E" />
    {/* 치마 */}
    <path d="M18 60 H46 L50 82 H14 Z" fill={CREAM} />
    {/* 가디건 — 둥근 어깨 */}
    <path d="M18 42 Q18 34 27 34 H37 Q46 34 46 42 V62 H18 Z" fill={ORANGE} />
    <path d="M32 36 V62" stroke="#D9621E" strokeWidth="1.5" />
    <circle cx="32" cy="44" r="1.4" fill={YELLOW} />
    <circle cx="32" cy="52" r="1.4" fill={YELLOW} />
    {/* 왼팔 */}
    <path d="M19 44 Q12 52 16 62" stroke={SKIN} strokeWidth="5.5" strokeLinecap="round" />
    <circle cx="16" cy="63" r="3.5" fill={SKIN} />
    {/* 오른팔 — 아이들 쪽으로 내밀어 토닥인다 */}
    <Pat>
      <path d="M45 44 Q55 48 59 58" stroke={SKIN} strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="59" cy="59" r="3.8" fill={SKIN} />
    </Pat>
    {/* 머리 — 둥근 얼굴, 쪽머리 */}
    <circle cx="32" cy="22" r="13.5" fill={SKIN} />
    <path d="M18.5 22 Q18.5 7 32 7 Q45.5 7 45.5 22 Q40 13 32 15 Q24 13 18.5 22 Z" fill="#A8917A" />
    <circle cx="19" cy="14" r="6" fill="#A8917A" />
    <path d="M21 18 Q26 16 30 19" stroke="#C9B59E" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
    {/* 웃는 눈 + 잔주름 */}
    <path d="M25 23 Q27.5 20.5 30 23" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M34 23 Q36.5 20.5 39 23" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M23 27 Q24 26.5 25 27" stroke={INK} strokeWidth="1" strokeLinecap="round" opacity=".5" />
    <path d="M39 27 Q40 26.5 41 27" stroke={INK} strokeWidth="1" strokeLinecap="round" opacity=".5" />
    <path d="M28 30 Q32 33 36 30" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="28" r="2.4" fill="#F5A38C" opacity=".65" />
    <circle cx="40" cy="28" r="2.4" fill="#F5A38C" opacity=".65" />
  </svg>
);

/* 꼬리 흔들기 */
const kWag = keyframes`
  0%, 100% { transform: rotate(-18deg); }
  50% { transform: rotate(18deg); }
`;
const Wag = styled.g`
  transform-box: fill-box; transform-origin: 10% 90%;
  animation: ${kWag} .6s ease-in-out infinite;
  ${reduce}
`;

/** 강아지 — 앉아서 꼬리 흔드는 크림색 작은 개. 갈색 귀, 까만 코, 빨간 목줄 */
export const PuppySvg = ({ width = 40 }) => (
  <svg width={width} viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 꼬리 */}
    <Wag>
      <path d="M36 30 Q44 22 42 14" stroke="#F3E2C6" strokeWidth="5" strokeLinecap="round" />
    </Wag>
    {/* 몸 (앉은 자세) */}
    <path d="M12 40 Q10 24 22 22 H30 Q40 24 38 40 Z" fill="#F3E2C6" />
    <ellipse cx="17" cy="40" rx="5" ry="2.5" fill="#E4CFA9" />
    <ellipse cx="33" cy="40" rx="5" ry="2.5" fill="#E4CFA9" />
    {/* 목줄 */}
    <path d="M15 25 Q24 29 33 25" stroke="#E5392B" strokeWidth="2.5" strokeLinecap="round" />
    {/* 머리 */}
    <circle cx="22" cy="14" r="11" fill="#F3E2C6" />
    <path d="M12 10 Q8 2 14 4 Q18 6 17 12 Z" fill="#B07A3B" />
    <path d="M31 11 Q36 2 30 4 Q26 6 27 12 Z" fill="#B07A3B" />
    <path d="M18 8 Q22 5 26 8 V14 Q22 17 18 14 Z" fill="#B07A3B" opacity=".55" />
    {/* 얼굴 */}
    <circle cx="18.5" cy="13" r="1.5" fill={INK} />
    <circle cx="25.5" cy="13" r="1.5" fill={INK} />
    <ellipse cx="22" cy="18" rx="2.4" ry="1.8" fill={INK} />
    <path d="M19.5 21 Q22 23 24.5 21" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="16" cy="17" r="1.8" fill="#F5A38C" opacity=".6" />
    <circle cx="28" cy="17" r="1.8" fill="#F5A38C" opacity=".6" />
  </svg>
);

/** 병원 — 한눈에 병원으로 읽히게: 옥상 빨간 십자 간판, 벽면 십자, 입구 차양, '병원' 글자 */
export const HospitalSvg = ({ width = 110 }) => (
  <svg width={width} viewBox="0 0 110 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 옥상 간판 */}
    <rect x="33" y="4" width="44" height="30" rx="4" fill="#fff" stroke="#E5392B" strokeWidth="3" />
    <rect x="51" y="9" width="8" height="20" rx="1.5" fill="#E5392B" />
    <rect x="45" y="15" width="20" height="8" rx="1.5" fill="#E5392B" />
    <rect x="52" y="34" width="6" height="6" fill="#C9D2E0" />
    {/* 본관 */}
    <rect x="8" y="40" width="94" height="106" rx="3" fill="#E3ECF7" stroke="#C3D3E8" strokeWidth="2" />
    <rect x="8" y="40" width="94" height="8" fill="#E5392B" opacity=".85" />
    {/* 창문 3x3 */}
    {[0, 1].map((r) => [0, 1, 2].map((c) => (
      <rect key={`${r}${c}`} x={18 + c * 28} y={58 + r * 22} width="18" height="14" rx="2" fill="#2E4FA8" />
    )))}
    {/* 벽면 십자 */}
    <rect x="88" y="52" width="4" height="12" fill="#E5392B" />
    <rect x="84" y="56" width="12" height="4" fill="#E5392B" />
    {/* 입구 — 차양 + 유리문 */}
    <rect x="34" y="118" width="42" height="28" fill="#2E4FA8" />
    <rect x="54" y="118" width="2" height="28" fill="#fff" opacity=".6" />
    <path d="M28 118 H82 L78 110 H32 Z" fill="#E5392B" />
    {/* 글자 */}
    <text x="55" y="109" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1F2A44" fontFamily="Pretendard, 'Malgun Gothic', sans-serif">병원</text>
    {/* 바닥 덤불 */}
    <ellipse cx="14" cy="146" rx="12" ry="5" fill="#F7C32E" />
    <ellipse cx="97" cy="146" rx="11" ry="5" fill="#F7C32E" />
  </svg>
);

/* 손 흔들기 */
const kWave = keyframes`
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(10deg); }
`;
const WaveArm = styled.g`
  transform-box: fill-box; transform-origin: 20% 95%;
  animation: ${kWave} 1.1s ease-in-out infinite;
  ${reduce}
`;

/** 손 드는 홍여사 — 온보딩 "지원합니다" 장면용. 머리·앞치마 색으로 서로 다르게 */
export const HelperSvg = ({ width = 64, hair = "#4A2E1B", apron = APRON, top = CREAM, raise = true, dim = false }) => (
  <svg width={width} viewBox="0 0 72 104" fill="none" xmlns="http://www.w3.org/2000/svg" style={dim ? { opacity: .35 } : undefined}>
    <rect x="23" y="78" width="8" height="18" rx="3" fill={SKIN} />
    <rect x="34" y="78" width="8" height="18" rx="3" fill={SKIN} />
    <rect x="20" y="93" width="13" height="6" rx="3" fill="#5B3A1E" />
    <rect x="33" y="93" width="13" height="6" rx="3" fill="#5B3A1E" />
    <path d="M19 44 Q19 36 28 36 H38 Q47 36 47 44 V60 H19 Z" fill={top} />
    <path d="M22 46 H44 L50 82 H16 Z" fill={apron} />
    <path d="M28 38 H38 V46 H28 Z" fill={apron} />
    {/* 왼팔 — 내려간 팔 */}
    <path d="M20 47 Q13 56 16 67" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="16" cy="68" r="3.2" fill={SKIN} />
    {/* 오른팔 — 번쩍 들고 흔든다 */}
    {raise ? (
      <WaveArm>
        <path d="M46 46 Q56 36 58 22" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="58" cy="20" r="4" fill={SKIN} />
      </WaveArm>
    ) : (
      <>
        <path d="M46 47 Q51 56 50 67" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="50.5" cy="68" r="3.2" fill={SKIN} />
      </>
    )}
    {/* 머리 — 단발, 타원 얼굴, 웃는 눈 (청소 아줌마와 같은 얼굴) */}
    <g transform="translate(33 37) scale(0.72) translate(-33 -37)">
      <path d="M20 24 Q20 8 33 8 Q46 8 46 24 V37 Q46 42 41 42 H25 Q20 42 20 37 Z" fill={hair} />
      <ellipse cx="33" cy="25.5" rx="11.5" ry="14" fill={SKIN} />
      <path d="M21.5 24 Q21.5 9 33 9 Q44.5 9 44.5 24 Q42.5 16 37 17 Q31.5 13 27.5 19 Q24 17 21.5 24 Z" fill={hair} />
      <path d="M26 24 Q28.5 21.5 31 24" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M35 24 Q37.5 21.5 40 24" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M29 31 Q33 34 37 31" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="26" cy="29" r="2.4" fill="#F5A38C" opacity=".65" />
      <circle cx="40" cy="29" r="2.4" fill="#F5A38C" opacity=".65" />
    </g>
  </svg>
);

/** 아이 — 단순 도형. flip 이면 왼쪽을 본다 */
export const KidSvg = ({ width = 30, shirt = YELLOW, hair = "#3B2416", flip = false }) => (
  <svg width={width} viewBox="0 0 30 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <rect x="9" y="40" width="5" height="10" rx="2" fill={INK} />
    <rect x="16" y="40" width="5" height="10" rx="2" fill={INK} />
    <rect x="7" y="48" width="8" height="4" rx="2" fill="#5B3A1E" />
    <rect x="15" y="48" width="8" height="4" rx="2" fill="#5B3A1E" />
    <path d="M8 24 Q8 20 13 20 H17 Q22 20 22 24 V42 H8 Z" fill={shirt} />
    <path d="M8 26 Q4 31 6 37" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
    <path d="M22 26 Q26 31 24 37" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="15" cy="12" r="9" fill={SKIN} />
    <path d="M6 11 Q6 2 15 2 Q24 2 24 11 Q19 7 15 8 Q11 7 6 11 Z" fill={hair} />
    <circle cx="12" cy="13" r="1.2" fill={INK} />
    <circle cx="18" cy="13" r="1.2" fill={INK} />
    <path d="M13 17 Q15 18.5 17 17" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
