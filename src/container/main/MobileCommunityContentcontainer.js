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
import "./MobileCommunitycontainer.css";
import MobileStoreInfo from "../../components/MobileStoreInfo";
import { ROOMSIZE } from "../../utility/room";
import { ReadRoom } from "../../service/RoomService";
import PCRoomItem from "../../components/PCRoomItem";
import MobileRoomItem from "../../components/MobileRoomItem";
import LottieAnimation from "../../common/LottieAnimation";
import { useSleep } from "../../utility/common";
import { BOARDMENU, CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";
import MobileTourLife from "../../components/MobileLifeTour";
import MobilePerformanceLife from "../../components/MobileLifePerformance";
import MobileMedicalLife from "../../components/MobileLifeMedical";
import MobileLifePerformance from "../../components/MobileLifePerformance";
import MobileLifeMedical from "../../components/MobileLifeMedical";
import MobileLifeTour from "../../components/MobileLifeTour";
import MobileLifeFamily from "../../components/MobileLifeFamily";
import MobileLifeConvenience from "../../components/MobileLifeConvenience";
import MobileLifeTourFestival from "../../components/MobileLifeTourFestival";
import MoblileLifePerformanceEvent from "../../components/MobileLifePerformanceEvent";
import MoblileLifePerformanceCinema from "../../components/MobileLifePerformanceCinema";
import MobileLifeTourRegion from "../../components/MobileLifeTourRegion";
import MobileLifeTourCountry from "../../components/MobileLifeTourCountry";
import MobileLifeTourPicture from "../../components/MobileLifeTourPicture";
import MobileLifeMedicalDrug from "../../components/MobileLifeMedicalDrug";
import MobileLifeMedicalHospital from "../../components/MobileLifeMedicalHospital";
import MobileLifeFoodDrug from "../../components/MobileLifeFoodDrug";
import MobileLifeCampingRegion from "../../components/MobileLifeCampingRegion";
import MobileLifeBoard from "../../components/MobileLifeBoard";

const Container = styled.div`
  padding:50px 0px;
  height: 100%;
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

  background: ${({clickstatus}) => clickstatus == true ? ('#fff') :('#fff')};
  color :  #131313;
  font-size : 13px;
  font-family : 'Pretendard-Regular';
  font-weight:500;
  border :  ${({clickstatus}) => clickstatus == true ? ('1px solid #F9F9F9') :(null)};
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width:${({clickstatus}) => clickstatus == true ? ('30%') :('30%')};
  height : 100px;
  margin-right: 2px;
  z-index: 2;
  overflow-x: auto;
  flex: 0 0 auto;
  margin-left: 2%;
  margin-bottom: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

`

const Guide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Pretendard-SemiBold;
  width: 100%;
  align-items: center;
  padding-left: 5%;
  padding-top: 20px;
  padding-bottom: 10px;
  font-size:18px;

`

const CommunityItems =[
  {name : TOURISTMENU.TOURREGION ,img :imageDB.tour},
  {name : TOURISTMENU.TOURFESTIVAL ,img :imageDB.tour},
  {name : TOURISTMENU.TOURCOUNTRY ,img :imageDB.tour},
  {name : TOURISTMENU.TOURPICTURE ,img :imageDB.tour},

  {name : PERFORMANCEMENU.PERFORMANCEEVENT, img : imageDB.performance},
  {name : PERFORMANCEMENU.PERFORMANCECINEMA, img : imageDB.performance},
  {name : MEDICALMENU.MEDICALMEDICINE, img : imageDB.medical},
  {name : MEDICALMENU.MEDICALHOSPITAL, img : imageDB.medical},
  {name : MEDICALMENU.FOODINFOMATION, img : imageDB.medical},

  {name : CONVENIENCEMENU.CONVENIENCECAMPING, img : imageDB.food},

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

const MobileCommunityContentcontainer =({containerStyle, name}) =>  {

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



  return (
    <>

    {

      <Container style={containerStyle}>
      { name == TOURISTMENU.TOURREGION  && <MobileLifeTourRegion></MobileLifeTourRegion>
      }
      { name == TOURISTMENU.TOURFESTIVAL  && <MobileLifeTourFestival></MobileLifeTourFestival>
      }
      { name == TOURISTMENU.TOURCOUNTRY  && <MobileLifeTourCountry></MobileLifeTourCountry>
      }
      { name == TOURISTMENU.TOURPICTURE  && <MobileLifeTourPicture></MobileLifeTourPicture>
      }
      { name == PERFORMANCEMENU.PERFORMANCEEVENT  && <MoblileLifePerformanceEvent></MoblileLifePerformanceEvent>
      }
      { name == PERFORMANCEMENU.PERFORMANCECINEMA  && <MoblileLifePerformanceCinema></MoblileLifePerformanceCinema>
      }
      { name == MEDICALMENU.MEDICALMEDICINE  && <MobileLifeMedicalDrug></MobileLifeMedicalDrug>
      }
      { name == MEDICALMENU.MEDICALHOSPITAL  && <MobileLifeMedicalHospital></MobileLifeMedicalHospital>
      }
      { name == MEDICALMENU.FOODINFOMATION  && <MobileLifeFoodDrug></MobileLifeFoodDrug>
      }
      { name == MEDICALMENU.MEDICALHOSPITAL  && <MobileLifeMedicalHospital></MobileLifeMedicalHospital>
      }
      { name == CONVENIENCEMENU.CONVENIENCECAMPING  && <MobileLifeCampingRegion></MobileLifeCampingRegion>
      }
      { name == BOARDMENU.BOARD  && <MobileLifeBoard></MobileLifeBoard>
      }


      </Container>
    }


    </>


  );

}

export default MobileCommunityContentcontainer;

