import React, { Component, memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../../context/User";
import moment from "moment";
import { imageDB } from "../../../utility/imageData";

import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { Column, FlexstartColumn } from "../../../common/Column";

import Button from "../../../common/Button";
import { DataContext } from "../../../context/Data";

import { readuser, readuserbydeviceid, Update_attendancebyusersid } from "../../../service/UserService";
import { getDateEx, getDateEx3, getDateEx4, getDateFullTime, getTime } from "../../../utility/date";
import { useDispatch } from "react-redux";
import { ALLREFRESH } from "../../../store/menu/MenuSlice";
import { shuffleArray, sleep } from "../../../utility/common";
import LottieAnimation from "../../../common/LottieAnimation";

import ButtonEx from "../../../common/ButtonEx";
import {motion} from 'framer-motion';
import RotateCardBasic from "../../../common/RotateCardBasic";
import RotateCard from "../../../common/RotateCard";
import MobileGameResult from "../../../modal/MobileGameResult";
import { ReadRACE } from "../../../service/RaceService";
import { LoadingRankingAnimationStyle, LoadingSearchAnimationStyle } from "../../../screen/css/common";
import Empty from "../Empty";
import { getFontSize } from "../../../utility/fontsize";


const Container = styled.div`

  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh-50px);
  touch-action: pan-y;
  height :1200px;


`
const InfoLayer = styled.div`
  background: #fcc81c57;
  width: 90%;
  margin: 0 auto;


`
const InfoLayerContent = styled.div`
  padding: 20px;
  font-size: ${() => getFontSize(14)}px;
  line-height:2;
`
const ListTag = styled.div`
  padding-left: 0px;
`

const TableHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  font-family:Pretendard-SemiBold;
  padding: 10px;
  font-size: ${() => getFontSize(16)}px;
`

const TableContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  font-size :12px;
  padding: 10px;
  border-bottom : 1px solid #ededed;
  height:50px;
`

const Layer = styled.div`

  background:#fdc66878;
  font-size: ${() => getFontSize(14)}px;
  width: 90%;
  margin: 40px auto 0px;
  left: 10px;
  color: #131313;
  padding: 10px;
  display: flex;
  flex-direction: column;
  line-height:2;

`



const AudioPlayer = ({ condition }) => {
  const [audio] = useState(new Audio("/sounds/game.mp3"));

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

  return null;
};

const MobileWaterRankContent =memo(({containerStyle, items}) =>  {

  const [seconds, setSeconds] = useState(0); // 10초 카운트다운

  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [currentloading, setCurrentloading] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [week, setWeek] = useState({ monday: null, sunday: null });



  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
    setWeek({ monday, sunday });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 1000); // 1초마다 강조 항목 변경

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [items.length]);


  useLayoutEffect(() => {

  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);




  return (
    <Column style={{height:800, justifyContent:"flex-start", width:"100%"}}>


      {
        items.length == 0 ? (<Empty content={"물섭취 주간 순위가 없습니다"} fontsize={'14px'}></Empty>) : (<TableHeader>
          <div style={{ fontSize: () => getFontSize(18) }}> 구해줘 알바 물섭취 주간 순위 </div>
          <div>({week.monday && week.monday.toLocaleDateString()} ~ {week.sunday && week.sunday.toLocaleDateString()})</div>
        </TableHeader>)
      }

      {
        items.map((data, index) => (
          <TableContent

            className={`tablerow ${index === highlightIndex ? 'highlighted' : ''}`}>

            <FlexstartRow style={{ width: '25%' }}>
              {index <= 2 && <img src={imageDB.medal} style={{ width: 25, height: 25 }} />}

              <div style={{ paddingLeft: 3 }}>{index + 1}위</div>
            </FlexstartRow>
            <FlexstartRow style={{ width: '25%' }}>

              <Column>

                <div>{getDateEx4(data.CREATEDT)}</div>
                <div>{getTime(data.CREATEDT)}</div>
              </Column>

            </FlexstartRow>
            <FlexstartRow style={{ width: '25%' }}>{data.NAME}</FlexstartRow>
            <FlexstartRow style={{ width: '25%' }}>{30 - data.COUNT}횟수/{data.MINUTE}초</FlexstartRow>

          </TableContent>
        ))
      }
    </Column>
  );

});

export default MobileWaterRankContent;

