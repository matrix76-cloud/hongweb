// 홈 상단 홍보 배너 시안 페이지 (형 리뷰 2026-08-16 — 리뷰페이지 main 핀1)
//
// 형 지시: "홍여사에 대해 설명하고 홍보가 될 수 있는 배너 자리. 이미지는 3개 정도,
//          자연스러운 스와이프. pleasehelp.co.kr/partners 느낌으로,
//          눌러서 이동 안 해도 되게 배너에 담아서."
//
// 그래서 네 안 모두 — 누를 데가 없다. 배너 안에서 읽고 끝난다.
// 자리는 홈 헤더 바로 아래, "무슨 일을 맡기실까요?" 위. 폭은 모바일 실측 390px.
//
// 통이미지(mobilebanner1.png 처럼 글자가 그림에 박힌 것)는 쓰지 않았다.
// 글자가 흐려지고 문구를 못 고친다. 네 안 다 코드로 그렸고 캐릭터만 SVG 다.
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
/* 5~7안 재료 — 온보딩 honggroup.png 를 낱개로 잘라 각자 움직이게 했다 (2026-08-22) */
import imgBus from "../assets/banner/bus.png";
import imgDog from "../assets/banner/dog.png";
import imgDrill from "../assets/banner/drill.png";
import imgBag from "../assets/banner/bag.png";
import imgSign from "../assets/banner/sign.png";
import imgCook from "../assets/banner/cook.png";
import imgGuitar from "../assets/banner/guitar.png";
import imgDogwash from "../assets/banner/dogwash.png";
import imgHong from "../assets/banner/honglady.png";
import imgHongWalk from "../assets/banner/honglady_walking.gif";
import HongAvatar from "../components/HongAvatar";
import HomePromoBanner from "../components/HomePromoBanner";
import { WorkIcon, workColor } from "../utility/workIcon";

const ORANGE = "#FF4E19";
const INK = "#1b1f27";
const SOFT = "#FFEDE4";

/* 배너에 담는 말 — 세 장으로 홍여사가 뭔지 다 설명한다 */
const SLIDES = [
  {
    key: "what",
    head: "동네 일손, 홍여사가 갑니다",
    body: "집 청소부터 짐 나르기, 아이돌봄, 병원 동행까지\n가까이 사는 분이 직접 도와드립니다.",
    line: "무엇이든 부탁하세요",
    icons: ["집 청소", "짐 나르기", "아이돌봄"],
  },
  {
    key: "how",
    head: "올리면 근처 홍여사가 지원합니다",
    body: "필요한 일을 올리면 주변에 알림이 갑니다.\n지원한 분 중에서 마음에 드는 분을 고르세요.",
    line: "올리기 · 지원 · 연결",
    icons: ["병원가기", "장봐주기", "식사 준비"],
  },
  {
    key: "safe",
    head: "만나기 전에 대화로 먼저 정합니다",
    body: "시간도 금액도 대화방에서 맞춘 뒤에 만납니다.\n선입금을 요구하는 사람은 신고해 주세요.",
    line: "정하고 만나니 안심",
    icons: ["애견산책", "등원하원", "간병하기"],
  },
];

/* ── 공용 캐러셀 ────────────────────────────────────────────
   손으로 미는 건 CSS scroll-snap 에 맡긴다. 그게 폰에서 제일 자연스럽다
   (관성·되튐이 브라우저 것이라 라이브러리 흉내보다 부드럽다).
   자동 넘김은 4초. 형이 손을 대는 순간 멈춘다 — 읽는 중에 넘어가면 짜증난다. */
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
`;

const Carousel = ({ children, dots }) => {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const touched = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = () => { touched.current = true; };
    el.addEventListener("pointerdown", stop);
    const t = setInterval(() => {
      if (touched.current || !ref.current) return;
      const w = ref.current.clientWidth;
      const next = (Math.round(ref.current.scrollLeft / w) + 1) % SLIDES.length;
      ref.current.scrollTo({ left: next * w, behavior: "smooth" });
    }, 4000);
    return () => { clearInterval(t); el.removeEventListener("pointerdown", stop); };
  }, []);

  const onScroll = (e) => {
    const w = e.target.clientWidth;
    setIdx(Math.round(e.target.scrollLeft / w));
  };

  return (
    <div style={{ position: "relative" }}>
      <Track ref={ref} onScroll={onScroll}>
        {React.Children.map(children, (c, i) => <Slide key={i}>{c}</Slide>)}
      </Track>
      {dots(idx)}
    </div>
  );
};

/* 인디케이터 두 가지 — 점, 그리고 막대 */
const DotRow = styled.div`
  display: flex; gap: 6px; justify-content: center; padding: 10px 0 0;
