import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoPerson } from "react-icons/io5";

/**
 * 프로필 사진.
 *
 * 사진이 없거나 주소가 깨지면 기본 그림으로 떨어진다.
 * 기본 그림은 사람 아이콘이다. 예전에는 홍여사 캐릭터(HongAvatar)를 썼는데
 * 서비스 로고와 같은 그림이라 사람마다 로고가 박힌 것처럼 보였다. (형 지시 2026-08-20)
 *
 * 대화방·대화목록·사람찾기·내 정보·통화화면이 모두 이 컴포넌트를 쓴다 — 여기만 바꾸면 전부 같이 바뀐다.
 */
const Circle = styled.div`
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: #F1F1F4;
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
        : <IoPerson size={Math.round(size * 0.52)} color="#BDBDC2" />}
    </Circle>
  );
};

export default ChatprofileImage;
