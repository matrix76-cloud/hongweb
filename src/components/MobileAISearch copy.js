import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { Column, FlexstartColumn } from "../common/Column";

import { imageDB } from "../utility/imageData";

import { se } from "date-fns/locale";

import { model } from "../api/config";
import Loading from "../components/Loading";
import { removeSymbols, useSleep } from "../utility/common";

import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import LottieAnimation from "../common/LottieAnimation";
import TypingText from "../common/TypingText";
import { LoadingAnimationStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { CiSearch } from "react-icons/ci";
import ButtonEx from "../common/ButtonEx";
import { useNavigate } from "react-router-dom";
import MobileCategoryFilter from "../modal/MobileCategoryFilter";
import { CreateCategoryContent } from "../service/CategoryService";
import { UserContext } from "../context/User";
import { FaArrowRight } from "react-icons/fa";
import IconButton from "../common/IconButton";
import { CreateRecipe } from "../service/RecipeService";
import { BsHouseAdd } from "react-icons/bs";
import { getFontSize } from '../utility/fontsize';
const formatter = buildFormatter(koreanStrings); 






const Popcontent = styled.div`
    height:100%;
    width:100%;
    font-family: 'Pretendard-Regular';
    margin-bottom:100px;
`


const ResultLayer = styled.div`
  width:100%;

`
const ResultContent = {
  width: "80%",
  margin: "0px auto",
  height: "900px",
  padding: "80px 20px 20px 20px",
  fontSize: "16px",
  fontFamily: "Pretendard-SemiBold",
  lineHeight: 2,
  outline: "none",
  resize: "none",
  border: "none",
  backgroundColor: "#fff"
}

const InputContent = {
  width:'80%',
  margin:'30px auto',
  borderRadius: '5px',
  fontFamily: 'Pretendard-Regular',
  flex: '0 0 auto',
  height: '30px',
  border: 'none',
  borderRadius: '10px',
  background:'#f4f4f4',
  paddingLeft:'30px'
}


const SearchIcon = styled.div`
  background: #00000057;
  width: 20%;
  margin: 200px auto;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;


`

const MobileResultContent = {
  width: '90%',
  height: '580px',
  padding: '0px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",

}

const InfoLayer = styled.div`
  background: #fcc81c57;
  width: 90%;
  margin: 0 auto;


`
const InfoLayerContent = styled.div`
  padding: 20px;
  font-size: ${() => getFontSize(14)}px;
  line-height:2;
`
const listTag ={
  listStyleType: 'disc',
  listStylePosition: 'inside',
}

const AIstyle = `

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:15px;

}

/* 검색 바 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  height: 25px;
  width: 80%;
}

/* 검색 아이콘 */
.search-icon {
  font-size: ${() => getFontSize(18)}px;
  margin-right: 10px;
  color: rgba(255, 255, 255, 0.7); /* 흰색 아이콘 */
}

/* 입력 필드 */
.search-input {
  border: none;
  outline: none;
  background: transparent;
  color: white; /* 텍스트 색상 */
  font-size: ${() => getFontSize(18)}px;
  width: 100%;
  caret-color: white; /* 커서 색상 */
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7); /* 플레이스홀더 색상 */
  font-size: ${() => getFontSize(16)}px;
}


`
const Infostyle = `


.gradient-background {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #6000FF;;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
}

/* 내용 상자 */
.content-box {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    width: 95%;
    margin-top: 20px;
}
  
}

/* 아이콘 스타일 */
.icon-container {
    font-size: ${() => getFontSize(30)}px;
    margin-bottom: 20px;
}


/* 리스트 */
.content-box ul {
    list-style-type: disc; 
    padding: 0;
    margin: 0;
}

.content-box ul li {
  margin-bottom: 10px;
  font-size: ${() => getFontSize(12)}px;
  margin-left:20px;
  color: #ddd; /* 흐린 텍스트 색상 */
}

/* 하단 텍스트 */
.content-box p {
    margin-top: 20px;
    font-size: ${() => getFontSize(12)}px;
    color: #ddd; /* 흐린 텍스트 색상 */
}
`


// components/MobileAISearch.jsx

import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Column } from "../common/Column";
import { Row } from "../common/Row";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";
import { model } from "../api/config";
import { removeSymbols } from "../utility/common";
import HongButton from "./HongButton";
import { getFontSize } from "../utility/fontsize";

const MobileAISearch = ({ onClose }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [research, setResearch] = useState("");
  const [loading, setLoading] = useState(false);

  const AIResearch = async () => {
    if (!research.trim()) return;
    setLoading(true);

    try {
      const USER_ID = user?.USERS_ID;
      const result = await model.generateContent(research);
      const response = result.response;
      const text = response.text();

      navigate("/Mobileairesult", {
        state: {
          result: removeSymbols(text),
          research: research,
        },
      });
    } catch (e) {
      console.error("AIResearch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      AIResearch();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }, []);

  return (
    <Wrapper>
      <InputContainer>
        <SearchInput
          ref={inputRef}
          value={research}
          onChange={(e) => setResearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AI에게 물어보세요..."
        />
        <AskButton onClick={AIResearch} disabled={loading}>
          {loading ? "검색중..." : "질문하기"}
        </AskButton>
      </InputContainer>

      <Tips>
        <strong>예시:</strong>
        <ul>
          <li>아이 성장에 도움이 되는 음식</li>
          <li>면접에서 자주 나오는 질문은?</li>
          <li>조선왕조 500년을 요약해줘</li>
        </ul>
      </Tips>

      <CloseRow>
        <HongButton onClick={onClose}>닫기</HongButton>
      </CloseRow>
    </Wrapper>
  );
};

export default MobileAISearch;
