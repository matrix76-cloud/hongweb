import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { WORKNAME } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import MobileStoreInfo from "../../components/MobileStoreInfo";
import { ROOMPOLICY, ROOMSIZE } from "../../utility/room";
import { ReadRoom } from "../../service/RoomService";
import PCRoomItem from "../../components/PCRoomItem";
import MobileRoomItem from "../../components/MobileRoomItem";
import LottieAnimation from "../../common/LottieAnimation";
import { useSleep } from "../../utility/common";
import { FILTERNAME } from "../../utility/fitler";
import SlickSliderComponent from "../../common/Swipe";

import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import MobilePriceFilter from "../../modal/MobilePriceFilterPopup/MobilePriceFilter";
import MobilePeriodFilter from "../../modal/MobilePeriodFilterPopup/MobilePeriodFilter";
import MobileDistanceFilter from "../../modal/MobileDistanceFilterPopup/MobileDistanceFilter";
import MobileProcessFilter from "../../modal/MobileProcessFilterPopup/MobileProcessFilter";
import MobileRoomServiceFilter from "../../modal/MobileRoomServiceFilterPopup/MobileRoomServiceFilter";
import Empty from "../../components/Empty";

const Container = styled.div`
padding:50px 0px 0px 0px;
width: 100%;
margin : 0 auto;
min-height:800px;
`
const SubContainer = styled.div`
  margin: 0 auto;
  background: #f9f9f9;
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
`

const style = {
  display: "flex"
};


// const Box = styled.div`
//   background : #f9f9f9;
//   align-items: center;
//   display: flex;
//   justify-content: center;
//   flex-direction:column;
//   width: 29%;
//   background: #f9f9f9;
//   margin-right: 10px;
//   margin-bottom: 20px;
//   border: ${({clickstatus}) => clickstatus == true ? ('2px solid #ff0000') :('') };
//   border-radius: 15px;
//   padding : 5px 0px;
//   z-index:2;

// `

const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  width: 20%;
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


const InputLine = styled.div`
  width: 95%;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;


`


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

const StickyElementStyle ={
  position: "sticky",
  top: "50px",
  height: '80px',
  background: "white",
  width: '100%', 
  marginBottom: '10px',
  zIndex :'10'
}
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


const RoomItems =[

  {name : ROOMSIZE.SMALLER, img:imageDB.roomsize1, img2:imageDB.roomsize1},
  {name : ROOMSIZE.SMALL, img:imageDB.roomsize2, img2:imageDB.roomsize2},
  {name : ROOMSIZE.MEDIUM, img:imageDB.roomsize3, img2:imageDB.roomsize3},
  {name : ROOMSIZE.LARGE, img:imageDB.roomsize4, img2:imageDB.roomsize4},
  {name : ROOMSIZE.LARGER, img:imageDB.roomsize5, img2:imageDB.roomsize5},
  {name : ROOMSIZE.EXLARGE, img:imageDB.roomsize5, img2:imageDB.roomsize5},


]
const FilterItems=[
  {name : FILTERNAME.INIT, img:imageDB.house, img2:imageDB.house},
  {name : FILTERNAME.SERVICE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PRICE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.DISTNACE, img:imageDB.house, img2:imageDB.house},
  {name :FILTERNAME.PROCESS, img:imageDB.house, img2:imageDB.house},
]

