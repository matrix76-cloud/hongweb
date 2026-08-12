import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  justify-content: center;
  flex-direction: column;
  align-items: center;

`;

const floatCard = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(60px);
  }
  20% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  80% {
    opacity: 1;
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    opacity: 0;
    transform: scale(1.1) translateY(-60px); // 🔼 위로 사라지듯
  }
`;

const FloatingCard = styled.img`
  position: absolute;
  width: 80px;
  opacity: 0;
  animation: ${floatCard} 6s ease-in-out infinite; // ✅ 1회만 실행
  animation-delay: ${(props) => props.delay || '0s'};
  top: ${(props) => props.top || '50%'};
  left: ${(props) => props.left || '50%'};
  pointer-events: none;
  z-index: 1;
`;

function RotateCardBasic({ items }) {
  return (
    <Container>
      {items.map((item, i) => (
        <FloatingCard
          key={i}
          src={item.image}
          top={item.top}
          left={item.left}
          delay={item.delay}
        />
      ))}
    </Container>
  );
}

export default RotateCardBasic;
