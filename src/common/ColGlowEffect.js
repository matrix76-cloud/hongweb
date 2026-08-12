import React, { useEffect, useState } from 'react';

import { imageDB } from '../utility/imageData';
import styled, { keyframes, css } from 'styled-components';

// 수직 줄 내려오는 효과
const dropEffect = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

// 불꽃 전용 애니메이션 (opacity 유지)
const flameDrop = keyframes`
  0% {
    transform: translateY(0px) translateX(-50%);
  }
  100% {
    transform: translateY(600px) translateX(-50%);
  }
`;

const FlameImage = styled.img`
  position: fixed;
  top: 80px;
  left: 0;
  width: 80px;
  height: auto;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 1000;

  ${({ leftPos }) => css`
    left: ${leftPos}px;
    animation: ${flameDrop} 0.6s ease-out forwards;
  `}
`;


const GlowColumn = styled.div`
  position: absolute;
  top: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.2), #ff9900, rgba(255,255,255,0));
  animation: ${dropEffect} 0.6s ease-out forwards;
  pointer-events: none;
  z-index: 999;
  transform: translateX(-50%);
`;



const ColGlowEffect = ({ columnIndex }) => {
    const [leftPos, setLeftPos] = useState(null);

    useEffect(() => {
        const card = document.querySelector(`#card-col-${columnIndex}`);
        if (card) {
            const rect = card.getBoundingClientRect();
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const left = rect.left + rect.width / 2 + scrollX;
            setLeftPos(left);
        }
    }, [columnIndex]);

    if (leftPos === null) return null;

    return (
        <>
            <GlowColumn style={{ left: `${leftPos}px` }} />
            {/* {typeof window !== 'undefined' &&
                document.body && (
                <FlameImage
                    leftPos={leftPos}
                    src={imageDB.fire} 
                />
                )} */}
        </>
    );
};

export default ColGlowEffect;
