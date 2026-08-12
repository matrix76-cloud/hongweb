// 📄 src/components/JobCategoryCards.jsx
import React, { useMemo, useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getFontSize } from "../utility/fontsize";
import { DEFAULT_ITEMS, DEFAULT_VISIBLE_KEYS } from "../utility/categories";
import { UserContext } from "../context/User";
import useWorkStatus from "../hooks/useWorkStatus";
import { COLORS } from "../utility/screen";

const isIOS =
  /iP(hone|ad|od)/i.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Mac") && "ontouchend" in window);

// 🔎 단기 알바 카드 판별(키/라벨 모두 대응)
function isAlbaItem(item) {
  const k = (item?.key || "").toLowerCase();
  const label = item?.label || "";
  return (
    k === "alba" ||
    k === "short" ||
    k === "shortalba" ||
    k === "short_job" ||
    k === "shortjob" ||
    /단기|알바/.test(label)
  );
}

function getCountBadgeStyle(n) {
  const c = Number(n) || 0;
  if (c >= 400) return { size: 60, font: 14, alpha: 0.70, offset: 12 };
  if (c >= 200) return { size: 55, font: 14, alpha: 0.66, offset: 10 };
  if (c >= 100) return { size: 44, font: 14, alpha: 0.62, offset: 8 };
  if (c > 0) return { size: 44, font: 13, alpha: 0.58, offset: 6 };
  // 0건: 더 작고 더 연하게
  return { size: 32, font: 12, alpha: 0.48, offset: 104 };
}

export default function JobCategoryCards({
  items = DEFAULT_ITEMS,
  visibleKeys = DEFAULT_VISIBLE_KEYS,
  countsMap = {},
  onSelect,
}) {
  const navigate = useNavigate();
  const [pressedIdx, setPressedIdx] = useState(null);

  // 사용자 위치 기반 단기 알바(OPEN) 카운트
  const { user } = useContext(UserContext);
  const { status } = useWorkStatus(
    user?.USERINFO?.latitude,
    user?.USERINFO?.longitude
  );

  const data = useMemo(() => items.map(trimTitle), [items]);
  const visibleItems = useMemo(
    () => data.filter((it) => visibleKeys.includes(it.key)),
    [data, visibleKeys]
  );

  const handleClick = (item) => {
    if (onSelect) return onSelect(item);
    navigate("/MobileResult", {
      state: { type: "general", catKey: item.key, name: item.label, radiusKm: 10 },
    });
  };

  return (
    <Wrap>
      <Grid className={isIOS ? "ios" : ""}>
        {visibleItems.map((item, idx) => {
          const alba = isAlbaItem(item);
          // ✅ 단기 알바 카드는 useWorkStatus의 OPEN 개수로 오버라이드
          const count = alba
            ? (status?.newCount ?? 0)
            : (countsMap[item.key] ?? item.count ?? 0);

          // ====== ✨ alba 전용 셀 (기존 유지) ======
          if (alba) {
            const albaLines = ["주말·하루", "동네집안일·심부름", "시간제"];
            return (
              <Cell key={item.key}>
                <AlbaCard
                  onClick={() => handleClick(item)}
                  onMouseDown={() => setPressedIdx(idx)}
                  onMouseUp={() => setPressedIdx(null)}
                  $pressed={pressedIdx === idx}
                  aria-label={`단기 알바 총 ${count}건`}
                >
                  <SizerTall /> {/* 비율 박스 */}
                  <AlbaInner>
                    <AlbaSubtitle>
                      {albaLines.map((t, i) => <AlbaLine key={i}>{t}</AlbaLine>)}
                    </AlbaSubtitle>
                    <AlbaCenterBar>
                      <span className="txt">빠르게 구해요</span>
                      {/* {Number(count) > 0 && <span className="sep">·</span>} */}
                      <span className="count">
                        <span className="count-num">{count}</span>
                        <span className="count-suf">건</span>
                      </span>
                    </AlbaCenterBar>
                  </AlbaInner>
                </AlbaCard>
              </Cell>
            );
          }

          // ====== 일반 셀 (상단 라벨만, 카운트는 아래 설명 앞에 숫자로) ======
          // ====== 일반 셀 (제목은 좌측 붙이기, 숫자는 검은 원 뱃지로 아이콘 우측에 겹치기) ======
          return (
            <Cell key={item.key}>
              <Card $bg={item.bgColor} onClick={() => handleClick(item)}>
                <SizerTall />
                <Inner>
                  {/* 제목: 좌측 상단에 content 크기만큼만 */}
                  <TopTitleLeft>
                    <TitleTextLeft>{item.label}</TitleTextLeft>
                  </TopTitleLeft>

                  {/* 메인 일러스트 */}
                  <Art>
                    <CharacterImg src={item.image} alt={item.label} />
                  </Art>

                  {(() => {
                    const s = getCountBadgeStyle(count);
                    return (
                      <CountBubble
                        aria-label={`총 ${count}건`}
                        $size={s.size}
                        $alpha={s.alpha}
                        $font={s.font}
                        $offset={s.offset}
                      >
                        {count}건
                      </CountBubble>
                    );
                  })()}

                  {/* 설명: 회색 배경 박스 + 흰 글씨 (색은 나중에 실험하며 조정) */}
                  <HighlightDesc
                    $bg={item.descBg || "rgba(34,34,34,0.8)"}   // 회색 계열(반투명)
                    $fg={item.descFg || "#fff"}                 // 흰 글씨
                  >
                    {item.title}
                  </HighlightDesc>
                </Inner>
              </Card>
            </Cell>
          );

        })}
      </Grid>
    </Wrap>
  );
}

