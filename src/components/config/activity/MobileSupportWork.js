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
import { ReadMySupportWork, ReadWorkByIndividually, ReadWorkByuserid } from "../../../service/WorkService";
import MobileWorkItem from "../../MobileWorkItem";
import { FILTERITMETYPE } from "../../../utility/screen";
import { ReadChat } from "../../../service/ChatService";
import ItemSwipeComponent from "../../../common/ItemSwipe";
import Empty from "../../Empty";

const Container = styled.div`
 

`


const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}



const MobileSupportWork =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [animatecomplete, setAnimatecomplete] = useState(false);
  const [currentloading, setCurrentloading] = useState(true);
  const [workitems, setWorkitems] = useState([]);

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
  },[refresh])


  async function FetchData(){

    const USERS_ID = user.USERS_ID;
    const workitems = await ReadMySupportWork({USERS_ID});

    setWorkitems(workitems);
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

  return (
    <Container style={containerStyle}>
      {currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>):(  <Column margin={'0px auto;'} width={'100%'} style={{background:"#f9f9f9"}} >
  
            <FlexstartRow style={{flexWrap:"wrap", width:"90%", marginTop:20}}>
            {
              workitems.map((item, index)=>(
                <MobileWorkItem key={index}  index={index} width={'100%'} 
                workdata={item} onPress={()=>{_handleSelectWork(item.WORK_ID, item.WORKTYPE)}}/>  
              ))
            }
            {
              workitems.length == 0 && <Empty content={'지원한 일감이 없습니다'} height={150} containerStyle={{width:"100%"}}/>
            }
            </FlexstartRow>
        </Column>)
      }


    </Container>
  );

}

export default MobileSupportWork;

