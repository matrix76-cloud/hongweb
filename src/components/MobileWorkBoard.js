
import { Table } from "@mui/material";
import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
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
import { DeleteHomeWorkHOMEWORK_ID, ReadHomeWork, UpdateHOMEWORKid } from "../service/HomeWorkService";
import KakaoShare from "./KakaoShare";
import CalendarNavigator from "./Calendar";
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
const HEADER_HEIGHT = 50;
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;

    display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;


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

const EmptyLine = styled.div`
  height: 2px;
  background: #ededed;
  margin: 20px 0px;

`
const Dday = styled.div`
  font-size: ${() => getFontSize(10)}px;
  border: 1px solid #ff7e19;
  background-color : #ff7e19;
  border-radius: 20px;
  color: #fff;
  padding: 0px 10px;
  margin-left: 10px;
  font-family: 'Pretendard-Bold';
`

const Alarm = styled.div`

  font-size: ${() => getFontSize(10)}px;
  border: 1px solid #1982ff;
  background-color : #1982ff;
  border-radius: 20px;
  color: #fff;
  padding: 0px 10px;
  margin-left: 10px;
  font-family: 'Pretendard-Bold';


`
const Name = styled.div`
  color: #999;
  font-size: ${() => getFontSize(14)}px;
  font-family: 'Pretendard-Light';

`
const Time = styled.div`
  color: #999;
  font-size: ${() => getFontSize(12)}px;
  display: flex;
  justify-content: flex-end;
  width: 100%;

`
const Freezename = styled.div`
  font-size: ${() => getFontSize(16)}px;

`
const Property = styled.div`
  font-size: ${() => getFontSize(10)}px;

`
const FoodContentItems = [
  {fooditem : "쇠고기",dday : "D-7",alarm : true,check : false},
  {fooditem : "우유",dday : "D-3",alarm : true,check : false},
  {fooditem : "갈치",dday : "D-6",alarm : false,check : false},
  {fooditem : "오리",dday : "",alarm : false,check : false},
  {fooditem : "돼지고기",dday : "",alarm : false,check : false},
]

const BoxItem = styled.div`
  width: 90%;
  margin: 10px auto;
  background: #f9f9f9;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Pretendard-SemiBold;
`
const Task = styled.div`

`
const UnTask = styled.div`
  text-decoration:line-through;
`
const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;

const EmptyTitle = styled.div`
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(22)}px;
    width: 90%;
    color: #423f3f;
    margin: 20px auto;
    display: flex;
    justify-content: center;

`

const EmptySubTitle = styled.div`
  margin: 5px 0px;

`
const sizeupblink = keyframes`
  0% { transform: scaleY(1); }
  50% { transform: scaleY(1.04); }
  100% { transform: scaleY(1); }
`;


const AnimatedCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background-color: ${(props) => (props.isDone ? '#f8f9fa' : '#FFE5D9')};
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 85%;
  margin: 0 auto 10px;
  position: relative;
  overflow: hidden;

  ${(props) => !props.isDone && css`
    animation: ${sizeupblink} 0.8s ease-in-out infinite;
  `}
