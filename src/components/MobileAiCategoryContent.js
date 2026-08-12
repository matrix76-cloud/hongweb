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
import { DeleteCATEGORYCONTENTByid, UpdateCATEGORYCONTENTMEMOByid } from "../service/CategoryService";
import KakaoShare from "./KakaoShare";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;
`

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
  margin-right:5px;
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

const MobileAiCategoryContent = ({CATEGORYCONTENT_ID, CONTENT ,MEMOITEMS}) =>{
  const { dispatch, user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(-1);
  const [memopopup, setMemopopup] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    setLoading(loading);
    setMemopopup(memopopup);

  }, [refresh]);

  const _handleMemo = () =>{
    setMemopopup(true);
    setRefresh((refresh) => refresh +1);
  }

  const _handleDelete = async() => {
    const Deletedata = await DeleteCATEGORYCONTENTByid({ CATEGORYCONTENT_ID });
    navigate(-1);

  }

  const MobileMemoCallback = async(data)=>{
    const MEMO = data;
    const Updatedata = await UpdateCATEGORYCONTENTMEMOByid({CATEGORYCONTENT_ID, MEMO });
    MEMOITEMS.push(MEMO);
    setMemopopup(false);
    setRefresh((refresh) => refresh +1);
  }

  async function FetchData(){

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

  
  return (
    <Container>
      <Column style={{ width: '100%', margin: '0 auto' }}>


        {
          memopopup == true && <MobileSearchMemo callback={MobileMemoCallback} />
        }

        <textarea value={CONTENT} style={MobileResultContent}></textarea>

        {
          MEMOITEMS.map((data) => (
            <FlexstartColumn style={{ width: "90%", margin: "0 auto" }}>
              <div style={{ color: '#ff4e19', fontSize: '12px' }}>메모추가</div>
              <div style={{ fontStyle: "italic", fontSize: '14px' }}>{data}</div>
            </FlexstartColumn>

          ))
        }

        <BottomLayer>

          <AddButton onClick={_handleMemo}>메모</AddButton>
          <DelButton onClick={_handleDelete}>삭제</DelButton>


          {/* <KakaoShare height={25} width={25} text={'[구해줘 홍여사] 지식창고를 공유합니다'} url={`https://honglady.co.kr/MobileCategoryView?categorycontent_id=${CATEGORYCONTENT_ID}`} /> */}


        </BottomLayer>


      </Column> 
    </Container>

  );
};

export default MobileAiCategoryContent;