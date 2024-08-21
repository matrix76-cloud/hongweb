import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
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

  
 
  return (
    <MobilePrevLayout iconname = {'searchmenu'}>
        <MobileSearchcontainer search={location.state.search} search_id={location.state.search_id} />
    </MobilePrevLayout>

   
  );

}

export default MobileSearchpage;

