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
import { FreezeItems } from '../store/jotai';
import { useAtom } from 'jotai';
import LottieAnimation from '../common/LottieAnimation';
import { LoadingSearchAnimationStyle2 } from '../screen/css/common';
import { Update_watergoalbyusersid } from '../service/UserService';
import { CurrentMenu } from '../utility/screen';
import { CreateBank, CreateMemo } from '../service/MemoService';
import { Column } from '../common/Column';
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
    top: '80%',
    left: '50%',
    height: '250px',
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
    width:95%;
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
  height: 60%;
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

export default function MobileMemoPopup({ callback, menu }) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);

  const navigate = useNavigate();
  const { dispatch, user } = React.useContext(UserContext);
  const [saving, setSaving] = React.useState(false);

  const [shoppingname, setShoppingname] = React.useState('');
 
  const [bankname, setBankname] = React.useState('');
  const [banknum, setBanknum] = React.useState('');
  const [birthitem, setBirthitem] = React.useState('');


  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 

  //const handleNameKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     _handleconfig();
  //   }
  // }

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return; // 키 중복 입력 방지
      if (event.key === "Enter") {
        console.log("key down......", bankname, banknum);
        // _handleconfig();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const _handleconfig = async () => {
    

    setSaving(true);
    setRefresh((refresh => refresh + 1));


    if (menu === CurrentMenu.SHOPPING) {

  
      if (shoppingname == '') {
        setSaving(false);
        setOpen(false);
        setRefresh((refresh => refresh + 1));

        return;
      }
      //저장한다

      const USERS_ID = user.USERS_ID;
      const MEMO = shoppingname;
      const MEMOTYPE = menu;

      await CreateMemo({ MEMO, USERS_ID, MEMOTYPE });
    } else if (menu === CurrentMenu.BANK) {
      
      console.log("key down1......", bankname, banknum);
      if (bankname == '' || banknum == '') {

        console.log("key down2......", bankname, banknum);

        setSaving(false);
        setOpen(false);
        setRefresh((refresh => refresh + 1));

        return;
      }
 
      //저장한다

      const USERS_ID = user.USERS_ID;
      const BANKNAME = bankname;
      const BANKNUM = banknum;
      const MEMOTYPE = menu;

      console.log("MEMO", BANKNAME, BANKNUM, MEMOTYPE);

      await CreateBank({ BANKNAME,BANKNUM, USERS_ID, MEMOTYPE });

      
    }else if (menu == CurrentMenu.BIRTHDAY) {
      
    }

  


    setSaving(false);
    setOpen(false);
    setRefresh((refresh => refresh + 1));

    callback('save');
  }

  React.useEffect(()=>{

    console.log("bankname", bankname, banknum);
    setSaving(saving);
    setBankname(bankname);
    setBanknum(banknum);

  },[refresh])




  return (
    <div>


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
       

            <BetweenRow style={{ width: "85%", margin: "20px auto", }}>
              {
                menu == CurrentMenu.SHOPPING && <div style={{ fontSize: "18px", fontWeight: 900, color: "#131313", fontFamily: 'Pretendard-SemiBold' }}>장바구니 추가</div>
              }

              {
                menu == CurrentMenu.BIRTHDAY && <div style={{ fontSize: "18px", fontWeight: 900, color: "#131313", fontFamily: 'Pretendard-SemiBold' }}>생일 추가</div>
              }

              {
                menu == CurrentMenu.BANK && <div style={{ fontSize: "18px", fontWeight: 900, color: "#131313", fontFamily: 'Pretendard-SemiBold' }}>계좌번호 추가</div>
              }
                
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
             </BetweenRow>

            {
              menu == CurrentMenu.SHOPPING && <Row style={{ width: "85%", margin: "15px auto" }}>
                <Label>쇼핑항목</Label>
                <input type="text" value={shoppingname} style={Inputstyle}
                  placeholder={'쇼핑항목을 넣어주세요'}
                  onChange={(e) => {
                    setShoppingname(e.target.value);
                    setRefresh((refresh) => refresh + 1);
                  }}
                ></input>
              </Row>
            }


            {
              menu == CurrentMenu.BANK &&
              
              <Column>
                  <Row style={{ width: "85%", margin: "5px auto" }}>
                    <Label>은행</Label>
                    <input type="text" value={bankname} style={Inputstyle}
                      placeholder={'은행이름을 넣어주세요'}
                      onChange={(e) => {
                        setBankname(e.target.value);
                        setRefresh((refresh) => refresh + 1);
                      }}
                    ></input>
                  </Row>

                  <Row style={{ width: "85%", margin: "5px auto" }}>
                    <Label>계좌번호</Label>
                    <input type="number" value={banknum} style={Inputstyle}
                      placeholder={'계좌번호 넣어주세요'}
                      onChange={(e) => {
                        setBanknum(e.target.value);
                        setRefresh((refresh) => refresh + 1);
                      }}
                    ></input>
                  </Row>
              </Column>
    
            }


      


             <ApplyItem>
                <div style={{dispaly:"flex", alignItems:"center", justifyContent:"center", width:"90%", margin:"0 auto"}}>   
      
                {
                  saving == true ? (<FilterApplyDisableButton ><FilterApplyDisableButtonText>설정중</FilterApplyDisableButtonText></FilterApplyDisableButton>) : (<FilterApplyButton onClick={_handleconfig}><FilterApplyButtonText>설정</FilterApplyButtonText></FilterApplyButton>)
                }

                </div>
              </ApplyItem>

   
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}