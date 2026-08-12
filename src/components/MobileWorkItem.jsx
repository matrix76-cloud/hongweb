import React, { useContext } from "react";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { distanceFunc, shortRegion, distanceLabel } from "../utility/region";
import { imageDB, Seekgrayimage, Seekimage } from "../utility/imageData";
import ChatprofileImage from "./ChatprofileImage";
import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../utility/date";
import { REQUESTINFO } from "../utility/work_";

const formatter = buildFormatter(koreanStrings);

/* 피그마 node 715:22647 (block) 기준
   카드 342x262 · padding 20 · gap 12 · radius 16 · border 1px #E3E3E3 */

const Container = styled.div`
  box-sizing: border-box;
  width: ${({ width }) => width || '100%'};
  background: ${({ selected }) => (selected ? '#F9F9F9' : '#FFFFFF')};
  border: 1px solid ${({ selected }) => (selected ? '#A3A3A3' : 'var(--border)')};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const TopCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  flex: 1 0 0;
  min-width: 0;
`;

const StatusTag = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.3;
  background: ${({ $done }) => ($done ? '#F3F3F3' : '#FFF5F5')};
  color: ${({ $done }) => ($done ? '#A3A3A3' : '#FF2121')};
`;

const TitleCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  color: var(--text);
  line-height: 1.3;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
`;

const PriceValue = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const PriceUnit = styled.span`
  font-size: 16px;
  font-weight: 400;
`;

const IconCircle = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 100px;
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

/* 지역이 붙으면서 왼쪽 글이 길어져 오른쪽 등록일자와 부딪혔다 (형 리뷰 2026-08-12).
   왼쪽은 남는 만큼만 쓰고 넘치면 말줄임, 등록일자는 밀리지 않게 고정폭으로 둔다. */
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  font-size: 14px;
  line-height: 1.3;
  color: #A3A3A3;
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

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #E3E3E3;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ViewCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  line-height: 1.3;
  color: var(--text);
`;

/* 지원자 프로필을 겹쳐 보여준다 (형 리뷰 2026-08-13, doum 홈 카드 방식).
   흰 테두리를 둘러야 겹쳤을 때 서로 구분된다. */
const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  /* 조회수 아래(왼쪽)가 아니라 "채팅중인 건수" 아래(오른쪽)에 붙는다 (형 리뷰 2026-08-13) */
  justify-content: flex-end;
  width: 100%;
  margin-top: 2px;

  > * {
    margin-left: -7px;
    border: 2px solid #fff;
    border-radius: 100px;
    box-sizing: content-box;
  }
  > *:first-child { margin-left: 0; }
`;
const MoreCount = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 100px;
  background: #EFEFEF;
  color: #71717a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;

const ProgressCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.3;

  .label { color: #A3A3A3; font-weight: 400; }
  .value { color: var(--text); font-weight: 500; }
`;

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #FFF5E5;
  color: #1A1A1A;
  font-size: 13px;
  line-height: 1.3;
`;

const MobileWorkItem = ({ containerStyle, width, workdata, onPress, index, selected, supporters = null }) => {
  const { user } = useContext(UserContext);

  /* 채팅중인 건수 — 실제로 열린 채팅방 수 (형 리뷰 2026-08-13).
     숫자와 아래 프로필이 어긋나면 안 되므로, 지원자 목록을 받은 화면에서는
     저장된 APPLY_COUNT 대신 실제 방 수를 쓴다. */
  const list = Array.isArray(supporters) ? supporters : null;
  const count = list ? list.length : (workdata.APPLY_COUNT ?? 0);

  const done = workdata.WORK_STATUS !== 0;

  const findResult = (type) => {
    const i = workdata.WORK_INFO.findIndex((x) => x.requesttype === type);
    return i === -1 ? null : workdata.WORK_INFO[i];
  };

  /* 거리 표기 — 1km 안쪽은 미터로 (형 리뷰 2026-08-12 "km 을 고집하지 말기").
     distanceFunc 는 km 를 준다. 예전 코드가 이걸 또 1000 으로 나눠서
     2km 를 "0.002km" 로 찍고 있었다. 단위부터 바로잡았다. */
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

  // 조건 칩 — 자유 텍스트(요구사항·내용·요청메모)는 칩으로 쓰지 않는다.
  // 예전 데이터에 '내용' 50건, '요청메모' 6건이 있어 긴 문장이 칩에 들어가 있었다 (2026-08-12)
  const FREE_TEXT = ['지역', '금액', '요구사항', '내용', '요청메모', REQUESTINFO.COMMENT];
  const Keyword = () =>
    (workdata.WORK_INFO || [])
      .filter((d) => d && d.result && !FREE_TEXT.includes(d.requesttype))
      .filter((d) => String(d.result).length <= 14);

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
        <TopCol>
          <StatusTag $done={done}>{done ? '마감된 거래' : '진행중 거래'}</StatusTag>
          <TitleCol>
            <Title>{workdata.WORKTYPE}</Title>
            <PriceRow>
              <PriceValue>{Price()}</PriceValue>
              <PriceUnit>원</PriceUnit>
            </PriceRow>
          </TitleCol>
        </TopCol>

        <IconCircle>
          <img
            src={done ? Seekgrayimage(workdata.WORKTYPE) : Seekimage(workdata.WORKTYPE)}
            alt={workdata.WORKTYPE}
            style={{ width: 64, height: 64, objectFit: 'contain' }}
          />
        </IconCircle>
      </TopRow>

      <MetaRow>
        {/* 거리만 있으면 어디인지 감이 안 온다 — 동 이름까지만 짧게 붙인다 (형 리뷰 2026-08-12) */}
        <span>
          {[region, distance ? `거리 ${distance}` : null].filter(Boolean).join(' · ')}
        </span>
        <span>
          {workdata.CREATEDT
            ? <>등록일자 <TimeAgo date={getFullTime(workdata.CREATEDT)} formatter={formatter} /></>
            : null}
        </span>
      </MetaRow>

      <Divider />

      <Bottom>
        <BottomRow>
          <ViewCount>
            <img src={imageDB.eyesolid} alt="조회수" style={{ width: 16, height: 16, objectFit: 'contain' }} />
            <span>{workdata.VIEW_COUNT ?? 0}</span>
          </ViewCount>
          <ProgressCount>
            {/* "진행중인 건수" -> "채팅중인 건수" (형 리뷰 2026-08-13) */}
            <span className="label">채팅중인 건수</span>
            <span className="value">{count}건</span>
          </ProgressCount>
        </BottomRow>

        {list && list.length > 0 && (
          <AvatarRow>
            {list.slice(0, 5).map((u) => (
              <ChatprofileImage key={u.id} source={u.userimg} size={28} />
            ))}
            {list.length > 5 && <MoreCount>+{list.length - 5}</MoreCount>}
          </AvatarRow>
        )}

        <TagWrap>
          {Keyword().map((data, i) => (
            <Chip key={i}>
              {String(data.result).slice(0, 12)}
              {String(data.result).length > 12 ? '...' : null}
            </Chip>
          ))}
        </TagWrap>
      </Bottom>
    </Container>
  );
};

export default MobileWorkItem;
