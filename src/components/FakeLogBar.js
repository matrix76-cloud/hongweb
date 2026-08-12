import React, { useEffect, useState } from 'react';
import './ladder.css'; // 스타일 함께 포함

const fakeNames = ['김**', '이**', '박**', '최**', '정**', '한**', '유**'];
const fakeResults = ['1,000P', '5,000P', '쿠폰', '1,000P'];

const generateFakeLog = () => {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const result = fakeResults[Math.floor(Math.random() * fakeResults.length)];
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    return `${name}님이 ${hour}:${minute}에 ${result}에 당첨!`;
};

const FakeLogBar = () => {
    const [log, setLog] = useState(generateFakeLog());

    useEffect(() => {
        const interval = setInterval(() => {
            setLog(generateFakeLog());
        }, 7000); // 7초마다 갱신
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fake-log-bar">
            <span>📢 {log}</span>
        </div>
    );
};

export default FakeLogBar;
