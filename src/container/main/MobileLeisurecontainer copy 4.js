import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";

import { DataContext } from "../../context/Data";


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { COLORS, CONFIGMOVE, FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column, FlexstartColumn } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";

import { useSleep } from "../../utility/common";
import { CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";
import LazyImage from "../../components/LazyImage";
import MobilePictureDisplayBoard from "../../components/MobilePictureDisplayBoard";
import ButtonEx from "../../common/ButtonEx";
import MobileLifeDisplayTourCourse from "../../components/MobileLifeDisplayTourCourse";
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../utility/fontsize";



const Container = styled.div`
`


const style = {
  display: "flex"
};




const FlexMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({ isGalaxyFlipUnfolded }) => isGalaxyFlipUnfolded === true ? "60%" : "90%"};

  scrollbar-width: none;
  margin:0px auto 10px;
  justify-content: start;
  gap: 5px; /* 요소들 사이에 일정 간격 추가 */

`



const Box = styled.div`

  background: ${({ bgcolor }) => bgcolor};
  color :  #131313;
  font-size : 13px;
  font-family : 'Pretendard-Regular';
  font-weight:500;
  border :  ${({ clickstatus }) => clickstatus == true ? ('1px solid #F9F9F9') : (null)};
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height:180px;
  width:47%;
  z-index: 2;
  overflow-x: auto;
  flex: 0 0 auto;

  margin-bottom: 5px;
  margin-top:10px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

`

const Guide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Pretendard-SemiBold;
  width: 100%;
  align-items: center;
  font-size: ${() => getFontSize(16)}px;
  margin: 0 auto;
`


const CourseLayout = styled.div`

    border-radius: 16px;
    background: linear-gradient(to bottom, #2253ff, #ededed);
    width: 48%;


`


const RegionLayout = styled.div`

    border-radius: 16px;
    background:#ededed;
    width: 48%;




`



const TourLayout = styled.div`
    height: 300px;
    border-radius: 16px;
    background: linear-gradient(to bottom, #e9edf5, #f6f8fc);
    width: 95%;
    margin : 0 auto;

`



const CommunityTourItems =[
  {name : TOURISTMENU.TOURCOURSE ,img :imageDB.tourcourse, background:'#f9f9f9', desc:"구해줘 홍여사 AI가 추천드리는 전국관광코스 / 코스별 이동경로 제공"},
  {name : TOURISTMENU.TOURREGION ,img :imageDB.tour, background:'#f9f9f9', desc:"한국 관광공사에 지정된 국내 아름다운 관광지에 대한 세부적인 정보 제공"},
  {name : LIFEMENU.PICTURE, img : imageDB.convenience, background:'#f9f9f9', desc:"한국의 특별한 순간, 사진에 담다 \n자연과 사람이 공존하는 이야기"},
]
const CommunityTourItems2 =[

  { name: TOURISTMENU.TOURFESTIVAL, img: imageDB.tourfestival, background: '#1099f6', desc: "문화축제정보를 한눈에 볼수 있도록 정리 ", descbg: '#37aeff' },
  { name: TOURISTMENU.TOUREVENT, img: imageDB.tourcinema, background: '#f87526', desc: "공연행사정보를 한눈에 볼수 있도록 정리 ", descbg: '#ffa36b' },
  { name: PERFORMANCEMENU.PERFORMANCECINEMA, img: imageDB.schoolevent, background: '#bbb9be', descbg: '#e3e2e5', desc: "공공시설정보를 한눈에 볼수 있도록 정리 " },
  { name: CONVENIENCEMENU.CONVENIENCECAMPING, img: imageDB.camping, background: '#faba52', desc: "전국캠핑장 정보를 한눈에 볼수있도록 제공", descbg: '#fcdca9' },
]



const BoxStyle = `
  .BoxHover:hover img {
    transform: scale(1.2);
    filter: brightness(1.2); /* 이미지 밝기를 20% 증가 */
  }
`

const ImageLayer = styled.div`
    background: ${({ bgcolor }) => bgcolor};
    border-radius: 100px;
    height: 70px;
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`

const LeisureBox1 = styled.div`

    width: 60%;
    height: 120px;
    background-color: rgb(108, 52, 243);
    margin: 10px 5px 5px 0px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${() => getFontSize(16)}px;
    border-radius:5px;


`
const LeisureBox2 = styled.div`
    width: 40%;
    padding: 30px 0px;
    background-color: #058404;
    margin: 10px 0px 5px 0px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: ${() => getFontSize(14)}px;
    border-radius:5px;

`

