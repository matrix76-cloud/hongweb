import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileGatecontainer from "../../container/main/MobileGatecontainer";
import MobileSplashcontainer from "../../container/main/MobileSplashcontainer";
import { UserContext } from "../../context/User";
import MobilePrevheader from "../../screen/Layout/Header/MobilePrevheader";




const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileGatepage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <div>
   
      <MobileGatecontainer/>
    </div>

  
  );

}

export default MobileGatepage;

