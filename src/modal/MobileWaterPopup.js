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
import { CreateCOURAGE, CreateWATER, ReadCOURAGETByIndividually } from '../service/WaterService';
import { Toaster, toast } from 'sonner';
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
    top: 200px;
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


const GuideWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #f1f7ff;
  border-radius: 12px;
  padding: 14px 16px;
  gap: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const Icon = styled.div`
  font-size: 20px;
  color: #4a90e2;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-size: 14px;
  color: #444;
  line-height: 1.4;
`;


export default function MobileWaterPopup({ containerStyle, callback }) {
  
  const { dispatch, user } = React.useContext(UserContext);

  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const [initsize, setInitsize] = React.useState(100);
  const [initpercent, setInitpercent] = React.useState(1.5);


  const _handlePlus = () => {

    let initsizeTmp = 0;

    initsizeTmp = initsize + 20;

    if (initsizeTmp > 400) {
      initsizeTmp = 400;
    }
    
    setInitsize(initsizeTmp);

    setInitpercent(initpercent + 0.07);
    setRefresh((refresh) + 1);
  }
  const _handleMinus = () => {
  

    let initsizeTmp = 0;

    initsizeTmp = initsize - 20;

    if (initsizeTmp < 0) {
      initsizeTmp = 0;
    }

    setInitsize(initsizeTmp);

    setInitpercent(initpercent - 0.07);
    setRefresh((refresh) + 1);
  }

  React.useEffect(() => {

    setInitpercent(initpercent);

  }, [refresh])


  const WaveCanvas = () => {
    const canvasRef = React.useRef(null);

   React.useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = 780;

      let time = 0;
      const waveHeight = 20; // 물결 높이
      const waveLength = 0.02; // 파장의 길이
      const waveSpeed = 0.03; // 물결 속도

      function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 배경 (바다색)
        ctx.fillStyle = "#d0e5f8ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 물결 그리기
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / initpercent);

        for (let i = 0; i < canvas.width; i++) {
          ctx.lineTo(
            i,
            canvas.height / initpercent + Math.sin(i * waveLength + time) * waveHeight
          );
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // 반투명한 파란색
        ctx.fillStyle = "#056cfe";
        ctx.fill();




        time += waveSpeed;
        requestAnimationFrame(drawWave);
      }

      drawWave();

      return () => {
        cancelAnimationFrame(drawWave);
      };
    }, []);

    return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
  };


  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 





  React.useEffect(()=>{
    async function FetchData() {
      
   
    }
    FetchData();
  }, [])

  const _handleClose = () => {
    setOpen(false);
    callback('');
  }

  const _handleWaterBottle = async() => {
    const BOTTLE = initsize;
    const USERS_ID = user.USERS_ID;


    const items = await ReadCOURAGETByIndividually({ USERS_ID });


    console.log("items", items, initsize);

    if (items != -1) {
      const FindIndex = items.findIndex(x => x.BOTTLE == initsize);

      if (FindIndex != -1) {
        const CONTENT = initsize;
        const water = await CreateWATER({ CONTENT, USERS_ID })
      
      } else {

        const bottle = await CreateCOURAGE({ BOTTLE, USERS_ID });

        const CONTENT = initsize;
        const water = await CreateWATER({ CONTENT, USERS_ID })
      }  
    } else {
      
      const bottle = await CreateCOURAGE({ BOTTLE, USERS_ID });

      const CONTENT = initsize;
      const water = await CreateWATER({ CONTENT, USERS_ID })

    }


    callback('add');

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
                <img src={imageDB.ic_common_top_back_nor} style={{ height: 24, paddingLeft: 40 }} onClick={_handleClose} />
                <div style={{marginLeft:5}}>{'음료 용량 설정'}</div>
              </FlexstartRow>
          
            </PrevLayer>

            <Container style={containerStyle}>

              <Layer>


                <Row style={{ alignItems: "flex-start", lineHeight: 2 }}>
              
                  <GuideWrapper>
                    <Icon>💡</Icon>
                    <TextBlock>
                      <Title>오늘의 한마디</Title>
                      <Message>“한 잔씩 천천히~ 200ml 정도면 충분해요! 😊”</Message>
                    </TextBlock>
                  </GuideWrapper>
                </Row>

                <style>{WaterStyle}</style>
                <WaterCupLayer>
                  <div className="water-cup">
                    <WaveCanvas />
                  </div>

             
                  <RoundLayer>
                    <Round onClick={_handleMinus}><IoMdArrowDropdown size={50} color={'#fff'} /></Round>
                    <Round onClick={_handlePlus}><IoMdArrowDropup size={50} color={'#fff'} /></Round>              
                  </RoundLayer>

                  <SizeBottle>{initsize}ml</SizeBottle>

                  <CheckButton onClick={_handleWaterBottle}>
                    <CheckPlus><span style={{ fontSize: getFontSize(25) }}>+</span><span style={{ fontSize: getFontSize(20), paddingLeft: 10 }}>음료</span></CheckPlus>
                  </CheckButton>

                </WaterCupLayer>

       

              

              </Layer>

           

            </Container>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}