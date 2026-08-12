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

import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";




import { GrUploadOption } from "react-icons/gr";
import LottieAnimation from "../common/LottieAnimation";
import TypingText from "../common/TypingText";
import { LoadingAnimationStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { CiSearch } from "react-icons/ci";
import ButtonEx from "../common/ButtonEx";
import MobileSearchMemo from "../modal/MobileSearchMemo";
import { DeleteCATEGORYCONTENTByid, ReadCATEGORYCONTENTBYCATEGORYCONTENT_ID, UpdateCATEGORYCONTENTMEMOByid } from "../service/CategoryService";
import KakaoShare from "./KakaoShare";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { getFontSize } from '../utility/fontsize';
const formatter = buildFormatter(koreanStrings); 


const MobileResultContent = {
  width: '90%',
  height: '100vh',
  padding: '0px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",

}

const BottomLayer = styled.div`
  position: fixed;
  bottom: 0px;
  height : 70px;
  width : 100%;
  background : #fff;
  z-index : 2;
  display : flex;
  flex-direction : row;
  align-items: center;
  justify-content :center;
  margin-left:10px;
`

const AddButton = styled.div`
  margin-right:10px;
  margin-left:10px;
  height: 38px;
  width: 33%;
  border-radius :10px;
  background: #ff7e19;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard-Bold';
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

`
const DelButton = styled.div`
  margin-left:10px;
  height: 38px;
  width: 33%;
  border-radius :10px;
  background: #999;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard-Bold';
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  font-size: ${() => getFontSize(16)}px;

`

const MobileAiCategoryContentView = ({CATEGORYCONTENT_ID}) =>{
  const { dispatch, user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(-1);
  const [memopopup, setMemopopup] = useState(false);
  const [item, setItem] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    setLoading(loading);
    setMemopopup(memopopup);
    setItem(item);

  }, [refresh]);





  async function FetchData(){
    const itemTmp = await ReadCATEGORYCONTENTBYCATEGORYCONTENT_ID({ CATEGORYCONTENT_ID });
    setItem(itemTmp);
    setRefresh((refresh) => refresh + 1);
  }
  /**
   * 데이타를 가져온다
   * 1) 무조건 데이타를 가져 와서 저장 해둔다
   * 2) 검색어가 있다면 zemini에 요청한다
   * 3) 검색 결과를 searchresult 에 저장 해두고 데이타 베이스에 입력한다
   * 4) 검색어가 없다면 처음에 가져온 데이타에서 첫번째 인덱스 값을 보여준다 
   */
  useEffect(() =>{

    FetchData();

  }, [])

  
  const _handleInstall = () => {
    window.location.href = "https://honglady.co.kr";
  }

  return (
    <Column style={{ width: '100%', margin: '0 auto' }}>
      
      <Row style={{ margin: "20px 0px" }} onClick={_handleInstall}>
        <div>
          <img src={imageDB.logo} style={{ width: 30 }} />
        </div>
        <div style={{marginLeft:10, fontSize: () => getFontSize(14)}}>동네에서 가장 일잘하는 <span style={{fontSize: () => getFontSize(18), fontFamily:"Pretendard-SemiBold", color:"#ff7e19"}}>구해줘 동네 알바</span></div>
      </Row>

      <div style={{ fontFamily: "Pretendard-SemiBold",margin: "10px 0px",textDecoration: "underline"}}>{item.KEYWORD} 에 대한 AI 검색결과</div>

      <textarea value ={item.CONTENT} style={MobileResultContent}></textarea>
    </Column> 
  );
};

export default MobileAiCategoryContentView;