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
  padding: 0 16px;

`


const Title = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  color: #222;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-size:  ${() => getFontSize(16)}px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
`;

const Content = styled.div`
  font-size:  ${() => getFontSize(15)}px;
  white-space: pre-line;
  line-height:2;
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px dashed #ddd;
`;

const DayCard = styled.div`
  background-color: #fff1db;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;
// color: ${ ({ color }) => color || '#333' };
const DayLabel = styled.div`
  font-weight: 600;
  font-size: 16px;
  color :#131313;
  margin-bottom: 8px;
`;

const DayText = styled.div`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`;


const QuoteBox = styled.div`
  background-color: #fff6e9;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  margin-bottom:20px;
  font-size: ${() => getFontSize(14)}px;
  color: #444;
  line-height: 2;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const QuoteLabel = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: ${() => getFontSize(15)}px;
  color: #666;
  &::before {
    content: '💬 ';
  }
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
      <Title>마루이모의 주간 운세 ✨</Title>

      <Section>
        <Label>한 주 요약</Label>
        <Content>{summary}</Content>
      </Section>

      <Divider />

      {days.map((day) => (
        <DayCard key={day.label}>
          <DayLabel color={day.color}>{day.label}</DayLabel>
          <DayText>{day.value}</DayText>
        </DayCard>
      ))}

      <Divider />

      <Section>
        <Label>주의할 점</Label>
        <Content>{caution}</Content>
      </Section>

      <Section>
        <Label>집중하면 좋은 흐름</Label>
        <Content>{focus}</Content>
      </Section>

      <Divider />
      <QuoteBox>
        <QuoteLabel>마루이모의 주간 한마디</QuoteLabel>
        <div>{quote}</div>
      </QuoteBox>
    </Container>
  );
};
