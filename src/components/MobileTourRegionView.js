
import { Table } from "@mui/material";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { sleep, useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";

import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import "../screen/css/common.css"
import { CreateFESTIVAL, ReadFESTITVAL, UpdateFESTIVAL } from "../service/FestivalService";
import MobileFestivalPopup from "../modal/MobileFestivalPopup";
import { CreatePerformanceEvent, ReadPerformanceEvent, ReadPerformanceEventBYPERFORMANCEEVENT_ID, UpdatePerformanceEvent } from "../service/PerformanceEventService";
import { parse } from "date-fns";
import LazyImage from "../common/LasyImage";
import KakaoShare from "./KakaoShare";
import { ReadTourRegion } from "../service/LifeService";

const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  overflow : auto;

`
const style = {
  display: "flex"
};






const Inputstyle = {

  background: '#FFF',
  borderRadius: '5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height: '40px',
  border: "4px solid #FF7125",


}


const SearchLayer = styled.div`
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
  padding: 20px 0px 20px;
  color: #333;
  line-height: 1.8;
  width:100%;
  font-family: "Pretendard-Light";
  margin: 0 auto;
  position : relative;
  display:flex;
  flex-direction: column;
  border-top: 1px solid #ededed;
  width:90%;



`

const LoadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position: "absolute"
}
const MapbtnStyle = {
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border: " 1px solid #c3c3c3",
  height: '38px',
  fontSize: '16px',
  fontFamily: 'Pretendard-SemiBold',
  width: '30%',
  margin: '20px auto 0px',
}

const Taglabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(14)}px;
  margin-right:10px;
  color :#131313;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: flex-start;
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
const Event_img = styled.div`
  position: relative;
  border-radius: 8px;
  width:100%;

`
const Event_name = styled.div`
    display: flex;
    color: #1A1A24;
    font-family:Pretendard-Bold;
    font-size: ${() => getFontSize(18)}px;
`
const Festival_region = styled.div`
    color: #666670;
    font-size: ${() => getFontSize(14)}px;
`
const ContentLayer = styled.div`
  font-size: ${() => getFontSize(14)}px;
  width: 90%;
  padding : 0px 8px;

`
const Tag = styled.div`
  background: #5f00ff;
  color: #fff;
  font-size: ${() => getFontSize(14)}px;
  padding: 0px 5px;
  font-family: 'Pretendard-SemiBold';
  border-radius: 5px;
  display:flex;
  justify-content:center;
  align-items:center;
  width:40px;
  margin-top:5px;

`
const Layer = styled.div`
  background: #fdc66878;
  z-index: 10;
  font-size: ${() => getFontSize(12)}px;
  width: 85%;
  left: 10px;
  color: #131313;
  padding: 10px;
  display: flex;
  flex-direction: row;
  margin: 10px auto;

`
const Header = styled.div`
    width: 100%;
    margin: 0px auto;
    padding-left: 15px;
    padding-top:15px;
    position: fixed;
    top: 0px;
    height: 40px;
    background: #fff;
    z-index: 5;
`

const detailmapstyle = {
  overflow: "hidden",
  width: '100%',
  height: '370px',
  marginTop: "10px"
};

const MainContent = styled.div`
  margin: unset;
  width: 100%;
  color: #1A1E28;
  font-family : Pretendard-SemiBold;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction : row;
  align-items:flex-start;
  font-size: ${() => getFontSize(20)}px;
 

`
const LabelText = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(16)}px;
  color: #1A1E28;
  margin-bottom: 10px;
`
const ContentText = styled.div`
  font-size: ${() => getFontSize(14)}px;
  font-family :Pretendard-Regular;
  color : #1A1E28;
  word-wrap: break-word; /* 단어가 길어도 줄바꿈 */
  overflow-wrap: break-word; /* 최신 표준 속성 */
`
const BasicLevel = 7;

const Line = styled.div`
  border-bottom : 1px solid #ededed;
  margin : 10px 0px;

`

const MobileTourRegionView = ({ containerStyle }) => {

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


  const [searching, setSearching] = useState(true);
  const [item, setItem] = useState({});


  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');


  const [searchParams] = useSearchParams();
  const [tourregionname, setTourregionname] = useState(searchParams.get('name'));


  async function DetailListmapDraw(latitude, longitude) {
    var mapContainer = document.getElementById('detailmap'), // 지도를 표시할 div 
      mapOption = {
        center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
        level: BasicLevel // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);


    var imageSrc = imageDB.movegps; // 마커 이미지의 URL
    var imageSize = new kakao.maps.Size(36, 36); // 마커 이미지의 크기
    var imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커의 좌표에 일치시킬 이미지 안의 좌표

    // MarkerImage 객체 생성
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);


    const marker = new kakao.maps.Marker({
      position: markerPosition, // 시작점에 마커 배치
      image: markerImage, //
      map,
    });

  }

  useEffect(() => {

  }, []);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { };
  }, []);

  useEffect(() => {
    setSearching(searching);
    setItem(item);
    setLatitude(latitude);
    setLongitude(longitudie);

  }, [refresh])

  useEffect(() => {
    async function FetchData() {

      const tourregionitem = await ReadTourRegion();
      const dataToSaveregion = JSON.parse(tourregionitem);
      data.tourregionitem = dataToSaveregion.response.body.items;

      console.log("FetchData", data.tourregionitem);

      const FindIndex = data.tourregionitem.findIndex(x => x.trrsrtNm == tourregionname);

      setItem(data.tourregionitem[FindIndex]);

      setSearching(false);
      setRefresh((refresh) => refresh + 1);

      await sleep(1000);
      DetailListmapDraw(data.tourregionitem[FindIndex].latitude, data.tourregionitem[FindIndex].longitude);

      setRefresh((refresh) => refresh + 1);


    }

    FetchData();
  }, [])






  return (

    <Container style={containerStyle}>

      {
        searching == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'} />)
          : (
            <FlexstartColumn >
              <BetweenRow style={{ width: '100%', margin: "10px auto 0px", alignItems: "flex-start" }}>

                <MainContent>{item.trrsrtNm}
                  <div style={{ color: "#96989C", fontSize: () => getFontSize(12) }}>{item.trrsrtSe}</div>
                </MainContent>
        
              </BetweenRow>

              <div style={{ padding: 20, width: "90%" }}>

                <FlexstartRow>

                  <LabelText>주소</LabelText>

                </FlexstartRow>
                <ContentText>{item.rdnmadr}</ContentText>
                <Line></Line>
                {
                  item.cnvnncFclty != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>공공편익</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.cnvnncFclty}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.stayngInfo != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>숙박시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.stayngInfo}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.mvmAmsmtFclty != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>오락시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.mvmAmsmtFclty}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.recrtClturFclty != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>문화시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.recrtClturFclty}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.hospitalityFclty != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>접객시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.hospitalityFclty}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.recrtClturFclty != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>문화시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.recrtClturFclty}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.sportFclty != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>스포츠시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.sportFclty}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.aceptncCo != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>문화시설</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.aceptncCo}평</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.prkplceCo != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>주차가능</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.prkplceCo}대</ContentText>
                    <Line></Line>
                  </>
                }

                {
                  item.trrsrtIntrcn != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>소개</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.trrsrtIntrcn}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.phoneNumber != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>전화번호</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.phoneNumber}</ContentText>
                    <Line></Line>
                  </>
                }
                {
                  item.institutionNm != '' &&
                  <>
                    <FlexstartRow>
                      {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                      <LabelText>관리기관</LabelText>

                    </FlexstartRow>
                    <ContentText>{item.institutionNm}</ContentText>
                    <Line></Line>
                  </>
                }


                <>
                  <FlexstartRow>
                    {/* <LableIconLayer>
                      <GrTip color={'#66686F'} size={14} />
                    </LableIconLayer> */}
                    <LabelText>위치정보</LabelText>

                  </FlexstartRow>


                  <div id="detailmap" className="Map" style={detailmapstyle}></div>

                  <Line></Line>
                </>




              </div>
            </FlexstartColumn>
          )
      }
    </Container>
  );

}

export default MobileTourRegionView;

