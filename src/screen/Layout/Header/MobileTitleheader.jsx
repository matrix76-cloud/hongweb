import React from "react";
import styled from "styled-components";

/**
 * 제목만 있는 헤더 (좌측 정렬).
 *
 * 하단 탭이 있는 최상위 화면(채팅내역 등)은 뒤로가기가 필요 없다.
 * 뒤로 갈 곳이 탭이라서, 화살표 대신 지금 어디인지 알려주는 제목을 둔다. — 형 지시 2026-08-12
 * (MobilePrevheader 는 name 을 받아도 렌더하지 않고 화살표만 그린다)
 */
const Container = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--surface);
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-soft);
`;

const Title = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
`;

const MobileTitleheader = ({ name }) => {
  return (
    <Container id="header">
      <Title>{name}</Title>
    </Container>
  );
};

export default MobileTitleheader;
