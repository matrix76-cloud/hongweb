// 일감 리스트 표현 방식 시안 페이지 (형이 카드형/테이블형을 고르는 용도 — 2026-08-15)
// 카드형 4안 + 테이블형 3안(테이블은 homePro 관리자 표 문법 참고).
// 실데이터 없이 샘플 4건을 모바일 폭(390px) 칸에 그대로 그린다. 확정되면 MobileWorkItem 에 반영.
import React from "react";
import styled from "styled-components";
import { WorkIcon, workColor, WORKDONE_BG } from "../utility/workIcon";

const ITEMS = [
  { type: "집 청소",   price: 50000, region: "남양주시 다산동", dist: "1.9km",   ago: "3일 전",    status: "진행중 거래", chats: 2, views: 0, nego: true,  done: false },
  { type: "짐 나르기", price: 6,     region: "남양주시 다산동", dist: "10m 이내", ago: "약 10시간 전", status: "진행중 거래", chats: 0, views: 4, nego: false, done: false },
  { type: "아이돌봄",  price: 30000, region: "남양주시 화도읍", dist: "4.2km",   ago: "1일 전",    status: "모집중",      chats: 1, views: 12, nego: false, done: false },
  { type: "애견산책",  price: 15000, region: "남양주시 다산동", dist: "2.4km",   ago: "5일 전",    status: "마감",        chats: 0, views: 21, nego: true,  done: true },
];

const won = (n) => n.toLocaleString() + "원";
const statusColor = (it) => (it.done ? "#9A9A9A" : it.status === "모집중" ? "#1D7A38" : "#E5472F");

/* ── 페이지 골격 — iconlab 과 같은 바둑판 ── */
const Page = styled.div`
  width: 100%; box-sizing: border-box; padding: 20px;
  background: #f3f3f3; min-height: 100vh; color: #2b2f36;
`;
const LabGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 18px;
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
const Phone = styled.div`
  width: 100%; max-width: 390px; margin: 0 auto;
`;

/* ── 공용 조각 ── */
const StatusText = styled.div`
  font-size: 13px; font-weight: 700; color: ${({ $c }) => $c};
`;
const Meta = styled.div`
  font-size: 13px; color: #6f6f6f;
`;

/* ══ 카드 1 — 지금 카드 (기준) ══ */
const C1Card = styled.div`
  border: 1px solid #ececec; border-radius: 14px; padding: 16px; margin-bottom: 12px; background: #fff;
`;
const C1Badge = styled.div`
  display: inline-block; background: #fdeeec; color: #e5472f; font-size: 13px; font-weight: 700;
  padding: 4px 10px; border-radius: 6px; margin-bottom: 10px;
`;
const Card1 = ({ it }) => (
  <C1Card>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <C1Badge>{it.status}</C1Badge>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{it.type}</div>
        <div style={{ fontSize: 19, fontWeight: 800, marginTop: 2 }}>{won(it.price)}</div>
      </div>
      <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 64, background: it.done ? WORKDONE_BG : workColor(it.type), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <WorkIcon name={it.type} size={32} color="#fff" />
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
      <Meta>{it.region} · 거리 {it.dist}</Meta><Meta>{it.ago}</Meta>
    </div>
    <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 12, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
      <Meta>조회 {it.views}</Meta>
      <Meta>채팅중인 건수 <b style={{ color: "#2b2f36" }}>{it.chats}건</b></Meta>
    </div>
    {it.nego && <div style={{ marginTop: 10, display: "inline-block", background: "#fdf6e3", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>협의</div>}
  </C1Card>
);

/* ══ 카드 2 — 컴팩트 카드: 왼쪽 아이콘, 두 줄로 압축 ══ */
const C2Card = styled.div`
  border: 1px solid #ececec; border-radius: 12px; padding: 12px 14px; margin-bottom: 10px;
  background: #fff; display: flex; align-items: center; gap: 12px;
`;
const Card2 = ({ it }) => (
  <C2Card>
    <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 48, background: it.done ? WORKDONE_BG : workColor(it.type), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <WorkIcon name={it.type} size={24} color="#fff" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{it.type}</span>
        <span style={{ fontSize: 16, fontWeight: 800 }}>{won(it.price)}{it.nego && <span style={{ fontSize: 13, fontWeight: 600, color: "#6f6f6f" }}> · 협의</span>}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <Meta>{it.region} · {it.dist} · {it.ago}</Meta>
        <StatusText $c={statusColor(it)}>{it.done ? "마감" : it.status}{!it.done && it.chats > 0 ? ` · 채팅 ${it.chats}` : ""}</StatusText>
      </div>
    </div>
  </C2Card>
);

/* ══ 카드 3 — 아이콘 없는 정보 카드: 각진 모서리, 텍스트 위계로만 ══ */
const C3Card = styled.div`
  border: 1px solid #e3e3e3; padding: 14px 16px; margin-bottom: 10px; background: #fff;
`;
const Card3 = ({ it }) => (
  <C3Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 17, fontWeight: 700, color: it.done ? "#9a9a9a" : "#2b2f36" }}>{it.type}</span>
      <StatusText $c={statusColor(it)}>{it.done ? "마감" : it.status}</StatusText>
    </div>
    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, color: it.done ? "#9a9a9a" : "#2b2f36" }}>
      {won(it.price)}{it.nego && <span style={{ fontSize: 13, fontWeight: 600, color: "#6f6f6f" }}> (협의 가능)</span>}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
      <Meta>{it.region} · 거리 {it.dist}</Meta>
      <Meta>{it.ago}{it.chats > 0 ? ` · 채팅 ${it.chats}건` : ""}</Meta>
    </div>
  </C3Card>
);

