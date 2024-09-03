import React, { Component, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import StoreInfo from "../../components/StoreInfo";
import { DataContext } from "../../context/Data";


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME, WORKPOLICY } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import MobileStoreInfo from "../../components/MobileStoreInfo";
import Swipe from "../../common/Swipe";
import SlickSliderComponent from "../../common/Swipe";
import { useSleep } from "../../utility/common";
import { FILTERNAME } from "../../utility/fitler";

import { FiTerminal } from "react-icons/fi";
import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import MobilePriceFilter from "../../modal/MobilePriceFilterPopup/MobilePriceFilter";
import MobilePeriodFilter from "../../modal/MobilePeriodFilterPopup/MobilePeriodFilter";
import MobileDistanceFilter from "../../modal/MobileDistanceFilterPopup/MobileDistanceFilter";
import MobileProcessFilter from "../../modal/MobileProcessFilterPopup/MobileProcessFilter";
import ResultLabel from "../../common/ResultLabel";

const Container = styled.div`
  padding:50px 0px 0px 0px;
  width: 100%;
  margin : 0 auto;
  min-height:800px;

`
const SubContainer = styled.div`
  margin: 0 auto;
  background: #f9f9f9;
  padding-top: 30px;
  padding-left: 15px;
  padding-right: 15px;

`


const style = {
  display: "flex"
};


const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  width: 25%;
  border-radius: 15px;
  padding : 5px 0px;


`
const BoxImg = styled.div`
  border-radius: 30px;
  background: ${({clickstatus}) => clickstatus == true ? ('#34313124') :('#fff') };
  padding: 10px;
  display :flex;
`

const FilterBox = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: ${({clickstatus}) => clickstatus == true ? ('#FF7125') :('#fff') };
  border:  ${({clickstatus}) => clickstatus == true ? (null) :('1px solid #C3C3C3') };
  margin-top:10px;
  margin-right: 3px;

  border-radius: 4px;
  padding: 0px 15px;
  height:30px;
  flex: 0 0 auto; /* 아이템의 기본 크기 유지 */

`
const FilterBoxText = styled.div`
color: ${({clickstatus}) => clickstatus == true ? ('#FFF') :('#131313') };
font-size:12px;
margin-left:5px;
font-weight:600;

`

const Bannerstyle={
  width: '100%',
  borderRadius: '10px',
  margin: '20px 0px',
}