/* ---------- styles (공통) ---------- */
const Wrap = styled.div`width:100%; margin:0 auto;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-content: start;
  align-items: start;
  &.ios { display:flex; flex-wrap:wrap; gap:12px; }
`;

const Cell = styled.div`flex: 0 0 calc(50% - 6px);`;

const Card = styled.button`
  position: relative; display: block; width: 100%;
  border: 0; margin: 0; padding: 0;
  border-radius: 22px; overflow: hidden;
  background: ${({ $bg }) => $bg || "#fff"};
  box-shadow: 0 4px 10px rgba(0,0,0,.05);
  transition: transform .08s ease, box-shadow .12s ease;
  &:active { transform: scale(.985); box-shadow: 0 6px 16px rgba(0,0,0,.12); }
`;

/* 기존 4:5 → 살짝 키움 */
const Sizer = styled.div`width:100%; padding-bottom:125%; pointer-events:none;`;
const SizerTall = styled(Sizer)`padding-bottom:135%;`; /* 🔼 더 높은 카드 */

const Inner = styled.div`position:absolute; inset:0;`;

const Art = styled.div`
  position: absolute; inset: 0;
  display: grid; place-items: center;
  padding: 28px 14px 112px; /* 🔼 아래 여백 더 확보 */
`;

const CharacterImg = styled.img`
  width: 100px; max-height: 90px; object-fit: contain; margin-top: 25px;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,.12));
  will-change: transform;
  transition: transform .18s cubic-bezier(.22,.61,.36,1), filter .18s;
  @media (hover:hover) and (pointer:fine) {
    &:hover { transform: translateY(-3px) rotate(-1.5deg) scale(1.02); }
  }
  &:active { transform: translateY(-2px) scale(1.01); }
  @media (prefers-reduced-motion: reduce) { transition: none; animation: none; }
`;

/* ---- 상단 라벨(제목만, 5자 보장) ---- */

// --- 스타일 변경/추가 ---

/* 제목(좌측 붙이기, 배경 없음) */
const TopTitleLeft = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
`;
const TitleTextLeft = styled.div`
  font-size: ${() => getFontSize(15)}px;
  font-weight: 800;
  color: #111;
  letter-spacing: -0.2px;
  line-height: 1.2;
`;

/* 숫자 뱃지: 검은 원 + 흰 글씨, 살짝 투명, 아이콘 오른쪽에 겹치기 */
const CountBubble = styled.div`
  position: absolute;
  right: 12px;
  transform: translate(12%, 12%);

  width: ${({ $size }) => $size || 40}px;
  height: ${({ $size }) => $size || 40}px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f47a0096;   /* ✅ 화이트 반투명 */
  color: #fff;                         /* ✅ 블랙 글씨 */
  font-weight: 900;
  font-size: ${({ $font }) => ($font ? `${$font}px` : "14px")} !important;
  line-height: 1;
  letter-spacing: -0.2px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
  z-index: 3;

  @media (max-width: 360px) {
    width: ${({ $size }) => Math.round(($size || 40) * 0.9)}px;
    height: ${({ $size }) => Math.round(($size || 40) * 0.9)}px;
    font-size: ${({ $font }) => ($font ? `${Math.round($font * 0.9)}px` : "13px")};
    right: 10px;
  }
`;


/* 설명 박스: 회색 배경 + 흰 글씨 (2줄까지) */
const HighlightDesc = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  padding: 10px 12px;

  background: rgba(255,255,255,0.9);   /* ✅ 화이트 반투명 */
  color: #111;                         /* ✅ 블랙 글씨 */
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,.10);

  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 600;                     /* 살짝 강조 */
  line-height: 1.4;
  text-align: left;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;    /* 설명은 두 줄까지만 */
  overflow: hidden;
`;





// 상단 라벨: 제목 + 숫자 같이
const TopTitle = styled.div`
  position:absolute; top:12px; left:12px; right:12px;
  display:flex; align-items:center; justify-content:space-between;
  background: rgba(255,255,255,.94);
  padding:6px 12px;
  border-radius:14px;
  box-shadow:0 1px 3px rgba(0,0,0,.08);
  z-index:2;
`;

const TitleText = styled.div`
  font-size:${() => getFontSize(14)}px;
  font-weight:700; color:#333;
  white-space:nowrap; /* 5자 보장 */
`;

