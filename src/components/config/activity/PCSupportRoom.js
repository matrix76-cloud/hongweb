import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../../context/User";
import moment from "moment";
import { imageDB } from "../../../utility/imageData";

import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { Column, FlexstartColumn } from "../../../common/Column";

import Button from "../../../common/Button";
import { DataContext } from "../../../context/Data";

import { readuserbydeviceid, Update_attendancebyusersid } from "../../../service/UserService";
import { getDateEx, getDateFullTime } from "../../../utility/date";
import { useDispatch } from "react-redux";
import { ALLREFRESH } from "../../../store/menu/MenuSlice";
import { sleep } from "../../../utility/common";
import LottieAnimation from "../../../common/LottieAnimation";
import { ReadMySupportRoom } from "../../../service/RoomService";
import MobileRoomItem from "../../MobileRoomItem";
import Empty from "../../Empty";
import { FILTERITMETYPE } from "../../../utility/screen";
import PCConfigHeader from "../../PCConfigHeader";
import { getFontSize } from "../../../utility/fontsize";
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
  font-size: ${() => getFontSize(20)}px;
  line-height: 60px;

  border-bottom: 1px solid #ddd;
  width : 85%;
  font-weight:500;

`

const CheckStatus = styled.div`
  text-align: center;
  background-color: #f4f4fe;
  padding-top: 20px;
  width: 85%;
  margin : 10px auto;

`

const AttendanceCheckLabel = styled.div`
  font-size: ${() => getFontSize(25)}px;
  color: #3c4cb2;
  font-weight: 700;
  line-height: 50px;
  letter-spacing: -1.5px;
`
const AttendanceCheckDay = styled.div`
    font-size: ${() => getFontSize(40)}px;
    margin-top: 15px;
    font-weight: 700;
    line-height: 70px;
    margin-bottom: 44px;
    color :#000;
`

const AttendanceCheckDesc = styled.div`
  font-size: ${() => getFontSize(18)}px;
  color: #797979;
  line-height: 34px;
  margin-bottom: 20px;
  padding: 0px 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
`

const AttendanceEvent= [
{day :1, check : false, checkday:""},
{day :2, check : false, checkday:""},
{day :3, check : false, checkday:""},
{day :4, check : false, checkday:""},
{day :5, check : false, checkday:""},
{day :6, check : false, checkday:""},
{day :7, check : false, checkday:""},
{day :8, check : false, checkday:""},
{day :9, check : false, checkday:""},
{day :10, check : false, checkday:""},
{day :11, check : false, checkday:""},
{day :12, check : false, checkday:""},
{day :13, check : false, checkday:""},
{day :14, check : false, checkday:""},
{day :15, check : false, checkday:""},

]

const CheckDate = styled.div`
  position: absolute;
  padding-top: 25px;
  color: #554f4f;
  font-size: ${() => getFontSize(12)}px;
`

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const Attdendanceday = 3;

const PCSupportRoom =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [checkitems, setCheckitems] = useState([]);
  const [animatecomplete, setAnimatecomplete] = useState(false);
  const [check, setCheck] = useState(0);
  const [enable, setEnable] = useState(true);
  const [currentloading, setCurrentloading] = useState(true);
  const [roomitems, setRoomitems] = useState([]);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setAnimatecomplete(animatecomplete);
    setCheck(check);
    setEnable(enable);
    setCurrentloading(currentloading);
  },[refresh])


  async function FetchData(){

    const USERS_ID = user.USERS_ID;
    const roomitems = await ReadMySupportRoom({USERS_ID});

    setRoomitems(roomitems);

    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
}

  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */

  useEffect(()=>{
   FetchData();
  }, [])



  const _handleSelectWork = (ROOM_ID, ROOMTYPE) =>{
    navigate("/Mobileworkroom" ,{state :{ROOM_ID :ROOM_ID, TYPE : FILTERITMETYPE.ROOM, ROOMTYPE : ROOMTYPE }});
  }


  return (
    <Container style={containerStyle}>

        <Column  margin={'0px auto;'} width={'100%'} style={{background:"#f9f9f9"}} >
        {currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>):(
          <FlexstartRow style={{flexWrap:"wrap", width:"90%", marginTop:20}}>
            {
              roomitems.map((item, index)=>(
                <MobileRoomItem key={index}  index={index} width={'100%'} 
                roomdata={item} onPress={()=>{_handleSelectWork(item.ROOM_ID, item.ROOMTYPE)}}/>  
              ))
            }
            {
              roomitems.length == 0 && <Empty content={'필요한 공간대여가 없습니다'} height={150} containerStyle={{width:"100%"}}/>
            }
          </FlexstartRow>)}
        </Column>
      


    </Container>
  );

}

export default PCSupportRoom;

