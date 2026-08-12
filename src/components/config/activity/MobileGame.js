// ✅ MobileGame.jsx - 유기적으로 연결된 완성 세트 구조

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { UserContext } from '../../../context/User';
import { DataContext } from '../../../context/Data';
import { toast, Toaster } from 'sonner';
import { shuffleArray, sleep } from '../../../utility/common';
import { imageDB } from '../../../utility/imageData';
import RotateCard from '../../../common/RotateCard';
import RotateCardBasic from '../../../common/RotateCardBasic';
import MobileGameResult from '../../../modal/MobileGameResult';
import ButtonEx from '../../../common/ButtonEx';
import HongButton from '../../HongButton';
import { Row, BetweenRow } from '../../../common/Row';
import styled from 'styled-components';
import { getFontSize } from '../../../utility/fontsize';
import { getNewGameItems } from '../../../utility/data';
import { useNavigate } from 'react-router-dom';
import GameResultModal from '../../../modal/MobileGameResult';
import { LIFEMENU } from '../../../utility/life';
import { UpdateRACEByUSERSID } from '../../../service/RaceService';
import { playSound } from '../../../utility/sound';

import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, addDoc } from 'firebase/firestore';
import { db, auth, storage, firebaseConfig, firebaseApp } from '../../../api/config';
import RowGlowEffect from '../../../common/RowGlowEffect';
import ColGlowEffect from '../../../common/ColGlowEffect';

const Container = styled.div`
  padding-top: 0px;
  position: relative;
  overflow: visible; /* 🔥 추가 */
  height: auto;       /* 🔥 혹은 최소한 충분한 높이 확보 */
`;

const Layer = styled.div`
  background: #fdc66878;
  z-index: 10;
  font-size: ${() => getFontSize(12)}px;
  width: 80%;
  left: 10px;
  color: #131313;
  padding: 10px;
  display: flex;
  flex-direction: row;
  margin: 0px auto;
  border-radius: 10px;
`;

const Time = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0px;
  font-size: ${() => getFontSize(24)}px;
  font-family: 'Pretendard-Bold';
`;

const GameCount = 30;


const RankButton = styled.div`

  background: #FFF;
  border : 1px solid #EDEDED;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: ${getFontSize(14)}px;
  font-family : Pretendard-SemiBold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color :#333;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  z-index: 9999;
`;

const GameGridWrapper = styled.div`
  flex-grow: 1;
  min-height: 360px;
  max-height: calc(100dvh - 220px); // 헤더, 타이머, 버튼 감안
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  padding-top: 8px;
    overflow: visible; /* ✅ 추가! 줄 + 불꽃이 밖으로 나올 수 있게 */
