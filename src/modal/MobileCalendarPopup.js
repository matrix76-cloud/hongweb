import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';

import styled from 'styled-components';
import { imageDB } from '../utility/imageData';
import { BetweenRow, FlexstartRow, Row } from '../common/Row';
import { UserContext } from '../context/User';
import { ReadCATEGORY } from '../service/CategoryService';
import { useNavigate } from 'react-router-dom';

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { ko, se } from 'date-fns/locale';
import { FaRegCalendarCheck } from "react-icons/fa6";
import { getFontSize } from '../utility/fontsize';

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};
//   transform: 'translate(-50%, -50%)',
const style = {
    position: 'absolute',
    top: '85%',
    left: '50%',
    height:'800px',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '14px 34px',
    zIndex:100,
};
const IconCloseView = styled.div`

`
const MainData = styled.div`
  display :flex;
  flex-direction:row;
  background-color : #fff;
  flex-wrap : wrap;
  margin: 0 auto;
  width:80%;
  padding-right: 30px;
`
// background-color :  ${({check}) => check == 1 ? "#ff4e193b" : "#EDEDED" }; 
const MainDataItem = styled.div`
    padding: 5px 10px;
    justify-content: space-evenly;
    align-items: center;
    display: flex;
    border-radius: 5px;
    width: 40%;
    background-color: #fff;
    margin-left: 10px;
    margin-bottom: 10px;
`
const MainDataItemText = styled.span`
  font-size :16px;
  font-weight:500;
  font-family : ${({theme}) =>theme.REGULAR};
  color :  ${({check}) => check == 1 ? "#FF4E19" : "#000" };  

`
const ApplyItem = styled.div`
  display :flex;
  flex-direction : row;
  justify-content : center;
  align-items : center;
  background-color : #fff;
  margin-bottom : 20px;
`
const FilterApplyButton = styled.div`
    background-color :#FF7125;
    padding :0px 24px;
    border-radius :100px;
    height:46px;
    display:flex;
    justify-content:center;
    align-items:center;

`
const FilterApplyButtonText = styled.span`
  color :#fff;
  font-size :18px;
  font-family : ${({theme}) =>theme.REGULAR};
  font-weight:700;
`

const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

const MobileResultContent = {
  width: '75%',
  height: '250px',
  padding: '0px 50px',
  margin : "0px auto",
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",

}

const Inputstyle={
  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '40px',
  border : "1px solid #EDEDED",

}

const Label = styled.div`
  font-size: ${() => getFontSize(16)}px;
  color: rgb(19, 19, 19);
  width: 40%;
  margin: 10px auto;
`

export const StyledCalendarWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  position: relative;
  margin : 0 auto;
`



// 캘린더를 불러옴
export const StyledCalendar = styled(Calendar)`

width: 100%;
background: white;
border: none;
line-height: 2.5em;
font-size: ${() => getFontSize(20)}px; /* 글자 크기 */
text-decoration: none; /* 밑줄 제거 */


.react-calendar{
  border: none !important;
}

.react-calendar__navigation {
  margin-bottom:0px;
}

.react-calendar__navigation button {
  color: #4d4d4d;
  min-width: 44px;
  background: none;
  font-size: ${() => getFontSize(20)}px; /* 네비게이션 버튼 글자 크기 */
  margin-top: 22px;
  flex-grow : unset !important;
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

  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  border-radius: 50%;
}

.react-calendar__tile--hover {
  background: #1087ff;
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

`;



export default function MobileCalendarPopup({callback}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [categoryitems, setCategoryitems] = React.useState([]);
  const navigate = useNavigate();
  const { dispatch, user } = React.useContext(UserContext);

  const [ingredient, setIngredient] = React.useState('');

  const [icecheck, setIcecheck] = React.useState(false);
  const [alarmcheck, setAlarmcheck] = React.useState(false);
  const [selectdate, setSelectdate] = React.useState('');

  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 





  React.useEffect(()=>{

    setIngredient(ingredient);
    setIcecheck(icecheck);
    setAlarmcheck(alarmcheck);
    setSelectdate(selectdate);
  },[refresh])

  React.useEffect(()=>{
    async function FetchData(){

    }
    FetchData();
  }, [])


  const handleDateChange = (newDate) => {

    console.log("new date", newDate);
    setSelectdate(newDate.toLocaleDateString());

    callback(newDate.toLocaleDateString());
    setOpen(false);
    setRefresh((refresh) => refresh +1);
  };

  return (
    <div>
        <StyledCalendarWrapper>
              <StyledCalendar
                value={selectdate}
                onChange={handleDateChange}
                formatDay={(locale, date) => moment(date).format("D")} // 일 제거 숫자만 보이게
                formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
                formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
                calendarType="gregory" // 일요일 부터 시작
                showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
                next2Label={null} // +1년 & +10년 이동 버튼 숨기기
                prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
                minDetail="year" // 10년단위 년도 숨기기
                minDate={new Date()} // 오늘 날짜 이전은 선택 불가
                locale={ko} // 한국어 로케일 설정
                dateFormat="yyyy년 MM월 dd일" // 한국어 형식으로 날짜 표시
              />
            </StyledCalendarWrapper>
      {/* <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
         
            <StyledCalendarWrapper>
              <StyledCalendar
                value={selectdate}
                onChange={handleDateChange}
                formatDay={(locale, date) => moment(date).format("D")} // 일 제거 숫자만 보이게
                formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
                formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
                calendarType="gregory" // 일요일 부터 시작
                showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
                next2Label={null} // +1년 & +10년 이동 버튼 숨기기
                prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
                minDetail="year" // 10년단위 년도 숨기기
                minDate={new Date()} // 오늘 날짜 이전은 선택 불가
                locale={ko} // 한국어 로케일 설정
                dateFormat="yyyy년 MM월 dd일" // 한국어 형식으로 날짜 표시
              />
            </StyledCalendarWrapper>
 

   
          </Box>
        </Fade>
      </Modal> */}
    </div>
  );
}