import React, { useContext, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { imageDB } from '../utility/imageData';
import { getFontSize } from '../utility/fontsize';
import { Readuserbyusersid, Update_racebyusersid } from '../service/UserService';
import { UserContext } from '../context/User';
import moment from "moment";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useSpring, animated } from '@react-spring/web';
import { RULLET_TYPE_RESULT } from './config/etc/MobileRulletEvent';
import { useNavigate } from 'react-router-dom';
import { CONFIGMOVE, POINTSTATUS, POINTTYPE } from '../utility/screen';

import Fade from '@mui/material/Fade';
import { CreatePoint } from '../service/PointService';

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


 const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '85%',
  maxWidth: '360px',
  backgroundColor: '#ffffff',
  color: '#333',
  zIndex: 100,
  display: 'flex',
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  maxHeight: '85vh',
  overflowY: 'auto',
};



const ResultPopup = ({ open = true, checknum, onClose, onNavigatePoint, imageDB, getFontSize }) => {

  console.log("✅ checknum 값 확인:", checknum, typeof checknum);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { TransitionComponent: Fade } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {renderResultContent(checknum, onClose, onNavigatePoint, imageDB, getFontSize)}
        </Box>
      </Fade>
    </Modal>
  );
};

const renderResultContent = (checknum, onClose, onNavigatePoint, imageDB, getFontSize) => {
  switch (checknum) {
    case RULLET_TYPE_RESULT.ZERO_ONE:
      return (
        <>
          <div style={{ fontFamily: "Pretendard-Bold", fontSize: getFontSize(32), color: "#000" }}>아쉽네요.</div>
          <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: getFontSize(20), color: "#000" }}>다음엔 좋은 결과가 있을 거예요</div>
          <div style={{ marginTop: 15 }}>
            <div style={{ fontSize: getFontSize(14), color: '#888', textAlign: 'center' }}>
              달리기 게 하루에 한 번만 진행할 수 있습니다.
            </div>
          </div>
          <button onClick={onClose} style={{ marginTop: 24, padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>확인</button>
        </>
      );

    case RULLET_TYPE_RESULT.POINT_1000:
    case RULLET_TYPE_RESULT.POINT_5000:
      const pointValue = checknum === RULLET_TYPE_RESULT.POINT_1000 ? '1000' : '5000';
      return (
        <>
          <div style={{ fontFamily: "Pretendard-Bold", fontSize: getFontSize(32), color: "#000", marginTop: 40 }}>축하합니다!</div>
          <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: getFontSize(20), color: "#000" }}>경품에 당첨되셨습니다</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#FFAA0B', margin: '16px 0' }}>{pointValue}P</div>
          <img src={imageDB.POINT} style={{ width: 30, marginBottom: 12 }} />
          <div style={{ fontSize: getFontSize(14), color: '#888', textAlign: 'center', marginBottom: 16 }}>
            당첨 내용은 내 포인트 내역에서 확인할 수 있습니다
          </div>
          <button onClick={onNavigatePoint} style={{ marginBottom: 12, padding: '8px 16px', border: '1px solid #FFAA0B', background: 'transparent', color: '#FFAA0B', borderRadius: 6 }}>포인트 보러가기</button>
          <button onClick={onClose} style={{ padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>확인</button>
        </>
      );
    case RULLET_TYPE_RESULT.COUPON:
      return (
        <>
          <div style={{ fontSize: getFontSize(16), color: '#999' }}>커피 쿠폰에 당첨되셨습니다. 등록해주신 전화번호로 커피 쿠폰 문자를 보내드리도록 하겠습니다</div>
          <button onClick={onClose} style={{ marginTop: 16, padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>닫기</button>
        </>
      );
    default:
      return (
        <>
          <div style={{ fontSize: getFontSize(16), color: '#999' }}>결과를 불러올 수 없습니다.</div>
          <button onClick={onClose} style={{ marginTop: 16, padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>닫기</button>
        </>
      );
  }
};

const AudioPlayer = ({ condition, duration = 3000 }) => {
  const [audio] = useState(new Audio("/sounds/racestart.mp3"));
  const timeoutRef = useRef(null);

  useEffect(() => {
    audio.volume = 0.5;

    if (condition) {
      audio.play().catch((err) => {
        console.error("Audio playback failed", err);
      });

      // 일정 시간 후 오디오 정지
      timeoutRef.current = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; // 재생 위치 초기화
      }, duration);
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      // cleanup (컴포넌트 언마운트 시 정리)
      clearTimeout(timeoutRef.current);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [condition, audio, duration]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      audio.pause();
      audio.currentTime = 0;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [audio]);

  return null;
};



const RaceGame = () => {
  const [nextPlayTime, setNextPlayTime] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [isBlocked, setIsBlocked] = useState(false);
  const { dispatch, user } = useContext(UserContext);
  const [checknum, setChecknum] = useState(-1);
  const [showPopup, setShowPopup] = useState(false);

  const arrivalRef = useRef([null, null, null]);

  const navigate = useNavigate(); 
  const raceStartAudio = useRef(null);

  const [playAudio, setPlayAudio] = useState(false);

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

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRacedate = async () => {
      const useritem = await Readuserbyusersid({ USERS_ID: user.USERS_ID });

      console.log("TCL: fetchRacedate -> useritem", useritem);

      if (useritem.RACE) {
        const target = moment(useritem.RACE.toDate());
        if (target.isAfter(moment())) {
          setNextPlayTime(target.toDate().getTime());
          setIsBlocked(true);
        } else {
          setNextPlayTime(null);
          setIsBlocked(false);
        }
      }
    };

    fetchRacedate();
  }, []);

  useEffect(() => {
    if (!start) return;

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
      setInterval(async() => {
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
            arrivalRef.current = updated; // ✅ 여기서 ref 동기화
            return updated;
          });
          setFinished((prev) => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
          });
          clearInterval(timers[i]);

          // ✅ 여기 아래가 팝업 띄우는 타이밍이야!
          if (i === 0) {
            const checkArrival = setInterval(async () => {
              const arrivals = arrivalRef.current; // ✅ 항상 최신값

              console.log("⏱ checkArrival polling...", arrivals);

              if (arrivals.every((t) => t !== null)) {
                clearInterval(checkArrival);

                const userArrival = arrivals[0];
                const isFirst = arrivals.every((t, idx) => idx === 0 || userArrival <= t);

                if (isFirst) {
                  setChecknum(RULLET_TYPE_RESULT.POINT_1000);


                  const pointValue = 1000;
                  const POINTVARCODE = Math.random().toString(36).substring(2, 10);
                  const today = new Date();
                  const POINTDATE = today;
                  const POINTEXPIREDATE = new Date(today);
                  POINTEXPIREDATE.setDate(today.getDate() + 30);


                  const TYPE = POINTTYPE.RACE; // ❗️룰렛과 구분하려면 따로 타입 정해도 됨
                  const ENABLE = POINTSTATUS.NORMAL;

                  await CreatePoint({
                    POINTVARCODE,
                    POINT: pointValue,
                    TYPE,
                    POINTDATE,
                    POINTEXPIREDATE,
                    ENABLE,
                    USERS_ID: user.USERS_ID
                  });

                } else {
                  setChecknum(RULLET_TYPE_RESULT.ZERO_ONE);
                }

                setShowPopup(true);
              }
            }, 100);
          }
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
  }, [patternIndex]);

  useEffect(() => {
    return () => {
      if (arrivalRef.current) {
        clearInterval(arrivalRef.current); // ✅ setInterval 정리
        arrivalRef.current = null;         // ✅ 레퍼런스 제거
      }
    };
  }, []);




  const handleStartClick = async () => {

    setPlayAudio(true);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await Update_racebyusersid({ USERS_ID: user.USERS_ID, RACEDATE: tomorrow });


    setTimeout(() => {
      // 기존 레이스 시작 로직
      setPlayAudio(false);
      const isSuccess = Math.random() < 0.5;
      if (isSuccess) {
        const successIndex = Math.floor(Math.random() * 4);
        setPatternIndex(successIndex);
      } else {
        const lossStart = 4;
        const lossPoolSize = racePatterns.length - lossStart;
        const lossIndex = lossStart + Math.floor(Math.random() * lossPoolSize);
        setPatternIndex(lossIndex);
      }

      setStart(true);
      setElapsedTimes([0, 0, 0]);
      setDistances([0, 0, 0]);
      setFinished([false, false, false]);
      setArrivalTimes([null, null, null]);
    }, 7000); // ⏱️ 6초 기다림

    



  };



  const _handlePoint =()=>{

    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.POINTCONFIG, TYPE : ""}});

  }

  const ResultPopupclose = () => {

    const today = moment();
    const TargetDate = new Date(today);
    TargetDate.setDate(TargetDate.getDate() + 1);
    setNextPlayTime(TargetDate.getTime()); // ✅ 다음 플레이 시간 설정
    setIsBlocked(true); // ✅ 하루 플레이 제한 활성화 
    setShowPopup(false);
  }
  
  return (
    <RaceContainer>
      <CountdownBoard><CountdownTime>50미터 달리기 게임</CountdownTime></CountdownBoard>

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
          handleStartClick();
        }}>🚩 START</StartButton>
      ) : (
        <StartButton disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>START</StartButton>
      )}

      {showPopup && (
        <ResultPopup
          open={true}
          checknum={checknum}
          onClose={ResultPopupclose}
          onNavigatePoint={_handlePoint}
          imageDB={imageDB}
          getFontSize={getFontSize}
        />
      )}
      <AudioPlayer condition={playAudio} />    
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
  background: #e2884a;
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
  z-index: 2;
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
