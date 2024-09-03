import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATIMAGETYPE, EventItems, PCCOMMNUNITYMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { ReadCommunity, ReadCommunitySummary, ReadCommunityTop10 } from "../../service/CommunityService";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";

const Container = styled.div`
    background-color : #f2f3f6;
    height:900px;
    padding-top:105px;
`
const style = {
  display: "flex"
};


const NameLayout = styled.div`
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid #ededed;
`
const NameText = styled.div`
  padding-left:20px;
  font-family:'Pretendard-SemiBold';
  font-size:16px;
`
const ReadAlertLayout = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #ededed;
  margin-right:5px;

`
const ReadAlertText = styled.div`

  font-size:14px;
`




const PCChatcontainer =({containerStyle}) =>  {

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



 
  useEffect(()=>{
    async function FetchData(){
  
    }
    FetchData();
  }, [])


  return (
    <Container style={containerStyle}>
      <Row margin={'0px auto;'} width={'80%'} height={'100%'} >
        <Column style={{background:"#ededed", width:"10%", height:"100%", justifyContent:"flex-start"}}>
          <img src ={imageDB.sample36} style={{width:80}} />
        </Column>
        <Column style={{background:"#fff", width:"30%", height:"100%", justifyContent:"flex-start", borderRight: "1px solid #ededed"}}>
            <NameLayout><NameText>이행렬</NameText></NameLayout>
            <ReadAlertLayout><ReadAlertText>안읽은 메시지만 보기</ReadAlertText>
              <div style={{display:"flex"}}><img src={imageDB.sample37} style={{width:24}}/></div>
            </ReadAlertLayout>
            <Chatgate  imagetype={CHATIMAGETYPE.HONGIMG} img={imageDB.logo} name={'홍여사'} info={'06:00'}
            content={'김상미 님이 홍여사 공간  ■ Small 공간대여를 하였습니다'} read={true} check={true}/>
            <Chatgate  imagetype={CHATIMAGETYPE.USERIMG}  img={imageDB.sample39}  name={'김상미'} info={'남양주시 수택동 122 / 하루전'}
            content={'김상미 님이 홍여사 공간  ■ Small 공간대여를 하였습니다'} read={true}/>
            <Chatgate  imagetype={CHATIMAGETYPE.USERIMG}  img={imageDB.sample38}  name={'이은서'} info={'남양주시 다산동 12  / 4일전'}
            content={'어디세여? 도움 주실수가 있을까여?'} read={false}/>
            <Chatgate  imagetype={CHATIMAGETYPE.USERIMG}  img={imageDB.person}  name={'이청헌'} info={'남양주시 지금동 5  / 일주일전'}
            content={'계약서 작성 하고 진행 하실까요...네'} read={false}/>

        </Column>
        <Row style={{background:"#fff", width:"60%", height:"100%"}}></Row>
    

      </Row>
    </Container>
  );

}

export default PCChatcontainer;

