import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileChatcontainer from "../../container/main/MobileChatcontainer";
import MobileContactWritecontainer from "../../container/main/MobileContactWritecontainer";
import MobileContentcontainer from "../../container/main/MobileContentcontainer";



import { UserContext } from "../../context/User";

import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import MobileContactLayout from "../../screen/Layout/Layout/MobileContactLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileContactWritepage =() =>  {

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

    <MobileContactLayout name={location.state.NAME + ' 님과 계약서'} type={MOBILEMAINMENU.CHATMENU}>
        {/* <MobileContactWritecontainer ID ={location.state.ID}
         messages={location.state.messages}
         OWNER_ID={location.state.OWNER_ID}
         CHAT_ID={location.state.CHAT_ID}
         SUPPORTER_ID = {location.state.SUPPORTER_ID}
         NAME={location.state.NAME}
         LEFTNAME={location.state.LEFTNAME}
        RIGHTNAME={location.state.RIGHTNAME}
        WORKTYPE={location.state.WORKTYPE}
        
        /> */}
    </MobileContactLayout>
  )

}

export default MobileContactWritepage;

