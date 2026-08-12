import React, { Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";

import { DataContext } from "../../context/Data";

import "./MobileRegister.css"
import { BetweenColumn, Column, FlexstartColumn } from "../../common/Column";
import Button from "../../common/Button";
import { AroundRow, BetweenRow, Row } from "../../common/Row";
import Fade from "react-reveal/Fade";
import { Requestbabycaremessages, Requestbusinesscleanmessages, Requestcarryloadmessages, Requestcleanmessages, Requestdoghospitalmessages, Requestdogwalkmessages, Requesterrandmessages, Requestfoodpreparemessages, Requestgohospitalmessages, Requestgooutschoolmessages, REQUESTINFO, Requestlessonmessages, Requestmovecleanmessages, Requestpatientcaremessages, Requestrecipetranmitmessages, Requestschooleventmessages, Requestshoppingmessages, WORKNAME, WORKPOLICY } from "../../utility/work";
import { useSleep } from "../../utility/common";
import { imageDB, Seekimage } from "../../utility/imageData";
import Text from "../../common/Text";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { ko, se } from 'date-fns/locale';
import { DAYOPTION, OPTIONTYPE, PCDAYMENU } from "../../utility/screen";
import SelectItem from "../../components/SelectItem";
import { MdDataUsage, MdTurnedInNot } from "react-icons/md";
import { PiPencilSimpleBold } from "react-icons/pi";
import "./table.css";
import { Requestlargemessages, Requestmediummessages, Requestroommessages, Requestsmallmessages, ROOMSIZE } from "../../utility/room";

import { CreateWork, CreateWorkInfo } from "../../service/WorkService";
import ImageUploadComponent from "../../components/ImageUpload";
import Label from "../../common/Label";
import MobileSuccessPopup from "../../modal/MobileSuccessPopup/MobileSuccessPopup";
import { ensureKakao } from "../../utility/kakaoReady";
import WorkPhotoPicker from "../../components/WorkPhotoPicker";



const Container = styled.div`
  background :var(--bg);
  height:3000px;
  display:flex;
  flex-direction:column;
`
const ContentLayer = styled.div`
  display: flex;
  flex-direction : column;
  width: 100%;
  justify-content:center;
  align-items:center;
  margin : 0px auto;
  font-size : 16px;
  font-weight:400;
  color :var(--text);


`

const ResponseContainer = styled.div`
  display: flex;
  flex-direction: row;
  width:100%;
  justify-content: flex-end;
`;

const TitleLayer = styled.div`
  height:150px;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: sticky;
  background: #fffefe;
  width: 100%;
  z-index: 5;
  top: 135px;
  border-top: 1px solid var(--border-soft);
  border-right: 1px solid var(--border-soft);
`
const Title = styled.div`
  font-size: 20px;
  line-height: 1.3;
  font-weight: 700;
  color: var(--text);
`

const Itemlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top:10px;
  width:${({width}) => width};
`

const ItemLeftLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom:5px;
`;

const ItemLeftLayercontent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;


const ItemLeftBox = styled.div`
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  border-top-left-radius: 4px;
  padding: 18px 20px;
  margin: 6px 10px 0px;
  color: var(--text);
  display: flex;
  flex-direction: column;
  width: ${({width}) => width};
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  min-width: 200px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
`;


/* 선택 칩을 담는 2열 그리드.
   전에는 space-between + flex-basis 48% + min-width:min-content 라
   칩마다 폭이 제각각이고(1층 / 엘리베이터 있음) 마지막 홀수 칩이 혼자 늘어나
   줄이 어긋나 보였다. 그리드로 바꿔 폭·높이를 딱 맞춘다. (형 리뷰 2026-08-12) */
const SelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  margin: 12px 0;
`;

/* 선택 칩 — 그리드 칸을 꽉 채운다. 글자가 길면 두 줄로 접히고 칸 높이는 줄끼리 같이 맞는다.
   "홍여사가 준비해주세요" 처럼 한 어절이 칸보다 길면 keep-all 만으로는 글자가 칸 밖으로 삐져나갔다.
   그럴 때만 어절 안에서도 줄을 바꾸게 한다. (형 리뷰 2026-08-12) */
const SelectLayer = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  padding: 10px 8px;
  border: ${({$check}) => $check == true ? ('1.5px solid #FF4E19') : ('1px solid var(--border)')};
  background: ${({$check}) => $check == true ? ('#FFF5F0') : ('#fff')};
  color: ${({$check}) => $check == true ? ('#FF4E19') : ('#131313')};
  font-weight: ${({$check}) => $check == true ? (700) : (500)};
  border-radius: 10px;
  font-size: 15px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
  cursor: pointer;
  transition: all .12s ease;
  word-break: keep-all;
  &:active { transform: scale(0.97); }
`;

/* 답변 밑의 수정 — 눌리는 게 분명하도록 버튼 모양으로 (형 리뷰 2026-08-12) */
const AdjustBtn = styled.button`
  margin: 8px 10px 0 0;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background: var(--surface);
  color: #555;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:active { background: #F5F5F5; }
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
  background: #FF4E19;
  border-top-right-radius: 4px;
  border-top-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  padding: 12px 18px;
  margin: 10px 10px 0px;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  text-align: left;
`;

const RegistHeader = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  z-index: 5;
  width: 100%;
  box-sizing: border-box;
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
  padding: 18px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StepCount = styled.div`
  font-size: 16px;
  color: #A3A3A3;
  font-weight: 500;
  b { color: #FF4E19; font-weight: 700; font-size: 18px; }
`

const ProgressLayer = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  width: 100%;
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
  padding: 12px 20px 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ProgressTrack = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #F0F0F0;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background: #FF4E19;
  width: ${({progress}) => Math.min(100, Math.max(0, progress))}%;
  transition: width .25s ease;
`

const ProgressLayerText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
`

export const StyledCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`



// 캘린더를 불러옴
export const StyledCalendar = styled(Calendar)`

width: 100%;
background: white;
border: 1px solid #a0a096;
line-height: 1.125em;
font-size: 14px; /* 글자 크기 */
text-decoration: none; /* 밑줄 제거 */

.react-calendar__navigation button {
  color: #4d4d4d;
  min-width: 44px;
  background: none;
  font-size: 20px; /* 네비게이션 버튼 글자 크기 */
  margin-top: 8px;
}

.react-calendar__month-view__weekdays__weekday {
  font-size: 14px; /* 요일 이름 글자 크기 */
  color: #6b6b6b;
  font-weight:500;
  text-decoration: none; /* 밑줄 제거 */
}

.react-calendar__tile {
  background: none;
  font-size: 14px; /* 날짜 타일 글자 크기 */
  color: #4d4d4d;
  padding: 5px 6.6667px;
}

.react-calendar__tile--now {
  font-size: 16px;
  font-weight:800;
  color : #0000ff;
 }
 .react-calendar__tile:disabled {
  color: #d6cfcf !important;
 }

.react-calendar__tile--active {
  background: #1087ff;
  color: white;
  border-radius : 20px;
}

.react-calendar__tile--hover {
  background: #1087ff;
}
`;


const ResultContent = {
  width: '350px',
  height: '100px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  marginTop:'15px',
 
}
/* 등록 직전 연락 옵션 (형 리뷰 2026-08-12)
   지원자에게 보이스톡 버튼을 열어줄지 올린 사람이 여기서 정한다 */
const OptionCard = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #E6E6E6;
  border-radius: 12px;
  background: var(--bg-soft);
  padding: 14px 16px;
  margin-top: 14px;
`
const OptionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
`
const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  user-select: none;
`
const OptionLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
`
const OptionDesc = styled.div`
  font-size: 13px;
  color: #8A8A8A;
  line-height: 1.5;
  margin-top: 4px;
`
const Switch = styled.div`
  flex-shrink: 0;
  width: 50px;
  height: 30px;
  border-radius: 100px;
  background: ${({ $on }) => ($on ? '#FF4E19' : '#D8D8D8')};
  padding: 3px;
  box-sizing: border-box;
  transition: background 0.18s ease;
`
const Knob = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background: var(--surface);
  transform: translateX(${({ $on }) => ($on ? '20px' : '0')});
  transition: transform 0.18s ease;
`

const ResultContent2 = {
  width: '180px',
  height: '60px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
 
}
/* 요청 내용 입력칸.
   260x88 에 글자 14px 이라 두 줄만 써도 답답했다. 폭을 카드에 맞추고 높이를 키웠다.
   글자 16px 은 iOS 에서 입력할 때 화면이 확대되는 걸 막아준다. (형 리뷰 2026-08-12) */
const CommentContent = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '132px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 1.6,
  padding: '12px 14px',
  outline:"none",
  resize :"none",
  border:"1px solid var(--border)",
  borderRadius: '10px',
}
const DayBtn = styled.div`
  height: 34px;
  width: 58px;
  border-radius: 5px;
  background: var(--surface);
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({$enable}) => $enable == true ? ('1px solid #F75100') : ('1px solid #C3C3C3')};
  color: var(--text);

`


