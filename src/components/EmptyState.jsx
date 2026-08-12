import React from "react";
import styled from "styled-components";
import { IoChatbubblesOutline } from "react-icons/io5";

/**
 * 내용이 없을 때 쓰는 공통 컴포넌트. (형 지시 2026-08-12)
 *
 * 화면마다 제각각이던 빈 상태를 여기 하나로 모은다. 아이콘만 화면에 맞게 갈아끼우고
 * 크기·색·간격은 건드리지 않는다. 예전 것은 글씨가 14px 라 작았다 → 16px.
 *
 *   <EmptyState content="대화내역이 없습니다" />
 *   <EmptyState icon={MdOutlineWork} content="등록된 일감이 없습니다" />
 */
const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-height: ${({ $height }) => $height}px;
  background-color: var(--surface);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  padding: 40px 24px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #71717a;
  text-align: center;
`;

const Sub = styled.div`
  font-size: 14px;
  color: #a3a3a3;
  text-align: center;
  margin-top: -6px;
`;

const EmptyState = ({ containerStyle, icon, content, sub, height = 260 }) => {
  const Icon = icon || IoChatbubblesOutline;

  return (
    <Container style={containerStyle} $height={height}>
      <Icon size={46} color="#D4D4D4" />
      <Text>{content}</Text>
      {sub && <Sub>{sub}</Sub>}
    </Container>
  );
};

export default EmptyState;
