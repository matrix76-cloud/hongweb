// SafeAreaTestPage.jsx
import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';

const HEADER_HEIGHT = 64;

const LayoutWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fefefe;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: ${HEADER_HEIGHT}px;
  padding-top: env(safe-area-inset-top);
  background-color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${() => getFontSize(18)}px;
  font-family: Pretendard-Bold;
`;

const ScrollContent = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f9fafb;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-Regular;
`;

const SafeAreaTestPage = () => {
    return (
        <LayoutWrapper>
            <FixedHeader>
                ✅ SafeArea 테스트용 헤더 (고정)
            </FixedHeader>

            <ScrollContent>
                {[...Array(10)].map((_, i) => (
                    <Card key={i}>스크롤 카드 {i + 1}</Card>
                ))}
            </ScrollContent>
        </LayoutWrapper>
    );
};

export default SafeAreaTestPage;
