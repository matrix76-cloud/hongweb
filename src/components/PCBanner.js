import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../common/Row";
import { UserContext } from "../context/User";
import { lifemenustore } from "../store/jotai";
import { useAtom } from "jotai";



const Container = styled.div` 
  width:100%;
  height:200px;
  background:${({backgroundcolor}) => backgroundcolor};
`
const style = {
  display: "flex"
};
  // width: 60%;
  // margin-top:40px;
const MainContent1 = styled.div`

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  white-space: pre-wrap;
  line-height:1.7;
`
const MainContent2 = styled.div`
  width: 40%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`

const MainContentTxt1 = styled.div`
  margin-top:20px;
  font-size: ${() => getFontSize(23)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-SemiBold;
`
const MainContentTxt2 = styled.div`

  font-size: ${() => getFontSize(18)}px;
  letter-spacing: -0.32px;
`

const MainContentTxt3 = styled.div`

  line-height: 1.5;
  font-size: ${() => getFontSize(16)}px;
  letter-spacing: -0.32px;

`


const Info = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;


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


const PCBanner =({containerStyle,backgroundcolor,button=false,type,
  top='80px',
   main1, main2, sub1, sub2,sub3 ='', image, imagewidth='200px', imageheight='250px'}) =>  {

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


  const [selectmenu] = useAtom(lifemenustore);
  const [menu, setMenu] = useAtom(lifemenustore);


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
  
  const _handleLife = () =>{
    setMenu(type);
  }

  useEffect(()=>{

    console.log("MATRIX LOG : useEffect : lifemenustore:", selectmenu)
  },[selectmenu])

 
  return (

    <Container backgroundcolor = {backgroundcolor} style={containerStyle}>

      <Row style={{width:"70%", margin:"20px auto 0px"}}>
            <MainContent1 style={{justifyContent:"flex-start"}}>
              <MainContentTxt1 top={top}>{main1}</MainContentTxt1>
              <MainContentTxt1 top={'0px'}>{main2}</MainContentTxt1>
              <Info>
                <MainContentTxt2>{sub1}</MainContentTxt2>
                <MainContentTxt2>{sub2}</MainContentTxt2>
                <MainContentTxt3>{sub3}</MainContentTxt3>
              </Info>

            </MainContent1>

            <MainContent2>
              <img src={image} style={{width:imagewidth}}/>
            </MainContent2>
      </Row>
    </Container>
  );

}

export default PCBanner;

