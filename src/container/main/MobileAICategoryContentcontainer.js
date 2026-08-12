import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";


import StoreInfo from "../../components/StoreInfo";
import { DataContext } from "../../context/Data";


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";
import MobileAiCategoryCreate from "../../components/MobileAiCategoryCreate";
import MobileAiCategoryContent from "../../components/MobileAiCategoryContent";

const Container = styled.div`
  padding:50px 0px;
  height: 100%;
`




const MobileAICategoryContentcontainer =({containerStyle, CATEGORYCONTENT_ID, CONTENT, MEMOITEMS}) =>  {

  return (
      <Container style={containerStyle}>
        <MobileAiCategoryContent CATEGORYCONTENT_ID ={CATEGORYCONTENT_ID} CONTENT={CONTENT} 
        MEMOITEMS={MEMOITEMS} />
      </Container>

  );

}

export default MobileAICategoryContentcontainer;

