
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { v4 as uuidv4 } from 'uuid';
import { createuser, Create_userdevice, Update_userdevice } from "../../service/UserService";
import { useSleep } from "../../utility/common";
import localforage from 'localforage';
import { CountryAddress } from "../../utility/region";
import { _handleCreateName } from "../../utility/data";
import { PROFILEIMAGE } from "../../utility/screen";




const Container = styled.div`
  display : flex;
  flex-direction: column;
  align-items:center;
  width :100%;
  background : #FFF;


`
const style = {
  display: "flex"
};



const SubText = styled.div`
  width: 80%;
  margin: 14px;
  font-size: 12px;
`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobilePolicycontainer =({containerStyle}) =>  {

/** PC 웹 초기 구동시에 데이타를 로딩 하는 component
 * ① 상점정보를 불러온다
 * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [switchscreen, setSwitchscreen]= useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{

  },[refresh])

  /**
   * 
  
   */
  useEffect(()=>{

    async function StartProcess(){

      setRefresh((refresh) => refresh +1);

    } 



    async function FetchData(){


      StartProcess();

    } 

    FetchData();

  }, [])


  /**
   * Mobilemain으로 이동하기전에 값을 세팅 해준다
   * USER를 생성하고 userContext 값에 최종적으로 설정된다
   * ! 최종적으로 userContext 값 설정
   * ! 현재 위치에 맞는 일감 정보와 공간 대여 정보를 가져 와서 DataContext에 설정해준다
   * ! userContext 와 데이타베이스 그리고 설정 정보에 최신정보를 업데이트 해준다
   * ! userContext에 이미 구한 전화번호등 기타 정보를 세팅 하기 위해 데이타 베이스관련작업을 먼저 한다
   * ! userContext 
   *   1) latitude
   *   2) longidue
   *   3) address 기타 정보
   *   4) phone, nickname, deiviceid, users_id
   */
   
  const _handleMain = async() =>{
    console.log("TCL: _handleMain -> _handleMain")
    
    let uniqueId = uuidv4();
    let nickname = _handleCreateName(CountryAddress(user.address_name));
    const USERINFO={
      deviceid : uniqueId,
      token : user.token,
      phone : user.phone,
      latitude : user.latitude,
      longitude : user.longitude,
      address_name : user.address_name,
      nickname : nickname,
      userimg : PROFILEIMAGE,

    }
    const DEVICEID = uniqueId;
    const TOKEN = user.token;
    const users_id = await createuser({USERINFO, DEVICEID, TOKEN});


    user.users_id = users_id;
    user.deviceid = uniqueId;

    user.nickname =  nickname;
    user.userimg = PROFILEIMAGE;
    dispatch(user);

    localforage.setItem('userconfig', user)
    .then(function(value) {
      console.log("TCL: userconfig save", value)

    })
    .catch(function(err) {
      console.error('TCL : userconfig 데이터 저장 실패:', err);
    });

    dispatch(user);


    navigate("/Mobilemain");
  }

 
  return (

    <Container style={containerStyle}>
      
      <MobileUseLaw/>
      <MobilePrivacyLaw/>
      <MobileGpsLaw/>

      <Column style={{width:"100%"}}>
        <SubText>이용약관, 개인정보 처리지침, 위치 서비스 이용약관에 대해</SubText>
        <Button containerStyle={{border: 'none', fontSize:16, margin: '0px auto 20px'}} onPress={_handleMain} height={'44px'} width={'85%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} 
        text={'모두 동의합니다 '}/>
      </Column>



    </Container>
  );

}

export default MobilePolicycontainer;