const LeisureBox3 = styled.div`
    width: 40%;
    padding: 30px 0px;
    background-color: #0089ff;
    margin: 0px 5px 10px 0px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: ${() => getFontSize(14)}px;
    border-radius:5px;

`


const LeisureBox4 = styled.div`

    width: 60%;
    height: 120px;
    background-color: #2b2bae;
    margin: 0px 0px 10px 0px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${() => getFontSize(16)}px;
    border-radius:5px;




`
const LeisureDesc = styled.div`
  font-size: ${() => getFontSize(14)}px;  /* 텍스트 크기를 약간 줄임 */
  color: #fff;  /* 배경색과 대비되는 밝은 색으로 변경 */
  line-height: 1.6;  /* 줄 간격을 넓혀 가독성 향상 */
  font-weight: 400;  /* 가독성을 위한 기본 글자 두께 */
  text-align: left;  /* 왼쪽 정렬 (정렬이 필요할 경우) */
  max-width: 85%;  /* 카드 내부에서 너무 길게 퍼지지 않도록 제한 */
  padding: 8px;  /* 내부 여백 추가로 텍스트가 너무 붙지 않게 조정 */
  word-break: keep-all;  /* 줄바꿈을 자연스럽게 조정 */

`
const LeisureTitle = styled.div`
  font-size: ${() => getFontSize(16)}px;  /* 텍스트 크기를 약간 줄임 */
  color: #fff;  /* 배경색과 대비되는 밝은 색으로 변경 */

`

