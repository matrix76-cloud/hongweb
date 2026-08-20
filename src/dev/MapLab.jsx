// 지도 마커 · 클러스터 · 필터 버튼 시안 (형 리뷰 2026-08-20)
//
// 형 지시: "지도에 검은색 넣은 거 다 빼. 검은색은 아닌 거 같음.
//          이 부분도 마커랑 필터 버튼 시안으로 몇 개 잡아줄래?
//          색도 여러 가지로 바꿔보고 구성도 바꿔봐도 돼"
//
// 지도 타일 위에 얹히는 것들이라 흰 종이 위에서 고르면 실제와 다르다.
// 그래서 배경에 실제 지도 타일 느낌(연회색 + 길·블록)을 깔고 그 위에 올렸다.
//
// 세 덩어리로 나눠 뒀다 — 마커 / 클러스터 / 필터 버튼.
// 덩어리마다 번호가 따로 있으니 "마커 3, 클러스터 2, 필터 5" 처럼 섞어 골라주면 된다.
import React from "react";
import styled from "styled-components";

const ORANGE = "#FF4E19";

const Page = styled.div`
  padding: 28px 24px 90px;
  background: #fff;
  color: #1b1f27;
  font-family: 'Pretendard Variable', Pretendard, -apple-system, 'Malgun Gothic', sans-serif;
`;
const H1 = styled.h1`
  margin: 0 0 6px;
  font-size: 23px;
  font-weight: 800;
`;
const Lead = styled.p`
  margin: 0 0 26px;
  font-size: 15px;
  line-height: 1.65;
  color: #2b2f36;
`;
const H2 = styled.h2`
  margin: 34px 0 4px;
  font-size: 19px;
  font-weight: 800;
`;
const H2Note = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #2b2f36;
  margin-bottom: 16px;
`;
const Cases = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
const Case = styled.section`
  width: 300px;
`;
const CaseHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 3px;
`;
const CaseNo = styled.span`
  font-size: 16px;
  font-weight: 800;
`;
const CaseName = styled.span`
  font-size: 14px;
  font-weight: 700;
`;
const CaseNote = styled.div`
  font-size: 13px;
  line-height: 1.5;
  color: #2b2f36;
  margin-bottom: 8px;
  min-height: 40px;
`;

/* 지도 타일 흉내 — 실제로 얹었을 때 얼마나 보이는지 견주려고 깐다 */
const Tile = styled.div`
  position: relative;
  height: 150px;
  border: 1px solid #e6e6e6;
  overflow: hidden;
  background:
    linear-gradient(#fff 0 0) padding-box,
    repeating-linear-gradient(90deg, #eceff2 0 58px, #f7f8fa 58px 62px),
    repeating-linear-gradient(0deg,  #eceff2 0 46px, #f7f8fa 46px 50px);
  background-blend-mode: multiply;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

/* ── 마커 ────────────────────────────────────────────────
   실제 지도 마커는 두 칸짜리 카드다 — 위에 일 종류, 아래에 금액.
   앞선 시안에서 금액만 그려놨더니 실제와 달라 판단이 안 됐다 (형 지적 2026-08-20).
   여기서는 실제대로 종류와 금액을 같이 그린다. */
const PinCard = styled.div`
  position: relative;
  border-radius: ${({ $r }) => $r || '8px'};
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
  border: ${({ $bd }) => $bd || 'none'};
  white-space: nowrap;
  text-align: center;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    margin-left: -6px;
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 7px solid ${({ $tail }) => $tail};
  }
`;
const PinType = styled.div`
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
`;
const PinPrice = styled.div`
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  font-size: ${({ $sz }) => $sz || 13}px;
  font-weight: 700;
  padding: 4px 10px;
`;
/* 한 줄로 붙인 안 */
const PinOne = styled.div`
  position: relative;
  border-radius: ${({ $r }) => $r || '8px'};
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: ${({ $bd }) => $bd || 'none'};
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
  font-size: 13px;
  font-weight: 700;
  padding: 6px 12px;
  white-space: nowrap;

  b { font-weight: 800; }
  span { opacity: .8; font-weight: 600; margin-right: 6px; }

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    margin-left: -6px;
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 7px solid ${({ $tail, $bg }) => $tail || $bg};
  }
