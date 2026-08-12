// import React from 'react';
// import styled from 'styled-components';
// import { isIOS } from '../utility/fontsize';






// ✅ 마루이모 운세 전용 카드 스타일 모듈 (AI와 톤은 공유하되 감성은 분리)
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { imageDB } from '../utility/imageData';


const HEADER_HEIGHT = 64;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */

  background: linear-gradient(to bottom, #f2f8ff, #e4ecf9);  // 고정된 감성 그라데이션

`

// 🟣 전체 화면 배경 덮는 페이지 래퍼
export const HoroscopePageWrapper = styled.div`
  min-height: 100vh;
  padding: 32px 20px 80px;
  background: radial-gradient(ellipse at center, #a786ff 0%, #3a2e70 100%);
  color: #f3f1ff; // ✅ 감성 강조 흰보라로 전체 텍스트 색 조정
  font-family: 'Pretendard-Regular';
`;

export const DateText = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: #e3dcff;
  margin-bottom: 6px;
`;

export const Title = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-family: 'Pretendard-Bold';
  color: #ffffff;
  margin-bottom: 24px;
`;

export const FortuneText = styled.div`
  font-size: ${() => getFontSize(16)}px;
  line-height: 1.7;
  white-space: pre-wrap;
  color: #f3f1ff; // ✅ 본문도 부드러운 흰보라로
`;

export const QuoteBox = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 18px;
  font-style: italic;
  color: #f0e7ff; // ✅ 말풍선 안 글씨 더 은은한 보라 강조
  margin-top: 32px;
  line-height: 1.6;
  font-size: ${() => getFontSize(15)}px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
`;

export const QuoteLabel = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #fdf2ff; // ✅ 라벨은 좀 더 밝은 강조색으로
`;

export const EditLink = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
`;

export const EditButton = styled.button`
  background: #ffffff;
  color: #4e3a84;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: ${() => getFontSize(14)}px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`;

export const MobileFortuneDailyDetail = ({ date, content, onEdit, onShare, onViewArchive }) => {
  return (
  
    <Container>
      <HoroscopePageWrapper>
        <DateText>{date}</DateText>
        <Title>마루이모의 오늘의 한마디</Title>
        <FortuneText>{content.main}</FortuneText>

        {content.quote && (
          <QuoteBox>
            <QuoteLabel>💬 마루이모의 한마디</QuoteLabel>
            {content.quote}
          </QuoteBox>
        )}



        <EditLink>
          <EditButton onClick={onEdit}>정보 수정</EditButton>
        </EditLink>
      </HoroscopePageWrapper>

    </Container>


  )

};