/* ══ 카드 4 — 카드 없이 행 + 구분선 (밀도 최고) ══ */
const C4Row = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 12px 4px;
  border-bottom: 1px solid #ececec; background: #fff;
`;
const Card4 = ({ it }) => (
  <C4Row>
    <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 40, background: it.done ? WORKDONE_BG : workColor(it.type), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <WorkIcon name={it.type} size={20} color="#fff" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{it.type} <span style={{ fontWeight: 800 }}>· {won(it.price)}</span></div>
      <Meta style={{ marginTop: 2 }}>{it.region} · {it.dist} · {it.ago}</Meta>
    </div>
    <StatusText $c={statusColor(it)} style={{ flexShrink: 0 }}>{it.done ? "마감" : it.chats > 0 ? `채팅 ${it.chats}` : it.status}</StatusText>
  </C4Row>
);

/* ══ 테이블 공통 (homePro 관리자 표 문법) ══ */
const Table = styled.table`width: 100%; border-collapse: collapse; background: #fff;`;
const Th = styled.th`
  text-align: left; padding: 10px 10px; font-size: 13px; font-weight: 600; color: #6f6f6f;
  background: #f7f7f7; border-bottom: 1px solid #e3e3e3; white-space: nowrap;
`;
const Td = styled.td`
  padding: 12px 10px; font-size: 14px; color: #2b2f36; border-bottom: 1px solid #ececec; white-space: nowrap;
`;

/* ══ 테이블 1 — 정통 테이블: 헤더행 + 열 ══ */
const Table1 = () => (
  <Table>
    <thead><tr><Th>종류</Th><Th>금액</Th><Th>거리</Th><Th>등록</Th><Th>상태</Th></tr></thead>
    <tbody>
      {ITEMS.map((it, i) => (
        <tr key={i}>
          <Td style={{ fontWeight: 700 }}>{it.type}</Td>
          <Td style={{ fontWeight: 700 }}>{won(it.price)}</Td>
          <Td>{it.dist}</Td>
          <Td>{it.ago}</Td>
          <Td><StatusText as="span" $c={statusColor(it)}>{it.done ? "마감" : it.status}</StatusText></Td>
        </tr>
      ))}
    </tbody>
  </Table>
);

/* ══ 테이블 2 — 아이콘 열이 있는 테이블 ══ */
const Table2 = () => (
  <Table>
    <thead><tr><Th></Th><Th>종류 / 금액</Th><Th>거리</Th><Th>상태</Th></tr></thead>
    <tbody>
      {ITEMS.map((it, i) => (
        <tr key={i}>
          <Td style={{ width: 44, paddingRight: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 34, background: it.done ? WORKDONE_BG : workColor(it.type), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <WorkIcon name={it.type} size={18} color="#fff" />
            </div>
          </Td>
          <Td><b>{it.type}</b> · <b>{won(it.price)}</b><div style={{ fontSize: 13, color: "#6f6f6f", marginTop: 2 }}>{it.region}</div></Td>
          <Td>{it.dist}</Td>
          <Td><StatusText as="span" $c={statusColor(it)}>{it.done ? "마감" : it.status}</StatusText></Td>
        </tr>
      ))}
    </tbody>
  </Table>
);

/* ══ 테이블 3 — 헤더 없는 2줄 행 (모바일형 테이블) ══ */
const Table3 = () => (
  <Table>
    <tbody>
      {ITEMS.map((it, i) => (
        <tr key={i}>
          <Td style={{ whiteSpace: "normal" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b style={{ fontSize: 15 }}>{it.type}</b>
              <b style={{ fontSize: 15 }}>{won(it.price)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Meta>{it.region} · {it.dist} · {it.ago}</Meta>
              <StatusText as="span" $c={statusColor(it)}>{it.done ? "마감" : it.status}</StatusText>
            </div>
          </Td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const VARIANTS = [
  { no: "카드 1", desc: "지금 상태 (기준) — 큰 아이콘 원, 정보 3단", body: (<Phone>{ITEMS.map((it, i) => <Card1 key={i} it={it} />)}</Phone>) },
  { no: "카드 2", desc: "컴팩트 카드 — 왼쪽 아이콘, 두 줄 압축, 높이 절반", body: (<Phone>{ITEMS.map((it, i) => <Card2 key={i} it={it} />)}</Phone>) },
  { no: "카드 3", desc: "아이콘 없는 정보 카드 — 각진 모서리, 텍스트 위계", body: (<Phone>{ITEMS.map((it, i) => <Card3 key={i} it={it} />)}</Phone>) },
  { no: "카드 4", desc: "카드 없이 행 + 구분선 — 한 화면에 제일 많이 보임", body: (<Phone>{ITEMS.map((it, i) => <Card4 key={i} it={it} />)}</Phone>) },
  { no: "테이블 1", desc: "정통 테이블 (homePro 관리자 표) — 헤더행 + 열 정렬", body: (<Phone><Table1 /></Phone>) },
  { no: "테이블 2", desc: "아이콘 열 테이블 — 표 정렬 + 그룹색 유지", body: (<Phone><Table2 /></Phone>) },
  { no: "테이블 3", desc: "헤더 없는 2줄 행 테이블 — 표의 밀도, 모바일 폭 맞춤", body: (<Phone><Table3 /></Phone>) },
];

export default function ListLab() {
  return (
    <Page>
      <LabGrid>
        {VARIANTS.map((v) => (
          <Variant key={v.no}>
            <VariantTitle>{v.no}</VariantTitle>
            <VariantDesc>{v.desc}</VariantDesc>
            {v.body}
          </Variant>
        ))}
      </LabGrid>
    </Page>
  );
}
