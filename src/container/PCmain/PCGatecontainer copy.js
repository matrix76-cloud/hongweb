import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
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
import "./PCmain.css";
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
import { getFontSize } from "../../utility/fontsize";

const Container = styled.div`


    display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

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

const  MatchingItem = styled.div`

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
  font-size: ${() => getFontSize(30)}px;
  color :#fff;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

`

const MainDesc = styled.div`
  font-size: ${() => getFontSize(60)}px;
  color :#fff;
  font-family: Pretendard-Bold;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-top:50px;

`

const SubLabel = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: Pretendard-Regular;
  color: #ffff;
  line-height: 1.8;
  margin-top: 20px;
  width: 100%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
`
const AppBtn = styled.div`

    height: 64px;
    border-radius: 10px;
    font-size: ${() => getFontSize(20)}px;
    margin: 0px auto;
    padding-left: 10px;
    width: 100%;
    border-radius: 4px;
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

const Section2Layer  = styled.div`
  background-image: url(${imageDB.SECTION02});
  background-size: cover;
  background-position: center; 
  height:1000px;
  width: 100%;

`
const Section2LabelLayer = styled.div`

    position: relative;
    top: 100px;
    left: 15%;

`

const Section2TextLayer= styled.div`

    position: relative;
    top: -120px;
    left: 55%;
`

const Section2Text = styled.div`
  font-family : Pretendard-Bold;
  color :#ffffff60;
  font-size: ${() => getFontSize(60)}px;

`

const Section21Text = styled.div`
  font-family : Pretendard-Bold;
  color :#ffffff;
  font-size: ${() => getFontSize(60)}px;

`

const Label2= styled.div`
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
  color: #000;
  font-size: ${() => getFontSize(35)}px;
  font-family : Pretendard-Bold;
  margin-top:10px;
`

const Label2Desc = styled.div`
  color: rgb(223 219 219);
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

const Section3Layer = styled.div`
  background-image: url(${imageDB.SECTION03});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`

const Section3LabelLayer = styled.div`

    position: relative;
    top: 50px;
    left: 15%;

`

const Section4LabelLayer = styled.div`

    position: relative;
    top: 250px;
    left: 30%;

`



const Section4Layer = styled.div`
  background-image: url(${imageDB.SECTION04});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`

const Section5Layer = styled.div`
  background-image: url(${imageDB.SECTION05});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`

const Label5 = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
`


const Label5Main = styled.div`
  color: #000;
  font-size: ${() => getFontSize(30)}px;
  font-family : Pretendard-Bold;
  margin-top:10px;
`


const Section5LabelLayer = styled.div`

  padding-top: 100px;
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
const Label6 = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
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
  background-image: url(${imageDB.SECTION07});
  background-size: cover;
  background-position: center; 
  height:100vh;
  width: 100%;

`

const Label7 = styled.div`
  color: #ff6625;
  font-size: ${() => getFontSize(18)}px;
`



const Label7Main = styled.div`
  color: #000;
  font-size: ${() => getFontSize(35)}px;
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
    left: 15%;

`

const Section8Layer = styled.div`
  background-image: url(${imageDB.SECTION08});
  background-size: cover;
  background-position: center; 
  width: 100%;
  height:100vh;
`

const Section8Label = styled.div`

    margin-top: 50px;
    color: #fff;
    font-size: ${() => getFontSize(30)}px;
    font-family : Pretendard-Bold;
