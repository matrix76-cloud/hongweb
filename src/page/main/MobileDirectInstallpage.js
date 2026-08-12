import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileSplashcontainer from "../../container/main/MobileSplashcontainer";
import { UserContext } from "../../context/User";
import MobileInstallcontainer from "../../container/main/MobileInstallcontainer";
import MobiileDirectInstallContainer from "../../container/main/MobileDirectInstallcontainer";




const Container = styled.div`

`
const style = {
  display: "flex"
};

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`

const MobileDirectInstallpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <ScrollWrapper>
      <MobiileDirectInstallContainer />
    </ScrollWrapper>

  
  );

}

export default MobileDirectInstallpage;

