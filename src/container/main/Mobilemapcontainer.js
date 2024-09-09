import React, { Component, createRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
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

import "./Mobilemap.css"
import { Any } from "@react-spring/web";
import Button from "../../common/Button";
import PcFilterPopup from "../../modal/PcFilterPopup/PcFilterPopup";
import PCWorkMapItem from "../../components/PCWorkMapItem";
import { IoSearchCircle } from "react-icons/io5";
import { ref } from "firebase/storage";
import { useSleep } from "../../utility/common";
import { REQUESTINFO, WORKNAME } from "../../utility/work";
import { FILTERITMETYPE, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { ReadRoom } from "../../service/RoomService";
import PCRoomMapItem from "../../components/PCRoomMapItem";
import { ROOMSIZE } from "../../utility/room";
import LottieAnimation from "../../common/LottieAnimation";

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
  background: '#21A2FF',
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
  bottom: 20px;
  width: 90%;
  z-index: 2;
  right: 3px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content:flex-start;
`

const MapBox = styled.div`
border: 1px solid #cbcbcb;
background: ${({enable})=> enable == true ? ("#21A2FF") : ("#fff")};
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding : 0px 5px;
`

const MapBoxControl = styled.div`
  border: 1px solid #cbcbcb;
  background: ${({enable})=> enable == true ? ("#21A2FF") : ("#fff")};
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
  color: ${({enable})=> enable == true ? ("#fff") : ("#131313")};
`
const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const DetailLevel = 1;
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


  const itemRefs = useRef([]);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(() =>{
    menuary.push(WORKNAME.ALLWORK);
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
  function ListmapDraw(datas){

    setLoading(true);
    setRefresh((refresh) =>refresh +1);

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
          center: new kakao.maps.LatLng(37.625660993622, 127.14833958893), // 지도의 중심좌표
          level: 5 // 지도의 확대 레벨
    };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(user.address_name, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            map.setCenter(coords);
            const circle = new window.kakao.maps.Circle({
                center: coords,
                radius: 2500, // 반경 2.5키로미터
                strokeWeight: 2,
                strokeColor: '#ff4e19',
                strokeOpacity: 1,
                strokeStyle: 'dashed',
                fillColor: '#FFCF70',
                fillOpacity: 0.2
            });
            circle.setMap(map);
        } else {
            alert('주소를 찾을 수 없습니다.');
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



    // 오버레이를 지도에 추가하고 클릭 이벤트 처리
    overlaysTmp.forEach(function(overlayData, index) {
    

        // Custom Overlay 내용 생성
        var content = document.createElement('div');
        content.className = 'mapcustomoverlay';

        if(overlayData.STATUS == WORKSTATUS.OPEN){
          content.innerHTML =
          '  <a>' +
          '    <div>' +
          '    <img src="'+ Seekimage(overlayData.OVERLAYTYPE) +'"style="width:24px;"/>' +
          '    </div>' +
          '    <div class="title">'+overlayData.OVERLAYTYPE +'</div>' +
          '    <div class="price">'+overlayData.PRICE +'</div>' +
          '  </a>' +
          '</div>';
        }else{
          content.innerHTML =
          '  <a style="background:#A3A3A3">' +
          '    <div>' +
          '    <img src="'+ Seekgrayimage(overlayData.OVERLAYTYPE) +'"style="width:24px;"/>' +
          '    </div>' +
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
        // Custom Overlay 지도에 추가
        customOverlay.setMap(map);

        overlays.push(customOverlay);
      
        // 클릭 이벤트 등록 
        // 지도에서 클릭 햇을때는 리스트에서 클릭 했을때와 달리 별도로 circle을 표시할 필요는 없다
        content.addEventListener('click', function(event) {
      
          // setRefresh((refresh) =>refresh +1);
          map.setLevel(DetailLevel);
          map.setCenter(customOverlay.getPosition());  
          
          _handleControlFromMap(customOverlay.customData.id, customOverlay.customData.items);

        });

  

    });


    //오버레이를 변수에 담아둔다
    setOverlays(overlays);
    setRefresh((refresh) => refresh +1);


    // 확대/축소 레벨 제한 설정
    const minLevel = 1;
    const maxLevel = 9;


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

        if (level < minLevel) {
            map.setLevel(minLevel);
        } else if (level > maxLevel) {
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

      const roomdatas = await ReadRoom({latitude, longitude});

      let items = [];

      workdatas.map((data, index) =>{
        data["TYPE"] = FILTERITMETYPE.HONG;
        items.push(data);
      })

      roomdatas.map((data, index) =>{
        data["TYPE"] = FILTERITMETYPE.ROOM;
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
  }, [])

  const _handleSupport=()=>{}
  const _handleClose = () =>{
    setSelectworkitemindex(-1);
    setSelectroomitemindex(-1);
  }
  const positioncallback =()=>{}

  return (
    <>
 
    <Container style={containerStyle}>
      <Row>
        <div style={{display:"flex", width:'100%'}}>
          <div id="map" className="Map" style={mapstyle}></div>
        </div>  
      </Row>

      {
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
    }


      <div style={GuideLeftStyle}>
            <MapBoxControl onClick={_handleMapExpand}>+</MapBoxControl>
            <MapBoxControl onClick={_handleMapDown}>-</MapBoxControl>
       </div>
   


    </Container>
    </>
  


  );

}

export default MobileMapcontainer;

