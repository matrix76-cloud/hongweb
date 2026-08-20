import React, { Component, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATCONTENTTYPE, CHATIMAGETYPE, EventItems, FILTERITMETYPE, PCCOMMNUNITYMENU } from "../../utility/screen";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";
import ChatprofileImage from "../../components/ChatprofileImage";
import { IoCallOutline, IoMapOutline } from "react-icons/io5";
import MobileWorkMapPopup from "../../modal/MobileMapPopup/MobileWorkMapPopup";
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import MobileSchedulePopup from "../../modal/MobileSchedulePopup/MobileSchedulePopup";
import { distanceFunc, shortRegion } from "../../utility/region";
import { CommaFormatted } from "../../utility/money";
import MobileContact from "../../modal/MobileContactPopup/MobileContactPopup";
import { WORKNAME,REQUESTINFO } from "../../utility/work";
import {
  SlShield,
  SlPaperClip,
  SlLogout,
  SlUserUnfollow,
  SlOptionsVertical,
  SlTrash,
  SlCalender,
} from "react-icons/sl";
import { CreateMessage, MarkRead, DeleteMessageForMe, DeleteMessageForAll, ExitChat, ReportChat, BlockUser } from "../../service/ChatService";
import { workOf, msgTimeOf } from "../../utility/chat";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../api/config";
import { getDateFullTime, getTime, getDate } from "../../utility/date";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChat2AnimationStyle, LoadingChatAnimationStyle } from "../../screen/css/common";
import { uploadImage } from "../../service/UploadService";
import MobileWarningPopup from "../../modal/MobileWarningPopup/MobileWarningPopup";
import { setRef } from "@mui/material";
import MobileContactSign from "../../modal/MobileContactSignPopup/MobileContactSignPopup";
import MobileContactDoc from "../../modal/MobileContactDocPopup/MobileContactDocPopup";
import MobilePayPopup from "../../modal/MobilePayPopup/MobilePayPopup";
import { startCall } from "../../service/CallService";
import { ReadWorkByIndividually } from "../../service/WorkService";

const Container = styled.div`
    background-color : var(--surface);
    height:900px;
    padding-top:50px;
`
const style = {
  display: "flex"
};


const ReadAlertLayout = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--border-soft);
  margin-right:5px;

  padding-left:20%;


`
const ReadAlertText = styled.div`
  color:var(--text);
  font-size:16px;
`


const InfoBox = styled.div`
  font-size: 14px;
  margin: 15px 0px 5px;
  border:  1px solid var(--border-soft);
  margin: 10px auto;
  width: 85%;
  padding: 10px;
  text-align: left;
  line-height: 2;
  border-radius: 10px;
  color: var(--text);

`

const ItemLeftlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top:10px;
  width:${({width}) => width};
`
const ItemLeftBox = styled.div`
background: var(--surface);
border-radius: 10px;
padding: 20px;
margin: 5px 10px 0px;
color: var(--text);
display: flex;
flex-direction: column;
width: ${({width}) => width};
font-size: 16px;
text-align: left;
min-width:220px;
font-weight:400;


`;
const ItemRightLayer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const ItemRightBox = styled.div`
  background: var(--surface);
  border-top-right-radius: 0px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border : 1px solid #F75100;
  padding: 10px 16px;
  margin: 10px 10px 0px;
  color: #000;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 16px;
  text-align: left;
`;

/* 상단 일감 요약 바 — 헤더(50px) 바로 아래 고정. 버튼을 absolute 로 띄워 겹치던 걸 flex 로 폈다.
   (형 지시 2026-08-12) */
const Enter = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 4;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border-soft);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
`

const EnterButton = styled.div`
  flex: none;
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`
const StoreName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StoreAddr = styled.div`
  font-size: 13px;
  color: #A3A3A3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StorePrice = styled.div`
  font-size: 14px;
  color: var(--text);
`

const StoreIntroduce = styled.div`
  font-size: 14px;

`

const Content = styled.div`
  /* 위 고정줄(Enter)이 사진·이름을 빼면서 낮아졌다. 그만큼 당겨준다. (형 지적 2026-08-20) */
  padding-top: 60px;
`
const SupportTag = styled.div`
  font-size: 13px;
  color: #A3A3A3;
  /* 좁은 칸에서 "의 뢰" 로 쪼개져 세로로 서던 것 — 줄바꿈을 막는다 (형 지적 2026-08-20) */
  flex: none;
  white-space: nowrap;
  margin-right: 6px;
  display: flex;
  align-items: center;