`


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCGatecontainer =({containerStyle}) =>  {

/** PC 웹 초기 구동시에 데이타를 로딩 하는 component
 * ① 상점정보를 불러온다
 * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
 */

  const { dispatch, user } = useContext(UserContext);

  const { datadispatch, data} = useContext(DataContext);
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
    return () => {};
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
        <Container style={containerStyle}>
          <div style={{height:"760px", width:"100%"}}>
   
            <style>{VideoStyle}</style>
            {/* <div class="video-container">
              <video poster={imageDB.SECTION01} preload="metadata" autoPlay muted loop onCanPlay={handleCanPlay}>
                <source src={imageDB.introduce1} type="video/mp4" style={{opacity:0.5}} />
              </video> 
            </div> */}
      
            <div style={{ position: "absolute", top: 50, left:'15%' }}>
              <Row style={{ width: "100%", margin: "150px auto" }}>
                <Column style={{ width: "100%", height: "100%", paddingTop: 20 }}>

                  <MainLabel>
                    <div>당신 근처의 가장 일잘하는</div>
                  </MainLabel>
                
                  <MainDesc>
                    <div>동네일꾼</div>
                    <div>구해줘 알바</div>
                  </MainDesc>


                  <SubLabel>
                    <div>이제 집안일은 동네에서 맡기세요</div>
                  <div>구해줘 알바가 가장 믿음직스러운 일꾼을 찾아 드립니다</div>
                  </SubLabel>


                  <SubLabel>
                    <div>일일 다운로드 횟수 200% 증가세 일일 계약 횟수 500% 증가</div>
                    <div>혁신적인 플랫폼으로 심부름앱의 지각변동</div>
                  </SubLabel>

                  <FlexstartRow style={{ margin: '40px auto 0px', width: "100%" }}>
                  <div style={{ width: "40%" }} onClick={_handleAndroid}>
                      <div style={{ position: "absolute" }}>
                        <img src={imageDB.playstore} style={{ position: "relative", width: "30px", top: "18px", left: "10px" }} />
                      </div>
                    <AppBtn>
                      <div style={{fontSize: () => getFontSize(12)}}>{'GET IT ON'}</div>    
                      <div>{'Google Play'}</div>
                    </AppBtn>
                    </div>
                  <div style={{ width: "40%", marginLeft: 20 }} onClick={_handleIphone}>
                      <div style={{ position: "absolute" }}>
                        <img src={imageDB.appstore} style={{ position: "relative", width: "30px", top: "18px", left: "10px" }} />
                      </div>
                    <AppBtn>
                      <div style={{ fontSize: () => getFontSize(12) }}>{'Download on the'}</div>    
                      <div>{'App Store'}</div>    
                      
                   </AppBtn>
                    </div>
                  </FlexstartRow>

                </Column>

              </Row>
            </div>

        </div>
        
        <div style={{ width: "100%", height:1000}}>
      
          <Section2Layer>

            <Section2LabelLayer>
              <Label2>소개</Label2>
              <Label2Main>구해줘 알바</Label2Main>
              <Label2Desc>
                <div>믿음직한 사람과 실시간 견적 문의 쉬운 요청 구해줘 알바의 인증 과정을 거친 믿음직한 일꾼과</div>
                <div>실시간 채팅을 통해 계약서 작성 일 완료후 돈이 지급되는 ESCRO 시스템</div>
              </Label2Desc>

              <div class="video-subcontainer" style={{ marginLeft: '5%' }}>
                <video poster={imageDB.SECTION021} preload="metadata" autoPlay muted loop onCanPlay={handleCanPlay}>
                  <source src={imageDB.introduce2} type="video/mp4" />
                </video>
              </div>
            </Section2LabelLayer>


            {/* <Section2TextLayer>     
              <Section2Text>우리의</Section2Text>
              <Section2Text>든든한</Section2Text>
              <Section21Text>동네일꾼</Section21Text>
            </Section2TextLayer> */}
          </Section2Layer>

   
        </div>

        <div style={{ width: "100%" }}>
          <Section3Layer>

            <Section3LabelLayer>
            <Label3>간편한 등록 요청</Label3>
            <Label3Main>3단계만으로 10초만에 요청</Label3Main>
            <Label3Desc>
              <div>일감등록을 손쉽게 할수 있습니다</div>
            </Label3Desc>
              
            <img src={imageDB.SECTION031} style={{width:"60%", marginLeft:-80, marginTop:-30, height:900}} />

        

            </Section3LabelLayer>
          </Section3Layer>
        </div>
        <div style={{ width: "100%" }}>
          <Section4Layer>
            <Section4LabelLayer>
              <img src={imageDB.SECTION041} style={{ width: "35%" }} />
            </Section4LabelLayer>
          </Section4Layer>
        </div>

        <div style={{ width: "100%" }}>
          <Section5Layer>
            <Section5LabelLayer>
              <Label5>내 주변 일감 찾기</Label5>
              <Label5Main>내주변의 다양한 일감을</Label5Main>
              <Label5Main>바로 찾을 수 있어요</Label5Main>
            </Section5LabelLayer>

            <img src={imageDB.SECTION051} style={{ width: "100%" }} />
          </Section5Layer>
        </div>

        <div style={{ width: "100%" }}>
          <Section6Layer>
            <Section6LabelLayer>
              <Label6>실시간 매칭</Label6>
              <Label6Main>긴급한 당신을 위한</Label6Main>
              <Label6Main>실시간 매칭 시스템</Label6Main>
            </Section6LabelLayer>

            <Row>
              <img src={imageDB.SECTION061} style={{ width: "50%" }} />
            </Row>

    
          </Section6Layer>
        </div>

        <div style={{ width: "100%" }}>
          <Section7Layer>

            <Section7LabelLayer>
              <Label7>계약</Label7>
              <Label7Main>안전하고 쉬운 계약</Label7Main>
              <Label7Desc>
                <div>모든 거래는 채팅으로 복잡하지 않고 간결하고 안전하게 거래</div>
              </Label7Desc>

              <img src={imageDB.SECTION071} style={{ width: "60%", marginTop:-100 }} />
            </Section7LabelLayer>

            <div>
        
            </div>

          </Section7Layer>
        </div>

        <div style={{ width: "100%" }}>
          <Section8Layer>
            <Column style ={{height:"100%"}}>
              <div style={{background:"#fff",borderRadius:20}}>
                <img src={imageDB.logo} style={{ width: 100 }} />
      
              </div>
              <Section8Label>일감 구하기는 구해줘 알바에서 함께해요</Section8Label>

              
              <FlexstartRow style={{ margin: '40px auto 0px', width: "25%" }}>
                <div style={{ width: "45%" }} onClick={_handleAndroid}>
                  <div style={{ position: "absolute" }} >
                    <img src={imageDB.playstore} style={{ position: "relative", width: "30px", top: "18px", left: "10px" }} />
                  </div>
                  <AppBtn2>
                    <div style={{ fontSize: () => getFontSize(12) }}>{'GET IT ON'}</div>
                    <div>{'Google Play'}</div>
                  </AppBtn2>
                </div>
                <div style={{ width: "45%", marginLeft: 20 }} onClick={_handleIphone}>
                  <div style={{ position: "absolute" }}>
                    <img src={imageDB.appstore} style={{ position: "relative", width: "30px", top: "18px", left: "10px" }} />
                  </div>
                  <AppBtn2>
                    <div style={{ fontSize: () => getFontSize(12) }}>{'Download on the'}</div>
                    <div>{'App Store'}</div>

                  </AppBtn2>
                </div>
              </FlexstartRow>

            </Column>

          </Section8Layer>
        </div>




        </Container>
      <StoreInfo padding={12} />
      
      <Toaster position="bottom-left" richColors />
    </>

  );

}

export default PCGatecontainer;

