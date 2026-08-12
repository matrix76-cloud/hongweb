import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";

import { DataContext } from "../../context/Data";



import { BetweenRow, FlexstartRow, Row } from "../../common/Row";

import { useSelector } from "react-redux";
import { Column, FlexstartColumn } from "../../common/Column";

import { CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";


import { Helmet } from "react-helmet";

import PCLifeSwipeex from "../../common/PCLifeSwipeex";
import { getFontSize } from "../../utility/fontsize";
const Container = styled.div`

  background-image: url(${imageDB.LEISURE});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`


const style = {
  display: "flex"
};


const LocationText  = styled.div`
  color : #131313;
  font-size: ${() => getFontSize(13)}px;
`
const SearchText = styled.div`
color : #131313;
font-family:'Pretendard-Light';
font-size: ${() => getFontSize(10)}px;
`



const MainLabel = styled.div`
  font-size: ${() => getFontSize(50)}px;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  

`
const SubLabel = styled.div`
  color: #fff;
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(25)}px;

`
const Label = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(45)}px;
  color :#fff;
  margin-top:10px;
  margin-bottom:10px;
`
const Desc = styled.div`
  color: #dedede;
  font-family: Pretendard-Regular;
  font-size: ${() => getFontSize(16)}px;
`

const CommunityTourItems =[
  {name : TOURISTMENU.TOURCOURSE ,img :imageDB.tourcourse, background:'#ffffffbf', desc:"구해줘 알바 AI가 추천드리는 전국관광코스 / 코스별 이동경로 제공"},
  {name : CONVENIENCEMENU.CONVENIENCECAMPING, img : imageDB.camping, background:'#ffffffbf', desc:"전국캠핑장 정보를 지도에서 한번에 확인 할수 있도록 제공됨 캠핑장 주변 날씨"},
  {name : TOURISTMENU.TOURFESTIVAL ,img :imageDB.tourfestival, background:'#ffffffbf', desc:"전국문화축제주관, 장소, 일시에 대한 정보를 한눈에 볼수 있도록 정리 "},
  {name : PERFORMANCEMENU.PERFORMANCEEVENT, img : imageDB.performance, background:'#ffffffbf', desc:"공연 문화예술 할인 예매 정보보고 공연을 쉽게 즐겨보세요"},
  {name : TOURISTMENU.TOURREGION ,img :imageDB.tour, background:'#ffffffbf', desc:"유명관광 명소의 날씨정보 시설정보 위치 정보를 제공해드립니다"},
  {name : LIFEMENU.PICTURE, img : imageDB.convenience, background:'#ffffffbf', desc:"관광지 사진정보 및 태그정보를 제공 해드립니다"},
  {name : PERFORMANCEMENU.PERFORMANCECINEMA, img : imageDB.schoolevent, background:'#ffffffbf', desc:"공공시설물 개방 정보를 보고 집주위의 무료로 이용할수 있는 시설물을 알려드려요"},
  {name : MEDICALMENU.MEDICALMEDICINE, img : imageDB.medical, background:'#ffffffbf', desc:"사랑하는 가족이 먹는 조제약 정보 효능 부터 부작용까지 모두 알려 드려요 이제는 알고 드세요"},
  {name : MEDICALMENU.FOODINFOMATION, img : imageDB.healthfood, background:'#ffffffbf', desc:"소중한 가족이 먹는 건강기능식품 어떤 효능과 부작용이 있을까여?"},
]

const CommunityItems =[


]

const CommunityTourItems2 =[

]


const MassBox = styled.div`

  background: ${({bgcolor}) => bgcolor};
  color :  #131313;
  font-size : 13px;
  font-family : 'Pretendard-Regular';
  font-weight:500;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width:30%;
  margin-right: 2px;
  z-index: 2;
  overflow-x: auto;
  flex: 0 0 auto;
  margin-left: 2%;
  margin-bottom: 5px;
  border-radius: 10px;
  padding :30px 10px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;




`


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const PCLeisurecontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);
  const [currentloading, setCurrentloading] = useState(true);

  const [menu, setMenu] = useState(value);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
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
  
  },[refresh])

  useEffect(()=>{
    setCurrentloading(currentloading);
    setMenu(value);
  },[value])

  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * ! 홍여사 요청 업무를 초기 로딩시에 구해온 데이타로 세팅 한다
   * ! 현재 페이지에서 리플레시 햇을때 서버에서 데이타를 구해 올수 있어야 한다 서비스 사용 : ReadWork()
   * 
   */
  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){
      setMenu(LIFEMENU.BOARD);

    } 
    FetchData();

  }, [])




  /**
   * useSelector menu 가 변경됨을 감지 함에 따라 호출되는  Hook 함수
   * 데이타를 서버로 부터 불러와서 FilterwokrItems 함수로 걸러진값을 workitems 에 설정 해준다
   */

  useEffect(()=>{
    async function FetchData(){

     setCurrentloading(false);
    }
    FetchData();

  },[])


  


  return (
    <>

      <Helmet>
        <title>여가생활</title>
        <meta name="description" content="구해줘 알바 여가생활, 전국 관광지도, 유적지, 캠핑장 위치, 의약품 상세정보, 요리레시피 집안생활의 모든것" />
        <link rel="canonical" href="https://honglady.com/PCLife" />
      </Helmet>

      <Container style={containerStyle}>


      <Row style={{marginTop:10,width:"100%",margin:"0 auto", display:"flex", alignItems:"flex-start", justifyContent:"flex-start"}}>
    
      <Column style={{flexWrap: "wrap", width:"100%", margin:"20px auto", justifyContent:"flex-start", alignItems:"flex-start"}}>
        <div style={{width:"100%"}}>
          <Column style={{width:"50%", margin:"300px auto 0px", lineHeight:1.4}}>
            <SubLabel>구해줘 알바가 드리는</SubLabel>
            <Label>여가 생활 정보</Label>
            <Desc>지금 바로 플레이스토어, 앱스토어에 다운 받고</Desc>
            <Desc>구해줘 알바가 드리는 여가 생활 정보 얻어 가세요</Desc>
          </Column>
              <Row style={{ width: "100%", position:"absolute", bottom:"10px" }}>
          <PCLifeSwipeex items ={CommunityTourItems}/>
          </Row>
        </div>

      </Column>

     

    </Row>


      </Container>
    


    </>


  );

}

export default PCLeisurecontainer;

