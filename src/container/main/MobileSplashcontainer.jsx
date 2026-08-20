import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LottieAnimation from "../../common/LottieAnimation";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { DefaultReadWork, findWorkAndFunctionCallFromCurrentPosition, ReadAllWork, ReadWork } from "../../service/WorkService";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";
import { useNoScroll } from "../../utility/useNoScroll";
import { LINKTYPE, MOVE } from "../../utility/link";
import { APP_TO_WEB } from "../../service/appBridge";
import { Create_userdevice, readuserbydeviceid, updatealluserbydeviceid, Update_tokendevice, Update_usertoken } from "../../service/UserService";

import { v4 as uuidv4 } from 'uuid';

import localforage from 'localforage';
import { resolveEntryRoute } from '../../utility/entry';
import Axios from "axios";
import randomLocation from 'random-location'
;
import { distanceFunc } from "../../utility/region";
import { CHECKDISTANCE, INCLUDEDISTANCE, PROFILEIMAGE } from "../../utility/screen";
import { fi } from "date-fns/locale";
import { getFixedPosition } from "../../utility/devLocation";

// 개발 중에는 위치를 다산동으로 고정한다 (utility/devLocation)
const getCurrentPositionOrFixed = (onOk, onErr, opts) => {
  const fixed = getFixedPosition();
  if (fixed) { onOk(fixed); return; }
  if (typeof navigator === 'undefined' || !navigator.geolocation) { onErr(new Error('no geolocation')); return; }
  navigator.geolocation.getCurrentPosition(onOk, onErr, opts);
};

/* 위치를 못 구했을 때 쓸 좌표 (형 보고 2026-08-16 "스피너만 도네").
   마켓에 올라가 있는 앱은 WebView 에 geolocationEnabled 가 빠져 있다. 안드로이드는 이 값이
   기본 false 라 브라우저 위치 요청에 성공도 실패도 안 온다 — 콜백을 기다리다 화면이 영영 멈춘다.
   앱을 다시 올릴 때까지도 돌아가야 하므로, 위치는 못 구해도 화면은 넘어가게 한다. */
const FALLBACK_POSITION = { latitude: 37.6115, longitude: 127.1560 };

// 이 시간 안에 위치가 안 잡히면 기다리지 않고 넘어간다
const LOCATION_WAIT_MS = 7000;



/* 로딩 화면은 화면 전체를 흰색으로 채운다.
   예전에는 바깥 div 에 높이가 없어 이 박스가 내용 높이만큼만 자랐고,
   그 아래로 app-frame 의 회색 바탕이 드러나 화면 반만 흰색으로 보였다.
   alignItems 는 CSS 속성명이 아니라 세로 가운데 정렬도 안 먹고 있었다. (2026-08-18) */
