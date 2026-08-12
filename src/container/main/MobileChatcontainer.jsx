import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATIMAGETYPE, EventItems, PCCOMMNUNITYMENU } from "../../utility/screen";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";
import Emptychat from "../../components/Emptychat";
import { readuser } from "../../service/UserService";
import { SubscribeChatRooms, ReadBlocked } from "../../service/ChatService";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChatAnimationStyle } from "../../screen/css/common";

/* 높이를 900px 로 못박아둬서 화면보다 길거나 짧았다. 헤더만 비우고 내용만큼 늘어나게 한다.
   (형 지시 2026-08-12) */
const Container = styled.div`
    background-color : #fff;
    min-height: calc(100vh - 50px);
    padding-top: 50px;
    box-sizing: border-box;

    overflow-x: hidden;
    scrollbar-width: none;
    &::-webkit-scrollbar{
      display: none;
    }

`
const style = {
  display: "flex"
};





const MobileChatcontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [unreadview, setUnreadview] = useState(false);
  const [useritems, setUseritems] = useState([]);
  const [chatitems, setChatitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(true);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setUnreadview(unreadview);
    setUseritems(useritems);
    setChatitems(chatitems);
    setCurrentloading(currentloading);
  },[refresh])

  const _handleUnread = (unread) =>{
    setUnreadview(unread);
  }


 /**
  * USERS 정보를 모두 가져온다
  * 
  * 
  */
  useEffect(()=>{

    const USERS_ID = user.users_id;
    let blocked = [];

    async function FetchData(){
      const users = await readuser();
      setUseritems(users);
      // 차단한 사람의 방은 목록에서 뺀다 (형 지시 2026-08-12)
      blocked = await ReadBlocked({USERS_ID});
      setRefresh((refresh) => refresh +1);
    }
    FetchData();

    // 대화방 목록은 실시간으로 받는다 — 새 메시지가 오면 목록이 알아서 갱신된다 (형 리뷰 2026-08-12)
    const unsubscribe = SubscribeChatRooms({USERS_ID}, (rooms)=>{
      const visible = rooms.filter((r)=>{
        const other = r.OWNER_ID === USERS_ID ? r.SUPPORTER_ID : r.OWNER_ID;
        return !blocked.includes(other);
      });
      setChatitems(visible);
      setCurrentloading(false);
      setRefresh((refresh) => refresh +1);
    });

    return () => { if(typeof unsubscribe === 'function') unsubscribe(); };
  }, [])


  return (
    <Container style={containerStyle}>
      {
        currentloading == true ? (<LottieAnimation
           containerStyle={LoadingChatAnimationStyle} animationData={imageDB.loading}
          width={"50px"} height={'50px'}/>):(
          /* 상단 필터(전체·내가 의뢰한·나한테 지원한·안 읽은)는 제거했다 — 형 지시 2026-08-12 */
          <div style={{width:"100%"}}>
            {
              chatitems.length != 0 ?(
                chatitems.map((item)=>(
                  <Chatgate key={item.CHAT_ID} item={item}/>
                ))
              ):(
                <Emptychat content={'대화내역이 없습니다'} height={300}/>
              )
            }
          </div>)
      }
    
    </Container>
  );

}

export default MobileChatcontainer;

