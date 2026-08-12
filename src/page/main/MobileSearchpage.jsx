import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileSearchcontainer from "../../container/main/MobileSearchcontainer";
import MobileWorkregistercontainer from "../../container/main/MobileWorkregistercontainer";

import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCWorkRegistercontainer from "../../container/PCmain/PCWorkRegistercontainer";

import { UserContext } from "../../context/User";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";

import { PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileSearchpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
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

  },[refresh])

  
 
  // 우측 햄버거(옛 AI 검색이력)는 뺐다 — iconname 을 넘기지 않으면 안 그린다 (형 리뷰 2026-08-12)
  return (
    <MobilePrevLayout name={'검색'} callback={'main'}>
        {/* 주소로 바로 들어오면 state 가 없다 (2026-08-12) */}
        <MobileSearchcontainer search={location.state?.search} />
    </MobilePrevLayout>

   
  );

}

export default MobileSearchpage;

