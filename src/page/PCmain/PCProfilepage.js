import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import PCProfilecontainer from "../../container/PCmain/PCProfilecontainer";

import { UserContext } from "../../context/User";
import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";




const Container = styled.div`

`
const style = {
  display: "flex"
};

const PCProfilepage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <PCLayout main={false} name={""} height={80}>
      <PCProfilecontainer/>
    </PCLayout>
  
  );

}

export default PCProfilepage;

