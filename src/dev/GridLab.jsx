// 홈 "무슨 일을 맡기실까요?" 격자 시안 (형 지시 2026-08-20)
//
// 형 지시: "이 부분 시안으로 여러 가지 해볼래? 형태 구애받지 말고 색상도 마찬가지"
//
// 그래서 색만 바꾼 안, 형태를 아예 바꾼 안, 격자를 버린 안까지 섞어 뒀다.
// 폭은 모바일 실측 360px 기준. 번호로 골라주시면 그대로 홈에 넣는다.
//
// 한 가지 미리 말씀드릴 것 — 지금 쓰는 색에 보라(#7C3AED)가 들어가 있다(애견산책·애견병원).
// 형이 보라는 쓰지 말라고 하셨던 색이라, 아래 안에서는 전부 다른 색으로 바꿔뒀다.
import React from "react";
import styled from "styled-components";
import { WorkIcon } from "../utility/workIcon";
import { WORKNAME } from "../utility/work";

const ORANGE = "#FF4E19";
const INK = "#1b1f27";

const ITEMS = [
  { n: WORKNAME.HOMECLEAN,      g: 'clean' },
  { n: WORKNAME.BUSINESSCLEAN,  g: 'clean' },
  { n: WORKNAME.MOVECLEAN,      g: 'clean' },
  { n: WORKNAME.FOODPREPARE,    g: 'house' },
  { n: WORKNAME.SHOPPING,       g: 'house' },
  { n: WORKNAME.CARRYLOAD,      g: 'house' },
  { n: WORKNAME.ERRAND,         g: 'house' },
  { n: WORKNAME.BABYCARE,       g: 'kid' },
  { n: WORKNAME.GOOUTSCHOOL,    g: 'kid' },
  { n: WORKNAME.LESSON,         g: 'kid' },
  { n: WORKNAME.GOSCHOOLEVENT,  g: 'kid' },
  { n: WORKNAME.PATIENTCARE,    g: 'care' },
  { n: WORKNAME.GOHOSPITAL,     g: 'care' },
  { n: WORKNAME.GODOGWALK,      g: 'pet' },
  { n: WORKNAME.GODOGHOSPITAL,  g: 'pet' },
];

/* 그룹색 — 보라는 뺐다. 반려는 청록으로. */
const GROUP = { clean: '#1467D8', house: ORANGE, kid: '#F59E0B', care: '#16A34A', pet: '#0E9AA7' };
/* 채도를 낮춘 판 — 원색이 촌스럽다는 이야기가 나올 때를 위해 */
const GROUP_SOFT = { clean: '#3C6E9F', house: '#C4562F', kid: '#B8862E', care: '#3E7D5A', pet: '#3F7D85' };

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
const Title = styled.div` font-size: 19px; font-weight: 700; margin-bottom: 12px; `;

/* ── 격자 뼈대 ─────────────────────────────────────── */
const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 16px;
`;
const Cell = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 7px;
`;
const CellLabel = styled.div`
  font-size: 13px; font-weight: 600; color: ${INK}; text-align: center; line-height: 1.3;
`;
const Round = styled.div`
  width: 54px; height: 54px; border-radius: 50%;
  background: ${({ $bg }) => $bg};
  border: ${({ $bd }) => $bd || 'none'};
  display: flex; align-items: center; justify-content: center;
`;
const Square = styled.div`
  width: 56px; height: 56px; border-radius: ${({ $r }) => $r ?? '14px'};
  background: ${({ $bg }) => $bg};
  border: ${({ $bd }) => $bd || 'none'};
  display: flex; align-items: center; justify-content: center;
`;

/* 한 줄 목록형 */
const ListRow = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 13px 4px;
  border-bottom: 1px solid #eef0f2;
  &:last-child { border-bottom: none; }
`;
const ListName = styled.div` font-size: 16px; font-weight: 600; `;

/* 글자만 있는 칩 */
const Chip = styled.span`
  display: inline-block;
  padding: 9px 14px;
  margin: 0 6px 8px 0;
  border-radius: 8px;
  border: 1px solid ${({ $bd }) => $bd || '#dfe3e8'};
  background: ${({ $bg }) => $bg || '#fff'};
  color: ${({ $fg }) => $fg || INK};
  font-size: 15px;
  font-weight: 600;
