
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
import { getFullTime, getNewDate } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { MOBILEMAINMENU, PCCOMMNUNITYMENU } from "../utility/screen";
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
import { CreateWATER, ReadCOURAGETByIndividually, ReadWaterByIndividually } from "../service/WaterService";

import { Toaster, toast } from 'sonner';
import MobileWaterGoalPopup from "../modal/MobileWaterGoalPopup";
import { Readuserbyusersid, Update_watergoalbyusersid } from "../service/UserService";
import { LIFEMENU } from "../utility/life";
import { getFontSize, isIOS } from "../utility/fontsize";

const formatter = buildFormatter(koreanStrings); 


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  flex-direction:column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px 6px;

`;

const HeaderLayer = styled.div`
    display: flex;
    flex-direction:column;
    color: rgb(19, 19, 19);
    font-size: ${() => getFontSize(18)}px;
    justify-content: center;
    align-items: center;
    font-family: Pretendard-SemiBold;
    width :100%;
   

`

const HEADER_HEIGHT = 70;
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fcfbf7;


`
const style = {
  display: "flex"
};


const ScrollFixContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

const MainContainer = styled.div`


  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh);
  touch-action: pan-y;
  background:#056cfe;

`




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
    background: #e3e3e3;
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
    bottom: 20px;
    font-size: ${() => getFontSize(30)}px;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`

const ButtonLayer = styled.div`

    margin: 20px auto 0px;
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
    color :#131313;
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
    padding: 10px 12px;
    border-radius: 10px;
    background: #a5c0ff;
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
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
   

