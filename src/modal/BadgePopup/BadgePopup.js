import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB, Seekimage } from '../../utility/imageData';
import { BetweenRow, Row } from '../../common/Row';
import { REQUESTINFO, WORKNAME } from '../../utility/work';
import Button from '../../common/Button';
import { ButtonGroupContext } from '@mui/material';
import MobileWorkMapPopup from '../MobileMapPopup/MobileWorkMapPopup';

import moment from "moment";
import { getDateFullTime, getTime, getDate } from "../../utility/date";
import { Column } from '../../common/Column';
import MobileSignPopup from '../MobileSignPopup/MobileSignPopup';
import MobileSuccessPopup from '../MobileSuccessPopup/MobileSuccessPopup';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MobileFailPopup from '../MobileFailPopup/MobileFailPopup';
import { CreateContact, ReadContactByIndividually, UpdateContactByContactID, UpdateContactByLeftSign } from '../../service/ContactService';
import { CONTACTTYPE } from '../../utility/screen';


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
  top: '90%',
  left: '50%',
  height:'150px',
  transform: 'translate(-50%, -50%)',
  width: '25%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '14px 34px',
  borderTopLeftRadius:"20px",
  borderTopRightRadius:"20px",
  zIndex:100,
};


export default function BadgePopup({callback, messages, WORKTYPE, OWNER, WORK_ID, OWNER_ID,SUPPORTER_ID }) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);

  const [leftsign, setLeftsign] = React.useState('');
  const [rightsign, setRightsign] = React.useState('');
  const [messageitems, setMessageitems] = React.useState(messages);
  const [contactitem, setContactitem] = React.useState({});

  const printRef = React.useRef();

  const handleClose = async() =>{
 
    setOpen(false);
    callback();
  } 





  

  // LEFT_SIGN이 있는 경우는 수정 할수가 없다 

  React.useEffect(()=>{
    async function FetchData(){

      
    }

    FetchData();
  },[])

  React.useEffect(()=>{
    setOpen(open);


  },[refresh])



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
       

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}