`;

const SAMPLES = [
  { type: '집 청소', price: '5만원' },
  { type: '짐 나르기', price: '12만원' },
  { type: '아이돌봄', price: '9만원' },
];

const MARKERS = [
  {
    name: '지금 (주황 머리 + 흰 몸)',
    note: '지금 쓰는 모양. 위 칸이 주황, 아래 금액은 흰 바탕에 주황 글씨.',
    render: (s2) => (
      <PinCard $tail="#fff">
        <PinType $bg={ORANGE} $fg="#fff">{s2.type}</PinType>
        <PinPrice $bg="#fff" $fg={ORANGE}>{s2.price}</PinPrice>
      </PinCard>
    ),
  },
  {
    name: '주황 머리 + 흰 몸 · 금액 검정',
    note: '금액을 검정으로. 주황이 한 번만 나와서 여러 개 모였을 때 덜 시끄럽다.',
    render: (s2) => (
      <PinCard $tail="#fff">
        <PinType $bg={ORANGE} $fg="#fff">{s2.type}</PinType>
        <PinPrice $bg="#fff" $fg="#1b1f27">{s2.price}</PinPrice>
      </PinCard>
    ),
  },
  {
    name: '전부 주황 채움',
    note: '두 칸 다 주황. 제일 눈에 띄지만 지도가 주황으로 덮인다.',
    render: (s2) => (
      <PinCard $tail={ORANGE}>
        <PinType $bg={ORANGE} $fg="#fff">{s2.type}</PinType>
        <PinPrice $bg={ORANGE} $fg="#fff">{s2.price}</PinPrice>
      </PinCard>
    ),
  },
  {
    name: '흰 카드 + 주황 테두리',
    note: '필터 버튼과 같은 결. 바탕은 흰색, 윤곽만 주황. 화면이 통일된다.',
    render: (s2) => (
      <PinCard $tail="#fff" $bd={`1.5px solid ${ORANGE}`}>
        <PinType $bg="#fff" $fg="#71717a">{s2.type}</PinType>
        <PinPrice $bg="#fff" $fg={ORANGE}>{s2.price}</PinPrice>
      </PinCard>
    ),
  },
  {
    name: '한 줄로 합치기 · 흰 바탕',
    note: '두 칸을 한 줄로. 카드가 낮아져서 여러 개 겹쳐도 지도가 덜 가린다.',
    render: (s2) => (
      <PinOne $bg="#fff" $fg="#1b1f27" $bd="1px solid #dfe3e8">
        <span>{s2.type}</span><b style={{ color: ORANGE }}>{s2.price}</b>
      </PinOne>
    ),
  },
  {
    name: '한 줄 · 주황 채움',
    note: '한 줄인데 주황으로 채운다. 낮으면서도 확실히 보인다.',
    render: (s2) => (
      <PinOne $bg={ORANGE} $fg="#fff">
        <span>{s2.type}</span><b>{s2.price}</b>
      </PinOne>
    ),
  },
  {
    name: '금액을 크게',
    note: '종류는 작게 위에, 금액은 크게 아래. 값이 먼저 읽힌다.',
    render: (s2) => (
      <PinCard $tail="#fff" $bd="1px solid #dfe3e8">
        <PinType $bg="#f6f7f9" $fg="#71717a">{s2.type}</PinType>
        <PinPrice $bg="#fff" $fg="#1b1f27" $sz={16}>{s2.price}</PinPrice>
      </PinCard>
    ),
  },
  {
    name: '초록 머리 (클러스터와 한 세트)',
    note: '클러스터를 진초록으로 고르셨으니 마커 머리도 같은 계열로 맞춘 안.',
    render: (s2) => (
      <PinCard $tail="#fff">
        <PinType $bg="#1f7a5a" $fg="#fff">{s2.type}</PinType>
        <PinPrice $bg="#fff" $fg="#1b1f27">{s2.price}</PinPrice>
      </PinCard>
    ),
  },
];

/* ── 클러스터 ─────────────────────────────────────────── */
const Cluster = styled.div`
  width: ${({ $sz }) => $sz || 44}px;
  height: ${({ $sz }) => $sz || 44}px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: ${({ $bd }) => $bd || '2px solid #fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,.25);
`;

const CLUSTERS = [
  { name: '지금 (주황)', note: '낱개 카드도 주황이라 묶음인지 낱개인지 구분이 안 된다.',
    p: { $bg: ORANGE, $fg: '#fff' } },
  { name: '남색', note: '낱개는 주황, 묶음은 남색. 색이 갈려 한눈에 구분된다.',
    p: { $bg: '#274060', $fg: '#fff' } },
  { name: '진초록', note: '지도에 익숙한 색이라 튀지 않으면서 주황과 갈린다.',
    p: { $bg: '#1f7a5a', $fg: '#fff' } },
  { name: '흰 바탕 + 주황 테두리', note: '묶음은 오히려 조용하게. 낱개(주황 카드)가 주인공이 된다.',
    p: { $bg: '#fff', $fg: ORANGE, $bd: `2.5px solid ${ORANGE}` } },
  { name: '진한 주황', note: '같은 계열인데 한 단계 진하게. 색을 안 늘리고 구분만 준다.',
    p: { $bg: '#C43A10', $fg: '#fff' } },
  { name: '크기로 구분 (주황 · 크게)', note: '색은 그대로 두고 묶음만 크게. 색을 하나도 안 늘린다.',
    p: { $bg: ORANGE, $fg: '#fff', $sz: 56 } },
];

/* ── 필터 버튼 ────────────────────────────────────────── */
const Bar = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;
const Chip = styled.div`
  height: 38px;
  padding: 0 14px;
  border-radius: ${({ $r }) => $r || '19px'};
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: ${({ $bd }) => $bd || 'none'};
  box-shadow: ${({ $sh }) => $sh || '0 2px 8px rgba(0,0,0,.18)'};
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;
const Dot = styled.span`
  width: 14px; height: 14px; border-radius: 3px;
  border: 2px solid currentColor;
  display: inline-block;
`;

const FILTERS = [
  { name: '지금 (흰색)', note: '흰 지도 위에서 버튼이 배경에 묻힌다.',
    a: { $bg: '#fff', $fg: '#131313', $bd: '1px solid #eee', $sh: 'none' },
    b: { $bg: '#fff', $fg: '#131313', $bd: '1px solid #eee', $sh: 'none' } },
  { name: '흰색 + 또렷한 그림자', note: '색은 그대로 두고 그림자만 세운다. 가장 얌전하게 보이게 만드는 법.',
    a: { $bg: '#fff', $fg: '#131313', $sh: '0 3px 12px rgba(0,0,0,.28)' },
    b: { $bg: '#fff', $fg: '#131313', $sh: '0 3px 12px rgba(0,0,0,.28)' } },
  { name: '주황 채움 둘 다', note: '확실히 보인다. 다만 마커도 주황이면 화면이 주황 천지가 된다.',
    a: { $bg: ORANGE, $fg: '#fff' }, b: { $bg: ORANGE, $fg: '#fff' } },
  { name: '흰색 + 주황 테두리', note: '흰 바탕을 지키면서 윤곽만 세운다. 마커가 주황일 때 잘 맞는다.',
    a: { $bg: '#fff', $fg: ORANGE, $bd: `1.5px solid ${ORANGE}` },
    b: { $bg: '#fff', $fg: ORANGE, $bd: `1.5px solid ${ORANGE}` } },
  { name: '남색 채움', note: '마커를 주황으로 두고 조작 버튼만 남색. 역할이 색으로 갈린다.',
    a: { $bg: '#274060', $fg: '#fff' }, b: { $bg: '#274060', $fg: '#fff' } },
  { name: '필터만 주황 · 나머지 흰색', note: '가장 자주 누르는 것 하나만 세운다. 화면이 조용하다.',
    a: { $bg: ORANGE, $fg: '#fff' },
    b: { $bg: '#fff', $fg: '#131313', $sh: '0 3px 12px rgba(0,0,0,.22)' } },
  { name: '각진 모서리 · 흰색', note: '알약 대신 각진 모양. 지도 위 조작 도구처럼 보인다.',
    a: { $bg: '#fff', $fg: '#131313', $r: '8px', $sh: '0 3px 12px rgba(0,0,0,.24)' },
    b: { $bg: '#fff', $fg: '#131313', $r: '8px', $sh: '0 3px 12px rgba(0,0,0,.24)' } },
  { name: '한 덩어리로 묶기', note: '두 버튼을 한 판 위에 얹는다. 지도 위에 얹힌 게 하나라 덜 어수선하다.',
    joined: true },
];

const Joined = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: #fff;
  border-radius: 19px;
  padding: 4px;
  box-shadow: 0 3px 12px rgba(0,0,0,.24);
  font-size: 14px;
  font-weight: 600;
  color: #131313;
  > div { padding: 0 12px; height: 30px; display: flex; align-items: center; gap: 6px; border-radius: 15px; }
  > div.on { background: ${ORANGE}; color: #fff; }
`;

const MapLab = () => (
  <Page>
    <H1>지도 시안 — 마커 · 클러스터 · 필터 버튼</H1>
    <Lead>
      배경은 지도 타일 느낌으로 깔았습니다. 흰 종이 위에서 고르면 실제로 얹었을 때와 달라서요.<br />
      덩어리마다 번호가 따로 있으니 <b>"마커 3, 클러스터 2, 필터 5"</b> 처럼 섞어 골라주시면 됩니다.
    </Lead>

    <H2>마커 (가격 카드)</H2>
    <H2Note>지도에 제일 많이 찍히는 것입니다. 하나만 볼 때가 아니라 여러 개 모였을 때를 보고 골라주세요.</H2Note>
    <Cases>
      {MARKERS.map((m, i) => (
        <Case key={m.name}>
          <CaseHead><CaseNo>{String(i + 1).padStart(2, '0')}</CaseNo><CaseName>{m.name}</CaseName></CaseHead>
          <CaseNote>{m.note}</CaseNote>
          <Tile>
            {SAMPLES.map((sp) => (
              <React.Fragment key={sp.type}>{m.render(sp)}</React.Fragment>
            ))}
          </Tile>
        </Case>
      ))}
    </Cases>

    <H2>클러스터 (묶음)</H2>
    <H2Note>축소했을 때 여러 일감이 하나로 묶이는 동그라미입니다. 낱개 카드와 구분이 되어야 합니다.</H2Note>
    <Cases>
      {CLUSTERS.map((c, i) => (
        <Case key={c.name}>
          <CaseHead><CaseNo>{String(i + 1).padStart(2, '0')}</CaseNo><CaseName>{c.name}</CaseName></CaseHead>
          <CaseNote>{c.note}</CaseNote>
          <Tile>
            <Cluster {...c.p}>10</Cluster>
            <PinCard $tail="#fff">
              <PinType $bg={ORANGE} $fg="#fff">집 청소</PinType>
              <PinPrice $bg="#fff" $fg={ORANGE}>5만원</PinPrice>
            </PinCard>
            <Cluster {...c.p} $sz={c.p.$sz ? c.p.$sz - 8 : 36}>3</Cluster>
          </Tile>
        </Case>
      ))}
    </Cases>

    <H2>필터 버튼</H2>
    <H2Note>지도 아래에 떠 있는 조작 줄입니다. 지금은 흰색이라 지도에 묻힙니다.</H2Note>
    <Cases>
      {FILTERS.map((f, i) => (
        <Case key={f.name}>
          <CaseHead><CaseNo>{String(i + 1).padStart(2, '0')}</CaseNo><CaseName>{f.name}</CaseName></CaseHead>
          <CaseNote>{f.note}</CaseNote>
          <Tile>
            <div style={{ marginBottom: 40 }}>
              <PinCard $tail="#fff">
                <PinType $bg={ORANGE} $fg="#fff">집 청소</PinType>
                <PinPrice $bg="#fff" $fg={ORANGE}>5만원</PinPrice>
              </PinCard>
            </div>
            <Bar>
              {f.joined ? (
                <Joined>
                  <div className="on"><Dot />필터</div>
                  <div><Dot />진행중인 일감만</div>
                </Joined>
              ) : (
                <>
                  <Chip {...f.a}><Dot />필터</Chip>
                  <Chip {...f.b}><Dot />진행중인 일감만</Chip>
                </>
              )}
            </Bar>
          </Tile>
        </Case>
      ))}
    </Cases>
  </Page>
);

export default MapLab;
