import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../common/Row";
import { UserContext } from "../context/User";
import { CONFIGMOVE } from "../utility/screen";




const Container = styled.div` 
  width:100%;
  padding:25px 15px;
  background:${({backgroundcolor}) => backgroundcolor};
`
const style = {
  display: "flex"
};

const MainContent = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left:20px;
  flex-direction: column;
`
const MainContent2 = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`

const MainContent3 = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`
const MainContentTxt1 = styled.div`
  line-height: 1.5;
  font-size: ${() => getFontSize(18)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-Bold;
  margin-top:${({top}) => top};
`
const MainContentTxt2 = styled.div`

  line-height: 1.5;
  font-size: ${() => getFontSize(16)}px;
  letter-spacing: -0.32px;
`
const Info = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top:10px;


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
  height: 47px;
  width: 50%;
  border-radius: 10px;
  background: #66686F;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(16)}px;
  font-family:Pretendard-SemiBold;
  margin-top: 0px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */
  &:active {
    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }
`

const RegistButton2 = styled.div`
  height: 47px;
  width: 60%;
  border-radius: 10px;
  background: #ececec;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(16)}px;
  font-family:Pretendard-SemiBold;
  margin-top: 0px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */
  &:active {
    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }
`



const MobileRegistBanner =({containerStyle,backgroundcolor,button=false,buttonType="1",
  top='0px',
   main, sub1, sub2, image, imagewidth='100px', imageheight='60px'}) =>  {

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

    if(user.worker == true){
      navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.WORKERADJUSTINFO, TYPE: "" } });
    } else {
      navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.WORKERINFO, TYPE: "" } });
    }


  }

  const _handlehongSeek = () =>{
    navigate("/hong");
    
  }
 
  return (

    <Container backgroundcolor = {backgroundcolor} style={containerStyle}>

      <Row style={{width:"100%", margin:"0 auto", padding:"10px 0px",justifyContent:"flex-start"}}>
            <MainContent style={{justifyContent:"flex-start"}}>
              <MainContentTxt1 top={top}>{main}</MainContentTxt1>
              <Info>
                <MainContentTxt2>{sub1}</MainContentTxt2>
                <MainContentTxt2>{sub2}</MainContentTxt2>


              </Info>
    
  

            </MainContent>


      </Row>

      <MainContent2>
              {
                buttonType == 1 && <RegistButton onClick={_handlehong}>일꾼 등록하러 가기</RegistButton>
              }
       
              
              {
                buttonType == 3 && <RegistButton2 onClick={_handlehongSeek}>일꾼 찾으러 가기</RegistButton2>
              }
            </MainContent2>

            <MainContent3>
       
              {
                buttonType == 2 && <RegistButton onClick={_handlehong}>안전 봉인지 신청하기</RegistButton>
              }
        
            </MainContent3>
    </Container>
  );

}

export default MobileRegistBanner;