const Inputstyle ={

  background: '#FFF',
  width: '75%',
  borderRadius:'30px',
  fontSize: '16px',
  padding: '0px 20px 0px 20px',
  height : '40px',
  border : "2px solid #FF7125",
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


const WorkItems=[
  {name : WORKNAME.HOMECLEAN, img:imageDB.house, img2:imageDB.housegray},
  {name :WORKNAME.BUSINESSCLEAN, img:imageDB.business, img2:imageDB.businessgray},
  {name :WORKNAME.MOVECLEAN, img:imageDB.move, img2:imageDB.movegray},
  {name :WORKNAME.FOODPREPARE, img:imageDB.cook, img2:imageDB.cookgray},
  {name :WORKNAME.ERRAND, img:imageDB.help, img2:imageDB.helpgray},
  {name :WORKNAME.GOOUTSCHOOL, img:imageDB.gooutschool, img2:imageDB.gooutschoolgray},
  {name :WORKNAME.BABYCARE, img:imageDB.babycare, img2:imageDB.babycaregray},
  {name :WORKNAME.LESSON, img:imageDB.lesson, img2:imageDB.lessongray},
  {name :WORKNAME.PATIENTCARE, img:imageDB.patientcare, img2:imageDB.patientcaregray},
  {name :WORKNAME.CARRYLOAD, img:imageDB.carry, img2:imageDB.carrygray},
  {name :WORKNAME.GOHOSPITAL, img:imageDB.hospital, img2:imageDB.hospitalgray},
  {name :WORKNAME.RECIPETRANSMIT, img:imageDB.recipe, img2:imageDB.recipegray},
  {name :WORKNAME.GOSCHOOLEVENT, img:imageDB.schoolevent, img2:imageDB.schooleventgray},
  {name :WORKNAME.SHOPPING, img:imageDB.shopping, img2:imageDB.shoppinggray},
  {name :WORKNAME.GODOGHOSPITAL, img:imageDB.doghospital, img2:imageDB.doghospitalgray},
  {name :WORKNAME.GODOGWALK, img:imageDB.dog, img2:imageDB.doggray},
]

const FilterItems=[
  {name : FILTERNAME.INIT, img:imageDB.house, img2:imageDB.house},
  {name : FILTERNAME.SERVICE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PRICE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PERIOD, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.DISTNACE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PROCESS, img:imageDB.house, img2:imageDB.house},
]

const BannerItems =[
  imageDB.mobilebanner3,
  imageDB.mobilebanner4,
  imageDB.mobilebanner5,
  imageDB.mobilebanner6,
  imageDB.mobilebanner7,
]

/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileMaincontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  // const [popupstatus1, setPopupstatus1] = useState(false);
  // const [popupstatus2, setPopupstatus2] = useState(false);
  // const [popupstatus3, setPopupstatus3] = useState(false);
  // const [bannerimg, setBannerimg] = useState([]);
  const [workitems, setWorkitems] = useState([]);
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

  const inputRef = useRef(null);

  useLayoutEffect(() => {
    setWidth(elementRef.current.offsetWidth -10);
    console.log("TCL: MobileMaincontainer -> elementRef.current.offsetWidth", elementRef.current.offsetWidth)
  }, []);


  useEffect(() => {
    if (document.activeElement.tagName === 'INPUT') {
      setTimeout(() => {
          document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // 키보드가 완전히 나타날 때까지 대기
    }

  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setShowNewDiv(showNewDiv);
    setMenu(menu);
    setTotalset(totalset);

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

  },[refresh])

  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * ! 홍여사 요청 업무를 초기 로딩시에 구해온 데이타로 세팅 한다
   * ! 현재 페이지에서 리플레시 햇을때 서버에서 데이타를 구해 올수 있어야 한다 서비스 사용 : ReadWork()
   * 
   */
  useEffect(()=>{
    const now = moment();
    async function FetchLocation(){
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Geocoder를 사용하여 좌표를 주소로 변환
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address;

              
              console.log("TCL: FetchLocation -> ", address);
            
              user.address_name = address.address_name;
              user.region_1depth_name = address.region_1depth_name;
              user.region_2depth_name = address.region_2depth_name;
              user.region_3depth_name = address.region_3depth_name;
              user.main_address_no = address.main_address_no;

              geocoder.addressSearch(address.address_name, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                    user.latitude = result[0].y;
                    user.longitude = result[0].x;
                    dispatch(user);
              
                }
              });

              dispatch(user);
              console.log("TCL: FetchLocation -> ", user );
            

         
            }else{
      
            }
          });
   
        },
        (err) => {
          console.error(err);
        }
      );
    };

    // async function FetchData(){
    //   let time = moment(now).subtract(1, "days").unix();
    //   const popupdate2 = window.localStorage.getItem("hongpopup2");
    //   console.log("popupdata", popupdate2/1000, time);
    //   if (popupdate2 /1000 < time) {
    //     setPopupstatus2(true);
    //     console.log("TCL: FetchData -> ",popupstatus2 );
    //   }

    //   const popupdate3 = window.localStorage.getItem("hongpopup3");
    //   console.log("popupdata", popupdate3/1000, time);
    //   if (popupdate3 /1000 < time) {
    //     setPopupstatus3(true);
    //     console.log("TCL: FetchData -> ",popupstatus3 );
    //   }
    //   const workitems = data.workitems;

      
    //   setWorkitems(workitems);

    //   const serverworkitems = await ReadWork();
    //   setWorkitems(serverworkitems);

    //   FetchLocation();

    // } 
    // FetchData();

    // let banner2 = [];
    // banner2.push(imageDB.mobilebanner1);
    // banner2.push(imageDB.mobilebanner2);
    // banner2.push(imageDB.mobilebanner3);
    // setBannerimg(banner2);


  }, [])
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const stickyElement = document.getElementById('sticky-element');
  //     const stickyElementBottom = stickyElement.getBoundingClientRect().bottom;


  //     // 특정 위치에서 새로운 div를 나타나게 함 (예: sticky 요소가 화면 상단에서 100px 떨어질 때)
  //     if (stickyElementBottom < 150) {
  //       setShowNewDiv(true);
  //     } else {
  //       setShowNewDiv(true);
  //     }

  //     setRefresh((refresh) => refresh +1);
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);



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
    async function FetchData(){
      const serverworkitems = data.workitems;
      let items = FilterWorkitems(value, serverworkitems);
      setWorkitems(items);
    }
    FetchData();
    setRefresh((refresh) => refresh +1);
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
  const _handleSelectWork = (WORK_ID) =>{
   navigate("/Mobilwork" ,{state :{WORK_ID :WORK_ID, TYPE : FILTERITMETYPE.HONG}});

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

  const _handlebasicmenuclick = async(checkmenu) =>{

    console.log("TCL: _handlemenuclick -> checkmenu", checkmenu);
    if(menu == checkmenu){
      setMenu("");
   
    }else{
      setMenu(checkmenu);
    }

    let totalset = 0;

    if(checkmenu == WORKNAME.HOMECLEAN){
      setTotalset(WORKPOLICY.HOMECLEAN);
      totalset = WORKPOLICY.HOMECLEAN;
    }else if(checkmenu == WORKNAME.BUSINESSCLEAN){
      setTotalset(WORKPOLICY.BUSINESSCLEAN);
      totalset = WORKPOLICY.BUSINESSCLEAN;
    }else if(checkmenu == WORKNAME.MOVECLEAN){
      setTotalset(WORKPOLICY.MOVECLEAN);
      totalset = WORKPOLICY.MOVECLEAN;
    }else if(checkmenu == WORKNAME.FOODPREPARE){
      setTotalset(WORKPOLICY.FOODPREPARE);
      totalset = WORKPOLICY.FOODPREPARE;
    }else if(checkmenu == WORKNAME.GOOUTSCHOOL){
      setTotalset(WORKPOLICY.GOOUTSCHOOL);
      totalset = WORKPOLICY.GOOUTSCHOOL;
    }else if(checkmenu == WORKNAME.BABYCARE){
      setTotalset(WORKPOLICY.BABYCARE);
      totalset = WORKPOLICY.BABYCARE;
    }else if(checkmenu == WORKNAME.LESSON){
      setTotalset(WORKPOLICY.LESSON);
      totalset = WORKPOLICY.LESSON;
    }else if(checkmenu == WORKNAME.PATIENTCARE){
      setTotalset(WORKPOLICY.PATIENTCARE);
      totalset = WORKPOLICY.PATIENTCARE;
    }else if(checkmenu == WORKNAME.GOHOSPITAL){
      setTotalset(WORKPOLICY.GOHOSPITAL);
      totalset = WORKPOLICY.GOHOSPITAL;
    }else if(checkmenu == WORKNAME.RECIPETRANSMIT){
      setTotalset(WORKPOLICY.RECIPETRANSMIT);
      totalset = WORKPOLICY.RECIPETRANSMIT;
    }else if(checkmenu == WORKNAME.GOSCHOOLEVENT){
      setTotalset(WORKPOLICY.GOSCHOOLEVENT);
      totalset = WORKPOLICY.GOSCHOOLEVENT;
    }else if(checkmenu == WORKNAME.GODOGHOSPITAL){
      setTotalset(WORKPOLICY.GODOGHOSPITAL);
      totalset = WORKPOLICY.GODOGHOSPITAL;
    }else if(checkmenu == WORKNAME.GODOGWALK){
      setTotalset(WORKPOLICY.GODOGWALK);
      totalset = WORKPOLICY.GODOGWALK;
    }else if(checkmenu == WORKNAME.CARRYLOAD){
      setTotalset(WORKPOLICY.CARRYLOAD);
      totalset = WORKPOLICY.CARRYLOAD;
    }
    setRefresh((refresh) => refresh +1);

    navigate("/Mobileregist",{state :{WORKTYPE :checkmenu, WORKTOTAL : totalset}});


    // let items = [];
    // const serverworkitems = data.workitems;
    // if(menu == checkmenu){
    //   setMenu("");
    //   items = FilterWorkitems(WORKNAME.ALLWORK, serverworkitems);
    // }else{
    //   setMenu(checkmenu);
    //   items = FilterWorkitems(checkmenu, serverworkitems);
    // }
    // setWorkitems(items);
    // setRefresh((refresh) => refresh +1);

    // if(recordRef.current){
    // console.log("TCL: _handlebasicmenuclick -> recordRef.current", recordRef.current)
      
   

    //   const elementPosition = recordRef.current.getBoundingClientRect().top;
    //   const offsetPosition = elementPosition - 100; // 100px 오프셋을 추가

    //   window.scrollBy({
    //     top: offsetPosition,
    //     behavior: 'smooth'
    //   });

    // }


  }

  const _handlefiltermenuclick = async(checkmenu) =>{
    if(checkmenu == FILTERNAME.INIT){   
      setServicefilter([]);
      setPricefilter([]);
      setPeriodfilter([]);
      setDistancefilter([]);
      setProcessfilter([]);
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

    if(filterary.length != 0){
      setServicefilter(filterary);
    }

    setServicepopup(false);
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
  function workfilterapply(menu, items){

    let itemsTmp = [];

    if(items == -1){
      return itemsTmp;
    }

    if(menu == WORKNAME.ALLWORK || menu ==''){
      return items;
    }
    items.map((data)=>{
      if(data.WORKTYPE == menu){
        itemsTmp.push(data);
      }
    })

    return itemsTmp;

  }



  return (
    <>
      <div ref={elementRef}>
      <Container  style={containerStyle}>
        <Column >
            <Column style={{width:"90%", margin: "0 auto"}}>
            <Label label={'홍여사 서비스'}/>
            <BetweenRow style={{flexWrap:"wrap", width:"100%"}}>

              {
                WorkItems.map((data, index)=>(
                  <Box onClick={()=>{_handlebasicmenuclick(data.name)}} >
                    <BoxImg clickstatus={menu == data.name}><img src={data.img} style={{width:48, height:48}}/></BoxImg>
                    <div style={{ fontSize:12, color:"#636363", fontWeight:300}}>{data.name}</div>
                  </Box>
                ))
              }
            
            </BetweenRow>

            <SlickSliderComponent width={width + 'px'}  images={BannerItems} />

            <Row  id="sticky-element"  style={SearchElementStyle}>

                <Column style={{width:"100%"}}>
                <InputLine>
                  <input  style={Inputstyle} type="text" placeholder="홍여사 AI에 물어주세요"
                        value={search}
                        ref ={inputRef}
                        onFocus={scrollToInput}
                        onClick={scrollToInput}
                        onChange={(e) => {   
                          AiSearchChange(e.target.value);
                        }}
                        onKeyDown={handleKeyDown} 
                    />
                  <div style={{position:"relative", left: '40%', top: '3px'}}>
                    <img src={imageDB.redsearch} width={22} height={22} onClick={_handleAI} />
                  </div>
                </InputLine>

                <FlexstartRow style={{width:"100%", marginTop:20, marginLeft:'5%'}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5}}>예) 짜장라면 맛있게 끓이기</span>                  
                </FlexstartRow>
                </Column>
            </Row>
            </Column> 
            <div className="new-div">
              {
                FilterItems.map((data, index)=>(
                  <>
                  {
                    index == 0 && <FilterBox style={{padding:"0px 10px"}} onClick={()=>{_handlefiltermenuclick(data.name)}} clickstatus={filterenablecheck(data.name)}>
                      <img src={imageDB.init} style={{width:'16px', height:"16px"}}/>
                  </FilterBox>
                  }
                  {
                    index != 0 && <FilterBox onClick={()=>{_handlefiltermenuclick(data.name)}} clickstatus={filterenablecheck(data.name)}>
                    <FilterBoxText clickstatus={filterenablecheck(data.name)}>{data.name}
                    {getfilters(data.name)}   
                    </FilterBoxText>
                  </FilterBox>
                  }
                  
                  </>
             
                ))
              }
            </div>
            <SubContainer>
            <div ref={recordRef} />
         

              <ResultLabel label={menu + '일감'} result = {workitems.length} unit={'건'}/>
              <FlexstartRow style={{flexWrap:"wrap"}}>
              {
                workitems.map((item, index)=>(
                  <MobileWorkItem key={index}  index={index} width={'100%'} 
                  workdata={item} onPress={()=>{_handleSelectWork(item.WORK_ID)}}/>  
                ))
              }
              </FlexstartRow>
            </SubContainer>
        </Column>
      </Container>

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

    <MobileStoreInfo height={200} />
    </>


  );

}

export default MobileMaincontainer;

