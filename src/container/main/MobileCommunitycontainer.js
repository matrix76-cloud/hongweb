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
import LottieAnimation from "../../common/LottieAnimation";
import { useSleep } from "../../utility/common";
import { LIFEMENU, TOURISTMENU } from "../../utility/life";
import MobileTourLife from "../../components/MobileLifeTour";
import MobilePerformanceLife from "../../components/MobileLifePerformance";
import MobileMedicalLife from "../../components/MobileLifeMedical";
import MobileLifePerformance from "../../components/MobileLifePerformance";
import MobileLifeMedical from "../../components/MobileLifeMedical";
import MobileLifeTour from "../../components/MobileLifeTour";
import MobileLifeFamily from "../../components/MobileLifeFamily";
import MobileLifeConvenience from "../../components/MobileLifeConvenience";

const Container = styled.div`
  padding:50px 15px 0px 15px;
  min-height:1500px;
`


const style = {
  display: "flex"
};

const FlexMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none;
  margin-top:10px;


`


const Box = styled.div`

  margin-bottom: 20px;
  background: ${({clickstatus}) => clickstatus == true ? ('#fff') :('#fff')};
  color :  ${({clickstatus}) => clickstatus == true ? ('#FF7125') :('#636363')};
  border :  ${({clickstatus}) => clickstatus == true ? ('2px solid #FF7125') :(null)};
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width:${({clickstatus}) => clickstatus == true ? ('68px') :('70px')};
  height : 70px;
  margin-right: 2px;
  z-index: 2;
  overflow-x: auto;
  flex: 0 0 auto;
  border-radius:100px;

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

const CommunityItems =[
  {name : LIFEMENU.TOUR ,img :imageDB.tour},
  {name : LIFEMENU.PERFORMANCE, img : imageDB.performance},
  {name : LIFEMENU.MEDICAL, img : imageDB.medical},
  {name : LIFEMENU.FOOD, img : imageDB.food},
  {name : LIFEMENU.CONVENIENCE, img : imageDB.convenience},
  {name : LIFEMENU.BOARD, img : imageDB.board},

]





/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;



/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileCommunitycontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);
  const [menu, setMenu] = useState(LIFEMENU.TOUR);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setMenu(menu);

  },[refresh])

  /**

   */
  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){

      await useSleep(1000);
      setCurrentloading(false);
    } 
    FetchData();

  }, [])

  const _handlemenu= (menu)=>{
    setMenu(menu);
    setRefresh((refresh) => refresh +1);
  }



  return (
    <>

    {

      <Container style={containerStyle}>
    

        <Column style={{ position: "sticky",top: "50px"}}>
            <Label label={'커뮤니티 서비스'}/>
            <FlexMenu>
              {
                CommunityItems.map((data, index)=>(
                  <Box onClick={()=>{_handlemenu(data.name)}} clickstatus={menu == data.name}>
                    <img src={data.img} width={44}/>
                    <div style={{ fontSize:11, marginTop:5}}>{data.name}</div>
                  </Box>
                ))
              }
            
            </FlexMenu>

            {
              menu == LIFEMENU.TOUR && <MobileLifeTour/>
            }
            {
              menu == LIFEMENU.PERFORMANCE && <MobileLifePerformance />
            }
            {
              menu == LIFEMENU.MEDICAL && <MobileLifeMedical />
            }
            {
              menu == LIFEMENU.FOOD && <MobileLifeFamily />
            }
            {
              menu == LIFEMENU.CONVENIENCE && <MobileLifeConvenience />
            }

        </Column>


      </Container>
    }


    </>


  );

}

export default MobileCommunitycontainer;

