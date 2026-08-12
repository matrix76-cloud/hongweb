import React, {useContext, useEffect, useLayoutEffect, useState } from "react";

import styled from 'styled-components';



import { Calendar, dateFnsLocalizer,Views, momentLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";

import moment from 'moment';
import "./BirthCalendar.css";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ko'; // 한국어 로케일 추가
import { HomeWorkItems } from "../store/jotai";
import { useAtom } from "jotai";
import { BetweenRow, FlexEndRow, Row } from "../common/Row";
import { BiTask } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { imageDB } from "../utility/imageData";
import MobileWorkadd from "../modal/MobileWorkadd";
import { UserContext } from "../context/User";
import { ReadBIRTDHDAY, ReadHomeWork, UpdateHOMEWORKid } from "../service/HomeWorkService";
import { Column } from "../common/Column";
import { sleep, useSleep } from "../utility/common";
import WorkCalendarInfo from "./WorkCalendarInfo";
import { getFontSize } from '../utility/fontsize';

moment.locale('ko'); // 한국어 설정
const localizer = momentLocalizer(moment);

const messages = {
  allDay: '종일',
  previous: '이전',
  next: '다음',
  today: '오늘',
  month: '월',
  week: '주',
  day: '일',
  agenda: '일정',
  date: '날짜',
  time: '시간',
  event: '이벤트',
  showMore: (total) => `+${total}건`,
};

const NaviButton = styled.div`
    padding: 5px 10px;
    color: #131313;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;
    margin-left:10px;

`


const CustomToolbar = ({ label, onNavigate, onCustomButtonClick }) => {

  const [workaddpopup, setWorkaddpopup] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const { dispatch, user } = useContext(UserContext);



  const _handleworkadd = () => {
    setWorkaddpopup(true);
    setRefresh((refresh) => refresh + 1);
  }

  useEffect(() => {

    setWorkaddpopup(workaddpopup);


  }, [refresh])

  const MobileWorkAddCallback = async () => {
    const USERS_ID = user.USERS_ID;
    setWorkaddpopup(false);
    onCustomButtonClick();
    setRefresh((refresh) => refresh + 1);
  }


  return (
    <div className="custom-toolbar">

      {
        workaddpopup == true && <MobileWorkadd callback={MobileWorkAddCallback} />
      }



      <Row style={{height:60, width:"100%"}}>

        <NaviButton onClick={() => onNavigate("PREV")}>◀</NaviButton>

        <div style={{ fontSize: () => getFontSize(18), fontFamily: "Pretendard-SemiBold", display: "flex", justifyContent: "center", width: "100%" }}>
          <div>{label}</div>
        </div>
        <NaviButton onClick={() => onNavigate("NEXT")}>▶</NaviButton>
      </Row>

    </div>
  );
};


const eventStyleGetter = (event, start, end, isSelected) => {
  let style = {
    backgroundColor: event.backgroundcolor,
    borderRadius: '2px',
    opacity: event.opacity,
    fontFamily : "Pretendard-SemiBold",
    color: event.color,
    border: '0px',
    fontSize:"20px",
    display: 'block',
    padding: '1px',
  };
  return { style };
};

const HEADER_HEIGHT = 44;
const Container = styled.div`

  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;
  padding: 0 16px;

`

const AddButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color : #131313;
  display:flex;
  background :#fff;
  padding :5px 8px;
  border-radius :10px;
  border : 1px solid #E8E9EA;
`

const WorkLayer = styled.div`
    background: #F5F6F9;
    margin-top: 10px;
    padding: 15px;

`
const WorkContent = styled.div`
    color :#1A1E28;
    font-size: ${() => getFontSize(14)}px;

`
const WorkName = styled.div`
    background: #FFF0E9;
    padding: 5px 10px;
    color: #FE6625;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;

`

const RecommendTitle = styled.div`
  font-family: 'Pretendard-Bold';
  margin: 10px 0px;
  color :#131313;

`

const UnTask = styled.div`
  color: #FE6625;
`
const Task = styled.div`
  text-decoration:line-through;
`

const EmptyLine = styled.div`
  height: 20px;
  background: #f8f8f8;
  width: 100%;
  margin: 30px 0px;
`

const UnBoxItem = styled.div`
  width: 90%;
  margin: 5px auto;
  background: #FFF;
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Pretendard-SemiBold;

`
const BoxItem = styled.div`
  margin: 5px auto;
  background: #FFF;
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Pretendard-SemiBold;
  text-decoration:line-through;
`
const Name = styled.div`
  color: #999;
  font-size: ${() => getFontSize(14)}px;
  font-family: 'Pretendard-Light';

`

const UnName = styled.div`
  color: #FE6625;
  font-size: ${() => getFontSize(14)}px;
  font-family: 'Pretendard-Light';

`

const CompleteBtn = styled.div`
  background: #FE6625;
  color: #fff;
  padding: 5px;
  border-radius: 10px;
  font-size: ${() => getFontSize(12)}px;

`

const ShareLayer = styled.div`
    padding-top: 50px;
    font-size: ${() => getFontSize(22)}px;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
`

const BirthCalendar = ({ containerStyle, callback, items, share }) => {


  console.log("Birthday Calendar", items);

  const { dispatch, user } = useContext(UserContext);

  const [view, setView] = useState(Views.MONTH); // 기본 뷰는 월간 뷰
  const [homeworkmenu, setHomeworkmenu] = useAtom(HomeWorkItems);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(-1);
  const [key, setKey] = useState(1);
  const [workitems, setWorkitems] = useState([]);
  const [completeworkitems, setCompleteworkitems] = useState([]);
  const [uncompleteworkitems, setUncompleteworkitems] = useState([]);
  const [selectstart, setSelectstart] = useState(new moment().format('DD일'));
  const [selectstartorigin, setSelectstartorigin] = useState(new moment());


  const navigate = useNavigate();

  

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    items.map((data) => {
      events.push({ title: data.NAME, start: new Date(data.DATE), end: new Date(data.DATE), color: '#131313', backgroundcolor: '#FFF', opacity: 0.8 })
    })
  }, [])


  useEffect(() => {
    setEvents(events);
   
  }, [refresh])

  const _handleprev = () => {
    navigate(-1);
  }

  const handleCustomButtonClick = async() => {
    let eventsTmp = [];
    const USERS_ID = user.USERS_ID;

    const readhomeworkitemsTmp = await ReadMemoByIndividually({ USERS_ID });

    readhomeworkitemsTmp.map((data) => {

      if (data.complete == false) {
        eventsTmp.push({ title: data.MEMO, start: new Date(data.STARTDATE), end: new Date(data.STARTDATE), color: '#FFA95E', backgroundcolor: '#FFF0E9', opacity:0.8  }) 
      } else {
        eventsTmp.push({ title: data.MEMO, start: new Date(data.STARTDATE), end: new Date(data.STARTDATE), color: '#131313', backgroundcolor: "#fff", opacity: 0.8 }) 
      }

    })

    setEvents(eventsTmp);
    setRefresh((refresh) => refresh + 1);

    setKey((key) => key + 1);
  }

  const _handleSelectSlot = async({ start, end }) => {

    setSelectstart(moment(start).format("DD일"));
    setSelectstartorigin(start);


    const USERS_ID = user.USERS_ID;

    const homeworkitems = await ReadMemoByIndividually({ USERS_ID });

    console.log("homeworkitems", homeworkitems);

    let homeworkitemsTmp = [];
    homeworkitems.map((data, index) => {
      if (moment(data.STARTDATE).isSame(moment(start))) {
        homeworkitemsTmp.push(data);
      }
    })
    console.log("homeworkitemsTmp", homeworkitemsTmp);


    setWorkitems(homeworkitemsTmp);
    setRefresh((refresh) => refresh + 1);
    setKey((key) => key + 1);
  }
  const handleSelectEvent = async({ start }) => {
    console.log("start", start);
    setSelectstart(moment(start).format("DD일"));
    setSelectstartorigin(start);

    const USERS_ID = user.USERS_ID;

    const homeworkitems = await ReadMemoByIndividually({ USERS_ID });

    console.log("homeworkitems", homeworkitems);

    
    let homeworkitemsTmp = [];
    homeworkitems.map((data, index) => {
      if (moment(data.STARTDATE).isSame(moment(start))) {
        homeworkitemsTmp.push(data);
      }
    })
    console.log("homeworkitemsTmp", homeworkitemsTmp);

    setWorkitems(homeworkitemsTmp);
    setRefresh((refresh) => refresh + 1);
    setKey((key) => key + 1);
  }



  return (
    <Container>


   
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          messages={messages}
          selectable="ignoreEvents" // 이벤트 위에서도 슬롯 선택 가능

          eventPropGetter={eventStyleGetter} // 이벤트 스타일 적용
          views={['month']}
          components={{
            toolbar: (props) => <CustomToolbar {...props} onCustomButtonClick={handleCustomButtonClick} />,
          }}
        />
      </div>
      <div style={{height:100}}/>
 
    </Container>
  );
}

export default BirthCalendar;

