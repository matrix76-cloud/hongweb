import React, { useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import MobileAISearch from "./MobileAISearch";
import { CiSearch } from "react-icons/ci";

const AIQuickAskBar = () => {
    const [visible, setVisible] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [question, setQuestion] = useState("");

    const [hasText, setHasText] = useState(false);


    const handleChange = (e) => {
        const value = e.target.value;
        setQuestion(value);
        setHasText(value.trim().length > 0);  // ✅ 입력값이 있으면 true
    };
    
    const open = () => {
        if (!question.trim()) return;
        setVisible(true);
        setTimeout(() => setAnimate(true), 10);
    };

    const close = () => {
        setAnimate(false);
        setTimeout(() => {
            setVisible(false);
            setQuestion("");
        }, 300);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") open();
    };

    return (
        <>
            <InputContainer hasText={hasText}>
                <CiSearch size={20} color="#888" onClick={open} style={{ cursor: "pointer" }} />
                <SearchInput
                    value={question}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus={false}  // ✅ 자동 포커스 제거
                    placeholder="집안일이나 생활 꿀팁, 궁금하신가요?"
                />
            </InputContainer>

            {visible && (
                <SearchSlideContainer className={animate ? "open" : ""}>
                    <MobileAISearch question={question} onClose={close}
                        visible={visible} // ✅ 추가
                    />
                </SearchSlideContainer>
            )}
        </>
    );
};

export default AIQuickAskBar;


const InputContainer = styled.div`
  margin: 12px auto 0px auto;
  padding: 6px 12px;
  width: 88%;
  height: 40px;

  background-color: ${({ isFocused }) => (isFocused ? "#fff" : "#f7f7f7")};
  border: 1px solid ${({ isFocused, hasText }) => (isFocused || hasText ? "#ff6b00" : "none")};
  border-radius: 8px;
  
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: ${() => getFontSize(12)}px !important;
  color: #555;
  transition: all 0.25s ease;
  height: 36px;                     // 📏 고정 높이 추가

`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: ${() => getFontSize(16)}px !important;
  color: #333;
  padding:unset;
`;

const SearchSlideContainer = styled.div`
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
  pointer-events: none;

  &.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
`;
