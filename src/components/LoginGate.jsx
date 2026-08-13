import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

/**
 * 둘러보기 중인 사람이 로그인이 필요한 걸 눌렀을 때 (형 리뷰 2026-08-13).
 *
 * 아무 말 없이 로그인 화면으로 튕기면 왜 튕겼는지 모른다.
 * 무엇 때문에 로그인이 필요한지 알려주고, 계속 둘러볼 수도 있게 둔다.
 */

const fadein = keyframes`from{opacity:0}to{opacity:1}`;
const popup = keyframes`from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}`;

const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1500;
  background: rgba(19,19,19,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  animation: ${fadein} .18s ease-out;
`;
const Box = styled.div`
  width: 100%;
  max-width: 340px;
  background: var(--surface);
  border-radius: 16px;
  padding: 26px 22px 18px;
  animation: ${popup} .2s cubic-bezier(.22,1,.36,1);
`;
const Title = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.5;
  text-align: center;
  word-break: keep-all;
`;
const Desc = styled.div`
  font-size: 15px;
  color: var(--text-sub);
  line-height: 1.6;
  text-align: center;
  margin-top: 10px;
`;
const Actions = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Primary = styled.button`
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #FF4E19;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  &:active { opacity: .85; }
`;
const Ghost = styled.button`
  height: 46px;
  border: none;
  background: none;
  color: var(--text-sub);
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;
`;

const LoginGate = ({ reason, onClose }) => {
  const navigate = useNavigate();
  if (!reason) return null;

  return (
    <Dim onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <Box>
        <Title>{reason}</Title>
        <Desc>로그인하시면 이어서 하실 수 있어요.</Desc>
        <Actions>
          <Primary onClick={() => navigate("/Mobilelogin")}>로그인하기</Primary>
          <Ghost onClick={onClose}>계속 둘러보기</Ghost>
        </Actions>
      </Box>
    </Dim>
  );
};

export default LoginGate;
