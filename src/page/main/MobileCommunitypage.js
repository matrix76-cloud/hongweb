import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileCommunitycontainer from "../../container/main/MobileCommunitycontainer";
import MobileMaincontainer from "../../container/main/MobileMaincontainer";
import MobileRoomcontainer from "../../container/main/MobileRoomcontainer";

import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import { UserContext } from "../../context/User";
import MobileLayout from "../../screen/Layout/Layout/MobileLayout";
import { MOBILEMAINMENU } from "../../utility/screen";



const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileCommunityppage =() =>  {

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

    <MobileLayout registbtn ={false}  name={MOBILEMAINMENU.COMMUNITYMENU} type={MOBILEMAINMENU.COMMUNITYMENU} >
        <MobileCommunitycontainer/>
    </MobileLayout>
  );

}

export default MobileCommunityppage;

