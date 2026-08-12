import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from '../utility/colors';

const rotate = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const SpinnerWrapper = styled.div`
  height: calc(100dvh - 64px); // 헤더 제외한 높이
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 38px;
  height: 38px;
  border: 6px solid #eee;
  border-top: 4px solid ${COLORS.primary}; // ✅ primary 컬러로 교체
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const ShoppingSpinner = () => {
    return (
        <SpinnerWrapper>
            <Spinner />
        </SpinnerWrapper>
    );
};

export default ShoppingSpinner;
