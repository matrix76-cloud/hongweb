import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import PCCommunitycontainer from "../../container/PCmain/PCCommunitycontainer";
import PCCommunityreadcontainer from "../../container/PCmain/PCCommunityreadcontainer";

import PCCommunitywritecontainer from "../../container/PCmain/PCCommunitywritecontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import { UserContext } from "../../context/User";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCCommunityreadpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const {state} = useLocation();
  console.log("TCL: PCCommunityreadpage -> state", state)
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  
 
  return (

    <PCLayout main={false} name={PCMAINMENU.COMMUNITYMENU}>
        <PCCommunityreadcontainer COMMUNITY_ID={state.COMMUNITY_ID} COMMUNITYSUMMARY_ID={state.COMMUNITYSUMMARY_ID}/>
    </PCLayout>
  );

}

export default PCCommunityreadpage;