`;
const Dot = styled.div`
  width: ${({ $on }) => ($on ? 18 : 6)}px; height: 6px;
  background: ${({ $on }) => ($on ? ORANGE : "#d8d8d8")};
  transition: width .2s ease;
`;
const dots = (idx) => (
  <DotRow>{SLIDES.map((s, i) => <Dot key={s.key} $on={i === idx} />)}</DotRow>
);

const Counter = styled.div`
  position: absolute; right: 12px; bottom: 12px;
  background: rgba(0,0,0,.45); color: #fff;
  font-size: 13px; font-weight: 700; padding: 3px 9px;
`;
const counter = (idx) => <Counter>{idx + 1} / {SLIDES.length}</Counter>;

const BarRow = styled.div`
  display: flex; gap: 4px; padding: 0 16px; margin-top: -3px;
`;
const Bar = styled.div`
  flex: 1; height: 3px;
  background: ${({ $on }) => ($on ? INK : "#e6e6e6")};
`;
const bars = (idx) => (
  <BarRow>{SLIDES.map((s, i) => <Bar key={s.key} $on={i === idx} />)}</BarRow>
);

/* ══ 1안 — 흰 판에 얇은 테두리. 왼쪽 글, 오른쪽 캐릭터 ══
   제일 담백하다. 홈이 이미 색 있는 아이콘 격자라 배너까지 색을 깔면 위가 시끄럽다. */
const A1 = styled.div`
  border: 1px solid #e4e4e4; background: #fff;
  padding: 18px 16px; display: flex; gap: 14px; align-items: center;
  min-height: 128px; box-sizing: border-box;
`;
const A1Line = styled.div`
  font-size: 14px; font-weight: 700; color: ${ORANGE}; margin-bottom: 6px;
`;
const A1Head = styled.div`
  font-size: 19px; font-weight: 800; color: ${INK}; line-height: 1.35; letter-spacing: -.01em;
`;
const A1Body = styled.div`
  font-size: 14px; color: #3c4149; line-height: 1.55; margin-top: 7px; white-space: pre-line;
`;
const Case1 = () => (
  <Carousel dots={dots}>
    {SLIDES.map((s) => (
      <A1 key={s.key}>
        <div style={{ flex: 1 }}>
          <A1Line>{s.line}</A1Line>
          <A1Head>{s.head}</A1Head>
          <A1Body>{s.body}</A1Body>
        </div>
        <div style={{ flexShrink: 0 }}><HongAvatar size={64} /></div>
      </A1>
    ))}
  </Carousel>
);

/* ══ 2안 — 먹색 판에 흰 글씨. 광고 자리인 게 분명하다 ══ */
const A2 = styled.div`
  background: ${INK}; padding: 20px 18px; min-height: 140px; box-sizing: border-box;
  position: relative; overflow: hidden;
`;
const A2Line = styled.div`
  font-size: 14px; font-weight: 700; color: #ffb59b; margin-bottom: 7px;
`;
const A2Head = styled.div`
  font-size: 20px; font-weight: 800; color: #fff; line-height: 1.35; letter-spacing: -.01em;
`;
const A2Body = styled.div`
  font-size: 14px; color: #d8dade; line-height: 1.55; margin-top: 8px; white-space: pre-line;
`;
const Case2 = () => (
  <Carousel dots={counter}>
    {SLIDES.map((s) => (
      <A2 key={s.key}>
        <A2Line>{s.line}</A2Line>
        <A2Head>{s.head}</A2Head>
        <A2Body>{s.body}</A2Body>
      </A2>
    ))}
  </Carousel>
);

/* ══ 3안 — 연한 주황 바탕 + 일 아이콘 세 개. 브랜드 톤이고 무슨 일을 하는지 그림으로 보인다 ══ */
const A3 = styled.div`
  background: ${SOFT}; padding: 18px 16px; min-height: 148px; box-sizing: border-box;
