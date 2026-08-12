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
import KakaoShare from '../components/KakaoShare';
import { getFontSize, isIOS } from '../utility/fontsize';

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
const HEADER_HEIGHT = 24;
const FOOT_HEIGHT = 70;
const Container = styled.div`


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


const isRunningDate = (datestartString) => {

  const targetDate = datestartString.toDate();


  const currentDate = new Date();
  // `getTime()`을 사용하여 날짜를 밀리초로 변환 후 비교
  return currentDate.getTime() > targetDate.getTime();
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

const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #c7c6c6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`;

const HeaderLayer = styled.div`
    padding-left: 15px;
    display: flex;
    color: rgb(19, 19, 19);
    font-size: ${() => getFontSize(18)}px;
    justify-content: flex-start;
    align-items: center;
    font-family: Pretendard-SemiBold;
    width :100%;
   

`

const { kakao } = window;

export default function MobileFestivalPopup({containerStyle, callback, item}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const sanitizedHtml = DOMPurify.sanitize(item.FESTIVALITEM.fstvlCrmnCn);
  const sanitizedHtml2 = DOMPurify.sanitize(item.FESTIVALITEM.fstvlOutlCn);

  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 





  React.useEffect(()=>{

  },[refresh])

  React.useEffect(()=>{
    async function FetchData() {
      
      await sleep(1000);

      var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
          center: new kakao.maps.LatLng(item.FESTIVALITEM.xcrdVal, item.FESTIVALITEM.ycrdVal), // 지도의 중심좌표
          level: 5 // 지도의 확대 레벨
        };
      var map = new kakao.maps.Map(mapContainer, mapOption);


      var imageSrc = imageDB.PIN; // 마커 이미지의 URL
      var imageSize = new kakao.maps.Size(36, 36); // 마커 이미지의 크기
      var imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커의 좌표에 일치시킬 이미지 안의 좌표

      // 마커 이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const markerPosition = new window.kakao.maps.LatLng(item.FESTIVALITEM.xcrdVal, item.FESTIVALITEM.ycrdVal);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage // 마커 이미지 설정
      });

      // 마커를 지도 위에 표시
      marker.setMap(map);


    }
    FetchData();
  }, [])

  const _handleClose = () => {
    callback();
  }


  return (
    <div>

      <HeaderWrapper>
        <HeaderLayer>
          <div onClick={_handleClose} >X</div>
        </HeaderLayer>
      </HeaderWrapper>



      <Container style={containerStyle}>
        <LazyImage src={ensureHttps(item.FESTIVALITEM.dispFstvlCntntsImgRout)} containerStyle={{ width: '100%', backgroundColor: '#ededed', height: 350 }} />

        <ContentLayer>
          <CntntsNm>
            <FlexstartRow>
              <div>{item.FESTIVALITEM.cntntsNm}</div>


            </FlexstartRow>

          </CntntsNm>

          <CntntsDate>
            <FlexstartRow>
              <div> {item.FESTIVALITEM.fstvlBgngDe} ~ {item.FESTIVALITEM.fstvlEndDe}</div>
              <div>{isRunningDate(item.fstvlBgngDe) == true && <Tag>개최중</Tag>}</div>
            </FlexstartRow>
          </CntntsDate>

          <style>{ContentStyle}</style>

          <CntnDesc>행사 설명</CntnDesc>
          <div className={'LineHeight'} dangerouslySetInnerHTML={{ __html: sanitizedHtml2 }} />

          <CntnDesc>행사 소개</CntnDesc>
          <div className={'LineHeight'} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

          <CntnDesc>주소</CntnDesc>
          <div>{item.FESTIVALITEM.adres}</div>


          <div style={{ height: 250 }}>
            <div id="map" className="Map" style={mapstyle}></div>
          </div>




        </ContentLayer>


      </Container>
    </div>
  );
}