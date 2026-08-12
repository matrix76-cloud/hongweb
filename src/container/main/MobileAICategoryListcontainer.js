import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';


import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";

import MobileAiCategoryList from "../../components/MobileAiCategoryList";


const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;
`




const MobileAICategoryListcontainer =({containerStyle, name}) =>  {

  return (
      <Container style={containerStyle}>
        <MobileAiCategoryList  name ={name}/>
      </Container>

  );

}

export default MobileAICategoryListcontainer;

