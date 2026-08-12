import React, { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { ReadWorkByUSERS_ID } from "../../../service/WorkService";
import { Seekimage, Seekgrayimage } from "../../../utility/imageData";
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

const Card = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border: 1px solid #E3E3E3;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  &:active { background: #FAFAFA; }
`;

const IconCircle = styled.div`
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 100px;
  background: #F9F9F9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #131313;
`;

const Status = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ done }) => (done ? '#A3A3A3' : '#FF2121')};
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #131313;
`;

const Meta = styled.div`
  font-size: 14px;
  color: #A3A3A3;
  display: flex;
  gap: 10px;
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
    if (i === -1) return '';
    const parts = String(w.WORK_INFO[i].result || '').split(' ');
    return parts.slice(1, 4).join(' ');
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
            <IconCircle>
              <img src={done ? Seekgrayimage(w.WORKTYPE) : Seekimage(w.WORKTYPE)} alt={w.WORKTYPE}
                style={{ width: 40, height: 40, objectFit: 'contain' }} />
            </IconCircle>
            <Info>
              <TitleRow>
                <Title>{w.WORKTYPE}</Title>
                <Status done={done}>{done ? '마감' : '진행중'}</Status>
              </TitleRow>
              <Price>{priceOf(w)}원</Price>
              <Meta>
                <span>{regionOf(w)}</span>
                <span><TimeAgo date={getFullTime(w.CREATEDT)} formatter={formatter} /></span>
              </Meta>
            </Info>
          </Card>
        );
      })}
    </Container>
  );
};

export default MobileMyWork;
