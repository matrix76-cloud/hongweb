import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Wrap = styled.div`
  position: relative;
  width: ${({ size }) => size || 36}px;
  height: ${({ size }) => size || 36}px;
  margin: 20px auto;
`;

const Rotator = styled.div`
  position: absolute;
  inset: 0;
  animation: ${spin} 1s linear infinite;
  will-change: transform;

  /* 사용자 ‘모션 줄이기’ 설정 존중 */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Dot = styled.div`
  position: absolute;
  width: ${({ dotSize }) => dotSize || 6}px;
  height: ${({ dotSize }) => dotSize || 6}px;
  background: ${({ color }) => color || "#000"};
  border-radius: 50%;
  /* 중앙 기준 배치 보정 */
  transform: translate(-50%, -50%);
`;

export default function Spinner({
    size = 36,
    dotSize = 6,
    color = "#000",
    dotCount = 8,
    duration = 1, // 회전 속도(s)
}) {
    const radius = size / 2 - dotSize / 2;

    return (
        <Wrap size={size}>
            <Rotator style={{ animationDuration: `${duration}s` }}>
                {Array.from({ length: dotCount }).map((_, i) => {
                    const angle = (2 * Math.PI * i) / dotCount; // 라디안
                    const x = size / 2 + Math.cos(angle) * radius;
                    const y = size / 2 + Math.sin(angle) * radius;
                    return (
                        <Dot
                            key={i}
                            dotSize={dotSize}
                            color={color}
                            style={{ left: `${x}px`, top: `${y}px` }}
                        />
                    );
                })}
            </Rotator>
        </Wrap>
    );
}
