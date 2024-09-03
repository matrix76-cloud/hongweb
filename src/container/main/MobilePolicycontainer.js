
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


  const _handlePhone = () =>{
    navigate("/Mobilephone")
  }

 
  return (

    <Container style={containerStyle}>
      
      <MobileUseLaw/>
      <MobilePrivacyLaw/>
      <MobileGpsLaw/>

      <Column style={{width:"100%"}}>
        <SubText>이용약관, 개인정보 처리지침, 위치 서비스 이용약관에 대해</SubText>
        <Button containerStyle={{border: 'none', fontSize:16, margin: '0px auto 20px'}} onPress={_handlePhone} height={'44px'} width={'85%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} 
        text={'모두 동의합니다 '}/>
      </Column>



    </Container>
  );

}

export default MobilePolicycontainer;

