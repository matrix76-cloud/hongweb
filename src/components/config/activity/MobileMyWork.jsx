import React, { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { ReadWorkByUSERS_ID } from "../../../service/WorkService";
import { shortRegion } from "../../../utility/region";
import { WORKSTATUS } from "../../../utility/status";
import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../../utility/date";

const formatter = buildFormatter(koreanStrings);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 20px 40px;
  min-height: 420px;
`;

const Summary = styled.div`
  font-size: 15px;
  color: #71717a;
  padding: 4px 2px 14px;
  b { color: #FF4E19; font-weight: 700; font-size: 17px; }
`;

/* 아이콘 없는 정보 카드 — 각진 모서리, 텍스트 위계로만 (형 확정 2026-08-15, /listlab 카드 3) */
const Card = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 14px 16px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: ${({ $done }) => ($done ? '#9A9A9A' : 'var(--text)')};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Status = styled.span`
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ done }) => (done ? '#9A9A9A' : '#E5472F')};
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 800;
  margin-top: 4px;
  color: ${({ $done }) => ($done ? '#9A9A9A' : 'var(--text)')};
`;

const Meta = styled.div`
  font-size: 13px;
  color: #6F6F6F;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 70px 20px;
  color: #A3A3A3;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
`;

/**
 * 내 정보 > 등록한 일감 / 마감한 일감
 * status: WORKSTATUS.OPEN(0) 진행중 · WORKSTATUS.CLOSE(1) 마감 · undefined 전체
 */
const MobileMyWork = ({ status }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const USERS_ID = user?.users_id;
      if (!USERS_ID) { setItems([]); return; }
      const list = await ReadWorkByUSERS_ID({ USERS_ID, status });
      if (alive) setItems(list);
    })();
    return () => { alive = false; };
  }, [user?.users_id, status]);

  const priceOf = (w) => {
    const i = (w.WORK_INFO || []).findIndex((x) => x.requesttype === '금액');
    return i === -1 ? '' : w.WORK_INFO[i].result;
  };

  const regionOf = (w) => {
    const i = (w.WORK_INFO || []).findIndex((x) => x.requesttype === '지역');
    return i === -1 ? '' : shortRegion(w.WORK_INFO[i].result);
  };

  if (items === null) {
    return <Container><Summary>불러오는 중...</Summary></Container>;
  }

  if (items.length === 0) {
    return (
      <Container>
        <Empty>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#71717a' }}>
            {status === WORKSTATUS.CLOSE ? '마감한 일감이 없습니다' : '등록한 일감이 없습니다'}
          </div>
          <div>홈에서 필요한 서비스를 눌러<br />일감을 올려보세요</div>
        </Empty>
      </Container>
    );
  }

  return (
    <Container>
      <Summary>총 <b>{items.length}</b>건</Summary>
      {items.map((w) => {
        const done = w.WORK_STATUS !== WORKSTATUS.OPEN;
        return (
          <Card key={w.WORK_ID}
            onClick={() => navigate("/Mobilecontent", { state: { WORK_ID: w.WORK_ID, TYPE: w.WORKTYPE } })}>
            <TitleRow>
              <Title $done={done}>{w.WORKTYPE}</Title>
              <Status done={done}>{done ? '마감' : '진행중'}</Status>
            </TitleRow>
            <Price $done={done}>{priceOf(w)}원</Price>
            <Meta>
              <span>{regionOf(w)}</span>
              <span><TimeAgo date={getFullTime(w.CREATEDT)} formatter={formatter} /></span>
            </Meta>
          </Card>
        );
      })}
    </Container>
  );
};

export default MobileMyWork;
