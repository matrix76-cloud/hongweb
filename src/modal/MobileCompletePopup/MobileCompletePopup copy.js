import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB, Seekimage } from '../../utility/imageData';
import { BetweenRow, FlexstartRow, Row } from '../../common/Row';
import { REQUESTINFO, WORKNAME } from '../../utility/work';
import Button from '../../common/Button';
import { ButtonGroupContext } from '@mui/material';
import MobileWorkMapPopup from '../MobileMapPopup/MobileWorkMapPopup';

import moment from "moment";
import { getDateFullTime, getTime, getDate, getDateEx } from "../../utility/date";
import { Column } from '../../common/Column';
import MobileSignPopup from '../MobileSignPopup/MobileSignPopup';
import MobileSuccessPopup from '../MobileSuccessPopup/MobileSuccessPopup';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MobileFailPopup from '../MobileFailPopup/MobileFailPopup';
import { CreateContact, ReadContactByIndividually, UpdateContactByContactID, UpdateContactByLeftSign } from '../../service/ContactService';
import { CONTACTTYPE } from '../../utility/screen';
import ButtonEx from '../../common/ButtonEx';
import { getFontSize } from "../../utility/fontsize";

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
    height:'600px',
    overflowY:"auto",
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
  flex-direction:column;
  background-color : #fff;
  flex-wrap : wrap;
  margin: 0 auto;
  width:100%;
`
const ContactMain = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${() => getFontSize(25)}px;
  margin-bottom: 10px;
`
const ContactContent = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${() => getFontSize(14)}px;
  margin-bottom: 10px;
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
  width: 85%;
  padding: 10px;
  text-align: left;
  line-height: 2;
  border-radius: 10px;
  color: #131313;

`
const ResultContent = {
  width: '250px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border :'none',
  borderRadius:'5px',
  backgroundColor:"#fff",
  marginLeft:10

}

const Property = styled.div`
    width: 40%;
    font-family: 'Pretendard-Bold';
    padding-left: 10px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size : 14px;

`



export default function MobileCompletePopup({ callback, data, messages,requestcallback }) {

  console.log("MobileCompletePopup", messages);
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);


  const printRef = React.useRef();

  const handleClose = async() =>{
 
    setOpen(false);
    callback(data);

  } 
  const _handleReqComplete = () => {
    requestcallback();
  }


  // LEFT_SIGN이 있는 경우는 수정 할수가 없다 



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

            <Row>
              <HeaderPopupline/>
            </Row>
            <BetweenRow style={{width:"80%", margin: "20px auto", }}>
              <div style={{ fontSize: "18px", fontWeight: 900, color: "#131313",display:"flex",flexDirection:"column", fontFamily: 'Pretendard-SemiBold' }}>
                <div>고객님이 작성하신 요구사항은</div>
                <div>다음과 같습니다</div>
              </div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
            </BetweenRow>

            <div style={{width:"80%", margin:"0 auto"}}>
                <div>
                    {
                    messages.map((data)=>(
                      <>
                      {
                      data.type =='response' &&
                      <Row style={{width:"100%", borderBottom: "1px solid #ededed"}}>
                        <Property>{data.requesttype}</Property>
                        <FlexstartRow style={{ width: '60%', fontSize: () => getFontSize(14), fontFamily:"Pretendard-Regular" }}>
                          {
                                  data.requesttype == REQUESTINFO.REQDATE ? (<div>{getDateEx(data.result)}</div>) :
                                        (<div>{data.result}</div>)

                          }
                        </FlexstartRow>
                      </Row>
                      }
                      </>
                    ))
                }
                <Column>
                 <div style={{display:"flex", flexDirection:"row", margin:'10px auto', width:'100%',justifyContent: "space-between" }}>        
             
                  <ButtonEx   containerStyle={{border: 'none', fontSize: () => getFontSize(16), marginTop:15}} onPress={()=>{_handleReqComplete()}} height={'44px'} width={'95'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} iconcolor={'#fff'} text={'요청하기'}/>
                   </div>


                </Column>
                </div>
            </div>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}