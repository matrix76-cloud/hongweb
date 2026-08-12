import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { ReadChat } from "../../../service/ChatService";
import { ReadWorkByIndividually } from "../../../service/WorkService";
import { workOf } from "../../../utility/chat";
import { WORKSTATUS } from "../../../utility/status";
import { shortRegion } from "../../../utility/region";
import { Seekimage, Seekgrayimage } from "../../../utility/imageData";
import Empty from "../../Empty";
import LottieAnimation from "../../../common/LottieAnimation";
import { imageDB } from "../../../utility/imageData";

/**
 * 내 정보 > 체결중인 거래 / 체결완료된 거래 (형 리뷰 2026-08-13 "모두 처리 해줘").
 *
 * 거래는 채팅방이 열리는 순간 시작된다(지원하기 -> 채팅 생성). 그래서 내 채팅방을 훑어
 * 그 방이 물고 있는 일감이 아직 진행중이면 "체결중", 마감됐으면 "체결완료"로 본다.
 * 별도의 거래 상태값이 아직 없어서 일감 상태를 기준으로 삼았다.
 */

const Container = styled.div`
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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`;
const Icon = styled.div`
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 100px;
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
const Body = styled.div`
  min-width: 0;
  flex: 1;
`;
const Title = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Sub = styled.div`
  font-size: 14px;
  color: #8A8A8A;
  margin-top: 5px;
`;
const Role = styled.div`
  font-size: 14px;
  color: var(--text);
  font-weight: 600;
  margin-top: 6px;
`;
const LoadingAnimationStyle = { zIndex: 11, position: "absolute", top: "40%", left: "40%" };

const priceOf = (work) => {
  const list = work?.WORK_INFO || [];
  const i = list.findIndex((x) => x && x.requesttype === "금액");
  if (i === -1) return "";
  const n = Number(String(list[i].result ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) && n > 0 ? `${n.toLocaleString("ko-KR")}원` : String(list[i].result ?? "");
};
const regionOf = (work) => {
  const list = work?.WORK_INFO || [];
  const i = list.findIndex((x) => x && x.requesttype === "지역");
  return i === -1 ? "" : shortRegion(list[i].result);
};

/** done=false 체결중 / done=true 체결완료 */
const MobileDealList = ({ done = false }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const USERS_ID = user?.users_id;
      const rooms = await ReadChat({ USERS_ID }).catch(() => -1);
      if (rooms === -1 || !Array.isArray(rooms)) { if (alive) { setItems([]); setLoading(false); } return; }

      const rows = await Promise.all(rooms.map(async (room) => {
        const WORK_ID = workOf(room).WORK_ID;
        if (!WORK_ID) return null;
        const work = await ReadWorkByIndividually({ WORK_ID }).catch(() => null);
        if (!work || !work.WORK_ID) return null;
        return { room, work, mine: room.OWNER_ID === USERS_ID };
      }));

      if (!alive) return;
      const list = rows.filter(Boolean).filter(({ work }) =>
        done ? work.WORK_STATUS !== WORKSTATUS.OPEN : work.WORK_STATUS === WORKSTATUS.OPEN
      );
      // 같은 일감으로 방이 여러 개 열렸을 수 있어 일감 기준으로 한 번만 보여준다
      const seen = new Set();
      setItems(list.filter(({ work }) => (seen.has(work.WORK_ID) ? false : seen.add(work.WORK_ID))));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user?.users_id, done]);

  if (loading) {
    return (
      <Container>
        <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge} width={"100px"} height={"100px"} />
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container>
        <Empty content={done ? "체결완료된 거래가 없습니다" : "체결중인 거래가 없습니다"} height={180} />
        <Summary style={{ textAlign: "center" }}>
          {done ? "거래가 끝나면 여기에 남습니다" : "일감에 지원하거나 지원을 받으면 여기에 나옵니다"}
        </Summary>
      </Container>
    );
  }

  return (
    <Container>
      <Summary>{done ? "체결완료된 거래" : "체결중인 거래"} <b>{items.length}</b>건</Summary>
      {items.map(({ room, work, mine }) => (
        <Card key={room.CHAT_ID} onClick={() => navigate("/Mobilecontent", { state: { CHAT_ID: room.CHAT_ID } })}>
          <Icon>
            <img
              src={done ? Seekgrayimage(work.WORKTYPE) : Seekimage(work.WORKTYPE)}
              alt={work.WORKTYPE}
              style={{ width: 44, height: 44, objectFit: "contain" }}
            />
          </Icon>
          <Body>
            <Title>{work.WORKTYPE}</Title>
            <Sub>{[regionOf(work), priceOf(work)].filter(Boolean).join(" · ")}</Sub>
            <Role>{mine ? "내가 올린 일감" : "내가 지원한 일감"}</Role>
          </Body>
        </Card>
      ))}
    </Container>
  );
};

export default MobileDealList;
