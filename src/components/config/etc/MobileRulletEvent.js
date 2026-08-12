import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../../context/User";
import moment from "moment";
import { imageDB } from "../../../utility/imageData";

import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { Column, FlexstartColumn } from "../../../common/Column";
import { CONFIGMOVE, PCCOMMNUNITYMENU, POINTSTATUS, POINTTYPE, RULLET_TYPE } from "../../../utility/screen";

import { DataContext } from "../../../context/Data";
import { sleep, useSleep } from "../../../utility/common";
import { getDateEx, getDateEx3, getDateFullTime, getNewDate, WriteTimeCurrentTimeDiff } from "../../../utility/date";
import { readuser, Readuserbyusersid, Update_rulletbyusersid } from "../../../service/UserService";
import LottieAnimation from "../../../common/LottieAnimation";
import { LoadingCommunityStyle } from "../../../screen/css/common";
import {motion} from 'framer-motion';
import ButtonEx from "../../../common/ButtonEx";

import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useSpring, animated } from '@react-spring/web';
import MobileCountDown from "./MobileCountDown";
import { CreatePoint } from "../../../service/PointService";
import { getFontSize, getFontSizeEx } from "../../../utility/fontsize";
const Container = styled.div`
 background :#FF7E19;
 height: 100vh;
`

const EventTitle = styled.div`
  font-size: ${() => getFontSize(16)}px;
  line-height: 40px;
  width : 85%;
  font-family :Pretendard-SemiBold;

`


const Rulletbg = styled.div`
  text-align: center;
  padding-top: 150px;
  width: 100%;
  margin : 20px auto;



`
const ResultLayer = styled.div`
  font-size: ${() => getFontSize(20)}px;
  color: #3c4cb2;
  font-weight: 700;
  line-height: 30px;
  z-index: 10;
  font-family: Pretendard-SemiBold;
  background: #0d0d0dbd;
  height: 100vh;
  margin-top: -350px;
`
const CongratulationLayer = styled.div`
  z-index: 10;
  position: relative;
  top: -330px;
`



const Comment = styled.div`
  font-size: ${() => getFontSize(12)}px;
  display: flex;
  padding-left: 20px;
  color: #;
  flex-direction: row;
  justify-content: center;
`


const AudioPlayer = ({ condition }) => {
  const [audio] = useState(new Audio("/sounds/rullet.m4a"));

  const handleBeforeUnload = () => {
    audio.pause();
    audio.currentTime = 0;
    // 추가 작업
  };


  useEffect(() => {
    if (condition) {
      audio.play().catch((err) => {
        console.error("Audio playback failed", err);
      });
    } else {
      audio.pause();
      audio.currentTime = 0; // 재생 위치 초기화
    }

    return () => {
      // 컴포넌트가 언마운트될 때 오디오 종료
      audio.pause();
      audio.currentTime = 0;
    };
  }, [condition, audio]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      audio.pause();
      audio.currentTime = 0;
    };


    // 페이지 이동 이벤트 감지
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [audio]);

  useEffect(() => {

    // 오디오가 끝날 때 이벤트 리스너 추가
    const handleEnded = () => {
      audio.currentTime = 0; // 오디오를 처음으로 되돌림
      audio.play(); // 재생 시작
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);


  return null;
};




const PointValue = styled.div`
  font-family : Pretendard-Bold;
  font-size :30px;
  color : #FFAA0B;
`
export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '65%',
  maxWidth: '360px',
  backgroundColor: '#ffffff',
  color: '#333',
  zIndex: 100,
  display: 'flex',
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  maxHeight: '85vh',
  overflowY: 'auto',
};

export const RULLET_TYPE_RESULT = {
  ZERO_ONE: 0,
  POINT_1000: 1,
  POINT_5000: 2,
  COUPON :3,
};

