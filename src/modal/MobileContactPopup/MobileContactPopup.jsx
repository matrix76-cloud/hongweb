import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB } from '../../utility/imageData';
import { BetweenRow, Row } from '../../common/Row';
import { WORKNAME } from '../../utility/work';
import Button from '../../common/Button';
import { ButtonGroupContext } from '@mui/material';
import { ReadChannel, ReadChatByCHATID } from '../../service/ChatService';
import { ReadContactByIndividually } from '../../service/ContactService';




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
    height:'650px',
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
  flex-direction:row;
  background-color : #fff;
  flex-wrap : wrap;
  margin: 0 auto;
  width:90%;
`


const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

const InfoBox = styled.div`
  font-size: 14px;
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


export default function MobileContact({
WORK_ID,
OWNER_ID,
SUPPORTER_ID,  
CHAT_ID,
callback,
btn1callback,
btn2callback,
btn3callback}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [leftname, setLeftname] = React.useState('');
  const [leftsign, setLeftsign] = React.useState('');
  const [rightname, setRightname] = React.useState('');
  const [rightsign, setRightsign] = React.useState('');



  const handleClose = () =>{
    setOpen(false);
    callback([]);
  } 


  // !부모가서 팝업을 연다 MobileContentcontainer
  const _handleapply = () =>{
    btn1callback(true);
  }
  // !부모가서 팝업을 연다 MobileContentcontainer
  const _handlebuy = async() =>{

    btn2callback(true);

  }
  // !부모가서 팝업을 연다 MobileContentcontainer
  const _handledownload = () =>{
    btn3callback(true);
  }
  React.useEffect(()=>{
    setOpen(open);
    setLeftname(leftname);
    setLeftsign(leftsign);
    setRightname(rightname);
    setRightsign(rightsign);
  },[refresh])


  /**
   * 계약자의 성명에 대해 알아보자
   * CONTACT_ID가 존재 하는지 알아보자
   * CONTACT_ID가 존재 한다면 계약상태에 대해 알아보자

   */
  React.useEffect(()=>{

    async function FetchData(){


      const CHAT_ITEM = await ReadChatByCHATID({CHAT_ID});

      setLeftname(CHAT_ITEM.SUPPORTER.USERINFO.nickname);
      setRightname(CHAT_ITEM.OWNER.USERINFO.nickname);


      const CONTACTITEM = await ReadContactByIndividually({WORK_ID, OWNER_ID, SUPPORTER_ID});

      if(CONTACTITEM != -1){
        setRightsign(CONTACTITEM.RIGHT_SIGN);
        setLeftsign(CONTACTITEM.LEFT_SIGN);
      }
      setRefresh((refresh) => refresh +1);
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
            <BetweenRow style={{width:"70%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>홍여사 계약 진행</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
            </BetweenRow>
            <MainData>
              <InfoBox>
                <div>{'의뢰한 견적내용을 확인하고 상호 합의 하에 계약서를 작성할수 있습니다. 계약서는 의견 체팅을 통해 의견조율을 하고 온라인으로 작성되어 서명되면 법적 효력을 갖게 됩니다'}</div>
                <div style={{display:"flex", flexDirection:"row", width:"70%", justifyContent:"space-between", margin:"20px auto"}}>
                  <Button
                  text={"계약서 작성"}
                  onPress={_handleapply}
                  containerStyle={{
                    color: "#131313",
                    background: "#ededed",
                    width: "250px",
                    height: "30px",
                    fontSize: "14px",
                    marginLeft:"unset",
                    border : "none",
                    borderRadius:"5px",
                    fontFamily :"Pretendard"
                  }}
                  />
                </div>

                <ul style={{marginLeft:10}}>
                  {
                    (rightsign == '' || rightsign == undefined) ? (        
                    <li style={{listStyleType: "disc"}}>{'의뢰자('+rightname+')님이 계약서에 서명 대기중 입니다'}</li>) :(
                    <li style={{listStyleType: "disc", textDecoration:"line-through"}}>{'의뢰자(' + rightname+')님이 계약서에 서명 완료 하였습니다'}</li>
                    )
                  
                  }
                  {
                    (leftsign == '' || leftsign == undefined) ? (        
                      <li style={{listStyleType: "disc"}}>{'홍여사('+leftname+')님이 계약서에 서명 대기중 입니다'}</li>) :(
                      <li style={{listStyleType: "disc", textDecoration:"line-through"}}>{'홍여사(' + leftname+')님이 계약서에 서명 완료 하였습니다'}</li>
                      )
                  }


                </ul>
              
                <div style={{display:"flex", flexDirection:"row", width:"70%", justifyContent:"space-between", margin:"20px auto"}}>
                  <Button
                  text={"결제"}
                  onPress={_handlebuy}
                  containerStyle={{
                    color: "#fff",
                    background: "#FF7125",
                    width: "100px",
                    height: "30px",
                    fontSize: "14px",
                    marginLeft:"unset",
                    borderRadius:"5px",
                    border :"none",
                    fontFamily :"Pretendard"
                  }}
                  />
                  <Button
                  text={"계약서 다운로드"}
                  onPress={_handledownload}
                  containerStyle={{
                    color: "#131313",
                    background: "#ededed",
                    width: "100px",
                    height: "30px",
                    fontSize: "14px",
                    marginLeft:"unset",
                    borderRadius:"5px",
                    border : "none",
                    fontFamily :"Pretendard"
                  }}
                  />
                </div>
              </InfoBox> 
            </MainData>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}






