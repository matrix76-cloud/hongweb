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
import MobileRecipeDetail from '../components/MobileRecipeDetail';

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
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'white',
  zIndex: 1000,
  padding: 0,
  overflowY: 'auto',
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
  font-size: ${() => getFontSize(16)}px !important;
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
  font-size: ${() => getFontSize(18)}px !important;
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
  font-size: ${() => getFontSize(16)}px !important;
  color: rgb(19, 19, 19);
  width: 40%;
  margin: 10px auto;
`




export default function MobileRecipePopup({callback, item, totalitem}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);


  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 


  React.useEffect(()=>{

  },[refresh])

  React.useEffect(()=>{
    async function FetchData(){

    }
    FetchData();
  }, [])



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
        <Fade in={open}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // 어두운 반투명 배경
            }
          }}>
          <Box sx={style}>
            <MobileRecipeDetail item={item} callback={callback} totalitem={totalitem} share={false} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}