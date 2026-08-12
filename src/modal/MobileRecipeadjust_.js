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
import { CreateFreeze, DeleteFreezeFREEZE_ID, ReadFREEZE, UpdateFREEZECHECKid, UpdateFREEZEid } from '../service/FreezeService';
import { sleep } from '../utility/common';
import { subDays, format } from "date-fns";
import { FreezeItems } from '../store/jotai';
import { useAtom } from 'jotai';
import LottieAnimation from '../common/LottieAnimation';
import { LoadingSearchAnimationStyle2 } from '../screen/css/common';
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
  top: '72%',
  left: '50%',
  height: '500px',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: 'background.paper',
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  boxShadow: 24,
  padding: '14px 24px',
  zIndex: 2,
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
  justify-content : space-evenly;
  align-items : center;
  background-color : #fff;
  width: 95%;
  margin: 20px auto;
`
const FilterApplyButton = styled.div`
    background-color :#FE6625;
    width:90%;
    border-radius :10px;
    height:46px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin : 10px auto;


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

  height: 60%;
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



export default function MobileRecipeadjust({ callback, adjustfreezeitem }) {
  
console.log("MATRIX LOG : MobileRecipeadjust : adjustfreezeitem:", adjustfreezeitem)




  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [categoryitems, setCategoryitems] = React.useState([]);
  const navigate = useNavigate();
  const { dispatch, user } = React.useContext(UserContext);

  const [ingredient, setIngredient] = React.useState(adjustfreezeitem.NAME);

  const [icecheck, setIcecheck] = React.useState(adjustfreezeitem.ENDDATE != '');
  const [alarmcheck, setAlarmcheck] = React.useState(adjustfreezeitem.ALARM);

  const [calendarpopup, setCalendarpopup] = React.useState('');
  const [calendarpopup1, setCalendarpopup1] = React.useState('');
  const [startdate, setStartdate]= React.useState(adjustfreezeitem.STARTDATE);
  const [lastdate, setLastdate]= React.useState(adjustfreezeitem.ENDDATE);
  const [freezemenu, setFreezemenu] = useAtom(FreezeItems);
  const [saving, setSaving] = React.useState(false);

  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 



  React.useEffect(()=>{

    setIngredient(ingredient);
    setIcecheck(icecheck);
    setAlarmcheck(alarmcheck);
    setCalendarpopup(calendarpopup);
    setCalendarpopup1(calendarpopup1);
    setStartdate(startdate);
    setLastdate(lastdate);
    setSaving(saving);


  },[refresh])

  React.useEffect(()=>{
    async function FetchData(){


      const current = new Date();

      const limitdate = new Date(adjustfreezeitem.ENDDATE);

      const twoDayAgo = subDays(limitdate, 2); // 이틀 빼기

      console.log("twoDayAgo", twoDayAgo);

      if (current.getTime() > twoDayAgo.getTime() && current.getTime() < limitdate.getTime()) {
        console.log("유효기간이 도래 하였습니다", twoDayAgo);
      }



    }
    FetchData();
  }, [])



  const _handlealarmcheck = () =>{
    setAlarmcheck(!alarmcheck);
    setRefresh((refresh)=> refresh +1);
  }

  const _handleStart = () =>{
    setCalendarpopup(true);
    setRefresh((refresh)=> refresh +1);
  }

  const _handleLast = () =>{
    setCalendarpopup1(true);
    setRefresh((refresh)=> refresh +1);
  }

  const startcallback = (data)=>{
    setStartdate(data);
    setCalendarpopup(false);
    setRefresh((refresh)=> refresh +1);
  }
  const lastcallback = (data)=>{
    setLastdate(data);
    setCalendarpopup1(false);
    setRefresh((refresh)=> refresh +1);
  }

  const _handledelete = async () => {
    
    setSaving(true);
    setRefresh((refresh) => refresh + 1);

    const FREEZE_ID = adjustfreezeitem.FREEZE_ID;

    const deletefreeze = await DeleteFreezeFREEZE_ID({FREEZE_ID});
    await sleep(1500);
    const USERS_ID = user.USERS_ID;
    const freezeitemsTmp = await ReadFREEZE({ USERS_ID });

    console.log("freezeitems", freezeitemsTmp);

    if (freezeitemsTmp != -1) {
      setFreezemenu(freezeitemsTmp);
    } else {
      setFreezemenu([]);
    }
    setSaving(false);
    callback("delete");
    setOpen(false);
    setRefresh((refresh)=> refresh +1);

  }

  const _handleadjust = async() =>{

    const FREEZE_ID = adjustfreezeitem.FREEZE_ID;
    const ITEM = {
      NAME:"",
      STARTDATE:"",
      ENDDATE:"",
      ALARM:false
    }
    ITEM.NAME = ingredient;

    if(startdate != undefined){
      ITEM.STARTDATE = startdate;
    }


    if(lastdate != undefined){
      ITEM.ENDDATE = lastdate;
    }



    if(alarmcheck != undefined){
      ITEM.ALARM = alarmcheck;
    }



    
    const updatefreeze = await UpdateFREEZEid({FREEZE_ID, ITEM});
    await sleep(1000);
    callback("adjust");
    setOpen(false);
    setRefresh((refresh)=> refresh +1);


  }
  return (
    <div>

      {
        calendarpopup == true && <MobileCalendarPopup callback={startcallback}/>
      }
      {
        calendarpopup1 == true && <MobileCalendarPopup callback={lastcallback}/>
      }
      {
        saving == true && <LottieAnimation containerStyle={LoadingSearchAnimationStyle2} animationData={imageDB.loadinglarge} width={"100px"} height={'100px'} />
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
              <Row>
                <HeaderPopupline/>
              </Row>
       

              <BetweenRow style={{width:"85%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>식재료 수정/삭제</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
             </BetweenRow>

            <Row style={{ width:"85%", margin:"15px auto"}}>

            <Label>재료이름</Label>
            <input  type="text" value ={ingredient} style={Inputstyle}
              placeholder={'추가할 식재료를 넣어주세요'}
              onChange={(e) => {
                setIngredient(e.target.value);
                setRefresh((refresh) => refresh +1);
             }}
            ></input>
            </Row>
     
            <Row style={{ width:"85%", margin:"15px auto"}}>
            <Label>구매일자</Label>

            <FlexstartRow style={{width:"100%"}}>
              <FaRegCalendarCheck onClick={_handleStart}/>
              {
                startdate == '' ? (<div style={{paddingLeft:5}}>구매일자를 선택해주세요</div>) :(
                  <div style={{paddingLeft:5}}>{startdate}</div>
                )
              }
           
            </FlexstartRow>

            </Row>

            <Row style={{ width:"85%", margin:"15px auto"}}>
              <Label>유효일자</Label>
  
              <FlexstartRow style={{width:"100%"}}>
                  <FaRegCalendarCheck onClick={_handleLast}/>
                  {
                  lastdate == '' ? (<div style={{paddingLeft:5}}>유효일자를 선택해주세요</div>) :(
                    <div style={{paddingLeft:5}}>{lastdate}</div>
                  )
                }
              </FlexstartRow>
             </Row>
  




            <Row style={{ width:"85%", margin:"15px auto"}}>
            <Label style={{width:"60%"}}>유효일자도달시 알람발생</Label>
            <div style={{width:"40%",display:"flex", justifyContent:"flex-end"}} onClick={_handlealarmcheck}>
            {
                alarmcheck == true ? ( <img src={imageDB.radioenable}  style={{width:"50px"}}/>) :( <img src={imageDB.radiodisable}  style={{width:"50px"}}/>)
              }
            </div>
            </Row>


             <ApplyItem>
              <div style={{ dispaly: "flex", alignItems: "center", justifyContent: "center", width: "48%" }}>   
                
                {
                  saving == true ? (<FilterApplyDisableButton ><FilterApplyDisableButtonText>삭제중</FilterApplyDisableButtonText></FilterApplyDisableButton>) : (<FilterApplyButton onClick={_handledelete}><FilterApplyButtonText>삭제</FilterApplyButtonText></FilterApplyButton>)
                }

                
                </div>

           
              <div style={{ dispaly: "flex", alignItems: "center", justifyContent: "center", width: "48%" }}>   
                
                {
                  saving == true ? (<FilterApplyDisableButton ><FilterApplyDisableButtonText>수정중</FilterApplyDisableButtonText></FilterApplyDisableButton>) : (<FilterApplyButton onClick={_handleadjust}><FilterApplyButtonText>수정</FilterApplyButtonText></FilterApplyButton>)
                }

                </div>

              </ApplyItem>

   
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}