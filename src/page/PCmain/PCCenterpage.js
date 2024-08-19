import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import PCCentercontainer from "../../container/PCmain/PCCentercontainer";
import PCEventcontainer from "../../container/PCmain/PCEventcontainer";
import PCEventdetailcontainer from "../../container/PCmain/PCEventdetailcontainer";
import PCLogincontainer from "../../container/PCmain/PCLogincontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import PCPolicycontainer from "../../container/PCmain/PCPolicycontainer";
import { UserContext } from "../../context/User";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { PCMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCCenterpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  console.log("TCL: PCPolicypage -> state", location);
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

    <PCLayout main={true} name={""} height={80}>
        <PCCentercontainer  TYPE={location.state.CENTERTYPE} />
    </PCLayout>
  );

}

export default PCCenterpage;

