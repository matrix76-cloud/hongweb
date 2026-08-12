

import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";

import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";

import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LIFEMENU } from "../utility/life";

import "./input.css"

import { lifemenustore } from "../store/jotai";
import { useAtom } from "jotai";
import PCLifeAI from "./PCLifeAI";
import PCLifeFreezeBoard from "./PCLifeFreezeBoard";
import PCLifeWork from "./PCLifeWork";

import PCRecipeBoard from "./PCRecipeBoard";
import { Row } from "../common/Row";


const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`

  margin : 0px auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  width: 100%;



`
const style = {
  display: "flex"
};






const Inputstyle ={

  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '20px',
  border : "1px solid #FF7125",


}


const  SearchLayer = styled.div`
  width: 90%;
  margin : 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  

`

const BoxItem = styled.div`
  padding: 0px 0px 30px;
  margin-bottom: 30px;
  color: #333;
  line-height: 1.8;
  font-family: "Pretendard-Regular";
  width: 30%;


`
const BoxLabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(16)}px;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  width:100%;


`

const BoxContent = styled.div`
  font-family: "Pretendard-Regular";
  font-size: ${() => getFontSize(14)}px;

`
const BoxWrite = styled.div`
  display : flex;
  flex-direction : row;
  justify-content: flex-start;
  align-items: center;
  width : 100%;
  font-size :14px;
`

const BoxImage = styled.div`
  margin-top:5px;
`

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}

const Taglabel = styled.div`
  font-family: "Pretendard";
  font-size: ${() => getFontSize(12)}px;
  margin-right:10px;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: center;
  background-color:#FFF5F5;
  color :#FF2121;
  border-radius: 5px;

`

const TagData = styled.div`
  font-family: "Pretendard-Light";
  font-size: ${() => getFontSize(14)}px;

  color :#131313;
`
const Item = styled.div`
  margin: 5px 0px;
  display:flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items:center;
`
const TagButton = styled.div`
    padding: 10px 0px;
    color: #131313;
    margin: 5px 0px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding-left:5px;
    width:600px;
`
const EventButton = styled.div`
    padding: 10px 0px;
    color: #131313;
    margin: 5px 0px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding-left:5px;
    width:600px;
    background: #ededed;
    display: flex;
    justify-content: center;
`

const MainContent = styled.div`
  width: 50%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const MainContentTxt1 = styled.div`
  line-height: 1.5;
  font-size: ${() => getFontSize(34)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-Bold;
`
const MainContentTxt2 = styled.div`

  line-height: 1.5;
  font-size: ${() => getFontSize(22)}px;
  letter-spacing: -0.32px;
`
const ItemLabel = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: ${() => getFontSize(20)}px;
  margin: 10px 0px;

`
const Line = styled.div`
  height: 1px;
  margin: 20px 0px;
  background: #ededed;
  width: 80%;

`
const InputStyle ={
  display: "flex",
  justifycontent: "flex-start",
  height: "20px"
}

const BannerItems =[
  {type:LIFEMENU.AI,image : imageDB.teacher, main1:"AI 도우미", main2:"AI로 물어보고 카테고리를 만들어 ", main3:"나만의 지식창고 생성", color:"#f7f1eb"},
  {type:LIFEMENU.BOARD,image : imageDB.freeze, main1:"나의 냉장고", main2:"냉장고를 3D로 구현", main3:"식재료 유효기간이 다가오면 알람과 레시피 추천", color:"#f7f1eb"},
  {type:LIFEMENU.WORK,image : imageDB.house, main1:"가사분담 서비스", main2:"독박 가사는 이제 끝!", main3:"모든 가사는 가족과 함께 가사 분담 서비스", color:"#f7f1eb"},
  {type:LIFEMENU.CLIMATE,image : imageDB.littlecloud, main1:"날씨정보", main2:"일일 날씨 및 주간 날씨  ", main3:"현재 기온, 습도, 하늘상태등 실시간 정보를 제공", color:"#ffe2d2"},
  {type:LIFEMENU.RECIPE,image : imageDB.recipe, main1:"요리레시피", main2:"매일매일 제공되는 추천레시피", main3:"조리법, 식재료명,식재료 수량 및 단위를 제공",color:"#ffe2d2"},
  // {type:MEDICALMENU.MEDICALMEDICINE,image : imageDB.medical, main1:"의약품 정보", main2:"업체명, 제품명, 효능, 사용법, 주의사항,부작용, 보관법 등 정보 조회",color:"#ffe2d2"},
  // {type:MEDICALMENU.FOODINFOMATION,image : imageDB.healthfood, main1:"건강기능 식품정보", main2:"업체명, 제품명, 사용법,섭취량,섭취방법,보존 및 유통기한 등 정보 조회",color:"#ffe2d2"},

]

const PCLifeBoard =({containerStyle, TYPE = LIFEMENU.AI}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [menu, setMenu] = useAtom(lifemenustore);
  const [selectmenu] = useAtom(lifemenustore);


  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

    setMenu(LIFEMENU.AI);

    setLoading(loading);


  },[refresh])



  useEffect(()=>{

  }, [])





  useEffect(()=>{

    console.log("MATRIX LOG : useEffect : lifemenustore: TYPE", TYPE)
  },[selectmenu])


  return (
    <>


      <Container style={containerStyle}>     
      <Row style={{marginTop:10,width:"100%",margin:"0 auto", display:"flex", alignItems:"flex-start", justifyContent:"flex-start"}}>

        <Column style={{width:"100%"}}> 
          {TYPE == LIFEMENU.AI && <PCLifeAI/>}
          {TYPE == LIFEMENU.BOARD && <PCLifeFreezeBoard/>}
          {TYPE == LIFEMENU.WORK && <PCLifeWork/>}
          {TYPE == LIFEMENU.RECIPE && <PCRecipeBoard/>}
        </Column>
   
      </Row>
      </Container>
    </>
  );
}

export default PCLifeBoard;

