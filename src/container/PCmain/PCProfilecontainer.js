import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { PCCOMMNUNITYMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import QRCode from 'qrcode.react';

const Container = styled.div`

`
const style = {
  display: "flex"
};

const Login = styled.div`
  font-size: 34px;
  line-height: 120%;
  letter-spacing: -0.03em;
  font-weight : 600;
`
const LoginSub = styled.div`
  margin-top: 16px;
  font-size: 18px;
  line-height: 135%;
  letter-spacing: -0.03em;
`
const LoginTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.02em;
`
const LoginWrapper = styled.div`
  margin: 32px 0px;
  color: #4d5159;
`
const ListWrapper = styled.ol`
  margin: 12px 0px;
  padding-left: 0px;
  list-style-position: inside;
`
const ListItem = styled.li`
  line-height: 2.5;
`
const QrContainstyle ={
  background:' #ededed',
  margin: '50px',
  padding: '50px'
}

const Bottomstyle={
    position: "sticky",
    bottom: "0px",
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    background:' #ededed',
    alignitems : "center"
}
const Footerstyle={

  display: "flex",
  justifyContent: "space-between",
  background : "#ededed",
  width: "400px",
  height: "66px",
  fontSize: "16px",
  lineHeight: "150%",
  letterSpacing: "-0.02em",
  fontWeight: 700,
  alignItems:"center",
  paddingLeft :"10%"
}


const PCProfilecontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

  },[refresh])



  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useLayoutEffect(()=>{
    async function FetchData(){

    } 

    FetchData();
  }, [])





  



  return (
    <Container style={containerStyle}>
      <Row margin={'0px auto;'} width={'80%'} style={{background:"#fff", height:"800px"}} >
        <div style={{width:'70%', background:'#f0f0f0', height:"800px"}}>

          
        </div>
        <div style={{width:'30%', background:'#ada7a5', height:"800px"}}>
   
          
        </div>

      </Row>
      <div style={Bottomstyle}>
        <div style={Footerstyle}>
          <a style={{color :'#393a40}'}}>이용약관</a>
          <a style={{color :'#393a40}'}}>개인정보 처리지침</a>
          <a style={{color :'#393a40}'}}>위치기반서비스 이용약관</a>
        </div>
      </div>
    </Container>
  );

}

export default PCProfilecontainer;

