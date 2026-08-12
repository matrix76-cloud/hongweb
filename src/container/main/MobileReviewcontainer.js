import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";


import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATCONTENTTYPE, CHATIMAGETYPE, CONTACTTYPE, EventItems, PCCOMMNUNITYMENU, PCMAINMENU, ReviewContent } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { ReadCommunity, ReadCommunitySummary, ReadCommunityTop10 } from "../../service/CommunityService";
import { DataContext } from "../../context/Data";
import { sleep, useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";
import { distanceFunc } from "../../utility/region";
import { CommaFormatted } from "../../utility/money";
import { WORKNAME,REQUESTINFO } from "../../utility/work";
import {
  SlShield,
  SlPaperClip,
  SlLogout,
  SlUserUnfollow,
} from "react-icons/sl";
import { CreateMessage, CreateMessageEx, CreateMessageEx2, CreateMessageEx3, UpdateDocChat } from "../../service/ChatService";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../api/config";
import { getDateFullTime, getTime, getDate } from "../../utility/date";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChat2AnimationStyle, LoadingChatAnimationStyle } from "../../screen/css/common";
import { uploadImage } from "../../service/UploadService";
import MobileWarningPopup from "../../modal/MobileWarningPopup/MobileWarningPopup";

import MobileContactMainPopup from "../../modal/MobileContactMainPopup/MobileContactMainPopup";
import { RiRectangleFill } from "react-icons/ri";
import ButtonEx from "../../common/ButtonEx";
import Requestdoc from "../../components/Requestdoc";
import { ReadContact, ReadContactByIndividually, UpdateContactByPURCHASE, UpdateContactByResult, UpdateContactByReview } from "../../service/ContactService";
import { GoPlusCircle } from "react-icons/go";


import MobileFailPopup from "../../modal/MobileFailPopup/MobileFailPopup";
import { getFontSize } from "../../utility/fontsize";
const Container = styled.div`
    background-color : #fff;
    height:100vh;
    width : 90%;
    margin : 0 auto;
    padding-top:70px;
    fontSize: () => getFontSize(15)px;

`
const BoxLayer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;

`

const BoxItem = styled.div`
  width: 30%;
  height: 100px;
  background: #f9f9f9;
  margin: 0px 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;

`
const Label = styled.div`

  width: 95%;
  margin: 0px auto 10px;
  font-size: ${() => getFontSize(16)}px;
  line-height:1.7;
`

const ResultContent = {
  width: '90%',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border :'1px solid #dadada',
  borderRadius:'5px',
  height: '150px',
  padding: '5px 10px',
}

const MainDataItem = styled.div`
  padding :10px;
  justify-content : flex-start;
  align-items :flex-start;
  border-radius :5px;
  background-color :  ${({check}) => check == 1 ? "#ff4e193b" : "#fff" }; 
  margin-bottom: 5px;
  border  :1px solid #ededed;
`
const MainDataItemText = styled.span`
  font-size :12px;
  font-family : ${({theme}) =>theme.REGULAR};
  color :  ${({check}) => check == 1 ? "#FF4E19" : "#000" };  

`
const HeaderItem = styled.div`
  font-family : Pretendard-Regular;
  font-size: ${() => getFontSize(16)}px;
  margin-top:10px;
