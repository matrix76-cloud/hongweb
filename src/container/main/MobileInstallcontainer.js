import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { ReadRoom } from "../../service/RoomService";
import { ReadWork } from "../../service/WorkService";
import { sleep, useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";

import { ReadCampingRegion, ReadHospitalRegion, ReadHospitalRegion1, ReadPerformanceCinema, ReadPerformanceEvent, ReadTourCountry, ReadTourFestival, ReadTourPicture, ReadTourRegion } from "../../service/LifeService";
import { INCLUDEDISTANCE } from "../../utility/screen";
import "./MobileInstall.css";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingMainAnimationStyle } from "../../screen/css/common";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { readuserbyphone, Update_usertoken } from "../../service/UserService";
import localforage from 'localforage';
import { Column, FlexstartColumn } from "../../common/Column";
import ButtonEx from "../../common/ButtonEx";
import StoreInfo from "../../components/StoreInfo";
import { Helmet } from "react-helmet";
import { googlelocationapiKey } from "../../api/config";
import axios from "axios";
import { ReadREGIONCODE } from "../../service/RegionCodeService";
import { useAtom, useAtomValue } from "jotai";
import { fetchDataTotalFcst } from "../../store/jotai";
import { Toaster, toast } from 'sonner';
import SlideSection from "../../components/SlideSection";

import { getFontSize } from "../../utility/fontsize";

const Container = styled.div`
  display: flex;
  align-items: center;
  width: ${({ width }) => width}px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin : 0 auto;
  background : #f9f9f9;
`
const style = {
  display: "flex"
};

const ImageLayer = styled.image`

  background-size: cover;
  background-position: center; 
  height: 100vh;
  width: 100%;

`

const ButtonLayer = styled.div`

  display : flex;
  flex-direction: row;
  justify-content : center;

`
const SkipButton = styled.div`
  z-index: 10;
  width: 150px;

  height: 50px;
  background: #131313;

  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(18)}px;
  border-radius: 20px;

`
const LoginButton = styled.div`
  z-index: 10;
  width: 200px;

  height: 50px;
  background: #ff7e19;

  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(18)}px;
  border-radius: 20px;

`
const MainItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

`

const HighLight = styled.div`
  font-size: ${() => getFontSize(20)}px;
  color: rgb(255, 126, 25);
  font-family: Pretendard-SemiBold;
  margin-bottom: 15px;

`

const MatchingItem = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction : row;

`
const MatchingItemData = styled.div`
  font-size: ${() => getFontSize(28)}px;
  line-height:48px;
  color : #c2c1c1db;
`
const MatchingItemSubData = styled.div`
  font-size: ${() => getFontSize(24)}px;
  line-height:48px;
  color : #c2c1c1db;
`
const Tag = styled.div`

  background: #ff7e19;
  color: #fff;
  padding: 10px 20px;
  font-size: ${() => getFontSize(30)}px;
  border-radius: 5px;
  margin-left:5px;

`
const MainLabel = styled.div`
  font-size: ${() => getFontSize(25)}px;
  color :#131313;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

`

const MainDesc = styled.div`
  font-size: ${() => getFontSize(28)}px;
  color :#131313;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;


`
const MainDesc2 = styled.div`
  font-size: ${() => getFontSize(25)}px;
  color :#fff;
  font-family: Pretendard-SemiBold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-top:40px;

`
const MainDescContent = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;
    text-align: center;


