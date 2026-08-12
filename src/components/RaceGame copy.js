import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { imageDB } from '../utility/imageData';
import { getFontSize } from '../utility/fontsize';

import { Readuserbyusersid, Update_racebyusersid } from "../../service/UserService";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/User";
import moment from "moment";


const racePatterns = [
  // ✅ 사용자(0번)가 확실히 1등인 보장 패턴 1
  {
    frames: [
      [0, 0, 0], [15, 5, 8], [30, 15, 18], [50, 25, 30],
      [70, 35, 42], [88, 50, 50], [88, 70, 65], [88, 88, 88]
    ]
  },
  // ✅ 사용자(0번)가 확실히 1등인 보장 패턴 2
  {
    frames: [
      [0, 0, 0], [12, 7, 6], [24, 14, 13], [36, 21, 20],
      [48, 28, 26], [60, 35, 32], [80, 42, 38], [88, 60, 55], [88, 88, 88]
    ]
  },
  // ✅ 사용자(0번)가 확실히 1등인 보장 패턴 3
  {
    frames: [
      [0, 0, 0], [20, 10, 12], [40, 20, 24], [60, 30, 36],
      [80, 40, 48], [88, 60, 60], [88, 80, 70], [88, 88, 88]
    ]
  },
  // ✅ 사용자(0번)가 확실히 1등인 보장 패턴
  {
    frames: [
      [0, 0, 0], [10, 5, 6], [20, 10, 12], [40, 20, 24], [60, 30, 36],
      [80, 40, 48], [88, 60, 60], [88, 80, 70], [88, 88, 88]
    ]
  },
  {
    frames: [
      [0, 0, 0], [4, 8, 6], [8, 16, 12], [12, 24, 18], [16, 32, 24],
      [20, 40, 30], [24, 48, 36], [28, 56, 42], [32, 64, 48], [36, 72, 54],
      [40, 80, 60], [44, 88, 66], [48, 88, 72], [52, 88, 78], [56, 88, 84], [60, 88, 88]
    ]
  },
  {
    frames: [
      [0, 0, 0], [5, 10, 6], [10, 20, 12], [15, 30, 18], [20, 40, 24],
      [25, 50, 30], [30, 60, 36], [35, 70, 42], [40, 80, 48],
      [45, 88, 54], [50, 88, 60], [55, 88, 66], [60, 88, 72], [65, 88, 78], [70, 88, 84], [74, 88, 88]
    ]
  },
  {
    frames: [
      [0, 0, 0], [10, 9, 8], [20, 18, 16], [30, 27, 24], [40, 36, 32],
      [50, 45, 40], [58, 54, 48], [66, 63, 56], [74, 72, 64],
      [78, 80, 72], [81, 88, 80], [84, 88, 84], [86, 88, 86], [88, 88, 88]
    ]
  },
  {
    frames: [
      [0, 0, 0], [8, 15, 12], [12, 30, 24], [14, 45, 36], [16, 60, 48],
      [17, 75, 60], [18, 80, 70], [19, 84, 80], [20, 88, 88],
      [22, 88, 88], [25, 88, 88], [28, 88, 88], [32, 88, 88], [36, 88, 88], [40, 88, 88],
      [44, 88, 88], [48, 88, 88], [52, 88, 88], [56, 88, 88], [60, 88, 88],
      [64, 88, 88], [68, 88, 88], [72, 88, 88], [76, 88, 88], [80, 88, 88],
      [84, 88, 88], [88, 88, 88]
    ]
  },
  {
    frames: [
      [0, 0, 0], [20, 10, 12], [40, 20, 24], [60, 30, 36], [70, 45, 48],
      [75, 60, 60], [77, 70, 72], [78, 80, 80], [79, 84, 85],
      [80, 86, 88], [82, 88, 88], [84, 88, 88], [86, 88, 88], [88, 88, 88]
    ]
  }
];

