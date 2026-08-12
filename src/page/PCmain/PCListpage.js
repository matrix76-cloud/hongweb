import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import PCListcontainer from "../../container/PCmain/PCListcontainer";


import { UserContext } from "../../context/User";


import PCGateLayout from "../../screen/LayoutPC/Layout/PCGateLayout";
import { Helmet } from "react-helmet";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCListpage =() =>  {

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

 

 
  return (
    <>
      <Helmet>
      <title>도움요청</title>
      <meta name="description" content="구해줘 알바에 도움요청 해보세요 도움이 필요한 모든 집안일을 동네 일꾼에게 부탁해보세여" />
      <link rel="canonical" href="https://honglady.com/PClist" />
      </Helmet>
      <PCGateLayout main={true} name={""} height={80}>
        <PCListcontainer/>
      </PCGateLayout>
    </>
  );

}

export default PCListpage;

