// 홈 요약 버튼 시안 (형 리뷰 2026-08-19 → 2026-08-20 다시 잡음)
//
// 처음에는 먹색 단색(03안)으로 확정했는데, 그 위 일 종류 격자를 채도 낮춘 색으로
// 바꾸고 나니 아래 두 칸만 새까매서 따로 노는 느낌이 됐다.
// 형 지시: "이거까지 고려해서 시안 좀 해줄래? 위에는 맘에 들어"
//
// 그래서 시안마다 위에 실제 격자를 같이 그렸다. 두 칸만 떼어놓고 보면
// 위와 어울리는지 판단이 안 되기 때문이다. 폭은 모바일 실측 360px.
import React from "react";
import styled from "styled-components";
import { RiArrowRightSLine } from "react-icons/ri";
import { WorkIcon, workColor } from "../utility/workIcon";
import { WORKNAME } from "../utility/work";

const INK = "#1b1f27";

/* 위 격자에서 실제로 쓰는 색 — 고르실 때 여기서 뽑아 쓰면 화면이 한 벌로 묶인다 */
const TONE = {
  blue: "#3C6E9F",   // 청소
  clay: "#C4562F",   // 집안일
  gold: "#B8862E",   // 아이
  green: "#3E7D5A",  // 돌봄
  teal: "#3F7D85",   // 반려
};

const GRID_SAMPLE = [
  WORKNAME.HOMECLEAN, WORKNAME.BUSINESSCLEAN, WORKNAME.MOVECLEAN, WORKNAME.FOODPREPARE,
  WORKNAME.SHOPPING, WORKNAME.CARRYLOAD, WORKNAME.ERRAND, WORKNAME.BABYCARE,
];

const STATS = [
  { label: "내 주변 일감", num: 23, unit: "건", desc: "지금 동네에 올라온 일" },
  { label: "활동 중인 홍여사", num: 10, unit: "명", desc: "내 범위 안에서 일하는 중" },
];

const Page = styled.div`
  padding: 28px 24px 90px;
  background: #fff;
  color: ${INK};
  font-family: 'Pretendard Variable', Pretendard, -apple-system, 'Malgun Gothic', sans-serif;
`;
const H1 = styled.h1` margin: 0 0 6px; font-size: 23px; font-weight: 800; `;
const Lead = styled.p` margin: 0 0 28px; font-size: 15px; line-height: 1.65; color: #2b2f36; `;
const Cases = styled.div` display: flex; flex-wrap: wrap; gap: 26px; `;
const Case = styled.section` width: 360px; `;
const CaseHead = styled.div` display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; `;
const CaseNo = styled.span` font-size: 17px; font-weight: 800; `;
const CaseName = styled.span` font-size: 15px; font-weight: 700; `;
const CaseNote = styled.div`
  font-size: 13px; line-height: 1.55; color: #2b2f36;
  margin-bottom: 10px; min-height: 42px;
`;
const Stage = styled.div` border: 1px solid #e6e6e6; padding: 16px 15px; background: #fff; `;

/* 위 격자 — 어울리는지 보려고 같이 그린다 */
const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 14px;
  margin-bottom: 18px;
`;
const Cell = styled.div` display: flex; flex-direction: column; align-items: center; gap: 6px; `;
const Round = styled.div`
  width: 48px; height: 48px; border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex; align-items: center; justify-content: center;
`;
const CellLabel = styled.div` font-size: 12px; font-weight: 600; `;

const Row = styled.div` display: flex; gap: 8px; width: 100%; `;
const Btn = styled.div`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  border-radius: ${({ $r }) => $r ?? '10px'};
  padding: 13px 14px;
  background: ${({ $bg }) => $bg};
  border: ${({ $bd }) => $bd || 'none'};
  color: ${({ $fg }) => $fg};
`;
const Label = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 4px;
  font-size: 14px;
  opacity: .82;
`;
const Num = styled.div`
  margin-top: 6px;
  font-size: 22px;
  font-weight: 800;
  color: ${({ $c }) => $c || 'inherit'};
`;
const Unit = styled.span` font-size: 14px; font-weight: 700; margin-left: 2px; `;
const Desc = styled.div`
  margin-top: 6px;
  font-size: 12.5px;
  line-height: 1.45;
  opacity: .72;
`;

