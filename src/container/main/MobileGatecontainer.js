
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../../common/Button";
import { Column } from "../../common/Column";
import { Row } from "../../common/Row";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";





const Container = styled.div`
  height: 100vh;
  display : flex;
  justify-content:center;
  flex-direction: column;
  alignItems:center;
  width :100%;
  background : #FFF;


`
const style = {
  display: "flex"
};

const MainLogoText = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 22px;
  color :#131313;
`

const SubText = styled.div`
  font-family: 'Pretendard-Light';
  font-size: 18px;
  color :#131313;
`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobileGatecontainer =({containerStyle}) =>  {

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





    async function FetchData(){




    } 

    FetchData();

  }, [])


  const _handleLogin = () =>{
    navigate("/Mobilepolicy");
  }

 
  return (

    <Container style={containerStyle}>
      <Row style={{height:'35%',}}>
        <img src={imageDB.logogif} style={{ marginTop:50, width:"130px", height:"130px"}} />
      </Row>
      
      <Row style={{height:'7%'}}>
        <MainLogoText>우리 동네의 홍여사</MainLogoText>
      </Row>


      <Column style={{height:'20%',justifyContent: 'flex-start'}}>
        <SubText>일잘하는 동네 일꾼</SubText>
        <SubText>홍여사를 만나서 집안일 도움 받으세요!</SubText>
      </Column>

      <Column style={{height:'30%', justifyContent:"center"}}>
      <Button containerStyle={{border: 'none', fontSize:16, margin: '0 auto'}} onPress={_handleLogin} height={'44px'} width={'85%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'시작하기'}/>
      </Column>
    </Container>
  );

}

export default MobileGatecontainer;