const CountInline = styled.span`
  font-weight:900;
  font-size:${() => getFontSize(13)}px;
  color:${COLORS?.PRIMARY || "#3182f6"};   /* 숫자만 포인트 컬러 */
`;

// 설명은 기본 구조 유지
const Desc = styled.div`
  position: absolute; left: 0; right: 0; bottom: 5px; padding: 5px 8px 0px;
  text-align: center; color:#555; line-height:1.35;
  font-size:${() => getFontSize(12)}px !important;
  white-space: pre-line;
  display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden;
  min-height: calc(${() => getFontSize(12)}px * 1.35 * 2);
`;





// 하단: 숫자와 설명을 같은 줄에 붙여서 2줄까지
const BottomDescRow = styled.div`
  position:absolute; left:10px; right:10px; bottom:10px;
  padding:10px 12px;
  background: rgba(255,255,255,.92);
  border-radius:12px;
  box-shadow:0 4px 10px rgba(0,0,0,.06);
  display:flex; align-items:baseline; gap:8px;
`;



const DescInline = styled.span`
  flex:1 1 auto; min-width:0;
  color:#333;
  font-size:${() => getFontSize(12)}px;
  line-height:1.35;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;         /* ✅ 2줄까지 */
  overflow:hidden;
`;




/* ---- 하단 설명 박스: 숫자 + 설명 ---- */
const BottomDescBox = styled.div`
  position:absolute; left:10px; right:10px; bottom:10px;
  padding:10px 12px;
  background: rgba(255,255,255,.92);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,.06);
  display:flex; align-items:center; gap:8px;   /* 숫자와 텍스트 간격 */
`;

const CountNumber = styled.span`
  flex:0 0 auto;
  font-weight:900;
  font-size:${() => getFontSize(14)}px;
  line-height:1;
  color:${COLORS?.PRIMARY || "#3182f6"};       /* 🔹 숫자만 컬러 */
`;

const DescText = styled.div`
  flex:1 1 auto; min-width:0;
  text-align:left; color:#333; line-height:1.35;
  font-size:${() => getFontSize(12)}px !important;
  white-space: pre-line;
  display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden;
`;

/* ---------- styles (ALBA 전용, 기존 유지) ---------- */
const AlbaCard = styled.button`
  position: relative; display:block; width:100%;
  border:0; margin:0; padding:0; overflow:hidden; border-radius:22px;
  ${({ $pressed }) => $pressed && `transform: scale(.985);`}
  &:active { transform: scale(.985); box-shadow: 0 10px 22px rgba(0,0,0,.22); }
`;

const AlbaInner = styled.div`position:absolute; inset:0;`;

const AlbaSubtitle = styled.div`
  position:absolute; left:12px; right:12px; top:50px;
  display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center;
`;
const AlbaLine = styled.div`
  &&{
    display:block !important;
    font-size:${() => getFontSize(16)}px !important;
    line-height:1.26 !important;
    letter-spacing:-0.2px !important;
    color:#131313 !important; text-shadow:0 1px 1px rgba(0,0,0,.10) !important;
  }
`;
const AlbaCenterBar = styled.div`
  position:absolute; left:50%; bottom:12px; transform:translateX(-50%);
  display:inline-flex; align-items:center; justify-content:center;
  /* 🔹 더 슬림 & 가로폭 과하지 않게 */
  padding:6px 12px; gap:6px; border-radius:999px;
  width:auto; max-width:72%;
  /* 🔹 깔끔한 유리 느낌 (너무 흐리지 않게) */
  background:rgba(255,255,255,.90);
  box-shadow:0 4px 12px rgba(0,0,0,.12);
  /* 🔹 줄바꿈/깨짐 방지 */
  white-space:nowrap;

  .txt{
    font-size:${() => getFontSize(13)}px !important; line-height:1; color:#222; font-weight:700;
  }
  .sep{ opacity:.5; line-height:1; }
  .count{
    display:inline-flex; gap:2px; align-items:baseline; line-height:1;
    font-weight:800; color:#222;
    font-size:${() => getFontSize(14)}px !important; 
  }
  /* 🔹 숫자만 포인트 컬러 */
  .count-num{ color:${COLORS?.PRIMARY || "#3182f6"}; font-size:${() => getFontSize(14)}px !important; }
  .count-suf{ opacity:.9; font-size:${() => getFontSize(14)}px  !important; }

  /* 🔹 작은 화면에서 너무 길어지면 살짝 더 줄이기 */
  @media (max-width: 360px){
    padding:5px 10px; max-width:72%;
    .txt{ font-size:${() => getFontSize(15)}px !important; }
    .count-num{ font-size:${() => getFontSize(14)}px !important; }
    .count-suf{ font-size:${() => getFontSize(11)}px  !important; }
  }
`;




/* ---------- utils ---------- */
function trimTitle(item) {
  const lines = (item.title || "").split(/\n/g);
  return lines.length > 2 ? { ...item, title: `${lines[0]}\n${lines[1]}` } : item;
}
