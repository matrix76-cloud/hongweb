import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../../common/Button";
import { FILTERITEMMONEY, FILTERITEMPERIOD, FILTERITMETYPE, LoadingType } from "../../utility/screen";

import { WORKNAME } from "../../utility/work";
import { ROOMSIZE, ROOMSIZEDISPALY } from "../../utility/room";

import { MdLockReset } from "react-icons/md";
import { imageDB } from "../../utility/imageData";
import "./PcMapPopup.css"
import { se } from "date-fns/locale";

import { model } from "../../api/config";
import Loading from "../../components/Loading";
import { useSleep } from "../../utility/common";
import { CreateSearch, DeleteSearchByid, ReadSearchByid } from "../../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";

import TimeAgo from 'react-timeago';
import PcAiCommentpopup from "../PcAiCommentPopup/PcAiCommentPopup";
import { FaListCheck } from "react-icons/fa6";

import ReactTyped from "react-typed";

import { GrUploadOption } from "react-icons/gr";
import Axios from "axios";
import LottieAnimation from "../../common/LottieAnimation";


const formatter = buildFormatter(koreanStrings); 

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
  position: "absolute",

};
const IconCloseView = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items:center;
  margin-right:20px;
`;



const Poptilt = styled.div`
  background-color: #FF7125;
  height: 58px;
  position: relative;
  width :100%;
  display:flex;
  justify-content:center;
  align-items:center;
`
const Popcontent = styled.div`
    height:77%;
    width:100%;
    background:#fff;
    font-family: 'Pretendard-Regular';
    overflow:auto;
`

const PopMainLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  padding-left: 24px;
  line-height: 60px;
  color :#fff;

`

const SearchLayer = styled.div`
  width:309px; 
  background:#fff;
  height:100%;
  font-family: 'Pretendard-SemiBold',

`
const SearchContent={
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '530px',
  fontFamily: 'Pretendard-SemiBold',
  overflowY: "auto"
}

const ResultLayer = styled.div`
  width:771px;
  background:#FFF;
  height:100%;
`
const ResultContent = {
  width: '730px',
  height: '400px',
  padding: '20px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
  backgroundColor:"#f9f9f9"
}

const ResultContent1 = {
  width: '730px',
  height: '300px',
  padding: '20px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
  backgroundColor:"#f9f9f9"
}

const ResultContent2 = {
  width: '700px',
  height: '90px',
  padding: '10px 25px 0px 25px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"2px dotted #00B8A9",

}

const InputContent = {
  width:'600px',
  margin:'5px 10px',
  border :'none',
  borderRadius: '5px',
  backgroundColor :'#fff',
  fontFamily: 'Pretendard-Light'
}



const SearchDBKeyword = styled.div`
 
  font-family: 'Pretendard-Regular';
  display:flex;
  flex-direction:row;
  gap:6px;
  font-weight:500;
  font-size:18px;
  line-height:23.4px;

  &:hover{
    text-decoration :underline;
  } 
`
const ControlLayer = styled.div`
  color: #A3A3A3;
  font-family: 'Pretendard-Regular';
  font-size: 14px;
  display:flex;
  flex-direction:row;
  height:14px;
  line-height:18.2px;
  justify-content: center;
  align-items:center;
`
const MemoInfoblink = styled.div`
    position: relative;
    top: -100px;
    color: #242323;
    background-color: #f5f3f3;
    border: 1px solid #ededed;
    padding: 5px;
    font-size: 12px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    -ms-border-radius: 20px;
    -o-border-radius: 20px;
    border-radius: 20px;
    animation-duration: .2s;
    animation-name: point-move;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    min-width: 50px;
    text-align: right;
    width:22%;
    animation: box-ani 1s linear infinite;
    z-index: 5;
    display:flex;
    position: relative;
    left: 550px;


`
const SaveButtonLayer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 10px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 20px;
  margin-top:20px;
`

const KeywordMain = styled.div`
  font-weight : 700;
  font-size:20px;
  line-height:26px;
  color :#131313;
  padding:15px;
`
const SearchItem = styled.div`
  display:flex;
  flex-direction:column;
  background-color : ${({bgColor}) => bgColor};
  height:70px; 
  padding: 20px 15px;
`
const MemoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height:44px;
  border: 1px solid #f75100;
  width: 118px;
  border-radius: 4px;



`
const SpecialLayer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top:20px;
`
const SpecialItem = styled.div`
    margin: 5px;
    border-radius: 20px;
    height: 30px;
    padding: 5px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;

`
const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  width:'100%',
  height:'480px'
};

const { kakao } = window;

const PCMapPopup = ({ search,callback, top, left, height, width, name,ykiho,latitude, longitude }) =>{
  console.log("TCL: PcHospitalpopup -> ykiho", ykiho)
  console.log("TCL: PcHospitalpopup -> name", name)
  const [open, setOpen] = useState(true);
  const [currentloading, setCurrentloading] = useState(true);


  const [refresh, setRefresh] = useState(-1);
  const [specialitem, setSpecialitem] = useState([]);
  const [facilityitem, setFacilityitem] = useState({});
  const [departmentitems, setDepartmentitems] = useState([]);
  const [equipmentitems, setEquipmentitems] = useState([]);

  const handleClose = async() => {
    setOpen(false);
    callback();
  };

  useEffect(() => {



    MapViewPaint();

  }, []);

  async function MapViewPaint(){
    await useSleep(1000);

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
      center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
      level: 5 // 지도의 확대 레벨
    };
    var map = new kakao.maps.Map(mapContainer, mapOption);

    // 마커를 표시할 위치
    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

    // 마커를 생성
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    });

    // 마커를 지도 위에 표시
    marker.setMap(map);


    setCurrentloading(false);
  }




  return (
    <div>

      {
        currentloading == true && 
    
        <LottieAnimation containerStyle={{zIndex:11}} animationData={imageDB.loadinglarge}/>

      }


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
          <Box sx={[style, style.top={top},style.left={left}, style.height={height}, style.width={width}] }>
            <Column style={{height:540, width:'100%',background:"#fff", justifyContent:"unset"}}>
              <Poptilt>
                <BetweenRow style={{width:"100%"}}>
                  <PopMainLabel>{'선택하신 지역 정보 입니다'}</PopMainLabel>
                  <IconCloseView onClick={handleClose}><IoCloseSharp size={30} color={'#fff'}/></IconCloseView>
                </BetweenRow>
              </Poptilt>
              <Popcontent>
              <Row>
                <div style={{display:"flex", width:'100%'}}>
                  <div id="map" className="Map" style={mapstyle}></div>
                </div>  
              </Row>
      
     
              </Popcontent>
            </Column> 
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default PCMapPopup;