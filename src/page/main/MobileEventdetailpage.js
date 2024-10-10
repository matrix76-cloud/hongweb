import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import MobileEventdetailcontainer from "../../container/main/MobileEventdetailcontainer";
import PCCommunitycontainer from "../../container/PCmain/PCCommunitycontainer";
import PCEventcontainer from "../../container/PCmain/PCEventcontainer";
import PCEventdetailcontainer from "../../container/PCmain/PCEventdetailcontainer";
import PCLogincontainer from "../../container/PCmain/PCLogincontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import { UserContext } from "../../context/User";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileEventdetailpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  console.log("TCL: PCEventdetailpage -> state", location);
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

    <MobileCommunityLayout name={location.state.NAME} type={MOBILEMAINMENU.CONFIGMENU} image=''>
        <MobileEventdetailcontainer EVENTITEM={location.state.EVENTITEM} />
    </MobileCommunityLayout>
  );

}

export default MobileEventdetailpage;