const Contentstyle = `

/* 기본 레이아웃 */
.container {
  font-family: "Pretendard";
  background: #fefaf7;
  padding: 10px;
  max-width: 100%;
  margin: 0 auto;
}

/* 탭 버튼 */
.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.tab-button {
  padding: 10px 44px;
  border: 2px solid #f2d8c6;
  border-radius: 999px;
  background-color: transparent;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: #fff0e6;
  color: #d36100;
  font-weight: 600;
}

/* 섹션 제목 */
.section-title {
  font-size: ${() => getFontSize(20)}px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #111;
  text-align:center;
}

`
const SectionTitle = styled.div`

  font-family: 'Pretendard-SemiBold';
  letter-spacing: -0.5px;
  font-size: ${() => getFontSize(18)}px;
  font-weight: bold;
  margin-bottom: 18px;
  color: #111;
  text-align:center;
  margin : 40px 0px;

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

const MobileLeisurecontainer =({containerStyle}) =>  {
  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });
  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);
  const [menu, setMenu] = useState(LIFEMENU.TOUR);
  const scrollableRef = useRef(null);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(() => {
    // touchmove 이벤트 차단
    const handleTouchMove = (event) => {

      if (scrollableRef.current && scrollableRef.current.contains(event.target)) {
    
        return;
      }

      event.preventDefault();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setMenu(menu);

  },[refresh])

  /**

   */
  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){

      await useSleep(1000);
      setCurrentloading(false);
    } 
    FetchData();

  }, [])

  const _handlemenu= (menu)=>{

    
    setMenu(menu);

    navigate("/Mobileleisurecontent" ,{state :{name :menu}});
    setRefresh((refresh) => refresh +1);
  }


  return (
    <>

    {

      <Container style={containerStyle}>
  
        <Column style={{marginBottom:30}}>

            <div style={{padding:'10px 0px'}}>
       
            {/* <style>{Contentstyle}</style> */}
              <style>{BoxStyle}</style>
              <SectionTitle style={{
                fontSize: getFontSize(22),
                fontFamily: isIOS() ? 'Pretendard-SemiBold' : 'Pretendard-Bold',
              }}>행복한 여가생활을 위한 생활 팁</SectionTitle>

              <FlexMenu ref={scrollableRef} isGalaxyFlipUnfolded={isGalaxyFlipUnfolded}>
   
              <BetweenRow style={{width:"100%"}}>
                <CourseLayout>
                  {/* <Column style={{ fontSize: () => getFontSize(14), color: '#fff', marginTop:15 }}>
                    <div style={{ fontSize: () => getFontSize(16), color: "#fff", fontFamily: "Pretendard-SemiBold" }}>추천관광코스</div>

                  </Column> */}

                  
                  <Column style={{ width: "100%", margin : '10px auto' }}>
                      <img src={imageDB.convenience} loading="eager" style={{ width: 100, height: 120, objectFit: "contain" }} onClick={() => { _handlemenu(TOURISTMENU.TOURCOURSE) }} />
                  </Column>

                  <div style={{width:"100%", marginBottom:15}}>
                    {/* <MobileLifeDisplayTourCourse /> */}
                    <ButtonEx containerStyle={{ fontSize: getFontSize(16), marginTop: 15, height: "47px" }} onPress={() => { _handlemenu(TOURISTMENU.TOURCOURSE) }} width={'90'} radius={'4px'} bgcolor={'#3469f3'} color={'#fff'} text={'추천 관광코스'} />
                  </div>
                </CourseLayout>

                <RegionLayout>

               

                    <BetweenRow style={{ width: "65%", margin: "25px auto 0px" }}>
                      <img src={imageDB.region1} style={{ width: 40, height: 40, objectFit: "contain" }} />
                      <img src={imageDB.region2} style={{ width: 40, height: 40, objectFit: "contain" }} />
                    </BetweenRow>

                    <div style={{ height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img src={imageDB.region5} style={{ width: 60, height: 60, objectFit: "contain" }} />
                    </div>


                  <Column style={{ width: "100%", margin: "0px auto 15px" }}>
                    <ButtonEx containerStyle={{ fontSize: getFontSize(16), marginTop:0, height: "47px" }} onPress={() => { _handlemenu(TOURISTMENU.TOURFESTIVAL) }} width={'90'} radius={'4px'} bgcolor={'#3469f3'} color={'#fff'} text={'문화축제 정보'} />
                  </Column>
                </RegionLayout>
              </BetweenRow>

      



                <div style={{ width: "100%", margin: "15px auto 0px" }}>
                  <div style={{ backgroundColor: "#f0f0f0", width: "100%", borderRadius: 10 }}>
                    <Row style={{ color: "#131313", fontSize: () => getFontSize(16), paddingTop: 15, paddingBottom: 5, fontFamily:"Pretendard-SemiBold", letterSpacing:"-0.5px"}}>
                      <div>기타 서비스</div>
                    </Row>

                    <div style={{ padding: "0px 10px 10px 10px" }}>
                      <Row style={{ width: '100%' }}>
                        <LeisureBox1 onClick={() => { _handlemenu(TOURISTMENU.TOURREGION) }} >
                          <LeisureDesc>{'내주변 관광지를 지도기반으로 정리'}</LeisureDesc>
                          <div style={{ width: "35%", paddingRight: 10 }}>
                            <img src={imageDB.tourfestival} style={{ width: 50 }} />
                          </div>
                        </LeisureBox1>
                        <LeisureBox2 onClick={() => { _handlemenu(TOURISTMENU.TOUREVENT) }} >
                          <LeisureTitle>{'공연'}</LeisureTitle>
                          <LeisureDesc>{'공연행사정보'}</LeisureDesc>
                        </LeisureBox2>
                      </Row>

                      <Row style={{ width: '100%' }}>
                        <LeisureBox3 onClick={() => { _handlemenu(PERFORMANCEMENU.PERFORMANCECINEMA) }} >
                          <LeisureTitle>{'시설물'}</LeisureTitle>
                          <LeisureDesc>{'공공시설정보'}</LeisureDesc>
                        </LeisureBox3>
                        <LeisureBox4 onClick={() => { _handlemenu(CONVENIENCEMENU.CONVENIENCECAMPING) }} >

                          <LeisureDesc><div>캠핑장정보를 <br/>한눈에</div></LeisureDesc>
                          <div style={{ width: "35%", paddingRight: 10, marginLeft:-20 }}>
                            <img src={imageDB.camping} style={{ width: 60 }} />
                          </div>
                        </LeisureBox4>
                      </Row>



                    </div>
                  </div>
                </div>
                
                <Guide style={{ marginTop: 20, paddingBottom: 0, justifyContent: "space-between" }}>
                  <div style={{ fontSize: () => getFontSize(16), fontFamily: "Pretendard-SemiBold", letterSpacing: "-0.5px" }}>관광지 사진</div>
                  <div style={{ fontFamily: "Pretendard", fontSize: () => getFontSize(14), color: '#66686F' }} onClick={() => { _handlemenu(TOURISTMENU.TOURPICTURE) }}>더보기</div>
                </Guide> 

                <MobilePictureDisplayBoard />



  
              </FlexMenu>
            </div>



        
            <div style={{ height: 100 }} />

        


        </Column>

        {/* <MobileStoreInfo height={200} containerStyle={{marginBottom:50}} /> */}
      </Container>
    }


    </>


  );

}

export default MobileLeisurecontainer;

