
import React, {Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../../common/Button";
import { Column } from "../../common/Column";
import { Row } from "../../common/Row";
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
import { LoadingSearchAnimationStyle } from "../../screen/css/common";
import LottieAnimation from "../../common/LottieAnimation";

import "../../screen/css/common.css"

const Container = styled.div`
  display : flex;
  flex-direction: column;
  align-items:center;
  width :95%;
  margin : 0 auto;
  background : #FFF;
  padding-top:70px;

`
const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 30px;
  font-family: 'Pretendard-SemiBold';
  font-size: 22px;

`
const style = {
  display: "flex"
};



const SubText = styled.div`
  padding-left: 18px;
  margin-top: 10px;
  font-family: 'Pretendard';
  line-height:1.8;
`
const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px'

}

const CodeInputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px',
  marginTop:"20px"

}
const ReqButton = styled.div`
  height: 44px;
  width: 90%;
  margin : 0 auto;
  border-radius: 4px;
  background: ${({enable}) => enable == true ? ('#FF7125') :('#dbdada')};
  color:  ${({enable}) => enable == true ? ('#fff') :('#999')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:"Pretendard-SemiBold";
  font-size: 18px;

`
/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobilePhonecontainer =({containerStyle}) =>  {



  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [phone, setPhone]= useState('');
  const [reqcode, setReqcode] = useState('');
  const [reqcodebtnenable, setReqcodebtnenable] = useState(false);

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [authstart, setAuthstart] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const [verifycodebtnenable, setVerifycodebtnenable] = useState(false);

  const varifyCoderef = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [registfail, setRegistfail] = useState(false);
  const [requestloading, setRequestloading] = useState(false);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setReqcodebtnenable(reqcodebtnenable);
    setVerifycodebtnenable(verifycodebtnenable);
    setReqcode(reqcode);
    setAuthstart(authstart);
    setRegistfail(registfail);
    setRequestloading(requestloading);
  },[refresh])

  /**
   * 
  
   */
  useEffect(()=>{


  }, [])

  const  _handleReqcode = async() => {
    if(!reqcodebtnenable){
      return;
    }

    setRequestloading(true);
    setRefresh((refresh) => refresh +1);

    const getRandom1 = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);
    console.log(getRandom1(1, 10));
    const getRandom2 = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);
    console.log(getRandom2(1, 10));
    const getRandom3 = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);
    console.log(getRandom3(1, 10));
    const getRandom4 = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);
    console.log(getRandom4(1, 10));
    let code = String(getRandom1(1, 10)) +String(getRandom2(1, 10)) + String(getRandom3(1, 10)) + String(getRandom4(1, 10));


    const jsonPayload = {
      receivenum: phone,
      authcode : code
    };


    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/smssend',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
    })
    .catch((error) => console.error('Error:', error));

    

    await sleep(1000);

    setRequestloading(false);
    setRefresh((refresh) => refresh +1);


    setReqcode(code);
    setAuthstart(true);


    // console.log("TCL: StartProcess -> code", code)
    setRefresh((refresh) => refresh +1);
  } 

  /**
   * TODO 인증번호가 틀리다면 처리예정
   * 인증번호가 같다면 
   * 1. 데이타 베이스에 들어가서 해당 전화번호를 뒤진다
   * 2. 해당 전화번호가 있다면 해당 전화 번호에 스토리지 정보를 설정하고 로컬에도 값을 설정해준다
   * 3. 해당 전화번호가 없다면 라이센스 페이지로 이동 한다
   * 
   */
  const _handleCheck = async() =>{


    if(reqcode != verificationCode ){
      setRegistfail(true);
      setRefresh((refresh) => refresh +1);
      return;
    }

    const PHONE = phone;
    const userdata = await readuserbyphone({PHONE});

    // console.log("TCL: _handleCheck -> userdata", userdata)

    user.phone = PHONE;
    dispatch(user);

    if(userdata == -1){
      navigate("/mobilepolicy");
    }else{
      
   
      const DEVICEID = userdata.USERINFO.deviceid;
      const TOKEN = user.token;
      const LATITUDE = user.latitude;
      const LONGITUDE = user.longitude;

      if(TOKEN != ''){
        const usertoken = await Update_usertoken({DEVICEID, TOKEN });
      }

      // new Promise(resolve => setTimeout(resolve, 1000));

      await sleep(1000);
      user.users_id = userdata.USERS_ID;
      user.nickname = userdata.USERINFO.nickname;
      user.deviceid = DEVICEID;
      user.userimg = userdata.USERINFO.userimg

      dispatch(user);

    


      localforage.setItem('userconfig', user)
      .then(function(value) {
        navigate("/mobilemain");
      })
      .catch(function(err) {
        console.error('데이터 저장 실패:', err);
      });



    }
   
  }

  useEffect(() => {
     
    const countdown = setInterval(() => {

        if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
        }
        if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
            clearInterval(countdown);

            setReqcode("");
            setRefresh((refresh) => refresh +1);
        } else {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
        }
        }
        
    }, 1000);

    return () => clearInterval(countdown);
  }, [minutes, seconds]);

 
  const scrollToInput = () => {
    
    // console.log("TCL: scrollToInput -> ", )
    // 요소를 화면 중앙에 위치시킴
    varifyCoderef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 추가적인 스크롤을 통해 요소를 화면 중앙보다 아래로 위치시킴
    setTimeout(() => {
        window.scrollBy(0, 50); // 스크롤을 50px 아래로 추가 이동
    }, 300); // smooth 스크롤의 애니메이션 시간이 약간의 지연을 줌  
  }

  const handleKeyDown = (event)=>{
    if (event.key === 'Enter') {
      _handleCheck();  // Enter 키가 눌렸을 때 클릭 효과를 트리거합니다.
    }
  }

  const handlePhoneKeyDown = (event)=>{
    if (event.key === 'Enter') {
      if(reqcodebtnenable){
        _handleReqcode();  // Enter 키가 눌렸을 때 클릭 효과를 트리거합니다.
      }
  
    }
  }

  const registfailcallback = () =>{
    setRegistfail(false);
    setRefresh((refresh) => refresh +1);
  }

  return (

    <>
   
          <Container style={containerStyle}>

           {
              registfail == true && <MobileWarningPopup callback={registfailcallback} content ={'잘못된 인증코드 입니다. 다시 시도해주세요'} />
           }

          {
              requestloading == true && 
              <LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loading}
                width={"50px"} height={'50px'}
              />

          }


            <Column>
              <Label>휴대폰 번호를 인증해주세요.</Label>
              <SubText>홍여사는 휴대폰 번호로 가입해요. 번호는 안전하게 보관 되며 어디에도 공개 되지 않습니다</SubText>
              <div style={{width:"90%", margin:"20px auto"}}>
                <input  style={Inputstyle} type="number" placeholder="휴대폰 번호를 입력해주세요"
                      value={phone}
                      onKeyDown={handlePhoneKeyDown} // Enter 키를 감지하는 이벤트
                      onChange={(e) => {
                      // console.log("TCL: MobilePhonecontainer -> e", e.target.value.length)

                      if(e.target.value.length == 11){
                        setReqcodebtnenable(true);
                        setRefresh((refresh) => refresh +1);
                      }
                        
                        setPhone(e.target.value);
                      }}
                  />
              </div>
              <ReqButton enable={reqcodebtnenable} onClick={_handleReqcode}>인증문자 받기 </ReqButton>

            </Column>
            {
              authstart == true &&
              <Fragment>
                <Column style={{width:"90%", margin:"10 auto"}}>
                  <input type="number"
                      ref = {varifyCoderef}
                      style={CodeInputstyle}
                      placeholder ={"인증번호"}
                      onFocus={scrollToInput}
                      onClick={scrollToInput}
                      value ={verificationCode}
                      onKeyDown={handleKeyDown} // Enter 키를 감지하는 이벤트
                      onChange = {e => {
                  
                          setVerificationCode(e.target.value);
                          if(e.target.value.length == 4){
                            setVerifycodebtnenable(true);
                            setRefresh((refresh) => refresh +1);
                          }else{
                            setVerifycodebtnenable(false);
                            setRefresh((refresh) => refresh +1);  
                          }

                          setRefresh(refresh => refresh + 1);
                      }}
                    />            
                </Column>
                <Column style={{marginTop:10, fontFamily:"Pretendard-Light"}}>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}후에 인증번호가 종료 됩니다
                </Column>

                <Column style={{width:"100%", marginTop:30}}>   
                <ReqButton enable={verifycodebtnenable} onClick={_handleCheck}>인증번호 확인 </ReqButton>
              </Column>   

              </Fragment>
            }
          </Container>
    </>

  );

}

export default MobilePhonecontainer;

