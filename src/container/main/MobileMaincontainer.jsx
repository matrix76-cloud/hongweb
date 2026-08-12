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
import { FILTERITEMDISTANCE, FILTERITEMPERIOD, FILTERITEMPROCESS, FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import { distanceFunc } from "../../utility/region";
import { WORKSTATUS } from "../../utility/status";
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
import { ReadSupportersByWork } from "../../service/ChatService";
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
  /* 회색 바탕 위에 흰 카드라 얼룩덜룩했다 — 바탕을 흰색으로 (형 리뷰 2026-08-12) */
  background: var(--surface);
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
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`
const BoxLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
  text-align: center;
  word-break: keep-all;
`

const FilterBox = styled.div`
  box-sizing: border-box;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: ${({$clickstatus}) => $clickstatus == true ? ('#FF4E19') : ('#fff')};
  border: 1px solid ${({$clickstatus}) => $clickstatus == true ? ('#FF4E19') : ('var(--border)')};
  border-radius: 8px;
  height: 38px;
  cursor: pointer;

  /* 초기화 아이콘만 고정폭, 나머지 4개가 남는 폭을 균등하게 나눈다 */
  flex: ${({$fixed}) => ($fixed ? '0 0 38px' : '1 1 0')};
  min-width: 0;
  padding: 0 4px;

  &:active { transform: scale(0.97); }
  transition: transform .12s ease;
`

/* 걸린 조건 요약 줄 (형 리뷰 2026-08-13) */
const AppliedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 20px 10px;
  font-size: 14px;
  color: #71717a;
  b { color: #FF4E19; font-weight: 700; }
`
const ClearFilters = styled.button`
  border: none;
  background: none;
  font-family: inherit;
  font-size: 14px;
  color: #71717a;
  text-decoration: underline;
  cursor: pointer;
  padding: 2px;
`

/* 진행 여부 — 칩 대신 필터 줄 바로 아래 체크박스 (형 지시 2026-08-12) */
const ProcessRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;   /* 우측 정렬 (형 지시 2026-08-12) */
  gap: 20px;
  padding: 0 20px 12px;   /* 필터 버튼과 좌우 정렬을 맞춘다 */
`
const ProcessLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: ${({$on}) => ($on ? 600 : 500)};
  color: ${({$on}) => ($on ? '#131313' : '#71717a')};
  cursor: pointer;
  user-select: none;
`
const ProcessCheck = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #FF4E19;
  cursor: pointer;
`
const FilterBoxText = styled.div`
  color: ${({$clickstatus}) => $clickstatus == true ? ('#FFF') : ('#131313')};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 필터 줄 + 진행여부 체크박스. sticky 인데 배경이 없어서
   스크롤된 목록이 그대로 비쳐 "일감 N건" 위에 겹쳐 보였다 (형 리뷰 2026-08-12) */
const StickyPos = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
  padding-top: 12px;
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
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 18px 20px;
`
const GuideTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
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

  background: 'var(--surface)',
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
// kakao 는 전역(window.kakao)을 참조 시점에 읽는다.
// 최상단에서 구조분해하면 SDK 로드 전 undefined 로 굳는다 (Vite=ES모듈, 2026-08-12)


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
  // 진행여부는 칩에서 빼고 바로 아래 체크박스로 뺐다 — 거리순까지 한 줄에 들어와야 한다 (형 지시 2026-08-12)
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
  /* 일감별 지원자 — 카드에 프로필을 겹쳐 보여주려고 한 번만 읽어둔다 (형 리뷰 2026-08-13) */
  const [supporters, setSupporters] = useState({});
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
    ReadSupportersByWork().then(setSupporters).catch(()=>{});
  }, [])

  useEffect(()=>{
    console.log("TCL: MobileMaincontainer -> useEffect", user);

    
    setRefresh((refresh) => refresh +1);
    async function FetchData(){
      // DataProvider 초기값이 {} 라 첫 렌더에선 workitems 가 undefined 다 (2026-08-12)
      let serverworkitems = data.workitems || [];

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
      let serverworkitems = data.workitems || [];
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
  /* 내 정보에서 범위를 바꾸면 홈 목록도 바로 다시 읽는다 (형 지시 2026-08-12) */
  useEffect(() => {
    const onRangeChanged = async () => {
      const latitude = user.latitude;
      const longitude = user.longitude;
      const serverworkitems = await ReadWork({ latitude, longitude });
      data.workitems = serverworkitems;
      datadispatch(data);
      setWorkitems(serverworkitems);
      setDisplayitems(serverworkitems);
      setRefresh((refresh) => refresh + 1);
    };
    window.addEventListener('searchrange:changed', onRangeChanged);
    return () => window.removeEventListener('searchrange:changed', onRangeChanged);
  }, [user.latitude, user.longitude]);

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
    setServicepopup(false);
    if(!filterary || filterary.length == 0){ setRefresh((r)=> r+1); return; }   // 그냥 닫음 = 취소
    setServicefilter(filterary);
    setDisplayitems(workfilterapply(workitems, { service: filterary }));
    setRefresh((refresh) => refresh +1);
  }
  const MobilePriceFilterCallback = (filterary)=>{
    setPricepoupup(false);
    if(!filterary || filterary.length == 0){ setRefresh((r)=> r+1); return; }   // 그냥 닫음 = 취소
    setPricefilter(filterary);
    setDisplayitems(workfilterapply(workitems, { price: filterary }));
    setRefresh((refresh) => refresh +1);
  }
  const MobilePeriodFilterCallback = (filterary)=>{
    setPeriodpopup(false);
    if(!filterary || filterary.length == 0){ setRefresh((r)=> r+1); return; }   // 그냥 닫음 = 취소
    setPeriodfilter(filterary);
    setDisplayitems(workfilterapply(workitems, { period: filterary }));
    setRefresh((refresh) => refresh +1);
  }
  const MobileDistanceFilterCallback = (filterary)=>{
    setDistancepopup(false);
    if(!filterary || filterary.length == 0){ setRefresh((r)=> r+1); return; }   // 그냥 닫음 = 취소
    setDistancefilter(filterary);
    setDisplayitems(workfilterapply(workitems, { distance: filterary }));
    setRefresh((refresh) => refresh +1);
  }
  /**
   * 진행 여부 체크박스 토글.
   * 값 자체는 기존 processfilter 배열을 그대로 쓴다 — 목록 거르는 쪽 로직은 손대지 않았다.
   */
  const _handleprocesscheck = (name)=>{
    const next = processfilter.includes(name) ? processfilter.filter((x)=> x != name) : [...processfilter, name];
    setProcessfilter(next);
    setDisplayitems(workfilterapply(workitems, { process: next }));
    setRefresh((refresh) => refresh +1);
  }

  const MobileProcessFilterCallback = (filterary)=>{
    setProcesspopup(false);
    if(!filterary || filterary.length == 0){ setRefresh((r)=> r+1); return; }
    setProcessfilter(filterary);
    setDisplayitems(workfilterapply(workitems, { process: filterary }));
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

  /**
   * 필터 버튼에 지금 무엇이 걸려 있는지 보여준다 (형 리뷰 2026-08-13 "필터 들어갔는지 표시").
   * 전에는 주황색으로만 바뀌고 "+1" 만 붙어서, 무엇을 골랐는지는 다시 열어봐야 알았다.
   * 이제 고른 값을 그대로 쓰고, 여러 개면 첫 값 뒤에 +N 을 붙인다.
   */
  function filterlabel(name){
    const map = {
      [FILTERNAME.SERVICE] : servicefilter,
      [FILTERNAME.PRICE]   : pricefilter,
      [FILTERNAME.PERIOD]  : periodfilter,
      [FILTERNAME.DISTNACE]: distancefilter,
      [FILTERNAME.PROCESS] : processfilter,
    };
    const picked = map[name] || [];
    if(picked.length == 0) return name;
    return picked.length == 1 ? picked[0] : `${picked[0]} +${picked.length - 1}`;
  }

  /** 지금 걸려 있는 조건 수 */
  function filtercount(){
    return [servicefilter, pricefilter, periodfilter, distancefilter].filter((x)=> x.length > 0).length;
  }

  /** 조건을 모두 푼다 */
  function clearfilters(){
    setServicefilter([]);
    setPricefilter([]);
    setPeriodfilter([]);
    setDistancefilter([]);
    setDisplayitems(workfilterapply(workitems, { service: [], price: [], period: [], distance: [] }));
    setRefresh((refresh) => refresh +1);
  }
  /* ── 가격 구간 문자열을 숫자 범위로 ── */
  const PRICE_RANGES = {
    '3만원 이하'   : [0, 30000],
    '3만원 ~ 4만원': [30000, 40000],
    '4만원 ~ 5만원': [40000, 50000],
    '5만원 ~ 6만원': [50000, 60000],
    '6만원 ~ 8만원': [60000, 80000],
    '8만원 이상'   : [80000, Infinity],
  };
  const priceOf = (work)=>{
    const list = work.WORK_INFO || [];
    const i = list.findIndex((x)=> x && x.requesttype == '금액');
    if(i == -1) return null;
    const num = Number(String(list[i].result ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) ? num : null;
  };
  const distanceKmOf = (work)=>{
    const list = work.WORK_INFO || [];
    const i = list.findIndex((x)=> x && x.requesttype == '지역');
    if(i == -1) return null;
    const km = distanceFunc(user.latitude, user.longitude, list[i].latitude, list[i].longitude);
    return Number.isFinite(km) ? km : null;
  };

  /**
   * 목록 필터 (형 리뷰 2026-08-12 "필터가 동작하지 않음").
   *
   * 예전 코드는 서비스만 반쯤 보고, 가격은 WORK_INFO[2] 라는 고정 자리를 구간 문자열과
   * 그대로 비교해서 절대 걸리지 않았다. 기간·거리·진행 여부는 아예 보지도 않았다.
   * 여기서 다섯 가지를 모두 적용한다.
   *
   * 방금 고른 값은 state 에 아직 안 들어가 있으므로 override 로 받는다.
   */
  function workfilterapply(items, override = {}){
    const service  = override.service  ?? servicefilter;
    const price    = override.price    ?? pricefilter;
    const period   = override.period   ?? periodfilter;
    const distance = override.distance ?? distancefilter;
    const process  = override.process  ?? processfilter;

    let list = items || [];
    if(list.length == 0) return [];

    // 서비스 종류
    if(service.length > 0){
      list = list.filter((d)=> service.includes(d.WORKTYPE));
    }

    // 견적가 구간
    if(price.length > 0){
      const ranges = price.map((k)=> PRICE_RANGES[k]).filter(Boolean);
      if(ranges.length){
        list = list.filter((d)=>{
          const p = priceOf(d);
          if(p == null) return false;
          return ranges.some(([lo, hi])=> p >= lo && p <= hi);
        });
      }
    }

    // 기간 — 올라온 지 며칠 안 된 것만. "전체기간"은 거르지 않는다
    if(period.length > 0 && !period.includes(FILTERITEMPERIOD.ONE)){
      const days = Math.max(...period.map((k)=>{
        const m = String(k).match(/D\+(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      }));
      if(days > 0){
        const limit = Date.now() - days * 24 * 60 * 60 * 1000;
        list = list.filter((d)=> (d.CREATEDT || 0) >= limit);
      }
    }

    // 거리 — "3km 내외" 면 3km 안쪽
    if(distance.length > 0){
      const km = Math.max(...distance.map((k)=>{
        const m = String(k).match(/(\d+)\s*km/);
        return m ? parseInt(m[1], 10) : 0;
      }));
      if(km > 0){
        list = list.filter((d)=>{
          const v = distanceKmOf(d);
          return v == null ? false : v <= km;
        });
      }
    }

    // 진행 여부 — 둘 다 켜져 있으면 거르지 않는다
    if(process.length == 1){
      const wantOpen = process[0] == FILTERITEMPROCESS.OPEN;
      list = list.filter((d)=> (d.WORK_STATUS == WORKSTATUS.OPEN) == wantOpen);
    }

    return list;
  }

  



  return (
    <>
      <div ref={elementRef}>
      {
        init == true ? (<LottieAnimation containerStyle={LoadingMainAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}/>) :(  
        <Container  style={containerStyle} width={width}  >
          <Column style={{marginBottom:20}}>



              {/* 이 격자는 누르면 그 종류의 일 등록으로 가는 진입점이다.
                  "홍여사 서비스"는 뭘 하라는 건지 안 알려줘서 행동을 부르는 말로 바꿨다 (형 리뷰 2026-08-12) */}
              <Label label={'무슨 일을 맡기실까요?'} containerStyle={{background:'var(--surface)'}} />


              <Column style={{width:"100%", padding:"0 14px", boxSizing:"border-box"}}>
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
                  index == 0 && <FilterBox $fixed onClick={()=>{_handlefiltermenuclick(data.name)}} $clickstatus={filterenablecheck(data.name)}>
                    <img src={imageDB.init} style={{width:'16px', height:"16px"}}/>
                </FilterBox>
                }
                {
                  index != 0 && <FilterBox onClick={()=>{_handlefiltermenuclick(data.name)}} $clickstatus={filterenablecheck(data.name)}>
                  <FilterBoxText $clickstatus={filterenablecheck(data.name)}>
                  {filterlabel(data.name)}
                  </FilterBoxText>
                </FilterBox>
                }
                
                </Fragment>

              ))
            }
          </div>

          {/* 지금 걸린 조건 요약 — 스크롤을 내려도 뭘 걸었는지 알 수 있게 (형 리뷰 2026-08-13) */}
          {
            filtercount() > 0 && (
              <AppliedRow>
                <span>조건 <b>{filtercount()}</b>개 적용중</span>
                <ClearFilters onClick={clearfilters}>모두 해제</ClearFilters>
              </AppliedRow>
            )
          }

          {/* 진행 여부 — 칩 대신 체크박스로 바로 아래에 (형 지시 2026-08-12) */}
          <ProcessRow>
            {[FILTERITEMPROCESS.OPEN, FILTERITEMPROCESS.CLOSE].map((name)=>{
              const on = processfilter.includes(name);
              return (
                <ProcessLabel key={name} $on={on}>
                  <ProcessCheck type="checkbox" checked={on} onChange={()=>{_handleprocesscheck(name)}} />
                  {name == FILTERITEMPROCESS.OPEN ? '진행중 거래' : '마감된 거래'}
                </ProcessLabel>
              );
            })}
          </ProcessRow>
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
                workdata={item} supporters={supporters[item.WORK_ID] || []}
                onPress={()=>{_handleSelectWork(item.WORK_ID, item.WORKTYPE)}}/>  
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

