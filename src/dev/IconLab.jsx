// 홈 카테고리 아이콘 색 조합 시안 페이지 (형이 케이스 번호로 고르는 용도 — 2026-08-15)
// 확정되면 index.css 의 --icon-bg / --icon-fg (+ 라인이면 --icon-line 추가) 로 옮기고 이 페이지는 남겨둔다.
import React from "react";
import styled from "styled-components";
import { WORKICON, WorkIcon } from "../utility/workIcon";

const NAMES = Object.keys(WORKICON);

// 각 케이스 = 원 배경 / 라인 / 아이콘 색 조합. line 이 없으면 테두리 없음.
const CASES = [
  { no: 1, title: "지금 상태 — 연주황 채움 + 진주황 아이콘",
    bg: "#FFE4D6", line: null, fg: "#C2410C" },
  { no: 2, title: "연주황 채움 + 먹색 아이콘",
    bg: "#FFE4D6", line: null, fg: "#2B2F36" },
  { no: 3, title: "흰 바탕 + 연주황 라인 + 진주황 아이콘",
    bg: "#FFFFFF", line: "#FFC9AF", fg: "#C2410C" },
  { no: 4, title: "흰 바탕 + 브랜드 주황 라인 + 주황 아이콘",
    bg: "#FFFFFF", line: "#FF4E19", fg: "#FF4E19" },
  { no: 5, title: "흰 바탕 + 회색 라인 + 먹색 아이콘",
    bg: "#FFFFFF", line: "#E3E3E3", fg: "#2B2F36" },
  { no: 6, title: "아주 연한 채움 + 연주황 라인 + 진주황 아이콘",
    bg: "#FFF1E9", line: "#FFD5BF", fg: "#C2410C" },
  { no: 7, title: "이전 상태 — 연회색 채움 + 먹색 아이콘",
    bg: "#F4F4F4", line: null, fg: "#2B2F36" },
  { no: 8, title: "원 없이 아이콘만 — 먹색",
    bg: "transparent", line: null, fg: "#2B2F36" },
  // ── 진한 채움 + 흰 아이콘 (형 요청 2026-08-15 "보라색 카드에 흰색 아이콘 처럼") ──
  { no: 9, title: "보라 채움 + 흰 아이콘",
    bg: "#7C3AED", line: null, fg: "#FFFFFF" },
  { no: 10, title: "브랜드 주황 채움 + 흰 아이콘",
    bg: "#FF4E19", line: null, fg: "#FFFFFF" },
  { no: 11, title: "파랑 채움 + 흰 아이콘",
    bg: "#2563EB", line: null, fg: "#FFFFFF" },
  { no: 12, title: "초록 채움 + 흰 아이콘",
    bg: "#16A34A", line: null, fg: "#FFFFFF" },
  { no: 13, title: "청록 채움 + 흰 아이콘",
    bg: "#0D9488", line: null, fg: "#FFFFFF" },
  { no: 14, title: "먹색 채움 + 흰 아이콘",
    bg: "#2B2F36", line: null, fg: "#FFFFFF" },
  // ── 카테고리 그룹(청소·집안일·아이·돌봄·반려)마다 다른 색 ──
  { no: 15, title: "그룹별 진한 채움 + 흰 아이콘", group: "solid" },
  { no: 16, title: "그룹별 연한 채움 + 같은 계열 진한 아이콘", group: "pastel" },
];

// 그룹별 색 — 청소 / 집안일 / 아이 / 돌봄 / 반려 순 (WorkItems 배열 순서와 동일)
const GROUPS = [
  { size: 3, solid: "#1467D8", pastelBg: "#DBEAFE", pastelFg: "#1D4ED8" }, // 청소
  { size: 4, solid: "#FF4E19", pastelBg: "#FFE4D6", pastelFg: "#C2410C" }, // 집안일
  { size: 4, solid: "#F59E0B", pastelBg: "#FEF3C7", pastelFg: "#B45309" }, // 아이
  { size: 2, solid: "#16A34A", pastelBg: "#DCFCE7", pastelFg: "#15803D" }, // 돌봄
  { size: 2, solid: "#7C3AED", pastelBg: "#EDE9FE", pastelFg: "#6D28D9" }, // 반려
];
const groupOf = (index) => {
  let acc = 0;
  for (const g of GROUPS) { acc += g.size; if (index < acc) return g; }
  return GROUPS[GROUPS.length - 1];
};

const Page = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: #ffffff;
  min-height: 100vh;
  color: #2b2f36;
`;
const CaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 18px;
`;
const CaseSection = styled.div`
  border: 1px solid #e3e3e3;
  padding: 18px 16px 22px;
  background: #ffffff;
`;
const CaseTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 16px;
  column-gap: 4px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
const Circle = styled.div`
  box-sizing: border-box;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${({ $bg }) => $bg};
  border: ${({ $line }) => ($line ? `1px solid ${$line}` : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BoxLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #2b2f36;
  line-height: 1.3;
  text-align: center;
  word-break: keep-all;
`;

export default function IconLab() {
  return (
    <Page>
      <CaseGrid>
        {CASES.map((c) => (
          <CaseSection key={c.no}>
            <CaseTitle>케이스 {c.no} — {c.title}</CaseTitle>
            <Grid>
              {NAMES.map((name, i) => {
                const g = c.group ? groupOf(i) : null;
                const bg = g ? (c.group === "solid" ? g.solid : g.pastelBg) : c.bg;
                const fg = g ? (c.group === "solid" ? "#FFFFFF" : g.pastelFg) : c.fg;
                return (
                  <Box key={name}>
                    <Circle $bg={bg} $line={c.line}>
                      <WorkIcon name={name} size={30} color={fg} />
                    </Circle>
                    <BoxLabel>{name}</BoxLabel>
                  </Box>
                );
              })}
            </Grid>
          </CaseSection>
        ))}
      </CaseGrid>
    </Page>
  );
}