`;

const four = (render) => (
  <Grid4>
    {ITEMS.map((it) => (
      <Cell key={it.n}>
        {render(it)}
        <CellLabel>{it.n}</CellLabel>
      </Cell>
    ))}
  </Grid4>
);

const CASES = [
  {
    name: '지금 (그룹별 원색 원)',
    note: '지금 화면. 원마다 그룹색이 들어간다. 색이 다섯 가지라 격자가 알록달록하다. (보라만 청록으로 바꿔 그렸다)',
    body: four((it) => <Round $bg={GROUP[it.g]}><WorkIcon name={it.n} size={26} color="#fff" /></Round>),
  },
  {
    name: '그룹색 채도만 낮추기',
    note: '구성은 그대로 두고 색만 한 톤 죽였다. 원색 특유의 소란스러움이 빠진다.',
    body: four((it) => <Round $bg={GROUP_SOFT[it.g]}><WorkIcon name={it.n} size={26} color="#fff" /></Round>),
  },
  {
    name: '색은 하나 — 주황 원',
    note: '그룹 구분을 색으로 하지 않는다. 브랜드색 하나로 통일하면 격자가 조용해지고 글자가 먼저 읽힌다.',
    body: four((it) => <Round $bg={ORANGE}><WorkIcon name={it.n} size={26} color="#fff" /></Round>),
  },
  {
    name: '옅은 주황 바탕 + 진한 주황 선',
    note: '면을 채우지 않고 옅게. 아이콘이 선으로 살아나 종류가 더 잘 구분된다.',
    body: four((it) => <Round $bg="#FFEDE4"><WorkIcon name={it.n} size={26} color={ORANGE} /></Round>),
  },
  {
    name: '흰 바탕 + 얇은 테두리',
    note: '배경을 아예 비운다. 아이콘과 글자만 남아 가장 담백하다. 화면 전체가 흰색이라 격자가 튀지 않는다.',
    body: four((it) => <Round $bg="#fff" $bd="1px solid #e1e5ea"><WorkIcon name={it.n} size={26} color={INK} /></Round>),
  },
  {
    name: '동그라미 없이 아이콘만',
    note: '테두리도 없앤다. 아이콘이 곧 버튼. 요즘 앱에서 가장 흔한 모양이고 제일 가볍다.',
    body: four((it) => (
      <div style={{ width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <WorkIcon name={it.n} size={30} color={INK} />
      </div>
    )),
  },
  {
    name: '각진 타일 · 옅은 면',
    note: '원 대신 각진 타일. 형이 각진 모서리를 좋아하셔서 넣었다. 눌리는 면이 넓어 보인다.',
    body: four((it) => <Square $r="0" $bg="#f1f4f8"><WorkIcon name={it.n} size={26} color={INK} /></Square>),
  },
  {
    name: '각진 타일 · 그룹색 선만',
    note: '면은 흰색으로 두고 테두리에만 그룹색. 색은 살리면서 면적을 줄여 덜 시끄럽다.',
    body: four((it) => (
      <Square $r="0" $bg="#fff" $bd={`1.5px solid ${GROUP[it.g]}`}>
        <WorkIcon name={it.n} size={26} color={GROUP[it.g]} />
      </Square>
    )),
  },
  {
    name: '먹색 원 · 하나만 주황',
    note: '전부 먹색으로 두고 가장 많이 찾는 하나(집 청소)만 주황. 어디부터 보면 되는지 알려준다.',
    body: four((it) => (
      <Round $bg={it.n === WORKNAME.HOMECLEAN ? ORANGE : INK}>
        <WorkIcon name={it.n} size={26} color="#fff" />
      </Round>
    )),
  },
  {
    name: '목록형 (격자를 버림)',
    note: '한 줄에 하나씩. 열다섯 개가 한눈에 안 들어오면 격자가 아니라 목록이 낫다. 이름이 길어도 안 잘린다.',
    body: (
      <div>
        {ITEMS.slice(0, 6).map((it) => (
          <ListRow key={it.n}>
            <Round $bg="#FFEDE4" style={{ width: 40, height: 40 }}>
              <WorkIcon name={it.n} size={20} color={ORANGE} />
            </Round>
            <ListName>{it.n}</ListName>
          </ListRow>
        ))}
        <div style={{ fontSize: 13, color: '#8a8f97', padding: '10px 4px 0' }}>… 아래로 계속 (여섯 개만 그렸습니다)</div>
      </div>
    ),
  },
  {
    name: '글자 칩만',
    note: '아이콘을 아예 뺀다. 열다섯 개 아이콘을 다 알아보긴 어렵고, 결국 글자를 읽게 된다는 판단.',
    body: (
      <div>
        {ITEMS.map((it) => <Chip key={it.n}>{it.n}</Chip>)}
      </div>
    ),
  },
  {
    name: '글자 칩 · 그룹색 선',
    note: '칩에 그룹색 테두리만. 색으로 묶이는 건 남기고 면적은 최소로.',
    body: (
      <div>
        {ITEMS.map((it) => <Chip key={it.n} $bd={GROUP[it.g]} $fg={GROUP[it.g]}>{it.n}</Chip>)}
      </div>
    ),
  },
];

const GridLab = () => (
  <Page>
    <H1>홈 일 종류 격자 시안</H1>
    <Lead>
      형태와 색을 다 열어놓고 잡았습니다 — 색만 바꾼 안, 모양을 바꾼 안, 격자를 버린 안까지 있습니다.<br />
      번호로 골라주세요. 섞으셔도 됩니다 ("7번 모양에 4번 색").<br />
      <b>지금 색에 보라(#7C3AED)가 들어가 있어서(애견산책·애견병원) 아래 안에서는 전부 청록으로 바꿔 그렸습니다.</b>
    </Lead>

    <Cases>
      {CASES.map((c, i) => (
        <Case key={c.name}>
          <CaseHead><CaseNo>{String(i + 1).padStart(2, '0')}</CaseNo><CaseName>{c.name}</CaseName></CaseHead>
          <CaseNote>{c.note}</CaseNote>
          <Stage>
            <Title>무슨 일을 맡기실까요?</Title>
            {c.body}
          </Stage>
        </Case>
      ))}
    </Cases>
  </Page>
);

export default GridLab;
