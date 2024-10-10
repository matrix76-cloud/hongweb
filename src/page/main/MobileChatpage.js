import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileChatcontainer from "../../container/main/MobileChatcontainer";

import PCChatcontainer from "../../container/PCmain/PCChatcontainer";

import { UserContext } from "../../context/User";
import MobilePrevLayout2 from "../../screen/Layout/Layout/MobileCommunityLayout";
import PCChatLayout from "../../screen/LayoutPC/Layout/PCChatLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileChatpage =() =>  {

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

    <MobilePrevLayout2 name={'채팅'} type={MOBILEMAINMENU.CHATMENU}>
        <MobileChatcontainer/>
    </MobilePrevLayout2>
  );

}

export default MobileChatpage;

