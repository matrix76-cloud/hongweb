import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { PiMapPinBold, PiCheckBold } from "react-icons/pi";
import { UserContext } from "../../../context/User";
import { ReadWork } from "../../../service/WorkService";
import { RANGE_OPTIONS, getSearchRange, setSearchRange } from "../../../utility/searchRange";

/**
 * 내 정보 > 나의 범위설정
 * 일감 목록이 5km 로 고정돼 있어 동네에 일감이 적으면 아무것도 안 보였다. (형 지시 2026-08-12)
 * 범위를 고르면 그 자리에서 몇 건이 잡히는지 보여준다.
 */

const Container = styled.div`
  padding: 20px;
  min-height: 420px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
`;

const Desc = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #71717a;
  margin-bottom: 20px;
`;

const Option = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding: 0 18px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1.5px solid ${({ $on }) => ($on ? '#FF4E19' : 'var(--border)')};
  background: ${({ $on }) => ($on ? '#FFF5F0' : 'var(--surface)')};
  color: ${({ $on }) => ($on ? '#FF4E19' : 'var(--text)')};
  font-size: 16px;
  font-weight: ${({ $on }) => ($on ? 700 : 500)};
  cursor: pointer;
  &:active { transform: scale(0.99); }
  transition: all .12s ease;
`;

const Result = styled.div`
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--bg-soft);
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  b { color: #FF4E19; font-weight: 700; font-size: 17px; }
`;

const MobileSearchRange = () => {
  const { user } = useContext(UserContext);
  const [range, setRange] = useState(getSearchRange());
  const [count, setCount] = useState(null);

  const countInRange = async (km) => {
    setCount(null);
    if (!user?.latitude) return;
    const items = await ReadWork({
      latitude: user.latitude,
      longitude: user.longitude,
      checkdistance: km,
    });
    setCount(Array.isArray(items) ? items.length : 0);
  };

  useEffect(() => { countInRange(range); }, [range, user?.latitude]);

  const pick = (km) => {
    setRange(km);
    setSearchRange(km);
  };

  return (
    <Container>
      <Head><PiMapPinBold size={20} color="#FF4E19" /> 일감을 찾을 범위</Head>
      <Desc>
        {user?.address_name || '내 위치'} 기준으로<br />
        이 거리 안의 일감만 홈과 지도에 보여드려요.
      </Desc>

      {RANGE_OPTIONS.map((km) => (
        <Option key={km} $on={km === range} onClick={() => pick(km)}>
          <span>{km}km 이내</span>
          {km === range && <PiCheckBold size={20} />}
        </Option>
      ))}

      <Result>
        {count === null
          ? '일감 수를 세는 중...'
          : <>지금 이 범위 안에 일감 <b>{count}</b>건이 있어요</>}
      </Result>
    </Container>
  );
};

export default MobileSearchRange;
