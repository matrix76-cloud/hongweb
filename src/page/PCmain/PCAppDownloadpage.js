
import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";
import MobilePrevheader from "../../screen/Layout/Header/MobilePrevheader";
import PCAppDownloadcontainer from "../../container/PCmain/PCAppDownlaodcontainer";
import PCGateLayout from "../../screen/LayoutPC/Layout/PCGateLayout";




const Container = styled.div`
  background:#eef3fd;
  height:100vh;
`
const style = {
  display: "flex"
};

const PCAppDownloadpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <PCGateLayout main={true} name={""}  height={120}>
       <PCAppDownloadcontainer/>
    </PCGateLayout>

  
  );

}

export default PCAppDownloadpage;