`;
const A3Head = styled.div`
  font-size: 19px; font-weight: 800; color: ${INK}; line-height: 1.35; letter-spacing: -.01em;
`;
const A3Body = styled.div`
  font-size: 14px; color: #3c4149; line-height: 1.55; margin-top: 7px; white-space: pre-line;
`;
const A3Icons = styled.div`
  display: flex; gap: 10px; margin-top: 14px; align-items: center;
`;
const A3Ico = styled.div`
  width: 38px; height: 38px; border-radius: 38px; background: ${({ $c }) => $c};
  display: flex; align-items: center; justify-content: center;
`;
const A3IcoLabel = styled.div`
  font-size: 13px; font-weight: 700; color: ${INK};
`;
const Case3 = () => (
  <Carousel dots={dots}>
    {SLIDES.map((s) => (
      <A3 key={s.key}>
        <A3Head>{s.head}</A3Head>
        <A3Body>{s.body}</A3Body>
        <A3Icons>
          {s.icons.map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <A3Ico $c={workColor(n)}><WorkIcon name={n} size={20} color="#fff" /></A3Ico>
              <A3IcoLabel>{n}</A3IcoLabel>
            </div>
          ))}
        </A3Icons>
      </A3>
    ))}
  </Carousel>
);

/* ══ 4안 — 배경 없이 글만. 배너처럼 안 생겨서 광고로 안 읽히고 그냥 읽힌다 ══ */
const A4 = styled.div`
  padding: 20px 18px 16px; background: #fff; min-height: 132px; box-sizing: border-box;
`;
const A4No = styled.div`
  font-size: 13px; font-weight: 800; color: ${ORANGE}; margin-bottom: 8px;
`;
const A4Head = styled.div`
  font-size: 22px; font-weight: 800; color: ${INK}; line-height: 1.3; letter-spacing: -.02em;
`;
const A4Body = styled.div`
  font-size: 15px; color: #3c4149; line-height: 1.6; margin-top: 9px; white-space: pre-line;
`;
const Case4 = () => (
  <Carousel dots={bars}>
    {SLIDES.map((s, i) => (
      <A4 key={s.key}>
        <A4No>0{i + 1}</A4No>
        <A4Head>{s.head}</A4Head>
        <A4Body>{s.body}</A4Body>
      </A4>
    ))}
  </Carousel>
);


/* ══ 5·6·7안 — 은행앱(우리WON) 홈 배너 방식 (형 지시 2026-08-22)
   "글씨는 흰 박스로 슬라이드, 그 아래는 캐릭터가 움직이는 배너 이미지"
   새 그림을 그린 게 아니라 온보딩 그림(honggroup.png)을 낱개로 잘라 CSS 로 움직인다.
   움직임은 전부 transform 만 써서 폰에서도 가볍고, 움직임 줄이기 설정이면 멈춘다. ══ */

const kFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
`;
const kFloatTilt = keyframes`
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-6px) rotate(5deg); }
`;
const kBob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;
const kSway = keyframes`
  0%, 100% { transform: rotate(-1.6deg); }
  50% { transform: rotate(1.6deg); }
`;
const kDrive = keyframes`
  0% { transform: translateX(-140px); }
  100% { transform: translateX(420px); }
`;
const kDriveBack = keyframes`
  0% { transform: translateX(420px) scaleX(-1); }
  100% { transform: translateX(-160px) scaleX(-1); }
`;
const kWalk = keyframes`
  0% { transform: translateX(-120px); }
  100% { transform: translateX(400px); }
`;
const kWobble = keyframes`
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(-2deg); }
`;