`

const waterboxitems = [
  { name: "+200ml", content: 200 },
  { name: "+300ml", content: 300 },
  { name: "+400ml", content: 400 },
  { name: "+100ml", content: 100 },
  { name: "+500ml", content: 500 },
  { name: "+600ml", content: 600 },
]


const WaveCanvas = ({ initpercent }) => {
  const canvasRef = useRef(null);
  let animationId = useRef(null); // 애니메이션 ID 추적

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 830;

    let time = 0;
    const waveHeight = 20; // 물결 높이
    const waveLength = 0.025; // 파장의 길이
    const waveSpeed = 0.03; // 물결 속도

    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 (바다색)
      ctx.fillStyle = "#d0e5f80d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 물결 그리기
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / initpercent);

      for (let i = 0; i < canvas.width; i++) {
        ctx.lineTo(
          i,
          canvas.height / initpercent + Math.sin(i * waveLength + time) * waveHeight
        );
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      ctx.fillStyle = "#056cfe"; // 반투명한 파란색
      ctx.fill();

      time += waveSpeed;
      animationId.current = requestAnimationFrame(drawWave);
    }

    drawWave();

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [initpercent]);

  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
};



const AudioPlayer = ({ condition, duration = 3000 }) => {
  const [audio] = useState(new Audio("/sounds/Water.mp3"));
  const timeoutRef = useRef(null);

  useEffect(() => {
    audio.volume = 0.5;

    if (condition) {
      audio.play().catch((err) => {
        console.error("Audio playback failed", err);
      });

      // 일정 시간 후 오디오 정지
      timeoutRef.current = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; // 재생 위치 초기화
      }, duration);
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      // cleanup (컴포넌트 언마운트 시 정리)
      clearTimeout(timeoutRef.current);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [condition, audio, duration]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      audio.pause();
      audio.currentTime = 0;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [audio]);

  return null;
};


const MobileWaterBoard =({containerStyle}) =>  {

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

  const [waterpopup, setWaterpopup] = useState(false);
  const [waterrankingpopup, setWaterrankingpopup] = useState(false);
  const [watergoalpopup, setWatergoalpopup] = useState(false);
  const [initpercent, setInitpercent] = React.useState(2.5);
  const [initpercentage, setInitpercentage] = React.useState('0');
  const [totalcontent, setTotalcontent] = React.useState(2000);
  const [currentcontent, setCurrentcontent] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [playAudio, setPlayAudio] = useState(false);

  const [bottleitems, setBottleitems] = React.useState([]);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);


  const AnimatedNumber = ({ targetValue, current, duration = 1000 }) => {
    const [currentValue, setCurrentValue] = useState(current);

    useEffect(() => {
      let startTime;
      const startValue = currentValue; // 현재 상태에서 시작
      const difference = targetValue - startValue;

      const updateNumber = (timestamp) => {

        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCurrentValue(Math.floor(startValue + difference * progress));

        if (progress < 1) {
    
          requestAnimationFrame(updateNumber);
        } else {
            setPlayAudio(false);
        }
      };

      requestAnimationFrame(updateNumber);
    }, [targetValue, duration]);

    return <span>{currentValue}ml</span>;
  };

  async function FetchData() {

    setCurrent(currentcontent);

    const USERS_ID = user.USERS_ID;

    const useritems = await Readuserbyusersid({ USERS_ID });

    if (useritems.WATERGOAL != undefined) {

      setTotalcontent(parseInt(useritems.WATERGOAL));

    } else {
      const WATERGOAL = 2000;

      await Update_watergoalbyusersid({ WATERGOAL, USERS_ID });
      setTotalcontent(parseInt(2000));
    }


    const items = await ReadCOURAGETByIndividually({ USERS_ID });

   if (items != -1) {
     setBottleitems(items);
   }
  
   
    const wateritems = await ReadWaterByIndividually({ USERS_ID });

    console.log("wateritems", wateritems);
    let currentcontentTmp = 0;
   if (wateritems != -1) {
     
   
     let initpercentTmp = 0;
     wateritems.map((data) => {
       currentcontentTmp += data.CONTENT;

     })


     setCurrentcontent(currentcontentTmp);
     let percent = 0;
     if (useritems.WATERGOAL != undefined) {
       percent = currentcontentTmp / parseInt(useritems.WATERGOAL);

     } else {
       percent = 0;
     }

   

     if (percent > 0.9) {
       initpercentTmp += (percent * 4 + 5);
     } 
     else if (percent > 0.6 &&  percent <= 0.9) {
       initpercentTmp += (percent * 2 + 2);
     } else {
       initpercentTmp += (percent * 1.5 + 1.2);
     }
 

     console.log("init percent Tmp", initpercentTmp, percent);

    //  setInitpercent(initpercentTmp);
     setInitpercentage(parseInt(percent * 100));

   
    //  setLoading(false);
     setRefresh((refresh) => refresh + 1);
   }





  }


  useEffect(()=>{
      FetchData();
  }, [])

  useEffect(() => {

    setWaterpopup(waterpopup);
    setInitpercent(initpercent);
    setInitpercentage(initpercentage);
    setCurrentcontent(currentcontent);
    setTotalcontent(totalcontent);
    setWaterrankingpopup(waterrankingpopup);
    setBottleitems(bottleitems);
    setWatergoalpopup(watergoalpopup);
    setTotalcontent(totalcontent);
    setCurrent(current);
    setPlayAudio(playAudio);

  }, [refresh])

  // useEffect(() => {
  //   const handleTouchMove = (event) => {
  //     event.preventDefault(); // 다른 영역에서는 차단
  //   };

  //   document.addEventListener("touchmove", handleTouchMove, { passive: false });

  //   return () => {
  //     document.removeEventListener("touchmove", handleTouchMove);
  //   };
  // }, []);
  


  const _handleprev = () => {
     navigate(-1);
  }

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const _handleWaterBottle = () => {

    if (initpercentage > 100) {

      toast.info("이미 목표량을 추가 하였습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize:getFontSize(16), border: "none" }, // 스타일 변경
      })

      return;
    }


    setWaterpopup(true);
    setRefresh((refresh) => refresh + 1);
  }
  const _handleWaterClose = (data) => {

    if (data == 'add') {
      setPlayAudio(true);
      FetchData();   
    }

    setWaterpopup(false);

    setRefresh((refresh) => refresh + 1);
  }
  const _handleWaterGoalClose = () => {
    FetchData();
    setWatergoalpopup(false);
    setRefresh((refresh) => refresh + 1);
  }

  const _handleWaterRanking = () => {
    setWaterrankingpopup(true);
    setRefresh((refresh) => refresh + 1);
  }
  const _handleWaterRankingClose = () => {
    setWaterrankingpopup(false);
    setRefresh((refresh) => refresh + 1);
  }

  const _handleGoal = ()=> {
    setWatergoalpopup(true);
    setRefresh((refresh) => refresh + 1);
  }


  const _handleContent = async (data) => {


    
    if (initpercentage > 100) {

      toast.info("이미 목표량을 추가 하였습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize:  getFontSize(16), border: "none" }, // 스타일 변경
      })

      return;
    }

    setPlayAudio(true);

    const USERS_ID = user.USERS_ID;

    const CONTENT = data;
    const water = await CreateWATER({ CONTENT, USERS_ID })


    FetchData();

    setRefresh((refresh) => refresh + 1);
 
  }

  const _handleWaterHistory = () => {
    navigate(-1);
  }

  const _handleWaterMain = () => {
 
  }

  const _handleWaterAlarm = () => {
    navigate(-1);
  }

  return (
    <div>     
    {
        loading == true ? (
          <MainContainer>
            <LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
              width={"100px"} height={'100px'} />
          </MainContainer>
         )
          : (
            <>
              <HeaderWrapper>
                <HeaderLayer>
                  <Column style={{ paddingTop: 10, width: "100%", margin: "0 auto", color: "#fff", lineHeight: 2, height: 50, position: "absolute" }} onClick={_handleprev}>
                    <BetweenRow style={{ width: "100%", margin: "0 auto" }} >
                      <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center", paddingLeft: 15 }}>
                        <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
                      </div>
                      <div style={{ color: "#131313", marginRight: 20 }}>{getNewDate(Date.now())}</div>

                    </BetweenRow>
                  </Column>
                </HeaderLayer>
              </HeaderWrapper>
              <Container style={containerStyle}>
                {
                  watergoalpopup == true && <MobileWaterGoalPopup callback={_handleWaterGoalClose} />
                }
                {
                  waterpopup == true && <MobileWaterPopup callback={_handleWaterClose} />
                }




                <GoalButtonLayer onClick={_handleGoal}>
                  <LuGoal color={'#131313'} size={22} />
                  <GoalMenu>목표설정 : {totalcontent}ml </GoalMenu>
                </GoalButtonLayer>

                <TodayLayer>
                  <TodayHeader bgcolor={initpercentage}>오늘 먹은 음료 섭취량</TodayHeader>
                  <TodayData bgcolor={initpercentage}>

                    {current == 0 ? (<span> {currentcontent}ml</span>) : (<AnimatedNumber targetValue={currentcontent} current={current} />)}

                  </TodayData>

                  <TodayDesc bgcolor={initpercentage}>오늘 취해야 할 목표량기준 {initpercentage}%을 달성하셨어요</TodayDesc>
                </TodayLayer>



                <WaveCanvas initpercent={initpercent} />

                <style>{WaterStyle}</style>

                <WaterCupLayer>
                  {
                    bottleitems.map((data) => (
                      <WaterBox onClick={() => { _handleContent(data.BOTTLE) }}>
                        <div className="water-cup">
                          <div className="water-level"></div>
                        </div>
                        <div style={{ fontSize: getFontSize(12), paddingTop: 10, color: "#131313" }}>{data.NAME}</div>
                      </WaterBox>
                    ))
                  }


                </WaterCupLayer>


                <BottomLine>
                  <CheckButton onClick={_handleWaterBottle}>
                    <CheckPlus><span style={{ fontSize: getFontSize(25) }}>+</span><span style={{ fontSize: getFontSize(20), paddingLeft: 10 }}>음료</span></CheckPlus>
                  </CheckButton>

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
              </Container>
            </>
 


        )
      }  
      <AudioPlayer condition={playAudio} />    
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default MobileWaterBoard;

