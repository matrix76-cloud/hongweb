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
import { DeleteWorkByWORK_ID, ReadWorkByuserid, UpdateWorkInfoWORKSTATUS } from "../../../service/WorkService";
import MobileWorkItem from "../../MobileWorkItem";
import { FILTERITMETYPE, WORKSTATUS } from "../../../utility/screen";

import PCConfigHeader from "../../PCConfigHeader";
import { LoadingChatAnimationStyle, LoadingConfigAnimationStyle } from "../../../screen/css/common";
import { TiDelete } from "react-icons/ti";
import { IoStopCircleSharp } from "react-icons/io5";
import { IoIosRefreshCircle } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiStopCircleBold } from "react-icons/pi";
import { IoIosRefresh } from "react-icons/io";

import PCStatusChangePopup from "../../../modal/PCStatusChangePopup";
import Empty from "../../Empty";
import { getFontSize } from "../../../utility/fontsize";


const Container = styled.div`


`


const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const Control = styled.div`
  display: flex;
  flex-direction: row;
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


const PCRegisterWork =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [animatecomplete, setAnimatecomplete] = useState(false);
  const [currentloading, setCurrentloading] = useState(true);
  const [workitems, setWorkitems] = useState([]);
  const [deletepopup, setDeletepopup] = useState(false);
  const [stoppopup, setStoppopup] = useState(false);
  const [startpopup, setStartpopup] = useState(false);
  const [workitem, setWorkitem] = useState({});


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setAnimatecomplete(animatecomplete);
    setCurrentloading(currentloading);
    setWorkitems(workitems);
    setDeletepopup(deletepopup);
    setStoppopup(stoppopup);
    setStartpopup(startpopup);
    setWorkitem(workitem);
  },[refresh])


  async function FetchData(){

    const USERS_ID = user.USERS_ID;
    const workitems = await ReadWorkByuserid({USERS_ID});


    if(workitems != -1){
      setWorkitems(workitems);
    }else{
      setWorkitems([]);
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


  const _handleSelectWork = (WORK_ID, WORKTYPE) =>{
    navigate("/Mobilework" ,{state :{WORK_ID :WORK_ID, TYPE : FILTERITMETYPE.HONG, WORKTYPE :WORKTYPE }});
  }
  const _handleWorkItemDelete= (item) =>{
    setDeletepopup(true);
    setWorkitem(item);
    setRefresh((refresh) => refresh +1);
  }
  const _handleWorkItemStop= (item) =>{
    setStoppopup(true);
    setWorkitem(item);
    setRefresh((refresh) => refresh +1);
  }

  const _handleWorkItemStart= (item) =>{
    setStartpopup(true);
    setWorkitem(item);
    setRefresh((refresh) => refresh +1);
  }
  const pcdeletepopupcallback = async(data) =>{
    setDeletepopup(false);

    if(data == 1){
      const WORK_ID = workitem.WORK_ID;

      DeleteWorkByWORK_ID({WORK_ID}).then((result)=>{
        if(result == 0){
          FetchData();
        }
     
      });
      
    }

    setRefresh((refresh) => refresh +1);
  }

  const pcstoppopupcallback = (data) =>{
    setStoppopup(false);

    if(data == 1){
      const DOC = workitem.WORK_ID;
      const WORK_STATUS = WORKSTATUS.CLOSE;
      UpdateWorkInfoWORKSTATUS({DOC,WORK_STATUS}).then(async ()=>{


        FetchData();
 
     
      });
    }

    setRefresh((refresh) => refresh +1);
  }

  const pcstartpopupcallback = (data) =>{
    setStartpopup(false);

    if(data == 1){
      const DOC = workitem.WORK_ID;
      const WORK_STATUS = WORKSTATUS.OPEN;
      UpdateWorkInfoWORKSTATUS({DOC,WORK_STATUS}).then(async ()=>{

        await sleep(1000);
        FetchData();
      
     
      });
    }
    setRefresh((refresh) => refresh +1);
  }

  return (

    
    <Container style={containerStyle}>

      {
        deletepopup == true && <PCStatusChangePopup callback={pcdeletepopupcallback} 
        type="delete"
        content={'일감을 정말로 삭제 하시겠습니까?'} />
      }

      {
        stoppopup == true && <PCStatusChangePopup callback={pcstoppopupcallback} 
        type ="stop"
        content={'일감을 정말로 마감 상태로 변경 하시겠습니까?'} />
      }
      {
        startpopup == true && <PCStatusChangePopup callback={pcstartpopupcallback} 
        type="start"
        content={'일감을 정말로 진행중 상태로 변경하시겠습니까?'} />
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
              workitems.map((item, index)=>(
                <>
                <MobileWorkItem key={index}  index={index} width={'100%'} 
                workdata={item} onPress={()=>{}}/>  
                <Control>
                  <ControlButton onClick={()=>{_handleWorkItemDelete(item)}}>
                    <RiDeleteBinLine size={20}/>삭제</ControlButton>
                  <ControlButton onClick={()=>{_handleWorkItemStop(item)}}>
                    <PiStopCircleBold size={20}/>마감</ControlButton>
                  <ControlButton onClick={()=>{_handleWorkItemStart(item)}}>
                    <IoIosRefresh size={20}/>진행</ControlButton>
                </Control>
                </>

              ))
            }

            {
              workitems.length == 0 && <Empty content={'내가 등록한 일감이 없습니다2'} />
            }
            </FlexstartRow>)
          }
      </Column>
      


    </Container>
  );

}

export default PCRegisterWork;