`

const OwnerTag = styled.div`
  font-size: 13px;
  color: #A3A3A3;
  /* 좁은 칸에서 "의 뢰" 로 쪼개져 세로로 서던 것 — 줄바꿈을 막는다 (형 지적 2026-08-20) */
  flex: none;
  white-space: nowrap;
  margin-right: 6px;
  display: flex;
  align-items: center;
`
const BottomLine = styled.div`
  background-color: var(--surface);
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  border-top: 1px solid var(--border-soft);
  padding: 8px 12px calc(8px + var(--safe-bottom));
  z-index: 5;
`;
const ChatbtnLayer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row;
`;
const ChatIconLayer = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const InputChat = styled.textarea`
  flex: 1;
  min-width: 0;
  height: 42px;
  box-sizing: border-box;
  resize: none;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: 0;
  font-family: "Pretendard-Regular";
  font-size: 16px;
  line-height: 1.4;
  padding: 10px 12px;
  color: var(--text);
  background: var(--bg-soft);
`;

const ShowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom:100px;
  width:100%;

`;

const ItemLayerA = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom:5px;
`;
const ChatUserImg = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #000;
  padding-left: 10px;
  font-size: 12px;
`;
const ItemLayerAname = styled.div`
  justify-content: flex-start;
  font-size: 14px;
  color: #71717a;
  flex-direction: row;
  display: flex;
  padding-left: 6px;
  margin-bottom: 2px;
`;
const ItemLayerAcontent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const ItemLayerAdate = styled.div`
  font-size: 13px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2px;
  color:#A3A3A3;
  white-space: nowrap;
`;

const ItemLayerB = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ItemLayerBBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;


`;

/* 상대 말풍선 — 폭을 60%로 못박아 짧은 말도 넓게 벌어졌다. 내용만큼만 차지하게 바꿨다.
   (형 지시 2026-08-12) */
const ItemBoxA = styled.div`
  background: #F4F4F5;
  border-radius: 14px;
  border-top-left-radius: 4px;
  padding: 10px 13px;
  margin: 2px 8px 0px 4px;
  color: var(--text);
  display: inline-block;
  max-width: 72%;
  width: fit-content;
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
  word-break: break-word;
  white-space: pre-wrap;
`;

/* 내 말풍선 — 노란색(#FFE477)은 브랜드와 겉돌아 옅은 포인트색으로 바꿨다 */
const ItemBoxB = styled.div`
  background: #FFEDE6;
  border-radius: 14px;
  border-top-right-radius: 4px;
  padding: 10px 13px;
  margin: 2px 8px 0px;
  color: var(--text);
  display: inline-block;
  max-width: 72%;
  width: fit-content;
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
  word-break: break-word;
  white-space: pre-wrap;
`;


const ItemLayerBdate = styled.div`
  font-size: 13px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2px;
  color:#A3A3A3;
  white-space: nowrap;
`;

/* 주소 옆 '지도로 보기' */
const MapLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 8px;
  color: #FF4E19;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const VoiceToast = styled.div`
  position: fixed;
  bottom: 96px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1300;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(0,0,0,.8);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const MoreBtn = styled.button`
  flex: none;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

/* 나가기 · 신고 · 차단 — 아래에서 올라오는 시트 */
const MenuDim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: flex-end;
`;
const MenuSheet = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: var(--surface);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 8px 8px calc(8px + var(--safe-bottom));
`;
/* 의뢰내역 — 대화방 윗줄에 늘어놓지 않고 버튼으로 연다 (형 지시 2026-08-20) */
const RequestBtn = styled.button`
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  background: none;
  border: 1px solid var(--border-soft);
  border-radius: 6px;
  font-family: Pretendard;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`;
const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 14px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  color: ${({$danger}) => ($danger ? '#c02020' : 'var(--text)')};
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`;

/* 삭제 버튼 — 말풍선을 누르면 나타난다 */
const DeleteRow = styled.div`
  display: flex;
  gap: 6px;
  align-self: flex-end;
  margin: 4px 10px 0 0;
`;
const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  color: ${({$danger}) => ($danger ? '#c02020' : '#71717a')};
  cursor: pointer;
`;

/* 일정 카드 */
const ScheduleCard = styled.div`
  display: inline-block;
  width: fit-content;
  max-width: 72%;
  margin: 2px 8px 0;
  padding: 12px 14px;
  border: 1px solid #FFD9CC;
  border-radius: 14px;
  background: #FFF8F5;
  cursor: pointer;
