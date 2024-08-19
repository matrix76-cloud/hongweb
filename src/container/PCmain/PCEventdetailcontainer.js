import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
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

const EventProcessTag = styled.div`
  background: #000;
  width: 100px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  color: #fff;
  height: 40px;
  align-items: center;

`

const EventTitle = styled.div`
  font-size: 20px;
  line-height: 60px;

  border-bottom: 1px solid #ddd;
  width : 85%;
  font-weight:500;

`




const PCEventdetailcontainer =({containerStyle, EVENTITEM}) =>  {
console.log("TCL: PCEventdetailcontainer -> EVENTITEM", EVENTITEM)

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
      <Column margin={'0px auto;'} width={'70%'} style={{background:"#fff"}} >
        <EventTitle>
          <div style={{marginTop:30}}>
            <EventProcessTag>진행중</EventProcessTag>
          </div>
          <BetweenRow>
            <EventTitle style={{textAlign: "left"}}>{EVENTITEM.desc}</EventTitle>
            <EventTitle style={{textAlign: "right"}}>{EVENTITEM.date}</EventTitle>
          </BetweenRow>
        </EventTitle>
        <FlexstartRow>
          <img src={EVENTITEM.img2} style={{marginTop:20, width:"60%"}} />
        </FlexstartRow>
       
      </Column>

    </Container>
  );

}

export default PCEventdetailcontainer;

