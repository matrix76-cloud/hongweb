import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LottieAnimation from "../../common/LottieAnimation";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { DefaultReadRoom, findRoomAndFunctionCallFromCurrentPosition, findRoomFromCurrentPosition, ReadAllRoom, ReadRoom } from "../../service/RoomService";
import { DefaultReadWork, findWorkAndFunctionCallFromCurrentPosition, findWorkFromCurrentPosition, ReadAllWork, ReadWork } from "../../service/WorkService";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";
import { ReadCampingRegion, ReadHospitalRegion, ReadHospitalRegion1, ReadPerformanceCinema, ReadPerformanceEvent, ReadTourCountry, ReadTourFestival, ReadTourPicture, ReadTourRegion } from "../../service/LifeService";
import { LINKTYPE, MOVE } from "../../utility/link";
import { Create_userdevice, readuserbydeviceid, Read_userdevice, updatealluserbydeviceid, Update_tokendevice, update_userdevice, Update_usertoken } from "../../service/UserService";

import { v4 as uuidv4 } from 'uuid';

import localforage from 'localforage';
import Axios from "axios";
import randomLocation from 'random-location'
import { setStorage } from "../../utility/data";
import { distanceFunc } from "../../utility/region";
import { CHECKDISTANCE, INCLUDEDISTANCE, PROFILEIMAGE } from "../../utility/screen";
import { fi } from "date-fns/locale";



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
  const isWeb = typeof window !== 'undefined'; // 웹 환경 확인

  useLayoutEffect(() => {
    setHeight(elementRef.current.offsetHeight -10);
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  function getPlatform (){
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


  useEffect(()=>{
    setSwitchscreen(switchscreen);
    setWebview(true);
  },[refresh])


   /**
   * 실제로 react-native앱에서 받은 로직을 처리하는 Function
   * ! react-native에서 제일 중요한 부분은 token 값을 받는다
   * ! 이 token 값은 푸시알람을 위해서 필요하다 
   * ! 이 token 값은 usercontext에 저장 해두며 다음 세가지 케이스에 서버에 저장된다
   * ! 1) 저장된 DEVICEID 가 있고 서버도 동일한 DEVICEID가 존재 할때 서버에 TOKEN을 업데이트 한다 : Splash => Main
   * ! 2) 저장된 DEVICEID 가 있지만 서버에 동일한 DEVICEID가 없을때 : Splash => Gate => Phone => Main
   * ! 3) 저장된 DEVICEID 가 없을때: Splash => Gate => Phone => Policy => Main
   */
   const listener = async (event) => {
  
    if(getPlatform() === 'web'){
      return;
    }
    if(!isValidJSON(event.data)){
      return;
    }


    const { data, type } = JSON.parse(event.data);

    if (type === LINKTYPE.START) {
      console.log("TCL: listener -> LINKTYPE.START", LINKTYPE.START, data.token);
      user.token = data.token;
      dispatch(user);
    }
  };

  useEffect(() => {
    document.addEventListener("message", listener);
    /** ios */
    window.addEventListener("message", listener);

  }, []);


  /**
   * ! StartProcess 함수
   * ① 메인함수로 이동한다
   */
  useEffect(()=>{
    StartProcess();
  }, [])

  /**
   * 현재 위치를 계산 하여 구한다음 1. 현재 위치로 주소 값을 구하여 userContext에 값을 설정 한다
   * ! 현재 위치에서 해당 하는 정보 값에 대한 세팅 값을 먼저 설정하기 위해 Function을 호출한다. 
   * TODO 현재 위치를 잡아야 하기 때문애 시간이 오래걸릴수 있는 문제가 있다 나중에 해결 해야함
   * ! room 정보와 work 정보가 현재 위치내에서 존재 하고 있는지 여부를 검사하고 존재 하지않으면
   * 정보 디비에서 빼온 값을 인자로 해서 Functions을  호출해둔다
   * 시간이 생명이다. 이러한 처리는 주소지 변경이나 현재 위치 재설정에서도 사용 된다(데이타가 있는것처럼 보여야 하기 때문에)
  */
  
  const StartProcess =() =>{
    console.log("TCL: StartProcess")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        console.log("TCL: StartProcess -> latitude", latitude)
        console.log("TCL: StartProcess -> longitude", longitude)
        // Geocoder를 사용하여 좌표를 주소로 변환
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, async (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].address;

  
            user.address_name = address.address_name;
            user.latitude  = latitude;
            user.longitude = longitude;
            user.userimg = PROFILEIMAGE;
            
            dispatch(user);
            console.log("TCL: StartProcess  user setting -> ", user );

            // 설정된 거리 내외에 현재 위치에 존재 하는 데이타가 있습니까?

            const currentlatitude = latitude;
            const currentlongitude = longitude;
            const checkdistance = CHECKDISTANCE;
            const workfunctioncall = await findWorkAndFunctionCallFromCurrentPosition({currentlatitude, currentlongitude, checkdistance});
            const roomfunctioncall= await findRoomAndFunctionCallFromCurrentPosition({currentlatitude, currentlongitude, checkdistance});

            FinalProcess();

  
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
          timeout: 20000,             // 최대 20초 대기
          maximumAge: 0              // 캐시된 위치 사용 안 함
      }
    );


  } 
   /**
   * 설정 값이 존재하지 않는 다면 mobilegate로 이동 한다
   * 설정 값이 존재 하지만 데이타 베이스에 설정값(디바이스아이디)에 맞는 데이타가 없다면 mobile phone으로 이동한다
   * 설정 값이 존재 하고 데이타 베이스에 설정값(디바이스아이디)에 맞는 데이타가 있다면 mobile main으로 이동한다
   * ! mobile main으로 이동하는 경우에는
   * ! 현재 위치에 맞는 일감 정보와 공간 대여 정보를 가져 와서 DataContext에 설정해준다
   * ! userContext 와 데이타베이스 그리고 설정 정보에 최신정보를 업데이트 해준다
   * ! userContext에 이미 구한 전화번호등 기타 정보를 세팅 하기 위해 데이타 베이스관련작업을 먼저 한다
   * ! userContext 
   *   1) latitude
   *   2) longidue
   *   3) address 기타 정보
   *   4) phone, nickname, deiviceid, users_id
   */
  const FinalProcess = async()=>{
    //Function 호출
    const latitude = user.latitude;
    const longitude = user.longitude;
    const checkdistance = INCLUDEDISTANCE;

    const workitems = await ReadWork({latitude, longitude,checkdistance});
    const roomitems = await ReadRoom({latitude, longitude,checkdistance});

    data.workitems = workitems;
    data.roomitems = roomitems;
    datadispatch(data);




    let userconfig = {};
    localforage.getItem('userconfig')
    .then(async function(value) {
      console.log("TCL: Mobile MAIN  -> GetItem", value)
      userconfig = value;
      if (userconfig.deviceid  == undefined ||  userconfig.deviceid  =='') {
        navigate("/Mobilegate");
      }else{
  
        const DEVICEID = userconfig.deviceid;
        const userdata = await readuserbydeviceid({DEVICEID});
        console.log("TCL: StartProcess -> user", userdata);

        const TOKEN = user.token;


        if(TOKEN != ''){
          const usertoken = await Update_usertoken({DEVICEID, TOKEN });
        }


        if(userdata == -1){
          navigate("/Mobilegate");
        }else{
          console.log("TCL: Mobile MAIN -> DEVICEID 존재")
          setRefresh((refresh) => refresh +1);
          user.deviceid = userdata.DEVICEID;
          user.phone = userdata.USERINFO.phone
          user.nickname = userdata.USERINFO.nickname;
          user.users_id = userdata.USERS_ID;
          user.userimg = userdata.USERINFO.userimg;
        
          dispatch(user); // UserContext 에 address 정보 와 위치 정보, 토큰정보는 StartProcess와 초기 RN과 통신에서 이미 세팅 해둠

          const USERINFO = user;
          // 객체 저장
          localforage.setItem('userconfig', USERINFO).then(async function () {
            const DEVICEID = user.deviceid;
            const userupdate = await updatealluserbydeviceid({USERINFO, DEVICEID});
            
          }).catch(function (err) {
            console.error('Error saving userconfig:', err);
          });
          navigate("/Mobilemain");
        }
  
      }

    })
    .catch(function(err) {
    console.log("TCL: StartProcess -> storage fail ",);

  
    navigate("/Mobilegate");

    });

  
  }



  return (
    <div ref={elementRef}>
      <Container style={containerStyle} height={height}>
          <LottieAnimation containerStyle={{marginTop:"65%"}} animationData={imageDB.loadinglarge}
            width={"150px"} height={'150px'}/>
      </Container>
    </div>
  );
}
export default MobileSplashcontainer;

