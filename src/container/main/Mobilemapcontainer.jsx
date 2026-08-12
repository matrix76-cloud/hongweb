import React, { Component, createRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekgrayimage, Seekimage } from "../../utility/imageData";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { ReadWork } from "../../service/WorkService";
import { CommaFormatted } from "../../utility/money";
import { WORKSTATUS } from "../../utility/status";
import IconButton from "../../common/IconButton";
import { Column } from "../../common/Column";
import { DataContext } from "../../context/Data";
import { FaArrowLeft } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";

import "./Mobilemap.css"
import { Any } from "@react-spring/web";
import Button from "../../common/Button";
import PcFilterPopup from "../../modal/PcFilterPopup/PcFilterPopup";
import PCWorkMapItem from "../../components/PCWorkMapItem";
import { IoSearchCircle } from "react-icons/io5";
import { ref } from "firebase/storage";
import { useSleep } from "../../utility/common";
import { REFRESHTYPE, REQUESTINFO, WORKNAME } from "../../utility/work";
import { FILTERITMETYPE, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import PCRoomMapItem from "../../components/PCRoomMapItem";
import { ROOMSIZE } from "../../utility/room";
import LottieAnimation from "../../common/LottieAnimation";
import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../store/menu/MenuSlice";
import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import { ensureKakao } from "../../utility/kakaoReady";

const Container = styled.div`
    max-height:1000px;

  
`
const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  width:'100%',
};

const GuideLeftStyle={
  position:"absolute",
  right:'0px',
  top:'60px',
  zIndex:5,
  display:"flex",
  flexDrirection :"row",

}
const GuideRightStyle={
    position:"absolute",
    bottom:'20px',
    zIndex:5,
    display:"flex",
    flexDrirection :"row",
  
  }