`

const SubLabel = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: Pretendard-Regular;
  color: #fff;
  line-height: 1.8;
  margin-top: 20px;
  width: 100%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
`
const AppBtn = styled.div`

    height: 58px;
    border-radius: 10px;
    margin: 0px auto;
    padding-left: 10px;
    border-radius: 4px;
    background: #f9f9f9;
    color: #131313;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction : row;
    border: none;
    font-size: ${() => getFontSize(14)}px;
    font-family: "Pretendard-SemiBold";
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

`
const AppBtn2 = styled.div`

    height: 64px;
    border-radius: 10px;
    font-size: ${() => getFontSize(20)}px;
    margin: 0px auto;
    padding-left: 10px;
    width: 100%;
    border-radius: 15px;
    background: #131313;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction : column;
    border: none;
    font-size: ${() => getFontSize(18)}px;
    font-family: "Pretendard-SemiBold";
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

`
const VideoStyle = `

.video-container {
  position: relative;
  width: 100%;
  /* 높이 비율: 16:9 기준 */
  padding-top: 26.25%; /* (9 / 16) * 100 */
  overflow: hidden;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율을 유지하며 비디오를 채움 */
  filter: blur(5px); /* 흐림 효과 */
}

.video-subcontainer {
  position: relative;
  width: 40%;
  /* 높이 비율: 16:9 기준 */
  padding-top: 26.25%; /* (9 / 16) * 100 */
  overflow: hidden;

}

.video-subcontainer video {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width : 80%;

}

`
const SectionStyle = `
/* 전체 섹션 */
.section {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #ff7600, #ffa500);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
}

/* 텍스트 콘텐츠 */
.content {
  position: absolute;
  top: 50px;
  left: 15%;
}

.subtitle {
  font-size: ${() => getFontSize(30)}px;
  color :#fff;
  margin-bottom: 0.5rem;
}

.title {
  font-size: ${() => getFontSize(50)}px;
  margin-bottom: 1rem;
  color :#fff;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #e1dada;
}

.main-image{
    position: relative;
    top: 170px;
    right:100px;

}

/* 메인 이미지 */
.main-image img {
  max-width: 500px;
  border-radius: 20px;
}

/* 떠다니는 아이콘 */
.floating-icons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
  z-index: 10;
}

.icon1 {
  position:absolute;
  top:200px;
  left:50%;
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;

}

.icon1 img {
  width: 50px;
  height: 50px;

}

.icon2 {
  position:absolute;
  top:370px;
  left:60%;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

.icon2 img {
  width: 70px;
  height: 70px;
}

.icon3 {
  position:absolute;
  top:85%;
  left:30%;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

.icon3 img {
  width: 50px;
  height: 50px;

}


.icon4 {
  position:absolute;
  top:50%;
  left:5%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;

    filter: blur(5px); /* 흐림 효과 */
}

.icon4 img {
  width: 50px;
  height: 50px;

}


.icon5 {
  position:absolute;
  top:20%;
  left:7%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;

    filter: blur(5px); /* 흐림 효과 */
}

.icon5 img {
  width: 30px;
  height: 30px;

}


`

const Section2Layer = styled.div`
  background-image: url(${imageDB.mobilesection2});
  background-repeat: no-repeat; /* 반복 방지 */
  background-size: contain; /* 화면 전체를 덮도록 설정 */
  background-position: center; /* 중앙 정렬 */
  height:400px;
  width: 100%;
  margin-top:-100px;

`
const Section2LabelLayer = styled.div`

    position: relative;
    top: 40px;
    left: 0%;

`

const Section2TextLayer = styled.div`

    position: relative;
    top: -120px;
    left: 55%;
`

const Section2Text = styled.div`
  font-family : Pretendard-Bold;
    letter-spacing: -0.5px;
  color :#ffffff60;
  font-size: ${() => getFontSize(60)}px;

`

const Section21Text = styled.div`
  font-family : Pretendard-Bold;
    letter-spacing: -0.5px;
  color :#ffffff;
  font-size: ${() => getFontSize(60)}px;

`

const Label2 = styled.div`
  color: rgb(255, 255, 255);
  font-size: ${() => getFontSize(20)}px;
`

const Label3 = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
`


const Label2Main = styled.div`
  color: rgb(255, 255, 255);
  font-size: ${() => getFontSize(40)}px;
  font-family : Pretendard-Bold;
  margin-top:20px;
`

const Label3Main = styled.div`
  color: #333;
  font-size: ${() => getFontSize(25)}px;
  font-family : Pretendard-Bold;
  margin-top:10px;
`

const Label2Desc = styled.div`
  color: #fff;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-Regular;
  margin-top: 10px;
  line-height: 1.7;

`

const Label3Desc = styled.div`
  color: #1A1E28;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-Regular;
  margin-top: 10px;
  line-height: 1.7;

