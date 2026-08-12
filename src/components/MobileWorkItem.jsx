import React, { useContext } from "react";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { distanceFunc } from "../utility/region";
import { imageDB, Seekgrayimage, Seekimage } from "../utility/imageData";
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
  border: 1px solid ${({ selected }) => (selected ? '#A3A3A3' : '#E3E3E3')};
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
  background: ${({ done }) => (done ? '#F3F3F3' : '#FFF5F5')};
  color: ${({ done }) => (done ? '#A3A3A3' : '#FF2121')};
`;

const TitleCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  color: #131313;
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
  background: #F9F9F9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  line-height: 1.3;
  color: #A3A3A3;
  white-space: nowrap;
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
  color: #131313;
`;

const ProgressCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.3;

  .label { color: #A3A3A3; font-weight: 400; }
  .value { color: #131313; font-weight: 500; }
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

const MobileWorkItem = ({ containerStyle, width, workdata, onPress, index, selected }) => {
  const { user } = useContext(UserContext);

  const done = workdata.WORK_STATUS !== 0;

  const findResult = (type) => {
    const i = workdata.WORK_INFO.findIndex((x) => x.requesttype === type);
    return i === -1 ? null : workdata.WORK_INFO[i];
  };

  const Distance = () => {
    const region = findResult('지역');
    if (!region) return null;
    const dist = distanceFunc(user.latitude, user.longitude, region.latitude, region.longitude);
    return parseFloat(Math.round((dist / 1000) * 1000) / 1000);
  };

  const Price = () => findResult('금액')?.result ?? '';

  const Keyword = () => {
    const skip = ['지역', '금액', '주기', REQUESTINFO.COMMENT];
    return workdata.WORK_INFO.filter((d) => !skip.includes(d.requesttype));
  };

  const distance = Distance();

  return (
    <Container
      style={containerStyle}
      width={width}
      selected={selected}
      onClick={() => onPress(index)}
    >
      <TopRow>
        <TopCol>
          <StatusTag done={done}>{done ? '마감된 거래' : '진행중 거래'}</StatusTag>
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
        <span>{distance != null ? `거리 ${distance}km` : ''}</span>
        <span>
          등록일자 <TimeAgo date={getFullTime(workdata.CREATEDT)} formatter={formatter} />
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
            <span className="label">진행중인 건수</span>
            <span className="value">{workdata.APPLY_COUNT ?? 0}건</span>
          </ProgressCount>
        </BottomRow>

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
