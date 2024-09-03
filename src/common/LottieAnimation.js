import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { Player } from '@lottiefiles/react-lottie-player';



const Container = styled.div`
  zIndex:12;
  display:flex;
  justify-content:center;
`
const style = {
  display: "flex"
};





const LottieAnimation =({containerStyle,animationData, width='100px', height ='100px'}) =>  {


/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  

 
  return (

    <Container style={containerStyle}>
      <Player
        autoplay={true}
        loop
        src={animationData}
        style={{ height: height, width: width }}
      />

    </Container>
  );

}




export default LottieAnimation;

