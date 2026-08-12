import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";

import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { GUIDETYPE, LAWTYPE, PCCOMMNUNITYMENU } from "../../utility/screen";

import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import QRCode from 'qrcode.react';
import UseLaw from "../../components/UseLaw";
import PrivacyLaw from "../../components/PrivacyLaw";
import GpsLaw from "../../components/GpsLaw";
import HongKnow from "../../components/HongKnow";
import RoomKnow from "../../components/RoomKnow";
import CommunityKnow from "../../components/CommunityKnow";

import { Helmet } from "react-helmet";
import { LIFEMENU } from "../../utility/life";
import { getFontSize } from "../../utility/fontsize";
const Container = styled.div`
  margin-top:100px;
  
`
const style = {
  display: "flex"
};







const BannerItems = [
  {
    type: LIFEMENU.CLIMATE, image: imageDB.hongknow, main1: "요리레시피", main3: "매일매일 제공되는 추천레시피" + '\n' + "조리법, 식재료명,식재료 수량 및 단위를 제공" +
      "조리순서별 이미지와 요리팁으로  요리초보도 쉽게 따라할수 있어요", color: "#2b2b2b"
  },
]

const MainContent1 = styled.div`

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  white-space: pre-wrap;
  line-height:1.7;
  margin-top:0px;
  color : #fff;
`
const MainContent2 = styled.div`
  width: 40%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position:relative;
  margin-top:20px;



`

const MainContentTxt1 = styled.div`
  margin-top:20px;
  font-size: ${() => getFontSize(23)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-SemiBold;
  color : #fff;
`
const MainContentTxt2 = styled.div`

  font-size: ${() => getFontSize(16)}px;
  letter-spacing: -0.32px;
  color : #fff;
`


const Info = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;



`


const MainComponent = ({ width, items, bgcolor, color, containerStyle }) => {

  const navigate = useNavigate();




  return (
    <Container width={width} bgcolor={bgcolor} style={{ height: 150, background: 'linear-gradient(90deg, #ff7f00, #ffae42)' }}>

      {
        items.map((data, index) => (
          <Row style={{ width: "70%", margin: "0px auto 0px" }}>
            <MainContent1 style={{ justifyContent: "flex-start" }}>
              <MainContentTxt1 top={top}>{'구해줘 알바 알아보기'}</MainContentTxt1>

              <Info>
                <MainContentTxt2>{'만화를 통해 구해줘 알바가 출시한 배경에 대해 알려드릴께요'}</MainContentTxt2>


              </Info>

            </MainContent1>

            <MainContent2>
              <img src={imageDB.hongknow} style={{ width: 80 }} />
            </MainContent2>
          </Row>

        ))
      }


    </Container>
  );
};


const PCGuidecontainer =({containerStyle, TYPE =GUIDETYPE.HONGKNOW}) =>  {


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
      <MainComponent width={"100%"} items={BannerItems} bgcolor={'#2b2b2b'} top={25} containerStyle={{ color: '#fff' }} />
      <HongKnow/>
    </Container>
  );

}

export default PCGuidecontainer;

