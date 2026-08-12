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
import { DeleteRoomByROOM_ID, ReadRoomByuserid } from "../../../service/RoomService";
import MobileRoomItem from "../../MobileRoomItem";
import Empty from "../../Empty";
import PCConfigHeader from "../../PCConfigHeader";
import { LoadingChatAnimationStyle, LoadingConfigAnimationStyle } from "../../../screen/css/common";
import PCStatusChangePopup from "../../../modal/PCStatusChangePopup";
import { RiDeleteBinLine } from "react-icons/ri";
import { getFontSize } from "../../../utility/fontsize";

const Container = styled.div`
 
  min-height:650px;
  background:#f7f7f7;
`


const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const Control = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 310px;
  width : 70px;


`
const ControlButton = styled.div`
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 90%;
    margin: 0px auto 5px;
    padding: 10px 5px;
    font-size: ${() => getFontSize(12)}px;
    border: 1px solid #ededed;
    border-radius :5px;


`



const PCRegisterRoom =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [animatecomplete, setAnimatecomplete] = useState(false);
  const [currentloading, setCurrentloading] = useState(true);
  const [roomitems, setRoomitems] = useState([]);
  const [roomitem, setRoomitem] = useState({});
  const [deletepopup, setDeletepopup] = useState(false);

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
    setRoomitem(roomitem);
    setDeletepopup(deletepopup);
  },[refresh])


  async function FetchData(){

    const USERS_ID = user.USERS_ID;
    const roomitems = await ReadRoomByuserid({USERS_ID});


    if(roomitems != -1){
      setRoomitems(roomitems);
    }else{
      setRoomitems([]);
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


  const _handleSelectRoom = (ROOM_ID, ROOMTYPE) =>{
    navigate("/Mobileworkroom" ,{state :{ROOM_ID :ROOM_ID, TYPE : FILTERITMETYPE.ROOM, ROOMTYPE : ROOMTYPE }});
  }

  const _handleRoomItemDelete= (item) =>{
    setDeletepopup(true);
    setRoomitem(item);
    setRefresh((refresh) => refresh +1);
  }

  const pcdeletepopupcallback = async(data) =>{
    setDeletepopup(false);

    if(data == 1){
      const ROOM_ID = roomitem.ROOM_ID;

      DeleteRoomByROOM_ID({ROOM_ID}).then((result)=>{
        if(result == 0){
          FetchData();
        }
     
      });
      
    }

    setRefresh((refresh) => refresh +1);
  }

  return (
    <Container style={containerStyle}>

      {
        deletepopup == true && <PCStatusChangePopup callback={pcdeletepopupcallback} 
        type="delete"
        content={'공간대여 등록을 정말로 삭제 하시겠습니까?'} />
      }

        <Column margin={'0px auto'} width={'100%'} style={{background:"#f7f7f7", minHeight:650, justifyContent:"flex-start"}}  >
        {currentloading == true ? (
          <div style={{height:"100vh", display:"flex", justifyContent:"center"}}>
          <LottieAnimation containerStyle={LoadingConfigAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>
          </div>
        ):( 

        <FlexstartRow style={{flexWrap:"wrap", width:"90%", margin:"20px auto"}}>
        {
          roomitems.map((item, index)=>(
            <>
                <MobileRoomItem key={index}  index={index} width={'80%'} 
                  roomdata={item} onPress={()=>{}}/>  
                <Control>
                  <ControlButton onClick={()=>{_handleRoomItemDelete(item)}}>
                    <RiDeleteBinLine size={20}/>삭제</ControlButton>
                </Control>
            </>
 
          ))
        }
        {
          roomitems.length == 0 && <Empty content={'내가 등록한 공간대여가 없습니다'} height={150} 
          fontsize={'16px'} 
          containerStyle={{width:"100%"}}/>
        }
        </FlexstartRow>)}
      </Column>
    
    </Container>
  );

}

export default PCRegisterRoom;

