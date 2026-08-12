
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { CreateWATER, DeleteWaterByWATER_ID, ReadCOURAGETByIndividually, ReadWaterByIndividually, ReadWaterMonthByIndividually, ReadWaterWeekByIndividually } from "../service/WaterService";

import { Toaster, toast } from 'sonner';
import MobileWaterGoalPopup from "../modal/MobileWaterGoalPopup";
import { Readuserbyusersid } from "../service/UserService";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, defs, linearGradient, stop, BarChart, Bar, Cell, AreaChart } from "recharts";
import { LIFEMENU } from "../utility/life";
import { FaRegTrashAlt } from "react-icons/fa";
import KakaoShare from "./KakaoShare";
import { getFontSize } from "../utility/fontsize";





const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 70px);
  touch-action: pan-y;
  background:#056cfe;
  

`
const style = {
  display: "flex"
};



const BoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`



const FreezeBoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
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
    margin: 80px auto 20px;

`
const ChartLayerBox = styled.div`
    background: #1058ff;
    padding: 20px 0px 5px;

`
const RecordBox = styled.div`

  background: #ffffff1f;
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
  MONTH :"월간데이타"
  
}

const MenuButton = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 33%;
  font-size: ${() => getFontSize(16)}px;
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
const Header = styled.div`
    position: fixed;
    width: 100%;
    background: #056cfe;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`

