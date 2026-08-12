import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';


import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";
import MobileAiCategoryCreate from "../../components/MobileAiCategoryCreate";
import MobileAiCategoryContent from "../../components/MobileAiCategoryContent";

const Container = styled.div`
  padding:10px 0px 0px;
  height: 100%;
`




const MobileAICategoryCreatecontainer =({containerStyle, name}) =>  {

  return (
      <Container style={containerStyle}>
        <MobileAiCategoryCreate />
      </Container>

  );

}

export default MobileAICategoryCreatecontainer;

