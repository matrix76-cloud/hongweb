
import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB } from '../../utility/imageData';
import { BetweenRow, FlexstartRow, Row } from '../../common/Row';
import { WORKNAME } from '../../utility/work';
import { FILTERITEMPERIOD } from '../../utility/screen';
import { useDispatch } from 'react-redux';
import { ALLREFRESH, RESET } from '../../store/menu/MenuSlice';


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

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  height:'130px',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  boxShadow: 24,
  zIndex:100,
  border : "1px solid #E3E3E3",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  borderBottomLeftRadius: "10px",
  borderBottomRightRadius: "10px"
};
const IconCloseView = styled.div`

`




const CheckText = styled.span`
  color :#F75100;
  font-family : 'Pretendard-SemiBold';
  font-size:16px;
`




export default function MobileFailPopup({callback, content}) {
  const reduxdispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);


  const handleClose = () =>{    
    console.log("TCL: Modal handleClose -> " );
    reduxdispatch(ALLREFRESH());
    setOpen(false);

    callback([]);
  } 

  React.useEffect(()=>{
    console.log("TCL: Modal RESET REDUX -> " );
    reduxdispatch(RESET());

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
              <Row style={{width:"90%", margin: "15px auto", height:'65px'}}>
                <IconCloseView >
                  <img src={imageDB.fail} style={{width:"32px", height:"32px",paddingTop:5}}/>
                </IconCloseView>
                <div style={{fontSize:"16px", color:"#131313", fontFamily:'Pretendard', paddingLeft:10}}>{content}</div>           
             </Row>

             <Row style={{width:"100%", background:"#E3E3E3", height:'35px',borderBottomRightRadius: "10px",
              borderBottomLeftRadius: "10px"}}>
                <CheckText onClick={handleClose}>
                  확인
                </CheckText>
             </Row>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}