const RaceGame = () => {
  const [nextPlayTime, setNextPlayTime] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem(RACE_GAME_LAST_PLAYED_KEY);
    if (last && isSameDay(parseInt(last), Date.now())) {
      const next = new Date(parseInt(last));
      next.setDate(next.getDate() + 1);
      setNextPlayTime(next.getTime());
      setIsBlocked(true);
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  const [start, setStart] = useState(false);
  const [runnerPositions, setRunnerPositions] = useState([0, 0, 0]);
  const [runnerDirections, setRunnerDirections] = useState([-1, -1, -1]);
  const [patternIndex, setPatternIndex] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState([0, 0, 0]);
  const [distances, setDistances] = useState([0, 0, 0]);
  const [finished, setFinished] = useState([false, false, false]);
  const [arrivalTimes, setArrivalTimes] = useState([null, null, null]);

  const allFinished = finished.every((f) => f);

  const finalRanks = allFinished
    ? arrivalTimes
      .map((time, idx) => ({ idx, time }))
      .filter(({ time }) => time !== null)
      .sort((a, b) => a.time - b.time)
      .reduce((acc, cur, rank) => {
        acc[cur.idx] = rank + 1;
        return acc;
      }, {})
    : {};

  useEffect(() => {
    if (!start) return;

    // ✅ 1등일 경우 1000포인트 지급
    if (finalRanks[0] === 1) {
      const pointValue = 1000;
      const POINTVARCODE = Math.random().toString(36).substring(2, 10);
      const today = new Date();
      const POINTDATE = today;
      const POINTEXPIREDATE = new Date(today);
      POINTEXPIREDATE.setDate(today.getDate() + 30);
      // TODO: Firestore 등 서버와 연동해 포인트 지급 처리 필요
      console.log('🎉 1등! 포인트 지급:', pointValue);
      console.log('📌 포인트 유효기간:', POINTEXPIREDATE);
      alert(`🎉 축하합니다! 1등으로 ${pointValue}포인트를 획득하셨습니다!`);
    }
    const winningDay = patternIndex === 999;
    const selectedPatternIndex = winningDay
      ? (() => {
        const winningPatternStartIndex = 0; // ✅ 0~3번은 0번 사용자가 이기는 패턴
        const winningPoolSize = 4;
        const randomWinIdx = Math.floor(Math.random() * winningPoolSize);
        return winningPatternStartIndex + randomWinIdx;
      })()
      : (patternIndex % racePatterns.length);

    const userPattern = JSON.parse(JSON.stringify(racePatterns[selectedPatternIndex]));
    const selectedPatterns = [
      userPattern,
      JSON.parse(JSON.stringify(userPattern)),
      JSON.parse(JSON.stringify(userPattern))
    ];

    const frameIndices = [0, 0, 0];
    const positions = [0, 0, 0];
    const startTime = Date.now();
    const localFinished = [false, false, false];

    const timers = [0, 1, 2].map((i) =>
      setInterval(() => {
        if (localFinished[i]) return;

        const currentFrameIndex = frameIndices[i];
        const frame = selectedPatterns[i].frames[currentFrameIndex];
        let nextPos = frame ? frame[i] : 88;
        frameIndices[i]++;
        positions[i] = nextPos;

        const now = Date.now();
        const elapsedMs = now - startTime;
        const elapsedSec = (elapsedMs / 1000).toFixed(2);
        const distance = (positions[i] / 88) * 50;

        setRunnerPositions((prev) => {
          const updated = [...prev];
          updated[i] = nextPos;
          return updated;
        });

        if (nextPos >= 88 && !localFinished[i]) {
          localFinished[i] = true;
          setElapsedTimes((prev) => {
            const updated = [...prev];
            updated[i] = parseFloat(elapsedSec);
            return updated;
          });
          setDistances((prev) => {
            const updated = [...prev];
            updated[i] = 50;
            return updated;
          });
          setArrivalTimes((prev) => {
            const updated = [...prev];
            updated[i] = now;
            return updated;
          });
          setFinished((prev) => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
          });
          clearInterval(timers[i]);
        } else {
          setElapsedTimes((prev) => {
            const updated = [...prev];
            updated[i] = parseFloat(elapsedSec);
            return updated;
          });
          setDistances((prev) => {
            const updated = [...prev];
            updated[i] = distance;
            return updated;
          });
        }
      }, 500 + i * 100)
    );

    return () => timers.forEach(clearInterval);
  }, [start, patternIndex]);

  return (
    <RaceContainer>
      <CountdownBoard><CountdownTime>50미터 달리기 게임</CountdownTime></CountdownBoard>
      <PatternSelector>
        <label>테스트:</label>
        <ButtonGroup>
          <TestButton onClick={() => setPatternIndex(999)}>✅ 성공</TestButton>
          <TestButton onClick={() => setPatternIndex(() => {
            const lossStart = 4;
            const lossPoolSize = racePatterns.length - lossStart;
            const randLoss = Math.floor(Math.random() * lossPoolSize);
            return lossStart + randLoss;
          })}>❌ 실패</TestButton>
        </ButtonGroup>
      </PatternSelector>
      <Track>
        {[0, 1, 2].map((_, i) => (
          <Lane key={i}>
            <LaneLabel>{i === 0 ? '사용자' : `AI 주자 ${i}`}</LaneLabel>
            <Runner
              style={{
                left: `${runnerPositions[i]}%`,
                transform: `translateY(-50%) scaleX(${runnerDirections[i]})`,
                transition: 'left 0.5s linear'
              }}
              src={start && !finished[i] ? imageDB.chatwoman : imageDB.chatwomanstatic}
              alt={`주자${i + 1}`}
            />
            <LapCounter>{allFinished && finalRanks[i] ? `${finalRanks[i]}등` : ''}</LapCounter>
            <RaceMeter>{distances[i].toFixed(0)}m / {elapsedTimes[i].toFixed(2)}초</RaceMeter>
          </Lane>
        ))}
        <FinishLine />
      </Track>
      <CrowdImage src={imageDB.audience} alt='관중' style={{ width: '90%', marginBottom: '10px' }} />
      <Audience>
        관중들이 응원하고 있습니다! 🎉
        {nextPlayTime && (
          <div style={{ fontSize: '14px', marginTop: '6px' }}>
            ⏳ 다음 게임까지 {getTimeRemaining(nextPlayTime).hours}시간 {getTimeRemaining(nextPlayTime).minutes}분 {getTimeRemaining(nextPlayTime).seconds}초 남음
          </div>
        )}
      </Audience>
      {!isBlocked ? (
        <StartButton onClick={() => {
          localStorage.setItem(RACE_GAME_LAST_PLAYED_KEY, Date.now().toString());
          setStart(true);
          setElapsedTimes([0, 0, 0]);
          setDistances([0, 0, 0]);
          setFinished([false, false, false]);
          setArrivalTimes([null, null, null]);
        }}>🚩 START</StartButton>
      ) : (
        <StartButton disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>START</StartButton>
      )}
    </RaceContainer>
  );
};