`;

const TaskCard = memo(({ task, onToggle, onDelete }) => {

  const { MEMO: taskName, complete: isDone, STARTDATE: date, NAME: assignee } = task;
  

  const dateStyle = {
    padding: '0 8px',
    backgroundColor: '#FF8C42',
    color: '#ffffff',
    borderRadius: '12px 0 0 12px',
    minWidth: '80px',
    height: '100%',
    textAlign: 'center',
    position: 'absolute',
    left: '0',
    top: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1.2'
  };

  const contentStyle = {
    marginLeft: '90px',
    width: '100%',
    position: 'relative',
  };

  const deleteButtonStyle = {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '4px 8px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
  };

  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
  const day = String(formattedDate.getDate()).padStart(2, '0');

  return (
    <AnimatedCard isDone={isDone} onClick={() => onToggle(task)}>
      <div style={dateStyle}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{year}</span>
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{`${month}-${day}`}</span>
      </div>

      <div style={contentStyle}>
        <h3 style={{ margin: 0 }}>{taskName}</h3>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#6c757d' }}>
          담당자: <strong>{assignee}</strong> | {isDone ? '✅ 완료됨' : '❌ 미완료'}
        </p>

        <button
          style={deleteButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}>
          삭제
        </button>
      </div>
    </AnimatedCard>
  );
});



const ConfirmModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  if (!isOpen) return null;

  const modalBackdropStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const modalContentStyle = {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center'
  };

  const buttonStyle = {
    margin: '10px',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none'
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginBottom: '10px' }}>{taskName}</h3>
        <p style={{ marginBottom: '20px' }}>이 작업을 완료 상태로 변경할까요?</p>
        <button style={{ ...buttonStyle, backgroundColor: '#007bff', color: '#fff' }} onClick={onConfirm}>확인</button>
        <button style={{ ...buttonStyle, backgroundColor: '#ccc', color: '#333' }} onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  if (!isOpen) return null;

  const modalBackdropStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const modalContentStyle = {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center'
  };

  const buttonStyle = {
    margin: '10px',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none'
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginBottom: '10px' }}>{taskName}</h3>
        <p style={{ marginBottom: '20px' }}>이 작업을 정말 삭제할까요?</p>
        <button style={{ ...buttonStyle, backgroundColor: '#dc3545', color: '#fff' }} onClick={onConfirm}>삭제하기</button>
        <button style={{ ...buttonStyle, backgroundColor: '#ccc', color: '#333' }} onClick={onClose}>취소</button>
      </div>
    </div>
  );
};



const MobileWorkBoard =({containerStyle}) =>  {

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


  const [currentDate, setCurrentDate] = useState(new Date());

  const [homeworkitems, setHomeworkitems] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteTask, setSelectedDeleteTask] = useState(null);


  const handleDateChange = (newDate) => {

    console.log("selectdate", newDate);
    setSelectedDate(newDate);

    setRefresh((refresh) => refresh + 1);
  };


  // 현재 주의 시작 날짜 계산 (일요일 기준)

  const startOfCurrentMonth = startOfDay(currentDate);

  const Day = format(startOfCurrentMonth, 'MM월dd일');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);


  const onToggleTask = (task) => {
    if (!task.isDone) {
      setSelectedTask(task);
      setIsModalOpen(true);
    } else {
      alert('이미 완료된 작업이에요!');
    }
  };

  const OnDeleteTask = (task) => {
    setSelectedDeleteTask(task);
    setIsDeleteModalOpen(true);
  };



  const handleDeleteConfirm = async () => {
    const HOMEWORK_ID = selectedDeleteTask.HOMEWORK_ID;

    // 삭제 로직 호출
    await DeleteHomeWorkHOMEWORK_ID({ HOMEWORK_ID});

    // 상태 새로 불러오기
    await ReadHomeWorkStart();

    setIsDeleteModalOpen(false);
  };






  const filterTasksByWeek = (tasks, selectedDate) => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0); // 이번 주 시작 (일요일)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // 이번 주 끝 (토요일)

    return tasks.filter((task) => {
      const taskDate = new Date(task.STARTDATE);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  };


  async function ReadHomeWorkStart() {
    const USERS_ID = user.USERS_ID;
    const homeworkitemsTmp = await ReadHomeWork({ USERS_ID });

    console.log("homeworkitems", homeworkitemsTmp, selectedDate);

    if (homeworkitemsTmp != -1) {
      const filteredItems = filterTasksByWeek(homeworkitemsTmp, selectedDate);
      setHomeworkitems(filteredItems);
    }

    setRefresh((refresh) => refresh + 1);
    setLoading(false);
  }

  useEffect(()=>{


    console.log("데이타 변경하기");
    ReadHomeWorkStart();

  },[selectedDate])




  useEffect(() => {

    setSelectedDate(selectedDate);
    setHomeworkitems(homeworkitems);

  }, [refresh])

  const _handleselectdate = (date) =>{
    console.log("handle select date", date);
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


  const _handleWorkAdd = () => {
    navigate("/Mobilecommunity");
  }
  const _handleprev = () => {
    navigate(-1);
  }

  const handleCompleteTask = async (task) => {
    // 서버 상태 변경 처리
    const HOMEWORK_ID = task.HOMEWORK_ID;
    
    await UpdateHOMEWORKid({ HOMEWORK_ID });

    console.log('완료된 작업: 처리 하자', task);

    // 상태 변경 후 데이터 다시 불러오기
    await ReadHomeWorkStart();

    // 팝업 닫기
    setIsModalOpen(false);
  };

  return (

    <>
      <HeaderWrapper>
        <HeaderLayer>

          <Column style={{ width: "100%" }}>
            <BetweenRow onClick={_handleprev}  style={{ width: "90%", paddingTop: 20, margin: "0 auto" }}>
              <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center" }}>
                <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }}/>
                <div style={{ paddingLeft: 10, fontSize: getFontSize(20), fontFamily: "Pretendard-SemiBold", color: "#1A1E28" }}>{'가사업무 분담'}</div>
              </div>
              {/* 
          <KakaoShare height={20} width={20} text={'[구해줘 홍여사] 가사분담내용을 공유합니다'} url={`https://honglady.co.kr/MobileWorkView?id=${user.USERS_ID}`} /> */}
            </BetweenRow>
            <CalendarNavigator selectedDate={selectedDate} onDateChange={handleDateChange} />
          </Column>
        </HeaderLayer>
      </HeaderWrapper>

      <Container style={containerStyle}>



        <Column className="scrollable" style={{ width: "100%", justifyContent: "flex-start", borderRight: "1px solid #ededed" }}>

          <div style={{ width: "100%" }}>

            {
              homeworkitems.length != 0 ? (
                <>
                  {
                    homeworkitems.map((data) => (

                      <TaskCard task={data}
                        onToggle={() => onToggleTask(data)}
                        onDelete={() => OnDeleteTask(data)} />

                    ))
                  }

                  <ConfirmModal
                    isOpen={isModalOpen}
                    taskName={selectedTask ? selectedTask.MEMO : ''}
                    onConfirm={() => selectedTask && handleCompleteTask(selectedTask)}
                    onClose={() => setIsModalOpen(false)} />

                  <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    taskName={selectedDeleteTask ? selectedDeleteTask.MEMO : ''}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => setIsDeleteModalOpen(false)}
                  />

                </>
              ) : (
                <>
                  <Column
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "calc(100vh - 180px)",
                      paddingBottom: 100,
                    }}
                  >
                    <EmptyImage src={imageDB.homework} loading="eager" />
                    <EmptyTitle>등록된 가사분담이 없어요!</EmptyTitle>
                    <EmptySubTitle style={{ marginTop: 20 }}>
                      담당할 일을 추가하면
                    </EmptySubTitle>
                    <EmptySubTitle>여기에 등록되요</EmptySubTitle>

                    <ButtonEx
                      text={"추가하러 가기"}
                      width={"50"}
                      onPress={_handleWorkAdd}
                      bgcolor={"#F97316"}
                      color={"#fff"}
                      containerStyle={{
                        fontFamily: "Pretendard-Regular",
                        height: "47px",
                        fontSize: "18px",
                        border: "1px solid #fff",
                        marginTop: 20,
                        boxShadow: "none",
                        borderRadius: 20,
                      }}
                    />
                  </Column>







                </>

              )
            }
          </div>



        </Column>
      </Container>
    </>

  );

}

export default MobileWorkBoard;

