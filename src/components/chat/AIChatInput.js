// components/ai-friend/AIChatInput.js

import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../../utility/fontsize';
import { IoSend } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

// 🎙️ 추가

import { COLORS } from '../../utility/colors';
import VoiceDictateButton from '../../common/VoiceDictateButton';

const AIChatInput = ({ message, setMessage, _handlesend, isBlocked, isAITyping }) => {
  const inputRef = useRef(null);

  const handleResize = (e) => {
    // input이라 실제 높이 변경 필요는 없지만, 호환성 위해 남겨둠
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = () => {
    if (isBlocked) return;
    _handlesend();
    // 키보드 유지 위해 다시 포커스
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // 커서 위치(또는 선택 영역)에 음성 텍스트 삽입
  const insertAtCursor = (frag, { addSpace = true } = {}) => {
    const el = inputRef.current;
    if (!el) return;

    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;

    const before = message.slice(0, start);
    const after = message.slice(end);
    const insert = addSpace && before && !/\s$/.test(before) ? ` ${frag}` : frag;

    const next = before + insert + after;
    setMessage(next);

    const caret = (before + insert).length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  // 과도 렌더 방지용 120ms 디바운스 (partial 전용)
  const debouncedInsert = useMemo(() => {
    let t;
    return (s) => {
      clearTimeout(t);
      t = setTimeout(() => insertAtCursor(s, { addSpace: false }), 120);
    };
  }, [message]);

  // STT 콜백
  const handlePartial = (t) => debouncedInsert(t);
  const handleFinal = (t) => {
    insertAtCursor(t.trim(), { addSpace: true });
    // 🔽 최종 인식 후 자동 전송 원하면 주석 해제
    // setTimeout(() => { if ((inputRef.current?.value || '').trim()) handleSend(); }, 80);
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
          ref={inputRef}
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

        <RightGroup>
          {/* 🎤 음성 버튼: 네이버 스타일 토글 */}
          {/* <GhostMic>
          <VoiceDictateButton
            mode="toggle"
            size={36}
            color={COLORS?.primary || '#6e32f2'}
            onPartial={handlePartial}
            onFinal={handleFinal}
            />
          </GhostMic> */}

          <SendButton onClick={handleSend} aria-label="전송">
            <IoSend size={22} color="#fff" />
          </SendButton>
        </RightGroup>
      </InputWrapper>
    </BottomInputBar>
  );
};

export default AIChatInput;



const GhostMic = styled.div`
  /* 버튼 배경 완전 제거 */
  & > div {
    background: none !important; /* 완전 투명 */
    border: 1px solid rgba(255,255,255,.28) !important;
    color: #fff !important;
    box-shadow: none !important; /* 혹시 그림자 있으면 제거 */
  }

  /* 듣는 중 스타일 */
  & > div[aria-label="음성 입력 종료"] {
    background: ${COLORS?.primary || '#6e32f2'} !important;
    border-color: ${COLORS?.primary || '#6e32f2'} !important;
    color: #fff !important;
  }

  /* iOS에서 반투명/블러 유지 보조 */
  will-change: transform, opacity;
  -webkit-tap-highlight-color: transparent;
`;

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

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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
