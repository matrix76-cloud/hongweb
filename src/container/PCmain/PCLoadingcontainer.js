import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { ReadWork } from "../../service/WorkService";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";




const Container = styled.div`
  height: 100vh;
  display : flex;
  justify-content:center;
  alignItems:center;

`
const style = {
  display: "flex"
};


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCLoadingcontainer =({containerStyle}) =>  {

/** PC 웹 초기 구동시에 데이타를 로딩 하는 component
 * ① 상점정보를 불러온다
 * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{


  }, [])



  useEffect(()=>{

  },[refresh])

 
  return (

    <Container style={containerStyle}>
      <img src={imageDB.sample30} style={{width:600, height:600}} />
    </Container>
  );

}

export default PCLoadingcontainer;

