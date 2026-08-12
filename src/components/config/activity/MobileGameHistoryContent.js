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

  touch-action: pan-y;



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
  width: 90%;
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

const Box = styled.div`
    padding: 10px;
    border: 1px solid #ededed;
    margin: 20px;
    background: #f9f9f9;
    border-radius :10px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */
    &:active {
      transform: scale(0.95); /* 눌렀을 때 크기 조정 */
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
    }
`



const MobileGameHistoryContent =memo(({containerStyle, items}) =>  {

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





  useLayoutEffect(() => {

  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);




  return (
    <Column style={{justifyContent:"flex-start"}}>


      <FlexstartRow style={{ margin: "50px auto 0px", width:'90%', fontFamily:"Pretendard-SemiBold", fontSize: () => getFontSize(18) }}>마감된 주간 알바 순위입니다</FlexstartRow>

      {
        items.map((data, index) => (
    

          <Box>
                  <BetweenRow style={{width:'90%', marginBottom:10}}>
                    <div style={{ fontSize: () => getFontSize(16) }}> {data.RACEREPORT_DATE}</div>
                  </BetweenRow>
               <div style={{width:"75%", margin : "20px auto 0px"}}>
              <img src={data.RACEREPORT_IMG} style={{ width: "100%" }} />
              </div>
          </Box>
        ))
      }
    </Column>
  );

});

export default MobileGameHistoryContent;

