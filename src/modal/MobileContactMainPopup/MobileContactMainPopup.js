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
import { UserContext } from '../../context/User';
import ModalWrapper from '../ModalWrapper';
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
    top: '80%',
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
  width:90%;
`
const ButtonStyle = `
.gradient-button {
  background: linear-gradient(to right, #FF6625, #FFAA0B); /* Adjust colors for the gradient */
  border: none;
  border-radius: 10px; /* Rounded corners */
  color: white; /* Text color */
  font-size: ${() => getFontSize(16)}px; /* Adjust font size */
  font-weight: bold;
  padding: 8px 20px; /* Adjust padding for size */
  cursor: pointer;
  width : 35%;
  margin-left:5px;
  display:flex;
  justify-content:center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth animations for hover effect */
}

.gradient-button:hover {
  transform: scale(1.05); /* Slightly enlarges the button */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2); /* Deepens the shadow on hover */
}

.gradient-button:active {
  transform: scale(0.95); /* Button presses inwards on click */
}

.outline-button {
  background-color: white; /* White background */
  border: 1px solid #dcdcdc; /* Light gray border */
  border-radius: 10px; /* Rounded corners */
  color: #333; /* Dark gray text */
  font-size: ${() => getFontSize(16)}px; /* Adjust font size */
  font-weight: 500; /* Medium font weight */
  padding: 8px 20px; /* Adjust padding for size */
  cursor: pointer;
  text-align: center;
  display:flex;
  justify-content:center;
  width : 35%;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease; /* Smooth hover animation */
}

.outline-button:hover {
  background-color: #f5f5f5; /* Light gray background on hover */
  color: #000; /* Darker text color */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.outline-button:active {
  background-color: #e0e0e0; /* Darker background when clicked */
  color: #111; /* Slightly darker text on active */
}

`

const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

const InfoBox = styled.div`
  font-size: ${() => getFontSize(14)}px;
  margin: 0px auto;
  width: 85%;
  padding: 10px;
  text-align: left;
  line-height: 1.8;
  border-radius: 10px;
  color: #131313;

`
const ULITEM = styled.ul`
  line-height: 2;
  margin-top: 10px;
  border: 1px solid #ededed;
  padding: 20px;
`

const ContractList = styled.div`
list-style-type: disc;
padding-left: 20px;
margin-bottom: 20px;
color: #333;
`

export default function MobileContactMainPopup({
ITEM,
OWNER_ID,
SUPPORTER_ID,  
CHAT_ID,
callback,
messages,
onClose,
onSubmit
}) {

  const { dispatch, user } = React.useContext(UserContext);

  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [leftname, setLeftname] = React.useState('');
  const [leftsign, setLeftsign] = React.useState('');
  const [rightname, setRightname] = React.useState('');
  const [rightsign, setRightsign] = React.useState('');

  const [downloadurl, setDownloadurl] = React.useState('');

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


    const ID = messages.WORK_ID;

    let NAME = "";


    if (OWNER_ID == user.USERS_ID) {
      NAME = leftname;
    } else {
      NAME = rightname;
    }

    const WORKTYPE = ITEM.INFO.WORKTYPE;

    navigate("/Mobilecontactwrite",
      {
        state: {
          ID: ID,
          NAME: NAME,
          LEFTNAME: leftname,
          RIGHTNAME : rightname,
          CHAT_ID: CHAT_ID,
          messages: messages.WORK_INFO,
          OWNER_ID: OWNER_ID,
          SUPPORTER_ID: SUPPORTER_ID,
          WORKTYPE :WORKTYPE
        }
      });


 
  }

  const _handledownload = () =>{


    // const link = document.createElement("a");
    // link.href = downloadurl;

    // link.download = "용역계약서.pdf"; // 다운로드할 파일 이름 설정
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    window.open(downloadurl, "_blank");


  }
  React.useEffect(()=>{
    setOpen(open);
    setLeftname(leftname);
    setLeftsign(leftsign);
    setRightname(rightname);
    setRightsign(rightsign);
    setDownloadurl(downloadurl);

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


      setDownloadurl(CONTACTITEM.URL);

 

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

    <ModalWrapper
      title="📄 계약서를 작성하기 전 확인해주세요"
      onClose={onClose}
      onSubmit={_handleapply}
      submitLabel="계약서 작성 화면으로 이동"
    >
        <ContractList>

        <ul>
        <li>계약은 서로의 합의에 따라 작성됩니다.</li>
        <li>의뢰자는 금액을 입력하고 먼저 서명해야 합니다.</li>
        <li>도움주실 분은 이후 서명하여 계약을 완료합니다.</li>
        <li>양쪽 모두 서명 후, 결제가 완료되면 계약이 법적 효력을 가집니다.</li>
        </ul>

        </ContractList>

    </ModalWrapper>

      {/* <Modal
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
            <BetweenRow style={{width:"80%", margin: "20px auto 10px", }}>
                <div style={{fontSize:"20px", color:"#131313"}}>계약 진행</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
            </BetweenRow>
            <MainData>
              <InfoBox>
                <div>{'의뢰한 견적내용을 확인하고 상호 합의 하에 계약서를 작성할수 있습니다. 계약서 서명전에 금액을 확인하시기 바랍니다.' + 
                '의뢰자님이 초안을 수정하고 서명한 후 도움주실분이 계약 서명을 하게 됩니다. 모두 서명되고 의뢰자님의 결제가 완료가 되면 계약서는 법적 효력을 갖게 됩니다'}</div>
         

                <ULITEM>
           

                  {
                    (rightsign == '' || rightsign == undefined) ? (
                      <li style={{ listStyleType: "disc", fontFamily: 'Pretendard-Light', color: "#FE6625" }}>{'의뢰자님이 계약서에 서명 대기중 입니다'}</li>) : (
                        <li style={{ listStyleType: "disc", fontFamily: 'Pretendard-Light', textDecoration: "line-through", color: "#FE6625" }}>{'의뢰자님이 계약서에 서명 완료 하였습니다'}</li>
                    )

                  }
                  {
                    (leftsign == '' || leftsign == undefined) ? (
                      <li style={{ listStyleType: "disc", fontFamily: 'Pretendard-Light', color: '#666' }}>{'도움주실분이 계약서에 서명 대기중 입니다'}</li>) : (
                        <li style={{ listStyleType: "disc", fontFamily: 'Pretendard-Light', textDecoration: "line-through", color: "#FE6625" }}>{'도움주실분이 계약서에 서명 완료 하였습니다'}</li>
                    )
                  }


                </ULITEM>

                {
                  (leftsign == '' || rightsign == '' || leftsign == undefined || rightsign == undefined) ? (<Button
                    text={"계약서 직성"}
                    onPress={_handleapply}
                    containerStyle={{
                      color: "#fff",
                      background: "#FE6625",
                      width: "100%",
                      height: "47px",
                      fontSize: "16px",
                      margin: "20px auto",
                      border: "none",
                      borderRadius: "5px",
                      fontFamily: "Pretendard"
                    }}
                  />) : (
                      <Row style={{ width: "100%", margin: "30px auto 0px" }}>
                        <style>{ButtonStyle}</style>
                        <div
                          onClick={_handleapply}
                          className="outline-button"
                        >계약서 보기</div>

                        <div
                          onClick={_handledownload}
                          className="gradient-button"
                        >계약서 다운로드</div>

                      </Row>
                    
                    )
                }
             

     
              </InfoBox> 
            </MainData>
          </Box>
        </Fade>
      </Modal> */}
    </div>
  );
}






