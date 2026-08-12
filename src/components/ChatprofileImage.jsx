import React, { useEffect, useState } from "react";
import styled from "styled-components";

/**
 * 대화 상대 프로필. (형 지시 2026-08-12)
 *
 * 사진이 없거나 주소가 깨지면 기본 이미지로 떨어진다.
 * 기본 이미지는 아이콘을 가운데 띄우는 방식 대신, 사람 실루엣이 원을 꽉 채우는
 * 흔한 형태로 직접 그린다 — 작은 크기(36px)에서도 허전해 보이지 않는다.
 *
 * 목록·대화방 모두 이 컴포넌트를 쓰므로 여기만 바꾸면 전부 같이 바뀐다.
 */
const Circle = styled.div`
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: #E4E4E7;
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

// 머리와 어깨가 원에 맞물리는 기본 실루엣
const DefaultFace = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="18" r="8.4" fill="#FFFFFF" />
    <path
      d="M24 29c-8.4 0-15 4.9-15 11.2V48h30v-7.8C39 33.9 32.4 29 24 29z"
      fill="#FFFFFF"
    />
  </svg>
);

const ChatprofileImage = ({ containerStyle, source, size = 46 }) => {
  const [failed, setFailed] = useState(false);

  // 주소가 바뀌면 다시 시도한다
  useEffect(() => { setFailed(false); }, [source]);

  const ok = !!source && String(source).trim() !== "" && !failed;

  return (
    <Circle style={containerStyle} $size={size}>
      {ok
        ? <Img src={source} alt="" onError={() => setFailed(true)} />
        : <DefaultFace size={size} />}
    </Circle>
  );
};

export default ChatprofileImage;
