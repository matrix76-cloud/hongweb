
import { Table } from "@mui/material";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column } from "../common/Column";
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
import { getFontSize } from '../utility/fontsize';

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


const MobileLifePerformanceEventView = ({ containerStyle }) => {

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

  const [search, setSearch] = useState('');
  const [show, setShow] = useState(true);
  const [searching, setSearching] = useState(true);
  const [displayitem, setDisplayitem] = useState({});

  const [popupstatus, setPopupstatus] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');
  const [festivalname, setFestivalname] = useState('');
  const [performanceeventpopup, setPerformanceeventpopup] = useState(false);
  const [popupitem, setPopupitem] = useState({});


  const [searchParams] = useSearchParams();
  const [performanceevent_id, setPerformanceevent_id] = useState(searchParams.get('id'));


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { };
  }, []);

  useEffect(() => {
    setSearching(searching);
    setDisplayitem(displayitem);
    setLatitude(latitude);
    setLongitude(longitudie);
    setFestivalname(festivalname);
    setPerformanceeventpopup(performanceeventpopup);
    setPopupitem(popupitem);
  }, [refresh])

  useEffect(() => {
    async function FetchData() {

      const PERFORMANCEEVENT_ID = performanceevent_id;

      const performanceitem = await ReadPerformanceEventBYPERFORMANCEEVENT_ID({ PERFORMANCEEVENT_ID });
      console.log("performanceitem", performanceitem);

      setDisplayitem(performanceitem);
      setSearching(false);
      setRefresh((refresh) => refresh + 1);
    }

    FetchData();
  }, [])



  const isPastDate = (datestartString, dateendString) => {

    if (dateendString == '' || datestartString == '' || datestartString == undefined || dateendString == undefined) {
      return;
    }

    const performancestartDate = parse(datestartString, "yyyyMMdd", new Date());
    const performancendeDate = parse(dateendString, "yyyyMMdd", new Date());
    const currentDate = new Date();


    if (currentDate.getTime() > performancestartDate.getTime() && currentDate.getTime() > performancendeDate.getTime()) {
      return true;
    } else {
      return false;
    }

  };

  const isRunningDate = (datestartString) => {

    if (datestartString == undefined || datestartString == '') {
      return false;
    }

    const performancestartDate = parse(datestartString, "yyyyMMdd", new Date());


    const currentDate = new Date();
    // `getTime()`을 사용하여 날짜를 밀리초로 변환 후 비교
    return currentDate.getTime() > performancestartDate.getTime();
  };


  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setRefresh((refresh) => refresh + 1);
  };

  const _handleMapview = (lat, long, festivalname) => {

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
    setFestivalname(festivalname);
    setRefresh((refresh) => refresh + 1);

  }



  return (

    <Container style={containerStyle}>




      {
        searching == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'} />)
          : (
            <Column style={{ marginTop: 10, width: "100%", margin: "0 auto", paddingTop: "40px" }}>


              <div style={{ overflowY: "hidden", width: "100%", margin: "0 auto", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                <BoxItem>

                  <Event_img>
                    <LazyImage src={"https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=" + displayitem.PERFORMANCEEVENTITEM.imgPath} containerStyle={{ width: "100%", borderRadius: 5, objectFit: "cover" }} />
                  </Event_img>



                  <ContentLayer>
                    <FlexstartRow>
                      {isRunningDate(displayitem.PERFORMANCEEVENTITEM.startDate) == true && <Tag>진행중</Tag>}


                    </FlexstartRow>


                    <FlexstartRow>
                      <Event_name>{displayitem.PERFORMANCEEVENTITEM.title}</Event_name>

                    </FlexstartRow>
                    <div>
                      {displayitem.PERFORMANCEEVENTITEM.tagName}
                    </div>
                    <div>
                      {displayitem.PERFORMANCEEVENTITEM.startDate} ~ {displayitem.PERFORMANCEEVENTITEM.endDate}
                    </div>

                    <Festival_region>
                      {displayitem.PERFORMANCEEVENTITEM.addr1}
                    </Festival_region>
                  </ContentLayer>


                </BoxItem>
              </div>

   
            </Column>)
      }
    </Container>
  );

}

export default MobileLifePerformanceEventView;

