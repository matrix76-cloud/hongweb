// 홈 상단 홍보 배너 (형 확정 2026-08-22 — /bannerlab 7안 구조 + 5안 배경색)
//
// 은행앱(우리WON) 홈 배너 방식: 위에는 흰 박스 안에서 글이 슬라이드되고,
// 아래에는 홍여사가 강아지를 데리고 거리를 걸어간다. 글씨만 있던 예전 배너(4안)를 대체.
//
// 그림은 새로 그린 게 아니라 온보딩 honggroup.png 를 낱개로 잘라 CSS 로 움직인 것(src/assets/banner).
// 걷는 홍여사는 honglady_walking.gif. 움직임은 전부 transform 이라 폰에서 가볍고,
// OS "움직임 줄이기"가 켜져 있으면 멈춘다.
//
// 누를 데는 없다 — 형 지시대로 다른 화면으로 보내지 않고 배너 안에서 읽고 끝난다.
// 밀어 넘기는 건 CSS scroll-snap. 자동으로 4초마다 넘어가되, 손을 대면 자동은 멈춘다.
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import imgDog from "../assets/banner/dog.png";
import imgKid from "../assets/banner/kid.png";
import imgSign from "../assets/banner/sign.png";
import imgHongStand from "../assets/banner/honglady_stand.png";
import imgHongClean from "../assets/banner/honglady.png";
import imgHospital from "../assets/banner/hospital.png";
import { CleanerSvg, GrandmaSvg, KidSvg, PuppySvg, HospitalSvg } from "./BannerFigures";

const INK = "#1b1f27";
const BLUE_SHIRT = "#2E4FA8";

/* 네 장 모두 누르면 홍여사 알아보기(설명 페이지)로 간다 — "자세히 보기 하나로 통일" (형 지시 2026-08-23).
   장마다 다른 곳으로 보내는 안도 해봤는데 헷갈려서 하나로 합쳤다. */
const SLIDES = [
  {
    key: "what",
    head: "동네 일손, 홍여사가 갑니다",
    body: "집 청소부터 짐 나르기, 아이돌봄, 병원 동행까지\n가까이 사는 분이 직접 도와드립니다.",
  },
  {
    key: "how",
    head: "올리면 근처 홍여사가 지원합니다",
    body: "필요한 일을 올리면 주변에 알림이 갑니다.\n지원한 분 중에서 마음에 드는 분을 고르세요.",
  },
  {
    key: "pick",
    head: "마음에 드는 홍여사에게 직접 맡기세요",
    body: "지금 활동 중인 홍여사를 보고 먼저 연락할 수 있습니다.\n지원을 기다리지 않아도 됩니다.",
  },
  {
    key: "safe",
    head: "만나기 전에 대화로 먼저 정합니다",
    body: "시간도 금액도 대화방에서 맞춘 뒤에 만납니다.\n선입금을 요구하는 사람은 신고해 주세요.",
  },
];

/* ── 움직임 ── */
const kBob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;
const kSway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;
const kWobble = keyframes`
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(-2deg); }
`;
/* 한 장면(14초 루프): 정류장에서 할머니(홍여사)가 아이들을 돌보며 차를 기다린다.
   버스가 오른쪽에서 와서 할머니 앞에 섰다가 왼쪽으로 출발한다 (형 지시 2026-08-22) */
const kBusStop = keyframes`
  0%   { transform: translateX(440px); animation-timing-function: ease-out; }
  16%  { transform: translateX(160px); }
  34%  { transform: translateX(160px); animation-timing-function: ease-in; }
  52%  { transform: translateX(-220px); }
  100% { transform: translateX(-220px); }
`;
const kWheel = keyframes`
  0%   { transform: rotate(0deg); animation-timing-function: ease-out; }
  16%  { transform: rotate(-900deg); }
  34%  { transform: rotate(-900deg); animation-timing-function: ease-in; }
  52%  { transform: rotate(-1800deg); }
  100% { transform: rotate(-1800deg); }
`;
const motion = (anim, dur, delay = "0s", timing = "ease-in-out") => css`
  animation: ${anim} ${dur} ${timing} ${delay} infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

/* ── 장면 ── */
const Wrap = styled.div`
  position: relative;
  background: #fff;
  padding-bottom: 12px;
