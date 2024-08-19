import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import PCLogincontainer from "../../container/PCmain/PCLogincontainer";

import { UserContext } from "../../context/User";




const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCLoginpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <PCLogincontainer/>
  
  );

}

export default PCLoginpage;

