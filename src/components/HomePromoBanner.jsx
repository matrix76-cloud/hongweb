// 홈 상단 홍보 배너 (형 확정 2026-08-16 — /bannerlab 4안)
//
// 홍여사가 어떤 서비스인지 세 장으로 설명한다. 누를 데는 없다 — 형 지시대로
// 다른 화면으로 보내지 않고 배너 안에서 읽고 끝난다.
//
// 밀어 넘기는 건 CSS scroll-snap 에 맡겼다. 관성·되튐이 브라우저 것이라
// 라이브러리로 흉내낸 것보다 폰에서 부드럽다.
// 자동으로 4초마다 넘어가되, 손을 대면 자동은 멈춘다 (읽는 중에 넘어가면 안 된다).
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ORANGE = "#FF4E19";

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
    key: "safe",
    head: "만나기 전에 대화로 먼저 정합니다",
    body: "시간도 금액도 대화방에서 맞춘 뒤에 만납니다.\n선입금을 요구하는 사람은 신고해 주세요.",
  },
];

const Wrap = styled.div`
  width: 100%;
  background: var(--surface);
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
  padding: 20px 18px 16px;
  min-height: 132px;
`;
const No = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${ORANGE};
  margin-bottom: 8px;
`;
const Head = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  line-height: 1.3;
  letter-spacing: -.02em;
`;
const Body = styled.div`
  font-size: 15px;
  color: var(--text);
  opacity: .82;
  line-height: 1.6;
  margin-top: 9px;
  white-space: pre-line;
`;
const BarRow = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 18px 4px;
`;
const Bar = styled.div`
  flex: 1;
  height: 3px;
  background: ${({ $on }) => ($on ? "var(--text)" : "var(--border)")};
  transition: background .2s ease;
`;

const HomePromoBanner = () => {
  const ref = useRef(null);
  const touched = useRef(false);
  const [idx, setIdx] = useState(0);

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
    <Wrap>
      <Track ref={ref} onScroll={onScroll}>
        {SLIDES.map((s, i) => (
          <Slide key={s.key}>
            <No>0{i + 1}</No>
            <Head>{s.head}</Head>
            <Body>{s.body}</Body>
          </Slide>
        ))}
      </Track>
      <BarRow>
        {SLIDES.map((s, i) => <Bar key={s.key} $on={i === idx} />)}
      </BarRow>
    </Wrap>
  );
};

export default HomePromoBanner;
