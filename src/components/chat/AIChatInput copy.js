// components/ai-friend/AIChatInput.js

import React, { useRef } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../../utility/fontsize';
import { IoSend } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

const AIChatInput = ({ message, setMessage, _handlesend, isBlocked, isAITyping }) => {
  const textareaRef = useRef(null);

  const handleResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };


  const handleSend = () => {
    _handlesend();
    // 키보드 유지 위해 다시 포커스
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 50);
  };

  return (
    <BottomInputBar>
      <InputWrapper>
        <LeftIcon>
          {isAITyping ? (
            <TypingDots><span /><span /><span /></TypingDots>
          ) : (
            <FaUserCircle size={20} color="#bbb" />
          )}
        </LeftIcon>
        <StyledInput
          type="text"
          ref={textareaRef}
          value={message}
          placeholder="메시지 입력하기"
          onChange={(e) => {
            setMessage(e.target.value);
            handleResize(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <SendButton onClick={handleSend}>
          <IoSend size={22} color="#fff" />
        </SendButton>
      </InputWrapper>
    </BottomInputBar>
  );
};

export default AIChatInput;

/* 스타일 */
const BottomInputBar = styled.div`
  position: fixed;
  bottom: 15px;
  left: 0;
  width: 100vw;
  padding: 8px env(safe-area-inset-left, 8px) env(safe-area-inset-bottom, 8px) env(safe-area-inset-right, 8px);
  background: transparent;
  z-index: 999;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 90%;
  margin: 0 auto;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
`;

const LeftIcon = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  font-size: ${() => getFontSize(15)}px !important;
  color: #fff;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const SendButton = styled.div`
  margin-left: 6px;
  background: #6e32f2;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TypingDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  span {
    width: 5px;
    height: 5px;
    background: #bbb;
    border-radius: 50%;
    animation: blink 1.4s infinite both;
  }
  span:nth-child(2) { animation-delay: 0.2s; }
  span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }
`;
