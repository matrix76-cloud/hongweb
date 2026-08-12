import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';

const HEADER_HEIGHT = 64;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #ffff;


`

export const WeeklyHoroscopePageWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #a786ff 0%, #3a2e70 100%);
  padding: 32px 20px 80px;
  color: #f3f1ff;
  font-family: 'Pretendard-Regular';
`;

export const DateText = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: #e3dcff;
  margin-bottom: 8px;
`;

export const Title = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-family: 'Pretendard-Bold';
  color: #ffffff;
  margin-bottom: 24px;
`;

export const Summary = styled.div`
  margin-bottom: 24px;
  line-height: 1.7;
  color: #f3f1ff;
`;

export const DayCard = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
`;

export const DayTitle = styled.div`
  font-weight: 600;
  color: #fdf2ff;
  font-size: ${() => getFontSize(16)}px;
  margin-bottom: 8px;
`;

export const DayContent = styled.div`
  line-height: 1.6;
  font-size: ${() => getFontSize(15)}px;
`;

export const WeeklyNoteTitle = styled.div`
  margin-top: 28px;
  font-weight: bold;
  font-size: ${() => getFontSize(16)}px;
  color: #ffe9ff;
`;

export const WeeklyNoteBubble = styled.div`
  margin-top: 12px;
  background: rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 14px 18px;
  color: #f0e7ff;
  font-style: italic;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
  line-height: 2;
  font-size: ${() => getFontSize(15)}px;
`;

export const MobileFortuneWeeklyDetail = ({ data }) => {
  if (!data) return null;

  const {
    summary,
    mon, tue, wed, thu, fri, sat, sun,
    caution,
    focus,
    quote
  } = data;

  const days = [
    { label: '월요일', value: mon, color: '#4DB6AC' },   // 청록
    { label: '화요일', value: tue, color: '#FFB74D' },   // 오렌지
    { label: '수요일', value: wed, color: '#BA68C8' },   // 연보라
    { label: '목요일', value: thu, color: '#81C784' },   // 연초록
    { label: '금요일', value: fri, color: '#F06292' },   // 핑크
    { label: '토요일', value: sat, color: '#FFD54F' },   // 노랑
    { label: '일요일', value: sun, color: '#90A4AE' },   // 회색
  ];

  return (
    <Container>
      <WeeklyHoroscopePageWrapper>
        <Title>마루이모의 주간 운세 ✨</Title>

      
        <Summary>{summary}</Summary>

    
        {/* {days.map((day) => (
          <DayCard key={day.label}>
            <DayTitle>{day.label}</DayTitle>
            <DayContent>{day.value}</DayContent>
          </DayCard>
        ))} */}

        <WeeklyNoteTitle>주의할 점</WeeklyNoteTitle>
        <WeeklyNoteBubble>{caution}</WeeklyNoteBubble>
    
          <WeeklyNoteTitle>마루이모의 주간 한마디</WeeklyNoteTitle>
        <WeeklyNoteBubble>{quote}</WeeklyNoteBubble>
     

      </WeeklyHoroscopePageWrapper>

    </Container>
  );
};
