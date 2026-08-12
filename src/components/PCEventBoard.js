
import { Checkbox, Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { useSleep } from "../utility/common";
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
import { getFullTime } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingBoardStyle, LoadingCommunityStyle } from "../screen/css/common";
import BoardBox from "./BoardBox";
import { CONFIGMOVE, PCCOMMNUNITYMENU } from "../utility/screen";

import { CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../utility/life";

import "./input.css"

import { lifemenustore } from "../store/jotai";
import { useAtom } from "jotai";


const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  width: 100%;
  background :#fff;



`
const style = {
  display: "flex"
};






const Inputstyle ={

  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '20px',
  border : "1px solid #FF7125",


}


const  SearchLayer = styled.div`
  width: 90%;
  margin : 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  

`

const BoxItem = styled.div`
  padding: 0px 0px 30px;
  margin-bottom: 30px;
  color: #333;
  line-height: 1.8;
  font-family: "Pretendard-Regular";
  width: 30%;


`
const BoxLabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(16)}px;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  width:100%;


`

const BoxContent = styled.div`
  font-family: "Pretendard-Regular";
  font-size: ${() => getFontSize(14)}px;

`
const BoxWrite = styled.div`
  display : flex;
  flex-direction : row;
  justify-content: flex-start;
  align-items: center;
  width : 100%;
  font-size :14px;
`

const BoxImage = styled.div`
  margin-top:5px;
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

const Taglabel = styled.div`
  font-family: "Pretendard";
  font-size: ${() => getFontSize(12)}px;
  margin-right:10px;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: center;
  background-color:#FFF5F5;
  color :#FF2121;
  border-radius: 5px;

`

const TagData = styled.div`
  font-family: "Pretendard-Light";
  font-size: ${() => getFontSize(14)}px;

  color :#131313;
`
const Item = styled.div`
  margin: 5px 0px;
  display:flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items:center;
`
const TagButton = styled.div`
    padding: 10px 0px;
    color: #131313;
    margin: 5px 0px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding-left:5px;
    width:600px;
`
const EventButton = styled.div`
    padding: 10px 0px;
    color: #131313;
    margin: 10px 0px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding-left:5px;
    width:300px;
    background: #ededed;
    display: flex;
    justify-content: center;
`

const MainContent = styled.div`
  width: 50%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const MainContentTxt1 = styled.div`
  line-height: 1.5;
  font-size: ${() => getFontSize(34)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-Bold;
`
const MainContentTxt2 = styled.div`

  line-height: 1.5;
  font-size: ${() => getFontSize(22)}px;
  letter-spacing: -0.32px;
`
const ItemLabel = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: ${() => getFontSize(20)}px;
  margin: 10px 0px;

`
const Line = styled.div`
  height: 1px;
  margin: 20px 0px;
  background: #ededed;
  width: 80%;

`
const InputStyle ={
  display: "flex",
  justifycontent: "flex-start",
  height: "20px"
}

const BannerItems =[

  {type:LIFEMENU.GAME,image : imageDB.challenge, main1:"도전 구해줘 알바", main2:"게임 한번에 100 포인트 제공 최고기록 달성시 50000포인트 제공", main3:"", color:"#fff1c6"},
  {type:LIFEMENU.RULLET, image : imageDB.rullet, main1:"2시간마다 진행되는 룰렛게임", main2:"여섯시간 마다 한번 제공되는 룰렛 이벤트, 이벤트 참여하여 한번 푸짐한 선물을 받아가세요", main3:"", color:"#fff1c6"},
  {type:LIFEMENU.ATTENDANCE, image : imageDB.attendance, main1:"출석이벤트 ", main2:"꾸준한 구해줘 알바 가족임을 축하드립니다. 출석도장 15번 만으로 5000포인트 제공", main3:"", color:"#fff1c6"},
]

const MainLabel = styled.div`
  font-size: ${() => getFontSize(35)}px;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

`
const SubLabel = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-family: Pretendard-Regular;
  color: rgb(124, 124, 124);
  line-height: 1.8;
  margin-top: 20px;
  width: 100%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
`

const PCEventBoard =({containerStyle}) =>  {

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
  const [isChecked, setIsChecked] = useState(false);
  const [selectmenu] = useAtom(lifemenustore);


  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };





  const BoardItems1 =[
    LIFEMENU.AI,
    LIFEMENU.BOARD,
    LIFEMENU.WORK,
    LIFEMENU.RECIPE,
    MEDICALMENU.MEDICALMEDICINE,
    MEDICALMENU.FOODINFOMATION,
  

  ]
  const BoardItems2 =[
    TOURISTMENU.TOURCOURSE,
    CONVENIENCEMENU.CONVENIENCECAMPING,
    TOURISTMENU.TOURFESTIVAL,
    PERFORMANCEMENU.PERFORMANCEEVENT,
    TOURISTMENU.TOURREGION,
    LIFEMENU.PICTURE,
    PERFORMANCEMENU.PERFORMANCECINEMA,


  ]
  const BoardItems3 =[
    LIFEMENU.GAME,
    CONFIGMOVE.RULLET,
    LIFEMENU.ATTENDANCE,


  ]

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

    setLoading(loading);


  },[refresh])



  useEffect(()=>{

  }, [])

  const _handlegamestart = () =>{
    navigate("/PClogin");
  }


  return (
    <>
    <Container style={containerStyle}>     
    <Row style={{marginTop:10,width:"100%",margin:"0 auto", display:"flex", alignItems:"flex-start", justifyContent:"flex-start"}}>
    
          <Column style={{ flexWrap: "wrap", width: "55%", margin: "100px auto", justifyContent: "flex-start", alignItems: "flex-start" }}>
            

            <img src={imageDB.RULLETEVENT} style={{ width: "100%" }} />
            <img src={imageDB.ATTENDANCEEVENT} style={{ width: "100%", marginTop:30 }} />
            <img src={imageDB.GAMEEVENT} style={{ width: "100%", marginTop: 30 }} />

          </Column>

    </Row>
    </Container>
    </>
  );
}

export default PCEventBoard;