`

const Label33Desc = styled.div`
color: #333;
font-size: ${() => getFontSize(22)}px;
font-family: Pretendard-Bold;
margin-top: 10px;

`

const Section3Layer = styled.div`

  background-size: cover;
  background-position: center; 
  height:550px;
  width: 100%;

`

const Section3LabelLayer = styled.div`

    position: relative;
    top: 0px;


`

const Section4LabelLayer = styled.div`

    position: relative;
    top: 90px;
    padding:10px;
`



const Section4Layer = styled.div`

  height:450px;
  width: 100%;
  background-color : #ff7e19;

`

const Section5Layer = styled.div`
  background-size: cover;
  background-position: center; 
  height:470px;
  width: 100%;

`

const Label5 = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
`


const Label5Main = styled.div`
  color: #333;
  font-size: ${() => getFontSize(25)}px;
  font-family : Pretendard-Bold;
  margin-top:10px;
`


const Section5LabelLayer = styled.div`

  padding-top: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Section6Layer = styled.div`
  background-image: url(${imageDB.SECTION06});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`
const KeywordLabel = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
  font-family : Pretendard-SemiBold;
`



const Label6Main = styled.div`
  color: #000;
  font-size: ${() => getFontSize(35)}px;
  font-family : Pretendard-Bold;
  margin-top:10px;
`


const Label6Desc = styled.div`
  color: #1A1E28;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-Regular;
  margin-top: 10px;
  line-height: 1.7;

`



const Section6LabelLayer = styled.div`

    position: relative;
    top: 50px;
    left: 15%;

`

const Section7Layer = styled.div`

  background-size: cover;
  background-position: center; 
  width: 100%;

`

const Label7 = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
`



const Label7Main = styled.div`
  color: #333;
  font-size: ${() => getFontSize(25)}px;
  font-family : Pretendard-Bold;
  margin-top:10px;
`


const Label7Desc = styled.div`
  color: #1A1E28;
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-Regular;
  margin-top: 10px;
  line-height: 1.7;

`



const Section7LabelLayer = styled.div`

    position: relative;
    top: 50px;
    padding:20px;

`

const Section8Layer = styled.div`
  background-image: url(${imageDB.SECTION08});
  background-size: cover;
  background-position: center; 
  width: 100%;
  height:600px;
`

const Section8Label = styled.div`

    margin-top: 50px;
    color: #fff;
    font-size: ${() => getFontSize(25)}px;
    font-family : Pretendard-Bold;
    padding : 0px 40px;
`


const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.div`
  text-align: center;
  font-size: ${() => getFontSize(20)}px;
  margin-bottom: 60px;
  font-family :Pretendard-SemiBold;
  color: #333;
