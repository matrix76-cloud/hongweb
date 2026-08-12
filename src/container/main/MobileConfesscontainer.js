import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import { Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";



import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getFontSize } from "../../utility/fontsize";
import { CURRENT_WEB_VERSION } from "../../utility/version";
import GoBallListView from "../../components/GoBallListView";

const HEADER_HEIGHT = 44;
const FOOT_HEIGHT = 65;
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;
  padding-bottom: calc(env(safe-area-inset-bottom, 0) + 24px);

`



const MobileConfesscontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  console.log("TCL: MobileConfigcontainer -> user", user);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  }, [refresh])


  

  return (
    <Container style={containerStyle}>

      <GoBallListView />

    </Container>
  );

}

export default MobileConfesscontainer;

