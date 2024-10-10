import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { ReadRoom } from "../../service/RoomService";
import { ReadWork } from "../../service/WorkService";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";

import { ReadCampingRegion, ReadHospitalRegion, ReadHospitalRegion1, ReadPerformanceCinema, ReadPerformanceEvent, ReadTourCountry, ReadTourFestival, ReadTourPicture, ReadTourRegion } from "../../service/LifeService";
import { INCLUDEDISTANCE } from "../../utility/screen";



const Container = styled.div`
  height: 100vh;
  display : flex;
  justify-content:center;
  alignItems:center;
  width :100%;


`
const style = {
  display: "flex"
};



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCSplashcontainer =({containerStyle}) =>  {

/** PC 웹 초기 구동시에 데이타를 로딩 하는 component
 * ① 상점정보를 불러온다
 * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [switchscreen, setSwitchscreen]= useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setSwitchscreen(switchscreen);
  },[refresh])

  /**
   * 홍여사 웹페이지 초기 구동시에 필요한 데이타를 로딩해서 dataContext에 담아둔다
   * ! 중요
   * ! 함수 호출순서 FetchLocation => FetchData => StartProcess
   * ! FetchLocation 함수
   * ① 지역을 찾았을때 지역 이름을 dataContext 에 설정 해준다
   * ② 지역을 찾았을때 지역 위치을 dataContext 에 설정 해준다
   * TODO 지역을 찾지 못했을때 지역 범위를 설정 해야 한다는 도움말 주소지로 이동 시
   * TODO RoomItems 값을 임의로 설정해주자
 
   * ! FetchData 함수
   * ① 처음 게시판에 들어 갔을때 데이타 로드가 너무 느릴수 있기 때문에 미리 로딩한다 서비스 : ReadCommunitySummary
   * ② 등록된 일감정보를 미리 로딩한다 서비스 : ReadWork
   * 
   * ! StartProcess 함수
   * ① 메인함수로 이동한다
   */
  useEffect(()=>{



    async function StartProcess(){

      setRefresh((refresh) => refresh +1);

     navigate("/PCmain");
    } 

    async function FetchLocation(){

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
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
                    FetchData();
                }
              });

              dispatch(user);
              console.log("TCL: FetchLocation -> ", user );
              FetchData();

         
            }else{
              alert("허용 해야 합니다")
            }
          });
   
        },
        (err) => {
          console.error(err);
        }
      );
    };

    async function FetchData(){

      const latitude = user.latitude;
      const longitude = user.longitude;
      const checkdistance = INCLUDEDISTANCE;

      const workitems = await ReadWork({latitude, longitude,checkdistance});

      const roomitems = await ReadRoom({latitude, longitude,checkdistance});

  
      data.workitems = workitems;
      data.roomitems = roomitems;

      datadispatch(data);
  
      FetchCommunityData();
    } 

    async function FetchCommunityData(){
      const tourpictureitem = await ReadTourPicture();
      const dataToSavpicture = JSON.parse(tourpictureitem);
      data.tourpictureitem = dataToSavpicture.response.body.items.item;
      // setTourpictureitem(dataToSavpicture.response.body.items.item);

      const tourregionitem = await ReadTourRegion();
      const dataToSaveregion = JSON.parse(tourregionitem);
      data.tourregionitem = dataToSaveregion.response.body.items;
      // setTourregionitem(dataToSaveregion.response.body.items);
      


      const tourfestivalitem = await ReadTourFestival();
      const dataToSavefestival = JSON.parse(tourfestivalitem);
      // setTourfestivalitem(dataToSavefestival.response.body.items);
      data.tourfestivalitem = dataToSavefestival.response.body.items;
      const tourcountryitem = await ReadTourCountry();
      const dataToSavecountry = JSON.parse(tourcountryitem);
      // setTourCountryitem(dataToSavecountry.response.body.items);
      data.tourcountryitem = dataToSavecountry.response.body.items;


      let items = [];
      const performanceeventitem = await ReadPerformanceEvent();

      performanceeventitem.map((data, index)=>{
       const dataToSave = JSON.parse(data.dateitem);
     
        if(dataToSave.response.body != undefined){
          dataToSave.response.body.items.map((subdata)=>{
            items.push(subdata);
          })
     
        }
      })
      data.performanceeventitem = items;

      const performancecinemaitem = await ReadPerformanceCinema();
      const dataToSavecinema = JSON.parse(performancecinemaitem);
      // setPerformancecinemaitem(dataToSavecinema.response.body.items);
      data.performancecinemaitem = dataToSavecinema.response.body.items;



      items = [];
      const hospitalitem = await ReadHospitalRegion1();

      hospitalitem.map((data, index)=>{

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.hospitalitem, "text/xml");
    
    
        // 데이터 추출
        const xmlitems = xmlDoc.getElementsByTagName("item");
   
  

        for (let i = 0; i < xmlitems.length; i++) {
          let XPos = "", YPos = "", hospUrl ="", telno ="";
          const clCdNm = xmlitems[i].getElementsByTagName("clCdNm")[0].textContent; 
          const drTotCnt = xmlitems[i].getElementsByTagName("drTotCnt")[0].textContent; 

          const cmdcGdrCnt = xmlitems[i].getElementsByTagName("cmdcGdrCnt")[0].textContent; 
          const cmdcIntnCnt = xmlitems[i].getElementsByTagName("cmdcIntnCnt")[0].textContent; 
          const cmdcResdntCnt = xmlitems[i].getElementsByTagName("cmdcResdntCnt")[0].textContent; 
          const cmdcSdrCnt = xmlitems[i].getElementsByTagName("cmdcSdrCnt")[0].textContent; 


          const detyGdrCnt = xmlitems[i].getElementsByTagName("detyGdrCnt")[0].textContent; 
          const detyIntnCnt = xmlitems[i].getElementsByTagName("detyIntnCnt")[0].textContent; 
          const detyResdntCnt = xmlitems[i].getElementsByTagName("detyResdntCnt")[0].textContent; 
          const detySdrCnt = xmlitems[i].getElementsByTagName("detySdrCnt")[0].textContent; 



          const mdeptGdrCnt = xmlitems[i].getElementsByTagName("mdeptGdrCnt")[0].textContent; 
          const mdeptIntnCnt = xmlitems[i].getElementsByTagName("mdeptIntnCnt")[0].textContent; 
          const mdeptResdntCnt = xmlitems[i].getElementsByTagName("mdeptResdntCnt")[0].textContent; 
          const mdeptSdrCnt = xmlitems[i].getElementsByTagName("mdeptSdrCnt")[0].textContent; 

          const yadmNm = xmlitems[i].getElementsByTagName("yadmNm")[0].textContent;

          const addr = xmlitems[i].getElementsByTagName("addr")[0].textContent;
          if(xmlitems[i].getElementsByTagName("XPos")[0] != undefined){
            XPos = xmlitems[i].getElementsByTagName("XPos")[0].textContent;
            YPos = xmlitems[i].getElementsByTagName("YPos")[0].textContent;
          }
     
          const ykiho = xmlitems[i].getElementsByTagName("ykiho")[0].textContent;
  
          if(xmlitems[i].getElementsByTagName("telno")[0] != undefined){
            telno = xmlitems[i].getElementsByTagName("telno")[0].textContent;
          }


          if(xmlitems[i].getElementsByTagName("hospUrl")[0] != undefined){

            hospUrl = xmlitems[i].getElementsByTagName("hospUrl")[0].textContent;
          }


          items.push({clCdNm,drTotCnt,
            cmdcGdrCnt,cmdcIntnCnt,cmdcResdntCnt,cmdcSdrCnt,
            detyGdrCnt,detyIntnCnt,detyResdntCnt,detySdrCnt,
            mdeptGdrCnt,mdeptIntnCnt,mdeptResdntCnt,mdeptSdrCnt,
            yadmNm,
            addr,XPos, YPos,
            ykiho,telno,hospUrl})
        }

      

      })

      data.hospitalregionitem = items;
      // setHospitalregionitem(items);

      // console.log("hospital items", items);




      items = [];
      const campingitem = await ReadCampingRegion();


      campingitem.map((data, index)=>{

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.campingitem, "text/xml");
    
        // 데이터 추출
        const xmlitems = xmlDoc.getElementsByTagName("item");
   
        
        const data2 = [];

        for (let i = 0; i < xmlitems.length; i++) {
          const contentId = xmlitems[i].getElementsByTagName("contentId")[0].textContent; 
          const facltNm = xmlitems[i].getElementsByTagName("facltNm")[0].textContent;
          const lineIntro = xmlitems[i].getElementsByTagName("lineIntro")[0].textContent;
          const intro = xmlitems[i].getElementsByTagName("intro")[0].textContent;
          const facltDivNm = xmlitems[i].getElementsByTagName("facltDivNm")[0].textContent;
          const induty = xmlitems[i].getElementsByTagName("induty")[0].textContent;
          const addr1 = xmlitems[i].getElementsByTagName("addr1")[0].textContent;
          const resveCl = xmlitems[i].getElementsByTagName("resveCl")[0].textContent;
          const tooltipme = xmlitems[i].getElementsByTagName("tooltip")[0].textContent;

          const caravInnerFclty = xmlitems[i].getElementsByTagName("caravInnerFclty")[0].textContent;
          const brazierCl = xmlitems[i].getElementsByTagName("brazierCl")[0].textContent;
          const sbrsCl = xmlitems[i].getElementsByTagName("sbrsCl")[0].textContent;
          const sbrsEtc = xmlitems[i].getElementsByTagName("sbrsEtc")[0].textContent;
          const posblFcltyCl = xmlitems[i].getElementsByTagName("posblFcltyCl")[0].textContent;
          const animalCmgCl = xmlitems[i].getElementsByTagName("animalCmgCl")[0].textContent;
          const firstImageUrl = xmlitems[i].getElementsByTagName("firstImageUrl")[0].textContent;

          const mapX = xmlitems[i].getElementsByTagName("mapX")[0].textContent;
          const mapY = xmlitems[i].getElementsByTagName("mapY")[0].textContent;
          const tel = xmlitems[i].getElementsByTagName("tel")[0].textContent;
          const homepage = xmlitems[i].getElementsByTagName("homepage")[0].textContent;

          
          items.push({contentId,facltNm,lineIntro,intro,facltDivNm,induty,addr1, resveCl, tooltipme,caravInnerFclty,brazierCl,sbrsCl, sbrsEtc,
            posblFcltyCl,animalCmgCl,firstImageUrl,mapX,mapY,tel,homepage})
        }

      

      })
      // setCampingregionitem(items);

      data.campingregionitem = items;

      datadispatch(data);
    
      StartProcess();
    }
    

    FetchLocation();

  }, [])




 
  return (

    <Container style={containerStyle}>
        <img src={imageDB.pcslpash} style={{ marginTop:50}} />

    </Container>
  );

}

export default PCSplashcontainer;

