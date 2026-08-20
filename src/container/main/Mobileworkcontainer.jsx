import React, { Component, createRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { ReadWork, ReadWorkByIndividually } from "../../service/WorkService";

import { DataContext } from "../../context/Data";
import "./Mobilemap.css"
import { useSleep } from "../../utility/common";
import { FILTERITMETYPE, PCMAINMENU } from "../../utility/screen";
import { setRef } from "@mui/material";
import { REQUESTINFO } from "../../utility/work";
import { Column } from "../../common/Column";
import MobileWorkReport from "../../components/MobileWorkReport";
import LottieAnimation from "../../common/LottieAnimation";


const Container = styled.div`
    /* max-height:1000px 이 있어서 내용이 길면 그 아래로 배경이 안 칠해졌다 (형 리뷰 2026-08-13) */
    /* 일감 상세는 카드가 아니라 한 장짜리 화면이라 회색 바탕이 붕 떠 보였다 — 흰색으로 */
    background: var(--surface);
    min-height: 100vh;
    box-sizing: border-box;
`

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
// kakao 는 전역(window.kakao)을 참조 시점에 읽는다.
// 최상단에서 구조분해하면 SDK 로드 전 undefined 로 굳는다 (Vite=ES모듈, 2026-08-12)




const MobileWorkcontainer =({containerStyle, WORK_ID, TYPE, FROMCHAT}) =>  {
console.log("TCL: MobileWorkcontainer -> TYPE", TYPE)
console.log("TCL: MobileWorkcontainer -> WORK_ID", WORK_ID)

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [worktype, setWorktype] = useState('');
  const [workstatus, setWorkstatus] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setLoading(loading);
    setMessages(messages);
    setWorktype(worktype);
    setWorkstatus(workstatus);
 
  },[refresh])


  useEffect(()=>{
    async function FetchData(){
      const workitem = await ReadWorkByIndividually({WORK_ID});
      console.log("TCL: FetchData -> workitem", workitem)

      setMessages(workitem.WORK_INFO);
      setWorktype(workitem.WORKTYPE);
      setWorkstatus(workitem.WORK_STATUS);
      setLoading(false);
      setRefresh((refresh) => refresh +1);

      console.log("TCL: FetchData -> workitem", workitem);      
    } 
    FetchData();
  }, [])


  return (

    
    <Container style={containerStyle}>
    {
      loading == true ? ( <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}
        />) :( <Column>
          {/* 안내 한 줄 대신 요약 헤더를 MobileWorkReport 안에서 보여준다 (형 리뷰 2026-08-13) */}
          <div style={{height: 62}} />
          <MobileWorkReport messages={messages} WORK_ID = {WORK_ID} WORKTYPE={worktype} WORK_STATUS={workstatus} FROMCHAT={FROMCHAT}/>
        </Column>)
    } 
    </Container>
  );

}

export default MobileWorkcontainer;

