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
import { ReadCampingRegion, ReadHospitalRegion, ReadHospitalRegion1, ReadPerformanceCinema, ReadPerformanceEvent, ReadTourCountry, ReadTourFestival, ReadTourPicture, ReadTourRegion } from "../../service/LifeService";
import { CONVENIENCEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";
import LifeTourRegion from "../../components/LifeTourRegion";
import LifeTourFestival from "../../components/LifeTourFestival";
import LifeTourCountry from "../../components/LifeTourCountry";
import LifePerformanceEvent from "../../components/LifePerformanceEvent";
import LifePerformanceCinema from "../../components/LifePerformanceCinema";
import LifeMedicalDrug from "../../components/LifeMedicalDrug";
import LifeHealthFood from "../../components/LifeHealthFood";

import { xml2json } from 'xml-js';
import ConvenienceCampingRegion from "../../components/LifeCampingRegion";
import LifeCampingRegion from "../../components/LifeCampingRegion";
import LifeHospitalRegion from "../../components/LifeHospital";
import LifeHospital from "../../components/LifeHospital";
import LottieAnimation from "../../common/LottieAnimation";
import LifeTourPicture from "../../components/LifeTourPicture";


const Container = styled.div`

  display:flex;
  flex-direction:column;
`


const style = {
  display: "flex"
};


const LocationText  = styled.div`
  color : #131313;
  font-size:13px;
`
const SearchText = styled.div`
color : #131313;
font-family:'Pretendard-Light';
font-size:10px;
`



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

const PCLifecontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);
  const [currentloading, setCurrentloading] = useState(true);

  const [menu, setMenu] = useState(value);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [tourpictureitem, setTourpictureitem] = useState([]);
  const [tourregionitem, setTourregionitem] = useState([]);
  const [tourfestivalitem, setTourfestivalitem] = useState([]);
  const [tourcountryitem, setTourCountryitem] = useState([]);
  const [performanceeventitem, setPerformanceeventitem] = useState([]);
  const [performancecinemeitem, setPerformancecinemaitem] = useState([]);

  const [hospitalregionitem, setHospitalregionitem] = useState([]);
  const [campingregionitem, setCampingregionitem] = useState([]);
  useLayoutEffect(() => {
  }, []);

  useEffect(() => {

    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
  
  },[refresh])

  useEffect(()=>{
    setCurrentloading(currentloading);
    setMenu(value);
  },[value])

  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * ! 홍여사 요청 업무를 초기 로딩시에 구해온 데이타로 세팅 한다
   * ! 현재 페이지에서 리플레시 햇을때 서버에서 데이타를 구해 올수 있어야 한다 서비스 사용 : ReadWork()
   * 
   */
  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){
      setMenu(TOURISTMENU.TOURFESTIVAL);

    } 
    FetchData();

  }, [])




  /**
   * useSelector menu 가 변경됨을 감지 함에 따라 호출되는  Hook 함수
   * 데이타를 서버로 부터 불러와서 FilterwokrItems 함수로 걸러진값을 workitems 에 설정 해준다
   */

  useEffect(()=>{
    async function FetchData(){
      // const tourpictureitem = await ReadTourPicture();
      // const dataToSavpicture = JSON.parse(tourpictureitem);
      setTourpictureitem(data.tourpictureitem);

      // const tourregionitem = await ReadTourRegion();
      // const dataToSaveregion = JSON.parse(tourregionitem);
      setTourregionitem(data.tourregionitem);
      


      // const tourfestivalitem = await ReadTourFestival();
      // const dataToSavefestival = JSON.parse(tourfestivalitem);
      setTourfestivalitem(data.tourfestivalitem);

      // const tourcountryitem = await ReadTourCountry();
      // const dataToSavecountry = JSON.parse(tourcountryitem);
      setTourCountryitem(data.tourcountryitem);


      // let items = [];
      // const performanceeventitem = await ReadPerformanceEvent();

      // performanceeventitem.map((data, index)=>{
      //  const dataToSave = JSON.parse(data.dateitem);
     
      //   if(dataToSave.response.body != undefined){
      //     dataToSave.response.body.items.map((subdata)=>{
      //       items.push(subdata);
      //     })
     
      //   }
      // })
  
      setPerformanceeventitem(data.performanceeventitem);

      // const performancecinemeitem = await ReadPerformanceCinema();
      // const dataToSavecinema = JSON.parse(performancecinemeitem);
      setPerformancecinemaitem(data.performancecinemaitem);



      // items = [];
      // const hospitalitem = await ReadHospitalRegion1();

      // hospitalitem.map((data, index)=>{

      //   const parser = new DOMParser();
      //   const xmlDoc = parser.parseFromString(data.hospitalitem, "text/xml");
    
    
      //   // 데이터 추출
      //   const xmlitems = xmlDoc.getElementsByTagName("item");
   
  

      //   for (let i = 0; i < xmlitems.length; i++) {
      //     let XPos = "", YPos = "", hospUrl ="", telno ="";
      //     const clCdNm = xmlitems[i].getElementsByTagName("clCdNm")[0].textContent; 
      //     const drTotCnt = xmlitems[i].getElementsByTagName("drTotCnt")[0].textContent; 

      //     const cmdcGdrCnt = xmlitems[i].getElementsByTagName("cmdcGdrCnt")[0].textContent; 
      //     const cmdcIntnCnt = xmlitems[i].getElementsByTagName("cmdcIntnCnt")[0].textContent; 
      //     const cmdcResdntCnt = xmlitems[i].getElementsByTagName("cmdcResdntCnt")[0].textContent; 
      //     const cmdcSdrCnt = xmlitems[i].getElementsByTagName("cmdcSdrCnt")[0].textContent; 


      //     const detyGdrCnt = xmlitems[i].getElementsByTagName("detyGdrCnt")[0].textContent; 
      //     const detyIntnCnt = xmlitems[i].getElementsByTagName("detyIntnCnt")[0].textContent; 
      //     const detyResdntCnt = xmlitems[i].getElementsByTagName("detyResdntCnt")[0].textContent; 
      //     const detySdrCnt = xmlitems[i].getElementsByTagName("detySdrCnt")[0].textContent; 



      //     const mdeptGdrCnt = xmlitems[i].getElementsByTagName("mdeptGdrCnt")[0].textContent; 
      //     const mdeptIntnCnt = xmlitems[i].getElementsByTagName("mdeptIntnCnt")[0].textContent; 
      //     const mdeptResdntCnt = xmlitems[i].getElementsByTagName("mdeptResdntCnt")[0].textContent; 
      //     const mdeptSdrCnt = xmlitems[i].getElementsByTagName("mdeptSdrCnt")[0].textContent; 

      //     const yadmNm = xmlitems[i].getElementsByTagName("yadmNm")[0].textContent;

      //     const addr = xmlitems[i].getElementsByTagName("addr")[0].textContent;
      //     if(xmlitems[i].getElementsByTagName("XPos")[0] != undefined){
      //       XPos = xmlitems[i].getElementsByTagName("XPos")[0].textContent;
      //       YPos = xmlitems[i].getElementsByTagName("YPos")[0].textContent;
      //     }
     
      //     const ykiho = xmlitems[i].getElementsByTagName("ykiho")[0].textContent;
  
      //     if(xmlitems[i].getElementsByTagName("telno")[0] != undefined){
      //       telno = xmlitems[i].getElementsByTagName("telno")[0].textContent;
      //     }


      //     if(xmlitems[i].getElementsByTagName("hospUrl")[0] != undefined){

      //       hospUrl = xmlitems[i].getElementsByTagName("hospUrl")[0].textContent;
      //     }


      //     items.push({clCdNm,drTotCnt,
      //       cmdcGdrCnt,cmdcIntnCnt,cmdcResdntCnt,cmdcSdrCnt,
      //       detyGdrCnt,detyIntnCnt,detyResdntCnt,detySdrCnt,
      //       mdeptGdrCnt,mdeptIntnCnt,mdeptResdntCnt,mdeptSdrCnt,
      //       yadmNm,
      //       addr,XPos, YPos,
      //       ykiho,telno,hospUrl})
      //   }

      

      // })
      setHospitalregionitem(data.hospitalregionitem);

      //onsole.log("hospital items", items);




      // items = [];
      // const campingitem = await ReadCampingRegion();


      // campingitem.map((data, index)=>{

      //   const parser = new DOMParser();
      //   const xmlDoc = parser.parseFromString(data.campingitem, "text/xml");
    
      //   // 데이터 추출
      //   const xmlitems = xmlDoc.getElementsByTagName("item");
   
        
      //   const data2 = [];

      //   for (let i = 0; i < xmlitems.length; i++) {
      //     const contentId = xmlitems[i].getElementsByTagName("contentId")[0].textContent; 
      //     const facltNm = xmlitems[i].getElementsByTagName("facltNm")[0].textContent;
      //     const lineIntro = xmlitems[i].getElementsByTagName("lineIntro")[0].textContent;
      //     const intro = xmlitems[i].getElementsByTagName("intro")[0].textContent;
      //     const facltDivNm = xmlitems[i].getElementsByTagName("facltDivNm")[0].textContent;
      //     const induty = xmlitems[i].getElementsByTagName("induty")[0].textContent;
      //     const addr1 = xmlitems[i].getElementsByTagName("addr1")[0].textContent;
      //     const resveCl = xmlitems[i].getElementsByTagName("resveCl")[0].textContent;
      //     const tooltipme = xmlitems[i].getElementsByTagName("tooltip")[0].textContent;

      //     const caravInnerFclty = xmlitems[i].getElementsByTagName("caravInnerFclty")[0].textContent;
      //     const brazierCl = xmlitems[i].getElementsByTagName("brazierCl")[0].textContent;
      //     const sbrsCl = xmlitems[i].getElementsByTagName("sbrsCl")[0].textContent;
      //     const sbrsEtc = xmlitems[i].getElementsByTagName("sbrsEtc")[0].textContent;
      //     const posblFcltyCl = xmlitems[i].getElementsByTagName("posblFcltyCl")[0].textContent;
      //     const animalCmgCl = xmlitems[i].getElementsByTagName("animalCmgCl")[0].textContent;
      //     const firstImageUrl = xmlitems[i].getElementsByTagName("firstImageUrl")[0].textContent;

      //     const mapX = xmlitems[i].getElementsByTagName("mapX")[0].textContent;
      //     const mapY = xmlitems[i].getElementsByTagName("mapY")[0].textContent;
      //     const tel = xmlitems[i].getElementsByTagName("tel")[0].textContent;
      //     const homepage = xmlitems[i].getElementsByTagName("homepage")[0].textContent;

          
      //     items.push({contentId,facltNm,lineIntro,intro,facltDivNm,induty,addr1, resveCl, tooltipme,caravInnerFclty,brazierCl,sbrsCl, sbrsEtc,
      //       posblFcltyCl,animalCmgCl,firstImageUrl,mapX,mapY,tel,homepage})
      //   }

      

      // })
      setCampingregionitem(data.campingregionitem);
    
     setCurrentloading(false);
    }
    FetchData();

  },[])


  


  return (
    <>
      <Container style={containerStyle}>

      {
        menu == TOURISTMENU.TOURPICTURE &&
        <Row style={{flexWrap:"wrap", width:"90%", margin:"0px auto"}}>
          <LifeTourPicture items={tourpictureitem} />


        </Row>
      }
      {
      
      menu == TOURISTMENU.TOURREGION &&
        <Row style={{width:"100%", margin:"0px auto"}}>
          <LifeTourRegion items={tourregionitem} />
        </Row>
      }

     {
      
      menu == TOURISTMENU.TOURFESTIVAL &&
        <Row style={{width:"100%", margin:"0px auto"}}>

          {
            currentloading == true ? (<LottieAnimation containerStyle={{zIndex:11, marginTop:'10%'}} animationData={imageDB.loading}/>)
            :( <LifeTourFestival items={tourfestivalitem} />)
          }


        </Row>
      }

      {
      
      menu == TOURISTMENU.TOURCOUNTRY &&
        <Row style={{width:"100%", margin:"0px auto"}}>
          <LifeTourCountry items={tourcountryitem} />

        </Row>
      }

      {
      
      menu == PERFORMANCEMENU.PERFORMANCEEVENT &&
        <Row style={{width:"100%", margin:"0px auto"}}>
          <LifePerformanceEvent items={performanceeventitem} />

        </Row>
      }

      {
      
      menu == PERFORMANCEMENU.PERFORMANCECINEMA &&
        <Row style={{width:"100%", margin:"0px auto"}}>
          <LifePerformanceCinema items={performancecinemeitem} />

        </Row>
      }

      {
      
      menu == MEDICALMENU.MEDICALMEDICINE &&
        <Row style={{width:"100%", margin:"0px auto"}}>
          <LifeMedicalDrug />

        </Row>
      }

     {
      
      menu == MEDICALMENU.MEDICALHOSPITAL &&
        <Row style={{width:"100%", margin:"0px auto"}}>

          <LifeHospital items={hospitalregionitem} />

        </Row>
      }

      {
      
      menu == MEDICALMENU.FOODINFOMATION &&
        <Row style={{width:"100%", margin:"0px auto"}}>
          <LifeHealthFood />

        </Row>
      }

      {
      
      menu == CONVENIENCEMENU.CONVENIENCECAMPING &&
        <Row style={{width:"100%", margin:"0px auto"}}>

          <LifeCampingRegion items={campingregionitem} />

        </Row>
      }

      </Container>
    


    </>


  );

}

export default PCLifecontainer;

