import React, {useContext, useEffect, useLayoutEffect, useState } from "react";

import styled from 'styled-components';



import { Calendar, dateFnsLocalizer,Views, momentLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "./WorkCalendar.css";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ko'; // 한국어 로케일 추가
import { HomeWorkItems } from "../store/jotai";
import { useAtom } from "jotai";
import { BetweenRow, FlexEndRow, Row } from "../common/Row";
import { BiTask } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { imageDB } from "../utility/imageData";
import MobileWorkadd from "../modal/MobileWorkadd";
import { UserContext } from "../context/User";
import { ReadHomeWork, UpdateHOMEWORKid } from "../service/HomeWorkService";
import { Column } from "../common/Column";
import { sleep, useSleep } from "../utility/common";
import WorkCalendarInfo from "./WorkCalendarInfo";
import MobileWorkDetailPopup from "../modal/MobileWorkDetailPopup";
import KakaoShare from "./KakaoShare";
import MobileWorkDetailPopupView from "../modal/MobileWorkDetailPopupView";


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
    color: event.color,
    fontFamily:'Pretendard-SemiBold',
    border: '0px',
    fontSize: "8px",
    display: 'block',
    padding: '1px',
  };
  return { style };
};

const Container = styled.div`
background-color : #fff;
scrollbar-width: none; // 스크롤바 안보이게 하기
overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
width:100%;
touch-action: pan-y;

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
const WorkCalendarView = ({ containerStyle, callback }) => {
  const { dispatch, user } = useContext(UserContext);

  const [view, setView] = useState(Views.MONTH); // 기본 뷰는 월간 뷰
  const [homeworkmenu, setHomeworkmenu] = useState([]);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(-1);
  const [key, setKey] = useState(1);
  const [workitems, setWorkitems] = useState([]);
  const [completeworkitems, setCompleteworkitems] = useState([]);
  const [uncompleteworkitems, setUncompleteworkitems] = useState([]);
  const [selectstart, setSelectstart] = useState(new moment().format('DD일'));
  const [selectstartorigin, setSelectstartorigin] = useState(new moment());

  const [workdetailpopup, setWorkdetailpopup] = useState(false);


  const [searchParams] = useSearchParams();
  const [shareid, setShareid] = useState(searchParams.get('id'));// URL 쿼리에서 id 가져오기

  const navigate = useNavigate();

  
  async function FetchData() {
    
    const USERS_ID = shareid;
    const items = await ReadHomeWork({ USERS_ID });

    console.log("items", items);

    items.map((data) => {
      if (data.complete == false) {
        events.push({ title: data.MEMO, start: new Date(data.STARTDATE), end: new Date(data.STARTDATE), color: '#FFF', backgroundcolor: '#FFA95E', opacity: 0.8 })
      } else {
        events.push({ title: data.MEMO, start: new Date(data.STARTDATE), end: new Date(data.STARTDATE), color: '#131313', backgroundcolor: "#fff", opacity: 0.8 })
      }
    })

    setHomeworkmenu(items);
    setRefresh((refresh) => refresh + 1);

  }


  useEffect(() => {

    FetchData();

    setRefresh((refresh) => refresh + 1);
    
 
  }, [])


  useEffect(() => {
    setEvents(events);
    setWorkitems(workitems);
    setCompleteworkitems(completeworkitems);
    setUncompleteworkitems(uncompleteworkitems);
    setSelectstart(selectstart);
    setSelectstartorigin(selectstartorigin);
    setWorkdetailpopup(workdetailpopup);
    setHomeworkmenu(homeworkmenu);
    setKey(key);
  }, [refresh])

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


  const handleCustomButtonClick = async() => {
    let eventsTmp = [];
    const USERS_ID = shareid;
 

    const readhomeworkitemsTmp = await ReadHomeWork({ USERS_ID });

    readhomeworkitemsTmp.map((data) => {

      if (data.complete == false) {
        events.push({ title: data.MEMO, start: new Date(data.STARTDATE), end: new Date(data.STARTDATE), color: '#FFF', backgroundcolor: '#FE6625', opacity: 0.8 })
      } else {
        events.push({ title: data.MEMO, start: new Date(data.STARTDATE), end: new Date(data.STARTDATE), color: '#131313', backgroundcolor: "#fff", opacity: 0.8 })
      }

    })

    setEvents(eventsTmp);
    setRefresh((refresh) => refresh + 1);

    setKey((key) => key + 1);
  }

  const _handleSelectSlot = async({ start, end }) => {

    setSelectstart(moment(start).format("DD일"));
    setSelectstartorigin(start);


    const USERS_ID = shareid;
  

    const homeworkitems = await ReadHomeWork({ USERS_ID });

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

    const USERS_ID = shareid;

    const homeworkitems = await ReadHomeWork({ USERS_ID });

    console.log("homeworkitems", homeworkitems);

    
    let homeworkitemsTmp = [];
    homeworkitems.map((data, index) => {
      if (moment(data.STARTDATE).isSame(moment(start))) {
        homeworkitemsTmp.push(data);
      }
    })
    console.log("homeworkitemsTmp", homeworkitemsTmp);

    setWorkitems(homeworkitemsTmp);

    setWorkdetailpopup(true);
    
    setRefresh((refresh) => refresh + 1);
    setKey((key) => key + 1);
  }

  const _handleWorkDetailPopupClose = async(data) => {


    setWorkdetailpopup(false);
    setRefresh((refresh) => refresh + 1);


  }



  return (
    <Container>

      {workdetailpopup == true && <MobileWorkDetailPopupView callback={_handleWorkDetailPopupClose} workitems={workitems} startdate={selectstartorigin} />}



   
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '90vh' }}
          messages={messages}
          selectable="ignoreEvents" // 이벤트 위에서도 슬롯 선택 가능
          onSelectSlot={_handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter} // 이벤트 스타일 적용
          views={['month']}
          components={{
            toolbar: (props) => <CustomToolbar {...props} onCustomButtonClick={handleCustomButtonClick} />,
          }}
        />
      </div>

      {/* <WorkCalendarInfo key={key} workitems={workitems} selectstart={selectstart} selectstartorigin={selectstartorigin}/>
  */}
    </Container>
  );
}

export default WorkCalendarView;

