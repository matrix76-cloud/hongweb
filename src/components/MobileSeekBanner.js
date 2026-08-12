import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../common/Row";
import { UserContext } from "../context/User";




const Container = styled.div` 
  width:90%;
  padding:10px 25px;
  background:${({backgroundcolor}) => backgroundcolor};
  margin-bottom:5px;
`
const style = {
  display: "flex"
};

const MainContent = styled.div`
  width: 80%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`
const MainContent2 = styled.div`
  width: 20%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`
const MainContentTxt1 = styled.div`
  line-height: 1.5;
  font-size: ${() => getFontSize(16)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-Bold;
  margin-top:${({top}) => top};
`
const MainContentTxt2 = styled.div`

  line-height: 1.5;
  font-size: ${() => getFontSize(14)}px;
  letter-spacing: -0.32px;
`
const Info = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;


`

const ButtonSt = styled.div`

  border: 1px solid #ededed;
  padding: 10px;
  background: ${({enable}) => enable == true ?('#ff7e19'):('#f6f6f6')};
  color: ${({enable}) => enable == true ?('#fff'):('#131313')};
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 100px;
`
const RegistButton = styled.div`
  height: 30px;
  width: 100%;
  border-radius: 100px;
  background: #ffffff;
  color: #131313;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(12)}px;
  padding: 0px 5px;
`


const MobileSeekBanner =({containerStyle,backgroundcolor,button=false,
  top='0px',
   main, sub1, sub2, image, imagewidth='100px', imageheight='100px'}) =>  {

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
  
  const _handleCommunity = () =>{

  }
  const _handlehong = () =>{
    navigate("/hong");
  }

 
  return (

    <Container backgroundcolor = {backgroundcolor} style={containerStyle}>

      <Row style={{width:"100%", margin:"0 auto"}}>
            <MainContent style={{justifyContent:"flex-start"}}>
              <MainContentTxt1 top={top}>{main}</MainContentTxt1>
              <Info>
                <MainContentTxt2>{sub1}</MainContentTxt2>
                <MainContentTxt2>{sub2}</MainContentTxt2>
              </Info>

              {
                button == true && <ButtonSt enable={true} onClick={_handleCommunity}>게시판 작성</ButtonSt>
              }
              
         
            </MainContent>

            <MainContent2>
              <img src={image} style={{width:imagewidth, height:imageheight}}/>
              <RegistButton onClick={_handlehong}>일꾼찾기</RegistButton>
            </MainContent2>
      </Row>
    </Container>
  );

}

export default MobileSeekBanner;