const MobileWaterHistoryView =({containerStyle}) =>  {

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

  const [loading, setLoading] = useState(true);
  const [initpercentage, setInitpercentage] = React.useState('0');
  const [totalcontent, setTotalcontent] = React.useState(0);
  const [currentcontent, setCurrentcontent] = React.useState(0);

  const [wateritems, setWateritems] = React.useState([]);
  const [waterchartdayitems, setWaterchartdayitems] = React.useState([]);
  const [waterchartweekitems, setWaterchartweekitems] = React.useState([]);
  const [menu, setMenu] = React.useState(CurrentMenu.DAILY);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() +1);


  const [waterchartmonthitems, setWaterchartmonthitems] = React.useState([]);
  


  const [searchParams] = useSearchParams();
  const [shareid, setShareid] = useState(searchParams.get('id'));// URL 쿼리에서 id 가져오기

  console.log("shareid", shareid);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  function RangeCheck(hour) {
    

    
    if (hour < 2) {
      return 0;
    } else if (hour >= 2 && hour < 4) {
      return 2; 
    } else if (hour >= 4 && hour < 6) {
      return 4; 
    } else if (hour >= 6 && hour < 8) {
      return 6; 
    } else if (hour >= 8 && hour < 10) {
      return 8; 
    } else if (hour >= 10 && hour < 12) {
      return 10; 
    } else if (hour >= 12 && hour < 14) {
      return 12; 
    } else if (hour >= 14 && hour < 16) {
      return 14; 
    } else if (hour >= 16 && hour < 18) {
      return 16; 
    } else if (hour >= 18 && hour < 20) {
      return 18; 
    } else if (hour >= 20 && hour < 22) {
      return 20; 
    } else if (hour >= 22 && hour < 24) {
      return 22; 
    } else{
      return 24; 
    }

  }
  function RangeYoyilCheck(yoyil) {

    console.log("Yoyil check", yoyil);

    if (yoyil == 0) {
      return '일';      
    } else if (yoyil == 1) {
      return '월';   
    } else if (yoyil == 2) {
      return '화';
    } else if (yoyil == 3) {
      return '수';
    } else if (yoyil == 4) {
      return '목';
    } else if (yoyil == 5) {
      return '금';
    } else if (yoyil == 6) {
      return '토';
    }
  }

  async function FetchData() {

    let waterchartdailydata = [{ time: 0, amount: null },
      { time: 1, amount: null },
      { time: 2, amount: null },
      { time: 3, amount: null },
      { time: 4, amount: null },
      { time: 5, amount: null },
      { time: 6, amount: null },
      { time: 7, amount: null },
      { time: 8, amount: null },
      { time: 9, amount: null },
      { time: 10, amount: null },
      { time: 11, amount: null },
      { time: 12, amount: null },
      { time: 13, amount: null },
      { time: 14, amount: null },
      { time: 15, amount: null },
      { time: 16, amount: null },
      { time: 17, amount: null },
      { time: 18, amount: null },
      { time: 19, amount: null },
      { time: 20, amount: null },
      { time: 21, amount: null },
      { time: 22, amount: null },
      { time: 23, amount: null },
      { time: 24, amount: null }]



    let USERS_ID = "";
    if (shareid == null) {
      USERS_ID = user.USERS_ID;
    } else {
      USERS_ID = shareid; 
    }



    const useritems = await Readuserbyusersid({ USERS_ID });

    setTotalcontent(parseInt(useritems.WATERGOAL));
   
    const wateritemsTmp = await ReadWaterByIndividually({ USERS_ID });
    if (wateritemsTmp != -1) {
      const wateritemssortTmp = [...wateritemsTmp].sort((a, b) => b.CONTENTDATE - a.CONTENTDATE);
      setWateritems(wateritemssortTmp);
    } else {
      setWateritems([]);
      setWaterchartdayitems([]);
    }
    if(wateritemsTmp != -1) {
     
      let currentcontentTmp = 0;

      wateritemsTmp.map((data) => {
        currentcontentTmp += data.CONTENT;
      })

      wateritemsTmp.map((subdata) => {
        const FindIndex = waterchartdailydata.findIndex(x => x.time == (getHour(subdata.CREATEDT.toDate())));
        if (FindIndex != -1) {
          waterchartdailydata[FindIndex].amount += subdata.CONTENT;
        }
      })

      let cumulativeSum = 0;
      const updatedData = waterchartdailydata.map(item => {
        if (item.amount !== null) {
          cumulativeSum += item.amount;
        }
        return { ...item, cumulativeAmount: cumulativeSum };
      });
      const lastIndex = waterchartdailydata.reduceRight((acc, item, index) => (item.amount !== null && acc === -1 ? index : acc), -1);
      for (let i = lastIndex +1; i < 25; i++){
        updatedData[i].cumulativeAmount = null;
      }
  
      setWaterchartdayitems(updatedData);

      setCurrentcontent(currentcontentTmp);
      let percent = currentcontentTmp / parseInt(useritems.WATERGOAL);
      setInitpercentage(parseInt(percent * 100));
      setRefresh((refresh) => refresh + 1);
    }
    setLoading(false);
  }

  async function WeekFetchData(startday, endday) {

    let USERS_ID = "";
    if (shareid == null) {
      USERS_ID = user.USERS_ID;
    } else {
      USERS_ID = shareid;
    }


    let waterchartweekitemsTmp = [
      { day: "일", amount: 0 },
      { day: "월", amount: 0 },
      { day: "화", amount: 0 },
      { day: "수", amount: 0 },
      { day: "목", amount: 0 },
      { day: "금", amount: 0 },
      { day: "토", amount: 0 },

    ];



    const waterweekitemsTmp = await ReadWaterWeekByIndividually({ USERS_ID, startday, endday });


    if (waterweekitemsTmp != -1) {

      console.log("waterweekitemsTmp", waterweekitemsTmp);
      waterweekitemsTmp.map((subdata) => {
        const FindIndex = waterchartweekitemsTmp.findIndex(x => x.day == RangeYoyilCheck(subdata.CREATEDT.toDate().getDay()));
        if (FindIndex != -1) {
          waterchartweekitemsTmp[FindIndex].amount += subdata.CONTENT;
        }
      })
    }


    setWaterchartweekitems(waterchartweekitemsTmp);
  }
  async function MonthFetchData(month) {

    let USERS_ID = "";
    if (shareid == null) {
      USERS_ID = user.USERS_ID;
    } else {
      USERS_ID = shareid;
    }

    let waterchartmonthitemsTmp = [
      { day: "1", amount: 0 },
      { day: "2", amount: 0 },
      { day: "3", amount: 0 },
      { day: "4", amount: 0 },
      { day: "5", amount: 0 },
      { day: "6", amount: 0 },
      { day: "7", amount: 0 },
      { day: "8", amount: 0 },
      { day: "9", amount: 0 },
      { day: "10", amount: 0 },
      { day: "11", amount: 0 },
      { day: "12", amount: 0 },
      { day: "13", amount: 0 },
      { day: "14", amount: 0 },
      { day: "15", amount: 0 },
      { day: "16", amount: 0 },
      { day: "17", amount: 0 },
      { day: "18", amount: 0 },
      { day: "19", amount: 0 },
      { day: "20", amount: 0 },
      { day: "21", amount: 0 },
      { day: "22", amount: 0 },
      { day: "23", amount: 0 },
      { day: "24", amount: 0 },
      { day: "25", amount: 0 },
      { day: "26", amount: 0 },
      { day: "27", amount: 0 },
      { day: "28", amount: 0 },
      { day: "29", amount: 0 },
      { day: "30", amount: 0 },

    ];

    const now = new Date();

    const startday = new Date(now.getFullYear(), month, 1);

    const endday = new Date(now.getFullYear(), month + 1, 0, 23, 59, 59, 999);

    const watermonthitemsTmp = await ReadWaterMonthByIndividually({ USERS_ID, startday, endday });


    if (watermonthitemsTmp != -1) {

      console.log("watermonthitemsTmp", watermonthitemsTmp);
      watermonthitemsTmp.map((subdata) => {
        const FindIndex = waterchartmonthitemsTmp.findIndex(x => x.day == (subdata.CREATEDT.toDate().getDate()));
        if (FindIndex != -1) {
          waterchartmonthitemsTmp[FindIndex].amount += subdata.CONTENT;
        }
      })
    }


    setWaterchartmonthitems(waterchartmonthitemsTmp);
  }

  useEffect(()=>{
      FetchData();
  }, [])

  useEffect(() => {
    setInitpercentage(initpercentage);
    setCurrentcontent(currentcontent);
    setTotalcontent(totalcontent);
    setWateritems(wateritems);
    setWaterchartdayitems(waterchartdayitems);
    setWaterchartweekitems(waterchartweekitems);
    setMenu(menu);
    setCurrentDate(currentDate);
    

  }, [refresh])


  

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "black", color: "white", padding: "5px", borderRadius: "5px" }}>
          +{payload[0].value} ml
        </div>
      );
    }
    return null;
  };

  const _handleWaterHistory = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.WATERHISTORY, search: "" } });
  }


  const _handleWaterMain = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.WATER, search: "" } });
  }

  const _handleWaterAlarm = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.WATERALARM, search: "" } });
  }

  const _handleprev = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.WATER, search: "" } });  
  }

  const _handleMenu = (menu) => {
    setMenu(menu);

    if (menu == CurrentMenu.WEEK) {
      WeekFetchData(weekDays[0], weekDays[6]);
    } else if (menu == CurrentMenu.MONTH) {
      MonthFetchData(currentMonth -1);
      
    }
    setRefresh((refresh) => refresh + 1);
  }

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

  const handlePrevWeek = (weekDaysTmp) => {
    setCurrentDate(addDays(currentDate, -7));
    setRefresh((refresh) => refresh + 1);

    let startdate = (addDays(weekDaysTmp, -7));
    let enddate = (addDays(weekDaysTmp, -1));

    console.log("handlePrevWeek", startdate, enddate);
    WeekFetchData(startdate, enddate);




    
  }
  const handleNextWeek = (weekDaysTmp) => {
    setCurrentDate(addDays(currentDate, 7));
    setRefresh((refresh) => refresh + 1);

    let startdate = (addDays(weekDaysTmp, +1));
    let enddate = (addDays(weekDaysTmp, +7));

    console.log("handleNextWeek", startdate, enddate);
    WeekFetchData(startdate, enddate);


  }

  const handlePrevMonth = () => {

    if (currentMonth == 1) {
      return;
    }
    setCurrentMonth(currentMonth - 1);

    MonthFetchData(currentMonth - 2);
    setRefresh((refrehs) => refresh + 1);
  }
  const handleNextMonth = () => {
    if (currentMonth == 12) {
      return;
    }
    setCurrentMonth(currentMonth + 1);
    MonthFetchData(currentMonth);
    setRefresh((refrehs) => refresh + 1);
  }

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfCurrentWeek, i)
  );


  const _handleDelete = async(data) => {
    console.log("delete", data);

    const WATER_ID = data.WATER_ID;

    await DeleteWaterByWATER_ID({ WATER_ID });

    FetchData();
  }


  const WateDayilyIntakeChart = () => {
    return (
      <ResponsiveContainer width="95%" height={280}>
        <LineChart data={waterchartdayitems}
        margin ={{left:-15}}
        >
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="white" stopOpacity={0.6} />
              <stop offset="95%" stopColor="white" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fill: "white", fontSize: () => getFontSize(8) }} />
          <YAxis domain={[0, totalcontent + 200]} tick={{ fill: "white", fontSize: getFontSize(12) }} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="cumulativeAmount" stroke="#FE6625" strokeWidth={2} dot={{ fill: "#FE6625", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const WaterWeekIntakeChart = () => {
    return (
      <ResponsiveContainer width="95%" height={300}>

        <BarChart data={waterchartweekitems} margin={{ left: -10 }}>
          <XAxis dataKey="day" tick={{ fill: "white", fontSize: () => getFontSize(12) }} />
          <YAxis domain={[0, 2400]} tick={{ fill: "white", fontSize: getFontSize(12) }} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.2)" }} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]} barSize={5}>
            {waterchartweekitems.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.amount > 0 ? "#FE6625" : "rgba(255, 255, 255, 0.4)"} />
            ))}
          </Bar>
        </BarChart>

      </ResponsiveContainer>
    );
  };

  const WaterMonthIntakeChart = () => {
    return (
      <ResponsiveContainer width="95%" height={300}>


        {/* 투명한 Gradient 효과 */}
        <AreaChart data={waterchartmonthitems} margin={{ left: -15 }}>
        <defs>
          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FE6625" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#FE6625" stopOpacity={0} />
          </linearGradient>
        </defs>

          <XAxis dataKey="day" tick={{ fill: "white", fontSize:getFontSize(8) }} />
        <YAxis domain={[0, 2500]} tick={{ fill: "white", fontSize:getFontSize(10) }} />
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
        <Tooltip content={<CustomTooltip />} />

        {/* 반투명한 White 영역 */}
          <Area type="monotone" dataKey="amount" stroke="#FE6625" strokeWidth={2} fill="#FE6625" />
      </AreaChart>

      </ResponsiveContainer>

      
    );
  };



  return (
    <Container style={containerStyle}>     
    {
      loading == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}/>)
      : (
            <> 
              <Header>


                <TagLayer>
                  <MenuButton enable={menu === CurrentMenu.DAILY} onClick={() => { _handleMenu(CurrentMenu.DAILY) }}>{CurrentMenu.DAILY}</MenuButton>
                  <MenuButton enable={menu === CurrentMenu.WEEK} onClick={() => { _handleMenu(CurrentMenu.WEEK) }}>{CurrentMenu.WEEK}</MenuButton>
                  <MenuButton enable={menu === CurrentMenu.MONTH} onClick={() => { _handleMenu(CurrentMenu.MONTH) }}>{CurrentMenu.MONTH}</MenuButton>
                </TagLayer>

              </Header>

      

              {
                menu == CurrentMenu.DAILY &&
                <>
                  <ChartLayerHeader>
                    <Column>
                      <div>총</div>
                      <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: getFontSize(22) }}>{currentcontent}ml / {initpercentage}%</div>
                    </Column>

                    <Column>
                      <div>목표</div>
                      <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: getFontSize(14), paddingTop: 5 }}>{totalcontent}ml</div>
                    </Column>
                  </ChartLayerHeader>
                  <ChartLayerBox style={{paddingBottom:20}}>
                    <WateDayilyIntakeChart />
                  </ChartLayerBox>

                  <div style={{ fontSize:getFontSize(20), paddingLeft: 10, color: '#fff', margin: '30px 0px' }}>
                    기록
                  </div>
                  <div style={{ marginBottom: 100 }}>
                    {
                      wateritems.map((data, index) => (

                        <RecordBox key={index}>
                          <RecordLayer>
                            <FlexstartColumn>
                              <div style={{ color: "#fff", fontSize: getFontSize(12) }}>{getDateEx4(data.CREATEDT.toDate())}{' '}{getTime(data.CREATEDT.toDate())}</div>
                              <div style={{ color: "#fff", fontFamily: "Pretendard-SemiBold" }}>{data.CONTENT}ml</div>
                            </FlexstartColumn>

                      
                          </RecordLayer>


                        </RecordBox>

                      ))
                    }
                  </div>    
                  
                  <div style={{ height: 300 }}></div>

                </>     
              }
          

              {
                menu == CurrentMenu.WEEK && <>
                  <Row style={{width:"90%", margin:"150px auto 50px"}}>
                    <NaviPrevButton onClick={() => { handlePrevWeek(weekDays[0]) }} >◀</NaviPrevButton>
                    <WeekLayer>{format(weekDays[0], "MM월dd일")} ~ {format(weekDays[6], "MM월dd일")} </WeekLayer>
                    <NaviNextButton onClick={() => { handleNextWeek(weekDays[6]) }} >▶</NaviNextButton>
                  </Row>
                  <ChartLayerBox>
                    <WaterWeekIntakeChart />
                  </ChartLayerBox>
                  </>
              }


              {
                menu == CurrentMenu.MONTH && <>
                  <Row style={{ width: "90%", margin: "150px auto 50px" }}>
                    <NaviPrevButton onClick={handlePrevMonth} >◀</NaviPrevButton>
                    <WeekLayer>{currentMonth}월</WeekLayer>
                    <NaviNextButton onClick={handleNextMonth} >▶</NaviNextButton>
                  </Row>
                  <ChartLayerBox>
                    <WaterMonthIntakeChart />
                  </ChartLayerBox>
                </>
              }
       
              
  
          {/* <BottomLine> 
 
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
          </BottomLine> */}
      </>
    )
      }  
      <Toaster position="bottom-right" richColors />
    </Container>
  );
}

export default MobileWaterHistoryView;

