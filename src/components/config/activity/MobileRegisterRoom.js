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
import { ReadWorkByuserid } from "../../../service/WorkService";
import MobileWorkItem from "../../MobileWorkItem";
import { FILTERITMETYPE } from "../../../utility/screen";
import { ReadRoomByuserid } from "../../../service/RoomService";
import MobileRoomItem from "../../MobileRoomItem";
import Empty from "../../Empty";

const Container = styled.div`
 

`


const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}



const MobileRegisterRoom =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [animatecomplete, setAnimatecomplete] = useState(false);
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
    setCurrentloading(currentloading);
    setRoomitems(roomitems);
  },[refresh])


  async function FetchData(){

    const USERS_ID = user.USERS_ID;
    const roomitems = await ReadRoomByuserid({USERS_ID});


    if(roomitems != -1){
      setRoomitems(roomitems);
    }

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
      {currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>):(  <Column margin={'0px auto;'} width={'100%'} style={{background:"#f9f9f9"}} >
  
            <FlexstartRow style={{flexWrap:"wrap", width:"90%", marginTop:20}}>
            {
              roomitems.map((item, index)=>(
                <MobileRoomItem key={index}  index={index} width={'100%'} 
                roomdata={item} onPress={()=>{_handleSelectWork(item.ROOM_ID, item.ROOMTYPE)}}/>  
              ))
            }
            {
              roomitems.length == 0 && <Empty content={'등록한 공간대여가 없습니다'}
              fontsize={'16px'} height={150} containerStyle={{width:"100%"}}/>
            }
            </FlexstartRow>
        </Column>)
      }


    </Container>
  );

}

export default MobileRegisterRoom;

