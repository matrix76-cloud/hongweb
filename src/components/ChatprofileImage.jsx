import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HongAvatar from "./HongAvatar";

/**
 * 대화 상대 프로필. (형 지시 2026-08-12)
 *
 * 사진이 없거나 주소가 깨지면 기본 이미지로 떨어진다.
 * 기본 이미지는 홍여사 캐릭터 아바타(HongAvatar) 다 — 아무 서비스나 쓰는 회색 실루엣 대신
 * 로고의 캐릭터를 그대로 쓴다. (형 리뷰 2026-08-12)
 *
 * 목록·대화방 모두 이 컴포넌트를 쓰므로 여기만 바꾸면 전부 같이 바뀐다.
 */
const Circle = styled.div`
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: #FFEDE4;
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
  const [failed, setFailed] = useState(false);

  // 주소가 바뀌면 다시 시도한다
  useEffect(() => { setFailed(false); }, [source]);

  const ok = !!source && String(source).trim() !== "" && !failed;

  return (
    <Circle style={containerStyle} $size={size}>
      {ok
        ? <Img src={source} alt="" onError={() => setFailed(true)} />
        : <HongAvatar size={size} />}
    </Circle>
  );
};

export default ChatprofileImage;
