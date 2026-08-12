
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { AroundRow, BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { sleep, useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { ReadCommunitySummary } from "../service/CommunityService";
import TimeAgo from 'react-timeago';
import { getDateEx4, getFullTime, getHour, getTime } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { PCCOMMNUNITYMENU } from "../utility/screen";
import { ReadRECIPE } from "../service/RecipeService";

import { shuffleArray } from "../utility/common";
import LazyImage from "../common/LasyImage";

import { FiPlus } from "react-icons/fi";
import ButtonEx from "../common/ButtonEx";
import Empty from "./Empty";
import WorkCalendar from "./WorkCalendar";
import { BiTask } from "react-icons/bi";
import { startOfWeek, addDays, format, startOfMonth, startOfDay } from "date-fns";

import { IoWaterOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { IoMdAlarm } from "react-icons/io";
import { LuGoal } from "react-icons/lu";
import MobileWaterPopup from "../modal/MobileWaterPopup";
import { FaRankingStar } from "react-icons/fa6";
import MobileWaterRankingPopup from "../modal/MobileWaterRankingPopup";
import { CreateWATER, ReadCOURAGETByIndividually, ReadWaterByIndividually, ReadWaterWeekByIndividually } from "../service/WaterService";

import { Toaster, toast } from 'sonner';
import MobileWaterGoalPopup from "../modal/MobileWaterGoalPopup";
import { Readuserbyusersid, Update_wateralarmbyusersid } from "../service/UserService";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, defs, linearGradient, stop, BarChart, Bar, Cell } from "recharts";
import { LIFEMENU } from "../utility/life";
import { FaRegTrashAlt } from "react-icons/fa";
import { LessDepth } from "three";
import { GoPencil } from "react-icons/go";
import MobileWaterAlarmPopup from "../modal/MobileWaterAlarmPopup";
import MobileHeaderLayer from "./MobileHeaderLayer";
import { getFontSize } from "../utility/fontsize";





const formatter = buildFormatter(koreanStrings); 


const HEADER_HEIGHT = 50;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
   background:#f9f9f9;

`

const style = {
  display: "flex"
};




const FreezeBoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const FreezeBoxItem = styled.div`
  width : 49%;
  background: #fbecc2;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction:column;
  border-radius: 5px;
  margin-bottom:5px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */
  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }


`

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}



const RecommendTitle = styled.div`
  font-family: 'Pretendard-Bold';
  margin: 20px 0px;

`
const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
`
const RecommendButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(12)}px;
  color : #999;
`
const AddButton2 = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color : #131313;
  display:flex;
  background :#fff;
  padding :5px 8px;
  border-radius :10px;
  border : 1px solid #E8E9EA;
`
const AddButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color : #ff7e19;
  display : flex;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }

`

const Recipetip = styled.div`
font-size: ${() => getFontSize(12)}px;
font-family: 'Pretendard-Light';
`
const Recipereview = styled.div`
font-size: ${() => getFontSize(12)}px;
font-family: 'Pretendard-Light';
margin-top:10px;
`

const Tag1 = styled.div`

font-size: ${() => getFontSize(12)}px;
background: #fff;
color: #070606;
display: flex;
justify-content: center;
align-items: center;
border-radius: 10px;
`
const Tag2= styled.div`

  font-size: ${() => getFontSize(12)}px;
  background: #fff;
  color: #070606;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-left:5px;
`





const CheckButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    width: 170px;
    height: 60px;
    border-radius: 50px;
    color :#131313;
    background :##b5bbfa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */

`
const CheckPlus = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const BottomLine = styled.div`
    position: absolute;
    bottom: 0px;
    font-size: ${() => getFontSize(30)}px;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    z-index : 3;
    background:#056cfe;
    padding-bottom:15px;
`

const ButtonLayer = styled.div`

    margin: 15px auto 0px;
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`
const Menuitem = styled.div`
    display:flex;
    flex-direction : column;
    justify-content: center;
    align-items : center;
    color :#d5d4d4;

`
const Menu = styled.div`
    font-size: ${() => getFontSize(14)}px;
    padding-top:5px;
`
const GoalMenu = styled.div`
    font-size: ${() => getFontSize(14)}px;
    padding-left:5px;
    color :#fff;
`

const WaterCupLayer = styled.div`
    position: absolute;
    bottom: 170px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    flex-direction: row;
    width: 95%;
    overflow-x: auto;
    display: flex;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    margin: 0 auto;
    margin-left: 10px;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

`

