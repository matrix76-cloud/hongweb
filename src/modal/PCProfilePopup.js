import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';
import { Navigate, useNavigate } from 'react-router-dom';
import { BetweenRow, Row } from '../common/Row';
import { imageDB } from '../utility/imageData';

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
    top: '60%',
    left: '50%',
    height:'750px',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    backgroundColor:'#f9f9f9',
    boxShadow: 24,
    padding: '14px 20px',
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
  width:100%;
`


const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

const InfoBox = styled.div`
  font-size: ${() => getFontSize(14)}px;
  margin: 15px 0px 5px;
  background: #f9f9f9;
  margin: 10px auto;
  width: 100%;
  padding: 10px;
  text-align: left;
  line-height: 2;
  border-radius: 10px;
  color: #131313;

`
const ULITEM = styled.ul`
  padding-left: 15px;
  list-style-type: disc;
  line-height: 2;
  margin-top: 10px;
`


export default function PCProfilePopup({
ID,
callback
}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);

  const navigate = useNavigate();


  const handleClose = () =>{
    setOpen(false);
    callback([]);
  } 



  React.useEffect(()=>{
    setOpen(open);


  },[refresh])


  /**
   * 계약자의 성명에 대해 알아보자
   * CONTACT_ID가 존재 하는지 알아보자
   * CONTACT_ID가 존재 한다면 계약상태에 대해 알아보자

   */
  React.useEffect(()=>{

    async function FetchData(){


  
    }
    FetchData();

  },[])

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
            <Row>
              <HeaderPopupline/>
            </Row>
            <BetweenRow style={{width:"100%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>지원자프로필</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
            </BetweenRow>
            <div style={{overflowY:"auto",height:'750px',}}>
            <PCProfileConfigView/>
            </div>
    
          
          </Box>

  

        </Fade>
      </Modal>
    </div>
  );
}






