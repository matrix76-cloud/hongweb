import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";


import { model } from "../../api/config";
import Loading from "../../components/Loading";
import { ensureHttps, removeSymbols, useSleep } from "../../utility/common";
import { CreateSearch, DeleteSearchByid, ReadSearch, ReadSearchByid } from "../../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";

import TimeAgo from 'react-timeago';

import { FaListCheck } from "react-icons/fa6";



import { GrUploadOption } from "react-icons/gr";
import LottieAnimation from "../../common/LottieAnimation";
import TypingText from "../../common/TypingText";
import { LoadingAnimationStyle, LoadingSearchAnimationStyle } from "../../screen/css/common";
import { CiSearch } from "react-icons/ci";
import { Navigate, useNavigate } from "react-router-dom";
import MobileRecipePopup from "../../modal/MobileRecipePopup";
import MobilePicturePopup from "../../modal/MobilePicturePopup";
import { getFontSize } from "../../utility/fontsize";


const formatter = buildFormatter(koreanStrings); 



const style = {
  position: "absolute",

};

const Popcontent = styled.div`
    height:100%;
    width:100%;
    background:#ff7e19;
    font-family: 'Pretendard-Regular';
`


const ResultLayer = styled.div`
  width:100%;
  background:#FFF;
  height:100%;
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
  width:'95%',
  margin:'5px auto',
  border :'1px solid #dadada',
  borderRadius: '5px',
  backgroundColor :'#fff',
  fontFamily: 'Pretendard-Regular',
  flex: '0 0 auto',
}



const BoxItem = styled.div`
  padding: 20px;
  background: #fff;
  font-family: "Pretendard-SemiBold";
  line-height:1.5;
  color :#131313;


`  






const MobilePicturecontainer = ({item }) =>{

  const navigate = useNavigate();

  useEffect(() => {


  }, []);


  /**
   * 데이타를 가져온다
   * 1) 무조건 데이타를 가져 와서 저장 해둔다
   * 2) 검색어가 있다면 zemini에 요청한다
   * 3) 검색 결과를 searchresult 에 저장 해두고 데이타 베이스에 입력한다
   * 4) 검색어가 없다면 처음에 가져온 데이타에서 첫번째 인덱스 값을 보여준다 
   */
  useEffect(() =>{


  }, [])

  const mobilepicturepopupclose = () => {
    navigate(-1)
  }




  return (
    <div>

        <div style={{
          width: '100%',
          height: '550px',
          overflow: 'hidden'
        }}>
          <img src={ensureHttps(item.galWebImageUrl)} style={{
               maxWidth: '100%',
               height: '100%',
               objectFit: 'cover',
          }} /> 
        </div>
      
      <BoxItem>
          <div style={{fontSize: getFontSize(18),fontFamily:"Pretendard-Bold"}}>{item.galSearchKeyword}</div>
          <div style={{ fontSize: getFontSize(16), fontFamily: "Pretendard-Light",marginTop:10 }}>#{item.galPhotographyLocation}</div>
          <div style={{ fontSize: getFontSize(16), fontFamily: "Pretendard-Light", marginTop: 10 }}>#{item.galPhotographyMonth}</div>
      </BoxItem>
      
    </div>
  );
};

export default MobilePicturecontainer;