const motion = (anim, dur, delay = "0s", timing = "ease-in-out") => css`
  animation: ${anim} ${dur} ${timing} ${delay} infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

/* 움직이는 그림 한 장 — 자리(left/top/bottom)·크기·움직임을 props 로 받는다 */
const Piece = styled.img.attrs({ alt: "", draggable: false })`
  position: absolute;
  pointer-events: none;
  user-select: none;
  width: ${({ $w }) => $w}px;
  ${({ $l }) => ($l !== undefined ? `left:${$l}px;` : "")}
  ${({ $r }) => ($r !== undefined ? `right:${$r}px;` : "")}
  ${({ $t }) => ($t !== undefined ? `top:${$t}px;` : "")}
  ${({ $b }) => ($b !== undefined ? `bottom:${$b}px;` : "")}
  transform-origin: ${({ $origin }) => $origin || "center"};
  ${({ $motion }) => $motion || ""}
`;

/* 흰 박스 안 글. 은행앱처럼 박스 안에서 슬라이드되고 점은 박스 오른쪽 아래 */
const BoxSlide = styled.div`
  padding: 16px 18px 22px;
  min-height: 104px;
  box-sizing: border-box;
`;
const BoxHead = styled.div`
  font-size: 19px; font-weight: 800; color: ${INK}; line-height: 1.3; letter-spacing: -.01em;
`;
const BoxBody = styled.div`
  font-size: 15px; color: ${INK}; line-height: 1.5; margin-top: 6px; white-space: pre-line;
`;
const BoxDotRow = styled.div`
  position: absolute; right: 14px; bottom: 10px; display: flex; gap: 5px;
`;
const BoxDot = styled.div`
  width: ${({ $on }) => ($on ? 14 : 5)}px; height: 5px;
  background: ${({ $on }) => ($on ? INK : "#d8d8d8")};
  transition: width .2s ease;
`;
const boxDots = (idx) => (
  <BoxDotRow>{SLIDES.map((s, i) => <BoxDot key={s.key} $on={i === idx} />)}</BoxDotRow>
);
const TextBox = styled.div`
  position: relative;
  background: #fff;
  border: 1px solid #e8e4e0;
  border-radius: ${({ $r }) => $r || 0}px;
  box-shadow: 0 6px 18px rgba(60, 30, 10, .08);
  overflow: hidden;