const Fade = React.forwardRef(function Fade(props, ref) {
  const { children, in: open, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => open && onEnter?.(null, true),
    onRest: () => !open && onExited?.(null, true),
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

export const ResultPopup = ({ open = true, checknum, onClose, onNavigatePoint, imageDB, getFontSize }) => {

  console.log("✅ checknum 값 확인:", checknum, typeof checknum);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { TransitionComponent: Fade } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {renderResultContent(checknum, onClose, onNavigatePoint, imageDB, getFontSize)}
        </Box>
      </Fade>
    </Modal>
  );
};

export const renderResultContent = (checknum, onClose, onNavigatePoint, imageDB, getFontSize) => {
  switch (checknum) {
    case RULLET_TYPE_RESULT.ZERO_ONE:
      return (
        <>
          <div style={{ fontFamily: "Pretendard-Bold", fontSize: getFontSize(32), color: "#000" }}>아쉽네요.</div>
          <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: getFontSize(20), color: "#000" }}>다음엔 좋은 결과가 있을 거예요</div>
          <div style={{ marginTop: 15 }}>
            <div style={{ fontSize: getFontSize(14), color: '#888', textAlign: 'center' }}>
              룰렛은 하루에 한 번만 진행할 수 있습니다.
            </div>
          </div>
          <button onClick={onClose} style={{ marginTop: 24, padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>확인</button>
        </>
      );

    case RULLET_TYPE_RESULT.POINT_1000:
    case RULLET_TYPE_RESULT.POINT_5000:
      const pointValue = checknum === RULLET_TYPE_RESULT.POINT_1000 ? '1000' : '5000';
      return (
        <>
          <div style={{ fontFamily: "Pretendard-Bold", fontSize: getFontSize(32), color: "#000", marginTop: 40 }}>축하합니다!</div>
          <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: getFontSize(20), color: "#000" }}>경품에 당첨되셨습니다</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#FFAA0B', margin: '16px 0' }}>{pointValue}P</div>
          <img src={imageDB.POINT} style={{ width: 30, marginBottom: 12 }} />
          <div style={{ fontSize: getFontSize(14), color: '#888', textAlign: 'center', marginBottom: 16 }}>
            당첨 내용은 내 포인트 내역에서 확인할 수 있습니다
          </div>
          <button onClick={onNavigatePoint} style={{ marginBottom: 12, padding: '8px 16px', border: '1px solid #FFAA0B', background: 'transparent', color: '#FFAA0B', borderRadius: 6 }}>포인트 보러가기</button>
          <button onClick={onClose} style={{ padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>확인</button>
        </>
      );
    case RULLET_TYPE_RESULT.COUPON:
      return (
        <>
          <div style={{ fontSize: getFontSize(16), color: '#999' }}>커피 쿠폰에 당첨되셨습니다. 등록해주신 전화번호로 커피 쿠폰 문자를 보내드리도록 하겠습니다</div>
          <button onClick={onClose} style={{ marginTop: 16, padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>닫기</button>
        </>
        );
    default:
      return (
        <>
          <div style={{ fontSize: getFontSize(16), color: '#999' }}>결과를 불러올 수 없습니다.</div>
          <button onClick={onClose} style={{ marginTop: 16, padding: '12px 24px', background: '#FFA95E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 16 }}>닫기</button>
        </>
      );
  }
};


const MobileRulletEvent =({containerStyle}) =>  {

  const [showPopup, setShowPopup] = useState(false);

  const [playAudio, setPlayAudio] = useState(false);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [state, setState] = useState(-1);
  const [checkstatus, setCheckstatus] = useState(true);
  const [popupstatus, setPopupstatus] = useState(true);
  const [process, setProcess] = useState(false);
  const [futuredate, setFuturedate] = useState('');
  const [checknum, setChecknum] = useState(-1);
  const [randomvalue, setRandomvalue] = useState(-1);

  const [currentloading, setCurrentloading] = useState(true);
  const [key, setKey] = useState(0);

  var rolLength = 6; // 해당 룰렛 콘텐츠 갯수
  var setNum; // 랜덤숫자 담을 변수
  var hiddenInput = document.createElement("input");
  hiddenInput.className = "hidden-input";


  const WEIGHTS = {
    P1000: 0.35,   // 35%  ← 여기만 올리면 됨
    P5000: 0.01,   // 1%   (희귀 보상)
    MISS: 0.64,   // 64%  (꽝)
  };


  // 1000포인트 확률을 올린 버전
  function pickResultType() {
    const r = Math.random(); // 0.0 ~ 1.0
    if (r < WEIGHTS.P1000) return RULLET_TYPE_RESULT.POINT_1000;
    if (r < WEIGHTS.P1000 + WEIGHTS.P5000) return RULLET_TYPE_RESULT.POINT_5000;
    return RULLET_TYPE_RESULT.ZERO_ONE;
  }

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);


  const playFailBellWithVibration = () => {
    // const bellSound = new Audio("/sounds/out.m4a");
    // bellSound.play();
  
    if (navigator.vibrate) {
      navigator.vibrate(200); // 200ms 진동
    }
  };


  const playSuccessBellWithVibration = () => {
    // const bellSound = new Audio("/sounds/good.mp3");
    // bellSound.play();
  
    if (navigator.vibrate) {
      navigator.vibrate(200); // 200ms 진동
    }
  };


  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useEffect(()=>{
    async function FetchData(){
      const today = moment(); // 현재 날짜


      let min = 0;
      let max = 10;
      let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

      setRandomvalue(randomInt);

      const USERS_ID = user.USERS_ID;
      const useritem = await Readuserbyusersid({ USERS_ID });

      console.log("useritem", useritem);


      //TODO 기록된 시간과 현재 시간 여부를  체크하자

      if (useritem.RULLET != undefined) {
        const targetTime = moment(useritem.RULLET.toDate());

        if (targetTime.isBefore(moment())) {
          setFuturedate("");
        } else {
          setFuturedate(useritem.RULLET.toDate());
        }
      } else {
        setFuturedate(""); 
      }
  
      setCurrentloading(false);
      setKey((key) => key + 1);
      setRefresh((refresh) => refresh +1);

    } 
  
    FetchData();
  }, [])


  const rRandom = () => {
    var min = Math.ceil(0);
    var max = Math.floor(rolLength - 1);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const rRotate = async () => {
    const panel = document.querySelector(".rouletter-wacu");
    const deg = [];
    for (let i = 1; i <= rolLength; i++) {
      deg.push((360 / rolLength) * i);
    }

    let num = 0;
    document.body.append(hiddenInput);

    // ✅ 확률 기반 결과 결정
    const randomInt = Math.floor(Math.random() * 100); // 0~99
    setRandomvalue(randomInt);

    const resultType = pickResultType();

    let pointValue = 0;

    if (resultType == RULLET_TYPE_RESULT.POINT_1000 ) {
      pointValue = 1000;
    } else if (resultType === RULLET_TYPE_RESULT.POINT_5000) {
      pointValue = 5000;
    }



    // ✅ 포인트 지급 처리
    if (pointValue > 0) {
      const POINTVARCODE = getRandom();
      const TYPE = POINTTYPE.RULLET;
      const ENABLE = POINTSTATUS.NORMAL;

      const today = new Date();
      const POINTDATE = today;
      const POINTEXPIREDATE = new Date(today);
      POINTEXPIREDATE.setDate(today.getDate() + 30);

      const USERS_ID = user.USERS_ID;
      await CreatePoint({ POINTVARCODE, POINT: pointValue, TYPE, POINTDATE, POINTEXPIREDATE, ENABLE, USERS_ID });
    }

    console.log("resultType", resultType);



    // ✅ 팝업용 상태 업데이트
    setChecknum(resultType);
    setRefresh(r => r + 1);

    const RULLET_DEG_INDEX = {
      [RULLET_TYPE_RESULT.POINT_1000]: 4,
      [RULLET_TYPE_RESULT.POINT_5000]: 3,
      [RULLET_TYPE_RESULT.ZERO_ONE]: 2,
    };


    
    // ✅ 룰렛 애니메이션
    const ani = setInterval(() => {
      num++;
      panel.style.transform = `rotate(${360 * num}deg)`;
      if (num === 80) {
        clearInterval(ani);
        // panel.style.transform = `rotate(-${deg[RULLET_DEG_INDEX[resultType]]}deg)`;
        let angle = 0;

        if (resultType === RULLET_TYPE_RESULT.POINT_1000) {
          angle = 300;
        } else if (resultType === RULLET_TYPE_RESULT.POINT_5000) {
          angle = 180;
        } else if (resultType === RULLET_TYPE_RESULT.ZERO_ONE) {
          angle = 120;
        }

        // 최종 회전
        panel.style.transform = `rotate(-${angle}deg)`;


        // 여기 아래에 찍으시면 됩니다:
        console.log('🎯 최종 회전 각도:', deg[RULLET_DEG_INDEX[resultType]], '도');
        console.log('🎯 보상 타입:', resultType);
        console.log('🎯 인덱스 번호:', RULLET_DEG_INDEX[resultType]);

      }
    }, 80);
  };
  
  // 정해진 alert띄우기, custom modal등
  // 0 이면 1000 포인트
  // 3 이면 꽝
  // 1 이면 꽝
  // 2 이면 5000 포인트
  // 4 이면 스타벅스
  // 5 이면 신세계
  // 6 이면 꽝
  
  const getRandom = () => {
    let min = 0;
    let max = 9;
    let randomInt1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt3 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt4 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt5 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt6 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt7 = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomInt8 = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomInt1.toString() +
      randomInt2.toString() +
      randomInt3.toString() +
      randomInt4.toString() +
      randomInt5.toString() +
      randomInt6.toString() +
      randomInt7.toString() +
      randomInt8.toString()
  
  }
  const RLayerPopup = async(num) => {
  
    setPlayAudio(false);

    setShowPopup(true);
    switch (num) {
      case 0:
        playSuccessBellWithVibration();

        break;
      case 2:
        playSuccessBellWithVibration();
      
        break;
      default:
        playFailBellWithVibration();
        break;
    }


    setCheckstatus(false);
    setPopupstatus(false);
 

  };
  


  const _handlestart = async() =>{

    if(process == true){
      return;
    }

    const USERS_ID = user.USERS_ID;
    const today = moment(); // 현재 날짜
    let TargetDate = new Date(today);

    TargetDate.setDate(TargetDate.getDate() + 1); // 하루 뒤

  
    console.log("TargetDate", TargetDate);


    const RULLETDATE = TargetDate;

    Update_rulletbyusersid({RULLETDATE, USERS_ID});

    setPlayAudio(true);
    setProcess(true);
    setRefresh((refresh) => refresh +1);
  
    rRotate();

    const update = await sleep(8500);

    RLayerPopup(randomvalue);


    setCheckstatus(false);



  }

  const _handlePoint =()=>{

    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.POINTCONFIG, TYPE : ""}});

  }

  const _handleprev = () => {
    navigate(-1);
  }

  const ResultPopupclose = () => {

    const today = moment();
    const TargetDate = new Date(today);
    TargetDate.setDate(TargetDate.getDate() + 1);

    setFuturedate(TargetDate);
    setChecknum(-1); // 팝업 비활성화용
    setRefresh((r) => r + 1);
  }

  return (
    <Container style={containerStyle}>
      {currentloading == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />) : (<Column margin={'0px auto;'} width={'100%'} >
          

      <EventTitle>

      <Row style={{marginTop:50}}>
        <EventTitle style={{ fontSize: "16px", fontFamily: "Pretendard-Light", color:"#fff",display:"flex",justifyContent:"center"}}>{'하루에 한번 진행할수 있는 룰렛'}</EventTitle>
      </Row>
      <Row>
        <div style={{ fontSize: "28px", fontFamily: "Pretendard-Bold", color: "#fff" }}>{'구해줘 알바 이벤트 룰렛'}</div>
      </Row> 
      <Row style={{marginTop:10}}>
        <div style={{
          fontSize: "14px", background: "#FE8551", color: "#fff", borderRadius: "15px", padding:"0px 20px",
          fontFamily: "Pretendard-Regular",display:"flex", height:"30px",alignItems:"center"
        }}><div>{'포인트와 다양한 경품 지급!'}</div>
        </div>
      </Row> 

      {
        futuredate != '' && <MobileCountDown Furture={futuredate} key={key} />       
      }      

      </EventTitle>


      <Rulletbg>
          <div class="rouletter">
            <div class="rouletter-mobilebg">
              <div class="rouletter-wacu"></div>
          </div>
          <div class="rouletter-mobilearrow"><img src={imageDB.PIN} style={{width:40}}/></div>
          {
            futuredate == '' ? (<div class="rouletter-mobilebtn" onClick={_handlestart}><img src = {imageDB.rulletstart} style={{width:80}}/></div>) 
            :(<div class="rouletter-mobilebtn" ><img src = {imageDB.rulletstop} style={{width:80}}/></div>)
          }
          

          </div>
            
            {showPopup === true && checknum >= 0 && (
              <ResultPopup
                open={true}
                checknum={checknum}
                onClose={ResultPopupclose}
                onNavigatePoint={_handlePoint}
                imageDB={imageDB}
                getFontSize={getFontSize}
              />
            )}

      </Rulletbg>

      <AudioPlayer condition={playAudio} />    

    </Column>)

      }
 


    </Container>
  );

}

export default MobileRulletEvent;

