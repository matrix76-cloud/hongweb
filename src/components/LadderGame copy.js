// ✅ 사다리 게임 완성형 버전 - 사용자별 보상 테이블 및 Firebase 통합 (서비스 함수 적용)
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ladder.css';
import { UserContext } from '../context/User';
import { getFontSize } from '../utility/fontsize';
import { imageDB } from '../utility/imageData';
import { CONFIGMOVE, POINTSTATUS } from '../utility/screen';
import { ResultPopup, RULLET_TYPE_RESULT } from './config/etc/MobileRulletEvent';


import { getCooldownTime, getOrCreateRewardTable, getTotalLadderIndex, getWeeklyLadderIndex, logLadderResult, recordCouponRequest, setCooldownTime } from '../service/LadderService';
import { CreatePoint } from '../service/PointService';




const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}시간 ${minutes}분 ${seconds}초 남음`;
};

const getRandom = () => {
    let min = 0;
    let max = 9;
    let randomInt1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt3 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt4 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt5 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt6 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt7 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt8 = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomInt1.toString() +
        randomInt2.toString() +
        randomInt3.toString() +
        randomInt4.toString() +
        randomInt5.toString() +
        randomInt6.toString() +
        randomInt7.toString() +
        randomInt8.toString()

}



const LadderGame = () => {
    const [selected, setSelected] = useState(null);
    const [started, setStarted] = useState(false);
    const [result, setResult] = useState(null);
    const [finalIndex, setFinalIndex] = useState(null);
    const [coverState, setCoverState] = useState('closed');
    const [futureDate, setFutureDate] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [ladderSteps, setLadderSteps] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [checknum, setChecknum] = useState(-1);
    const [precomputedData, setPrecomputedData] = useState(null);

    const [defaultRewardTypes, setDefaultRewardTypes] = useState([
        '쿠폰', '5,000P', '꽝', '1,000P'
    ]);

    const walkerRef = useRef(null);
    const containerRef = useRef(null);
    const columnWidth = 80;
    const columnOffset = 50;
    const navigate = useNavigate();
    const { user } = useContext(UserContext);


    const reorderRewardTypesToTargetIndex = (resultText, targetIndex = 3) => {
        const others = defaultRewardTypes.filter((r) => r !== resultText);
        const reordered = [...others.slice(0, targetIndex), resultText, ...others.slice(targetIndex)];
        return reordered.slice(0, 4); // 최대 4개 유지
    };


    useEffect(() => {
   

        const initLadderGame = async () => {
            if (!user?.USERS_ID) return;

            // 1. 보상 결과 계산
            const rewardsArr = await getOrCreateRewardTable(user.USERS_ID);

            const index = (await getTotalLadderIndex(user.USERS_ID)) % rewardsArr.length;

            const resultText = rewardsArr[index] || '꽝';

            console.log("rewardsArr", rewardsArr, index);

            // 2. 도착 위치 정하기 (예: 무작위 or 전략적)
            const targetIndex = Math.floor(Math.random() * 4);

            // 3. 버튼 순서 재배열
            const reordered = reorderRewardTypesToTargetIndex(resultText, targetIndex);
            setDefaultRewardTypes(reordered);
            setResult(resultText);

            // 4. 선택하지 않은 상태로 미리 라인 세팅은 불가능하므로, 이후 handleStart에서 selected 이용
            setPrecomputedData({
                resultText,
                targetIndex,
                rewardsArr,
                index
            });
        };
        initLadderGame();
    }, [user?.USERS_ID]);
    

    useEffect(() => {
        if (!user?.USERS_ID) return;
        const fetchCooldown = async () => {
            const next = await getCooldownTime(user.USERS_ID);
            if (next && next > new Date()) {
                setFutureDate(next.getTime());
                setCoverState('closed'); // ✅ 타이머부터 보여줌
            }
        };
        fetchCooldown();
    }, [user?.USERS_ID]);

    useEffect(() => {
        if (!futureDate) return;
        const interval = setInterval(() => {
            const timeLeft = Math.max(0, Math.floor((futureDate - Date.now()) / 1000));
            setRemainingTime(timeLeft);
            if (timeLeft <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [futureDate]);

    const getWalkerPath = (startIndex, steps) => {
        let current = startIndex;
        const path = [{ top: 0, leftIndex: current }];
        const sortedSteps = [...steps].sort((a, b) => a.top - b.top);
        for (const step of sortedSteps) {
            path.push({ top: step.top, leftIndex: current });
            if (step.from === current) current += 1;
            else if (step.from === current - 1) current -= 1;
            path.push({ top: step.top, leftIndex: current });
        }
        path.push({ top: 400, leftIndex: current });
        return { finalIndex: current, path };
    };

    const moveWalkerByPath = async (path) => {
        const walker = walkerRef.current;
        if (!walker) return;
        const first = path[0];
        const startX = first.leftIndex * columnWidth + columnOffset - 8;
        const startY = first.top;
        walker.style.transition = 'none';
        walker.style.transform = `translate(${startX}px, ${startY}px)`;
        walker.style.opacity = 1;
        await new Promise((r) => requestAnimationFrame(r));
        walker.style.transition = 'transform 0.3s ease-in-out';
        for (let i = 1; i < path.length; i++) {
            const { leftIndex, top } = path[i];
            const x = leftIndex * columnWidth + columnOffset - 8;
            const y = top;
            walker.style.transform = `translate(${x}px, ${y}px)`;
            await new Promise(res => setTimeout(res, 300));
        }
    };

    const generateLadderStepsToTarget = (start, target) => {
        const steps = [];
        const topValues = [80, 130, 180, 230, 280, 330]; // 라인 위치(위에서 아래로)

        let current = start;

        for (let i = 0; i < topValues.length; i++) {
            const top = topValues[i];

            if (current < target) {
                steps.push({ top, from: current });     // 오른쪽으로 가는 라인
                current += 1;
            } else if (current > target) {
                steps.push({ top, from: current - 1 }); // 왼쪽으로 가는 라인
                current -= 1;
            } else {
                // 도착 위치와 같으면 수직으로 내려가야 하므로 라인 생략
            }
        }

        return steps;
    };
    const generateLadderStepsFinal = (start, target) => {
        const steps = [];
        const topValues = [80, 120, 160, 200, 240, 280, 320, 360, 400]; // 더 많게!
        let current = start;
        const usedPairs = new Set();

        // 1. 필수 경로 생성 (도착 보장)
        for (const top of topValues) {
            if (current < target) {
                steps.push({ top, from: current });
                usedPairs.add(`${top}-${current}`);
                current += 1;
            } else if (current > target) {
                steps.push({ top, from: current - 1 });
                usedPairs.add(`${top}-${current - 1}`);
                current -= 1;
            }
            if (current === target) break;
        }

   
        return steps;
    };
    
    
    const handleStart = async () => {
        if (started || selected === null || (futureDate && futureDate > Date.now())) return;
        if (!precomputedData) return;

        setStarted(true);
        setCoverState('open');

        // 쿨타임 세팅
        const nextTime = await setCooldownTime(user.USERS_ID);
        setFutureDate(nextTime.getTime());

        // 사다리 라인 생성: selected → targetIndex
        const steps = generateLadderStepsFinal(selected, precomputedData.targetIndex);
        setLadderSteps(steps);

        const { path } = getWalkerPath(selected, steps);
        await moveWalkerByPath(path);

        await new Promise(res => setTimeout(res, 1000));
        // 결과 처리
        setResult(precomputedData.resultText);
        const resultText = precomputedData.resultText;

        await logLadderResult(user.USERS_ID, resultText);

        if (resultText === '쿠폰') {
            await recordCouponRequest(user.USERS_ID, user.USERINFO?.phone || '');
        }

        if (resultText === '1,000P' || resultText === '5,000P') {
            const point = parseInt(resultText.replace('P', '').replace(',', ''));
            const POINTVARCODE = getRandom();
            const today = new Date();
            const POINTDATE = today;
            const POINTEXPIREDATE = new Date(today);
            POINTEXPIREDATE.setDate(today.getDate() + 30);

            await CreatePoint({
                POINTVARCODE,
                POINT: point,
                TYPE: 'LADDER',
                POINTDATE,
                POINTEXPIREDATE,
                ENABLE: POINTSTATUS.NORMAL,
                USERS_ID: user.USERS_ID
            });
        }

        let resultCode = RULLET_TYPE_RESULT.ZERO_ONE;
        if (resultText === '1,000P') resultCode = RULLET_TYPE_RESULT.POINT_1000;
        if (resultText === '5,000P') resultCode = RULLET_TYPE_RESULT.POINT_5000;
        if (resultText === '쿠폰') resultCode = RULLET_TYPE_RESULT.COUPON;
        setChecknum(resultCode);
        setShowPopup(true);

        await new Promise(res => setTimeout(res, 1000));
        setCoverState('result');
        setStarted(false);

        const initLadderGame = async () => {
            if (!user?.USERS_ID) return;

            // 1. 보상 결과 계산
            const rewardsArr = await getOrCreateRewardTable(user.USERS_ID);

            const index = (await getTotalLadderIndex(user.USERS_ID)) % rewardsArr.length;

            const resultText = rewardsArr[index] || '꽝';

            console.log("rewardsArr", rewardsArr, index);

            // 2. 도착 위치 정하기 (예: 무작위 or 전략적)
            const targetIndex = Math.floor(Math.random() * 4);

            // 3. 버튼 순서 재배열
            const reordered = reorderRewardTypesToTargetIndex(resultText, targetIndex);
            setDefaultRewardTypes(reordered);
            setResult(resultText);

            // 4. 선택하지 않은 상태로 미리 라인 세팅은 불가능하므로, 이후 handleStart에서 selected 이용
            setPrecomputedData({
                resultText,
                targetIndex,
                rewardsArr,
                index
            });
        };
        initLadderGame();
    };
    

    const handleResultPopupClose = () => {
        setShowPopup(false);
        setChecknum(-1);
    };

    const generateRandomLadderSteps = () => {
        const steps = [];
        const topValues = [80, 130, 180, 230, 280, 330];
        const usedPairs = new Set();
        topValues.forEach((top, index) => {
            let from = index % 2 === 0 ? 0 : 1 + Math.floor(Math.random() * 2);
            while (usedPairs.has(`${top}-${from}`)) {
                from = Math.floor(Math.random() * 3);
            }
            usedPairs.add(`${top}-${from}`);
            steps.push({ top, from });
        });
        return steps;
    };

    return (
        <div className="ladder-game">
            <div className="select-buttons">
                {[0, 1, 2, 3].map((i) => (
                    <button
                        key={i}
                        className={`select-button ${selected === i ? 'selected' : ''}`}
                        onClick={() => !started && setSelected(i)}
                    >
                        {i + 1}번
                    </button>
                ))}
            </div>
            <div className="ladder-container" ref={containerRef}>
                <div className="walker" ref={walkerRef} />
                {coverState === 'open' && [0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="ladder-line"
                        style={{ left: `${i * columnWidth + columnOffset}px` }}
                    />
                ))}

                {ladderSteps.map((step, idx) => (
                    <div
                        key={idx}
                        className="ladder-step"
                        style={{
                            top: `${step.top}px`,
                            left: `${step.from * columnWidth + columnOffset}px`,
                            width: `${columnWidth}px`,
                        }}
                    />
                ))}
                <div className="ladder-results">
                    {defaultRewardTypes.map((item, index) => (
                        <button
                            key={index}
                            className={`reward-button ${coverState === 'open' && result === item ? '' : ''
                              }`}
                            style={{ left: `${index * columnWidth + columnOffset}px` }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                {coverState !== 'open' && (
                    <div className={`ladder-cover ${coverState}`}>
                        <div className="start-ready">
                            <p className="start-line">6시간마다 한 번 참여할 수 있는 사다리</p>
                            <p className="start-title">구해줘 홍여사 사다리 이벤트</p>
                            <p className="start-subtitle">포인트와 다양한 보상 지급!</p>
                            {remainingTime > 0 ? (
                                <div className="start-wait">
                                    <p>다음 참여까지</p>
                                    <p>{formatTime(remainingTime)}</p>
                                </div>
                            ) : (
                                <button className="start-button" onClick={handleStart}>사다리 시작하기</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {showPopup && checknum >= 0 && (
                <ResultPopup
                    open={true}
                    checknum={checknum}
                    onClose={handleResultPopupClose}
                    onNavigatePoint={() => navigate('/Mobileconfigcontent', { state: { NAME: CONFIGMOVE.POINTCONFIG, TYPE: "" } })}
                    imageDB={imageDB}
                    getFontSize={getFontSize}
                />
            )}
        </div>
    );
};

export default LadderGame;