`;
const ScheduleHead = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #FF4E19;
  margin-bottom: 6px;
`;
const ScheduleBody = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
`;

/* 지워진 글 자리 */
const DeletedBox = styled.div`
  display: inline-block;
  max-width: 72%;
  width: fit-content;
  margin: 2px 8px 0;
  padding: 10px 13px;
  border: 1px solid #E8E8EA;
  border-radius: 14px;
  background: var(--surface);
  color: #A3A3A3;
  font-size: 15px;
  line-height: 1.5;
`;

/* 날짜 구분선 */
const DateDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0 8px;

  span {
    font-size: 13px;
    color: #71717a;
    background: #F1F1F3;
    border-radius: 999px;
    padding: 5px 12px;
  }
`;

const MobileContentcontainer =({containerStyle, ITEM, OWNER, LEFTIMAGE, LEFTNAME}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [contactpopup, setContactpopup] = useState(false);
  const [contactsignpopup, setContactsignpopup] = useState(false);
  const [contactwritepopup, setContactwritepopup] = useState(false);
  const [paypopup, setPaypopup] = useState(false);
  const [roommenu, setRoommenu] = useState(false);   // 나가기·신고·차단 메뉴
  const [voicenotice, setVoicenotice] = useState(false); // 보이스톡 준비중 안내
  const [dialog, setDialog] = useState(null);            // 확인·입력·알림 창 (브라우저 기본창 대신)
  const [mappopup, setMappopup] = useState(false);       // 일감 위치 지도
  const [schedulepopup, setSchedulepopup] = useState(false); // 일정 잡기
  const [pickedmsg, setPickedmsg] = useState(null);  // 삭제하려고 고른 내 글
  const [downloadpopup, setDownloadpopup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatid, setChatid] = useState(ITEM.CHAT_ID);

  const [leftname, setLeftname] = useState('');
  const [leftimage, setLeftimage] = useState('');

  const [currentloading, setCurrentloading] = useState(false);
  const [registimgfail, setRegistimgfail] = useState(false);



  const fileInput = useRef();




  useEffect(()=>{
    setLeftimage(leftimage);
    setLeftname(leftname);
    setCurrentloading(currentloading);
    setRegistimgfail(registimgfail);
    setContactsignpopup(contactsignpopup);
    setContactwritepopup(contactwritepopup);
    setPaypopup(paypopup);
    setDownloadpopup(downloadpopup);
  }, [refresh])


  useEffect(() => {
    const q = query(
      collection(db, `CHAT/${chatid}/messages`),
      orderBy("CREATEDT", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const m = doc.data();
        // '나만 삭제' 한 글은 내 화면에서만 뺀다 (형 지시 2026-08-12)
        if (Array.isArray(m.DELETED_FOR) && m.DELETED_FOR.includes(user.users_id)) return;
        list.push(m);
      });

      // 자신이 read 사용자에 없다면 자신을 read로 업데이트 하자
     

      setMessages(list);

     if(list.length < 5){
      window.scrollTo(0, 0);
     }else{
      window.scrollTo(0, document.body.scrollHeight);
     }
    


    });

    // 방에 들어왔으니 내 안읽음 수를 0 으로 (목록·뱃지에 반영된다)
    MarkRead({ CHAT_ID: chatid, USERS_ID: user.users_id });

    return () => unsubscribe();
  }, []);


  
  useLayoutEffect(() => {
    if (messages.length > 10) {
          window.scrollTo(0, document.body.scrollHeight);  
    }

  })

  const handleUploadClick = (e) => {
    fileInput.current.click();
  };

  const ALLOW_IMAGE_FILE_EXTENSION = "jpg,jpeg,png,bmp";

  const ImagefileExtensionValid = (name) => {
    const extention = removeFileName(name);

    if (
      ALLOW_IMAGE_FILE_EXTENSION.indexOf(extention) <= -1 ||
      extention == ""
    ) {
      return false;
    }
    return true;
  };
  const removeFileName = (originalFileName) => {
    const lastIndex = originalFileName.lastIndexOf(".");

    if (lastIndex < 0) {
      return "";
    }
    return originalFileName.substring(lastIndex + 1).toLowerCase();
  };

  const ImageUpload = async (data, data2) => {
    const uri = data;
    const email = data2;
    const URL = await uploadImage({ uri, email });
    return URL;
  };
  
  
  const handlefileuploadChange = async (e) => {
    let filename = "";
    const file = e.target.files[0];
    filename = file.name;


    if (!ImagefileExtensionValid(filename)) {

      setRegistimgfail(true);
      setRefresh((refresh) => refresh +1);
      return;
    }

    var p1 = new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let img = reader.result;
        resolve(img);
      };
    });
    const getRandom = () => Math.random();
    const email = getRandom();

    p1.then(async (result) => {
      const uri = result;
      console.log("uri", uri);

      let msg = await ImageUpload(uri, email);
      const IMGTYPE = true;

      let read= [];
      read.push(user.users_id);


      try {
  
        const CHAT_ID = chatid;
        const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.IMAGE;
  
 
        const users_id = user.users_id;
        await CreateMessage({
          CHAT_ID,
          msg,
          users_id,
          read,
          CHAT_CONTENT_TYPE,
        
        });
      } catch (e) {
        console.log("error", e);
      }
    });
  };

  const _handlesend = async () => {

    if (message == '') {
      return;
    }
    const msg = message;
    setRefresh((refresh) => refresh + 1);

    let read= [];
    read.push(user.users_id);



    document.getElementById('yourTextInputId').blur();
    document.getElementById('yourTextInputId').focus();

    try {
  
      const CHAT_ID = chatid;
      const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.TEXT;

      const users_id = user.users_id;
      await CreateMessage({
        CHAT_ID,
        msg,
        users_id,
        read,
        CHAT_CONTENT_TYPE,
      
      });
    } catch (e) {
      console.log("error", e);
    }
    setMessage("");
  };


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setContactpopup(contactpopup);
  },[refresh])


  useEffect(()=>{
    async function FetchData(){
  
    }
    FetchData();
  }, [])
  const _handlebuy = () =>{

  }
  const _handleapply = () =>{
    
  }
  const _handlelicense = () =>{
    
  }

  /** 일정 보내기 — 대화에 카드로 남는다 */
  const _handlesendschedule = async ({ label, time, memo }) =>{
    setSchedulepopup(false);
    const text = [label, time, memo].filter(Boolean).join('\n');
    await CreateMessage({
      CHAT_ID: chatid,
      msg: text,
      users_id: user.users_id,
      read: [user.users_id],
      CHAT_CONTENT_TYPE: CHATCONTENTTYPE.SCHEDULE,
    });
  }

  /**
   * 일감 위치. 등록할 때 고른 지역(CUSTOMERREGION)에 좌표가 들어있다.
   * 없으면 지도 버튼을 감춘다. (형 지시 2026-08-12)
   */
  const regionPoint = (() =>{
    const list = workOf(ITEM).WORK_INFO || [];
    const d = list.find((x)=> x && x.requesttype === REQUESTINFO.CUSTOMERREGION && x.latitude);
    return d ? { lat: d.latitude, lng: d.longitude, addr: d.result } : null;
  })();

  const _handlemapview = () =>{
    if(!regionPoint) return;
    setMappopup(true);
  }

  /**
   * 보이스톡 — 통화를 걸고 통화 화면으로 간다. (2026-08-13)
   * 상대에게는 푸시가 가고, 그 알림의 link 가 같은 화면을 연다.
   * 즉 상대가 앱을 보고 있으면 상단 배너[받기], 아니면 OS 알림 -> 둘 다 여기로 들어온다.
   */
  const _handlevoice = async () =>{
    const TARGET_ID = OWNER == true ? ITEM.SUPPORTER_ID : ITEM.OWNER_ID;
    if(!TARGET_ID || !user?.users_id){
      setVoicenotice(true);
      setTimeout(()=>{ setVoicenotice(false); }, 2000);
      return;
    }

    try{
      const CALL_ID = await startCall({
        callerId : user.users_id,
        callerName : user.nickname,
        calleeId : TARGET_ID,
        chatId : chatid,
      });
      navigate(`/Mobilecall?id=${CALL_ID}`);
    }catch(e){
      console.error('[call] 통화 걸기 실패', e);
      setVoicenotice(true);
      setTimeout(()=>{ setVoicenotice(false); }, 2000);
    }
  }

  /* 올린 사람이 보이스톡을 허용한 일감인가. (형 지시 2026-08-20)
   *
   * 대화방이 들고 있는 INFO 는 방을 만들 때 굳은 복사본이다. 일감 주인이 나중에
   * 설정을 바꿔도 이미 열린 방에는 반영되지 않는다. 그래서 WORK_ID 로 지금 값을 다시 읽는다.
   * 일감 상세(MobileWorkReport)도 같은 방식으로 읽고 있어서 두 화면이 어긋나지 않는다.
   */
  const [voiceAllowed, setVoiceAllowed] = useState(false);

  useEffect(() => {
    let alive = true;
    const WORK_ID = workOf(ITEM)?.WORK_ID;
    if (!WORK_ID) return undefined;

    (async () => {
      try {
        const w = await ReadWorkByIndividually({ WORK_ID });
        if (alive) setVoiceAllowed(w?.WORK_OPTION?.VOICETALK === true);
      } catch (e) {
        // 못 읽으면 안 보여주는 쪽으로 둔다 — 안 받겠다는 사람에게 전화가 가면 안 된다
        if (alive) setVoiceAllowed(false);
      }
    })();

    return () => { alive = false; };
  }, [ITEM?.CHAT_ID]);

  // 결제 (의뢰한 사람만 누를 수 있다)
  const _handlepay = () =>{
    setPaypopup(true);
    setRefresh((refresh) => refresh +1 );
  }

  /** 나만 삭제 — 내 화면에서만 사라진다. 상대에게는 그대로 남는다 */
  const _handledeleteforme = async (data) =>{
    if(!data) return;
    await DeleteMessageForMe({ CHAT_ID: chatid, MESSAGE_ID: data.MESSAGE_ID, USERS_ID: user.users_id });
    setPickedmsg(null);
  }

  /** 모두에게 삭제 — 내 글만. 양쪽에 "삭제된 메시지입니다" 로 남는다 */
  const _handledeleteforall = (data) =>{
    if(!data || data.USERS_ID != user.users_id) return;
    setDialog({
      title: '모두에게 삭제',
      message: '상대 화면에는 "삭제된 메시지입니다" 로 남습니다.',
      confirmText: '삭제',
      danger: true,
      onConfirm: async () =>{
        setDialog(null);
        await DeleteMessageForAll({ CHAT_ID: chatid, MESSAGE_ID: data.MESSAGE_ID, USERS_ID: user.users_id });
        setPickedmsg(null);
      },
    });
  }

  /** 대화방 나가기 — 방은 지우지 않는다. 상대에게는 대화가 남아야 한다 */
  const _handleexit = () =>{
    setRoommenu(false);
    setDialog({
      title: '대화방 나가기',
      message: '나가면 이 대화가 목록에서 사라집니다.\n상대에게는 대화가 그대로 남습니다.',
      confirmText: '나가기',
      danger: true,
      onConfirm: async () =>{
        setDialog(null);
        await ExitChat({ CHAT_ID: chatid, USERS_ID: user.users_id, nickname: user.nickname });
        navigate('/Mobilechat');
      },
    });
  }

  /** 신고 — 사유를 받아 REPORT 로 쌓는다 */
  const _handlereport = () =>{
    setRoommenu(false);
    setDialog({
      title: '신고하기',
      message: '어떤 점이 문제였는지 알려주세요.',
      input: { placeholder: '욕설 · 사기 · 광고 등' },
      confirmText: '신고',
      onConfirm: async (reason) =>{
        const TARGET_ID = OWNER == true ? ITEM.SUPPORTER_ID : ITEM.OWNER_ID;
        await ReportChat({ CHAT_ID: chatid, USERS_ID: user.users_id, TARGET_ID, REASON: reason });
        setDialog({
          title: '신고가 접수되었습니다',
          message: '확인 후 조치하겠습니다.',
          alertonly: true,
          onConfirm: ()=> setDialog(null),
        });
      },
    });
  }

  /** 차단 — 차단하면 그 사람 방은 내 목록에서 빠진다 */
  const _handleblock = () =>{
    setRoommenu(false);
    setDialog({
      title: '차단하기',
      message: '차단하면 이 사람과의 대화가 목록에서 사라집니다.',
      confirmText: '차단',
      danger: true,
      onConfirm: async () =>{
        setDialog(null);
        const TARGET_ID = OWNER == true ? ITEM.SUPPORTER_ID : ITEM.OWNER_ID;
        await BlockUser({ USERS_ID: user.users_id, TARGET_ID });
        await ExitChat({ CHAT_ID: chatid, USERS_ID: user.users_id, nickname: user.nickname });
        navigate('/Mobilechat');
      },
    });
  }

  // 메인 다이랄로그 열기 위해 사용
  const _handlecontact = () =>{
    setContactpopup(true);
    setRefresh((refresh) => refresh +1 );
  }
  // 메인 다이랄로그 닫기 위해 사용
  const MobileContactCallback = () =>{
    setContactpopup(false);
    setRefresh((refresh) => refresh +1 );
  }

  /**
   * 열기위해 사용
   */
  const MobileContactsignCallbackOpen =() =>{
    setContactsignpopup(true);
    setRefresh((refresh) => refresh +1 );
  }

  const MobileContactdownloadCallbackOpen =() =>{
    setDownloadpopup(true);
    setRefresh((refresh) => refresh +1 );
  }

  const MobilePayCallbackOpen =() =>{
    setPaypopup(true);
    setRefresh((refresh) => refresh +1 );
  }
  /**
   * 두단계 콜백을 거쳐서 오늘 콜백 닫기 위해 사용
   * ! MobileContactsingCallback / MobileContactdownloadCallback /  MobilePaypopupCallback
   */
  const MobileContactsignCallback = () =>{
    setContactsignpopup(false);
    setRefresh((refresh) => refresh +1 );
  }

  const MobilePaypopupCallback =()=>{
    setPaypopup(false);
    setRefresh((refresh) => refresh +1 );
  }
  
  const MobileContactdownloadCallback = () =>{
    setDownloadpopup(false);
    setRefresh((refresh) => refresh +1 );
  }

  const MobilePayCallback = () =>{
    setPaypopup(false);
    setRefresh((refresh) => refresh +1 );
  }



  const findPrice = () =>{
    /* 금액 문항이 없는 일감이면 -1 이 나와 WORK_INFO[-1].result 에서 터졌다. 없으면 빈 값으로 둔다. */
    const list = workOf(ITEM).WORK_INFO || [];
    const FindIndex = list.findIndex(x=>x.requesttype == REQUESTINFO.MONEY);

    return FindIndex < 0 ? '' : list[FindIndex].result;
  }

  /* 의뢰내역은 홈에서 일감을 눌렀을 때와 같은 화면(/Mobilework)으로 보낸다.
     시트로 따로 그리다가, 홈에서 보던 것과 같게 해달라고 하셔서 그 화면을 그대로 쓴다. (형 지시 2026-08-20) */
  const _handlerequestview = () =>{
    navigate("/Mobilework", {
      state: {
        WORK_ID : workOf(ITEM).WORK_ID,
        TYPE : FILTERITMETYPE.HONG,
        WORKTYPE : workOf(ITEM).WORKTYPE || ITEM.WORKTYPE || '',
        FROMCHAT : true,          // 하단 지원 버튼줄을 숨긴다 (형 지시 2026-08-20)
      },
    });
  }

  const imguploadwarningcallback = () =>{
    setRegistimgfail(false);
    setRefresh((refresh) => refresh +1);
  }
  return (
    <Container style={containerStyle}>

      {
        registimgfail == true && <MobileWarningPopup callback={imguploadwarningcallback} content ={'업로드 대상 파일의 확장자는 bmp, jpg, jpeg, png 만 가능 합니다'} />
      }
      {
        contactpopup == true && <MobileContact 
        WORK_ID ={workOf(ITEM).WORK_ID}
        OWNER_ID={ITEM.OWNER_ID}
        SUPPORTER_ID ={ITEM.SUPPORTER_ID}
        CHAT_ID={ITEM.CHAT_ID}
        callback={MobileContactCallback} 
        btn1callback={MobileContactsignCallbackOpen}
        btn2callback={MobilePayCallbackOpen}
        btn3callback={MobileContactdownloadCallbackOpen}/>
      }

      {
        contactsignpopup == true && <MobileContactSign callback={MobileContactsignCallback} 
        messages={workOf(ITEM).WORK_INFO} 
        WORK_ID ={workOf(ITEM).WORK_ID}
        OWNER_ID={ITEM.OWNER_ID}
        SUPPORTER_ID ={ITEM.SUPPORTER_ID}
        OWNER ={OWNER}
        WORKTYPE={ITEM.WORKTYPE}/>
      }

      {
        paypopup == true && (
          <MobilePayPopup
            callback={MobilePaypopupCallback}
            amount={findPrice()}                 /* 등록된 일감 금액 그대로 */
            orderName={ITEM.WORKTYPE || workOf(ITEM).WORKTYPE}
            workId={workOf(ITEM).WORK_ID}
          />
        )
      }

      {
        mappopup == true && regionPoint && (
          <MobileWorkMapPopup
            callback={()=>{ setMappopup(false); }}
            latitude={regionPoint.lat}
            longitude={regionPoint.lng}
            top={'25%'} left={'8%'} height={'300px'} width={'84%'}
            name={workOf(ITEM).WORKTYPE}
          />
        )
      }

      {
        schedulepopup == true && (
          <MobileSchedulePopup
            onClose={()=>{ setSchedulepopup(false); }}
            onSubmit={_handlesendschedule}
          />
        )
      }

      {
        voicenotice == true && <VoiceToast>지금은 통화를 걸 수 없어요</VoiceToast>
      }

      {
        dialog && (
          <MobileConfirmPopup
            {...dialog}
            onCancel={()=>{ setDialog(null); }}
          />
        )
      }

      {
        roommenu == true && (
          <MenuDim onClick={()=>{ setRoommenu(false); }}>
            <MenuSheet onClick={(e)=> e.stopPropagation()}>
              <MenuItem onClick={_handleexit}>
                <SlLogout size={18} color="var(--text-sub)" /> 대화방 나가기
              </MenuItem>
              <MenuItem onClick={_handlereport}>
                <SlShield size={18} color="var(--text-sub)" /> 신고하기
              </MenuItem>
              <MenuItem $danger onClick={_handleblock}>
                <SlUserUnfollow size={18} color="#c02020" /> 차단하기
              </MenuItem>
            </MenuSheet>
          </MenuDim>
        )
      }

      {
        downloadpopup == true && <MobileContactDoc callback={MobileContactdownloadCallback} 
        messages={workOf(ITEM).WORK_INFO} 
        WORK_ID ={workOf(ITEM).WORK_ID}
        OWNER_ID={ITEM.OWNER_ID}
        SUPPORTER_ID ={ITEM.SUPPORTER_ID}
        OWNER ={OWNER}
        WORKTYPE={ITEM.WORKTYPE}/>
      }
      



      <Row margin={'0px auto;'} width={'100%'} height={'100%'} >
        <Column style={{background:"var(--surface)", width:"100%", height:"100%", justifyContent:"flex-start", borderRight: "1px solid var(--border-soft)"}}>
          <Enter>
            {/* 위 헤더에 "OOO 님과 대화" 로 사진과 이름이 이미 나와 있었다 — 같은 것이 두 번이라 여기서는 뺐다.
                남는 줄에는 일감 정보만 둔다. (형 지적 2026-08-20) */}
            <div style={{flex:1, minWidth:0}}>
              <FlexstartRow style={{alignItems:"center"}}>
                {
                  OWNER == true ? (<OwnerTag>의뢰</OwnerTag>):(<SupportTag>지원</SupportTag>)
                }

              {/* 종류·지역·금액·지도를 한 줄에 늘어놓던 자리다. 한 줄에 다 안 들어가 잘려서,
                  버튼 하나로 바꾸고 내용은 눌러서 보게 했다. (형 지시 2026-08-20) */}
              <RequestBtn onClick={_handlerequestview}>
                의뢰내역 보기
              </RequestBtn>
              </FlexstartRow>
            </div>

            <EnterButton>
                {/* 계약은 없어졌다. 결제만 두고, 일을 맡긴 사람에게만 보인다 (형 지시 2026-08-12) */}
                {OWNER == true && (
                  <Button
                    text={"결제"}
                    onPress={_handlepay}
                    containerStyle={{
                      color: "#fff",
                      background: "#FF4E19",
                      border: "none",
                      width: "62px",
                      height: "34px",
                      fontSize: "14px",
                      marginLeft: "0px",
                      borderRadius: "8px",
                      fontFamily: "Pretendard",
                    }}
                  />
                )}

                {/* 보이스톡 — 올린 사람이 허용한 일감에서만 (형 지시 2026-08-20)
                    일감 상세(MobileWorkReport)는 예전부터 이 조건을 보고 있었는데
                    대화방에만 빠져 있었다. 안 받겠다고 한 일감에서도 버튼이 보이고
                    누르면 그대로 전화가 걸렸다. */}
                {voiceAllowed && (
                  <MoreBtn onClick={_handlevoice} aria-label="음성통화">
                    <IoCallOutline size={19} color="var(--text)" />
                  </MoreBtn>
                )}

                {/* 나가기 · 신고 · 차단 */}
                <MoreBtn onClick={()=>{ setRoommenu(true); }} aria-label="더보기">
                  <SlOptionsVertical size={16} color="var(--text-sub)" />
                </MoreBtn>
            </EnterButton>
          </Enter>
          <Content>
            <InfoBox>
              <div>{'홍여사 시스템에서는 건전한 체팅 문화를 이루기 위해 욕설이나 상대방 비방글을 사용 하는 경우 홍여사 신고센타를 운영하고 있습니다 많은 이용 바랍니다'}</div>
            </InfoBox>
          </Content>
          {
            currentloading == true ? (<LottieAnimation containerStyle={LoadingChat2AnimationStyle} animationData={imageDB.loading}
              width={"50px"} height={'50px'}/>) :(<ShowContainer>
              {messages.map((data, index) => (
                <Fragment key={data.MESSAGE_ID || index}>

                  {/* 날짜가 바뀌면 구분선 (형 지시 2026-08-12) */}
                  {(index === 0 || getDate(msgTimeOf(messages[index - 1])) !== getDate(msgTimeOf(data))) && (
                    <DateDivider><span>{getDate(msgTimeOf(data))}</span></DateDivider>
                  )}
            
                  {(data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.EXIT
                  && data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.ENTER) &&
                    <>
                      {user.users_id != data.USERS_ID ? (
                        <ItemLayerA>
                          <Row>
                            <ChatUserImg>
                              <ChatprofileImage source={LEFTIMAGE} size={36} />
                            </ChatUserImg>
                            <FlexstartColumn>
                              <ItemLayerAname>
                                  {LEFTNAME}
                              </ItemLayerAname>

                              <ItemLayerAcontent>
                                {
                                  data.DELETED_ALL == true ? (
                                    <DeletedBox>삭제된 메시지입니다</DeletedBox>
                                  ) : data.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE ? (<img src={data.TEXT}
                                    onClick={()=>{ setPickedmsg(pickedmsg == data.MESSAGE_ID ? null : data.MESSAGE_ID); }}
                                    style={{width: '70%',
                                    height: '250px',
                                    padding: '10px',
                                    borderRadius: '20px'  
                                    }}
                                  />):(
                                    <ItemBoxA onClick={()=>{ setPickedmsg(pickedmsg == data.MESSAGE_ID ? null : data.MESSAGE_ID); }}>
                                      {data.TEXT}
                                    </ItemBoxA>
                                  )
                                }
                              
                                <ItemLayerAdate>{getTime(msgTimeOf(data))}</ItemLayerAdate>
                              </ItemLayerAcontent>
                            </FlexstartColumn>
                          </Row>
                        </ItemLayerA>
                      ) : (
                        <ItemLayerB>
                          <ItemLayerBBox>
                            {/* {
                              //read 사용자를 계산해서 보여주는 function를 만들자
                              ReadCount(data)> 0 &&
                              <ItemLayerBUnread>{ReadCount(data)}</ItemLayerBUnread>
                            }
                          */}
                            <ItemLayerBdate>{getTime(msgTimeOf(data))}</ItemLayerBdate>
                          </ItemLayerBBox>
                          {
                            data.DELETED_ALL == true ? (
                              <DeletedBox>삭제된 메시지입니다</DeletedBox>
                            ) : data.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE  ? (<img src={data.TEXT}
                              onClick={()=>{ setPickedmsg(pickedmsg == data.MESSAGE_ID ? null : data.MESSAGE_ID); }}
                              style={{width: '70%',
                              height: '250px',
                              padding: '10px',
                              borderRadius: '20px'  
                              }}
                            />):(
                              <ItemBoxB onClick={()=>{ setPickedmsg(pickedmsg == data.MESSAGE_ID ? null : data.MESSAGE_ID); }}>
                                {data.TEXT}
                              </ItemBoxB>
                            )
                          }
                        </ItemLayerB>
                      )
                      }

                      {/* 삭제 — 나만 / 모두에게 (형 지시 2026-08-12) */}
                      {pickedmsg == data.MESSAGE_ID && data.DELETED_ALL != true && (
                        <DeleteRow>
                          <DeleteBtn onClick={()=>{ _handledeleteforme(data); }}>
                            <SlTrash size={13} /> 나만 삭제
                          </DeleteBtn>
                          {data.USERS_ID == user.users_id && (
                            <DeleteBtn $danger onClick={()=>{ _handledeleteforall(data); }}>
                              <SlTrash size={13} /> 모두에게 삭제
                            </DeleteBtn>
                          )}
                        </DeleteRow>
                      )}
                    </>
                  }
            

                </Fragment>
              ))}
          </ShowContainer>)
          }


        </Column>
        <BottomLine>         
            <ChatbtnLayer>
              <ChatIconLayer>
                <SlPaperClip size={20} color={"#000"} onClick={handleUploadClick} />
              </ChatIconLayer>
              {/* 일정 잡기 — 날짜 고르고 내용 적어 보낸다 (형 지시 2026-08-12) */}
              <ChatIconLayer>
                <SlCalender size={20} color={"#000"} onClick={()=>{ setSchedulepopup(true); }} />
              </ChatIconLayer>

              <InputChat
              value={message}
              id="yourTextInputId" autofocus
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
              <Row>
                <Button
                  onPress={_handlesend}
                  text={"전송"}
                  containerStyle={{
                    backgroundColor: "#ffa719",
                    color: "#fff",
                    margin: "10px",
                    border:"none",
                    width: "60px",
                    borderRadius: 5,
                    height: "30px",
                  }}
                />
              </Row>
            </ChatbtnLayer>

            <input
              type="file"
              ref={fileInput}
              onChange={handlefileuploadChange}
              style={{ display: "none", color:"#999" }}
            />
        </BottomLine>
 
      </Row>

   


    </Container>
  );

}

export default MobileContentcontainer;

