import React, { useContext } from "react";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { distanceFunc, shortRegion, distanceLabel } from "../utility/region";
import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../utility/date";

const formatter = buildFormatter(koreanStrings);

/* 아이콘 없는 정보 카드 — 각진 모서리, 텍스트 위계로만 (형 확정 2026-08-15, /listlab 카드 3 그대로).
   제목|상태, 금액(+협의), 지역·거리|등록·채팅 세 줄. 아이콘 원·조회수·프로필·조건 칩은 뺐다.
   상태는 뱃지 없이 텍스트+색. 마감된 일감은 글 전체가 회색으로 가라앉는다. */

const Container = styled.div`
  box-sizing: border-box;
  width: ${({ width }) => width || '100%'};
  background: ${({ selected }) => (selected ? 'var(--bg-soft)' : 'var(--surface)')};
  border: 1px solid ${({ selected }) => (selected ? '#A3A3A3' : 'var(--border)')};
  padding: 14px 16px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const TopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ $done }) => ($done ? '#9A9A9A' : 'var(--text)')};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusText = styled.div`
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ $done }) => ($done ? '#9A9A9A' : '#E5472F')};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  width: 100%;
  white-space: nowrap;
  margin-top: 4px;
  color: ${({ $done }) => ($done ? '#9A9A9A' : 'var(--text)')};
`;

const PriceValue = styled.span`
  font-size: 18px;
  font-weight: 800;
`;

const PriceUnit = styled.span`
  font-size: 16px;
  font-weight: 400;
`;

const NegoText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #6F6F6F;
  margin-left: 4px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.3;
  color: #6F6F6F;
  white-space: nowrap;

  > :first-child {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > :last-child {
    flex: 0 0 auto;
  }
`;

const MobileWorkItem = ({ containerStyle, width, workdata, onPress, index, selected, supporters = null }) => {
  const { user } = useContext(UserContext);

  /* 채팅중인 건수 — 실제로 열린 채팅방 수 (형 리뷰 2026-08-13).
     지원자 목록을 받은 화면에서는 저장된 APPLY_COUNT 대신 실제 방 수를 쓴다. */
  const list = Array.isArray(supporters) ? supporters : null;
  const count = list ? list.length : (workdata.APPLY_COUNT ?? 0);

  const done = workdata.WORK_STATUS !== 0;

  const findResult = (type) => {
    const i = workdata.WORK_INFO.findIndex((x) => x.requesttype === type);
    return i === -1 ? null : workdata.WORK_INFO[i];
  };

  /* 거리 표기 — 1km 안쪽은 미터로 (형 리뷰 2026-08-12 "km 을 고집하지 말기").
     distanceFunc 는 km 를 준다. */
  const Distance = () => {
    const region = findResult('지역');
    if (!region) return null;
    const km = distanceFunc(user.latitude, user.longitude, region.latitude, region.longitude);
    return distanceLabel(km) || null;
  };

  // 금액 표기 정규화 — 예전 데이터는 "50000", 새 데이터는 "150,000" 처럼 섞여 있다
  const Price = () => {
    const raw = findResult('금액')?.result;
    if (raw === undefined || raw === null || raw === '') return '';
    const num = Number(String(raw).replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(num) || num === 0) return String(raw);
    return num.toLocaleString('ko-KR');
  };

  // 협의 여부 — 조건 칩을 없애면서 금액 옆 "(협의 가능)" 으로 옮겼다
  const nego = (workdata.WORK_INFO || []).some(
    (d) => d && d.result && String(d.result).includes('협의')
  );

  const distance = Distance();
  /* "경기도 남양주시 화도읍" 처럼 앞 세 마디만 (형 리뷰 2026-08-12) */
  const region = shortRegion(findResult('지역')?.result);

  return (
    <Container
      style={containerStyle}
      width={width}
      selected={selected}
      onClick={() => onPress(index)}
    >
      <TopRow>
        <Title $done={done}>{workdata.WORKTYPE}</Title>
        <StatusText $done={done}>{done ? '마감' : '진행중 거래'}</StatusText>
      </TopRow>

      <PriceRow $done={done}>
        <PriceValue>{Price()}</PriceValue>
        <PriceUnit>원</PriceUnit>
        {nego && <NegoText>(협의 가능)</NegoText>}
      </PriceRow>

      <MetaRow>
        <span>
          {[region, distance ? `거리 ${distance}` : null].filter(Boolean).join(' · ')}
        </span>
        <span>
          {workdata.CREATEDT
            ? <TimeAgo date={getFullTime(workdata.CREATEDT)} formatter={formatter} />
            : null}
          {count > 0 ? ` · 채팅 ${count}건` : ''}
        </span>
      </MetaRow>
    </Container>
  );
};

export default MobileWorkItem;