`;
const Scene = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
  background: linear-gradient(180deg, #FFF6F1 0%, #FFE9DD 100%);
`;
const Road = styled.div`
  position: absolute; left: 0; right: 0; bottom: 0; height: 70px;
  background: #FFD9C4;
`;
const Piece = styled.img.attrs({ alt: "", draggable: false })`
  position: absolute;
  pointer-events: none;
  user-select: none;
  width: ${({ $w }) => $w}px;
  ${({ $l }) => ($l !== undefined ? `left:${$l}px;` : "")}
  ${({ $r }) => ($r !== undefined ? `right:${$r}px;` : "")}
  ${({ $b }) => ($b !== undefined ? `bottom:${$b}px;` : "")}
  transform-origin: ${({ $origin }) => $origin || "center"};
  ${({ $motion }) => $motion || ""}
`;

const KidSpot = styled.div`
  position: absolute; bottom: 70px; right: ${({ $r }) => $r}px;
`;
const KidImg = styled.img.attrs({ alt: "", draggable: false })`
  display: block; width: ${({ $w }) => $w}px; pointer-events: none;
  ${({ $flip }) => ($flip ? "transform: scaleX(-1);" : "")}
  ${({ $motion }) => $motion || ""}
`;

/* 옆에서 본 평면 버스 — 원본 그림(bus.png)은 비스듬한 시점이라 기울어 달리는 것처럼 보여
   SVG 로 다시 그렸다(형 지시 2026-08-22 "평평하게"). 앞(운전석)이 왼쪽, 왼쪽으로 달린다. */
const BusWrap = styled.div`
  position: absolute; left: 0; bottom: 50px; width: 134px; height: 62px;
  pointer-events: none;
  ${motion(kBusStop, "14s", "0s", "linear")}
`;
const Wheel = styled.g`
  transform-box: fill-box; transform-origin: center;
  ${motion(kWheel, "14s", "0s", "linear")}
`;
const FlatBus = () => (
  <BusWrap>
    <svg width="134" height="62" viewBox="0 0 134 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 차체 */}
      <path d="M10 8 Q10 3 16 3 H126 Q131 3 131 8 V44 Q131 49 126 49 H10 Q4 49 4 44 V22 Q4 14 10 8 Z" fill="#F7C32E" />
      {/* 주황 띠 */}
      <rect x="4" y="34" width="127" height="7" fill="#F0752B" />
      {/* 앞 유리 + 창문 */}
      <path d="M8 12 Q9 8 14 8 H26 V30 H8 Z" fill="#2E4FA8" />
      <rect x="32" y="8" width="20" height="20" rx="2" fill="#2E4FA8" />
      <rect x="57" y="8" width="20" height="20" rx="2" fill="#2E4FA8" />
      <rect x="82" y="8" width="20" height="20" rx="2" fill="#2E4FA8" />
      <rect x="107" y="8" width="18" height="20" rx="2" fill="#2E4FA8" />
      {/* 창문 반사 */}
      <rect x="35" y="10" width="4" height="16" fill="#6E8BD8" opacity=".7" />
      <rect x="60" y="10" width="4" height="16" fill="#6E8BD8" opacity=".7" />
      <rect x="85" y="10" width="4" height="16" fill="#6E8BD8" opacity=".7" />
      <rect x="110" y="10" width="4" height="16" fill="#6E8BD8" opacity=".7" />
      {/* 헤드라이트 · 후미등 */}
      <rect x="4" y="26" width="6" height="5" rx="1.5" fill="#FFF3B0" />
      <rect x="126" y="26" width="5" height="5" rx="1.5" fill="#E5392B" />
      {/* 범퍼 */}
      <rect x="2" y="44" width="130" height="5" rx="2" fill="#1F2A44" />
      {/* 바퀴 */}
      <Wheel>
        <circle cx="30" cy="50" r="9" fill="#1F2A44" />
        <circle cx="30" cy="50" r="4" fill="#D9DEE8" />
        <rect x="29" y="42" width="2" height="16" fill="#1F2A44" />
        <rect x="22" y="49" width="16" height="2" fill="#1F2A44" />
      </Wheel>
      <Wheel>
        <circle cx="104" cy="50" r="9" fill="#1F2A44" />
        <circle cx="104" cy="50" r="4" fill="#D9DEE8" />
        <rect x="103" y="42" width="2" height="16" fill="#1F2A44" />
        <rect x="96" y="49" width="16" height="2" fill="#1F2A44" />
      </Wheel>
    </svg>
  </BusWrap>
);

