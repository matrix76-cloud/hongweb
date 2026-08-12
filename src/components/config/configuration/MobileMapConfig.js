import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column } from "../../../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { UserContext } from "../../../context/User";
import { imageDB } from "../../../utility/imageData";
import { EventItems } from "../../../utility/screen";
import { REQUESTINFO, WORKNAME } from "../../../utility/work";

import { PiLockKeyLight } from "react-icons/pi"
import { BADGE } from "../../../utility/badge";
import { setRef } from "@mui/material";

import { IoIosRefresh } from "react-icons/io";
import { CreateName } from "../../../utility/data";
import { CountryAddress, MainRegion } from "../../../utility/region";
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import { getuserInfobyusers_id, updatealluserbydeviceid, Update_addrbyusersid, Update_addrItemsbyusersid, Update_userinfobyusersid } from "../../../service/UserService";
import { SlEnvelopeOpen } from "react-icons/sl";
import { sleep } from "../../../utility/common";
import LottieAnimation from "../../../common/LottieAnimation";
import { LoadingChatAnimationStyle, LoadingMapConfigAnimationStyle } from "../../../screen/css/common";
import ButtonEx from "../../../common/ButtonEx";
import { getFontSize, isIOS } from "../../../utility/fontsize";

import { Toaster, toast } from 'sonner';

const Container = styled.div`
  width:"100%"
`
const style = {
  display: "flex"
};

const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 30px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(22)}px;

`

const EventBox = styled.div`

  margin-top:30px;
  width: 95%;
  margin-bottom: 30px;
  cursor: pointer;
  transition: .2s all;
  margin:0 auto;
  
`
const txtWrap = {
  backgroundColor:'#fafafa',
  padding: '18px 20px 24px',
  lineHeight:2
}

const tit ={
  fontSize: '18px',
  fontWeight: 700,
}

const day = {
  color: '#797979',
  fontSize: '16px'
}



const mapstyle = {

  overflow: "hidden",
  width:'100%',
  height:'65vh'
};


const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

const ConfigLayer = styled.div`

  width:90%;

  bottom: ${isIOS() ? '20px' : '0px'};

  height: 200px;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding:20px;

  position: absolute

`
const FlexWrap = styled.div`
  display:flex;
  flex-wrap : wrap;
  margin-top:10px;

`

const ConfigLabel = styled.div`
  font-family : Pretendard-SemiBold;
  font-size: ${() => getFontSize(16)}px;

`
const AddressItem = styled.div`
  padding: 5px 10px;
  width: 20%;
  background:  ${({ enable }) => enable == true ? ('#FFF6F2') : ('#fff')};
  color :${({ enable }) => enable == true ? ('#FE6625') : ('#131313')};
  border :${({ enable }) => enable == true ? ('1px solid #FE6625') : ('1px solid #E8E9EA')};

  display: flex;
  justify-content: center;
  margin: 5px;
  font-size: ${() => getFontSize(14)}px;
  border-radius:5px;


