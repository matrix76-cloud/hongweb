import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import MobileMapcontainer from "../../container/main/Mobilemapcontainer";
import MobileWorkcontainer from "../../container/main/Mobileworkcontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import { UserContext } from "../../context/User";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";
import MobilePrevLayout2 from "../../screen/Layout/Layout/MobileCommunityLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import MobileWorkLayout from "../../screen/Layout/Layout/MobileWorkLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileWorkpage =() =>  {

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

    <MobileWorkLayout image={location.state.WORKTYPE} name={location.state.WORKTYPE + '일감정보'} type={MOBILEMAINMENU.REGIONMENU}>
        <MobileWorkcontainer  WORK_ID={location.state.WORK_ID} TYPE={location.state.TYPE}  />
    </MobileWorkLayout>
  );

}

export default MobileWorkpage;

