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
import "./MobileMapPopup.css"
import { se } from "date-fns/locale";

import { model } from "../../api/config";
import Loading from "../../components/Loading";
import { useSleep } from "../../utility/common";
import { CreateSearch, DeleteSearchByid, ReadSearchByid } from "../../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

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
  margin-right:10px;
`;



const Poptilt = styled.div`
  background-color: #FF7125;
  height: 38px;
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
  font-size: 16px;
  font-weight: 700;
  padding-left: 10px;
  line-height: 60px;
  color :#fff;

`


const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  width:'100%',
  height:'280px'
};

const { kakao } = window;

const MobileMapPopup = ({ search,callback, top, left, height, width, name,ykiho,latitude, longitude, markerimg }) =>{
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

    // // 마커를 표시할 위치
     const Position = new window.kakao.maps.LatLng(latitude, longitude);

    // // 마커를 생성
    // const marker = new window.kakao.maps.Marker({
    //   position: markerPosition
    // });

    // // 마커를 지도 위에 표시
    // marker.setMap(map);


    var content = document.createElement('div');
    content.className = 'maptourregionlay';

    content.innerHTML =
    '  <a>' +
    '    <div>' +
    '    <img src="'+ markerimg+'"style="width:32px;"/>' +
    '    </div>' +
    '    <div class="title">'+name +'</div>' +
    '  </a>' +
    '</div>';

    // Custom Overlay 생성
    var customOverlay = new kakao.maps.CustomOverlay({
        position: Position,
        content: content,
        clickable: true // 클릭 가능하도록 설정
    });


    // Custom Overlay 지도에 추가
    customOverlay.setMap(map);


  



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
            <Column style={{height:300, width:'100%',background:"#fff", justifyContent:"unset"}}>
              <Poptilt>
                <BetweenRow style={{width:"100%"}}>
                  <PopMainLabel>{'지역 정보'}</PopMainLabel>
                  <IconCloseView onClick={handleClose}><IoCloseSharp size={24} color={'#fff'}/></IconCloseView>
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

export default MobileMapPopup;