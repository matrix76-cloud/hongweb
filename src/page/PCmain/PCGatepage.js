import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import PCGatecontainer from "../../container/PCmain/PCGatecontainer";

import { UserContext } from "../../context/User";
import PCGateLayout from "../../screen/LayoutPC/Layout/PCGateLayout";
import { Helmet } from "react-helmet";



const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCGatepage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <>
    <Helmet>
    <title>구해줘 알바</title>
        <meta name="description" content="AI 이미지와 자기소개 영상으로 신뢰도 높은 매칭. 심부름, 집안일, 돌봄까지! 동네에서 가장 빠르게 해결해드립니다." />
    <link rel="canonical" href="https://honglady.co.kr/" />
    </Helmet>
    <PCGateLayout  height={120}>
    <PCGatecontainer/>
    </PCGateLayout>
  
    </>

  );

}

export default PCGatepage;

