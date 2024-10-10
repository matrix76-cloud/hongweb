
import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB } from '../../utility/imageData';
import { BetweenRow, FlexstartRow, Row } from '../../common/Row';

import { CHECKDISTANCE, FILTERITEMPERIOD } from '../../utility/screen';
import LottieAnimation from '../../common/LottieAnimation';
import { UserContext } from '../../context/User';
import { DataContext } from '../../context/Data';
import { findWorkAndFunctionCallFromCurrentPosition } from '../../service/WorkService';
import { findRoomAndFunctionCallFromCurrentPosition } from '../../service/RoomService';


import localforage from 'localforage';
import { ALLREFRESH, ALLWORK, CARRYLOAD, RESET } from '../../store/menu/MenuSlice';
import { useDispatch } from 'react-redux';
import { useSleep } from '../../utility/common';


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



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

export default function MobileGpsPopup({callback}) {
  const reduxdispatch = useDispatch();

  const [open, setOpen] = React.useState(true);
  const { dispatch, user } = React.useContext(UserContext);
  const { datadispatch, data} = React.useContext(DataContext);
  const [refresh, setRefresh] = React.useState(-1);
  const [location, setLocation] = React.useState({ latitude: null, longitude: null });
  const [complete, setComplete] = React.useState(false);

  const handleClose = () =>{
    
    console.log("TCL: Modal handleClose -> " );
    reduxdispatch(ALLREFRESH());
  
    setOpen(false);
    setComplete(false);
    setRefresh((refresh) => refresh +1);
    callback([]);

  } 

  React.useEffect(()=>{
    setComplete(complete);
  },[refresh])

  /**
   * gps가 재조정되고 5초간 기다린다
   * 3초간 기다린 후에 닫음 버튼을 활성화시킨다
   * 활성화 시킨 후에 닫음 버튼을 각 페이지 에 알려줄수 있도로 redux 를 사용한다
   */
  React.useEffect(()=>{
    reduxdispatch(RESET());
    navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
      console.log("TCL: Mapset -> latitude", latitude)
      console.log("TCL: Mapset -> longitude", longitude)
      // Geocoder를 사용하여 좌표를 주소로 변환
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2Address(longitude, latitude, async (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].address;

          user.address_name = address.address_name;
          user.latitude  = latitude;
          user.longitude = longitude;
          
            // 객체 저장
          const USERINFO = user;
          localforage.setItem('userconfig', USERINFO).then(async function () {
         
          }).catch(function (err) {
            console.error('Error saving userconfig:', err);
          });
          dispatch(user);


          console.log("TCL: Mapset  user setting -> ", user );

          // 설정된 거리 내외에 현재 위치에 존재 하는 데이타가 있습니까?

          const currentlatitude = latitude;
          const currentlongitude = longitude;
          const checkdistance = CHECKDISTANCE;
          const workfunctioncall = await findWorkAndFunctionCallFromCurrentPosition({currentlatitude, currentlongitude, checkdistance});
          const roomfunctioncall= await findRoomAndFunctionCallFromCurrentPosition({currentlatitude, currentlongitude, checkdistance});

          return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000);
            async function FetchData(){
              await useSleep(1000);
              setComplete(true);
              setRefresh((refresh)=>refresh +1);
            }
            FetchData();
      
          });
    

        }else{
          alert(status);
        }
      });
    },
    (err) => {
      console.error(err);
      alert(err);
    },
    {
        enableHighAccuracy: false,  // 높은 정확도 비활성화
        timeout: 5000,             // 최대 5초 대기
        maximumAge: 0              // 캐시된 위치 사용 안 함
    })
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
              
             
             {
              complete == false ? ( <Row style={{width:"90%", margin: "25px auto 0px", height:'80px'}}>
              <LottieAnimation containerStyle={{zIndex:11}} animationData={imageDB.loading}
                width={35} height={35}/>
                  <div style={{fontSize:"16px", color:"#131313", fontFamily:'Pretendard', paddingLeft:10}}>현재 위치로 재조정중입니다</div>           
               </Row>):( <Row style={{width:"90%", margin: "20px auto", height:'45px'}}>
               <img src={imageDB.success} style={{width:"32px", height:"32px"}}/>
                  <div style={{fontSize:"16px", color:"#131313", fontFamily:'Pretendard', paddingLeft:10}}>현재 위치로 지정되었습니다</div>           
               </Row>)
             }
           

              {
                complete == true && <Row style={{width:"100%", background:"#E3E3E3", height:'45px',borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px"}}>
                  <CheckText onClick={handleClose}>
                    확인
                  </CheckText>
              </Row>
              }
        
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}