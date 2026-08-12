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
import Empty from "../../Empty";
import PCStatusChangePopup from "../../../modal/PCStatusChangePopup";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiStopCircleBold } from "react-icons/pi";
import { IoIosRefresh } from "react-icons/io";
import Emptychat from "../../Emptychat";
import ButtonEx from "../../../common/ButtonEx";
import { getFontSize } from "../../../utility/fontsize";
import EmptyState from "../../EmptyState";

const Container = styled.div`
  height: calc(100vh - 50px); // 필요 시 header/footer 제외
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  background: #fff;
`


const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const Control = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;


`
const ControlButton = styled.div`
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 28%;
    margin: 0px auto 5px;
    padding: 10px 5px;
    font-size: ${() => getFontSize(14)}px;
    border: 1px solid #ededed;
    border-radius :5px;

    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;

    &:active {

      transform: scale(0.95); /* 눌렀을 때 크기 조정 */

    }
`

const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;


const EmptyTitle = styled.div`
    margin-top: 20px;
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(22)}px;
    color: #423f3f;
`

const EmptySubTitle = styled.div`
  margin: 5px 0px;
`

const MobileMyRegisterWork =({containerStyle}) =>  {
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




  async function FetchData(){

    const USERS_ID = user.USERS_ID;
    const workitems = await ReadWorkByuserid({USERS_ID});

    console.log("FetchData", workitems);
    if(workitems != -1){
      setWorkitems(workitems);
    } else {
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


    const WORK_ID = workitem.WORK_ID;
    if(data == 1){

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

  const _handleWorkRegist = () => {
    navigate("/Mobilemain")
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

      {currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>):(<Column margin={'0px auto;'} width={'100%'} style={{background:"#f9f9f9"}} >
          {
            workitems.length != 0 && <FlexstartRow style={{ flexWrap: "wrap", width: "90%", padding: "20px auto 50px", marginTop: 20 }}>
              {
                workitems.map((item, index) => (
                  <Column style={{ width: "100%" }}>
                    <MobileWorkItem key={index} index={index} containerStyle={{ margin: "0 auto" }}
                      workdata={item} onPress={() => { _handleSelectWork(item.WORK_ID, item.WORKTYPE) }} />

                    <Control>
                      <ControlButton style={{ background: "#FFEBEE", color: "#D32F2F" }} onClick={() => { _handleWorkItemDelete(item) }}>
                        <RiDeleteBinLine size={20} />삭제</ControlButton>
                      <ControlButton style={{ background: "#F5F5F5", color: "#616161" }} onClick={() => { _handleWorkItemStop(item) }}>
                        <PiStopCircleBold size={20} />마감</ControlButton>
                      <ControlButton style={{ background: "#FF9800", color: "#FFFFFF" }} onClick={() => { _handleWorkItemStart(item) }}>
                        <IoIosRefresh size={20} />진행</ControlButton>
                    </Control>
                  </Column>

                ))
              }
            </FlexstartRow>
          } 
        </Column>)
      }

      {
        workitems.length == 0 &&  
        
          <Column>      
            <EmptyState type="myWork" />
          </Column>
      }



    </Container>
  );

}

export default MobileMyRegisterWork;

