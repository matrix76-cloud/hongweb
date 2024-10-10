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
import { CHATIMAGETYPE, CHATSELECTFILTER, EventItems, PCCOMMNUNITYMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { ReadCommunity, ReadCommunitySummary, ReadCommunityTop10 } from "../../service/CommunityService";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";
import Emptychat from "../../components/Emptychat";
import { readuser } from "../../service/UserService";
import { ReadChat } from "../../service/ChatService";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChatAnimationStyle } from "../../screen/css/common";

const Container = styled.div`
    background-color : #fff;
    height:900px;
    padding-top:50px;

    overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
    overflow-y: scroll; /* Y축 스크롤은 허용 */
    scrollbar-width: none; /* Firefox용 - 스크롤바 숨기기 */
    &::-webkit-scrollbar{
      display: none;
    }

`
const style = {
  display: "flex"
};


const ReadAlertLayout = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #ededed;
  margin-right:5px;
  padding-left:30px;
  position: fixed;
  background: #fff;
  z-index: 3;


`
const ReadAlertText = styled.div`
  color:#131313;
  font-size:14px;
`
const FilterLayer = styled.div`
  border: 1px solid #ededed;
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  margin-right: 5px;
  background-color : ${({enable}) => enable == true ? ("#5b5959"):("#fff")};
  color : ${({enable}) => enable == true ? ("#fff"):("#131313")};
  font-family :${({enable}) => enable == true ? ("Pretendard-SemiBold"):("Pretendard")};


`

const FilterType = {

}


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

  const [allselect, setAllselect] = useState(true);
  const [ownerselect, setOwnerselect] = useState(false);
  const [supporterselect, setSupporterselect] = useState(false);
  const [unreadselect, setUnreadselect] = useState(false);

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
    setAllselect(allselect);
    setOwnerselect(ownerselect);
    setSupporterselect(supporterselect);
    setUnreadselect(unreadselect);

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

    async function FetchData(){
      const users = await readuser();
      setUseritems(users);
      const USERS_ID = user.users_id;


      const chatitems = await ReadChat({USERS_ID});
    

      if(chatitems != -1){
        setChatitems(chatitems);
      }


      setCurrentloading(false);

      setRefresh((refresh) => refresh +1);

      console.log("TCL: FetchData -> chatitems", chatitems)
    }
    FetchData();
  }, [])

  const _handleChatFilter = (filter)=>{
    if(filter == CHATSELECTFILTER.ALL){

      setAllselect(true);
      setOwnerselect(false);
      setSupporterselect(false);
      setUnreadselect(false);

    }else if(filter == CHATSELECTFILTER.OWNER){

      setAllselect(false);
      setOwnerselect(true);
      setSupporterselect(false);
      setUnreadselect(false);

    }else if(filter == CHATSELECTFILTER.SUPPORT){
     
      setAllselect(false);
      setOwnerselect(false);
      setSupporterselect(true);
      setUnreadselect(false);

    }else if(filter == CHATSELECTFILTER.UNREAD){
      setAllselect(false);
      setOwnerselect(false);
      setSupporterselect(false);
      setUnreadselect(true);
    }

    setRefresh((refresh) => refresh +1);
  }


  return (
    <Container style={containerStyle}>
      {
        currentloading == true ? (<LottieAnimation
           containerStyle={LoadingChatAnimationStyle} animationData={imageDB.loading}
          width={"50px"} height={'50px'}/>):( <Row margin={'0px auto;'} width={'100%'} height={'100%'} >
          <Column style={{background:"#fff", width:"100%", height:"100%", justifyContent:"flex-start", borderRight: "1px solid #ededed"}}>
    
            <ReadAlertLayout>

              <FilterLayer onClick={()=>{_handleChatFilter(CHATSELECTFILTER.ALL)}} enable ={allselect}>{CHATSELECTFILTER.ALL}</FilterLayer>
              <FilterLayer onClick={()=>{_handleChatFilter(CHATSELECTFILTER.OWNER)}}  enable ={ownerselect}>{CHATSELECTFILTER.OWNER}</FilterLayer>
              <FilterLayer onClick={()=>{_handleChatFilter(CHATSELECTFILTER.SUPPORT)}}  enable ={supporterselect}>{CHATSELECTFILTER.SUPPORT}</FilterLayer>
              <FilterLayer onClick={()=>{_handleChatFilter(CHATSELECTFILTER.UNREAD)}}  enable ={unreadselect}>{CHATSELECTFILTER.UNREAD}</FilterLayer>
              

            </ReadAlertLayout>
            <div style={{marginTop:50}}>
            {
              chatitems.length != 0 ?(
              <>
              {
                chatitems.map((item)=>(
                  <Chatgate  item={item}/>
                  
                ))
              }
              </> 
              ):(
                <Emptychat content={'대화내역이 없습니다'} height={300}/>
              )
            }
            </div>
            
        
            
        </Column>
 
      </Row>)
      }
    
    </Container>
  );

}

export default MobileChatcontainer;

