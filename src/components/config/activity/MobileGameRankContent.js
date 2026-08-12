// 📦 MobileGameRankContent.jsx 리팩터링 버전

import React, { memo, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../../api/config";
import { FlexstartRow, Row } from "../../../common/Row";
import { imageDB } from "../../../utility/imageData";
import { getFontSize } from "../../../utility/fontsize";
import Empty from "../Empty";
import { getDateEx4, getTime } from "../../../utility/date";
import { UserContext } from "../../../context/User";
import { Column } from "../../../common/Column";
import { useSearchParams } from "react-router-dom";
const TableContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  font-size: ${getFontSize(12)}px;
  padding: 10px;
  border-bottom: 1px solid #ededed;
  background-color: ${(props) =>
    props.highlight ? '#fff7da' : props.flash ? '#d0f0c0' : '#fdfdfc'};
  border: ${(props) =>
    props.highlight ? '2px solid #FFD700' : props.flash ? '2px dashed #8bc34a' : '1px solid #ededed'};
  font-weight: ${(props) => (props.highlight || props.flash ? 'bold' : 'normal')};
  transition: all 0.3s ease;
`;

const getMedalEmoji = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2 || rank === 3) return '🥈';
  if (rank >= 4 && rank <= 10) return '🥉';
  return '';
};

const Rank = styled.span`
  font-size: ${() => `${getFontSize(13)}px`} !important;
`

const TimeValue = styled.span`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  white-space: nowrap;

`

const Address = styled.div`
  font-size: ${() => `${getFontSize(11)}px`} !important;
  color : #666;
`
const MyRank = styled.div`

  font-size: ${() => `${getFontSize(13)}px`} !important;
  background : #f0f8ff;
  margin-top: 10px;
  padding :10px;
  border-radius : 8px;
  margin-bottom :10px;

`
const DateValue = styled.div`
  font-size: ${() => `${getFontSize(12)}px`} !important;
`


const MobileGameRankContent = memo(() => {
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [flashIndexes, setFlashIndexes] = useState([]);
  const [items, setItems] = useState([]);
  const { user } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  const externalUid = searchParams.get("uid");
  const targetUid = externalUid || user?.USERS_ID;

  const myRecord = items.find(i => i.USERS_ID === targetUid);
  const myRank = myRecord ? items.findIndex(i => i.USERS_ID === targetUid) : null;
  const topRecord = items[0];
  const gap = myRecord && topRecord ? (parseFloat(myRecord.MINUTE) - parseFloat(topRecord.MINUTE)).toFixed(3) : null;

  useEffect(() => {
    const q = query(
      collection(db, "RACE"),
      orderBy("MINUTE", "asc"),
      orderBy("CREATEDT", "asc"),
      limit(100)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % items.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndexes = [];
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        randomIndexes.push(Math.floor(Math.random() * items.length));
      }
      setFlashIndexes(randomIndexes);
      setTimeout(() => setFlashIndexes([]), 3000);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);



  // useEffect(() => {
  //   const lastItem = document.getElementById("scroll-bottom-marker");
  //   if (lastItem) {
  //     lastItem.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [items]);


  useEffect(() => {
    document.body.classList.add("share-mode");
    return () => {
      document.body.classList.remove("share-mode");
    };
  }, []);

  if (!items || items.length === 0) {
    return <Empty content={"도전 알바 주간 순위가 없습니다"} fontsize={"14px"} />;
  }

  return (
    <Column style={{ flexDirection: 'column', height: '100vh', overflowY: 'auto', justifyContent: "flex-start", paddingBottom: 100 }}>

      {myRecord && (
        <MyRank>
          👤 나의 현재 순위: <strong>{myRank + 1}위</strong> | 기록: <strong>{parseFloat(myRecord.MINUTE).toFixed(3)}초</strong><br />
          {gap && gap !== "0.000" && (
            <>
              <br />
              🔥 1등과의 차이: <strong>{gap}초</strong> → 다시 도전해보세요!
            </>
          )}
        </MyRank>
      )}

      {items.map((data, index) => (
        <TableContent
          key={data.USERS_ID || data.id}
          highlight={index === highlightIndex || (myRank !== null && index === myRank)}
          flash={flashIndexes.includes(index)}
        >
          <Row style={{ alignItems: 'center', gap: 6, width: '25%' }}>
            <span style={{ fontSize: getFontSize(16) }}>{getMedalEmoji(index + 1)}</span>
            <Rank>{index + 1}위</Rank>
            <img
              src={data.PHOTO || imageDB.hongladywebtoon}
              alt="프로필"
              style={{ width: 24, height: 24, borderRadius: '50%' }}
            />
          </Row>

          <Column style={{ width: '30%' }}>
            <div>{data.NAME}</div>
            <Address>{data.LOCATION ? data.LOCATION.split(" ").slice(0, 3).join(" ") : '정보 미입력'}</Address>
          </Column>

          <Column style={{ width: '30%' }}>
            <DateValue>{getDateEx4(data.CREATEDT)}</DateValue>
            <DateValue>{getTime(data.CREATEDT)}</DateValue>
          </Column>

          <Row style={{ width: '15%', justifyContent: 'flex-end' }}>
            <TimeValue>{parseFloat(data.MINUTE).toFixed(3)}초</TimeValue>
          </Row>
        </TableContent>
      ))}

      {myRecord && (
        <MyRank>
          👤 나의 현재 순위: <strong>{myRank + 1}위</strong> | 기록: <strong>{parseFloat(myRecord.MINUTE).toFixed(3)}초</strong><br />
          {gap && gap !== "0.000" && (
            <>
              <br />
              🔥 1등과의 차이: <strong>{gap}초</strong> → 다시 도전해보세요!
            </>
          )}
        </MyRank>
      )}

      <span id="scroll-bottom-marker" />
    </Column>
  );
});

export default MobileGameRankContent;
