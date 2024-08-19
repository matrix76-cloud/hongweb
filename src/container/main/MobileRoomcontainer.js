import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { ROOMSIZE } from "../../utility/room";
import { ReadRoom } from "../../service/RoomService";
import PCRoomItem from "../../components/PCRoomItem";
import MobileRoomItem from "../../components/MobileRoomItem";

const Container = styled.div`
  padding:50px 15px 0px 15px;
  min-height:1500px;
`


const style = {
  display: "flex"
};


const Box = styled.div`
  background : #f9f9f9;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  width: 29%;
  background: #f9f9f9;
  margin-right: 10px;
  margin-bottom: 20px;
  border: ${({clickstatus}) => clickstatus == true ? ('2px solid #ff0000') :('') };
  border-radius: 15px;
  padding : 5px 0px;
  z-index:2;

`

const FilterBox = styled.div`

  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: #f6f6f6;
  margin-right: 10px;
  border: ${({clickstatus}) => clickstatus == true ? ('2px solid #ff0000') :('') };
  border-radius: 5px;
  padding: 0px 5px;
  width: 27.5%;
  flex: 0 0 auto; /* 아이템의 기본 크기 유지 */
  z-index:2;

`

const Inputstyle ={

  background: '#f6f6f6',
  width: '90%',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '8px 12px 12px 8px',
  border : "none"

}
const Searchstyle={
  position: "absolute",
  left: '15px'
}




/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const RoomItems =[

  {name : ROOMSIZE.SMALL, img:imageDB.roomsize1, img2:imageDB.roomsize1},
  {name : ROOMSIZE.MEDIUM, img:imageDB.roomsize2, img2:imageDB.roomsize2},
  {name : ROOMSIZE.LARGE, img:imageDB.roomsize3, img2:imageDB.roomsize3},



]


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


  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setShowNewDiv(showNewDiv);
  },[refresh])

  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * ! 홍여사 요청 업무를 초기 로딩시에 구해온 데이타로 세팅 한다
   * ! 현재 페이지에서 리플레시 햇을때 서버에서 데이타를 구해 올수 있어야 한다 서비스 사용 : ReadWork()
   * 
   */
  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){

      const roomitems = data.roomitems;

      
      setRoomitems(roomitems);

      const serverroomitems = await ReadRoom();
      setRoomitems(serverroomitems);
      console.log("TCL: FetchData -> serverroomitems", serverroomitems)



    } 
    FetchData();

  }, [])
  useEffect(() => {
    const handleScroll = () => {
      const stickyElement = document.getElementById('sticky-element');
      const stickyElementBottom = stickyElement.getBoundingClientRect().bottom;


      // 특정 위치에서 새로운 div를 나타나게 함 (예: sticky 요소가 화면 상단에서 100px 떨어질 때)
      if (stickyElementBottom < 150) {
        setShowNewDiv(true);
      } else {
        setShowNewDiv(false);
      }

      setRefresh((refresh) => refresh +1);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);





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
  const _handleSelectWork = (ROOM_ID) =>{
   // navigate("/PCmap" ,{state :{ID :ROOM_ID, TYPE : FILTERITMETYPE.ROOM}});

  }
  const positioncallback = () =>{
    setCurrentloading(true);
    setRefresh((refresh) => refresh +1);
  } 

  const _handlecurrentloadingcallback = ()=> {
    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }

  const AiSearch = async(input) =>{
    setSearch(input);
    setRefresh((refresh) => refresh +1);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      _handleAI();
    }
  };

  const _handleAI = async() =>{

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
  return (
    <>
    {
      currentloading == true && <Loading type={LoadingType.CURRENTPOS} callback={_handlecurrentloadingcallback}/>
    }
    {

      <Container style={containerStyle}>

      <Column>
          <Label label={'공간대여 서비스'}/>
          <Row style={{flexWrap:"wrap", width:"100%"}}>

            {
              RoomItems.map((data, index)=>(
                <Box onClick={()=>{}} clickstatus={menu == data.name}>
                  <div><img src={data.img} style={{width:32, height:32}}/></div>
                  <div style={{ fontSize:12}}>{data.name}</div>
                </Box>
              ))
            }
          
          </Row>
          <Row  id="sticky-element"  style={{width:"100%", position: "sticky",top: "50px",height: "70px", background:"#fff", zIndex:2}}>

            <input  style={Inputstyle} type="text" placeholder="홍여사 AI에 물어주세요 예)짜장라면 끊이는 법"
                  value={search}
                  onChange={(e) => {   
                    AiSearch(e.target.value);
                  }}
                  onKeyDown={handleKeyDown} 
              />
            <div>
              <img src={imageDB.searchgif} width={24} height={24} onClick={_handleAI} />
            </div>
          </Row>

          {showNewDiv && (
            <div className="new-div">
            {
              RoomItems.map((data, index)=>(
                <FilterBox onClick={()=>{}} clickstatus={menu == data.name}>
                  <div><img src={data.img2} style={{width:32, height:32}}/></div>
                  <div style={{ fontSize:12, color:"#788391", marginLeft:5}}>{data.name}</div>
                </FilterBox>
              ))
            }
            </div>
          )}


          <Label label={'님양주시 다산동에 등록된 전체공간'} sublabel={'12건'}/>

          <FlexstartRow style={{flexWrap:"wrap"}}>
          {
              roomitems.map((item, index)=>(
                <>
                {
                  index < 20 &&           
                  <MobileRoomItem key={index}  index={index} width={'100%'} 
                  roomdata={item} onPress={()=>{_handleSelectWork(item.ROOM_ID)}}/>
                }
                </>
              ))
            }
          </FlexstartRow>
      </Column>
      </Container>
    }

    <MobileStoreInfo height={200} />
    </>


  );

}

export default MobileRoomcontainer;