const Pair = ({ skin }) => (
  <Row>
    {STATS.map((s, i) => {
      const c = typeof skin === 'function' ? skin(i) : skin;
      return (
        <Btn key={s.label} {...c}>
          <Label>{s.label}<RiArrowRightSLine size={18} /></Label>
          <Num $c={c.$num}>{s.num}<Unit>{s.unit}</Unit></Num>
          <Desc>{s.desc}</Desc>
        </Btn>
      );
    })}
  </Row>
);

const CASES = [
  {
    name: '지금 (먹색)',
    note: '어제 고르신 안. 위 격자 색이 부드러워지니 이 두 칸만 새까매서 따로 논다.',
    skin: { $bg: INK, $fg: '#fff', $num: '#fff' },
  },
  {
    name: '청소 남색 단색',
    note: '위 격자 첫 줄과 같은 색. 화면이 한 벌로 묶인다. 가장 무난한 안.',
    skin: { $bg: TONE.blue, $fg: '#fff', $num: '#fff' },
  },
  {
    name: '돌봄 초록 단색',
    note: '지도 마커·클러스터도 초록이라 앱 전체가 같은 계열로 간다.',
    skin: { $bg: TONE.green, $fg: '#fff', $num: '#fff' },
  },
  {
    name: '집안일 테라코타 단색',
    note: '브랜드 주황을 낮춘 색. 주황 느낌은 남기면서 격자와 톤이 맞는다.',
    skin: { $bg: TONE.clay, $fg: '#fff', $num: '#fff' },
  },
  {
    name: '왼쪽 남색 · 오른쪽 초록',
    note: '두 칸을 다른 색으로. 위 격자가 이미 여러 색이라 그 문법을 그대로 잇는다.',
    skin: (i) => (i === 0
      ? { $bg: TONE.blue, $fg: '#fff', $num: '#fff' }
      : { $bg: TONE.green, $fg: '#fff', $num: '#fff' }),
  },
  {
    name: '옅은 면 + 검은 글씨',
    note: '채우지 않는다. 격자가 색을 다 쓰고 있으니 아래는 비켜서는 안.',
    skin: { $bg: '#EEF1F4', $fg: INK, $num: INK },
  },
  {
    name: '흰 카드 + 얇은 테두리',
    note: '가장 조용하다. 숫자만 색으로 세운다. 격자가 주인공이 된다.',
    skin: { $bg: '#fff', $fg: INK, $num: TONE.blue, $bd: '1px solid #dfe3e8' },
  },
  {
    name: '톤온톤 (옅은 남색 + 진한 남색 글씨)',
    note: '같은 색을 옅게 깔고 글씨를 진하게. 색은 쓰되 무게는 안 준다.',
    skin: { $bg: '#E7EDF4', $fg: '#2C5679', $num: '#2C5679' },
  },
  {
    name: '각진 모서리 · 남색',
    note: '02안과 같은 색인데 모서리를 각지게. 아래 일감 카드와 결이 맞는다.',
    skin: { $bg: TONE.blue, $fg: '#fff', $num: '#fff', $r: '0' },
  },
];

const StatLab = () => (
  <Page>
    <H1>홈 요약 버튼 시안 (격자와 같이 보기)</H1>
    <Lead>
      위 일 종류 격자를 채도 낮춘 색으로 바꾸고 나니, 아래 두 칸만 새까매서 따로 노는 느낌이었습니다.<br />
      그래서 시안마다 <b>위 격자를 같이 그렸습니다</b> — 두 칸만 떼어놓고는 어울리는지 판단이 안 돼서요.<br />
      설명 문구도 줄였습니다. 카드가 좁아 세 줄로 꺾이던 걸 두 줄에 맞췄습니다.
    </Lead>

    <Cases>
      {CASES.map((c, i) => (
        <Case key={c.name}>
          <CaseHead><CaseNo>{String(i + 1).padStart(2, '0')}</CaseNo><CaseName>{c.name}</CaseName></CaseHead>
          <CaseNote>{c.note}</CaseNote>
          <Stage>
            <Grid4>
              {GRID_SAMPLE.map((n) => (
                <Cell key={n}>
                  <Round $bg={workColor(n)}><WorkIcon name={n} size={23} color="#fff" /></Round>
                  <CellLabel>{n}</CellLabel>
                </Cell>
              ))}
            </Grid4>
            <Pair skin={c.skin} />
          </Stage>
        </Case>
      ))}
    </Cases>
  </Page>
);

export default StatLab;