`;


const MobileGame = ({ containerStyle }) => {
  const [items, setItems] = useState(() => getNewGameItems());

  const [initialize, setInitialize] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [alert, setAlert] = useState(false);
  const [point, setPoint] = useState(0);
  const [gameresultPopup, setGameresultPopup] = useState(false);
  const [resulttype, setResulttype] = useState('success');
  const [refresh, setRefresh] = useState(1);
  const [bombRedActive, setBombRedActive] = useState(false);
  const [bombRedUsed, setBombRedUsed] = useState(false);
  const [allowClick, setAllowClick] = useState(true);


  const startTimeRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [matched, setMatched] = useState(false);
  const [rowRefs, setRowRefs] = useState([]);
  const [showRowIndex, setShowRowIndex] = useState(null);
  const [showColIndex, setShowColIndex] = useState(null);


  const navigate = useNavigate();
  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const [triggerRow, setTriggerRow] = useState(false);

  const finalMilliseconds = startTimeRef.current ? Date.now() - startTimeRef.current : 0;






  const updateItem = (targetId, openValue) => {
    setItems(prev =>
      prev.map(x =>
        x.id === targetId ? { ...x, open: openValue } : x
      )
    );
  };


  useEffect(() => {
    playSound("Gamestart.m4a", { volume: 0.9, duration: 1500 }); // ✅ 자동 재생
  }, []);


  // ✅ 카드 매칭 성공 시 줄에 불빛 이펙트


  useEffect(() => {
    if (matched) {
      const timer = setTimeout(() => {
        setTriggerRow(false);
        setShowRowIndex(null);
        setShowColIndex(null);
        setMatched(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [matched]);

  useEffect(() => {
    if (matched && rowRefs[showRowIndex]?.current) {
      setTimeout(() => {
        setTriggerRow(true);
      }, 50);
    }
  }, [matched, rowRefs]);



  const rows = useMemo(() => {
    const result = [];
    const rowSize = 4; // 4장씩 나눠서 5줄 구성
    for (let i = 0; i < items.length; i += rowSize) {
      result.push(items.slice(i, i + rowSize));
    }
    return result;
  }, [items]);

  useEffect(() => {
    const refs = Array(rows.length)
      .fill()
      .map((_, i) => React.createRef());
    setRowRefs(refs);
  }, [rows]); // ✅ items → rows로 변경



  useEffect(() => {
    let interval;
    if (isRunning) {
      startTimeRef.current = Date.now();
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isRunning]);


  const _handleStart = () => {
    startTimeRef.current = Date.now(); // ✅ 명시적 초기화

    setItems(getNewGameItems());
    setInitialize(false);
    setIsRunning(true);
    setPoint(0);

    data.gameitems = [];
    datadispatch(data);
    setRefresh((refresh) => refresh + 1);
  };

  const _handleStop = () => {
    setResulttype("stop");

    setIsRunning(false);
    setInitialize(true);
 

    data.gameitems = [];
    datadispatch(data);
    setItems(getNewGameItems());
    setRefresh((refresh) => refresh + 1);
  };

  const _handleBombBlack = async() => {

    toast("💣 폭탄! 게임이 초기화됩니다!");

    await sleep(500); // ✅ 이거 하나로 해결됨

    setIsRunning(false);
    setInitialize(true);

    // 🔁 빨간 지뢰 사용 여부 초기화
    setBombRedUsed(false);

    // 🔁 열림 상태 초기화
    data.gameitems = [];
    datadispatch(data);

    // 🔁 카드 새로 셔플
    const freshItems = getNewGameItems().map((item) => ({
      ...item,
      open: false,
      autoOpen: false, // ✅ 자동열림도 확실히 막아줌
    }));

    setItems(freshItems);

    // 🔁 상태 리프레시
    setRefresh((r) => r + 1);

  };


  const _handleBombRed = async (clickedRedBombId) => {
    console.log('🔴 빨간 지뢰 발동 → 닫힌 카드만 셔플');
    setAllowClick(false);
    setBombRedActive(true);
    setBombRedUsed(true);
    toast("💥 카드 등장! 카드를 마구 섞습니다!");

    updateItem(clickedRedBombId, true); // 지뢰 flip
    await sleep(800);

    let step = 0;
    const interval = setInterval(() => {
      const shuffleTargets = items.filter(item =>
        !item.open &&
        item.id !== clickedRedBombId &&
        item.image !== imageDB.bombblack
      );

      const reshuffled = shuffleArray([...shuffleTargets]);

      const updatedItems = items.map(item => {
        if (item.open || item.id === clickedRedBombId || item.image === imageDB.bombblack) {
          return item;
        }
        const next = reshuffled.shift();
        return next || item; // fallback
      });

      setItems(updatedItems);
      setRefresh(r => r + 1);
      step++;

      if (step >= 3) { // 500ms * 6 = 3초
        clearInterval(interval);
        setTimeout(() => {
          updateItem(clickedRedBombId, true); // 다시 flip 유지
          setBombRedActive(false);
          setAllowClick(true);
        }, 200); // 연출 마무리
      }
    }, 500);
  };

  const onPress = async (success, gamesuccess, rowIndex, columnIndex) => {
    if (!startTimeRef.current) {
      console.warn("⛔ 게임 시작 시간이 설정되지 않았습니다. 기록 무시됨");
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    const finalTime = parseFloat(elapsed / 1000).toFixed(3);

    if (parseFloat(finalTime) < 10) {
      console.warn(`⛔ ${finalTime}초 → 너무 짧은 시간. 기록 무시`);
      return;
    }

    if (success) {
      setPoint((p) => p + 10);
      setMatched(true);             // ✅ 이거 먼저
      setShowRowIndex(rowIndex);    // ✅ 줄 정보
      setShowColIndex(columnIndex); // ✅ 열 정보
      setTriggerRow(true);          // ✅ 효과 트리거
    } 
    setAlert(success);
    setRefresh((r) => r + 1);

    await sleep(150);

    const matchedCount = items.filter(item =>
      item.open &&
      item.image !== imageDB.bombred &&
      item.image !== imageDB.bombblack
    ).length;

    const totalToMatch = items.filter(item =>
      item.image !== imageDB.bombred &&
      item.image !== imageDB.bombblack
    ).length;

    console.log("🎯 전체 매칭 대상 수:", totalToMatch);
    console.log("💖 매칭된 카드 수:", matchedCount);

    items.forEach(item => {
      if (
        item.image !== imageDB.bombred &&
        item.image !== imageDB.bombblack &&
        !item.open
      ) {
        console.log("❗ 아직 안 열린 매칭 대상:", item.id, item.index, item.image);
      }
    });


    if (matchedCount === 17) {
      console.log("🏁 모든 카드 매칭 완료 → 승리 처리 진입");

      try {
        const q = query(
          collection(db, "RACE"),
          where("USERS_ID", "==", user.USERS_ID)
        );
        const snap = await getDocs(q);
        const hasPrevious = !snap.empty;
        const prevTime = hasPrevious ? parseFloat(snap.docs[0].data().MINUTE) : null;

        if (!hasPrevious || parseFloat(finalTime) < prevTime) {
          console.log("✅ 기록 저장 또는 갱신 진행");

          await UpdateRACEByUSERSID({
            USERS_ID: user.USERS_ID,
            MINUTE: finalTime,
            NAME: user.USERINFO?.nickname || "익명",
            PHOTO: user.USERINFO?.userimg || null,
            LOCATION: user.USERINFO?.address_name || "지역 없음",
          });
        } else {
          console.log("❌ 더 느리거나 동일한 기록 → 저장 생략");
        }
      } catch (e) {
        console.error("🚨 기록 저장 중 오류:", e);
      }

      // ✅ 기록 여부와 무관하게 게임 종료 흐름은 그대로
      setResulttype("victory");
      setGameresultPopup(true);

      setTimeout(() => {
        setIsRunning(false);
        setInitialize(true);
      }, 1000);

      return;
    }


    // fallback용 중복 처리
    if (gamesuccess) return _handleStop();
  };





  const totalSeconds = elapsedTime / 1000;
  const formattedTime = totalSeconds.toFixed(4);


  const finalTime = parseFloat(elapsedTime / 1000).toFixed(3);

  const _handleRank = () => {
    navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.GAMERANK } });
  }

  const floatingItems = useMemo(() => {
    return getNewGameItems()
      .slice(0, 7)
      .map((item, i) => ({
        ...item,
        top: `${30 + Math.random() * 30}%`,
        left: `${5 + Math.random() * 70}%`,
        delay: `${i * 1.2}s`,
      }));
  }, []);


  return (
    <Container style={containerStyle}>

      {/* 💡 여기에서 바로 렌더 */}
      {initialize && (
        <RotateCardBasic items={floatingItems} />
      )}

      
      {
        !initialize && <Row style={{ justifyContent: 'flex-end', paddingRight: 20, paddingTop: 10 }}>
          <RankButton onClick={_handleRank}>
            <span>🏆 랭킹 보기</span>
          </RankButton>

        </Row>
      }





      {bombRedActive && (
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)', zIndex: 9999,
          fontSize: getFontSize(22),
          fontFamily: 'Pretendard-Bold',
          backgroundColor: '#fff3ca',
          borderRadius: 12,
          padding: '10px 20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          👩‍🍳 “이걸 왜 눌렀어~! 다 섞어버릴거야~!”
        </div>
      )}

      <GameGridWrapper>
        {gameresultPopup && (
          <GameResultModal
            callback={() => {
              setGameresultPopup(false);
              setIsRunning(false);     // ✅ 게임 루프 종료
              setInitialize(true);     // ✅ 새 게임 시작 대기
            }}
            resulttype={resulttype}
            rank={1}
            minutes={null}
            remainingSeconds={null}
            formattedTime={(elapsedTime / 1000).toFixed(3)}
            GameCount={GameCount}
            length={items.length}
          />
        )}
        {initialize ? (
          null
        ) : (

            rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                ref={rowRefs[rowIndex]}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {row.map((item, columnIndex) => (
                  <RotateCard
                    key={item.id}
                    image={item.image}
                    item={item}
                    index={columnIndex}
                    items={items}
                    setItems={setItems}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex} // ← 이걸로 충분!
                    callback={(success, gameEnd, r, c) => onPress(success, gameEnd, r, c)}
                    length={items.length}
                    handleBombBlack={_handleBombBlack} // 필요한 경우 연결
                    handleBombRed={_handleBombRed}
                    bombRedUsed={bombRedUsed}
                    setBombRedUsed={setBombRedUsed}
                    bombRedActive={bombRedActive}
                    allowClick={allowClick}
                    setAllowClick={setAllowClick}
                  />
                ))}
              </div>
            ))
 
        )}


        {!initialize && (
          <BetweenRow style={{ width: "90%", margin: "0 auto" }}>
            <div style={{ width: "30%" }}>
              <ButtonEx
                text={'게임중지'}
                width={'100'}
                onPress={_handleStop}
                bgcolor={'#FF7E19'}
                color={'#FFF'}
                containerStyle={{
                  fontFamily: "Pretendard-SemiBold",
                  boxShadow: "none",
                  height: 34,
                  fontSize: getFontSize(16),
                  borderRadius: 5,
                  marginTop: 10,
                }}
              />
            </div>
            <BetweenRow style={{ width: "70%", fontSize: getFontSize(24), padding: "10px 0px 0px 50px", color: '#F75100', fontFamily: "Pretendard-SemiBold" }}>
              <Time>{formattedTime}초</Time>
            </BetweenRow>
          </BetweenRow>
        )}

        {initialize && (
          <Row style={{ width: "80%", margin: "10px auto", position:"fixed", bottom:85 }}>
            <HongButton
              style={{
                marginTop: 5, backgroundColor: "#FF6A00",
              border: "2px solid #FF6A00",
              height:"48px",
              color: "#FFF",borderRadius: "12px" }}
              variant="primary"
              fullWidth
              onClick={_handleStart}
            >
              시작
            </HongButton>
          </Row>
        )}
        {showRowIndex !== null && rowRefs[showRowIndex]?.current && (
          <RowGlowEffect
            targetRef={rowRefs[showRowIndex]}
            trigger={true}
          />
        )}
        {showColIndex !== null && (
          <ColGlowEffect columnIndex={showColIndex} />
        )}
        <Toaster position="bottom-right" richColors />
      </GameGridWrapper>

    </Container>
  );
};

export default MobileGame;
