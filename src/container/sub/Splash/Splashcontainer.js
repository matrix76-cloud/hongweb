import React, {  useContext, useEffect, useLayoutEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../../context/User";
import { useSleep } from "../../../utility/common";
import { LINKTYPE } from "../../../utility/link";
import Fade from "react-reveal/Fade";


const Container = styled.div`
  background-color :#FF4E19;
  height:800px
`

const Splashcontainer =({containerStyle}) =>  {

/** 스프래시 화면
 ** 초기 구동시에 필요한 데이타를 로딩 하는 곳으로 로딩하는 동안 이미지를 표시
 ** 앱과 통신
 ** Firebase 초기 정보 구동
 *! react-native앱과 데이타 교환(gps 정보, 전화번호 정보를 가져와서 회원정보와 일치시킨다)
 * TODO  Firebase에 연동데이타 
 * ? 뤄리 API 설명
 * @param 설명
 */

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  useLayoutEffect(() => {
  }, []);

  useEffect(()=>{

  },[refresh])


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  /**
   ** 5초후에 메인으로 이동
   *TODO 최소 5초후에 이동하도록 하고 2초후에 서버에서 데이타를 모두 가져 온다음에 이동하도록 한다
   */
  useEffect(()=>{
    async function FetchData(){
      await useSleep(5000);
      navigate("/main");

    } 
    FetchData();
  }, [])




  /**
   ** 실제로 react-native앱에서 받은 로직을 처리하는 Function
   */
  const listener = (event) => {
    const { data, type } = JSON.parse(event.data);
    if (type === LINKTYPE.DEVICEINFO) {


    } else if (type === LINKTYPE.CURRENTPOS) {

    } else if(type == LINKTYPE.TELEPHONE){

    }
  };

  /**
   ** 실제로 react-native앱 메시지 처리
   */
  useEffect(() => {
    // setRegion(user.region1 + " " + user.region2);
    if (window.ReactNativeWebView) {
      /** android */
      document.addEventListener("message", listener);
      /** ios */
      window.addEventListener("message", listener);
    } else {
      // 모바일이 아니라면 모바일 아님을 alert로 띄웁니다.
    }
  }, []);


  // sample code
  // useEffect(() => {
  //   let DEVICEID = "245de8d2762f971f";
  //   user["deviceid"] = DEVICEID;
  //   user["region1"] = "남양주시";
  //   user["region2"] = "다산동";
  //   user["latitude"] = "37.630013553801";
  //   user["longitude"] = "127.15545777991";
  //   user["curlatitude"] = "37.630013553801";
  //   user["curlongitude"] = "127.15545777991";
  //   user["distance"] = 50;

    
  //   const latitude = "37.630013553801";
  //   const longitude = "127.15545777991";

  //   async function FetchData(){

  //    getStoreData({user, latitude, longitude}).then((result)=>{

  //       console.log(" getStoreData user", user);
  //       dispatch2(user);
  //    })

  //   }

  //  FetchData();

  // }, []);


 
  return (

    <Container style={containerStyle}>
        <Fade bottom delay={500}>
            <div
              style={{
                fontSize: 28,
                fontWeight:800,
                letterSpacing: 1.2,
                fontFamily:'Pretendard-Bold',
                color: '#fff',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "60%",
              }}
            >
              {'우리동네 주변 일 잘하는'}
            </div>
        </Fade>
        <Fade left delay={1500}>
            <div
              style={{
                fontSize: 28,
                fontWeight:800,
                letterSpacing: 1.2,
                color: '#fff',
                fontFamily:'Pretendard-Bold',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "10%",
              }}
            >
              {'홍여사가 달려옵니다'}
            </div>
        </Fade>
    </Container>
  );

}

export default Splashcontainer;

