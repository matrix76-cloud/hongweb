import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { imageDB } from "../utility/imageData"; // 🔥 불꽃 이미지 여기서 가져옴

// 줄 애니메이션
const sweepX = keyframes`
  0% { transform: translateX(-100%); opacity: 0.3; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

// 불꽃 이동 애니메이션
const flameFly = keyframes`
  0% {
    transform: translateX(0px) translateY(-50%);
  }
  100% {
    transform: translateX(600px) translateY(-50%);
  }
`;

const GlowLine = styled.div`
  position: absolute;
  left: 0;
  height: 6px;
  width: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0.2), #ff6600, rgba(255,255,255,0.2));
  animation: ${sweepX} 0.5s ease-out forwards;
  pointer-events: none;
  z-index: 999;
`;

const RowFlameImage = styled.img`
  position: absolute;
  top: 50%;
  left: 0;
  width: 80px;
  height: auto;
  transform: translateY(-50%);
  animation: ${flameFly} 0.6s ease-out forwards;
  pointer-events: none;
  z-index: 1000;
`;

const RowGlowEffect = ({ targetRef, trigger }) => {
    const [topPos, setTopPos] = useState(null);

    useEffect(() => {
        if (trigger && targetRef?.current) {
            const rect = targetRef.current.getBoundingClientRect();
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            setTopPos(rect.top + scrollY);
        }
    }, [trigger, targetRef]);

    if (!trigger || topPos === null) return null;

    return (
        <>
            <GlowLine style={{ top: `${topPos}px` }} />
            {/* <RowFlameImage
                src={imageDB.fire} // 🔥 기존에 쓰던 불꽃 이미지 사용
                style={{ top: `${topPos}px` }}
            /> */}
        </>
    );
};

export default RowGlowEffect;