`;
const BoxCarousel = ({ radius }) => (
  <TextBox $r={radius}>
    <Carousel dots={boxDots}>
      {SLIDES.map((s) => (
        <BoxSlide key={s.key}>
          <BoxHead>{s.head}</BoxHead>
          <BoxBody>{s.body}</BoxBody>
        </BoxSlide>
      ))}
    </Carousel>
  </TextBox>
);

/* ── 5안: 은행앱 그대로 — 위 흰 박스, 아래 그림 띠. 홍여사가 오른쪽에 서 있고
        버스가 바닥을 지나가고 강아지가 옆에서 깡총거린다 ── */
const S5 = styled.div`
  position: relative; overflow: hidden; height: 290px; box-sizing: border-box;
  background: linear-gradient(180deg, #FFF6F1 0%, #FFE9DD 100%);
`;
const S5Ground = styled.div`
  position: absolute; left: 0; right: 0; bottom: 0; height: 34px;
  background: #FFD9C4;
`;
const S5Box = styled.div`
  position: relative; z-index: 3; padding: 14px 14px 0;
`;
const Case5 = () => (
  <S5>
    <S5Box><BoxCarousel radius={12} /></S5Box>
    <S5Ground />
    <Piece src={imgDrill} $w={56} $l={18} $t={150} $origin="50% 80%" $motion={motion(kFloatTilt, "3.4s")} />
    <Piece src={imgBag} $w={52} $l={90} $t={176} $motion={motion(kFloat, "2.8s", ".6s")} />
    <Piece src={imgSign} $w={46} $l={168} $b={24} $origin="50% 100%" $motion={motion(kWobble, "2.6s", ".3s")} />
    <Piece src={imgDog} $w={58} $l={212} $b={22} $motion={motion(kBob, "1.5s")} />
    <Piece src={imgHong} $w={96} $r={16} $b={14} $origin="50% 100%" $motion={motion(kSway, "3.2s")} />
    <Piece src={imgBus} $w={78} $l={0} $b={2} $motion={motion(kDrive, "13s", "-5s", "linear")} />
  </S5>
);

/* ── 6안: 배너 전체가 한 장면 — 박스가 가운데 떠 있고 캐릭터들이 박스 뒤·옆을 지나간다.
        박스는 형 스타일대로 각지게. ── */
const S6 = styled.div`
  position: relative; overflow: hidden; height: 300px;
  background:
    radial-gradient(circle at 86% 18%, #FFD2BB 0, #FFD2BB 62px, transparent 63px),
    radial-gradient(circle at 10% 88%, #FFE3D4 0, #FFE3D4 90px, transparent 91px),
    linear-gradient(180deg, #FFF3EC 0%, #FFEADF 100%);
`;
const S6Box = styled.div`
  position: absolute; z-index: 3; left: 18px; right: 18px; top: 58px;
`;
const Case6 = () => (
  <S6>
    <Piece src={imgCook} $w={68} $l={16} $t={10} $motion={motion(kFloat, "3.6s")} />
    <Piece src={imgGuitar} $w={66} $r={80} $t={6} $motion={motion(kFloat, "3.1s", "1s")} />
    <Piece src={imgDogwash} $w={62} $r={10} $t={30} $motion={motion(kFloat, "4s", ".4s")} />
    <Piece src={imgBus} $w={84} $l={0} $t={118} $motion={motion(kDriveBack, "15s", "-6s", "linear")} />
    <S6Box><BoxCarousel radius={0} /></S6Box>
    <Piece src={imgDrill} $w={52} $l={18} $b={26} $origin="50% 80%" $motion={motion(kFloatTilt, "3.2s", ".2s")} />
    <Piece src={imgBag} $w={50} $l={92} $b={14} $motion={motion(kFloat, "2.7s", ".8s")} />
    <Piece src={imgDog} $w={56} $l={196} $b={12} $motion={motion(kBob, "1.5s")} />
    <Piece src={imgHong} $w={92} $r={18} $b={8} $origin="50% 100%" $motion={motion(kSway, "3.2s")} />
  </S6>
);

/* ── 7안: 걷는 홍여사 — 위 흰 박스, 아래 거리. 홍여사(gif)가 왼쪽에서 오른쪽으로 걸어가고
        강아지가 따라간다. 배경은 거의 흰색이라 홈에서 제일 조용하다 ── */
const S7 = styled.div`
  position: relative; overflow: hidden; height: 280px; background: #fff;
`;
const S7Box = styled.div`
  position: relative; z-index: 3; padding: 14px 14px 0;
`;
const S7Road = styled.div`
  position: absolute; left: 0; right: 0; bottom: 0; height: 44px; background: #F1F4F8;
  &::after {
    content: ""; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: #E2E6EC;
  }
`;
const Walker = styled.div`
  position: absolute; left: 0; bottom: 10px; display: flex; align-items: flex-end; gap: 4px;
  ${motion(kWalk, "11s", "-4s", "linear")}
`;
const Case7 = () => (
  <S7>
    <S7Box><BoxCarousel radius={8} /></S7Box>
    <S7Road />
    <Piece src={imgSign} $w={44} $r={22} $b={30} $origin="50% 100%" $motion={motion(kWobble, "2.8s")} />
    <Piece src={imgBag} $w={48} $r={80} $b={40} $motion={motion(kFloat, "2.9s", ".5s")} />
    <Piece src={imgBus} $w={66} $l={0} $b={6} $motion={motion(kDriveBack, "17s", "-6s", "linear")} />
    <Walker>
      <img src={imgHongWalk} alt="" draggable={false} style={{ width: 104, height: 104, objectFit: "contain" }} />
      <Piece src={imgDog} $w={52} $l={96} $b={0} $motion={motion(kBob, "1.1s")} style={{ position: "relative", left: -8 }} />
    </Walker>
  </S7>
);

/* ── 페이지 골격 — iconlab · listlab 과 같은 바둑판 ── */
const Page = styled.div`
  width: 100%; box-sizing: border-box; padding: 20px;
  background: #f3f3f3; min-height: 100vh; color: ${INK};
`;
const LabGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(430px, 1fr)); gap: 18px;
`;
const Variant = styled.div`
  background: #fff; border: 1px solid #e3e3e3; padding: 16px;
`;
const VariantTitle = styled.div`
  font-size: 16px; font-weight: 700; margin-bottom: 4px;
`;
const VariantDesc = styled.div`
  font-size: 13px; margin-bottom: 14px;
`;
/* 배너 위아래로 실제 홈이 어떻게 이어지는지 — 헤더 한 줄과 격자 제목을 흉내낸다 */
const Phone = styled.div`
  width: 390px; margin: 0 auto; border: 1px solid #ececec; background: #fff;
`;
const FakeHeader = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 12px 14px;
  border-bottom: 1px solid #f1f1f1; font-size: 15px; font-weight: 700; color: ${INK};
`;
const FakeLabel = styled.div`
  padding: 18px 14px 10px; font-size: 18px; font-weight: 800; color: ${INK};
`;
const FakeGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 0 14px 18px;
`;
const FakeBox = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: ${INK};
`;
const FakeIco = styled.div`
  width: 52px; height: 52px; border-radius: 52px; background: ${({ $c }) => $c};
  display: flex; align-items: center; justify-content: center;
`;

const PREVIEW_ICONS = ["집 청소", "사무실 청소", "이사 청소", "식사 준비"];

const Frame = ({ children }) => (
  <Phone>
    <FakeHeader><HongAvatar size={26} /> 남양주시 다산동</FakeHeader>
    {children}
    <FakeLabel>무슨 일을 맡기실까요?</FakeLabel>
    <FakeGrid>
      {PREVIEW_ICONS.map((n) => (
        <FakeBox key={n}>
          <FakeIco $c={workColor(n)}><WorkIcon name={n} size={26} color="#fff" /></FakeIco>
          {n}
        </FakeBox>
      ))}
    </FakeGrid>
  </Phone>
);

const VARIANTS = [
  { no: "1안", desc: "흰 판 + 얇은 테두리 — 왼쪽 글, 오른쪽 홍여사 캐릭터. 제일 담백하다", body: <Case1 /> },
  { no: "2안", desc: "먹색 판 + 흰 글씨 — 또렷하고 홍보 자리인 게 분명하다. 오른쪽 아래 장수 표시", body: <Case2 /> },
  { no: "3안", desc: "연한 주황 바탕 + 일 아이콘 세 개 — 무슨 일을 맡길 수 있는지 그림으로 보인다", body: <Case3 /> },
  { no: "4안", desc: "배경 없이 글만 + 위 막대 표시 — 광고처럼 안 생겨서 그냥 읽힌다", body: <Case4 /> },
  { no: "5안", desc: "은행앱 그대로 — 위는 흰 박스 슬라이드, 아래는 그림 띠. 홍여사·강아지·버스가 움직인다", body: <Case5 /> },
  { no: "6안", desc: "배너 전체가 장면 — 각진 박스가 가운데 떠 있고 캐릭터가 박스 뒤·옆을 지나간다", body: <Case6 /> },
  { no: "7안", desc: "걷는 홍여사 — 흰 바탕 + 거리. 홍여사가 걸어가고 강아지가 따라간다. 제일 조용하다", body: <Case7 /> },
  { no: "8안", desc: "확정(2026-08-22) — 7안 구조 + 5안 배경색. 실제 홈에 들어간 HomePromoBanner 그대로", body: <HomePromoBanner figures="img" /> },
  { no: "9안", desc: "확정(2026-08-23) — 8안에서 인물만 SVG — 할머니·청소 아줌마·아이들을 버스와 같은 평면 그림체로 직접 그림. 대걸레 쓸기, 할머니 토닥임", body: <HomePromoBanner figures="svg" /> },
];

export default function BannerLab() {
  // /bannerlab?only=5 — 그 안만 크게 본다 (형이 번호로 고른 뒤 폰에서 확인용)
  const only = new URLSearchParams(window.location.search).get("only");
  const list = only ? VARIANTS.filter((v) => v.no === `${only}안`) : VARIANTS;
  return (
    <Page>
      <LabGrid>
        {list.map((v) => (
          <Variant key={v.no}>
            <VariantTitle>{v.no}</VariantTitle>
            <VariantDesc>{v.desc}</VariantDesc>
            <Frame>{v.body}</Frame>
          </Variant>
        ))}
      </LabGrid>
    </Page>
  );
}
