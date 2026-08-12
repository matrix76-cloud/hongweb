import React, { Fragment } from "react";
import moment from "moment";
import { ko } from 'date-fns/locale';
import ButtonEx from "../common/ButtonEx";
import styled from 'styled-components';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getFontSize } from '../utility/fontsize';
import HongButton from "./HongButton";

export const StyledCalendarWrapper = styled.div`
  width: 95%;
  margin : 20px auto 0px;
  display: flex;
  justify-content: center;
  position: relative;
  border-bottom :1px solid #ededed;
`



// 캘린더를 불러옴
export const StyledCalendar = styled(Calendar)`

width: 100%;
background: white;
border: none;
line-height: 2.3em;
font-size: ${() => getFontSize(20)}px; /* 글자 크기 */
text-decoration: none; /* 밑줄 제거 */
 height: 60vh;


.react-calendar {
  transition: opacity 0.3s ease-in-out;
 
}

.react-calendar-hidden {
  opacity: 0;
  visibility: hidden;
  height: 0;
}


.react-calendar__navigation button {
  color: #4d4d4d;
  min-width: 100px;
  width: 200px;
  background: none;
  font-size: ${() => getFontSize(20)}px; /* 네비게이션 버튼 글자 크기 */
  margin-top: 22px;
  flex-grow : unset !important;
  width : 100%;
  white-space: nowrap; /* ✅ 이 줄 추가 */

}

.react-calendar__navigation button:hover {
  background : #fff !important;
}

.react-calendar__navigation button:disabled{
  background : #fff !important;
}

.react-calendar__month-view__weekdays__weekday {
  font-size: ${() => getFontSize(14)}px; /* 요일 이름 글자 크기 */
  color: #6b6b6b;
  text-decoration: none; /* 밑줄 제거 */
}

.react-calendar__tile {
  background: none !important;
  font-size: ${() => getFontSize(16)}px; /* 날짜 타일 글자 크기 */
  color: #4d4d4d;
  padding: 5px 6.6667px;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  position: relative;
}

.react-calendar__tile abbr {
    font-size: ${() => getFontSize(16)}px; /* 날짜 숫자 크기 */

  }
  
  .react-calendar__tile .today-label {
    position: absolute;
    top: 65%;
    font-size: ${() => getFontSize(10)}px;
    color: black;
    line-height: 1;
    transform: translateY(-50%);
  }

.react-calendar__navigation__prev-button,
.react-calendar__navigation__next-button  {
  width: 30px; /* 너비 */
  font-size: 30px !important;  /* 아이콘 크기 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff !important; /* 배경색 */
  cursor: pointer;

}

.react-calendar__navigation__prev-button:hover,
.react-calendar__navigation__next-button:hover  {
  background : #fff !important;

}

.react-calendar__tile--now {
  font-size: ${() => getFontSize(14)}px;

 }
 .react-calendar__tile:disabled {
  color: #d6cfcf !important;
 }

.react-calendar__tile--active {
  background: #ff7e19 !important;
  color: white !important;

  -webkit-tap-highlight-color: transparent; /* iOS 클릭 시 하이라이트 제거 */

  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  border-radius: 50%;

}
.react-calendar__tile .react-calendar__tile--active{
  background: #ff7e19 !important;
  color: white !important;

  -webkit-tap-highlight-color: transparent; /* iOS 클릭 시 하이라이트 제거 */

  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  border-radius: 50%;
}

.react-calendar__tile--hover {
  background: #1087ff;
}

.react-calendar__tile--now{
  font-size: ${() => getFontSize(16)}px;
}

.react-calendar__tile--active,
.react-calendar__tile:focus,
.react-calendar__tile:active {
  background: #ff7e19 !important;
  color: white !important;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  border-radius: 50%;
}

.react-calendar__navigation__label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: ${() => getFontSize(20)}px;
}


`;



const DateScreen = ({ index, selectdate, handleDateChange, onNext }) => {
  return (
    <div className="fade-in-bottom" style={{ width: "100%"}}>
    <StyledCalendar
    value={selectdate}
    onChange={handleDateChange}
    formatDay={(locale, date) => moment(date).format("D")}
    formatYear={(locale, date) => moment(date).format("YYYY")}
    formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
    calendarType="gregory"
    showNeighboringMonth={false}
    selectRange={false}
    next2Label={null}
    prev2Label={null}
    minDetail="year"
    minDate={new Date()}
    locale={ko}
    dateFormat="yyyy년 MM월 dd일"
    

    />


      <div style={{ width: '90%', margin: "10px auto" }}>
        {/* <ButtonEx
          containerStyle={{ fontSize: () => getFontSize(16), marginTop: 20 }}
          onPress={() => onNext(index)}
          height={'56px'}
          width={'100'}
          radius={'4px'}
          bgcolor={'#FFA95E'}
          color={'#fff'}
          text={'다음'}
        /> */}

        <HongButton 
        style={{ marginTop: 20 }}
        variant="primary" fullWidth onClick={() => onNext(index)} >
        다음
        </HongButton>


        

      </div>
    </div>
  );
};

export default React.memo(DateScreen);