const BannerItems =[
  imageDB.mobilebanner7,
  imageDB.mobilebanner8,
  imageDB.mobilebanner9,
]

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}
/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileRoomcontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [popupstatus1, setPopupstatus1] = useState(false);
  const [popupstatus2, setPopupstatus2] = useState(false);
  const [popupstatus3, setPopupstatus3] = useState(false);

  const [roomitems, setRoomitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);
  const [menu, setMenu] = useState('');

  const [showNewDiv, setShowNewDiv] = useState(false);
  const [width, setWidth] = useState(0);


  const [search, setSearch] = useState('');

  const elementRef = useRef(null);

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
    console.log("TCL: MobileRoomcontainer -> elementRef.current.offsetWidth", elementRef.current.offsetWidth)
  }, []);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setShowNewDiv(showNewDiv);
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
    // setCurrentloading(true);
    async function FetchData(){

      const roomitems = data.roomitems;

      setRoomitems(roomitems);
      await useSleep(100);

      const latitude = user.latitude;
      const longitude = user.longitude;

      const serverroomitems = await ReadRoom({latitude, longitude});
      setRoomitems(serverroomitems);

   
      // setCurrentloading(false);


    } 
    FetchData();

  }, [])


  useEffect(() => {
    const handleScroll = () => {
      const stickyElement = document.getElementById('sticky-element');

      if(stickyElement){
        const stickyElementBottom = stickyElement.getBoundingClientRect().bottom;


        // 특정 위치에서 새로운 div를 나타나게 함 (예: sticky 요소가 화면 상단에서 100px 떨어질 때)
        if (stickyElementBottom < 150) {
          setShowNewDiv(true);
        } else {
          setShowNewDiv(false);
        }
      }
 

      setRefresh((refresh) => refresh +1);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      const serverroomitems = await ReadRoom();
      let items = FilterRoomitems(value, serverroomitems);
      setRoomitems(items);
    }
    //FetchData();
    setRefresh((refresh) => refresh +1);
  },[value])


  /**
   *  필터 값에 의해서 다시 데이타를 정리 해주는 함수
   *  WORKNAME.ALLWORK 인경우는 모든 값을 보여준다
   */
  function FilterRoomitems(filter, workitems){
    let items = [];
    roomitems.map((data) =>{

      if(filter == ROOMSIZE.ALLROOM)
      {
        items.push(data);
      }else{
        if(data.ROOMTYPE == filter){
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
  const _handleSelectWork = (ROOM_ID, ROOMTYPE) =>{
   console.log("TCL: _handleSelectWork -> item", ROOMTYPE, ROOM_ID);
   // navigate("/PCmap" ,{state :{ID :ROOM_ID, TYPE : FILTERITMETYPE.ROOM}});
   navigate("/Mobileworkroom" ,{state :{ROOM_ID :ROOM_ID, TYPE : FILTERITMETYPE.ROOM, ROOMTYPE : ROOMTYPE }});
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
    setRefresh((refresh) => refresh +1);
    let totalset = 0;


    totalset = ROOMPOLICY.SMALL;
  

    navigate("/Mobileregist",{state :{WORKTYPE :checkmenu, WORKTOTAL : totalset}});

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

  return (
    <>

    {

      <div ref={elementRef}>
      {
        currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'}/>) :(<Container style={containerStyle}>
            <Column>
            <Column style={{width:"95%", margin: "0 auto"}}>
            <Label label={'공간대여 서비스'} containerStyle={{paddingLeft:20}}/>
            <Row style={{flexWrap:"wrap", width:"100%", justifyContent:"flex-start"}}>
              {
                RoomItems.map((data, index)=>(
                  <Box onClick={()=>{_handlebasicmenuclick(data.name)}} clickstatus={menu == data.name}>
                    <BoxImg clickstatus={menu == data.name}><img src={data.img} style={{width:45, height:45}}/></BoxImg>
                    <div style={{ fontSize:12, color:"#636363", fontWeight:300}}>{data.name}</div>
                  </Box>
                ))
              }
            
            </Row>
            </Column>
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

                <FlexstartRow style={{width:"100%", marginTop:20, marginLeft:'10%'}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5}}>예) 짜장라면 맛있게 끓이기</span>                  
                </FlexstartRow>
                </Column>
            </Row>
       

            <div className="new-div">
              {
                FilterItems.map((data, index)=>(
                  <>
                  {
                    index == 0 && <FilterBox style={{padding:"0px 10px"}}  onClick={()=>{_handlefiltermenuclick(data.name)}} clickstatus={filterenablecheck(data.name)}>
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
         
              {
                roomitems.length > 0 ? (
                  <SubContainer>
                  <FlexstartRow style={{fontWeight:700, marginLeft:5,marginBottom:10}}>
                  <div style={{color:"#131313", fontSize:"18px"}}>{'등록된 전체공간'}
                  <span style={{color:"#F75100", marginLeft:3}}>{roomitems.length}</span> {'건'}</div>
                   </FlexstartRow>
                  
                  <FlexstartRow style={{flexWrap:"wrap"}}>
                  {
                      roomitems.map((item, index)=>(
                        <MobileRoomItem key={index}  index={index} width={'100%'} 
                        roomdata={item} onPress={()=>{_handleSelectWork(item.ROOM_ID, item.ROOMTYPE)}}/>
                      ))
                    }
                  </FlexstartRow>
                  </SubContainer>
                ) :(<Empty content={'등록된 공간대여가 없습니다'} height={300}/>)

              }



          </Column>
          <MobileStoreInfo height={200} />

        </Container>)
      }

      {
        servicepopup == true && <MobileRoomServiceFilter callback={MobileServiceFilterCallback} filterhistory={servicefilter}/>
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

    }


    </>


  );

}

export default MobileRoomcontainer;

