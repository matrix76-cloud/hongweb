import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import PCCommunitycontainer from "../../container/PCmain/PCCommunitycontainer";
import PCEventcontainer from "../../container/PCmain/PCEventcontainer";
import PCLogincontainer from "../../container/PCmain/PCLogincontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import PCRoomcontainer from "../../container/PCmain/PCRoomcontainer";
import PCRoomPricecontainer from "../../container/PCmain/PCRoomPricecontainer";
import { UserContext } from "../../context/User";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCRoomPricepage =() =>  {

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

    <PCLayout main={true} name={PCMAINMENU.ROOMMENU}>
        <PCRoomPricecontainer/>
    </PCLayout>
  );

}

export default PCRoomPricepage;

