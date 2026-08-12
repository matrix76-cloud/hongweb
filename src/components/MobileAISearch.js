import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Column } from "../common/Column";
import { UserContext } from "../context/User";
import { model } from "../api/config";
import { removeSymbols } from "../utility/common";
import { getFontSize } from "../utility/fontsize";
import { IoChevronDownCircleOutline, IoChevronUpCircleOutline } from "react-icons/io5";
import LottieAnimation from "../common/LottieAnimation";
import { imageDB } from "../utility/imageData";

const MobileAISearch = ({ question, visible, onClose }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");

  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false); // ✅ 추가됨
  const scrollRef = useRef(null);

  const handleScrollOrClose = () => {
    if (!isScrollable || scrolledToBottom) {
      onClose();
    } else {
      scrollRef.current?.scrollBy({ top: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = box;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setScrolledToBottom(isBottom);
    };

    const checkScrollable = () => {
      const { scrollHeight, clientHeight } = box;
      setIsScrollable(scrollHeight > clientHeight); // ✅ 추가됨
    };

    box.addEventListener("scroll", handleScroll);
    checkScrollable(); // ✅ mount 시점에 한번 체크

    return () => box.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {


    const fetchAI = async () => {
      try {
        const res = await model.generateContent(question);
        const text = res.response.text();
        setResult(removeSymbols(text));
      } catch (e) {
        setResult("죄송해요. 지금은 답변이 어려워요 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [question]);

  return (
    <Wrapper>
      <AnswerBox ref={scrollRef}>
        {loading ? <LottieAnimation  animationData={imageDB.loadinglarge} />: result}
      </AnswerBox>

      <CollapseButton onClick={handleScrollOrClose}>
        {!isScrollable || scrolledToBottom
          ? <IoChevronUpCircleOutline size={28} />
          : <IoChevronDownCircleOutline size={28} />}
      </CollapseButton>
    </Wrapper>
  );
};

export default MobileAISearch;



const Wrapper = styled(Column)`
  width: 100%;
  background: #fff;
  padding: 24px 16px;
  border-top: 1px solid #eee;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const QuestionText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  font-family: Pretendard-SemiBold;
  margin-bottom: 12px;
`;

const AnswerBox = styled.div`
  width: 100%;
  min-height: 500px;
  max-height: 500px;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  font-size: ${() => getFontSize(16)}px !important;
  line-height: 1.75;
  color: #333;
  white-space: pre-line;
  overflow-y: auto;
  transition: all 0.2s ease;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  margin: 8px auto 0 auto;     // 🔽 위쪽 여백 줄임
  padding: 4px;                // 🔽 전체 패딩 줄임
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }
`;
