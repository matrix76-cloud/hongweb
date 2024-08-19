import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { LAWTYPE, PCCOMMNUNITYMENU } from "../../utility/screen";

import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import QRCode from 'qrcode.react';
import UseLaw from "../../components/UseLaw";
import PrivacyLaw from "../../components/PrivacyLaw";
import GpsLaw from "../../components/GpsLaw";

const Container = styled.div`
 

`
const style = {
  display: "flex"
};

const PolicyBtn = styled.div`
  width: 230px;
  margin: 0 5px;
  line-height: 55px;
  background : ${({selected}) => selected == true ? ('#ff2a75') :('#f0f0f0')};
  color : ${({selected}) => selected == true ? ('#fff') :('#000')};
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;


`








const PCPolicycontainer =({containerStyle, TYPE}) =>  {


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  const [menu, setMenu] = useState(TYPE);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setMenu(menu);
  },[refresh])



  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useLayoutEffect(()=>{
    async function FetchData(){

    } 

    FetchData();
  }, [])


  const _handlemenu = (menu) =>{

    setMenu(menu);
    setRefresh((refresh) => refresh +1);
  }



  return (
    <Container style={containerStyle}>

      <Row style={{marginTop:50}}>
        <PolicyBtn onClick={()=>{_handlemenu(LAWTYPE.USELAW)}} selected = {menu == LAWTYPE.USELAW}>{LAWTYPE.USELAW}</PolicyBtn>
        <PolicyBtn onClick={()=>{_handlemenu(LAWTYPE.GPSLAW)}} selected = {menu == LAWTYPE.GPSLAW }>{LAWTYPE.GPSLAW}</PolicyBtn>
        <PolicyBtn onClick={()=>{_handlemenu(LAWTYPE.PRIVACYLAW)}} selected = {menu == LAWTYPE.PRIVACYLAW}>{LAWTYPE.PRIVACYLAW}</PolicyBtn>
      </Row>

      {
        menu == LAWTYPE.USELAW &&<UseLaw/>
      }
            
      {
        menu == LAWTYPE.GPSLAW &&<GpsLaw/>
      }
      {
        menu == LAWTYPE.PRIVACYLAW &&<PrivacyLaw/>
      }



    </Container>
  );

}

export default PCPolicycontainer;

