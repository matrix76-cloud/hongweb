
import React, {Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../../common/Button";
import { Column } from "../../common/Column";
import { FlexstartRow, Row } from "../../common/Row";
import MobileGpsLaw from "../../components/MobileGpsLaw";
import MobilePrivacyLaw from "../../components/MobilePrivacyLaw";
import MobileUseLaw from "../../components/MobileUseLaw";
import UseLaw from "../../components/UseLaw";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";

import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../api/config";
import { get_phonenumber, readuserbyphone, Read_userphone, Update_userdevice, Update_usertoken } from "../../service/UserService";
import { sleep, useSleep } from "../../utility/common";
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';
import Axios from "axios";
import MobileWarningPopup from "../../modal/MobileWarningPopup/MobileWarningPopup";
import { LoadingPCPhoneAnimationStyle, LoadingSearchAnimationStyle } from "../../screen/css/common";
import LottieAnimation from "../../common/LottieAnimation";

import "../../screen/css/common.css"
import { LAWTYPE } from "../../utility/screen";

import { Toaster, toast } from 'sonner';
import { getFontSize } from "../../utility/fontsize";


const Container = styled.div`
  background-image: url(${imageDB.DOWNLOADBG});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`

const MainLabel = styled.div`
  font-size: ${() => getFontSize(30)}px;
  color :#fff;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

`

const MainDesc = styled.div`
  font-size: ${() => getFontSize(60)}px;
  color :#fff;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-top:50px;

`

const SubLabel = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: Pretendard-Regular;
  color: #ffff;
  line-height: 1.8;
  margin-top: 20px;
  width: 100%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
`
const AppBtn = styled.div`

    height: 64px;
    border-radius: 10px;
    font-size: ${() => getFontSize(20)}px;
    margin: 0px auto;
    padding-left: 10px;
    width: 100%;
    border-radius: 4px;
    background: #131313;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction : column;
    border: none;
    font-size: ${() => getFontSize(18)}px;
    font-family: "Pretendard-SemiBold";
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

`
const AppBtn2 = styled.div`

    height: 64px;
    border-radius: 10px;
    font-size: ${() => getFontSize(20)}px;
    margin: 0px auto;
    padding-left: 10px;
    width: 100%;
    border-radius: 15px;
    background: #131313;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction : column;
    border: none;
    font-size: ${() => getFontSize(18)}px;
    font-family: "Pretendard-SemiBold";
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCAppDownloadcontainer =({containerStyle}) =>  {



  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);



  /**
   * 
  
   */
  useEffect(()=>{


  }, [])


    const _handleAndroid = () => {
      window.location.href = "https://play.google.com/store/apps/details?id=com.hongapp";
    }

    const _handleIphone = () => {

      window.open("https://apps.apple.com/kr/app/id6743770592", "_blank"); // iOS 설치

    }



  return (

    <Container>
   
      <div style={{ position: "absolute", top: 150, left: '15%' }}>
        <Row style={{ width: "100%"}}>
          <Column style={{ width: "100%", height: "100%", paddingTop: 20 }}>

            <MainLabel>
              <div>당신 근처의 가장 일잘하는</div>
            </MainLabel>

            <MainDesc>
              <div>동네일꾼</div>
              <div>구해줘 알바</div>
            </MainDesc>


            <SubLabel>
              <div>이제 집안일은 동네에서 맡기세요</div>
              <div>구해줘 알바가 가장 믿음직스러운 일꾼을 찾아 드립니다</div>
            </SubLabel>


            <SubLabel>
              <div>일일 다운로드 횟수 200% 증가세 일일 계약 횟수 500% 증가</div>
              <div>혁신적인 플랫폼으로 심부름앱의 지각변동</div>
            </SubLabel>

            <FlexstartRow style={{ margin: '40px auto 0px', width: "100%" }}>
              <div style={{ width: "40%" }}>
                <div style={{ position: "absolute" }}>
                  <img src={imageDB.playstore} style={{ position: "relative", width: "30px", top: "18px", left: "10px" }} />
                </div>
                <AppBtn onClick={_handleAndroid}>
                  <div style={{ fontSize: () => getFontSize(12) }}>{'GET IT ON'}</div>
                  <div>{'Google Play'}</div>
                </AppBtn>
              </div>
              <div style={{ width: "40%", marginLeft: 20 }}>
                <div style={{ position: "absolute" }}>
                  <img src={imageDB.appstore} style={{ position: "relative", width: "30px", top: "18px", left: "10px" }} />
                </div>
                <AppBtn onClick={_handleIphone}>
                  <div style={{ fontSize: () => getFontSize(12) }}>{'Download on the'}</div>
                  <div>{'App Store'}</div>

                </AppBtn>
              </div>
            </FlexstartRow>

          </Column>
          <Toaster position="bottom-left" richColors />
        </Row>
      </div>
    </Container>

  );

}

export default PCAppDownloadcontainer;

