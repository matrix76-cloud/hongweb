import React, {useContext, useEffect, useLayoutEffect, useState } from "react";

import styled from 'styled-components';



import { Calendar, dateFnsLocalizer,Views, momentLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "./WorkCalendar.css";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ko'; // 한국어 로케일 추가

import { useAtom } from "jotai";
import { BetweenRow, FlexEndRow, Row } from "../common/Row";
import { BiTask } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { imageDB } from "../utility/imageData";
import MobileWorkadd from "../modal/MobileWorkadd";
import { UserContext } from "../context/User";
import { ReadHomeWork, UpdateHOMEWORKid } from "../service/HomeWorkService";
import { Column } from "../common/Column";
import { sleep, useSleep } from "../utility/common";
import LottieAnimation from "../common/LottieAnimation";
import { LoadingSearchAnimationStyle2 } from "../screen/css/common";
import Empty from "./Empty";
import { getDateEx3, getDateEx4 } from "../utility/date";

import { GoBellFill } from "react-icons/go";

const WorkLayer = styled.div`
    background: #F5F6F9;
    margin-top: 10px;
    border-radius: 10px;
`

const WorkCompleteLayer = styled.div`
    background: #F5F6F9;
    margin-top: 10px;

      border-radius: 10px;
`

const WorkContent = styled.div`
    color :#1A1E28;
    font-size: ${() => getFontSize(14)}px;
    width:65%;
    display:flex;
    align-items:center;

`
const CompleteBtn = styled.div`
    background: #ff7e19;
    color: #fff;
    padding: 5px 10px;
    font-size: ${() => getFontSize(12)}px;
    display: flex;
    justify-content: center;
    border: 1px solid #ededed;
    border-radius: 5px;

`
const WorkName = styled.div`
    background: #FFF0E9;
    padding: 5px 10px;
    color: #FE6625;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;

`
const UnWorkName = styled.div`
  color: #131313;
  font-size: ${() => getFontSize(14)}px;
  font-family: 'Pretendard-Light';

`



const RecommendTitle = styled.div`
  font-family: 'Pretendard-Bold';
  margin: 10px 0px;
  color :#131313;

`


const UnBoxItem = styled.div`
    margin: 5px auto;
    background: #ffffff;
    padding: 10px 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-family: Pretendard-SemiBold;
    border: 1px solid #eded;

`
const BoxItem = styled.div`
  margin: 5px auto;
  background: #EDEDED;
  padding: 15px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Pretendard-SemiBold;

`
const UnCompleteBoxStyle = `
.uncompletebox-with-line {
  position: relative;
  padding-left: 15px; /* 왼쪽 선과 내용 간격 */
}

.uncompletebox-with-line::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 5px; /* 선 두께 */
  height: 100%; /* 높이 전체 */
  background-color: #ff6b6b; /* 선 색상 */
}


`

const CompleteBoxStyle = `
.completebox-with-line {
  position: relative;
  padding-left: 15px; /* 왼쪽 선과 내용 간격 */
}

.completebox-with-line::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 5px; /* 선 두께 */
  height: 100%; /* 높이 전체 */
  background-color: #131313; /* 선 색상 */
}


`


const WorkCalendarInfoView = ({ containerStyle, workitems, selectstartorigin }) => {
 

  const { dispatch, user } = useContext(UserContext);
  const [view, setView] = useState(Views.MONTH); // 기본 뷰는 월간 뷰
  const [refresh, setRefresh] = useState(-1);
  const [key, setKey] = useState(1);
  const [completeworkitems, setCompleteworkitems] = useState([]);
  const [uncompleteworkitems, setUncompleteworkitems] = useState([]);
  const [homeworkmenu, setHomeworkmenu] = useState([]);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = useNavigate();



  useEffect(() => {


    let completeworkitemsTmp = [];
    let uncompleteworkitemsTmp = [];

    workitems.map((data) => {

      console.log("work data", data);
      if (data.complete == true) {
        completeworkitems.push(data);
        console.log("completeworkitemsTmp", completeworkitemsTmp, completeworkitemsTmp.length);
 
      } else {
        uncompleteworkitems.push(data);
        console.log("uncompleteworkitemsTmp", uncompleteworkitemsTmp, uncompleteworkitemsTmp.length);
      }
    })

    // setCompleteworkitems(completeworkitemsTmp);
    // setUncompleteworkitems(uncompleteworkitemsTmp);

    setRefresh((refresh) => refresh + 1);

  }, [])


  useEffect(() => {

    setCompleteworkitems(completeworkitems);
    setUncompleteworkitems(uncompleteworkitems);
    setSaving(saving);

  }, [refresh])

  const _handleprev = () => {
    navigate(-1);
  }





  return (
    <div style={{ height: 300, width: "100%" }}>   
      
      <style>{UnCompleteBoxStyle}</style>
      <style>{CompleteBoxStyle}</style>
      {
        saving == true && <LottieAnimation containerStyle={LoadingSearchAnimationStyle2} animationData={imageDB.loadinglarge} width={"100px"} height={'100px'} />
      }
      {
        uncompleteworkitems.length != 0 && <WorkCompleteLayer>


          {
            uncompleteworkitems.map((data) => (
              <div style={{ width: "100%" }}>
                <UnBoxItem className="uncompletebox-with-line">
                  <BetweenRow style={{width:"100%"}}>
                    <WorkContent>
                      {data.MEMO}
                      {
                        data.ALARM == true && <GoBellFill size={14} color={'#131313'} />
                      }
                    </WorkContent>
                
                    <Row>
                      <WorkName> {data.NAME}</WorkName>
                      <CompleteBtn>미완료</CompleteBtn>
                    </Row>

                  </BetweenRow>
              
          
             
                </UnBoxItem>
              </div>
            ))
          }
        </WorkCompleteLayer>
      }

      {
      completeworkitems.length != 0 && <WorkLayer>
  
          {
            completeworkitems.map((data) => (
              <div style={{ width: "100%" }}>
                <BoxItem className="completebox-with-line">
                  <WorkContent>{data.MEMO}
                    {
                      data.ALARM == true && <GoBellFill size={14} color={'#131313'} />
                    }

                  </WorkContent>
           
                  <UnWorkName>{data.NAME}</UnWorkName>
                </BoxItem>
              </div>
            ))
          }
      </WorkLayer>
      }


    </div>
  );
}

export default WorkCalendarInfoView;