export default RaceGame;

// ✅ 하루 제한 관련 키
const RACE_GAME_LAST_PLAYED_KEY = 'raceGame_lastPlayed';

// ✅ 날짜 비교 유틸
const isSameDay = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

// ✅ 남은 시간 계산 유틸
const getTimeRemaining = (targetTime) => {
  const total = targetTime - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  return { total, hours, minutes, seconds };
};

const RaceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
  box-sizing: border-box;
`;

const CountdownBoard = styled.div`
  width: 100%;

  color: #ff7e19;
  font-family: Pretendard-SemiBold;
  text-align: center;
  padding : 20px 0px;
  margin-bottom: 12px;
`;

const CountdownTime = styled.div`
  font-size: 22px !important;
`;

const CountdownNotice = styled.div`
  font-size: ${() => getFontSize(20)}px !important;
  margin-top: 8px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  height: 28px;

  span {
    position: absolute;
    display: inline-block;
    padding-left: 100%;
    animation: scrollText 12s linear infinite;
  }

  @keyframes scrollText {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
`;

const PatternSelector = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
`;

const Track = styled.div`
  position: relative;
  width: 90%;
  height: 240px;
  background: #4a90e2;
  border: 2px solid #222;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 10px;
`;


const LaneLabel = styled.div`
  position: absolute;
  width: 100%;
  top: 30%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.85);  // ✅ 하얀색 톤다운
  font-style: italic;
  font-weight: bold;
  font-size: ${() => getFontSize(14)}px !important;
  text-align: center;
  pointer-events: none;
  z-index: 1;
`;

const LapCounter = styled.div`
  position: absolute;
  width: 100%;
  top: calc(40% + 18px); // ✅ 글자 아래에
  transform: translateY(-50%);
  text-align: center;
  color: rgb(199 197 197 / 54%)
  font-size: 12px;
  font-weight: bold;
  z-index: 1;
`;

const RaceMeter = styled.div`
    position: absolute;
    top: 3px;
    text-align: center;
    font-size: ${() => getFontSize(12)}px !important;
    color: #fff;
    z-index: 1;
    opacity: 0.85;
    pointer-events: none;
    right: 10px;
`;


const Lane = styled.div`
  height: 33.3%;
  border-top: 2px dashed white;
  position: relative;

  &:last-child {
    border-bottom: 2px dashed white;
  }
`;






const Runner = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 36px;
  z-index: 20;
  transition: left 0.3s ease-out;
`;



const FinishLine = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 6px;
  background: repeating-linear-gradient(
    to bottom,
    white 0,
    white 6px,
    black 6px,
    black 12px
  );
  z-index: 10;
`;

const Audience = styled.div`
  width: 90%;
  background: #fffbe0;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: white;
  font-size: ${() => getFontSize(20)}px !important;
  font-weight: bold;
  padding: 10px 24px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin-top: 16px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const wave = keyframes`

  0% { transform: scaleY(1); }
  50% { transform: scaleY(1.05); }
  100% { transform: scaleY(1); }
`;
const CrowdImage = styled.img`
  width: 100%;
  height: 48px;
  object-fit: cover;
  animation: ${wave}  0.8s ease-in-out infinite;
  transform-origin: bottom;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 12px;
`;

const TestButton = styled.button`
  padding: 6px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background-color: #ddd;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ccc;
  }
`;
