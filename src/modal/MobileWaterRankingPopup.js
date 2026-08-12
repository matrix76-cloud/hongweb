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

import MobileRecipeDetail from '../components/MobileRecipeDetail';

import { ensureHttps, sleep } from '../utility/common';
import LazyImage from '../common/LasyImage';
import DOMPurify from "dompurify";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { readuser } from '../service/UserService';
import { ReadRACE } from '../service/RaceService';
import MobileWaterRankContent from '../components/config/activity/MobileWaterRankContent';
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
    top: '0%',
    left: '50%',
    height:'100%',
    transform: 'translate(-50%, 0%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '0px 34px',
    zIndex: 100,
    overflowY:'auto'

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
const Container = styled.div`
    overflowY: auto;
`

const PrevLayer = styled.div`
    display: flex;
    font-size: ${() => getFontSize(18)}px;
    color: rgb(19, 19, 19);
    align-items: center;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 30px;
    flex-direction:column;
    position: sticky;
    top: 0px;
`



const ContentLayer = styled.div`
  background : #fff;
  padding : 20px 30px;
  height : 100vh;

  width: 80%;
  margin: 0 auto 80px;
`
const CntntsNm = styled.div`
  font-size: ${() => getFontSize(24)}px;
  font-family : Pretendard-SemiBold;
  color : #131313;

`
const CntntsDate= styled.div`
  font-size: ${() => getFontSize(16)}px;
  margin-top:10px;
  font-family : Pretendard-SemiBold;
  color : #131313;

`
const CntnDesc = styled.div`
    font-size: ${() => getFontSize(18)}px;
    font-family: 'Pretendard-Bold';
    margin: 25px 0px 10px;
    padding-bottom: 5px;
    border-bottom: 1.5px solid #000;

`
const mapstyle = {
  overflow: "hidden",
  width: '100%',
  height: '200px',
  marginTop: "15px"
};




const Tag = styled.div`

    z-index: 2;
    background: #5f00ff;
    color: #fff;
    font-size: ${() => getFontSize(14)}px;
    padding: 3px 10px;
    font-family: 'Pretendard-SemiBold';
    border-radius: 5px;
    margin-left:10px;

`
const ContentStyle = `
 .LineHeight{
   line-height:2;
 }

`
const Layer = styled.div`
  background: #c5e2ff99;
  z-index: 10;
  font-size: ${() => getFontSize(12)}px;
  width: 80%;
  left: 10px;
  color: #131313;
  padding: 10px;
  display: flex;
  flex-direction: row;
  margin: 10px auto;

`

const WaterCupLayer = styled.div`
    position: absolute;
    top: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    display: flex;
    margin: 0 auto;
    left: 0%;
    width: 100%;

`

const WaterStyle = `
.water-cup {
  width: 200px;
  height: 300px;
  clip-path: polygon(15% 100%, 85% 100%, 95% 0%, 5% 0%);
  border-radius: 20px 20px 10px 10px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.water-level {
  width: 100%;
  height: 70%; /* 물의 양에 따라 조절 */
  background: #008CFF;
  position: absolute;
  bottom: 0;
  transition: height 0.5s ease-in-out;
}

.water-cup::before {
  content: "";
  position: absolute;
  width: 90%;
  height: 5px;
  background: rgba(255, 255, 255, 0.6);
  top: 5px;
  left: 5%;
  border-radius: 50%;
}

`

const CheckButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    width: 250px;
    height: 60px;
    border-radius: 50px;
    color :#fff;
    background: linear-gradient(to right, #4facfe, #007bff);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */

`
const CheckPlus = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const SizeBottle = styled.div`
  font-family:Pretendard-SemiBold;
  font-size: ${() => getFontSize(25)}px;
  margin:20px;
`

const { kakao } = window;
const RoundLayer = styled.div`
    margin-top: 10px;
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`

const Round = styled.div`
  width:50px;
  height:50px;
  border-radius:50px;
  background :#4facfe;
`

export default function MobileWaterRankingPopup({containerStyle, callback}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [items, setItems] = React.useState([]);
  const [currentloading, setCurrentloading] = React.useState(false);



  React.useEffect(() => {


  }, [refresh])



  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 


  const sortBycount = (items) => {
    const sortedItems = [...items].sort((a, b) => b.COUNT - a.COUNT);

    return sortedItems;
  };

  async function FetchData() {

    const USERS = await readuser({});

    const rankingitems = await ReadRACE({});

    console.log("rankingitems", rankingitems);

    if (rankingitems != -1) {

      rankingitems.map((data) => {

        const FindIndex = USERS.findIndex(x => x.USERS_ID == data.USERS_ID);

        data["NAME"] = USERS[FindIndex].USERINFO.nickname;

      })
      setItems(sortBycount(rankingitems));
    }


    setCurrentloading(false);
  }

  React.useEffect(() => {
    FetchData();
  }, [])





  const _handleClose = () => {
    callback();
  }



  return (
    <div>

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

   
            <PrevLayer>
              <FlexstartRow style={{height:50, width:"100%"}}>
                <img src={imageDB.ic_common_top_back_nor} style={{ height: 24, paddingLeft: 30 }} onClick={_handleClose} />
                <div style={{marginLeft:5}}>{'건강한 삶을 위한 수분 섭취 순위'}</div>
              </FlexstartRow>
            
            </PrevLayer>

            <Container style={containerStyle}>

              <Layer>


                <Row style={{ alignItems: "flex-start", lineHeight: 2 }}>
                  <img src={imageDB.ic_myinfo_menu_hong} style={{ width: 20, height: 20 }} />
                  <span style={{ paddingLeft: 5 }}>도전 알바는 건강한 여러분이 되실수 있도록 지원합니다
                    매주 1위부터 3위까지는 다음의 상품이 지급 되겠습니다 성공 횟수가 동률일 경우 물을 자주 마시는 횟수가 많음을 기준으로 합니다
                    1위 : 10만원 신세계 상품권, 2위 : 5만원 신세계 상품권, 3위 : 3만원 신세계 상품권 지급</span>
                </Row>


           

         

              </Layer>

              <Row style={{width:"95%", margin:"0 auto"}}>

                <MobileWaterRankContent items={items} />
              </Row>

  

            </Container>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}