import React, { Component, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import StoreInfo from "../../components/StoreInfo";
import { DataContext } from "../../context/Data";


import { DeleteWorkByUSER_ID, ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { REFRESHTYPE, WORKNAME, WORKPOLICY } from "../../utility/work";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import MobileStoreInfo from "../../components/MobileStoreInfo";
import Swipe from "../../common/Swipe";
import { useSleep } from "../../utility/common";
import { FILTERNAME } from "../../utility/fitler";

import { FiTerminal } from "react-icons/fi";
import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import MobilePriceFilter from "../../modal/MobilePriceFilterPopup/MobilePriceFilter";
import MobilePeriodFilter from "../../modal/MobilePeriodFilterPopup/MobilePeriodFilter";
import MobileDistanceFilter from "../../modal/MobileDistanceFilterPopup/MobileDistanceFilter";
import MobileProcessFilter from "../../modal/MobileProcessFilterPopup/MobileProcessFilter";
import ResultLabel from "../../common/ResultLabel";
import LottieAnimation from "../../common/LottieAnimation";
import Empty from "../../components/Empty";
import MobileSuccessPopup from "../../modal/MobileSuccessPopup/MobileSuccessPopup";
import { RESET } from "../../store/menu/MenuSlice";
import { LoadingMainAnimationStyle } from "../../screen/css/common";

const Container = styled.div`
  padding:50px 0px 0px 0px;
  width: ${({width}) => width}px;
  margin : 0 auto;
  height: calc(100vh - 50px);
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */


`
const SubContainer = styled.div`
  margin: 0 auto;
  background: #f3f3f3;
  padding-top: 30px;
  padding-left: 15px;
  padding-right: 15px;



`


const style = {
  display: "flex"
};


const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 18px;
  column-gap: 6px;
  width: 100%;
  padding: 4px 0 8px;
`
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &:active { transform: scale(0.96); }
  transition: transform .12s ease;
`
const BoxImg = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: #F9F9F9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`
const BoxLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #131313;
  line-height: 1.3;
  text-align: center;
  word-break: keep-all;
`

const FilterBox = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: ${({$clickstatus}) => $clickstatus == true ? ('#FF7125') :('#fff') };
  border:  ${({$clickstatus}) => $clickstatus == true ? (null) :('1px solid #C3C3C3') };
  margin-right: 3px;
  border-radius: 4px;
  padding: 0px 15px;
  height:30px;
  flex: 0 0 auto; /* 아이템의 기본 크기 유지 */

`
const FilterBoxText = styled.div`
color: ${({$clickstatus}) => $clickstatus == true ? ('#FFF') :('#131313') };
font-size:14px;
margin-left:5px;
font-weight:600;

`

const StickyPos = styled.div`
  position: sticky;
  top:0px;

`

const Bannerstyle={
  width: '100%',
  borderRadius: '10px',
  margin: '20px 0px',
}

/* 관광지 배너 자리에 들어간 이용 안내 (형 리뷰 2026-08-12)
   CORE 의 ①~③ 흐름을 그대로 세 줄로 보여준다. */
const GuideCard = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #FAFAFA;
  border: 1px solid #EFEFEF;
  border-radius: 12px;
  padding: 18px 20px;
`
const GuideTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #131313;
  margin-bottom: 12px;
`
const GuideStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 15px;
  line-height: 1.55;
  color: #4B4B4B;
  & + & {
    margin-top: 9px;
  }
`
const GuideNo = styled.span`
  flex-shrink: 0;
  color: #FF4E19;
  font-weight: 700;
`

const Inputstyle ={

  background: '#FFF',
  width: '75%',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 20px 0px 20px',
  height : '40px',
  border : "1px solid #FF7125",
  position :"absolute"

}
const Searchstyle={
  position: "absolute",
  left: '15px'
}

const InputLine = styled.div`
  width: 95%;
  background: rgb(249, 249, 249);
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

`
const SearchElementStyle ={

  height: '80px',
  background: "white",
  width: '100%', 
  marginBottom: '10px',
}





/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


// 홍여사 서비스 — 청소 / 집안일 / 아이 / 돌봄 / 반려 순으로 묶어 배열한다.
// 누르면 그 종류의 일 등록으로 바로 간다(①일 올리기 진입점). 필터가 아니다. — CORE.md
const WorkItems=[
  // 청소
  {name : WORKNAME.HOMECLEAN,      img:imageDB.house,        img2:imageDB.housegray},
  {name : WORKNAME.BUSINESSCLEAN,  img:imageDB.business,     img2:imageDB.businessgray},
  {name : WORKNAME.MOVECLEAN,      img:imageDB.move,         img2:imageDB.movegray},
  // 집안일
  {name : WORKNAME.FOODPREPARE,    img:imageDB.cook,         img2:imageDB.cookgray},
  {name : WORKNAME.SHOPPING,       img:imageDB.shopping,     img2:imageDB.shoppinggray},
  {name : WORKNAME.CARRYLOAD,      img:imageDB.carry,        img2:imageDB.carrygray},
  {name : WORKNAME.ERRAND,         img:imageDB.help,         img2:imageDB.helpgray},
  // 아이
  {name : WORKNAME.BABYCARE,       img:imageDB.babycare,     img2:imageDB.babycaregray},
  {name : WORKNAME.GOOUTSCHOOL,    img:imageDB.gooutschool,  img2:imageDB.gooutschoolgray},
  {name : WORKNAME.LESSON,         img:imageDB.lesson,       img2:imageDB.lessongray},
  {name : WORKNAME.GOSCHOOLEVENT,  img:imageDB.schoolevent,  img2:imageDB.schooleventgray},
  // 돌봄
  {name : WORKNAME.PATIENTCARE,    img:imageDB.patientcare,  img2:imageDB.patientcaregray},
  {name : WORKNAME.GOHOSPITAL,     img:imageDB.hospital,     img2:imageDB.hospitalgray},
  // 반려
  {name : WORKNAME.GODOGWALK,      img:imageDB.dog,          img2:imageDB.doggray},
  {name : WORKNAME.GODOGHOSPITAL,  img:imageDB.doghospital,  img2:imageDB.doghospitalgray},
]

const FilterItems=[
  {name : FILTERNAME.INIT, img:imageDB.house, img2:imageDB.house},
  {name : FILTERNAME.SERVICE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PRICE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PERIOD, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.DISTNACE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PROCESS, img:imageDB.house, img2:imageDB.house},
]

/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileMaincontainer =({containerStyle}) =>  {

  const reduxdispatch = useDispatch();
  const {value} = useSelector((state)=> state.menu);
  const { dispatch, user } = useContext(UserContext);
  console.log("TCL: MobileMaincontainer -> value", value)

  
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();

  // const [popupstatus1, setPopupstatus1] = useState(false);
  // const [popupstatus2, setPopupstatus2] = useState(false);
  // const [popupstatus3, setPopupstatus3] = useState(false);
  // const [bannerimg, setBannerimg] = useState([]);
  const [workitems, setWorkitems] = useState([]);
  const [displayitems, setDisplayitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);
  const [menu, setMenu] = useState('');

  const [showNewDiv, setShowNewDiv] = useState(true);

  const [search, setSearch] = useState('');
  const recordRef = useRef(null);
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);

  const [totalset, setTotalset] = useState(0);

  const [servicepopup, setServicepopup] = useState(false);
  const [pricepopup, setPricepoupup] = useState(false);
  const [periodpopup, setPeriodpopup] = useState(false);
  const [distancepopup, setDistancepopup] = useState(false);
  const [processpopup, setProcesspopup] = useState(false);

  const [servicefilter, setServicefilter] = useState([]);
  const [pricefilter, setPricefilter] = useState([]);
  const [periodfilter, setPeriodfilter] = useState([]);
  const [distancefilter, setDistancefilter] = useState([]);
  const [processfilter, setProcessfilter] = useState([]);

  const [refresh, setRefresh] = useState(1);
  const [init, setInit] = useState(false);
  const inputRef = useRef(null);

  console.log("TCL: MobileMaincontainer -> user", user);

  useLayoutEffect(() => {
    setWidth(elementRef.current.offsetWidth);
    setRefresh((refresh) => refresh +1);

  }, []);



  useEffect(() => {
    if (document.activeElement.tagName === 'INPUT') {
      setTimeout(() => {
          document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // 키보드가 완전히 나타날 때까지 대기
    }

  }, []);


  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   return () => {};
  // }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setShowNewDiv(showNewDiv);
    setMenu(menu);
    setTotalset(totalset);
    setDisplayitems(displayitems);

    setServicefilter(servicefilter);
    setPricefilter(pricefilter);
    setPeriodfilter(periodfilter);
    setDistancefilter(distancefilter);
    setProcessfilter(processfilter);

    setServicepopup(servicepopup);
    setPricepoupup(pricepopup);
    setPeriodpopup(periodpopup);
    setDistancepopup(distancepopup);
    setProcesspopup(processpopup);
    setInit(init);

  },[refresh])




  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * ! 홍여사 요청 업무를 초기 로딩시에 구해온 데이타로 세팅 한다
   * ! 현재 페이지에서 리플레시 햇을때 서버에서 데이타를 구해 올수 있어야 한다 서비스 사용 : ReadWork()
   * 
   */
  // useEffect(()=>{
  //   const now = moment();
  //   async function FetchLocation(){
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         const { latitude, longitude } = pos.coords;

  //         // Geocoder를 사용하여 좌표를 주소로 변환
  //         const geocoder = new kakao.maps.services.Geocoder();
  //         geocoder.coord2Address(longitude, latitude, (result, status) => {
  //           if (status === kakao.maps.services.Status.OK) {
  //             const address = result[0].address;

              
  //             console.log("TCL: FetchLocation -> ", address);
            
  //             user.address_name = address.address_name;
             

  //             geocoder.addressSearch(address.address_name, (result, status) => {
  //               if (status === window.kakao.maps.services.Status.OK) {
  //                   const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

  //                   user.latitude = result[0].y;
  //                   user.longitude = result[0].x;
  //                   dispatch(user);
              
  //               }
  //             });

  //             dispatch(user);
  //             console.log("TCL: FetchLocation -> ", user );
            

         
  //           }else{
      
  //           }
  //         });
   
  //       },
  //       (err) => {
  //         console.error(err);
  //       }
  //     );
  //   };
  // }, [])

  const scrollToInput = () => {
    
    console.log("TCL: scrollToInput -> ", )
    // 요소를 화면 중앙에 위치시킴
    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 추가적인 스크롤을 통해 요소를 화면 중앙보다 아래로 위치시킴
    setTimeout(() => {
        window.scrollBy(0, 50); // 스크롤을 50px 아래로 추가 이동
    }, 300); // smooth 스크롤의 애니메이션 시간이 약간의 지연을 줌  
  }

  /**
   * useSelector menu 가 변경됨을 감지 함에 따라 호출되는  Hook 함수
   * 데이타를 서버로 부터 불러와서 FilterwokrItems 함수로 걸러진값을 workitems 에 설정 해준다
   */

  useEffect(()=>{
    console.log("TCL: MobileMaincontainer -> useEffect", user);

    
    setRefresh((refresh) => refresh +1);
    async function FetchData(){
      let serverworkitems = data.workitems;

      if(serverworkitems.length == 0){
        const latitude = user.latitude;
        const longitude = user.longitude;
        serverworkitems = await ReadWork({latitude, longitude});
      }

      setWorkitems(serverworkitems);
      setDisplayitems(serverworkitems);

    }
    FetchData();
    setRefresh((refresh) => refresh +1);
  },[])


  useLayoutEffect(()=>{

    console.log("TCL: MobileMaincontainer -> useEffect 2");
    // if(value != REFRESHTYPE){
    //   return;
    // }
 //   setInit(true);


    async function FetchData(){

   //   await useSleep(1000);
      const latitude = user.latitude;
      const longitude = user.longitude;
      const serverworkitems = await ReadWork({latitude, longitude});

      data.workitems = serverworkitems;
      datadispatch(data);

      setWorkitems(serverworkitems);
      setDisplayitems(serverworkitems);
  //    setInit(false);

    }

    FetchData();
    reduxdispatch(RESET());
  
  },[value])

  useEffect(()=>{
    console.log("TCL: MobileMaincontainer -> useEffect 3");
    async function FetchData(){
      let serverworkitems = data.workitems;
      console.log("TCL: FetchData -> serverworkitems", serverworkitems);

      if(serverworkitems.length == 0){
        const latitude = user.latitude;
        const longitude = user.longitude;
        serverworkitems = await ReadWork({latitude, longitude});
      }

      setWorkitems(serverworkitems);
      setDisplayitems(serverworkitems);

      setRefresh((refresh) => refresh +1);
      console.log("TCL: FetchData -> serverworkitems", serverworkitems);
    }

    FetchData();

    reduxdispatch(RESET());
 
  },[value])

  /**
   *  필터 값에 의해서 다시 데이타를 정리 해주는 함수
   *  WORKNAME.ALLWORK 인경우는 모든 값을 보여준다
   */
  function FilterWorkitems(filter, workitems){
    let items = [];
    workitems.map((data) =>{

      if(filter == WORKNAME.ALLWORK)
      {
        items.push(data);
      }else{
        if(data.WORKTYPE == filter){
          items.push(data);
        }
      }
    })
    return items;
  }

  /**
   * 단위 일감에서 해당 일감을 클릭햇을때 내주변으로 이동 할수 있도록 한다
   * @param 해당 work_id 와 타입을 보내주어야 한다
   */
  const _handleSelectWork = (WORK_ID, WORKTYPE) =>{
   navigate("/Mobilework" ,{state :{WORK_ID :WORK_ID, TYPE : FILTERITMETYPE.HONG, WORKTYPE :WORKTYPE }});

  }
  const positioncallback = () =>{
    setCurrentloading(true);
    setRefresh((refresh) => refresh +1);
  } 

  const _handlecurrentloadingcallback = ()=> {
    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }

  const AiSearchChange = async(input) =>{
    setSearch(input);
    setRefresh((refresh) => refresh +1);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      _handleAI();
    }
  };

  const _handleAI = async() =>{
    navigate("/Mobilesearch" ,{state :{search :search}});
    setRefresh((refresh) => refresh +1);
  }

  /**
   * 상단 카테고리 = ① 일 올리기 진입점.
   * 카테고리를 고르면 해당 종류의 일 등록 화면으로 바로 간다. (CORE.md)
   */
  const _handlebasicmenuclick = (checkmenu) => {
    const key = Object.keys(WORKNAME).find((k) => WORKNAME[k] === checkmenu);
    const totalset = WORKPOLICY[key] ?? 0;
    navigate("/Mobileregist", { state: { WORKTYPE: checkmenu, WORKTOTAL: totalset } });
  }

  const _handlefiltermenuclick = async(checkmenu) =>{

    if(checkmenu == FILTERNAME.INIT){   

      console.log("TCL: _handlefiltermenuclick -> checkmenu", checkmenu, FILTERNAME.INIT)

      setInit(true);
      setRefresh((refresh) => refresh +1);

      setServicefilter([]);
      setPricefilter([]);
      setPeriodfilter([]);
      setDistancefilter([]);
      setProcessfilter([]);



      async function FetchData(){
      console.log("TCL: FetchData -> _handlefiltermenuclick 1", init)

        await useSleep(1000);
        console.log("TCL: FetchData -> _handlefiltermenuclick 2")
        const latitude = user.latitude;
        const longitude = user.longitude;

        const serverworkitems = await ReadWork({latitude, longitude});

        data.workitems = serverworkitems;
        datadispatch(data);


        setWorkitems(serverworkitems);
        setDisplayitems(serverworkitems);
        setInit(false);
  
      }

      FetchData();

  
      setRefresh((refresh) => refresh +1);

    }
    else if(checkmenu == FILTERNAME.SERVICE){
      setServicepopup(true);
    }else if(checkmenu == FILTERNAME.PRICE){
      setPricepoupup(true);
    }else if(checkmenu == FILTERNAME.PERIOD){
      setPeriodpopup(true);
    }else if(checkmenu == FILTERNAME.DISTNACE){
      setDistancepopup(true);
    }else if(checkmenu == FILTERNAME.PROCESS){
      setProcesspopup(true);
    }
   
    setRefresh((refresh) => refresh +1);
  
  }
  const MobileServiceFilterCallback = (filterary)=>{
     console.log("TCL: MobileServiceFilterCallback -> MobileServiceFilterCallback", workitems)

    if(filterary.length != 0){
      setServicefilter(filterary);
    }

    setServicepopup(false);

    const displayitems = workfilterapply(workitems);
    setDisplayitems(displayitems);

    setRefresh((refresh) => refresh +1);

  }
  const MobilePriceFilterCallback = (filterary)=>{

    if(filterary.length != 0){
      setPricefilter(filterary);
    }

    setPricepoupup(false);
    setRefresh((refresh) => refresh +1);

  }
  const MobilePeriodFilterCallback = (filterary)=>{

    if(filterary.length != 0){
      setPeriodfilter(filterary);
    }

    setPeriodpopup(false);
    setRefresh((refresh) => refresh +1);

  }
  const MobileDistanceFilterCallback = (filterary)=>{

    if(filterary.length != 0){
      setDistancefilter(filterary);
    }

    setDistancepopup(false);
    setRefresh((refresh) => refresh +1);

  }
  const MobileProcessFilterCallback = (filterary)=>{

    if(filterary.length != 0){
      setProcessfilter(filterary);
    }

    setProcesspopup(false);
    setRefresh((refresh) => refresh +1);

  }
  function filterenablecheck(name){

    if(name == FILTERNAME.SERVICE){

      if(servicefilter.length >0){
        return true;
      }else{
        return false;
      }
    }else if(name == FILTERNAME.PRICE){

      if(pricefilter.length >0){
        return true;
      }else{
        return false;
      }
    }else if(name == FILTERNAME.PERIOD){

      if(periodfilter.length >0){
        return true;
      }else{
        return false;
      }
    }else if(name == FILTERNAME.DISTNACE){

      if(distancefilter.length >0){
        return true;
      }else{
        return false;
      }
    }else if(name == FILTERNAME.PROCESS){

      if(processfilter.length >0){
        return true;
      }else{
        return false;
      }
    }
    else{
      return false;
    }

  }

  function getfilters(name){

    if(name == FILTERNAME.SERVICE){
      if(servicefilter.length >0){
        return "+" +servicefilter.length;
      }else{
        return "";
      }
    }else if(name == FILTERNAME.PRICE){
      if(pricefilter.length >0){
        return "+" +pricefilter.length;
      }else{
        return "";
      }
    }else if(name == FILTERNAME.PERIOD){
      if(periodfilter.length >0){
        return "+" +periodfilter.length;
      }else{
        return "";
      }
    }else if(name == FILTERNAME.DISTNACE){
      if(distancefilter.length >0){
        return "+" +distancefilter.length;
      }else{
        return "";
      }
    }else if(name == FILTERNAME.PROCESS){
      if(processfilter.length >0){
        return "+" +processfilter.length;
      }else{
        return "";
      }
    }else{
      return "";
    }

  }
  function workfilterapply(items){
    let itemsTmp = [];

    if(items.length == 0){
      return itemsTmp;
    }

    let itemsservicefilter = [];
    items.map((data)=>{
      if(servicefilter.includes(data.WORKTYPE)){
        itemsservicefilter.push(data);
        console.log("TCL: workservicefilterapply -> data", data)
      }
    })

    if(servicefilter.length == 0){
      itemsservicefilter = items;
    }

    let itemspricefilter = [];
    itemsservicefilter.map((data)=>{
      if(pricefilter.includes(data.WORK_INFO[2].result)){
        itemspricefilter.push(data);
        console.log("TCL: workservicefilterapply -> data", data)
      }
    })

    if(pricefilter.length == 0){
      itemspricefilter = itemsservicefilter;
    }

    return itemspricefilter;

  }

  



  return (
    <>
      <div ref={elementRef}>
      {
        init == true ? (<LottieAnimation containerStyle={LoadingMainAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}/>) :(  
        <Container  style={containerStyle} width={width}  >
          <Column style={{marginBottom:20}}>



              <Label label={'홍여사 서비스'} />


              <Column style={{width:"100%", padding:"0 24px", boxSizing:"border-box"}}>
                <CategoryGrid>
                  {
                    WorkItems.map((data, index)=>(
                      <Box key={index} onClick={()=>{_handlebasicmenuclick(data.name)}}>
                        <BoxImg><img src={data.img} alt={data.name} style={{width:48, height:48, objectFit:"contain"}}/></BoxImg>
                        <BoxLabel>{data.name}</BoxLabel>
                      </Box>
                    ))
                  }
                </CategoryGrid>
              </Column>


              <Column style={{width:"100%", padding:"0 24px", margin:"24px auto 0px", boxSizing:"border-box"}}>
                <GuideCard>
                  <GuideTitle>일손이 필요하세요?</GuideTitle>
                  <GuideStep><GuideNo>1</GuideNo><span>위에서 필요한 일을 골라 등록하세요.</span></GuideStep>
                  <GuideStep><GuideNo>2</GuideNo><span>가까운 홍여사들이 지원합니다.</span></GuideStep>
                  <GuideStep><GuideNo>3</GuideNo><span>마음에 드는 분을 골라 연결됩니다.</span></GuideStep>
                </GuideCard>
              </Column>

          </Column>
  
          <StickyPos>
          <div className="new-div">
            {
              FilterItems.map((data, index)=>(
                <Fragment key={data.name}>
                {
                  index == 0 && <FilterBox style={{padding:"0px 10px"}} onClick={()=>{_handlefiltermenuclick(data.name)}} $clickstatus={filterenablecheck(data.name)}>
                    <img src={imageDB.init} style={{width:'16px', height:"16px"}}/>
                </FilterBox>
                }
                {
                  index != 0 && <FilterBox onClick={()=>{_handlefiltermenuclick(data.name)}} $clickstatus={filterenablecheck(data.name)}>
                  <FilterBoxText $clickstatus={filterenablecheck(data.name)}>{data.name}
                  {getfilters(data.name)}   
                  </FilterBoxText>
                </FilterBox>
                }
                
                </Fragment>

              ))
            }
          </div> 
          </StickyPos>
          <Column>

        {
            displayitems.length > 0  ?
            (<SubContainer>
            <div ref={recordRef}>
      
            <ResultLabel label={menu + '일감'} result = {displayitems.length} unit={'건'}/>
            <FlexstartRow style={{flexWrap:"wrap"}}>
            {
              displayitems.map((item, index)=>(
                <MobileWorkItem key={index}  index={index} width={'100%'} 
                workdata={item} onPress={()=>{_handleSelectWork(item.WORK_ID, item.WORKTYPE)}}/>  
              ))
            }
            </FlexstartRow>
            </div>
            </SubContainer>) :(<Empty content={'등록된 일감이 없습니다'} height={150}/>)
          }
          </Column>
      
          <MobileStoreInfo height={200} containerStyle={{marginBottom:50}} />
        </Container>)
      }

      {
        servicepopup == true && <MobileServiceFilter callback={MobileServiceFilterCallback} filterhistory={servicefilter}/>
      }

      {
        pricepopup == true && <MobilePriceFilter callback={MobilePriceFilterCallback} filterhistory={pricefilter}/>
      }

      {
        periodpopup == true && <MobilePeriodFilter callback={MobilePeriodFilterCallback} filterhistory={periodfilter}/>
      }

      {
        distancepopup == true && <MobileDistanceFilter callback={MobileDistanceFilterCallback} filterhistory={distancefilter}/>
      }
      {
        processpopup == true && <MobileProcessFilter callback={MobileProcessFilterCallback} filterhistory={processfilter}/>
      }

      </div>


    </>


  );

}

export default MobileMaincontainer;

