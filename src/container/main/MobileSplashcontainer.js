import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LottieAnimation from "../../common/LottieAnimation";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { ReadRoom } from "../../service/RoomService";
import { ReadWork } from "../../service/WorkService";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";
import { ReadCampingRegion, ReadHospitalRegion, ReadHospitalRegion1, ReadPerformanceCinema, ReadPerformanceEvent, ReadTourCountry, ReadTourFestival, ReadTourPicture, ReadTourRegion } from "../../service/LifeService";
import { LINKTYPE, MOVE } from "../../utility/link";
import { Create_userdevice, Read_userdevice, update_userdevice } from "../../service/UserService";

import { v4 as uuidv4 } from 'uuid';


const isWeb = typeof window !== 'undefined'; // 웹 환경 확인

const Container = styled.div`
  height: 100%;
  display : flex;
  justify-content:center;
  alignItems:center;
  width :100%;
  background : #FFF;


`
const style = {
  display: "flex"
};



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobileSplashcontainer =({containerStyle}) =>  {

/** PC 웹 초기 구동시에 데이타를 로딩 하는 component
 * ① 상점정보를 불러온다
 * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [move, setMove] = useState(0);
  const [webview, setWebview] = useState(false);

  const [switchscreen, setSwitchscreen]= useState(false);
  const [height, setHeight] = useState(0);

  const elementRef = useRef(null);
  useLayoutEffect(() => {
    setHeight(elementRef.current.offsetHeight -10);
    console.log("TCL: MobileMaincontainer -> elementRef.current.offsetWidth", elementRef.current.offsetHeight)
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setSwitchscreen(switchscreen);

    setWebview(true);

  },[refresh])


    /**
   ** 실제로 react-native앱에서 받은 로직을 처리하는 Function
   */
   const listener = async (event) => {

  
    if(!isValidJSON(event.data)){

      return;
    }
    const { data, type } = JSON.parse(event.data);
  
    if (type === LINKTYPE.START) {
      const TOKEN = data.token;
      const LATITUDE = data.latitude;
      const LONGITUDE = data.longitude;

      let uniqueId = localStorage.getItem('uniqueId');
 
      if (!uniqueId) {
        uniqueId = uuidv4();
        localStorage.setItem('uniqueId', uniqueId);
      
      }
 
      const DEVICEID = uniqueId;

      let movetype = 0;

      const ReadUser = await Read_userdevice({DEVICEID});

      if(ReadUser  == -1){
        await Create_userdevice({DEVICEID, TOKEN, LATITUDE, LONGITUDE})
        movetype = MOVE.REGISTER;
        MobileStartProcess(movetype, LATITUDE, LONGITUDE);
      }else{
        movetype = MOVE.MAIN;
        MobileStartProcess(movetype, LATITUDE, LONGITUDE);
      }

    

      setRefresh((refresh) => refresh +1);

    } else if (type === LINKTYPE.CURRENTPOS) {

    } else if(type == LINKTYPE.TELEPHONE){

    }
  };

  useEffect(() => {
    document.addEventListener("message", listener);
    /** ios */
    window.addEventListener("message", listener);

  }, []);


  /**
   * 홍여사 웹페이지 초기 구동시에 필요한 데이타를 로딩해서 dataContext에 담아둔다
   * ! 중요
   * ! 함수 호출순서 FetchLocation => FetchData => StartProcess
   * ! FetchLocation 함수
   * ① 지역을 찾았을때 지역 이름을 dataContext 에 설정 해준다
   * ② 지역을 찾았을때 지역 위치을 dataContext 에 설정 해준다
   * TODO 지역을 찾지 못했을때 지역 범위를 설정 해야 한다는 도움말 주소지로 이동 시
   * TODO RoomItems 값을 임의로 설정해주자
 
   * ! FetchData 함수
   * ① 처음 게시판에 들어 갔을때 데이타 로드가 너무 느릴수 있기 때문에 미리 로딩한다 서비스 : ReadCommunitySummary
   * ② 등록된 일감정보를 미리 로딩한다 서비스 : ReadWork
   * 
   * ! StartProcess 함수
   * ① 메인함수로 이동한다
   */
  useEffect(()=>{


    if (getPlatform() === 'web') {
        StartProcess();
    }


  }, [])

  const getPlatform = () => {
    if (isWeb) {
        const userAgent = navigator.userAgent;
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return 'ios';
        }
        if (/Android/.test(userAgent)) {
            return 'android';
        }
        return 'web';
    }
    return 'native'; // 네이티브 환경으로 간주
};


  function isReactNativeWebView() {
    return typeof window.ReactNativeWebView !== 'undefined';
  }


  function isValidJSON(jsonString) {
    try {
      JSON.parse(jsonString);
      return true; // 파싱 성공
    } catch (error) {
      return false; // 파싱 실패
    }
  }
  async function StartProcess(move){

    FetchLocation(move);


  } 

  async function MobileStartProcess(move, latitude, longitude){

    FetchMobileLocation(move, latitude, longitude);

    const communityitems = await ReadCommunitySummary();
    const workitems = await ReadWork();
    const roomitems = await ReadRoom();

    data.communityitems = communityitems;
    data.workitems = workitems;
    data.roomitems = roomitems;

    datadispatch(data);


    setRefresh((refresh) => refresh +1);
    await useSleep(1000);
    if(move == MOVE.REGISTER){
      navigate("/Mobilegate");
    }else if(move == MOVE.MAIN){
      navigate("/Mobilemain");
    }
  } 

  async function FetchLocation(move){
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        // Geocoder를 사용하여 좌표를 주소로 변환
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, async (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].address;

            console.log("TCL: FetchLocation -> ", address);
          
            user.address_name = address.address_name;
            user.region_1depth_name = address.region_1depth_name;
            user.region_2depth_name = address.region_2depth_name;
            user.region_3depth_name = address.region_3depth_name;
            user.main_address_no = address.main_address_no;

            geocoder.addressSearch(address.address_name, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                  const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                  user.latitude = result[0].y;
                  user.longitude = result[0].x;
                  dispatch(user);
         
              }
            });

            dispatch(user);
            console.log("TCL: FetchLocation -> ", user );
    

            const communityitems = await ReadCommunitySummary();
            const workitems = await ReadWork();
            const roomitems = await ReadRoom();
        
            data.communityitems = communityitems;
            data.workitems = workitems;
            data.roomitems = roomitems;
        
            datadispatch(data);
            console.log("TCL: FetchLocation -> data", data)
        
            setRefresh((refresh) => refresh +1);
            navigate("/Mobilemain");
            
       
          }else{

            alert(status);
          }
        });
 
      },
      (err) => {
        console.error(err);
        alert(err);
      }
    );
  };

  async function FetchMobileLocation(move, LATITUDE, LONGITUDE){
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(LONGITUDE, LATITUDE, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const address = result[0].address;

        console.log("TCL: FetchMobileLocation -> ", address);
      
        user.address_name = address.address_name;
        user.region_1depth_name = address.region_1depth_name;
        user.region_2depth_name = address.region_2depth_name;
        user.region_3depth_name = address.region_3depth_name;
        user.main_address_no = address.main_address_no;

        geocoder.addressSearch(address.address_name, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

              user.latitude = result[0].y;
              user.longitude = result[0].x;
              dispatch(user);
    
          }
        });

        dispatch(user);
        console.log("TCL: FetchLocation -> ", user );


   
      }else{

      }
    });
  };

  async function FetchData(move){
    console.log("TCL: FetchData -> move", move);
 

    const latitude = "37.630013553801";
    const longitude = "127.15545777991";
    const communityitems = await ReadCommunitySummary();
    const workitems = await ReadWork();
    const roomitems = await ReadRoom();

    data.communityitems = communityitems;
    data.workitems = workitems;
    data.roomitems = roomitems;

 
    StartProcess(move);

  } 

 
  return (

    <div ref={elementRef}>

    <Container style={containerStyle} height={height}>

        <LottieAnimation containerStyle={{marginTop:"65%"}} animationData={imageDB.loadinglarge}
          width={"150px"} height={'150px'}
        />

    </Container>

    </div>

  );

}

export default MobileSplashcontainer;