const Container = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: var(--surface);
`
const style = {
  display: "flex"
};



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
// kakao 는 전역(window.kakao)을 참조 시점에 읽는다.
// 최상단에서 구조분해하면 SDK 로드 전 undefined 로 굳는다 (Vite=ES모듈, 2026-08-12)

const MobileSplashcontainer =({containerStyle}) =>  {
  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  useNoScroll();   // 로딩 화면은 스크롤할 게 없다
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [move, setMove] = useState(0);
  const [webview, setWebview] = useState(false);

  const [switchscreen, setSwitchscreen]= useState(false);
  const [height, setHeight] = useState(0);

  const elementRef = useRef(null);
  const isWeb = typeof window !== 'undefined'; // 웹 환경 확인

  // 위치가 어느 경로로 먼저 들어오든(앱 · 브라우저 · 대기 만료) 한 번만 진행한다
  const startedRef = useRef(false);

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

    /* 앱이 보내는 종류 이름은 'APP_INIT' 인데 여기서는 LINKTYPE.START(숫자 0)와 비교하고 있었다.
       그래서 앱이 이미 구해서 넘겨준 좌표를 웹이 한 번도 못 받았고, 브라우저 위치가 늦거나
       실패하면 기본 좌표(다산동)로 넘어가 화면에 엉뚱한 동네가 떴다. (형 지적 2026-08-18) */
    if (type === APP_TO_WEB.INIT || type === LINKTYPE.START) {
      console.log("TCL: listener -> LINKTYPE.START", LINKTYPE.START, data.token);
      user.token = data.token;
      dispatch(user);

      /* 앱은 자기가 구한 위치도 같이 보내준다. 예전엔 이 값을 버리고 웹이 다시 구했는데,
         마켓에 올라간 앱은 WebView 에서 위치를 못 구해 그대로 멈췄다 (형 2026-08-16).
         앱이 준 값이 있으면 그걸 그대로 쓴다 — 이게 제일 빠르고 확실하다. */
      if (data && data.latitude && data.longitude) {
        proceedWith(Number(data.latitude), Number(data.longitude));
      }
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
  
  /**
   * 좌표가 손에 들어온 뒤의 공통 처리 — 주소로 바꿔 사용자 정보에 넣고 다음 화면으로 보낸다.
   *
   * 여기서 지키는 것 하나: 무슨 일이 있어도 멈추지 않는다.
   * 주소 변환(카카오)이 실패해도, 주변 일감 조회가 실패해도 좌표만 들고 그냥 넘어간다.
   * 예전에는 실패하면 alert 를 띄웠는데, 앱 안에서는 그 알럿이 화면을 잠가버린다.
   */
  const proceedWith = async (latitude, longitude) => {
    if (startedRef.current) return;          // 앱·브라우저·대기만료 중 먼저 온 것 하나만
    startedRef.current = true;

    console.log("TCL: proceedWith ->", latitude, longitude);
    setLocation({ latitude, longitude });

    user.latitude  = latitude;
    user.longitude = longitude;
    user.userimg   = PROFILEIMAGE;

    // 좌표 → 주소. SDK 가 안 떠 있거나 실패해도 진행한다
    try {
      const kakaoSdk = typeof window !== 'undefined' ? window.kakao : null;
      if (kakaoSdk?.maps?.services) {
        const address = await new Promise((resolve) => {
          const geocoder = new kakaoSdk.maps.services.Geocoder();
          const giveup = setTimeout(() => resolve(null), 4000);
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            clearTimeout(giveup);
            resolve(status === kakaoSdk.maps.services.Status.OK ? result[0].address : null);
          });
        });
        if (address) user.address_name = address.address_name;
      }
    } catch (e) {
      console.error("TCL: 주소 변환 실패 — 좌표로만 진행", e);
    }

    dispatch(user);

    try {
      await findWorkAndFunctionCallFromCurrentPosition({
        currentlatitude: latitude,
        currentlongitude: longitude,
        checkdistance: CHECKDISTANCE,
      });
    } catch (e) {
      console.error("TCL: 주변 일감 준비 실패 — 그대로 진행", e);
    }

    FinalProcess();
  };

  const StartProcess =() =>{
    console.log("TCL: StartProcess")

    /* 위치를 기다리는 데 상한을 둔다. 마켓에 올라간 앱은 WebView 설정 때문에
       성공도 실패도 안 돌아오는 경우가 있어서, 여기가 없으면 스피너만 돈다. */
    setTimeout(() => {
      if (startedRef.current) return;
      console.warn("TCL: 위치를 못 받아 기본 위치로 진행한다");
      proceedWith(FALLBACK_POSITION.latitude, FALLBACK_POSITION.longitude);
    }, LOCATION_WAIT_MS);

    getCurrentPositionOrFixed(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        proceedWith(latitude, longitude);
      },
      (err) => {
        // 위치 거부·실패도 막다른 길이 아니다. 기본 위치로 넘어간다
        console.error("TCL: 위치 실패 — 기본 위치로 진행", err);
        proceedWith(FALLBACK_POSITION.latitude, FALLBACK_POSITION.longitude);
      },
      {
          enableHighAccuracy: false,  // 높은 정확도 비활성화
          timeout: 6000,              // 오래 붙잡지 않는다 (예전 20초는 앱에서 너무 길었다)
          maximumAge: 600000          // 10분 안에 구한 값이 있으면 그대로 쓴다
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

    // 목록을 미리 받아두는 것뿐이다. 여기서 넘어지면 화면 자체가 안 뜨므로 실패해도 그냥 간다
    try {
      const workitems = await ReadWork({latitude, longitude,checkdistance});
      data.workitems = workitems;
      datadispatch(data);
    } catch (e) {
      console.error("TCL: 일감 미리 받기 실패 — 빈 목록으로 진행", e);
    }




    let userconfig = {};
    localforage.getItem('userconfig')
    .then(async function(value) {
      console.log("TCL: Mobile MAIN  -> GetItem", value)
      userconfig = value || {};
      if (userconfig.deviceid  == undefined ||  userconfig.deviceid  =='') {
        // 온보딩 → 약관 동의 → 로그인. 어디로 갈지는 한 곳에서 정한다 (형 지시 2026-08-13)
        navigate(await resolveEntryRoute());
      }else{
  
        const DEVICEID = userconfig.deviceid;
        const userdata = await readuserbydeviceid({DEVICEID});
        console.log("TCL: StartProcess -> user", userdata);

        const TOKEN = user.token;


        if(TOKEN != ''){
          const usertoken = await Update_usertoken({DEVICEID, TOKEN });
        }


        if(userdata == -1){
          // 저장된 기기 정보는 있는데 그 계정이 DB 에 없다 — 처음부터 다시 (형 지시 2026-08-13)
          navigate(await resolveEntryRoute());
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

  
    resolveEntryRoute().then((to) => navigate(to));

    });

  
  }



  return (
    <div ref={elementRef} style={{ height: '100%' }}>
      <Container style={containerStyle} height={height}>
          <LottieAnimation animationData={imageDB.loadinglarge}
            width={"96px"} height={'96px'}/>
      </Container>
    </div>
  );
}
export default MobileSplashcontainer;