`
const ProgressButtonLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 10px auto;

`
const ProgressButton = styled.div`
  background:  ${({ enable }) => enable == true ? ('#FFF6F2') : ('#fff')};
  color :${({ enable }) => enable == true ? ('#FE6625') : ('#131313')};
  border :${({ enable }) => enable == true ? ('1px solid #FE6625') : ('1px solid #E8E9EA')};
  width: 22%;
  padding: 6px 12px;
  z-index: 15;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  font-size: ${() => getFontSize(12)}px;
  border-radius:5px;

`
const Layer = styled.div`
  position: absolute;
  top: 90px;
  background: rgb(24 24 24 / 23%);
  z-index: 10;
  font-size: ${() => getFontSize(12)}px;
  width: 80%;
  left: 5%;
  color: #131313;
  padding: 10px;
  display: flex;
  flex-direction: row;

`


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobileMapConfig =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [addressitems, setAdderssitems] = useState([]);
  const [basicaddr, setBasicaddr] = useState(user.address_name);
  const [basicradius, setBasicradius] = useState(user.radius);
  const [curmap, setCurMap] = useState({});
  const [coords, setCoords] = useState({});
  const [circle, setCircle] = useState({});
  const [progressvalue, setProgressvalue] = useState(0);
  const [currentloading, setCurrentloading] = useState(true);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setBasicradius(basicradius);
    setBasicaddr(basicaddr);
    setCurMap(curmap);
    setCoords(coords);
    setProgressvalue(progressvalue);

  }, [refresh])

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  
  useEffect(()=>{

      sleep(1000);

      var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
      mapOption = { 
            center: new kakao.maps.LatLng(user.USERINFO.latitude, user.USERINFO.longitude), // 지도의 중심좌표
            level: 9 // 지도의 기본 레벨
      };
  
      var map = new kakao.maps.Map(mapContainer, mapOption);
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT); //

      const coords = new window.kakao.maps.LatLng(user.USERINFO.latitude, user.USERINFO.longitude);

      setCoords(coords);
      map.setCenter(coords);

      const circle = new window.kakao.maps.Circle({
          center: coords,
          radius: basicradius * 1000,
          strokeWeight: 2,
          strokeColor: '#ff4e19',
          strokeOpacity: 1,
          strokeStyle: 'dashed',
          fillColor: '#FFCF70',
          fillOpacity: 0.2
      });
      circle.setMap(map);

      setCircle(circle);

      setCurMap(map);

      async function FetchData(){
  


        const USERS_ID = user.USERS_ID;

        const userdata = await getuserInfobyusers_id({USERS_ID});

        if(userdata.ADDRESSITEMS != undefined){
          setAdderssitems(userdata.ADDRESSITEMS);
       
        }
        setCurrentloading(false);
      }

      FetchData();


          // 지도의 확대/축소 이벤트 리스너 추가
    window.kakao.maps.event.addListener(map, 'zoom_changed', () => {

        const level = map.getLevel();
  

        if (level < 6) {
            map.setLevel(6);
        } else if (level > 11) {
            map.setLevel(11);
        }
    });

    if(basicradius == 2.5){

      setProgressvalue(25);
    }else if(basicradius == 5){

      setProgressvalue(50);
    }else if(basicradius == 10){

      setProgressvalue(75);
    }else if(basicradius == 15){

      setProgressvalue(100);
    }


  }, [])


  const _handleRadiusCheck = async(radius)=>{
    setBasicradius(radius);

    circle.setMap(null);

    const circle2 = new window.kakao.maps.Circle({
      center: coords,
      radius: radius * 1000,
      strokeWeight: 2,
      strokeColor: '#ff4e19',
      strokeOpacity: 1,
      strokeStyle: 'dashed',
      fillColor: '#FFCF70',
      fillOpacity: 0.2
    });
    circle2.setMap(curmap);

    setCircle(circle2);


    // 지도 범위 설정

    if(radius == 2.5){
      curmap.setLevel(7);
      setProgressvalue(25);
    }else if(radius == 5){
      curmap.setLevel(8);
      setProgressvalue(50);
    }else if(radius == 10){
      curmap.setLevel(9);
      setProgressvalue(75);
    }else if(radius == 15){
      curmap.setLevel(10);
      setProgressvalue(100);
    }

        
   
  }
  
  const _handleAddressSetting = async(data) =>{
 

    setBasicaddr(data.ADDR);
    setBasicradius(data.RADIUS);

    const coords = new window.kakao.maps.LatLng(data.LATITUDE, data.LONGITUDE);
    setCoords(coords);
    curmap.setCenter(coords);
    setCurMap(curmap);

    circle.setMap(null);
    setCircle(circle);

    const circle2 = new window.kakao.maps.Circle({
      center: coords,
      radius: data.RADIUS * 1000,
      strokeWeight: 4,
      strokeColor: '#ff4e19',
      strokeOpacity: 1,
      strokeStyle: 'dashed',
      fillColor: '#FFCF70',
      fillOpacity: 0.2
    });
    circle2.setMap(curmap);
    setCircle(circle2);



    // 지도 범위 설정

    if(data.RADIUS == 2.5){
      curmap.setLevel(7);
      setProgressvalue(25);
    }else if(data.RADIUS  == 5){
      curmap.setLevel(8);
      setProgressvalue(50);
    }else if(data.RADIUS  == 10){
      curmap.setLevel(9);
      setProgressvalue(75);
    }else if(data.RADIUS  == 15){
      curmap.setLevel(10);
      setProgressvalue(100);
    }

    setRefresh((refresh) => refresh +1);

  }


  const _handleSave = async() => {
    // 저장 로직을 넣어 준다
    // 1. 만약에 user context 상주 해 있는 메모리라면 바로 반영해준다

    if (user.address_name == basicaddr) {
      // user.radius = basicradius;
      // dispatch(user);
      // dispatch({ ...user,radius: basicradius});


      const USERINFO = user.USERINFO;
      const DEVICEID = user.DEVICEID;
      await updatealluserbydeviceid({ USERINFO, DEVICEID });


    }

    // 2. 데이타 베이스에 넣어준다

    const FindIndex = addressitems.findIndex(x => x.ADDR == basicaddr);


    addressitems[FindIndex].RADIUS = basicradius;

    const USERS_ID = user.USERS_ID;
    const ADDRITEMS = addressitems;
    const updateaddr = await Update_addrItemsbyusersid({ ADDRITEMS, USERS_ID });

    setAdderssitems(ADDRITEMS);

    toast.info("지역 범위가 저장되었습니다", {
      duration: 1000,
      style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
    })



    setRefresh((refresh) => refresh + 1);
  }

 
 
  return (

    <Container style={containerStyle}>

        <Column style={{width:"100%",margin: "0 auto"}} >   
           
          <div style={{width:"100%", margin:"0px auto", display:"flex"}}>
            <div id="map" className="Map" style={mapstyle}></div>
        </div>
        <Layer>
          <img src={imageDB.ic_myinfo_menu_hong} style={{ width: 20, height:20 }} />
          
          <div>
             구해줘 알바에 등록된 일감 확인 이나 실시간 알람 은 설정하신 지역 범위 내에서만 표시되거나 동작 합니다
          </div>
        </Layer>

          {
           currentloading == true ? (<LottieAnimation
           containerStyle={LoadingMapConfigAnimationStyle} animationData={imageDB.loading}
          width={"50px"} height={'50px'}/>):
            (<ConfigLayer>
              
              <Row>
                <HeaderPopupline />
              </Row>

            <ConfigLabel>지역별 범위 설정</ConfigLabel>

            <FlexWrap>
              {
                addressitems.map((data, index)=>(
                  <AddressItem 
                  onClick={()=>{_handleAddressSetting(data)}}
                  enable ={data.ADDR == basicaddr}>{MainRegion(data.ADDR)}</AddressItem>
                ))
              }
            </FlexWrap>
 
              <ProgressButtonLayer>
              <ProgressButton onClick={()=>{_handleRadiusCheck(2.5)}}  enable ={basicradius == 2.5}>2.5km</ProgressButton>
              <ProgressButton onClick={()=>{_handleRadiusCheck(5)}}  enable ={basicradius == 5}>5km</ProgressButton>
              <ProgressButton onClick={()=>{_handleRadiusCheck(10)}}  enable ={basicradius == 10}>10km</ProgressButton>
              <ProgressButton onClick={()=>{_handleRadiusCheck(15)}}  enable ={basicradius == 15}>15km</ProgressButton>
              </ProgressButtonLayer>
              

              <ButtonEx text={'설정하기'} width={'90'}
                onPress={_handleSave} bgcolor={'#FE6625'} color={'#fff'} containerStyle={{
                  fontFamily: "Pretendard-Regular", height: "47px", fontSize: "16px",
                  border: "1px solid #fff", marginTop: 20, boxShadow: "none"
              }} />
              
    
          </ConfigLayer>)
          }
       


        </Column>

      <Toaster position="bottom-right" richColors />

    </Container>
  );

}

export default MobileMapConfig;