`



const MobileReviewcontainer =({containerStyle, ITEM, OWNER, LEFTIMAGE, LEFTNAME, NAME}) =>  {

  console.log("TCL: MobileCompletecontainer -> ITEM", ITEM)

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
 
  const [registimgfail, setRegistimgfail] = useState(false);

  const [result, setResult] = useState('');
  const [images, setImages] = useState([]);
  const [chatid, setChatid] = useState('');
  const [fail, setFail] = useState(false);
  const [content, setContent] = useState('');
  const [reviewitems, setReviewitems] = useState(ReviewContent)

  const fileInput = useRef();




  useEffect(()=>{
    setResult(result);
    setImages(images);
    setContent(content);
    setReviewitems(reviewitems);
  }, [refresh])

  async function GetCheck(reviewitems_){
    let icount = 0;
    reviewitems_.map((data)=>{
      if(data.count == 1){
        icount++;
      }
    })
    console.log("TCL: getCheck -> reviewitems", reviewitems, icount)
    return icount;
  }

  const _handleCheck = async(index) =>{
    if(reviewitems[index].count == 1){
      reviewitems[index].count = 0;
    }else{

      if(await GetCheck(reviewitems) > 2){

        console.log("TCL: getCheck -> reviewitems", GetCheck(reviewitems))
        alert("최대 3개까지 가능 합니다");
        return;
      }
      reviewitems[index].count = 1;
    }
    setReviewitems(reviewitems);
    setRefresh((refresh) => refresh +1);
  }

  useLayoutEffect(() => {
    reviewitems.map((data)=>{
      data.count = 0;
    })

  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);




  useEffect(()=>{
    async function FetchData(){

    }
    FetchData();
  }, [])

  const _handleComplete = async() =>{
    if(result == ''){
     
    
      setContent("일에 대한 평가를 적고 평가완료 버튼을 클릭해주세요");
      setFail(true);
      setRefresh((refresh) => refresh +1);
      return;
    }
    if(await GetCheck(reviewitems)  == 0 ){

      setContent("한개 이상 매너 평가를 진행해 주시기 바랍니다");
      setFail(true);
      setRefresh((refresh) => refresh +1);
      return;
    }

    const OWNER_ID = ITEM.OWNER_ID;
    const SUPPORTER_ID = ITEM.SUPPORTER_ID;


    const CHAT_ID = ITEM.CHAT_ID;

    let ID = "";
    if(ITEM.TYPE == PCMAINMENU.HOMEMENU){
      ID = ITEM.INFO.WORK_ID;
    }else {
      ID = ITEM.INFO.ROOM_ID;
    }


    const CONTACTITEM = await ReadContactByIndividually({ID, OWNER_ID, SUPPORTER_ID});

    const CONTACT_ID = CONTACTITEM.CONTACT_ID;


    await UpdateContactByReview({CONTACT_ID});

    await sleep(100);

    const read = [];
    const users_id = user.USERS_ID;
    const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.REVIEW;
    read.push(user.USERS_ID);

    const msgitems = [];
    msgitems.push(ITEM.OWNER.USERINFO.nickname +"님이 작업 한 내용에 대해 평가를 해주셨습니다.");
    msgitems.push(ITEM.SUPPORTER.USERINFO.nickname+"님 입금계좌로 24시간 이내로 용역비가 입금 되겠습니다");


    let RESULTITEM ={
      result : "",
      items : []
    }
    RESULTITEM.result = result;
    RESULTITEM.items = reviewitems;

    let resultitems = [];
    resultitems.push(RESULTITEM);
    await CreateMessageEx3({
      CHAT_ID,
      msgitems,
      resultitems,
      users_id,
      read,
      CHAT_CONTENT_TYPE,

    
    });
    await sleep(1000);

    navigate("/Mobilecontent" ,{state :{ITEM :ITEM, OWNER : OWNER, NAME: NAME, LEFTIMAGE:LEFTIMAGE, LEFTNAME:LEFTNAME}});


  }
  const failcallback = () =>{
    setFail(false);
    setRefresh((refresh) => refresh +1);
  }
  return (
    <Container style={containerStyle}>

      { 
        fail == true && <MobileWarningPopup callback={failcallback} content={content} />
      }

      <Label>일꾼이 작업 하신 내용에 대해 간단하게 평가 해주세요. 평가가 완료되면 일꾼에게 용역비가 입금 됩니다
        평가 내용은 체팅창에 보여지지는 않습니다
      </Label>
      <BoxLayer>

        <textarea style={ResultContent} value={result}
        placeholder={'간단하게 일꾼에 대해 평가를 적어주세요'}
          onChange={(e) => {
            setResult(e.target.value);
            setRefresh((refresh) => refresh +1);
        }}
        />

        <HeaderItem>매너평가를 해주세요(최대 3개까지 선택가능)</HeaderItem>  

        <FlexstartColumn style={{marginTop:10}}>
        {
          ReviewContent.map((data, index)=>(
            <MainDataItem check={data.count>0} onClick={()=>{_handleCheck(index)}}>
              <MainDataItemText check={data.count>0}>
              <FlexstartRow>
                <div style={{fontSize: () => getFontSize(16)}}>{data.imagecontent}</div>
                <div style={{paddingLeft:10,fontSize: () => getFontSize(16),fontFamily:"Pretendard-Light"}}>{data.content}</div>
        
              </FlexstartRow>
              
            </MainDataItemText>
            </MainDataItem>
          ))
        }

        </FlexstartColumn>
      </BoxLayer>

            
      <div style={{margin:"20px auto 50px", width:"100%"}}>
              <ButtonEx text={'평가완료'} width={'100'}  
              onPress={_handleComplete} bgcolor={'#FF7125'} color={'#fff'} />
      </div>
     


    </Container>
  );

}

export default MobileReviewcontainer;

