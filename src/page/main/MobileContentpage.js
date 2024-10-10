import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileChatcontainer from "../../container/main/MobileChatcontainer";
import MobileContentcontainer from "../../container/main/MobileContentcontainer";

import PCChatcontainer from "../../container/PCmain/PCChatcontainer";

import { UserContext } from "../../context/User";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import PCChatLayout from "../../screen/LayoutPC/Layout/PCChatLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileContentpage =() =>  {

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

    <MobileCommunityLayout name={location.state.NAME + ' 님과 대화'} type={MOBILEMAINMENU.CHATMENU}>
        <MobileContentcontainer ITEM ={location.state.ITEM} OWNER={location.state.OWNER} LEFTIMAGE={location.state.LEFTIMAGE}
        LEFTNAME= {location.state.LEFTNAME}/>
    </MobileCommunityLayout>
  )

}

export default MobileContentpage;

