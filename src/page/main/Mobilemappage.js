import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import MobileMapcontainer from "../../container/main/Mobilemapcontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import { UserContext } from "../../context/User";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileMappage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  console.log("TCL: PCMappage -> location", location)
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

    <MobilePrevLayout>
        <MobileMapcontainer  ID={location.state.ID} TYPE={location.state.TYPE}  />
    </MobilePrevLayout>
  );

}

export default MobileMappage;

