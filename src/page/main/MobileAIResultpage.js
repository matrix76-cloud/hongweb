import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import MobileAIResultcontainer from "../../container/main/MobileAIResultcontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
  
};

const MobileAIResultpage =() =>  {
  const location = useLocation();

  return (
    <MobileAIResultcontainer result={location.state.result} research={location.state.research} />
  );

}

export default MobileAIResultpage;