const GuideTextStyle={
  background: '#a1a2a4a3',
  color: '#fff',
  padding: '5px 10px',
  fontSize :12,
}
const GuideButtonStyle={
  background: '#FF4E19',
  color: '#fff',
  padding: '5px 10px',
  marginRight:10,
  borderRadius: 10,
  width: '100px',
  fontSize: '12px',
  height: '20px',
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const ButtonLayer = styled.div`
  position: absolute;
  /* 하단 탭(76px)에 가려져 필터 버튼이 안 보였다 — 탭 위로 올린다 (형 리뷰 2026-08-12) */
  bottom: 90px;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content:center;
`

const MapBox = styled.div`
border: 1px solid #cbcbcb;
background: ${({$enable})=> $enable == true ? ("#FF4E19") : ("#fff")};
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding : 0px 5px;
`

const MapBoxControl = styled.div`
  border: 1px solid #cbcbcb;
  background: ${({$enable})=> $enable == true ? ("#FF4E19") : ("#fff")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:30px;
  height:30px;
  font-size:28px;
`

const MapBoxSpan = styled.div`
  font-size:9px;
  color: ${({$enable})=> $enable == true ? ("#fff") : ("#131313")};
`
const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const FilterButton = styled.div`
  background-color: var(--surface);
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 20px;
  border: 1px solid var(--border-soft);
  font-family: 'Pretendard-SemiBold';
`

/* 현재 위치로 이동 — 지도 위 동그란 아이콘 버튼 (형 리뷰 2026-08-12) */
const CurrentPosButton = styled.div`
  position: absolute;
  right: 14px;
  bottom: 146px;   /* 필터 줄 바로 위 */
  z-index: 5;
  width: 46px;
  height: 46px;
  border-radius: 100px;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  box-shadow: 0 2px 8px rgba(0,0,0,0.14);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:active { transform: scale(0.94); }
  transition: transform .12s ease;
`

/* 진행중인 일감만 보기 — 필터 버튼 옆 체크박스 (형 리뷰 2026-08-12).
   label 로 두면 클릭이 내부 input 으로 한 번 더 전달돼 지도를 두 번 그렸다 → div 로 바꿨다 */
const OpenOnlyLabel = styled.div`
  margin-left: 10px;
  height: 40px;
  padding: 0 14px;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  user-select: none;
`
const OpenOnlyCheck = styled.input`
  width: 17px;
  height: 17px;
  accent-color: #FF4E19;
  cursor: pointer;
  pointer-events: none;
`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
// kakao 는 전역(window.kakao)을 참조 시점에 읽는다.
// 최상단에서 구조분해하면 SDK 로드 전 undefined 로 굳는다 (Vite=ES모듈, 2026-08-12)

const DetailLevel = 1;
/* 이 레벨부터(=더 축소) 클러스터로 묶는다. 기본 지도 레벨 5 + 2단계. */
const CLUSTER_MIN_LEVEL = 7;

/* 클러스터용 투명 마커 이미지 (1x1).
   마커는 묶기 계산에만 쓰고 화면에는 가격 카드 또는 클러스터 뱃지만 보인다. */
const TRANSPARENT_PIN = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const DetailMeter =300;

/**
 * 홍여사의 핵심서비스
 * dataContext에 있는 WorkItem 정보를 가져 와서 뿌려준다
 * 화면은 크게 세개로 구성 되어 있다
 * 좌측 : 일감을 나열
 * 중간(팝업형태) :좌측일감이나 우측일감을 누르면 팝업 형태로 나옴 (기본은 나오지 않는 상태를 유지)
 * 우측 : 지도 형태로 표현
 * TODO 시용자 지역범위를 설정 할수 있도록 하자
 * TODO 사용자 지역범위 내에서 가장 먼거리 부터 표현
 * @returns 
 */

const MobileMapcontainer =({containerStyle, ID, TYPE}) =>  {

  const reduxdispatch = useDispatch();
  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



  const [items, setItems] = useState([]);
  const [displayitems, setDisplayitems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const [selectworkitemindex, setSelectworkitemindex] = useState(-1);
  const [selectroomitemindex, setSelectroomitemindex] = useState(-1);
  const [item, setItem] = useState({});

  const [guidedisplay, setGuidedisplay] = useState(false);
  const [overlays, setOverlays] = useState([]);



  const [popupstatus, setPopupstatus] = useState(false);
  const [curmap, setCurMap] = useState({});
  const [circle, setCircle] = useState(null);

  const [menuary, setMenuary]= useState([]);
  const [currentloading, setCurrentloading] = useState(true);

  const [servicepopup, setServicepopup] = useState(false);
  const [servicefilter, setServicefilter] = useState([]);

  const itemRefs = useRef([]);

  /* 지도 객체를 ListmapDraw 밖에서도 쓰려고 잡아둔다 — 현재위치 이동에 필요 (형 리뷰 2026-08-12) */
  const mapRef = useRef(null);
  /* 진행중인 일감만 보기 */
  const [openonly, setOpenonly] = useState(false);
  const openonlyRef = useRef(false);
  /* 지난번에 그린 오버레이·마커. 다시 그리기 전에 지워야 겹치지 않는다 (형 리뷰 2026-08-12) */
  const drawnRef = useRef({ overlays: [], markers: [], clusterer: null });
  /* 지금 지도에 그리고 있는 원본 목록(진행중 필터 적용 전). 체크박스가 서비스 필터를 풀지 않게 */
  const sourceRef = useRef([]);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(() =>{

  }, [])

  useEffect(()=>{
    setLoading(loading);
    setItem(item);
    setItems(items);
    setGuidedisplay(guidedisplay);
    setOverlays(overlays);
    setSelectworkitemindex(selectworkitemindex);
    setSelectroomitemindex(selectroomitemindex);
    setPopupstatus(popupstatus);
    setCurMap(curmap);
    setCircle(circle);
    setMenuary(menuary);
    setCurrentloading(currentloading);
    setServicepopup(servicepopup);
    setServicefilter(servicefilter);

    
  },[refresh])




  /**
   * 페이지내에 스크롤을 막아 주는 코드입니다 
   */
  useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable'; // 추가

    if (show) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

/**
 * 전체 일감에서 work_id 만을 가지고 해단 일감 정보를 가져온다 
 */
  function findWorkIndex(work_id, items){
    console.log("TCL: findWorkIndex -> workitems", items)

   const FindIndex =  items.findIndex(x=>x.WORK_ID  === work_id)

   return FindIndex;
  }


  function findRoomIndex(room_id, items){
    console.log("TCL: findRooImndex -> workitems", items)

   const FindIndex =  items.findIndex(x=>x.ROOM_ID  === room_id)

   return FindIndex;
  }

  const priceTodispaly = (price) =>{
    if(price ==0){
      return "가격협의";
    }
    return CommaFormatted(price);
  }




  function filteraryexist(menuname){
    const FindIndex = menuary.findIndex(x=> x == menuname);
    return FindIndex == -1 ? false : true;
  }

  /**
   * 한번 선택 되었던 Circle을 제거 하는 함수
   */
  const ClearCircle = () =>{
    if(circle){
      circle.setMap(null); // 지우기
      setCircle(null); // 상태 초기화
    }
  }


  /**
   * 
   * 
   */
  const _handleFilter = () =>{

    setPopupstatus(true);
    setRefresh((refresh) => refresh +1);
  }
  


  /**
   * 지도에서 클릭 햇을때 사용되는 함수
   * 전달 받은 work_id 를 가지고 이에 대한 정보를 세탕해준다
   * 전달 받은 work_id 를 가지고 selectworkitemindex 세팅해준다
   * 전달 받은 room_id 를 가지고 이에 대한 정보를 세탕해준다
   * 전달 받은 room_id 를 가지고 selectroomitemindex 세팅해준다
   * ! 선택했을때 리스트에서는 지도 처리 로직이 있었지만 지도에서 선택을때는 지도 처리 로직을 여기에 둘수 없다(콜백 특성인듯)
   */
  const _handleControlFromMap = (id, items) =>{

    
    let FindIndex = findWorkIndex(id, items);
    if(FindIndex == -1){
      FindIndex = findRoomIndex(id, items);
    }

    if(items[FindIndex].TYPE == FILTERITMETYPE.HONG){
      navigate("/Mobilework" ,{state :{WORK_ID :items[FindIndex].WORK_ID, TYPE : FILTERITMETYPE.HONG, WORKTYPE :items[FindIndex].WORKTYPE }});
    }else if(items[FindIndex].TYPE == FILTERITMETYPE.ROOM){
      navigate("/Mobileworkroom" ,{state :{ROOM_ID :items[FindIndex].ROOM_ID, TYPE : FILTERITMETYPE.ROOM, ROOMTYPE : items[FindIndex].ROOMTYPE }});
    }

  }




    /**
   * 좌측 리스트에서 클릭 햇을때도 이 함수를 호출해 준다
   * 전달 받은 work_id 를 가지고 이에 대한 정보를 불러온다
   */
  const _handleWorkFromList=async(work_id, items) =>{
    setSelectroomitemindex(-1);
    setSelectworkitemindex(-1);
    setRefresh((refresh) => refresh + 1);
    await useSleep(200);

    const FindIndex = findWorkIndex(work_id, items);
    setSelectworkitemindex(FindIndex);
    
    setItem(items[FindIndex]);
    setRefresh((refresh) => refresh+1);
  }

  const _handleRoomFromList=async(room_id, items) =>{
    setSelectworkitemindex(-1);
    setSelectroomitemindex(-1);
    setRefresh((refresh) => refresh + 1);
    await useSleep(200);

    const FindIndex = findRoomIndex(room_id, items);
    setSelectroomitemindex(FindIndex);
    setItem(items[FindIndex]);
    setRefresh((refresh) => refresh+1);
  }

  const popupcallback = () =>{
    setPopupstatus(false);
    setRefresh((refresh) => refresh +1);
  }

  const _handleservicefilterpopup = () =>{
    setServicepopup(true);
    setRefresh((refresh) => refresh +1);  
  }

  const _handleMapExpand = () =>{

    const level = curmap.getLevel();
    curmap.setLevel(level +1);

  }

  const _handleMapDown = () =>{
    const level = curmap.getLevel();
    curmap.setLevel(level -1);
  }

  /**
 * 전체 기능 과 부분 기능을 체크 하자
 * 전체 기능을 체크 하면 부분 체크가 해제된다
 * 부분 기능을 체크 하면 부분 체크가 해제된다
 * 모든 기능은 menuary 로 설정 된다
 */
  const _handleMenu = (menuname)=>{


    let menuaryTmp = [];
    const FindIndex = menuary.findIndex(x=> x == menuname);
    let filteritems = [];

    if(menuname == WORKNAME.ALLWORK){
      console.log("TCL: _handleMenu -> menuname", menuname, FindIndex, menuary);
      if(FindIndex == -1){
        menuaryTmp.push(menuname);

        setMenuary(menuaryTmp);
      }else{
        setMenuary(menuaryTmp);
      }
      filteritems = items;

    }else{
      if(FindIndex == -1){
      
        const allworkFindIndex = menuary.findIndex(x=> x == WORKNAME.ALLWORK);
        if(allworkFindIndex != -1){
          menuary.splice(allworkFindIndex, 1);
        }

        menuary.push(menuname);

        if(menuname == FILTERITMETYPE.ROOM){
          menuary.push(ROOMSIZE.SMALLER);
          menuary.push(ROOMSIZE.SMALL);
          menuary.push(ROOMSIZE.MEDIUM);
          menuary.push(ROOMSIZE.LARGE);
          menuary.push(ROOMSIZE.EXLARGE);
          console.log("TCL: _handleMenu -> menuary", menuary)
        }

      }else{
        menuary.splice(FindIndex, 1);

        if(menuname == FILTERITMETYPE.ROOM){

          let FindIndex = menuary.findIndex(x=>x == ROOMSIZE.SMALLER);
          menuary.splice(FindIndex,1);
          FindIndex = menuary.findIndex(x=>x == ROOMSIZE.SMALL);
          menuary.splice(FindIndex,1);
          FindIndex = menuary.findIndex(x=>x == ROOMSIZE.MEDIUM);
          menuary.splice(FindIndex,1);
          FindIndex = menuary.findIndex(x=>x == ROOMSIZE.LARGE);
          menuary.splice(FindIndex,1);
          FindIndex = menuary.findIndex(x=>x == ROOMSIZE.EXLARGE);
          menuary.splice(FindIndex,1);

        }
      }
      setMenuary(menuary);

      items.map((data, index)=>{
        if(menuary.includes(data.WORKTYPE)){
          filteritems.push(data);
        }
        if(menuary.includes(data.ROOMTYPE)){
          filteritems.push(data);
        }
      })

    }
    setRefresh((refresh) => refresh +1);
    console.log("TCL: _handleMenu -> menuary", menuary);

    ListmapDraw(filteritems);

  
  }


  /**
   * 지도와 리스트 를 그리도록 한다
   * ! 지도객체가 먼저 만들어졌는지 확인이 필요
   * ! 데이타를 먼저 채워준다(setWorkitems) 왜냐하면 지도 그려지기 전에 먼저 좌측에 항목이 나와야 부드럽게 처리
   * ! overlaycustom을 배열로 만들어주고 클릭 이벤트를 넣어준다 클릭이벤트시에 해당 데이타를 가져올수 있으며
   * TODO 해당 객체의 css를 변경할수 있는데 이부분도 주석
   * ! marker도 그려준다
   * ! overlaycustom 클릭시에 해당 클릭한 일감을 중심좌표로 이동시키고 확대 레벨은 DetailLever로 유지 시킨다(초기 구동시에 확대레벨은 4이다)
   * ! map 의 기본 보기 범위는  최대 범위 3 최소 범위 9 그리고 기본 레벨은 4이다
   * TODO 클릭시에 WorkItemPopup 을 표시 해주는 부분 주석
   * ! 현재 주소지에 근거하여 보여줄 범위를 정해준다
   * TODO 현재는 남양주 다산동으로 테스트 하기 위해 설정
   * 리스트에서 위치 이동을 위해 refs 배열에 값을 세팅해준다
   * ! 하이라이트 표시 는 css로 적용
   */
  async function ListmapDraw(rawdatas){

    if(!(await ensureKakao())) return;

    sourceRef.current = rawdatas || [];

    /* 진행중만 보기가 켜져 있으면 마감된 일감은 지도에 안 그린다 (형 리뷰 2026-08-12) */
    const datas = openonlyRef.current
      ? rawdatas.filter((d)=> (d.TYPE == FILTERITMETYPE.ROOM ? d.ROOM_STATUS : d.WORK_STATUS) == WORKSTATUS.OPEN)
      : rawdatas;

    setLoading(true);
    setRefresh((refresh) =>refresh +1);

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
          center: new kakao.maps.LatLng(37.625660993622, 127.14833958893), // 지도의 중심좌표
          /* 처음 들어왔을 때 동네가 한눈에 들어오는 정도 (형 리뷰 2026-08-12).
             5는 너무 붙어 있어 주변 일감이 화면 밖으로 밀려났다. */
          level: 6
    };

    /* 다시 그릴 때마다 지도를 새로 만들면 이전 가격 카드가 화면에 그대로 남아
       카드가 겹쳐 늘어났다(14 -> 40). 지도는 한 번만 만들고 재사용한다. (형 리뷰 2026-08-12) */
    const firstDraw = !mapRef.current;
    var map = mapRef.current;
    if(firstDraw){
      map = new kakao.maps.Map(mapContainer, mapOption);
      mapRef.current = map;
    }

    // 지난번에 올려둔 가격 카드·마커를 먼저 걷어낸다
    try{
      drawnRef.current.overlays.forEach((o)=> o.setMap(null));
      drawnRef.current.markers.forEach((m)=> m.setMap(null));
      if(drawnRef.current.clusterer) drawnRef.current.clusterer.clear();
    }catch(e){ console.warn('[map] 이전 오버레이 정리 실패', e); }
    drawnRef.current = { overlays: [], markers: [], clusterer: null };

    const geocoder = new window.kakao.maps.services.Geocoder();

    if(firstDraw) geocoder.addressSearch(user.address_name, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            map.setCenter(coords);
            /* 반경 2.5km 를 노란 원으로 덮던 것 삭제 — 지도가 탁해지고 일감 카드가 묻혔다 (형 리뷰 2026-08-12) */
        } else {
            /* 주소를 못 찾아도 알럿으로 막지 않는다. 지도는 기본 좌표로 그대로 보여준다 */
            console.warn('[map] 주소를 찾지 못했습니다:', user.address_name);
        }
    });



    var overlaysTmp = [];
    var overlays = [];

    
    for (var i = 0; i < datas.length; i ++){
      let overlay = {
        POSITION : {},
        TYPE : "",
        OVERLAYTYPE:"",
        PRICE : "",
        STATUS: "",
        ID : "",
        ITEMS :datas,
      }

      let FindIndex = "";
      let PRICE ="";
      let latitude = "";
      let longitude = "";


      if(datas[i].TYPE == FILTERITMETYPE.HONG){
        FindIndex = datas[i].WORK_INFO.findIndex(x=>x.requesttype =='금액');
        PRICE = datas[i].WORK_INFO[FindIndex].result;
        
        FindIndex = datas[i].WORK_INFO.findIndex(x=>x.requesttype =='지역');
  
        latitude = datas[i].WORK_INFO[FindIndex].latitude;
        longitude =  datas[i].WORK_INFO[FindIndex].longitude;
  
  
        overlay.POSITION = new kakao.maps.LatLng(latitude, longitude);
        overlay.PRICE = PRICE;
        overlay.TYPE = FILTERITMETYPE.HONG;
        overlay.OVERLAYTYPE = datas[i].WORKTYPE;
        overlay.STATUS = datas[i].WORK_STATUS;
        overlay.ID = datas[i].WORK_ID;
        overlay.ITEMS = datas
        overlaysTmp.push(overlay);
      }else if(datas[i].TYPE == FILTERITMETYPE.ROOM){
        FindIndex = datas[i].ROOM_INFO.findIndex(x=>x.requesttype =='금액');
        PRICE = datas[i].ROOM_INFO[FindIndex].result;
        
        FindIndex = datas[i].ROOM_INFO.findIndex(x=>x.requesttype =='지역');
  
        latitude = datas[i].ROOM_INFO[FindIndex].latitude;
        longitude =  datas[i].ROOM_INFO[FindIndex].longitude;
  
  
        overlay.POSITION = new kakao.maps.LatLng(latitude, longitude);
        overlay.PRICE = PRICE;
        overlay.TYPE = FILTERITMETYPE.ROOM;
        overlay.OVERLAYTYPE = datas[i].ROOMTYPE;
        overlay.STATUS = datas[i].ROOM_STATUS;
        overlay.ID = datas[i].ROOM_ID;
        overlay.ITEMS = datas
        overlaysTmp.push(overlay);
      }

    }



    // 마커 클러스터 — 일감이 한자리에 뭉쳐 보이던 것 해소 (형 리뷰 2026-08-12)
    // 카카오 클러스터러는 Marker 만 묶을 수 있어서, 멀리서는 클러스터/마커를 보여주고
    // 충분히 확대(CLUSTER_MIN_LEVEL 이하)하면 가격 카드(CustomOverlay)로 바꿔 보여준다.
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      /* 기본 지도 레벨이 5다. 거기서 두 단계 더 축소한 7부터 묶는다 (형 리뷰 2026-08-12).
         레벨 6 이하(확대)에서는 클러스터 없이 원래대로 가격 카드가 보인다. */
      minLevel: CLUSTER_MIN_LEVEL,
      minClusterSize: 2,        // 2개 이상만 클러스터. 1개는 원래대로 가격 카드
      disableClickZoom: false,
      gridSize: 90,
      styles: [{
        width: '44px', height: '44px',
        background: '#FF4E19',
        borderRadius: '22px',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '44px',
        fontSize: '15px',
        fontWeight: '700',
        border: '2px solid #fff',
        boxShadow: '0 2px 6px rgba(0,0,0,.25)',
      }],
    });
    const clusterMarkers = [];

    // 오버레이를 지도에 추가하고 클릭 이벤트 처리
    overlaysTmp.forEach(function(overlayData, index) {
    

        // Custom Overlay 내용 생성
        var content = document.createElement('div');
        content.className = 'mapcustomoverlay';

        if(overlayData.STATUS == WORKSTATUS.OPEN){
          content.innerHTML =
          '  <a>' +
          '    <div class="title">'+overlayData.OVERLAYTYPE +'</div>' +
          '    <div class="price">'+overlayData.PRICE +'</div>' +
          '  </a>' +
          '</div>';
        }else{
          content.innerHTML =
          '  <a style="background:#A3A3A3">' +
          '    <div class="titleclose">'+overlayData.OVERLAYTYPE +'(마감)</div>' +
          '    <div class="priceclose">'+overlayData.PRICE +'</div>' +
          '  </a>' +
          '</div>';
        }

        // Custom Overlay 생성
        var customOverlay = new kakao.maps.CustomOverlay({
            position: overlayData.POSITION,
            content: content,
            clickable: true // 클릭 가능하도록 설정
        });

        var customData = {
          id: overlayData.ID,
          items : overlayData.ITEMS
        };
        customOverlay.customData = customData;
        // 초기에는 숨겨두고, 클러스터 판정(syncOverlays) 결과에 따라 켠다
        customOverlay.setMap(null);

        overlays.push(customOverlay);

        // 같은 지점을 가리키는 클러스터용 마커.
        // 이미지가 투명이라 화면에는 안 보이고, 묶였을 때만 클러스터 뱃지로 나타난다.
        const clusterMarker = new kakao.maps.Marker({
          position: overlayData.POSITION,
          image: new kakao.maps.MarkerImage(TRANSPARENT_PIN, new kakao.maps.Size(1, 1)),
        });
        clusterMarker.customData = customData;
        kakao.maps.event.addListener(clusterMarker, 'click', function () {
          map.setLevel(DetailLevel);
          map.setCenter(clusterMarker.getPosition());
          _handleControlFromMap(clusterMarker.customData.id, clusterMarker.customData.items);
        });
        clusterMarkers.push(clusterMarker);
      
        // 클릭 이벤트 등록 
        // 지도에서 클릭 햇을때는 리스트에서 클릭 했을때와 달리 별도로 circle을 표시할 필요는 없다
        content.addEventListener('click', function(event) {
      
          // setRefresh((refresh) =>refresh +1);
          map.setLevel(DetailLevel);
          map.setCenter(customOverlay.getPosition());  
          
          _handleControlFromMap(customOverlay.customData.id, customOverlay.customData.items);

        });

  

    });

    // 마커를 클러스터에 넣고, 줌 레벨에 따라 [클러스터 <-> 가격 카드] 를 전환한다
    clusterer.addMarkers(clusterMarkers);

    /* 클러스터에 묶인 것(2개 이상)은 뱃지로, 혼자인 것은 원래대로 가격 카드로 보여준다.
       (형 리뷰 2026-08-12 — "한개짜리는 그냥 원래 표현하던 방법으로") */
    /* 축소할 때 화면이 깜빡이던 문제 (형 지적 2026-08-12)
       ① 상태가 그대로인 오버레이까지 매번 setMap 을 다시 불러 전부 떼었다 붙였다 했다
          -> 지금 붙어 있는지(getMap) 보고 "바뀐 것만" 건드린다
       ② zoom_changed 와 clustered 가 연달아 발화해 같은 작업이 두세 번 돌았다
          -> 다음 프레임에 한 번만 돌도록 묶는다 */
    let syncQueued = false;
    const syncOverlays = () => {
      const grouped = new Set();
      // 클러스터가 동작하지 않는 레벨(확대 상태)에서는 전부 가격 카드로 보여준다
      if (map.getLevel() >= CLUSTER_MIN_LEVEL) {
        clusterer.getClusters().forEach((c) => {
          if (c.getSize() >= 2) c.getMarkers().forEach((m) => grouped.add(m.customData?.id));
        });
      }
      overlays.forEach((o) => {
        const shouldShow = !grouped.has(o.customData?.id);
        const isShown = !!o.getMap();
        if (shouldShow === isShown) return;      // 그대로면 건드리지 않는다
        o.setMap(shouldShow ? map : null);
      });
    };
    const requestSync = () => {
      if (syncQueued) return;
      syncQueued = true;
      requestAnimationFrame(() => { syncQueued = false; syncOverlays(); });
    };

    kakao.maps.event.addListener(clusterer, 'clustered', requestSync);
    kakao.maps.event.addListener(map, 'zoom_changed', requestSync);
    requestSync();

    // 다음번에 지울 수 있게 기억해둔다
    drawnRef.current = { overlays, markers: clusterMarkers, clusterer };

    //오버레이를 변수에 담아둔다
    setOverlays(overlays);
    setRefresh((refresh) => refresh +1);


    // 확대/축소 레벨 제한.
    // setMinLevel/setMaxLevel 을 쓰면 지도가 그 범위를 넘지 않으므로
    // zoom_changed 안에서 setLevel 로 되돌릴 일 자체가 없다 (깜빡임의 근본 원인 제거).
    const minLevel = 1;
    const maxLevel = 9;
    try {
      map.setMinLevel(minLevel);
      map.setMaxLevel(maxLevel);
    } catch { /* 구버전 SDK 대비 — 아래 보정이 대신 처리한다 */ }


    window.kakao.maps.event.addListener(map, 'drag', () => {
      setSelectworkitemindex(-1);
      setSelectroomitemindex(-1);
      setRefresh((refresh) => refresh +1);

      // 드래그 중에 실행할 코드
    });

    // 지도의 확대/축소 이벤트 리스너 추가
    window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      setSelectworkitemindex(-1);
      setSelectroomitemindex(-1);
        const level = map.getLevel();


        if(level >5){
          setGuidedisplay(true);
        }else{
          setGuidedisplay(false);
        }


        setRefresh((refresh) => refresh +1);

        /* 확대/축소 한계 보정.
           ★ zoom_changed 안에서 조건 없이 setLevel 을 부르면 그 setLevel 이 다시
             zoom_changed 를 일으켜 무한 루프가 된다. 한계에 닿은 채로 더 축소하면
             화면이 계속 깜빡였던 원인 (형 지적 2026-08-12).
             지금 레벨과 다를 때만 되돌린다. */
        if (level < minLevel && map.getLevel() !== minLevel) {
            map.setLevel(minLevel);
        } else if (level > maxLevel && map.getLevel() !== maxLevel) {
            map.setLevel(maxLevel);
        }
    });

    setCurMap(map);
    setRefresh((refresh) => refresh +1);
    // if(ID != "" && TYPE == PCMAINMENU.HOMEMENU){
  
    //     const FindIndex = findWorkIndex(ID, datas);
    //     console.log("TCL: ListmapDraw -> FindIndex", FindIndex,datas)
    //     _handleSelectWork2(FindIndex, datas, map);
    // }
    // if(ID != "" && TYPE == PCMAINMENU.ROOMMENU){
    //   const FindIndex = findRoomIndex(ID, datas);
    //     console.log("TCL: ListmapDraw -> FindIndex", FindIndex,datas)
    //     _handleSelectRoom2(FindIndex, datas, map);
    // }

   
  }


  useEffect(()=>{
    setCurrentloading(true);
    async function FetchData(){

      const latitude =user.latitude;
      const longitude = user.longitude;

      const workdatas = await ReadWork({latitude, longitude});

      let items = [];

      workdatas.map((data, index) =>{
        data["TYPE"] = FILTERITMETYPE.HONG;
        items.push(data);
      })
      console.log("TCL: FetchData -> items", items);
      setItems(items);
      setDisplayitems(items);

      ListmapDraw(items);

      setCurrentloading(false);

      setRefresh((refresh) => refresh +1);


    } 
    FetchData();
    reduxdispatch(RESET());
  }, [])

  useLayoutEffect(()=>{

    if(value != REFRESHTYPE){
      return;
    }

    setCurrentloading(true);
    async function FetchData(){

      const latitude =user.latitude;
      const longitude = user.longitude;

      const workdatas = await ReadWork({latitude, longitude});

      let items = [];

      workdatas.map((data, index) =>{
        data["TYPE"] = FILTERITMETYPE.HONG;
        items.push(data);
      })
      console.log("TCL: FetchData -> items", items);
      setItems(items);
      setDisplayitems(items);

      ListmapDraw(items);

      setCurrentloading(false);

      setRefresh((refresh) => refresh +1);


    } 
    FetchData();
 

  }, [value])

  const _handleSupport=()=>{}
  const _handleClose = () =>{
    setSelectworkitemindex(-1);
    setSelectroomitemindex(-1);
  }
  const positioncallback =()=>{}

  /**
   * 현재 위치로 지도 옮기기 (형 리뷰 2026-08-12).
   * 기기 위치를 못 받으면 가입할 때 적은 주소 좌표로라도 옮긴다.
   */
  const _handleMoveCurrent = () =>{
    const move = (lat, lng)=>{
      const map = mapRef.current;
      if(!map || !window.kakao) return;
      map.setLevel(4);
      map.panTo(new window.kakao.maps.LatLng(lat, lng));
    }

    if(!navigator.geolocation){
      if(user.latitude && user.longitude) move(user.latitude, user.longitude);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos)=>{ move(pos.coords.latitude, pos.coords.longitude); },
      ()=>{
        // 위치 권한이 없을 때 — 조용히 등록 주소로 대신한다
        if(user.latitude && user.longitude) move(user.latitude, user.longitude);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  }

  /** 진행중인 일감만 보기 토글 — 지도를 다시 그린다 */
  const _handleOpenonly = () =>{
    const next = !openonly;
    openonlyRef.current = next;
    setOpenonly(next);
    // 서비스 필터가 걸려 있으면 그 결과 위에서 다시 거른다
    ListmapDraw(sourceRef.current.length ? sourceRef.current : items);
    setRefresh((refresh) => refresh +1);
  }

  const MobileServiceFilterCallback =(filterary) =>{
    setServicepopup(false);

    /* 빈 배열 = 시트를 그냥 닫은 것(취소). 목록은 건드리지 않는다 */
    if(!filterary || filterary.length == 0){
      setRefresh((refresh) => refresh +1);
      return;
    }

    /* 방금 고른 값으로 걸러야 한다. setMenuary 는 바로 반영되지 않아
       예전 코드는 직전 값(처음엔 빈 배열)으로 걸러서 아무것도 안 나왔다. (형 리뷰 2026-08-12) */
    setMenuary(filterary);
    const filteritems = items.filter((d)=> filterary.includes(d.WORKTYPE) || filterary.includes(d.ROOMTYPE));

    setRefresh((refresh) => refresh +1);
    ListmapDraw(filteritems);


    // let menuaryTmp = [];
    // const FindIndex = menuary.findIndex(x=> x == menuname);
    // let filteritems = [];

    // if(menuname == WORKNAME.ALLWORK){
    //   console.log("TCL: _handleMenu -> menuname", menuname, FindIndex, menuary);
    //   if(FindIndex == -1){
    //     menuaryTmp.push(menuname);

    //     setMenuary(menuaryTmp);
    //   }else{
    //     setMenuary(menuaryTmp);
    //   }
    //   filteritems = items;

    // }else{
    //   if(FindIndex == -1){
      
    //     const allworkFindIndex = menuary.findIndex(x=> x == WORKNAME.ALLWORK);
    //     if(allworkFindIndex != -1){
    //       menuary.splice(allworkFindIndex, 1);
    //     }

    //     menuary.push(menuname);

    //     if(menuname == FILTERITMETYPE.ROOM){
    //       menuary.push(ROOMSIZE.SMALLER);
    //       menuary.push(ROOMSIZE.SMALL);
    //       menuary.push(ROOMSIZE.MEDIUM);
    //       menuary.push(ROOMSIZE.LARGE);
    //       menuary.push(ROOMSIZE.EXLARGE);
    //       console.log("TCL: _handleMenu -> menuary", menuary)
    //     }

    //   }else{
    //     menuary.splice(FindIndex, 1);

    //     if(menuname == FILTERITMETYPE.ROOM){

    //       let FindIndex = menuary.findIndex(x=>x == ROOMSIZE.SMALLER);
    //       menuary.splice(FindIndex,1);
    //       FindIndex = menuary.findIndex(x=>x == ROOMSIZE.SMALL);
    //       menuary.splice(FindIndex,1);
    //       FindIndex = menuary.findIndex(x=>x == ROOMSIZE.MEDIUM);
    //       menuary.splice(FindIndex,1);
    //       FindIndex = menuary.findIndex(x=>x == ROOMSIZE.LARGE);
    //       menuary.splice(FindIndex,1);
    //       FindIndex = menuary.findIndex(x=>x == ROOMSIZE.EXLARGE);
    //       menuary.splice(FindIndex,1);

    //     }
    //   }
    //   setMenuary(menuary);

    //   items.map((data, index)=>{
    //     if(menuary.includes(data.WORKTYPE)){
    //       filteritems.push(data);
    //     }
    //     if(menuary.includes(data.ROOMTYPE)){
    //       filteritems.push(data);
    //     }
    //   })

    // }
    // setRefresh((refresh) => refresh +1);
    // console.log("TCL: _handleMenu -> menuary", menuary);

    // ListmapDraw(filteritems);

    setServicepopup(false);

  }
  return (
    <>
 
    <Container style={containerStyle}>
      <Row>
        <div style={{display:"flex", width:'100%'}}>
          <div id="map" className="Map" style={mapstyle}></div>
        </div>  
      </Row>

      {/* {
   currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
    width={"100px"} height={'100px'}/>) :(       <ButtonLayer>

      <MapBox style={{height:35}}
      enable ={filteraryexist(WORKNAME.ALLWORK) } onClick={()=>{_handleMenu(WORKNAME.ALLWORK)}}>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.ALLWORK) } >{WORKNAME.ALLWORK}</MapBoxSpan>
      </MapBox>

      <MapBox  enable ={filteraryexist(WORKNAME.HOMECLEAN) } onClick={()=>{_handleMenu(WORKNAME.HOMECLEAN)}}>
      <img src={filteraryexist(WORKNAME.HOMECLEAN) == true ? imageDB.housesmall:imageDB.housegraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.HOMECLEAN) }>{WORKNAME.HOMECLEAN}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.BUSINESSCLEAN) } onClick={()=>{_handleMenu(WORKNAME.BUSINESSCLEAN)}}>
      <img src={filteraryexist(WORKNAME.BUSINESSCLEAN) == true ? imageDB.businesssmall:imageDB.businessgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.BUSINESSCLEAN) }>{WORKNAME.BUSINESSCLEAN}</MapBoxSpan>
      </MapBox>

      <MapBox  enable ={filteraryexist(WORKNAME.MOVECLEAN) } onClick={()=>{_handleMenu(WORKNAME.MOVECLEAN)}}>
      <img src={filteraryexist(WORKNAME.MOVECLEAN) == true ? imageDB.movesmall:imageDB.movegraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.MOVECLEAN) }>{WORKNAME.MOVECLEAN}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.FOODPREPARE) } onClick={()=>{_handleMenu(WORKNAME.FOODPREPARE)}}>
      <img src={filteraryexist(WORKNAME.FOODPREPARE) == true ? imageDB.cooksmall:imageDB.cookgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.FOODPREPARE) }>{WORKNAME.FOODPREPARE}</MapBoxSpan>
      </MapBox>


   
      <MapBox  enable ={filteraryexist(WORKNAME.ERRAND) } onClick={()=>{_handleMenu(WORKNAME.ERRAND)}}>
      <img src={filteraryexist(WORKNAME.ERRAND) == true ? imageDB.helpsmall:imageDB.helpgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.ERRAND) }>{WORKNAME.ERRAND}</MapBoxSpan>
      </MapBox>



      <MapBox  enable ={filteraryexist(WORKNAME.GOOUTSCHOOL) } onClick={()=>{_handleMenu(WORKNAME.GOOUTSCHOOL)}}>
      <img src={filteraryexist(WORKNAME.GOOUTSCHOOL) == true ? imageDB.gooutschoolsmall:imageDB.gooutschoolgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.GOOUTSCHOOL) }>{WORKNAME.GOOUTSCHOOL}</MapBoxSpan>
      </MapBox>

      <MapBox  enable ={filteraryexist(WORKNAME.BABYCARE) } onClick={()=>{_handleMenu(WORKNAME.BABYCARE)}}>
      <img src={filteraryexist(WORKNAME.BABYCARE) == true ? imageDB.babycaresmall:imageDB.babycaregraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.BABYCARE) }>{WORKNAME.BABYCARE}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.LESSON) } onClick={()=>{_handleMenu(WORKNAME.LESSON)}}>
      <img src={filteraryexist(WORKNAME.LESSON) == true ? imageDB.lessonsmall:imageDB.lessongraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.LESSON) }>{WORKNAME.LESSON}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.PATIENTCARE) } onClick={()=>{_handleMenu(WORKNAME.PATIENTCARE)}}>
      <img src={filteraryexist(WORKNAME.PATIENTCARE) == true ? imageDB.patientcaresmall:imageDB.patientcaregraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.PATIENTCARE) }>{WORKNAME.PATIENTCARE}</MapBoxSpan>
      </MapBox>

      <MapBox  enable ={filteraryexist(WORKNAME.CARRYLOAD) } onClick={()=>{_handleMenu(WORKNAME.CARRYLOAD)}}>
      <img src={filteraryexist(WORKNAME.CARRYLOAD) == true ? imageDB.carrysmall:imageDB.carrygraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.CARRYLOAD) }>{WORKNAME.CARRYLOAD}</MapBoxSpan>
      </MapBox>
      


      <MapBox  enable ={filteraryexist(WORKNAME.GOHOSPITAL) } onClick={()=>{_handleMenu(WORKNAME.GOHOSPITAL)}}>
      <img src={filteraryexist(WORKNAME.GOHOSPITAL) == true ? imageDB.hospitalsmall:imageDB.hospitalgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.GOHOSPITAL) }>{WORKNAME.GOHOSPITAL}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.RECIPETRANSMIT) } onClick={()=>{_handleMenu(WORKNAME.RECIPETRANSMIT)}}>
      <img src={filteraryexist(WORKNAME.RECIPETRANSMIT) == true ? imageDB.recipesmall:imageDB.recipegraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.RECIPETRANSMIT) }>{WORKNAME.RECIPETRANSMIT}</MapBoxSpan>
      </MapBox>



      <MapBox  enable ={filteraryexist(WORKNAME.GOSCHOOLEVENT) } onClick={()=>{_handleMenu(WORKNAME.GOSCHOOLEVENT)}}>
      <img src={filteraryexist(WORKNAME.GOSCHOOLEVENT) == true ? imageDB.schooleventsmall:imageDB.schooleventgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.GOSCHOOLEVENT) }>{WORKNAME.GOSCHOOLEVENT}</MapBoxSpan>
      </MapBox>

      <MapBox  enable ={filteraryexist(WORKNAME.SHOPPING) } onClick={()=>{_handleMenu(WORKNAME.SHOPPING)}}>
      <img src={filteraryexist(WORKNAME.SHOPPING) == true ? imageDB.shoppingsmall:imageDB.shoppinggraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.SHOPPING) }>{WORKNAME.SHOPPING}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.GODOGHOSPITAL) } onClick={()=>{_handleMenu(WORKNAME.GODOGHOSPITAL)}}>
      <img src={filteraryexist(WORKNAME.GODOGHOSPITAL) == true ? imageDB.doghospitalsmall:imageDB.doghospitalgraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.GODOGHOSPITAL) }>{WORKNAME.GODOGHOSPITAL}</MapBoxSpan>
      </MapBox>



      <MapBox  enable ={filteraryexist(WORKNAME.GODOGWALK) } onClick={()=>{_handleMenu(WORKNAME.GODOGWALK)}}>
      <img src={filteraryexist(WORKNAME.GODOGWALK) == true ? imageDB.dogsmall:imageDB.doggraysmall}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.GODOGWALK) }>{WORKNAME.GODOGWALK}</MapBoxSpan>
      </MapBox>


      <MapBox  enable ={filteraryexist(WORKNAME.ROOM) } onClick={()=>{_handleMenu(WORKNAME.ROOM)}}>
      <img src={filteraryexist(WORKNAME.ROOM) == true ? imageDB.roomsize1:imageDB.roomsize1}  style={{width:"18px"}}/>
      <MapBoxSpan enable ={filteraryexist(WORKNAME.ROOM) }>{WORKNAME.ROOM}</MapBoxSpan>
      </MapBox>


    </ButtonLayer>  )
    } */}

      {/* 현재 위치로 이동 — 필터 줄 바로 위 오른쪽 (형 리뷰 2026-08-12) */}
      <CurrentPosButton onClick={_handleMoveCurrent} title="현재 위치로 이동" aria-label="현재 위치로 이동">
        <MdMyLocation size={22} color="#131313"/>
      </CurrentPosButton>

      <ButtonLayer>
        <FilterButton onClick={_handleservicefilterpopup}>
          <img src ={imageDB.filterblack} style={{width:16}}/>
          <div style={{fontSize:16}}>필터</div>
        </FilterButton>
        <OpenOnlyLabel onClick={_handleOpenonly}>
          <OpenOnlyCheck type="checkbox" checked={openonly} readOnly/>
          진행중인 일감만
        </OpenOnlyLabel>
      </ButtonLayer>

      <div style={GuideLeftStyle}>
            <MapBoxControl onClick={_handleMapExpand}>+</MapBoxControl>
            <MapBoxControl onClick={_handleMapDown}>-</MapBoxControl>
       </div>
   

      {
        servicepopup == true && <MobileServiceFilter callback={MobileServiceFilterCallback} filterhistory={menuary}/>
      }

    </Container>
    </>
  


  );

}

export default MobileMapcontainer;

