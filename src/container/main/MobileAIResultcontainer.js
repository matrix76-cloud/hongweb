import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";
import MobileAiCategoryCreate from "../../components/MobileAiCategoryCreate";
import MobileAiCategoryContent from "../../components/MobileAiCategoryContent";
import MobileAiResult from "../../components/MobileAiResult";

const Container = styled.div`
  padding:20px 0px 0px;
  height: 100%;
`




const MobileAIResultcontainer =({containerStyle, result, research}) =>  {

  return (
      <Container style={containerStyle}>
        <MobileAiResult result={result} research={research} />
      </Container>

  );

}

export default MobileAIResultcontainer;

