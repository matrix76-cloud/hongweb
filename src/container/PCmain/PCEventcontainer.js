import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { EventItems, EVENTTYPE, PCCOMMNUNITYMENU } from "../../utility/screen";
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

const EventTitle = styled.div`
  font-size: 25px;
  line-height: 80px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  width : 85%;
  font-weight:500;

`
const EventBox = styled.div`

  margin-top:30px;
  width: calc(50% - 20px);
  margin-bottom: 30px;
  cursor: pointer;
  transition: .2s all;
  margin-left:15px;
  
`
const txtWrap = {
  backgroundColor:'#fafafa',
  padding: '18px 20px 24px',
  lineHeight:2
}

const tit ={
  fontSize: '18px',
  fontWeight: 700,
}

const day = {
  color: '#797979',
  fontSize: '16px'
}


const PCEventcontainer =({containerStyle}) =>  {

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




  const _handeleventdetail = (data) =>{
  console.log("TCL: _handeleventdetail -> data", data)

    
    navigate("/PCeventdetail",{state :{EVENTITEM :data}});


  }

  


  return (
    <Container style={containerStyle}>
      <Column margin={'0px auto;'} width={'70%'} style={{background:"#fff"}} >
        <EventTitle>이벤트</EventTitle>
        <FlexstartRow style={{flexWrap:"wrap", width:'90%'}}>
          {
            EventItems.map((data, index)=>(
              <EventBox onClick={()=>{_handeleventdetail(data)}}>
              <img src={data.img} style={{width:'100%', height:450}}/>
              <div style={txtWrap}>
              <div style={tit}>{data.desc}</div>
              <div style={day}>{data.date}</div>
              </div>
              </EventBox>
            ))
          }
        
       
        </FlexstartRow>

      </Column>

    </Container>
  );

}

export default PCEventcontainer;

