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
import styled from "styled-components";
import HongAvatar from "../components/HongAvatar";
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
];

export default function BannerLab() {
  return (
    <Page>
      <LabGrid>
        {VARIANTS.map((v) => (
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
