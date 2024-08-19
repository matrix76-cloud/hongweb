import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import PCSplashcontainer from "../../container/PCmain/PCSplashcontainer";
import { UserContext } from "../../context/User";




const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCSplashpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <PCSplashcontainer/>
  
  );

}

export default PCSplashpage;

