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
import MobileCalendarPopup from './MobileCalendarPopup';
import { CreateFreeze, ReadFREEZE } from '../service/FreezeService';
import { sleep } from '../utility/common';
import { FreezeItems, HomeWorkItems } from '../store/jotai';
import { useAtom } from 'jotai';
import { CreateHomeWork, ReadHomeWork } from '../service/HomeWorkService';
import LottieAnimation from '../common/LottieAnimation';
import { LoadingSearchAnimationStyle2 } from '../screen/css/common';
import { Toaster, toast } from 'sonner';
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
    top: '70%',
    left: '50%',
    height:'650px',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxShadow: 24,
    padding: '14px 24px',
    zIndex:2,
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
    background-color :#FE6625;
    width:100%;
    border-radius :10px;
    height:46px;
    display:flex;
    justify-content:center;
    align-items:center;

`

const FilterApplyDisableButton = styled.div`
    background-color :#EDEDED;
    width:100%;
    border-radius :10px;
    height:46px;
    display:flex;
    justify-content:center;
    align-items:center;

`

const FilterApplyDisableButtonText = styled.span`
  color :#fff;
  font-size :18px;
  font-family : ${({ theme }) => theme.REGULAR};
  font-weight:700;
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
  width: 75%;
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
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  border-radius: 50%;

`;



const EmptyLine = styled.div`
  height: 5px;
  background: #ededed;
  margin: 20px 0px;

`

export default function MobileWorkadd({callback}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [categoryitems, setCategoryitems] = React.useState([]);
  const navigate = useNavigate();
  const { dispatch, user } = React.useContext(UserContext);

  const [name, setName] = React.useState('');

  const [alarmcheck, setAlarmcheck] = React.useState(false);

  const [calendarpopup, setCalendarpopup] = React.useState('');
  const [calendarpopup1, setCalendarpopup1] = React.useState('');
  const [startdate, setStartdate]= React.useState('');
  const [phone, setPhone] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [homeworkmenu, setHomeworkmenu] = useAtom(HomeWorkItems);
  const [saving, setSaving] = React.useState(false);

  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 



  React.useEffect(()=>{

    setPhone(phone);
    setName(name);
    setAlarmcheck(alarmcheck);
    setCalendarpopup(calendarpopup);
    setMemo(memo);
    setStartdate(startdate);
    setSaving(saving);

    setHomeworkmenu(homeworkmenu);
    
  },[refresh])

  React.useEffect(()=>{
    async function FetchData(){




      
    }
    FetchData();
  }, [])

  const _handleadd = async()=>{

    const USERS_ID = user.USERS_ID;
    const NAME = name;
    const STARTDATE = startdate;
    const ALARM = alarmcheck;
    const PHONE = phone;
    const MEMO = memo;

    
    if (memo == '' || name == '' || startdate == '') {
      toast.error("내용을 입력하고 추가해주세요", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })
      return;
    }



    setSaving(true);
    setRefresh((refresh) => refresh + 1);

    const addHomeWork = await CreateHomeWork({ USERS_ID, NAME, STARTDATE, PHONE, ALARM, MEMO }) 

    await sleep(2000);


    const readhomeworkitemsTmp = await ReadHomeWork({ USERS_ID });

    console.log("readhomeworkitems", readhomeworkitemsTmp);

    if (readhomeworkitemsTmp != -1) {
      setHomeworkmenu(readhomeworkitemsTmp);
      setRefresh((refresh) => refresh + 1);

      console.log("homeworkmenu", homeworkmenu);

    }


    await sleep(500);

    setSaving(false);

    toast.info("가사분담 일감을 추가 하였습니다", {
      duration: 1000,
      style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
    })

    callback("");
    setOpen(false);
    setRefresh((refresh)=> refresh +1);
  }




  const _handlealarmcheck = () =>{
 
    setAlarmcheck(!alarmcheck);
    setRefresh((refresh)=> refresh +1);
  }

  const _handleStart = () =>{
    setCalendarpopup(true);
    setRefresh((refresh)=> refresh +1);
  }



  const startcallback = (data)=>{
    setStartdate(data);
    setCalendarpopup(false);
    setRefresh((refresh)=> refresh +1);
  }

  return (
    <div>

      {
        calendarpopup == true && <MobileCalendarPopup callback={startcallback}/>
      }



      <Modal
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

              {
                saving == true && <LottieAnimation containerStyle={LoadingSearchAnimationStyle2} animationData={imageDB.loadinglarge} width={"100px"} height={'100px'} />
              }

              <Row>
                <HeaderPopupline/>
              </Row>
       

            <BetweenRow style={{ width:"85%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>가사메모 추가</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
             </BetweenRow>

            <Row style={{width:"85%", margin:"15px auto"}}>

            <Label>내용</Label>
            <input  type="text" value ={memo} style={Inputstyle}
                placeholder={'추가할 가사메모를 넣어주세요'}
                maxLength={6} // 6자 제한
              onChange={(e) => {
                setMemo(e.target.value);
                setRefresh((refresh) => refresh + 1);
                
             }}
            ></input>
            </Row>


            <Row style={{ width: "85%", margin: "15px auto" }}>

              <Label>담당자</Label>
              <input type="text" value={name} style={Inputstyle}
                placeholder={'가사담당자 이름을 넣어주세요 예)아들'}
                maxLength={6} // 6자 제한
                onChange={(e) => {
                  setName(e.target.value);
                  setRefresh((refresh) => refresh + 1);
                }}
              ></input>
            </Row>
     
            <Row style={{ width:"85%", margin:"15px auto"}}>
            <Label>실행일자</Label>

            <FlexstartRow style={{width:"100%"}}>
              <FaRegCalendarCheck onClick={_handleStart}/>
              {
                startdate == '' ? (<div style={{paddingLeft:5}}>실행일자를 선택해주세요</div>) :(
                  <div style={{paddingLeft:5}}>{startdate}</div>
                )
              }
           
            </FlexstartRow>

            </Row>

          
        
            <EmptyLine />
            <Row style={{width:"85%", margin:"5px auto"}}>
            <Label style={{width:"70%"}}>실행일자시 도달시 알람발생</Label>
            <div style={{width:"30%",display:"flex", justifyContent:"flex-end"}} onClick={_handlealarmcheck}>
            {
                alarmcheck == true ? ( <img src={imageDB.radioenable}  style={{width:"50px"}}/>) :( <img src={imageDB.radiodisable}  style={{width:"50px"}}/>)
              }
            </div>
            </Row>


            {
              alarmcheck == true  &&
                <Row style={{ width: "85%", margin: "5px auto" }}>
                  <Label style={{width:'30%'}}>전화번호</Label>
                  <input type="number" value={phone} style={Inputstyle}
                    placeholder={'알람받을분 번호를 입력해주세요'}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setRefresh((refresh) => refresh + 1);
                    }}
                  ></input>
                </Row>
          }



             <ApplyItem>
              <div style={{ dispaly: "flex", alignItems: "center", justifyContent: "center", width: "90%", margin: "20px auto 0px" }}>  
                {
                  saving == true ? (<FilterApplyDisableButton ><FilterApplyDisableButtonText>추가중</FilterApplyDisableButtonText></FilterApplyDisableButton>) : (<FilterApplyButton onClick={_handleadd}><FilterApplyButtonText>추가</FilterApplyButtonText></FilterApplyButton>)
                }
                    
                </div>
              </ApplyItem>

   
          </Box>
        </Fade>
      </Modal>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}