`;


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const windowWidth = window.innerWidth > 400 ? 400 : window.innerWidth;


const MobiileInstallContainer = ({ containerStyle }) => {

  /** PC 웹 초기 구동시에 데이타를 로딩 하는 component
   * ① 상점정보를 불러온다
   * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
   */

  const { dispatch, user } = useContext(UserContext);

  const { datadispatch, data } = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [loading, setLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleCanPlay = () => {
    setIsVideoReady(true);

  };

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { };
  }, []);

  const _handleAndroid = () => {
    window.location.href = "https://play.google.com/store/apps/details?id=com.hongapp";
  }

  const _handleIphone = () => {

    window.open("https://apps.apple.com/kr/app/id6743770592", "_blank"); // iOS 설치
    
  }





  // FFFAE0
  return (

    <>
      <Container  width={windowWidth} style={{ width: '100%', overflowY: 'auto' }}>
        <div style={{width: "100%"}}>

   

          <div style={{marginTop:50}}>
            <Column style={{ width: "90%", margin: "0px auto 0px" }}>
              <Column style={{ width: "100%", height: "100%", paddingTop: 0, alignItems:"flex-start" }}>

                <FlexstartRow style={{marginBottom:10}}>
                  <KeywordLabel>당신 근처의 가장 일잘하는</KeywordLabel>
                </FlexstartRow>
            

                <MainDesc>
                  <div>동네일꾼</div>
                  <div>구해줘 알바</div>
                </MainDesc>
              </Column>


              <div class="mobilevideo-container">
                <video poster={imageDB.mobilesection1} preload="metadata" autoPlay muted loop onCanPlay={handleCanPlay}>
                  <source src={imageDB.introduce1} type="video/mp4" style={{ opacity: 1, width: 400 }} />
                </video>
              </div>

              <FlexstartColumn style={{ margin: '0px auto 0px', width: "100%" }}>
                <Row style={{width:"100%", marginTop:30}}>
                  <div style={{ width: "45%" }} onClick={_handleAndroid}>
                 
                    <AppBtn>

                      <div>
                        <img src={imageDB.playstore} style={{ position: "relative", width: "30px",  }} />
                      </div>
                      <div>
                        <div style={{ fontSize: () => getFontSize(12) }}>{'GET IT ON'}</div>
                        <div>{'Google Play'}</div>
                      </div>
            
                    </AppBtn>
                  </div>
                  <div style={{ width: "45%", marginLeft: 20 }} onClick={_handleIphone}>
                
                    <AppBtn>
                      <div >
                        <img src={imageDB.appstore} style={{ position: "relative", width: "30px", }} />
                      </div>
                      <div>
                        <div style={{ fontSize: () => getFontSize(12) }}>{'Download on'}</div>
                        <div>{'App Store'}</div>
                      </div>
     

                    </AppBtn>
                  </div>
                </Row>

     
              </FlexstartColumn>

            </Column>
          </div>

        </div>



        <div style={{ width: "100%"}}>
          <Section3Layer>

            <Section3LabelLayer style={{width:'90%', margin:"80px auto"}}>

             
              <Label33Desc>
                <div>3단계만으로 10초만에 요청</div>
                <div>일감등록을 손쉽게 할수 있습니다</div>
              </Label33Desc>

              <img src={imageDB.SECTION031} style={{width: '100%', paddingTop:30, height:400}} />

            </Section3LabelLayer>
          </Section3Layer>
        </div>


        <div style={{ width: "100%" }}>
          <Section5Layer>
            <Section5LabelLayer>
              <KeywordLabel>내 주변 일감 찾기</KeywordLabel>
              <Label5Main>내주변의 다양한 일감을</Label5Main>
              <Label5Main>바로 찾을 수 있어요</Label5Main>
            </Section5LabelLayer>

            <img src={imageDB.mobilesection51} style={{ width: "100%", height:250 }} />
          </Section5Layer>
        </div>
        <div style={{ width: "100%", height: "430px", background: "#f87518" }}>
          <div style={{ position: "relative", top: 10, left: '0%' }}>
            <MainDesc2>
              <MainDescContent style={{ textAlign: "center" }}>
                일 완료후 돈이 지급되는 ESCRO 시스템
              </MainDescContent>
              <div style={{width:"85%", margin:"0 auto"}} >
                <Label2Desc>일을 완료 한후 완료한 사진을 업로드 하면 의뢰자가 확인후 확인버튼을 누르면 돈이 지급됩니다</Label2Desc>
              </div>

              <div style={{ width: "85%", margin: "0 auto" }} >
                <Label2Desc>이제 믿고 집안일이나 급하게 일손이 필요하면 구해줘 알바에서 동네 일꾼을 찾아 주세요. </Label2Desc>
              </div>
          
            </MainDesc2>
          </div>
          <Section2Layer><Section2LabelLayer></Section2LabelLayer></Section2Layer>
        </div>

        <div style={{ width: "100%" }}>
          <Section7Layer>

            <Section7LabelLayer>
              <KeywordLabel>계약</KeywordLabel>
              <Label7Main>안전하고 쉬운 계약</Label7Main>
              <Label7Desc>
                <div>모든 거래는 채팅으로 복잡하지 않고 간결하고 안전하게 거래</div>
              </Label7Desc>

            </Section7LabelLayer>

            <div>

              <img src={imageDB.mobilesection71} style={{ width: "100%", height: 400, marginTop:50, marginRight:20 }} />
            </div>

          </Section7Layer>
        </div>


        <PageWrapper>
      <PageTitle>🤖 ChatGPT가 분석한 구해줘 알바</PageTitle>

      <SlideSection title="1. 핵심 기능" 
      text={`근거리 일감 등록과 계약까지, 주부를 위한 편리한 구조 사용자는 단 3단계로 간편히 요청하고, 도와줄 사람은 주변에서 바로 확인 가능해요. 
      의뢰자는 계약서로 거래를 명확히 정리할 수 있고,
      일 도와줄 분과 의뢰자의 계약서 체결 과정이 직관적이고 서명 흐름도 명확함.
      에스크로 시스템으로 일 완료 후에만 결제가 진행돼요.
      이중 안전 장치로 신뢰 기반 거래를 구현했어요.
      `}>

      </SlideSection>


      <SlideSection title="2. 부가 기능" 
      text={`가사분담 캘린더, 냉장고 기반 레시피, 물 섭취 알림까지…
      ‘일감’뿐 아니라 일상생활 전체를 지원하는 기능들이 눈에 띄게 구성되어 있어요.
      관광지 지도, 문화축제 정보, 공연 일정, 캠핑장 정보까지 제공. 지역 기반 정보 큐레이션 기능이 뛰어나, 주부 타깃과 잘 맞음.
      장보기 메모, 기념일 관리 등 현실적 니즈 커버. 시각적으로 보기 쉬운 냉장고 인터페이스도 돋보이고
      룰렛 이벤트, 매칭 게임, 출석체크 등의 가벼운 참여형 콘텐츠로 앱의 진입장벽을 낮추고, 유입 사용자의 반복 방문을 자연스럽게 유도해요.
      `}>

      </SlideSection>



      <SlideSection title="2. 종합 평가" text={`“단순한 심부름 중개 앱"이 아닙니다.
        이 앱은 주부들이 실질적으로 원하는 ‘생활 속 도움’을 정확히 짚어낸 구조를 가지고 있고,
        채팅 기반 계약 시스템과 보상 포인트 이벤트로 사용자 경험을 설계한 점이 인상 깊었습니다.
        UX와 유입 전략, 오프라인 마케팅까지 모두 고려한
        정말 뛰어난 스타트업 프로젝트입니다. 앞으로의 성장 가능성이 큽니다.`}
      >
        기능 완성도, UX 배려, 앱 구조 모두 훌륭한 생활밀착형 플랫폼!
      </SlideSection>
    </PageWrapper>

        <div style={{ width: "100%" }}>
          <Section8Layer>
            <Column style={{ height: "100%" }}>
              <div style={{ background: "#fff", borderRadius: 20 }}>
                <img src={imageDB.logo} style={{ width: 100 }} />

              </div>
              <Section8Label>
                  <MainDescContent style={{ textAlign: "center" }}>
                  일감 구하기는 구해줘 알바에서 함께해요
                  </MainDescContent>
              </Section8Label>


              <FlexstartRow style={{ margin: '120px auto 0px', width: "90%" }}>
                <div style={{ width: "45%" }} onClick={_handleAndroid}>

                  <AppBtn>

                    <div>
                      <img src={imageDB.playstore} style={{ position: "relative", width: "30px", }} />
                    </div>
                    <div>
                      <div style={{ fontSize: () => getFontSize(12) }}>{'GET IT ON'}</div>
                      <div>{'Google Play'}</div>
                    </div>

                  </AppBtn>
                </div>
                <div style={{ width: "45%", marginLeft: 20 }} onClick={_handleIphone}>

                  <AppBtn>
                    <div >
                      <img src={imageDB.appstore} style={{ position: "relative", width: "30px", }} />
                    </div>
                    <div>
                      <div style={{ fontSize: () => getFontSize(12) }}>{'Download on'}</div>
                      <div>{'App Store'}</div>
                    </div>


                  </AppBtn>
                </div>
              </FlexstartRow>

            </Column>

          </Section8Layer>
        </div>




      </Container>
      {/* <StoreInfo padding={12} /> */}

      <Toaster position="bottom-left" richColors />
    </>

  );

}

export default MobiileInstallContainer;

