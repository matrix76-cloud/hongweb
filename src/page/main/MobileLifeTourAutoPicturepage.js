import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import MobileCommunityContentcontainer from "../../container/main/MobileCommunityContentcontainer";
import MobileMapcontainer from "../../container/main/Mobilemapcontainer";
import MobileWorkcontainer from "../../container/main/Mobileworkcontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import { UserContext } from "../../context/User";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";
import MobilePrevLayout2 from "../../screen/Layout/Layout/MobileCommunityLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import MobileLifeTourAutoPicturecontainer from "../../container/main/MobileLifeTourAutoPicturecontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileLifeTourAutoPicturepage =() =>  {

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
    <MobileCommunityLayout name={location.state.name} type={MOBILEMAINMENU.COMMUNITYMENU} image=''>
        <MobileLifeTourAutoPicturecontainer name={location.state.name} index={location.state.index} 
        items={location.state.items}    />
    </MobileCommunityLayout>
  );
}

export default MobileLifeTourAutoPicturepage;

