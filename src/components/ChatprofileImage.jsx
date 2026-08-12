import React from "react";
import styled from "styled-components";
import { IoPerson } from "react-icons/io5";

/**
 * 대화 상대 프로필. (형 지시 2026-08-12 — 다시 만듦)
 *
 * 예전엔 50px 통 안에 75px 이미지를 넣고 태그를 absolute 로 띄워서 다 삐져나왔다.
 * 원형으로 잘라 넣고, 사진이 없으면 앱에서 흔히 쓰는 회색 원 + 사람 아이콘을 보여준다.
 * 의뢰/지원 구분은 여기서 빼고 목록에서 이름 옆 텍스트로 보여준다.
 */
const Circle = styled.div`
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: #F1F1F3;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ChatprofileImage = ({ containerStyle, source, size = 46 }) => {
  const ok = !!source && String(source).trim() !== "";

  return (
    <Circle style={containerStyle} $size={size}>
      {ok
        ? <Img src={source} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        : <IoPerson size={Math.round(size * 0.5)} color="#BDBDC2" />}
    </Circle>
  );
};

export default ChatprofileImage;
