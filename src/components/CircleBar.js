import React from 'react';
import styled from 'styled-components';
import { Row } from '../common/Row';
import { getFontSize } from '../utility/fontsize';

const Svg = styled.svg`
  transform: rotate(-90deg);
`;

const BackgroundCircle = styled.circle`
  stroke: #e5e7eb;
  fill: none;
`;

const ProgressCircle = styled.circle`
  stroke: url(#gradient);
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.4s ease;
`;

const CenterText = styled.text`
  font-size: ${() => getFontSize(18)}px;
  fill: #111827;
  font-family:Pretendard-SemiBold;

`;

const GradientCircleBar = ({ percentage, size = 80 }) => {
    const strokeWidth = 8; // 고정 두께
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <Svg width={size} height={size}>
            <defs>
                <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
            </defs>

            <BackgroundCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
            />
            <ProgressCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
          
                <CenterText
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    transform={`rotate(90, ${size/2}, ${size/2})`}
                  >
                
                    {percentage}%
                </CenterText>

            
       
        </Svg>
    );
};
export default GradientCircleBar;

