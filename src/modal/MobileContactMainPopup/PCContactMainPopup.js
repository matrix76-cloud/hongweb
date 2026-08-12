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
import { Navigate, useNavigate } from 'react-router-dom';
import "./MobileContactMainPopup.css";
import { PCMAINMENU } from '../../utility/screen';



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
  padding: 20px;
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


export default function PCContactMainPopup({
ITEM,
OWNER_ID,
SUPPORTER_ID,  
CHAT_ID,
callback,
messages,
}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [leftname, setLeftname] = React.useState('');
  const [leftsign, setLeftsign] = React.useState('');
  const [rightname, setRightname] = React.useState('');
  const [rightsign, setRightsign] = React.useState('');

  console.log("MobileContact POPUP TCL: ITEM", ITEM)


  const navigate = useNavigate();

  

  const handleClose = () =>{
    setOpen(false);
    callback([]);
  } 


  // !
  const _handleapply = () =>{
  
    console.log("TCL: _handleapply -> OWNER_ID", OWNER_ID);
    console.log("TCL: _handleapply -> SUPPORTER_ID", SUPPORTER_ID);


    if(ITEM.TYPE == PCMAINMENU.HOMEMENU){
      const ID = messages.WORK_ID;

      navigate("/PCcontactwrite" ,
      {state :{ID :ID,
         CHAT_ID : CHAT_ID,
         NAME:leftname, 
         messages:messages.WORK_INFO,
         OWNER_ID:OWNER_ID,
         SUPPORTER_ID:SUPPORTER_ID}});
    }else{
      const ID = messages.ROOM_ID;

      navigate("/PCcontactwrite" ,
      {state :{ID :ID,
         CHAT_ID : CHAT_ID,
         NAME:leftname, 
         messages:messages.ROOM_INFO,
         OWNER_ID:OWNER_ID,
         SUPPORTER_ID:SUPPORTER_ID}});
    }




 
  }
  // !
  const _handlebuy = async() =>{

  }
  // !
  const _handledownload = () =>{


    if(ITEM.TYPE == PCMAINMENU.HOMEMENU){
      const ID = messages.WORK_ID;

      navigate("/PCcontactdoc" ,
      {state :{ID :ID,
        CHAT_ID : CHAT_ID,
         NAME:leftname, 
         messages:messages.WORK_INFO,
         OWNER_ID:OWNER_ID,
         SUPPORTER_ID:SUPPORTER_ID}});
    }else{
      const ID = messages.ROOM_ID;

      navigate("/PCcontactdoc" ,
      {state :{ID :ID,
        CHAT_ID : CHAT_ID,
         NAME:leftname, 
         messages:messages.ROOM_INFO,
         OWNER_ID:OWNER_ID,
         SUPPORTER_ID:SUPPORTER_ID}});
    }




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


      let CONTACTITEM;

      if(ITEM.TYPE == PCMAINMENU.HOMEMENU){
        console.log("ITEM", messages);
        const ID = messages.WORK_ID;
        CONTACTITEM = await ReadContactByIndividually({ID, OWNER_ID, SUPPORTER_ID});
      }else{

        console.log("ITEM", ITEM);
        const ID = messages.ROOM_ID;
        CONTACTITEM = await ReadContactByIndividually({ID, OWNER_ID, SUPPORTER_ID});
      }



 

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
            <BetweenRow style={{width:"100%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>계약 진행</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
            </BetweenRow>
            <MainData>
              <InfoBox>
                <div>{'의뢰한 견적내용을 확인하고 상호 합의 하에 계약서를 작성할수 있습니다. 계약서초안은  일꾼님이 서명하기전에  의뢰자님이 초안을 수정 할수 있습니다.' +
                '의뢰자님이 초안을 수정하고 서명한 후 일꾼님이 계약 서명을 하게 됩니다. 모두 서명되고 의뢰자님의 결제가 완료가 되면 계약서는 법적 효력을 갖게 됩니다'}</div>
                <div style={{display:"flex", flexDirection:"row", width:"70%", justifyContent:"space-between", margin:"20px auto"}}>
                  <Button
                  text={"계약서 작성"}
                  onPress={_handleapply}
                  containerStyle={{
                    color: "#131313",
                    background: "#ededed",
                    width: "80%",
                    height: "30px",
                    fontSize: "14px",
                    marginLeft:"unset",
                    border : "none",
                    borderRadius:"5px",
                    fontFamily :"Pretendard"
                  }}
                  />

                </div>

                <ULITEM>
                  {
                    (rightsign == '' || rightsign == undefined) ? (        
                    <li style={{listStyleType: "disc",fontFamily: 'Pretendard-SemiBold'}}>{'의뢰자('+rightname+')님이 계약서에 서명 대기중 입니다'}</li>) :(
                    <li style={{listStyleType: "disc", textDecoration:"line-through"}}>{'의뢰자(' + rightname+')님이 계약서에 서명 완료 하였습니다'}</li>
                    )
                  
                  }
                  {
                    (leftsign == '' || leftsign == undefined) ? (        
                      <li style={{listStyleType: "disc",fontFamily: 'Pretendard-Light',color: '#666'}}>{'일꾼('+leftname+')님이 계약서에 서명 대기중 입니다'}</li>) :(
                      <li style={{listStyleType: "disc", textDecoration:"line-through"}}>{'일꾼(' + leftname+')님이 계약서에 서명 완료 하였습니다'}</li>
                      )
                  }


                </ULITEM>
              
           
              </InfoBox> 
            </MainData>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}






