import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import moment from "moment";

import { DataContext } from "../context/Data";

import { useSelector } from "react-redux";
import { useSleep } from "../utility/common";
import { BOARDMENU, CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../utility/life";
import MobileAISearch from "./MobileAISearch";
import { GrPrevious } from "react-icons/gr";
import { imageDB } from '../utility/imageData';
import { BetweenRow, FlexEndRow } from "../common/Row";
import IconButton from "../common/IconButton";
import { getFontSize } from '../utility/fontsize';

const HEADER_HEIGHT = 40;
const FOOT_HEIGHT = 65;
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;
  padding: 0 16px;

`

const style = `

  .backgroundcontainer {
  background-image: url(${imageDB.aibg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  background-color : #140036;
  }

`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;



/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileAIsearchBoard =({containerStyle, name}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);
  const [menu, setMenu] = useState(LIFEMENU.TOUR);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{


  },[refresh])

  /**

   */
  useEffect(()=>{


  }, [])


  const _handlemain = () => {
    navigate("/Mobilelife");
  }

  const _handleCategory = () => {
    navigate("/Mobileaicategorycreate");
  }


  return (
    <>
      <style>{style}</style>
      <Container style={containerStyle} className="backgroundcontainer">

        <FlexEndRow style={{ width: "100%"}}>
          <div style={{ marginRight: 10 }}>
            <IconButton
              icon={'teacher'}
              text={'지식창고'} width={'100'} containerStyle={{
                fontSize: '16px',
                fontFamily: "Pretendard",
                marginTop:"50px",
                color: "#fff",
                background: 'transparent',
                border: '1px solid #E8E9EA',
                padding: '5px 10px',
                borderRadius: '5px',
                boxShadow: "none"
              }}
              onPress={_handleCategory} bgcolor={'#00000057'} color={'#fff'} />


          </div>
        </FlexEndRow>  

        <MobileAISearch></MobileAISearch>

      </Container>
    


    </>


  );

}

export default MobileAIsearchBoard;

