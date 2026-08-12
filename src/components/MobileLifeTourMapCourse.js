
import { setRef, Table } from "@mui/material";
import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import "../screen/css/common.css"
import { FaArrowDownLong } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import "./mobile.css";
import { ReadTOURCOURSE, ReadTOURCOURSECODE } from "../service/TourCourseService";
import { IoFlagSharp } from "react-icons/io5";
import { TOURISTMENU } from "../utility/life";
import { getFontSize } from "../utility/fontsize";




const Container = styled.div`

  margin : 0px auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  overflow : auto;
  background-color :#f9f9f9;

`
const style = {
  display: "flex"
};






const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  top: '10%',
  width:'100%',
};

const FilterEx = styled.div`
    position: fixed;
    width: 30%;
    height: 50px;
    z-index: 10;
    bottom: 30px;
    right :20px;


`

const ViewBtn = styled.div`

    margin: 20px auto 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    color: #fff;
    height: 38px;
    font-size: ${() => getFontSize(14)}px;
    font-family: Pretendard-SemiBold;
    width: 100%;
    background : #000000ab;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */


`



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const BasicLevel =12;


const MobileLifeTourMapCourse =memo(({containerStyle}) =>  {

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
  const [refresh, setRefresh] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [courseitems, setCourseitems] = useState([]);
  const [codeitems, setCodeitems] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [curMap, setCurMap] = useState({});




  const _handleControlTrace = (name, item) =>{

    navigate("/Mobiletourcourseanalyze" ,{state :{name :name, COURSEITEM : item}});
  }

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setLoading(loading);
    setCourseitems(courseitems);
    setCodeitems(codeitems);


  }, [refresh])

  


  async function FetchData(){

    const codeitemsTmp = await ReadTOURCOURSECODE({});


    setCodeitems(codeitemsTmp[0].TOURCOURSECODEITEM);

    const itemsTmp = await ReadTOURCOURSE({});

    const groupedItemsTmp = itemsTmp[0].TOURCOURSEITEM.reduce((result, item) => {
   	
      // item.category 값이 이미 존재하는지 확인
      const key = item["코스 아이디"];
      if (!result[key]) {
        result[key] = []; // category 값이 없으면 배열 초기화
      }

      const FindIndex = codeitemsTmp[0].TOURCOURSECODEITEM.findIndex(x=>x["코스ID"] == item["코스 아이디"]);
      item["코스명"] = codeitemsTmp[0].TOURCOURSECODEITEM[FindIndex]["코스명"];
      result[key].push(item); // 해당 category에 item 추가
      return result;
    }, {});
    


    const keysWithSizes = Object.keys(groupedItemsTmp).map((key) => ({
      key,
      size: groupedItemsTmp[key].length,
      items: groupedItemsTmp[key].sort((a, b) => a["코스순서"] - b["코스순서"])
    }));

    let CompleteItems = [];

    keysWithSizes.map((data)=>{
      CompleteItems.push(data.items);
    })

    setLoading(false);
    setCourseitems(CompleteItems);
    setRefresh((refresh) => refresh +1);
    ListmapDraw(CompleteItems);
  }

  useEffect(()=>{

    FetchData();
  }, [])
  function ListmapDraw(items){
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
            center: new kakao.maps.LatLng(user.USERINFO.latitude, user.USERINFO.longitude), // 지도의 중심좌표
            level: BasicLevel // 지도의 확대 레벨
    };


    var map = new kakao.maps.Map(mapContainer, mapOption);
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT); //

    var overlaysTmp = [];
    var overlays = [];


    items.map((data, index)=>{
   
      let latitude = "";
      let longitude = "";

      let overlay = {
      POSITION : {},
      NAME : "",
      ITEMS :[],
      DESC :"",
      TIME : "",
      id :"",
      }


      latitude = data[0]["위도(도)"];
      longitude =  data[0]["경도(도)"];


      overlay.POSITION = new kakao.maps.LatLng(latitude, longitude);
      overlay.id = data[0]["코스 아이디"];
      overlay.NAME = data[0]["코스명"];
      overlay.ITEMS = data;

      data.map((sub)=>{
        overlay.TIME = sub["이동시간"]+'시간소요';
      })
   
      overlaysTmp.push(overlay);
  })


  overlaysTmp.map((overlayData, index) => {


    var content = document.createElement('div');
    var customOverlay ={};

    kakao.maps.event.addListener(map, 'zoom_changed', function() {
      // 현재 지도 레벨 가져오기
      var level = map.getLevel();

      console.log('현재 지도 레벨: ' + level);

      
        // Custom Overlay 내용 생성
        if(level < 12){
          content.className = 'mapcourseoverlay';
          content.innerHTML =
          '  <div>' +
          '    <div class="titleex">'+overlayData.NAME +'</div>' +
          // '    <div class="price"> '+overlayData.TIME+'</div>' +
          '  </div>' +
          '</div>';
        }else{
          content.className = 'tourcourse';
          content.innerHTML =
          '  <a>' +
          '    <div>' +
          '    <img src="'+ imageDB.gps+'"style="width:32px;"/>' +
          '    </div>' +
          '  </a>' +
          '</div>';
        }


        

        // Custom Overlay 생성
        customOverlay = new kakao.maps.CustomOverlay({
            position: overlayData.POSITION,
            content: content,
            clickable: true // 클릭 가능하도록 설정
        });


        var customData = {
            id: overlayData.id,
            item : overlayData.ITEMS,
            name : overlayData.NAME
        };
        customOverlay.customData = customData;
        // Custom Overlay 지도에 추가

        customOverlay.setMap(map);
        overlays.push(customOverlay);


        content.addEventListener('click', function(event) {
          
          _handleControlTrace(customOverlay.customData.name, customOverlay.customData.item);

        });


    });

  

    setLoading(false);
    setRefresh((refresh) => refresh +1);



  })


  map.setLevel(map.getLevel() +1);
  setCurMap(map);


  //오버레이를 변수에 담아둔다
  setOverlays(overlays);


  // 마커 클러스터러 생성
  var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 클러스터러가 표시될 지도 객체
    averageCenter: true, // 클러스터의 평균 중심 좌표 사용
    gridSize: 60, // 클러스터 간격 설정
    averageCenter: true,
    minLevel: 8,
    styles: [{ // 클러스터 아이콘 커스텀 스타일
      width: '40px',
      height: '40px',
      background: '#FE6625c7',
      borderRadius: '50%',
      textAlign: 'center',
      color: '#fff',
      fontSize: '14px',
      lineHeight: '40px'
    }]
  });

  // 마커 클러스터러에 마커 추가
  clusterer.addMarkers(overlays);
        
}


  const _handleViewPopup = (eventname,data ) => {

   

    navigate("/Mobiletourcourse" ,{state :{eventname :eventname, COURSEITEM : data}});
  }

  const _handleList =()=>{
    navigate("/Mobileleisurecontent" ,{state :{name :TOURISTMENU.TOURCOURSE}});
  }

  const _handleprev = () => {
    navigate(-1);
  }


  return (

    <Container style={containerStyle}>    

    {loading == true && (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />)}

    <div style={{position:"absolute", width:"100%"}}>
      <div id="map" className="Map" style={mapstyle}></div>
    </div>


      
      <FilterEx>
        <ViewBtn onClick={_handleList}>
          <div style={{ paddingLeft: 5 }}>리스트로 보기</div>
        </ViewBtn>
      </FilterEx>

    </Container>
  );

});

export default MobileLifeTourMapCourse;

