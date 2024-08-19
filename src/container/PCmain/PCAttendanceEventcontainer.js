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
import { fontSize } from "@mui/system";

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

const CheckStatus = styled.div`
  text-align: center;
  background-color: #f4f4fe;
  padding-top: 80px;
  width: 60%;
  margin-left: 8%;
  margin-top: 20px;

`

const AttendanceCheckLabel = styled.div`
  font-size: 40px;
  color: #3c4cb2;
  font-weight: 700;
  line-height: 50px;
  letter-spacing: -1.5px;
`
const AttendanceCheckDay = styled.div`
    font-size: 55px;
    margin-top: 35px;
    font-weight: 700;
    line-height: 70px;
    margin-bottom: 44px;
    color :#000;
`

const AttendanceCheckDesc = styled.div`
  font-size: 22px;
  color: #797979;
  line-height: 44px;
  margin-bottom: 20px;
  padding : 0px 50px;
`

const AttendanceEvent= [
{day :1, check : false},
{day :2, check : false},
{day :3, check : false},
{day :4, check : false},
{day :5, check : false},
{day :6, check : false},
{day :7, check : false},
{day :8, check : false},
{day :9, check : false},
{day :10, check : false},
{day :11, check : false},
{day :12, check : false},
{day :13, check : false},
{day :14, check : false},
{day :15, check : false},

]

const Attdendanceday = 10;

const PCAttendanceEventcontainer =({containerStyle}) =>  {


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [checkitems, setCheckitems] = useState([]);
  const [animatecomplete, setAnimatecomplete] = useState(false);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setAnimatecomplete(animatecomplete);
  },[refresh])



  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useLayoutEffect(()=>{
    async function FetchData(){

      AttendanceEvent.map((data, index)=>{

        if(data.day <= Attdendanceday){
          data.check = true;
        }
      })

      setCheckitems(AttendanceEvent);
      await useSleep(10000);
      setAnimatecomplete(true);
      setRefresh((refresh) => refresh +1);

      console.log("TCL: FetchData -> AttendanceEvent", AttendanceEvent)
    } 

    FetchData();
  }, [])


  const _hanldlecheck = () =>{

  }




  return (
    <Container style={containerStyle}>
      <Column margin={'0px auto;'} width={'70%'} style={{background:"#fff"}} >
        <EventTitle>
          <div style={{marginTop:30}}>
            <EventProcessTag>진행중</EventProcessTag>
          </div>
          <BetweenRow>
            <EventTitle style={{textAlign: "left"}}>{'출석 체크 이벤트'}</EventTitle>
            <EventTitle style={{textAlign: "right"}}>{'~ 행사종료시 까지'}</EventTitle>
          </BetweenRow>
        </EventTitle>

        <FlexstartRow>
          <CheckStatus>
            <AttendanceCheckLabel>나의 누적 출석체크 현황</AttendanceCheckLabel>
            <AttendanceCheckDay>{Attdendanceday}일</AttendanceCheckDay>
            <AttendanceCheckDesc>15일 누적 출석이 완료되면 나의 누적 현황이 초기화 되며,이벤트를 다시 참여 할 수 있습니다.</AttendanceCheckDesc>
            <Row style={{flexWrap:"wrap", margin:"40px 60px"}}>
            {
              checkitems.map((data, index)=>(
                <Column style={{width:'20%', height:150}}>
                  <div>{data.day}일</div>
                  {
                    animatecomplete == false && <>
                    {
                      data.check == true  ? (<img src={imageDB.sample31} style={{width:100, height:100}}/>):(
                        <img src={imageDB.sample32} style={{width:100, height:100}}/>
                      )
                    }
                    </>
                  }
                  {
                    animatecomplete == true && <>
                    {
                      data.check == true  ? (<img src={imageDB.sample33} style={{width:100, height:100}}/>):(
                        <img src={imageDB.sample32} style={{width:100, height:100}}/>
                      )
                    }
                    </>
                  }
                 
                </Column>
              ))
            }
            </Row>

            <Button onPress={_hanldlecheck} height={'65px'} width={'80%'} radius={'5px'} bgcolor={'#000'} color={'#fff'} text={'출석체크'}
            containerStyle={{fontSize: "30px", fontWeight:900, marginBottom:50}}/>
         
          </CheckStatus>

        </FlexstartRow>

      </Column>

    </Container>
  );

}

export default PCAttendanceEventcontainer;