const TodayLayer = styled.div`
    position: absolute;
    top: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-direction:column;

`
const TodayHeader = styled.div`
  font-size: ${() => getFontSize(18)}px;
  color :${({ bgcolor }) => bgcolor > 90 ? ('#fff') : ('#131313')}
`
const TodayData = styled.div`
  font-size: ${() => getFontSize(45)}px;
  font-family:Pretendard-SemiBold;
  color :${({ bgcolor }) => bgcolor > 85 ? ('#fff') : ('#131313')}
`
const TodayDesc = styled.div`
  color :${({bgcolor}) => bgcolor > 80 ?('#fff'):('#131313')}
`

const WaterBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 10px;
    border-radius: 10px;
    background: #fff;
    scroll-snap-align: center;
    margin-left:20px;

`
const WaterStyle = `
.water-cup {
  width: 15px;
  height: 27px;
  background: linear-gradient(to top, #008CFF 70%, #E0F7FF 70%);
  clip-path: polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%);

  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.water-level {
  width: 100%;
  height: 70%; /* 물의 양에 따라 조절 */
  background: #008CFF;
  position: absolute;
  bottom: 0;
  transition: height 0.5s ease-in-out;
}

.water-cup::before {
  content: "";
  position: absolute;
  width: 90%;
  height: 5px;
  background: rgba(255, 255, 255, 0.6);
  top: 5px;
  left: 5%;
  border-radius: 50%;
}

`

const Gazy = styled.div`
    position: absolute;
    bottom: ${({ height }) => height}px;
    z-index: 10;
    width: 25px;
    background :#000;

`

const GazyIndicator  = styled.div`
    position: relative;
    width: 20px;
    display: flex;
    justify-content: center;
    color: #fff;
    padding: 0px 2.5px;
    border-radius: 5px;
    font-size: ${() => getFontSize(10)}px;

`

const GoalButtonLayer = styled.div`
    margin-left: 10px;
    background: #ff7e19;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position:absolute;
    top:60px;
    right:5%;

`

const waterboxitems = [
  { name: "+200ml", content: 200 },
  { name: "+300ml", content: 300 },
  { name: "+400ml", content: 400 },
  { name: "+100ml", content: 100 },
  { name: "+500ml", content: 500 },
  { name: "+600ml", content: 600 },
]

const TagLayer = styled.div`
    width: 100%;
    color: rgb(231 222 222);
    height: 50px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #5984f1;


    `
const ChartLayerHeader = styled.div`
    color: #fff;
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px auto 20px;

`
const ChartLayerBox = styled.div`
    background: #1058ff;
    padding: 20px 0px 5px;

`
const RecordBox = styled.div`

  background: #e6e1e16b;
  width: 90%;
  margin: 0 auto;
  border-radius: 20px;
  margin-top: 20px;
  height: 60px;
`
const RecordLayer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    height: 60px;


`

const CurrentMenu = {
  DAILY: "일간데이타",
  WEEK: "주간데이타",
  MONTH:"월간데이타"
  
}

const MenuButton = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;
  font-size: ${() => getFontSize(18)}px;
  border-bottom: ${({enable}) => enable === true ? ('3px solid #fff') : ('null')};
  height: 50px; 

`


const NaviPrevButton = styled.div`

    color: #fff;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;
    width:15%;
    display:flex;
    justify-content:flex-start;


`


const NaviNextButton = styled.div`

    color: #fff;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;
    width:15%;
    display:flex;
    justify-content:flex-end;


`
const WeekLayer = styled.div`
  font-size :18px;
  font-family: Pretendard-SemiBold;
  color : #f9f9f9;

`
const ContentLayer = styled.div`

`
const BoxLayer = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 15px;
  margin-top: 10px;

`

const AlarmLayer = styled.div`
  background : #fff;
  display : flex;
  flex-direction : column;
  justify-content : center;
  align-items: center;
  padding :10px 15px;
  margin-top:5px;

`


const FullItem = styled.div`
  padding: 8px 10px;
  width: 18%;
  font-family :"Pretendard-SemiBold";
  background:  ${({ enable }) => enable == true ? ('#FFF6F2') : ('#fff')};
  color :${({ enable }) => enable == true ? ('#FE6625') : ('#131313')};
  border :${({ enable }) => enable == true ? ('1px solid #FE6625') : ('1px solid #E8E9EA')};

  border-radius: 10px;
  display: flex;
  justify-content: center;
  margin: 8px 5px;
  font-size: ${() => getFontSize(12)}px;

`


const AddressItem = styled.div`
  padding: 8px 10px;
  width: 50%;
  font-family :"Pretendard-SemiBold";
  background:  ${({ enable }) => enable == true ? ('#FFF6F2') : ('#fff')};
  color :${({ enable }) => enable == true ? ('#FFA95E') : ('#131313')};
  border :${({ enable }) => enable == true ? ('1px solid #FE6625') : ('1px solid #E8E9EA')};

  border-radius: 10px;
  display: flex;
  justify-content: center;
  margin: 8px 5px;
  font-size: ${() => getFontSize(12)}px;

`
const Mode = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

`

const ALARMTEMPLATE = {
  ALARMMODE: true,
  ALARMWEEKEND: false,
  ALARMCHECK: [
    { alarmname: "기상 이후", alarmtime: "08:00", alarm: false, alarmdesc: "일어나자 물한잔은 산삼과 같습니다" },
    { alarmname: "조식 전", alarmtime: "09:00", alarm: false, alarmdesc: "아침식사전 물한잔은 건강에 좋습니다" },
    { alarmname: "아침 식사 후", alarmtime: "09:30", alarm: false, alarmdesc: "아침식사후 물한잔은 건강에 좋습니다" },
    { alarmname: "점심 식사 전", alarmtime: "11:00", alarm: false, alarmdesc: "점심식사전 물한잔은 건강에 좋습니다" },
    { alarmname: "점심 식사 후", alarmtime: "13:00", alarm: false, alarmdesc: "점심식사후 물한잔은 건강에 좋습니다" },
    { alarmname: "저녁 식사 전", alarmtime: "18:00", alarm: false, alarmdesc: "저녁식사전 물한잔은 건강에 좋습니다" },
    { alarmname: "저녁 식사 후", alarmtime: "20:00", alarm: false, alarmdesc: "자녁식사후 물한잔은 건강에 좋습니다" },
    { alarmname: "취침전", alarmtime: "22:40", alarm: false, alarmdesc: "취침전에 물한잔은 건강에 좋습니다" },
  ]
}


const MobileWaterAlarm =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [loading, setLoading] = useState(false);
  const [initpercentage, setInitpercentage] = React.useState('0');
  const [totalcontent, setTotalcontent] = React.useState(0);
  const [currentcontent, setCurrentcontent] = React.useState(0);

  const [wateritems, setWateritems] = React.useState([]);
  const [waterchartdayitems, setWaterchartdayitems] = React.useState([]);
  const [waterchartweekitems, setWaterchartweekitems] = React.useState([]);
  const [menu, setMenu] = React.useState(CurrentMenu.DAILY);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [alarmconfig, setAlaramconfig] = useState(ALARMTEMPLATE);
  const [alarmModal, setAlarmModal] = useState(false);
  const [dateitem, setDateitem] = useState({});
  

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);



  async function FetchData() {

    const USERS_ID = user.USERS_ID;

    const useritemsTmp = await Readuserbyusersid({ USERS_ID });

    if (useritemsTmp.WATERALARM == undefined) {
      
      setAlaramconfig(ALARMTEMPLATE);
    } else {
      setAlaramconfig(useritemsTmp.WATERALARM)
    }



    setLoading(false);
  }

  useEffect(()=>{
      FetchData();
  }, [])

  useEffect(() => {
    setAlaramconfig(alarmconfig);
    setAlarmModal(alarmModal);
    setDateitem(dateitem);

  }, [refresh])


  


 
  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);







  const _handleWaterHistory = () => {
    navigate(-1);
  }


  const _handleWaterMain = () => {
    navigate(-1);
  }

  const _handleWaterAlarm = () => {
    navigate(-1);
  }

  const _handleprev = () => {
    navigate(-1);
  }

  const _handleAlarmConfig = async(data) => {
    if (data.alarm == true) {
      data.alarm = false;
    } else {
      data.alarm = true;
    }
    const USERS_ID = user.USERS_ID;
    const WATERALARM = alarmconfig;

    console.log("user", user);

    await Update_wateralarmbyusersid({ WATERALARM, USERS_ID });

    setRefresh((refresh) => refresh + 1);
  }
  const _handleAlarmMode = async () => {
    if (alarmconfig.ALARMMODE == true) {
      alarmconfig.ALARMMODE = false;
    } else {
      alarmconfig.ALARMMODE = true;
    }
    const USERS_ID = user.USERS_ID;
    const WATERALARM = alarmconfig;
    await Update_wateralarmbyusersid({ WATERALARM, USERS_ID });
    setRefresh((refresh) => refresh + 1);  
  }
  const _handleAlarmWeekend = async () => {

    if (alarmconfig.ALARMWEEKEND == true) {
      alarmconfig.ALARMWEEKEND = false;
    } else {
      alarmconfig.ALARMWEEKEND = true;
    }

    const USERS_ID = user.USERS_ID;
    const WATERALARM = alarmconfig;

    await Update_wateralarmbyusersid({ WATERALARM, USERS_ID });

    setRefresh((refresh) => refresh + 1);
  }

  const _handleTime = (data) => {
    setAlarmModal(true);
    setRefresh((refresh) => refresh + 1);
    setDateitem(data);
  }
  const _handleTimeCallback = async(data) => {
    if (data == '') {
      setAlarmModal(false);
      setRefresh((refresh) => refresh + 1);
    } else {
      console.log("time callback", data);
      dateitem.alarmtime = data;

      console.log("all config", alarmconfig);

      const USERS_ID = user.USERS_ID;
      const WATERALARM = alarmconfig;
      await Update_wateralarmbyusersid({ WATERALARM, USERS_ID });
      setAlarmModal(false);
      setRefresh((refresh) => refresh + 1);
    }
  }

  return (
    <Container style={containerStyle}>     
    {
      loading == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}/>)
      : (
            <> 
              
              {
                alarmModal == true && <MobileWaterAlarmPopup callback={_handleTimeCallback} />
              }
      
      
  
              <ContentLayer>

                <MobileHeaderLayer name={'수분섭취 알람설정'} callback={_handleprev} />

                <BoxLayer>
                  <Mode>
                    <div>알람모드</div>
                    <FullItem enable={alarmconfig.ALARMMODE} onClick={_handleAlarmMode}>전체알람</FullItem>
                  </Mode>
       
                  <div style={{fontSize: () => getFontSize(12)}}>전체알람이 해제되면 개별 알람이 울리지 않습니다</div>
                </BoxLayer>
    
                <div style={{ height: 5, background: '#f9f9f9' }}></div>
                
                <AlarmLayer>
                  {
                    alarmconfig.ALARMCHECK.map((data) => (
                      <BetweenRow style={{ width: "100%", borderBottom: "1px solid #ededed", height:40 }}>
                        <div style={{fontSize: () => getFontSize(14)}}>{data.alarmname}</div>
                        <Row style={{ width: '60%' }}>
                          <Row style={{width:'60%'}}>
                            {
                              data.alarm == true ? (
                                <>
                                  <div style={{ width: '30%' }}>
                                  <IoMdAlarm color={'#131313'} size={18} onClick={() => { _handleTime(data) }} />
                                  </div>
                                  <div style={{ fontSize: () => getFontSize(14) }}>{data.alarmtime}</div>
                                </>
                              ) : (
                                <>
                                    <div style={{ width: '30%' }}>

                                    </div>
                                    <div style={{ fontSize: () => getFontSize(14) }}>{data.alarmtime}</div>
                                </>
  
                              )
                          
                              
                            }
                         
                          </Row>
                      
                          

                          <div style={{padding:"0px 3px", width:50, display:"flex", justifyContent:"center"}} onClick={()=>{_handleTime(data)}}><GoPencil/></div>
                          <AddressItem enable={data.alarm} onClick={()=>{_handleAlarmConfig(data)}}>개별알람</AddressItem>
                        </Row>
                      </BetweenRow>
                    ))
                  }
            

                </AlarmLayer>

                <BoxLayer>
                  <Mode>
                    <div>주말모드</div>
                    <FullItem enable={alarmconfig.ALARMWEEKEND} onClick={_handleAlarmWeekend}>주말모드</FullItem>
                  </Mode>
                  <div style={{ fontSize: getFontSize(12) }}>주말모드가 설정되면 주말에는 알람이 울리지 않습니다</div>
                </BoxLayer>

             

              </ContentLayer>


            
  
             <BottomLine> 
                <ButtonLayer>
                  <Menuitem>
                    <IoWaterOutline color={'#fff'} size={22} onClick={_handleWaterMain} />
                    <Menu>물관리</Menu>
                  </Menuitem>
                  <Menuitem>
                    <GrDocumentText color={'#fff'} size={22} onClick={_handleWaterHistory} />
                    <Menu>기록</Menu>
                  </Menuitem>
                  <Menuitem>
                    <IoMdAlarm color={'#fff'} size={22} onClick={_handleWaterAlarm} />
                    <Menu>알람</Menu>
                  </Menuitem>
                </ButtonLayer>
          </BottomLine>
      </>
    )
      }  
      <Toaster position="bottom-right" richColors />
    </Container>
  );
}

export default MobileWaterAlarm;

