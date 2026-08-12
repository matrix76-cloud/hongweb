

import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';

import { getFontSize } from '../utility/fontsize';
import styled from 'styled-components';



import { useDispatch } from 'react-redux';

import { imageDB } from '../utility/imageData';
import { Row } from '../common/Row';
import { Column } from '../common/Column';

import PCRecipe from '../components/PCRecipe';


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
  top: '50%',
  left: '50%',
  height:'90vh',
  transform: 'translate(-50%, -50%)',
  width: '600px',
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
  font-size: ${() => getFontSize(16)}px;
`

const ButtonSt = styled.div`

  border: 1px solid #ededed;
  padding: 7px 20px;
  background: #fff;
  color: #131313;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`


export default function PCRecipePopup({callback, item}) {
  const reduxdispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);


  const handleClose = () =>{    
    setOpen(false);
    callback(0);
  } 

  React.useEffect(()=>{

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
          <PCRecipe item={item} callback={handleClose}  />
        </Box>

      </Fade>
      
    
      </Modal>
    </div>
  );
}