// kakao 는 전역(window.kakao)을 참조 시점에 읽는다.
// 최상단에서 구조분해하면 SDK 로드 전 undefined 로 굳는다 (Vite=ES모듈, 2026-08-12)

const mapstyle = {
  width:'270px',
  height:'320px'
};


const MobileRegistcontainer =({containerStyle, type, totalset}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [roomimg, setRoomimg] = useState('');
  const [comment, setComment] = useState('');

  console.log("Regist type", type);

  let msgs = [];
  if(type == WORKNAME.HOMECLEAN){
    msgs = Requestcleanmessages;
  }else if(type ==WORKNAME.BUSINESSCLEAN){
    msgs = Requestbusinesscleanmessages;
  }else if(type ==WORKNAME.MOVECLEAN){
    msgs = Requestmovecleanmessages;
  }else if(type ==WORKNAME.FOODPREPARE){
    msgs = Requestfoodpreparemessages;
  }else if(type ==WORKNAME.ERRAND){
    msgs = Requesterrandmessages;
  }else if(type ==WORKNAME.CARRYLOAD){
    msgs = Requestcarryloadmessages;
  }else if(type ==WORKNAME.GOOUTSCHOOL){
    msgs = Requestgooutschoolmessages;
  }else if(type ==WORKNAME.BABYCARE){
    msgs = Requestbabycaremessages;
  }else if(type == WORKNAME.LESSON){ 
    msgs = Requestlessonmessages;
  }else if(type == WORKNAME.PATIENTCARE){ 
    msgs = Requestpatientcaremessages;
  }else if(type == WORKNAME.GOHOSPITAL){ 
    msgs = Requestgohospitalmessages;
  }else if(type == WORKNAME.RECIPETRANSMIT){ 
    msgs = Requestrecipetranmitmessages;
  }else if(type == WORKNAME.GOSCHOOLEVENT){ 
    msgs = Requestschooleventmessages;
  }else if(type == WORKNAME.SHOPPING){ 
    msgs = Requestshoppingmessages;
  }else if(type == WORKNAME.GODOGHOSPITAL){ 
    msgs = Requestdoghospitalmessages;
  }else if(type == WORKNAME.GODOGWALK){ 
    msgs = Requestdogwalkmessages;
  }else if(type ==ROOMSIZE.SMALLER || type == ROOMSIZE.SMALL 
    || type == ROOMSIZE.MEDIUM
    || type == ROOMSIZE.LARGE
    || type == ROOMSIZE.EXLARGE){ 
    msgs = Requestroommessages;
  }

  console.log("TCL: MobileRegistcontainer -> msgs", msgs)

  const [messages, setMessages] = useState(msgs);

  const [stepdata, setStepdata] = useState(0);
  const [stepstr, setStepstr] = useState('');
  const [selectdate, setSelectdate] = useState('');

  const [allweeks, setAllweeks] = useState(false);
  const [dayitems, setDayitems] = useState([]);


  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [registWorkSuccess, setRegistWorkSuccess] = useState(false);
  const [registRoomSuccess, setRegistRoomSuccess] = useState(false);

  /* 연락 옵션 — 켠 사람의 일감에만 상세에서 보이스톡 버튼이 뜬다 (형 리뷰 2026-08-12) */
  const [voicetalk, setVoicetalk] = useState(false);
  /* 참고 사진 (형 리뷰 2026-08-12) — 올린 뒤의 URL 목록 */
  const [photos, setPhotos] = useState([]);

  const useCommentRef= useRef(null);
  const useCompleteRef = useRef(null);



    /*
  초기값을 제거
  */
  const _handleReset = () =>{
    let msgs = [];
    async function Fetchdata(){
      if(type == WORKNAME.HOMECLEAN){ 
        msgs = Requestcleanmessages;
      }else  if(type == WORKNAME.BUSINESSCLEAN){ 
        msgs = Requestbusinesscleanmessages;
      }else if(type == WORKNAME.MOVECLEAN){ 
        msgs = Requestmovecleanmessages;
      }else if(type == WORKNAME.FOODPREPARE){ 
        msgs = Requestfoodpreparemessages;
      }else if(type == WORKNAME.ERRAND){ 
        msgs = Requesterrandmessages;
      }else if(type == WORKNAME.GOOUTSCHOOL){ 
        msgs = Requestgooutschoolmessages;
      }else if(type == WORKNAME.BABYCARE){ 
        msgs = Requestbabycaremessages;
      }else if(type == WORKNAME.LESSON){ 
        msgs = Requestlessonmessages;
      }else if(type == WORKNAME.PATIENTCARE){ 
        msgs = Requestpatientcaremessages;
      }else if(type == WORKNAME.GOHOSPITAL){ 
        msgs = Requestgohospitalmessages;
      }else if(type == WORKNAME.RECIPETRANSMIT){ 
        msgs = Requestrecipetranmitmessages;
      }else if(type == WORKNAME.GOSCHOOLEVENT){ 
        msgs = Requestschooleventmessages;
      }else if(type == WORKNAME.CARRYLOAD){ 
          msgs = Requestcarryloadmessages;
      }else if(type == WORKNAME.SHOPPING){ 
        msgs = Requestshoppingmessages;
      }else if(type == WORKNAME.GODOGHOSPITAL){ 
        msgs = Requestdoghospitalmessages;
      }else if(type == WORKNAME.GODOGWALK){ 
        msgs = Requestdogwalkmessages;
      }else if(type ==ROOMSIZE.SMALLER || type == ROOMSIZE.SMALL 
        || type == ROOMSIZE.MEDIUM
        || type == ROOMSIZE.LARGE
        || type == ROOMSIZE.EXLARGE){ 
        msgs = Requestroommessages;
      }

      msgs.map((data, index)=>{
        if(data.type == 'request' 
        || data.type =='requestroom' 
        || data.type =='requestcomment' 
        || data.type =='requestdate' 
        || data.type =='requestregion' 
        || data.type =='requestcomplete'){
          data.show = false;
          data.selected = false;

          if(data.selectitems != undefined){
            data.selectitems.map((select=>{
              select.selected = false;
            }))
          }
     
        }else if(data.type =='response'){
          data.result ="";
          data.show =false;
        }
      })
      setMessages(msgs); 

      let str = totalset + "단계만 설정 하시면 등록이 완료됩니다";
      setStepstr(str);
      setStepdata(0);
   
      await useSleep(1500);
      msgs[1].show = true;
      setRefresh((refresh) => refresh +1);

      window.scrollTo(0, 0);
    }
    Fetchdata();

  }


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setMessages(messages);
    setStepdata(stepdata);
    setAllweeks(allweeks);
    setDayitems(dayitems);
    setStepstr(stepstr);
    setSelectdate(selectdate);
    setMarkers(markers);
    setMap(map);
    setAddress(address);
    setLatitude(latitude);
    setLongitude(longitude);
    setRoomimg(roomimg);
    setRegistWorkSuccess(registWorkSuccess);
    setRegistRoomSuccess(registRoomSuccess);
  },[refresh])



  /**
   * 공간 대여일 경우는 첫번째 인덱스와 두번째 인덱스는 안보여주고 바로 기간 설정 할수 있도록한다
   */
  useEffect(()=>{

    _handleReset();

    async function FetchData(){
     
      let str = totalset + "단계만 설정 하시면 등록이 완료됩니다";
      setStepstr(str);

      await useSleep(1500);

      if(type ==ROOMSIZE.SMALLER || type == ROOMSIZE.SMALL 
        || type == ROOMSIZE.MEDIUM
        || type == ROOMSIZE.LARGE
        || type == ROOMSIZE.EXLARGE
        ){
        messages[1].show = false
        messages[2].show = false;
        messages[2].result='1회만'
        messages[3].show = true;
      }else{
        messages[1].show = true;
      }


      setRefresh((refresh) => refresh +1);

    } 
    FetchData();
  }, [])





 /**
  * 선택지에서 선택 한 아이템에 selected 를 true로 해준다
  */
  const _handlecheck = (index, key) =>{
    messages[index].selectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].selectitems.findIndex(x=>x.key == key);
    messages[index].selectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }

  /**
   * 재설정하기 위해 필요한 함수
   */
  const _handleAdjust =(index) =>{
    messages[index-1].selected = false;
    setRefresh((refresh) => refresh +1);
  }   

  const _handletargetpostioncheck = (index, key) =>{
    
    console.log("TCL: _handletargetpostioncheck -> ", messages[index] );
    messages[index].targetpositionselectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].targetpositionselectitems.findIndex(x=>x.key == key);
    messages[index].targetpositionselectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }
  const _handletargetareacheck = (index, key) =>{
    messages[index].targetareaselectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].targetareaselectitems.findIndex(x=>x.key == key);
    messages[index].targetareaselectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }
  

  const _handletimecheck = (index, key) =>{
    
    console.log("TCL: _handletargetpostioncheck -> ", messages[index] );
    messages[index].timeselectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].timeselectitems.findIndex(x=>x.key == key);
    messages[index].timeselectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }
  const _handlemoneycheck = (index, key) =>{
    messages[index].moneyselectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].moneyselectitems.findIndex(x=>x.key == key);
    messages[index].moneyselectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }


  const _handlehelpgendercheck = (index, key) =>{
    
    console.log("TCL: _handletargetpostioncheck -> ", messages[index] );
    messages[index].helpgenderselectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].helpgenderselectitems.findIndex(x=>x.key == key);
    messages[index].helpgenderselectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }
  const _handlehelpagecheck = (index, key) =>{
    messages[index].helpageselectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].helpageselectitems.findIndex(x=>x.key == key);
    messages[index].helpageselectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }

  /**
  * 선택하게 되면
  * ! ① 해당 인덱스를 선택하게 되었다고 표시 해주고
  * ! ② 다음 첫번째 인덱스에 결과값을 넣어주고 보여줌을 표시 하자
  * ! ③ 다음 두번째 인덱스를 보여주도록 한다
  * ! 선택이 전부 되었으면 부드럽게 이동할수 있도록 한다
  * ! messages[index +2].type == 'requestregion' 일때 지도를 그려준다
  */

  const _handleNext = (index) =>{

    const FindIndex = messages[index].selectitems.findIndex(x=>x.selected == true);
    if(FindIndex == -1){
      return;
    }

    let data = seekstepcheck(index);


    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = messages[index].selectitems[FindIndex].response; //!TODO
    messages[index+2].show =true;

  

    if(messages[index +2].type == 'requestregion'){
      
      drawRegionMap();
    }

    window.scrollTo({
      top: window.scrollY + 150, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });

    setRefresh((refresh) => refresh +1);
  }


  /**
   * 지역 선택
   */
  const _handleRegionNext = async(index) =>{

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = address;
    messages[index+1].latitude = latitude;
    messages[index+1].longitude = longitude;
    console.log("TCL: _handleRegionNext -> address", address,messages)
    messages[index+2].show = true;

   

    setRefresh((refresh) => refresh +1);
    await useSleep(500);
    if(type ==ROOMSIZE.SMALLER || type == ROOMSIZE.SMALL 
      || type == ROOMSIZE.MEDIUM
      || type == ROOMSIZE.LARGE
      || type == ROOMSIZE.EXLARGE
      ){
      useCompleteRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }else{
      useCommentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
 

  }

  /**
   * 요청 내용 입력칸을 눌렀을 때 (형 리뷰 2026-08-12)
   *
   * 모바일 키보드가 올라오면 화면 아래 절반을 덮는다. 입력칸이 그 밑에 깔리면
   * 자기가 뭘 쓰는지 안 보인다. visualViewport 로 실제 보이는 높이를 받아
   * 입력칸이 그 안에 들어오게 올려준다. (없는 브라우저는 가운데로 스크롤)
   */
  const _handleCommentFocus = (e) =>{
    const el = e.target;
    const bring = () =>{
      const vv = window.visualViewport;
      if(!vv){
        el.scrollIntoView({ behavior:'smooth', block:'center' });
        return;
      }
      const rect = el.getBoundingClientRect();
      const bottomLimit = vv.height - 16;          // 키보드 위 남은 영역
      if(rect.bottom > bottomLimit){
        window.scrollBy({ top: rect.bottom - bottomLimit, behavior:'smooth' });
      }
    }
    // 키보드가 올라오는 동안 높이가 바뀌므로 조금 기다렸다 두 번 맞춘다
    setTimeout(bring, 200);
    setTimeout(bring, 550);
  }

  /**
   * 타켓 선택
   */
  const _handleTargetNext = async(index) =>{

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = "";

    messages[index+2].show = true;

   
    setRefresh((refresh) => refresh +1);
    await useSleep(500);

    window.scrollTo({
      top: window.scrollY + 150, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });


  }

 /**
 * 시간과 금액 선택
 */
  const _handleTimeMoneyNext = async(index) =>{

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = "";

    messages[index+2].show = true;
    console.log("TCL: _handleTimeMoneyNext -> messages", messages)

    
    setRefresh((refresh) => refresh +1);
    await useSleep(500);

    window.scrollTo({
      top: window.scrollY + 150, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });


  }


  /**
 * 도움받을 사람 선택
 */
  const _handleHelpNext = async(index) =>{

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = "";

    messages[index+2].show = true;

    
    setRefresh((refresh) => refresh +1);
    await useSleep(500);

    window.scrollTo({
      top: window.scrollY + 150, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });


  }


  const _handleCommentNext = async(index)=>{
    let data = seekstepcheck(index);



    let str = totalset + "단계 모두 설정 완료하였습니다";
    setStepstr(str);
    setStepdata(totalset);


    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = comment;
    messages[index+2].show =true;
    setRefresh((refresh) => refresh +1);

    await useSleep(500);
    useCompleteRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  /**
   * 공간 사진 등록 햇을때
   * 지도를 미리 그려줘야 한다
   * ! 공간 대여 일 경우는 사진 데이타 결과값을 이미 넣어주고 선택 된것으로 해준다
   * * ! messages[index +2].type == 'requestregion' 일때 지도를 그려준다
   */
  const _handleRoomNext = (index) =>{


    let data = seekstepcheck(index);


    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

    messages[index].selected = true;
    messages[index+1].show = false;
    messages[index+1].result = roomimg; //!TODO
    messages[index+2].show =true;


    if(messages[index +2].type == 'requestregion'){
      
      drawRegionMap();
    }


    window.scrollTo({
      top: window.scrollY + 200, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });

    setRefresh((refresh) => refresh +1);
  }

  /**
   * 날짜 선택
   */
  const _handleDateNext = (index) =>{

    if(allweeks  == true){
      if(dayitems.length ==0){
        return;
      }
    }

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;

    // 기간값을 넣어주자
    // ①②③④
    // ① 일정 시점을 선택 했다고 하면 date 가 있는거다
    if(selectdate != ''){
      messages[index+1].result = selectdate;
    }else{
        // ② 매일을 선택 했다고 하면 
        if(allweeks  == false){
          messages[index+1].result = '매일';
        }else{
          // ③ 매일을 선택 했다고 하면 
          let str = "매주";
          dayitems.map((day, index)=>{
            str += day;
            str += '요일';
            str += ' ';
          })

          messages[index+1].result = str;
        }
    }

    messages[index+2].show =true;

    setRefresh((refresh) => refresh +1);
  }

  const _handleCalendarDateNext = (index)=>{

    if(selectdate == ''){
      return;
    }

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;

    // 기간값을 넣어주자
    // ①②③④
    // ① 일정 시점을 선택 했다고 하면 date 가 있는거다
    if(selectdate != ''){
      messages[index+1].result = selectdate;
    }else{
        // ② 매일을 선택 했다고 하면 
        if(allweeks  == false){
          messages[index+1].result = '매일';
        }else{
          // ③ 매일을 선택 했다고 하면 
          let str = "매주";
          dayitems.map((day, index)=>{
            str += day;
            str += '요일';
            str += ' ';
          })

          messages[index+1].result = str;
        }
    }

    messages[index+2].show =true;

    setRefresh((refresh) => refresh +1);
  }



  /**
   * 지역 선택 단계의 지도 (형 리뷰 2026-08-12 "뒤에 흰색은 뭔지 모르겠음").
   *
   * 전에는 특정 '다음' 버튼 안에서만 지도를 만들었다. 다른 경로로 이 단계에 오면
   * 지도가 안 그려져 270x320 흰 박스만 남았다. 이제 이 단계가 화면에 뜨면 항상 그린다.
   * 카카오 SDK 가 아직 안 올라왔을 수 있어 준비를 기다린 뒤에 만든다.
   */
  const regionMapRef = useRef(null);
  const drawRegionMap = async () =>{
    if(regionMapRef.current) return;          // 이미 그렸으면 다시 만들지 않는다
    regionMapRef.current = 'pending';
    try{
      if(!(await ensureKakao())) { console.warn('[regist] 카카오 지도를 불러오지 못했습니다'); regionMapRef.current = null; return; }
      let mapContainer = null;
      for(let t=0; t<40 && !mapContainer; t++){
        mapContainer = document.getElementById('map');
        if(!mapContainer) await new Promise(r => setTimeout(r, 100));
      }
      if(!mapContainer) { console.warn('[regist] 지도 자리를 찾지 못했습니다'); regionMapRef.current = null; return; }

        var mapOption = {
              center: new kakao.maps.LatLng(user.latitude, user.longitude), // 지도의 중심좌표
              level: 5, // 지도의 확대 레벨
              zoomable: false, // 확대/축소 비활성화
        };
    
        var map = new kakao.maps.Map(mapContainer, mapOption);

        var imageSrc = imageDB.movegps; // 마커 이미지의 URL
        var imageSize = new kakao.maps.Size(64, 69); // 마커 이미지의 크기
        var imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커의 좌표에 일치시킬 이미지 안의 좌표
    
        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
        const markerPosition = new window.kakao.maps.LatLng(user.latitude, user.longitude);

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage // 마커 이미지 설정
        });
    
        // 마커를 지도 위에 표시
        marker.setMap(map);
        const geocoder = new kakao.maps.services.Geocoder();
        // 좌표로 주소를 검색
        geocoder.coord2Address(user.longitude, user.latitude, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].address.address_name;
            setLatitude(user.latitude);
            setLongitude(user.longitude)
            setAddress(address);
          } else {
            console.error('주소를 찾을 수 없습니다.');
          }
        });
      

  
        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {

          const latlng = mouseEvent.latLng; // 클릭한 위치의 위도와 경도 정보

          // Geocoder 객체 생성
          const geocoder = new kakao.maps.services.Geocoder();


          // 좌표로 주소를 검색
          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              setLatitude(latlng.getLat());
              setLongitude(latlng.getLng())
              setAddress(address);
            } else {
              console.error('주소를 찾을 수 없습니다.');
            }
          });

          marker.setPosition(latlng);
          setRefresh((refresh) => refresh +1);
    
        });
      regionMapRef.current = map;
    }catch(e){
      console.error('[regist] 지도 그리기 실패', e);
      regionMapRef.current = null;
    }
  }

  /* 어떤 경로로 오든 지역 선택 단계가 화면에 뜨면 지도를 그린다 (형 리뷰 2026-08-12) */
  useEffect(()=>{
    const shown = (messages || []).some((m)=> m && m.type == 'requestregion' && m.show == true);
    if(shown) drawRegionMap();
  }, [refresh]);

  const _handleReqComplete = async() =>{

    let workinfo = [];
    messages.map((data)=>{
      if(data.type == 'response')
      {
        workinfo.push(data);
      }

    });

    const USERS_ID= user.users_id;
    const WORK_INFO = workinfo;
    const WORKTYPE = type;
    const WORK_OPTION = { VOICETALK : voicetalk };
    const WORK_PHOTOS = photos;

    const work = await CreateWork({USERS_ID,WORKTYPE, WORK_INFO, WORK_OPTION, WORK_PHOTOS});

    setRegistWorkSuccess(true);




  }
  /**
   * DatePicker에서 쓰는 함스
   */
  const handleDateChange = (newDate) => {

    console.log("new date", newDate);
    setSelectdate(newDate.toLocaleDateString());
    setRefresh((refresh) => refresh +1);
  };

  /**
   * 콤보박스에서 선택한 결과값이 오는데 기간 설정
   */
  const selectcallback =(data)=>{

    if(data == PCDAYMENU.ALLWEEKS)
    {
      setAllweeks(true);
    }else{
      setAllweeks(false);
    }
    setRefresh((refresh) => refresh + 1);
  }
  /**
   * 기간 계산시 사용 중복여부를 체크하고 중복이 안되어 잇으면 배열에 넣는다
   * 예제 ) 매주 월요일 화요일 수요일
   */
  const _handleWeekDate = (Date) =>{
    const FindIndex = dayitems.findIndex(x=>x == Date);
    if(FindIndex != -1){
      dayitems.splice(FindIndex, 1);
    }else{
      dayitems.push(Date);
    }
    setDayitems(dayitems);
    setRefresh((refresh) => refresh + 1);
  }

  /**
   * 기간 계산시 사용
   */
  function FindDay(Date){
    const FindIndex = dayitems.findIndex(x=>x == Date);
    console.log("TCL: _handleWeekDate -> dayitems", dayitems, Date)

    if(FindIndex != -1){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 단계여부를 체크하는 함수
   * response에서 responseshow는 고객 지도와 공간사진을 보여주지 않도록 하기 위해 미리 설정 해두는 장치
   */

  function seekstepcheck(index){
    let stepdata = 0;

    if(index <= 2){
      stepdata = 1;
    }else if(index == 3){
      stepdata = 2;
    }else if(index == 5){
      stepdata = 3;
    }else if(index == 7){
      stepdata = 4;
    }else if(index == 9){
      stepdata = 5;
    }else if(index == 11){
      stepdata = 6;
    }else if(index == 13){
      stepdata = 7;
    }else if(index == 15){
      stepdata = 8;
    }else if(index == 17){
      stepdata = 9;
    }else if(index == 19){
      stepdata = 10;
    }else if(index == 21){
      stepdata = 11;
    }
    return stepdata;
  }

  /**
   * 
   */
  const imageuploadcallback =(img)=>{
    
    console.log("TCL: imageuploadcallback -> ", img);

    setRoomimg(img);
    setRefresh((refresh) => refresh +1);
  }


  const worksuccesscallback =() =>{
    setRegistWorkSuccess(false);
    setRefresh((refresh) => refresh +1);
    navigate("/Mobilemain");
  }

  const roomsuccesscallback =() =>{
    setRegistRoomSuccess(false);
    setRefresh((refresh) => refresh +1);
    navigate("/Mobileroom");
  }
  

  return (
    <>
      {
        registWorkSuccess == true && <MobileSuccessPopup callback={worksuccesscallback} content ={'정상적으로 등록되었습니다'} />
      }
      {
        registRoomSuccess == true && <MobileSuccessPopup callback={roomsuccesscallback} content={'정상적으로 등록되었습니다'} />
      }
      <Container style={containerStyle}>

        <RegistHeader>
          <HeaderTop>
            <Row style={{gap:10, alignItems:"center"}}>
              <img src={Seekimage(type)} style={{width:36, height:36, objectFit:"contain"}}/>
              <Title>{type}</Title>
            </Row>
            <StepCount>
              <b>{stepdata}</b> / {totalset}
            </StepCount>
          </HeaderTop>

          <ProgressTrack>
            <ProgressFill progress={totalset ? (stepdata / totalset) * 100 : 0} />
          </ProgressTrack>

          <ProgressLayerText>
            {
              stepdata == 0
                ? <>총 <b style={{color:"#FF4E19"}}>{totalset}단계</b>만 설정하면 등록이 끝나요</>
                : <>{totalset}단계 중 <b style={{color:"#FF4E19"}}>{stepdata}단계</b> 완료</>
            }
          </ProgressLayerText>
        </RegistHeader>


          <ContentLayer>
          {
            messages.map((data, index) => (
            <Fragment key={index}>
            {("initialize" == data.type && data.show == true) && (
                <Itemlayer width={'100%'} style={{marginTop:180}}>      
                  <ItemLeftBox width={'100%'}>
                    <span>{data.info}</span>
                  </ItemLeftBox>       
                </Itemlayer>
            )}
            {/* 고객요구사항 선택 */}
            {("request" == data.type && data.show == true) && (
                <div className="fade-in-bottom" style={{width:"100%"}}>
                  <Itemlayer width={'70%'}>
                    <ItemLeftBox width={'70%'}>
                      <span>{data.info}</span>
                      {
                      data.selected == false ?
                      (
                        <>
                          <SelectGrid>
                          { data.selectitems.map((subdata)=>(
                            <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handlecheck(index, subdata.key)}}>
                              <div>{subdata.request}</div>
                              {
                                subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                              }
                              
                            </SelectLayer>
                          ))}
                          </SelectGrid>
                          <Button containerStyle={{border: 'none', fontSize:14}} onPress={()=>{_handleNext(index)}} height={'34px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                        </>
                      ):(<span>{data.request}</span>)
                      }
                    </ItemLeftBox>  
                  </Itemlayer>
                </div>
            )}

            {/* 날짜 선택 */} 
            {("requestdate" == data.type && data.show == true) && (
              <div className="fade-in-bottom" style={{width:"100%"}}>
                <Itemlayer width={'70%'}>
                    <ItemLeftBox width={'70%'}>
                      <span>{data.info}</span>
                      {
                        data.selected == false ?(<div style={{marginTop:15}}>

                        {
                          messages[2].result =='1회만' ? (  
                          <Fragment>
                            <StyledCalendarWrapper>
                                <StyledCalendar
                                  value={selectdate}
                                  onChange={handleDateChange}
                                  formatDay={(locale, date) => moment(date).format("D")} // 일 제거 숫자만 보이게
                                  formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
                                  formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
                                  calendarType="gregory" // 일요일 부터 시작
                                  showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
                                  next2Label={null} // +1년 & +10년 이동 버튼 숨기기
                                  prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
                                  minDetail="year" // 10년단위 년도 숨기기
                                  minDate={new Date()} // 오늘 날짜 이전은 선택 불가
                                  locale={ko} // 한국어 로케일 설정
                                  dateFormat="yyyy년 MM월 dd일" // 한국어 형식으로 날짜 표시
                                />
                            </StyledCalendarWrapper>

                            <Button containerStyle={{border: 'none', fontSize:14, marginTop:10}} onPress={()=>{_handleCalendarDateNext(index)}} height={'44px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                          </Fragment>     
                          ):(<Fragment>

                            <SelectItem
                              option={OPTIONTYPE.DAYOPTION}
                              callback={selectcallback}
                            />
                            {
                              allweeks == true && <Row style={{flexWrap:"wrap", justifyContent:"flex-start", gap:"10px", marginTop:"5px"}}>
                                
           

                                <DayBtn onClick={()=>{_handleWeekDate('일')}} $enable ={FindDay('일')} >
                                  일
                                  {
                                    FindDay('일') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }
                                </DayBtn>
                                <DayBtn onClick={()=>{_handleWeekDate('월')}} $enable ={FindDay('월')}>
                                  월
                                  {
                                    FindDay('월') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }
                                </DayBtn>
                                <DayBtn onClick={()=>{_handleWeekDate('화')}}  $enable ={FindDay('화')} >
                                  화
                                  {
                                    FindDay('화') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }
                                </DayBtn>     
                                <DayBtn onClick={()=>{_handleWeekDate('수')}}  $enable ={FindDay('수')} >
                                  수
                                  {
                                    FindDay('수') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }
                                </DayBtn>  
                                <DayBtn onClick={()=>{_handleWeekDate('목')}}  $enable ={FindDay('목')} >
                                  목
                                  {
                                    FindDay('목') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }
                                </DayBtn>  
                                <DayBtn onClick={()=>{_handleWeekDate('금')}}  $enable ={FindDay('금')} >
                                  금
                                  {
                                    FindDay('금') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }
                                </DayBtn>  
                                <DayBtn onClick={()=>{_handleWeekDate('토')}}  $enable ={FindDay('토')} >
                                  토
                                  {
                                    FindDay('토') == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                                  }         
                                  
                                </DayBtn>
                    

                              </Row>
                            }
              
                            <Button containerStyle={{border: 'none', fontSize:14, marginTop:10}} onPress={()=>{_handleDateNext(index)}} height={'44px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                            </Fragment>)
                        }
                        
                       </div>):(<span>{data.content}</span>)
                      }
                    </ItemLeftBox>       
                  </Itemlayer>

              </div>      
            )}

            {/* 대상 선택 */} 
           {("requesttarget" == data.type && data.show == true) && (
              <div className="fade-in-bottom" style={{width:"100%"}}>
                <Itemlayer width={'70%'}>
                    <ItemLeftBox width={'70%'}>
                    <span>{data.info}</span> 
                    
                    <span>{'청소대상'}</span> 
                      <SelectGrid>
                      { data.targetpositionselectitems.map((subdata)=>(
                        <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handletargetpostioncheck(index, subdata.key)}}>
                          <div>{subdata.request}</div>
                          {
                            subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                          }
                          
                        </SelectLayer>
                      ))}
                      </SelectGrid>
                      <span>{'청소범위'}</span> 
                      <SelectGrid>
                      { data.targetareaselectitems.map((subdata)=>(
                        <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handletargetareacheck(index, subdata.key)}}>
                          <div>{subdata.request}</div>
                          {
                            subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                          }
                          
                        </SelectLayer>
                      ))}
                      </SelectGrid>

                      <Button containerStyle={{border: 'none', fontSize:14}} onPress={()=>{_handleTargetNext(index)}} height={'34px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                    
                    </ItemLeftBox>       
                  </Itemlayer>

              </div>      
            )}

            {/* 시간과 금액 선텍 */} 
            {("requesttimemoney" == data.type && data.show == true) && (
              <div className="fade-in-bottom" style={{width:"100%"}}>
                <Itemlayer width={'70%'}>
                    <ItemLeftBox width={'70%'}>
                    <span>{data.info}</span> 
                    
               
                      <SelectGrid>
                      { data.timeselectitems.map((subdata)=>(
                        <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handletimecheck(index, subdata.key)}}>
                          <div>{subdata.request}</div>
                          {
                            subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                          }
                          
                        </SelectLayer>
                      ))}
                      </SelectGrid>
                      <span>{'대상'}</span> 
                      <SelectGrid>
                      { data.moneyselectitems.map((subdata)=>(
                        <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handlemoneycheck(index, subdata.key)}}>
                          <div>{subdata.request}</div>
                          {
                            subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                          }
                          
                        </SelectLayer>
                      ))}
                      </SelectGrid>

                      <Button containerStyle={{border: 'none', fontSize:14}} onPress={()=>{_handleTimeMoneyNext(index)}} height={'34px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                    
                    </ItemLeftBox>       
                  </Itemlayer>

              </div>      
            )}
            {/* 도움받을 사람 선택 */} 
            {("requesthelp" == data.type && data.show == true) && (
              <div className="fade-in-bottom" style={{width:"100%"}}>
                <Itemlayer width={'70%'}>
                    <ItemLeftBox width={'70%'}>
                    <span>{data.info}</span> 
                    
               
                      <SelectGrid>
                      { data.helpgenderselectitems.map((subdata)=>(
                        <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handlehelpgendercheck(index, subdata.key)}}>
                          <div>{subdata.request}</div>
                          {
                            subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                          }
                          
                        </SelectLayer>
                      ))}
                      </SelectGrid>
                      <span>{'대상'}</span> 
                      <SelectGrid>
                      { data.helpageselectitems.map((subdata)=>(
                        <SelectLayer  key={subdata.key} $check={subdata.selected} onClick={()=>{_handlehelpagecheck(index, subdata.key)}}>
                          <div>{subdata.request}</div>
                          {
                            subdata.selected == true ? (<div style={{paddingLeft:10}}><img src={imageDB.enablecheck} style={{width:"16px", hieght:"14px"}}/></div>):(<div style={{paddingLeft:10}}><img src={imageDB.check_d} style={{width:"16px", hieght:"14px"}}/></div>)
                          }
                          
                        </SelectLayer>
                      ))}
                      </SelectGrid>

                      <Button containerStyle={{border: 'none', fontSize:14}} onPress={()=>{_handleHelpNext(index)}} height={'34px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                    
                    </ItemLeftBox>       
                  </Itemlayer>

              </div>      
            )}

            {/* 지역 선택 */} 
            {("requestregion" == data.type && data.show == true) && (
            <div className="fade-in-bottom" style={{width:"100%"}}>
                    <Itemlayer width={'90%'}>
                    <ItemLeftBox style={{width:"90%", height:"400px"}}>
                      <span>{data.info}</span>
                      <div style={{marginTop:35, height:300, position:"absolute",  top: '30px'}}>
                        <div id="map"  style={mapstyle}></div>
                        <Row>
                          <Button containerStyle={{border: 'none', fontSize:16, marginTop:10}} onPress={()=>{_handleRegionNext(index)}} height={'34px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                        </Row>
                      </div>
                    </ItemLeftBox>  
                  </Itemlayer>  
            </div>
            )}

            {/* 홍여사에게 요청할 내용 */} 
            {("requestcomment" == data.type && data.show == true) && (
            <div className="fade-in-bottom" style={{width:"100%"}} ref={useCommentRef}>
                    <Itemlayer width={'90%'}>
                    {/* 입력칸이 absolute 로 카드 밖에 떠 있어서 좁고 잘렸다 — 그냥 흐름 안에 둔다 (형 리뷰 2026-08-12) */}
                    <ItemLeftBox style={{width:"100%"}}>
                      <span>{data.info}</span>
                      <div style={{marginTop:12, width:'100%'}}>
                        <textarea maxLength={40} style={CommentContent} value={comment}  onChange={(e) => {setComment(e.target.value);}}
                        onFocus={_handleCommentFocus}
                        placeholder={'필수 입력은 아니에요. 40자 이내로 적어주세요'}
                        />
                        <Row>
                          <Button containerStyle={{border: 'none', fontSize:16, marginTop:10, fontWeight:600}} onPress={()=>{_handleCommentNext(index)}} height={'46px'} width={'100%'} radius={'8px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                        </Row>
                      </div>
                    </ItemLeftBox>
                  </Itemlayer>  
            </div>
            )}

             {/* 공간 선택 */} 
            {("requestroom" == data.type && data.show == true) && (
            <div className="fade-in-bottom" style={{width:"100%"}}>
                    <Itemlayer width={'100%'}>
                    <ItemLeftBox style={{width:"100%", height:"350px"}}>
                  
                      <span>{data.info}</span>
                      <Column>
                        <ImageUploadComponent callback={imageuploadcallback}/>
                        <Button containerStyle={{border: 'none', fontSize:16, marginTop:10, fontWeight:600}} onPress={()=>{_handleRoomNext(index)}} height={'34px'} width={'100%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'다음'}/>
                      </Column>
                    </ItemLeftBox>  
                  </Itemlayer>  
            </div>
            )}

            {/* 요구사항 문서 확인 */} 
            {("requestcomplete" == data.type && data.show == true) && (
              <div className="fade-in-bottom" style={{width:"100%"}} ref={useCompleteRef}>
                  <Itemlayer width={'100%'}>
                  <ItemLeftBox width={'100%'}>
                    <span style={{fontSize:14}}>{data.info}</span>
                    <table className="workregist-table" style={{marginTop:20}}>
             
                      <tbody>
                        {
                          messages.map((data, ridx)=>(
                            <Fragment key={ridx}>
                            {
                            data.type =='response' &&
                            <tr>
                            <td>{data.requesttype}</td>
                            <td>
                            {
                              data.requesttype == REQUESTINFO.ROOM ? (
                                <img src= {data.result} style={{width:"200px", height:"200px"}}/>
                              ) :(<div>
                                {
                                  data.requesttype == REQUESTINFO.COMMENT ? (
                                    <textarea style={ResultContent2} value={data.result} readOnly/>):(
                                    <div> {data.result}</div>
                                  )
                                }
                               </div>)
                            }  
                            </td>
                            </tr>
                            }
                            </Fragment>                  
                          ))
                        }
                      </tbody>
                    </table>
                    {/* 참고 사진 — 등록 마지막에 물어본다 (형 리뷰 2026-08-12) */}
                    <OptionCard>
                      <OptionTitle>참고할 만한 사진이 있나요?</OptionTitle>
                      <OptionDesc style={{marginTop:0}}>없으면 넘어가셔도 됩니다. 사진이 있으면 홍여사가 상황을 훨씬 빨리 파악합니다.</OptionDesc>
                      <WorkPhotoPicker photos={photos} onChange={(next)=>{ setPhotos(next); setRefresh((refresh)=> refresh +1); }} />
                    </OptionCard>

                    <OptionCard>
                      <OptionTitle>연락 옵션</OptionTitle>
                      <OptionRow onClick={()=>{ setVoicetalk((v)=> !v); setRefresh((refresh)=> refresh +1); }}>
                        <div>
                          <OptionLabel>보이스톡 연결 허용</OptionLabel>
                          <OptionDesc>켜면 일감 상세에서 지원자가 보이스톡으로 연락할 수 있습니다. 끄면 채팅으로만 연락합니다.</OptionDesc>
                        </div>
                        <Switch $on={voicetalk}><Knob $on={voicetalk}/></Switch>
                      </OptionRow>
                    </OptionCard>

                    <div style={{display:"flex", flexDirection:"row", margin:'10px auto', width:'100%',justifyContent: "space-between" }}>

                      <Button containerStyle={{border: '1px solid #C3C3C3', fontSize:16, marginTop:10, fontWeight:600}} onPress={_handleReset} height={'44px'} width={'48%'} radius={'4px'} bgcolor={'#FFF'} color={'#131313'} text={'다시작성하기'}/>
                      <Button containerStyle={{border: 'none', fontSize:16, marginTop:10, fontWeight:600}} onPress={()=>{_handleReqComplete(index)}} height={'44px'} width={'48%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'등록하기'}/>

                    </div>
                  </ItemLeftBox>  
                  </Itemlayer>
              </div>
            )}

            {/* 고객요구에 대한 확인*/}
            {("response" == data.type && data.show == true && data.responseshow == true ) &&(
           
                  <div className="fade-in-bottom" style={{width:"100%"}}>
                    <ResponseContainer>
                    <ItemRightLayer>         
                        <ItemRightBox><span>{data.result}</span>
                        <img src={imageDB.enablecheck} style={{width:"16px", hieght:"16px", marginLeft:5}}/>
                        </ItemRightBox>
                        {/* 밑줄 글자라 눌리는 줄 몰랐다 — 버튼으로 (형 리뷰 2026-08-12) */}
                        <AdjustBtn onClick={()=>{_handleAdjust(index)}}>
                          <PiPencilSimpleBold size={14}/>수정
                        </AdjustBtn>
                   </ItemRightLayer>
                   </ResponseContainer>
                  </div>
        
            )}
            </Fragment>
          ))}
          </ContentLayer>
    
     
      </Container>


    </>


  );

}

export default MobileRegistcontainer;