/* SVG 인물 자리 — figures="svg" 일 때 (랩 9안). 그림은 BannerFigures.jsx */
const Figure = styled.div`
  position: absolute; pointer-events: none; line-height: 0;
  ${({ $l }) => ($l !== undefined ? `left:${$l}px;` : "")}
  ${({ $r }) => ($r !== undefined ? `right:${$r}px;` : "")}
  bottom: ${({ $b }) => $b}px;
  transform-origin: 50% 100%;
  ${({ $motion }) => $motion || ""}
`;

/* ── 흰 박스 + 슬라이드 ── */
/* 글 박스 — 그림 띠 밑단에 걸친다: 절반은 그림 위, 절반은 아래 흰 바탕 (형 지시 2026-08-22) */
const BoxWrap = styled.div`
  position: relative; z-index: 3; margin: -48px 14px 0;
`;
const Box = styled.div`
  position: relative;
  background: #fff;
  border: 1px solid #e8e4e0;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(60, 30, 10, .08);
  overflow: hidden;
`;
const Track = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; }
`;
const Slide = styled.div`
  flex: 0 0 100%;
  scroll-snap-align: start;
  box-sizing: border-box;
  padding: 13px 16px 34px;
  min-height: 88px;
`;
const Head = styled.div`
  font-size: 17px; font-weight: 800; color: ${INK}; line-height: 1.3; letter-spacing: -.01em;
`;
const Body = styled.div`
  font-size: 14px; color: ${INK}; line-height: 1.45; margin-top: 5px; white-space: pre-line;
`;
/* 배너를 누르면 소개로 간다는 표시 — 점 표시 반대편 (형 지시 2026-08-23) */
const More = styled.div`
  position: absolute; left: 16px; bottom: 9px;
  font-size: 13px; font-weight: 700; color: ${INK};
`;

const DotRow = styled.div`
  position: absolute; right: 12px; bottom: 9px; display: flex; gap: 5px;
`;
const Dot = styled.div`
  width: ${({ $on }) => ($on ? 14 : 5)}px; height: 5px;
  background: ${({ $on }) => ($on ? INK : "#d8d8d8")};
  transition: width .2s ease;
