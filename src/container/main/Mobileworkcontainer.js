import React, { Component, createRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { ReadWork, ReadWorkByIndividually } from "../../service/WorkService";

import { DataContext } from "../../context/Data";
import "./Mobilemap.css"
import { useSleep } from "../../utility/common";
import { FILTERITMETYPE, PCMAINMENU } from "../../utility/screen";
import { setRef } from "@mui/material";
import { REQUESTINFO } from "../../utility/work";
import { Column } from "../../common/Column";
import MobileWorkReport from "../../components/MobileWorkReport";
import LottieAnimation from "../../common/LottieAnimation";


const Container = styled.div`
    max-height:1000px;

  
`

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;




const MobileWorkcontainer =({containerStyle, WORK_ID, TYPE}) =>  {
console.log("TCL: MobileWorkcontainer -> TYPE", TYPE)
console.log("TCL: MobileWorkcontainer -> WORK_ID", WORK_ID)

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [worktype, setWorktype] = useState('');
  const [workstatus, setWorkstatus] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setLoading(loading);
    setMessages(messages);
    setWorktype(worktype);
    setWorkstatus(workstatus);
 
  },[refresh])


  useEffect(()=>{
    async function FetchData(){
      const workitem = await ReadWorkByIndividually({WORK_ID});
      console.log("TCL: FetchData -> workitem", workitem)

      setMessages(workitem.WORK_INFO);
      setWorktype(workitem.WORKTYPE);
      setWorkstatus(workitem.WORK_STATUS);
      setLoading(false);
      setRefresh((refresh) => refresh +1);

      console.log("TCL: FetchData -> workitem", workitem);      
    } 
    FetchData();
  }, [])


  return (

    
    <Container style={containerStyle}>
    {
      loading == true ? ( <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}
        />) :( <Column>
          <div style={{marginTop: 70, color :'#131313', fontSize:16, width:'90%', marginLeft:5}}>고객님이 작성하신 요구 사항은 다음과 같습니다</div>
          <MobileWorkReport messages={messages} WORK_ID = {WORK_ID} WORKTYPE={worktype} WORK_STATUS={workstatus}/>
        </Column>)
    } 
    </Container>
  );

}

export default MobileWorkcontainer;

