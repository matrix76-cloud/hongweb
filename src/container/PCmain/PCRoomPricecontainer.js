import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { EventItems, EVENTTYPE, LoadingType, PCCOMMNUNITYMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import QRCode from 'qrcode.react';
import Loading from "../../components/Loading";
import { ReadWork } from "../../service/WorkService";
import PCRoomItem from "../../components/PCRoomItem";
import { ROOMSIZE, ROOMSIZEDISPALY } from "../../utility/room";

const Container = styled.div`
  margin:30px auto 0px;


`
const style = {
  display: "flex"
};
const TitleLayer = styled.div`
  height: 60px;
  padding: 0px 20px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

const Title = styled.div`
  font-size: 35px;
  letter-spacing: -1px;
  line-height: 60px;
  margin-bottom: 30px;
  font-weight :700;

`
const SizeTitle = styled.div`
  font-size : 40px;
  font-weight: 700;
`
const SizeTitleSub = styled.div`
  font-size: 18px;
  color: #7e7e7e;
  margin-bottom: 25px;

`
const SizeDesc = styled.div`
font-size: 20px;
color: #000;
line-height: 36px;
`

const tit ={
  fontSize: '18px',
  fontWeight: 700,
}

const day = {
  color: '#797979',
  fontSize: '16px'
}

const Filterwrap = styled.ul`
    align-items: center;
    color: #b7b7b7;
    background: #fff;
    box-shadow: 6px 6px 20px 2px rgb(0 0 0 / 15%);
    margin: 0 auto;
    width: 50%;
    display: flex;
    justify-content: center;
    padding: 22px;
    border-radius: 50px;
    margin-bottom:30px;

`
const Filterdata = styled.li`

  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  width :30%;
  font-size: 22px;
  color: ${({clickstatus}) => clickstatus == true ? ('#ff2a75') :('#595959') };
  font-weight: ${({clickstatus}) => clickstatus == true ? ('600') :('600') };

`


const PCRoomPricecontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [menustatus, setMenustatus] = useState(ROOMSIZE.SMALL);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setMenustatus(menustatus);
  },[refresh])



  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useLayoutEffect(()=>{
    async function FetchData(){

    } 

    FetchData();
  }, [])

  const _handleMenu = (menu) =>{

    setMenustatus(menu);
    setRefresh((refresh) => refresh +1);
  }


  return (
    
    <Container style={containerStyle}>

    <div style={{display:"flex", flexDirection:"column", margin: "0px auto",width: '100%'}}>
      <TitleLayer>
          <Title>홍여사가 정해놓은 싸이즈를 확인해보세요</Title>

      </TitleLayer>

      {
        menustatus == ROOMSIZE.SMALL &&  <BetweenRow style={{padding: "0px 20px", width:"60%", margin: "0 auto"}}>
        <div style={{width:"50%", marginLeft:"5%"}}><img src={imageDB.roomsize1} width={450} height={500}/></div>
        <Column style={{width:"50%"}}>
        <SizeTitle>{ROOMSIZE.SMALL}</SizeTitle>
        <SizeTitleSub>1평</SizeTitleSub>
          <SizeDesc>헌옷, 책, 생활용품 등</SizeDesc>
          <SizeDesc>소형 짐 보관</SizeDesc>
          <SizeDesc>우체국 5호박스 0 ~ 8개</SizeDesc>
        </Column>
      </BetweenRow>
      }
      {
        menustatus == ROOMSIZE.MEDIUM &&  <BetweenRow style={{padding: "0px 20px", width:"60%", margin: "0 auto"}}>
        <div style={{width:"50%", marginLeft:"5%"}}><img src={imageDB.roomsize2} width={450} height={500}/></div>
        <Column style={{width:"50%"}}>
        <SizeTitle>{ROOMSIZE.MEDIUM}</SizeTitle>
        <SizeTitleSub>2평</SizeTitleSub>
          <SizeDesc>취미 용품, 낛시도구 등 생활 짐 보관</SizeDesc>
          <SizeDesc>중형 짐 보관</SizeDesc>
          <SizeDesc>우체국 5호박스 8 ~ 15개</SizeDesc>
        </Column>
      </BetweenRow>
      }
      {
        menustatus == ROOMSIZE.LARGE &&  <BetweenRow style={{padding: "0px 20px", width:"60%", margin: "0 auto"}}>
        <div style={{width:"50%", marginLeft:"5%"}}><img src={imageDB.roomsize3} width={450} height={500}/></div>
        <Column style={{width:"50%"}}>
        <SizeTitle>{ROOMSIZE.LARGE}</SizeTitle>
        <SizeTitleSub>3평</SizeTitleSub>
          <SizeDesc>캠핑 용품, 골프채, 이불 등 생활 짐 보관</SizeDesc>
          <SizeDesc>대형 짐 보관</SizeDesc>
          <SizeDesc>우체국 5호박스 15 ~ 30개</SizeDesc>
        </Column>
      </BetweenRow>
      }


      <Filterwrap>
        {/* <Filterdata clickstatus={menustatus == ROOMSIZE.MINI }  onClick={()=>{_handleMenu(ROOMSIZE.MINI)}}>{ROOMSIZE.MINI}</Filterdata>
        <Filterdata clickstatus={menustatus == ROOMSIZE.LIGHT }  onClick={()=>{_handleMenu(ROOMSIZE.LIGHT)}}>{ROOMSIZE.LIGHT}</Filterdata>
        <Filterdata clickstatus={menustatus == ROOMSIZE.LIGHTPLUS }  onClick={()=>{_handleMenu(ROOMSIZE.LIGHTPLUS)}}>{ROOMSIZE.LIGHTPLUS}</Filterdata> */}
        <Filterdata clickstatus={menustatus == ROOMSIZE.SMALL }  onClick={()=>{_handleMenu(ROOMSIZE.SMALL)}}>{ROOMSIZE.SMALL}</Filterdata>
        <Filterdata clickstatus={menustatus == ROOMSIZE.MEDIUM }  onClick={()=>{_handleMenu(ROOMSIZE.MEDIUM)}}>{ROOMSIZE.MEDIUM}</Filterdata>
        <Filterdata clickstatus={menustatus == ROOMSIZE.LARGE }  onClick={()=>{_handleMenu(ROOMSIZE.LARGE)}}>{ROOMSIZE.LARGE}</Filterdata>
      </Filterwrap>

      



    </div>


    </Container>
  );

}

export default PCRoomPricecontainer;