`;

/* 배너를 누르면 홍여사 알아보기로 간다 — onNavigate 를 홈이 받아 옮긴다 (형 지시 2026-08-23).
   예전엔 "누를 데는 없다" 였는데, 소개 진입점이 따로 없어져서 이 배너가 그 자리를 맡는다. */
const HomePromoBanner = ({ figures = "svg", onNavigate }) => {   // 형 확정 2026-08-23: SVG 인물(랩 9안)이 기본
  const svg = figures === "svg";
  const ref = useRef(null);
  const touched = useRef(false);
  const [idx, setIdx] = useState(0);
  const _go = () => { onNavigate && onNavigate(); };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = () => { touched.current = true; };
    el.addEventListener("pointerdown", stop);

    const timer = setInterval(() => {
      const box = ref.current;
      if (touched.current || !box) return;
      const w = box.clientWidth;
      if (!w) return;
      const next = (Math.round(box.scrollLeft / w) + 1) % SLIDES.length;
      box.scrollTo({ left: next * w, behavior: "smooth" });
    }, 4000);

    return () => {
      clearInterval(timer);
      el.removeEventListener("pointerdown", stop);
    };
  }, []);

  const onScroll = (e) => {
    const w = e.target.clientWidth;
    if (w) setIdx(Math.round(e.target.scrollLeft / w));
  };

  return (
    <Wrap onClick={_go} style={{ cursor: "pointer" }}>
    <Scene>

      <Road />
      {/* 왼쪽 — 병원 건물 앞에서 청소하는 홍여사 (온보딩 그림, 대걸레·양동이) */}
      {svg
        ? <Figure $l={4} $b={66}><HospitalSvg width={82} /></Figure>
        : <Piece src={imgHospital} $w={100} $l={4} $b={68} style={{ height: 138 }} />}
      {svg
        ? (
          <>
            <Figure $l={96} $b={66} $motion={motion(kSway, "3.8s", ".9s")}><CleanerSvg width={58} /></Figure>
            {/* 아줌마 옆에 앉아 꼬리 흔드는 강아지 */}
            <Figure $l={156} $b={68} $motion={motion(kBob, "2.1s", ".3s")}><PuppySvg width={38} /></Figure>
          </>
        )
        : <Piece src={imgHongClean} $w={64} $l={86} $b={68} $origin="50% 100%" $motion={motion(kSway, "3.8s", ".9s")} />}
      {/* 정류장 — 안내판 옆에 아이 둘(childcare.png 에서 잘라냄, 하나는 좌우 반전)과
          할머니(홍여사, 걷기 gif 4번 프레임 정지컷)가 서서 차를 기다린다. 할머니는 아이들 쪽으로
          몸을 살짝살짝 기울인다 — 돌보는 느낌. 강아지는 옆에서 깡총. */}
      <Piece src={imgSign} $w={38} $r={16} $b={76} $origin="50% 100%" $motion={motion(kWobble, "2.8s")} />
      {svg ? (
        <>
          <Figure $r={56} $b={70} $motion={motion(kBob, "1.9s")}><KidSvg width={28} /></Figure>
          <Figure $r={84} $b={70} $motion={motion(kBob, "2.3s", ".7s")}><KidSvg width={25} shirt={BLUE_SHIRT} hair="#6B3A1A" flip /></Figure>
          <Figure $r={112} $b={68} $motion={motion(kSway, "3.4s")}><GrandmaSvg width={62} /></Figure>
        </>
      ) : (
        <>
          <KidSpot $r={54}><KidImg src={imgKid} $w={27} $motion={motion(kBob, "1.9s")} /></KidSpot>
          <KidSpot $r={80}><KidImg src={imgKid} $w={24} $flip $motion={motion(kBob, "2.3s", ".7s")} /></KidSpot>
          <Piece src={imgHongStand} $w={58} $r={108} $b={68} $origin="50% 100%" $motion={motion(kSway, "3.4s")} />
        </>
      )}
      <Piece src={imgDog} $w={44} $r={170} $b={68} $motion={motion(kBob, "1.3s", ".4s")} />
      {/* 버스는 맨 앞 — 인도 뒤의 사람들 앞, 길 위를 지나간다 */}
      <FlatBus />
    </Scene>
      <BoxWrap>
        <Box>
          <Track ref={ref} onScroll={onScroll}>
            {SLIDES.map((s) => (
              <Slide key={s.key}>
                <Head>{s.head}</Head>
                <Body>{s.body}</Body>
              </Slide>
            ))}
          </Track>
          <More>자세히 보기 &gt;</More>
          <DotRow>
            {SLIDES.map((s, i) => <Dot key={s.key} $on={i === idx} />)}
          </DotRow>
        </Box>
      </BoxWrap>

    </Wrap>
  );
};

export default HomePromoBanner;
