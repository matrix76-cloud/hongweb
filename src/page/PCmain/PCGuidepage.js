import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';


import { UserContext } from "../../context/User";
import PCGateLayout from "../../screen/LayoutPC/Layout/PCGateLayout";
import { Helmet } from "react-helmet";
import PCGuidecontainer from "../../container/PCmain/PCGuidecontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCGuidepage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  console.log("TCL: PCPolicypage -> state", location);
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

 
  return (
    <>
      <Helmet>
      <title>알아보기</title>
      <meta name="description" content="구해줘 알바에 알아보아요" />
      <link rel="canonical" href="https://honglady.com/PCGuideInfo" />
      </Helmet>
      <PCGateLayout  height={120}>
      <PCGuidecontainer />
      </PCGateLayout>
    </>

  );

}

export default PCGuidepage;

