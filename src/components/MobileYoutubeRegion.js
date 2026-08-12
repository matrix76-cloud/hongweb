import { Table } from "@mui/material";
import { setLogLevel } from "firebase/firestore";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import ButtonEx from "../common/ButtonEx";
import { Column } from "../common/Column";
import LottieAnimation from "../common/LottieAnimation";
import { BetweenRow, Row } from "../common/Row";
import { DataContext } from "../context/Data";
import { UserContext } from "../context/User";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { ReadTourRegion } from "../service/LifeService";
import { sleep, useSleep } from "../utility/common";
import { imageDB } from "../utility/imageData";
import "./mobile.css";
import "./table.css";
import "./MobileYoutubeRegion.css";
import { IoMdClose } from "react-icons/io";
import { COLORS } from "../utility/colors";
import { TbGps } from "react-icons/tb";
import { RiListView } from "react-icons/ri";
import { LIFEMENU } from "../utility/life";



const Container = styled.div`
    width:100%;


`
const style = {
  display: "flex"
};

const DetailLevel = 4;
const DetailMeter =300;
const BasicLevel =9;



const mapstyle = {
    position: "absolute",
    overflow: "hidden",
    top: '10%',
    width:'100%',
  };


const PopupWorkEx = styled.div`

  position: absolute;
  top:150px;
  width: 100%;
  background: #fff;
  z-index: 5;
  overflow-y: auto;
  height:600px;
`

const TableLayout = styled.div`
  overflow-y: scroll;
  scroll-behavior: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  margin-bottom: 100px;
`
const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}

const MapExbtn = styled.div`
  position: relative;
  top: 10px;
  left: 88%;
  z-index: 3;
  background: #f9f9f9;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderPopupline = styled.div`

  width:30%;
  background:#E3E3E3;
  height:5px;
`
const Storename = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-family: 'Pretendard-SemiBold';
  width: 95%;
  margin: 0 auto;
  height:35px;
`
const Storeaddr = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: 'Pretendard-Regular';
  width: 95%;
  margin: 0 auto;
  height: 35px;
  display: flex;
  align-items: center;
`

const Storetel = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: 'Pretendard-Regular';
  width: 95%;
  margin: 0 auto;
  height:35px;
`
const Youtubelogo = styled.div`
    position: absolute;
    top: 210px;
    width: 80px;
    left: 35%;


`

const YoutubePopupWorkEx = styled.div`

  position: absolute;
  top:100px;
  width: 100%;
  background: #fff;
  z-index: 5;
  overflow-y: auto;
`
const ListButton = styled.div`
  background-color: #fff;
  width: 120px;
  height: 40px;
  display: flex;
  margin-left:5px;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 20px;
  border: 1px solid #ededed;
  font-family: 'Pretendard-SemiBold';
`
const ButtonLayer = styled.div`
  position: fixed;
  bottom: 80px;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content:center;
`
  
/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const YouTubePlayer = () => {
  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/EJ24_XjKbxY" // VIDEO_ID를 원하는 영상 ID로 교체하세요.
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};



const MobileYoutubeRegion =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [overlays, setOverlays] = useState([]);
  const [item, setItem] = useState(null);
  const [currentloading, setCurrentloading] = useState(true);

  const [show, setShow] = useState(true);
  const [expand, setExpand] = useState(false);
  const [curmap, setCurMap] = useState({});
  const [markerex, setMarkerex] = useState(false);
  const [level, setLevel] = useState(0);
  const [youtubepopup, setYoutubepopup] = useState(false);


    // useLayoutEffect(() => {
    // }, []);

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    //     return () => {};
    // }, []);

    useEffect(()=>{
        setOverlays(overlays);
        setCurrentloading(currentloading);
        setItem(item);
        setExpand(expand);
        setCurMap(curmap);
        setMarkerex(markerex);
        setLevel(level);
        setYoutubepopup(youtubepopup);
    }, [refresh])

    useLayoutEffect(()=>{
        async function FetchData(){

            if(data.tourregionitem.length == 0){
              const tourregionitem = await ReadTourRegion();
              const dataToSaveregion = JSON.parse(tourregionitem);
              data.tourregionitem = dataToSaveregion.response.body.items;
  
              datadispatch(data);
      
            }
            await sleep(1000);
            ListmapDraw(data.tourregionitem)
        }
        FetchData();
    }, [])

 
    function findMapIndex(id, items){

       const FindIndex =  items.findIndex(x=>x.lnmadr  === id)
    
       return FindIndex;
      }

    const _handleControlFromMap = (id, items) =>{
        let FindIndex = findMapIndex(id, items);

        setItem(items[FindIndex]);


        setRefresh((refresh) => refresh+1);
    }




    const _handleExmap = () =>{
      navigate("/Mobilemap" ,{state :{WORK_ID :"", TYPE : ""}});
    }

    const _handlePopupClose = () =>{
      setItem(null);
      setRefresh((refresh) => refresh +1);
    }

    const _handleYoutube = () =>{
      setYoutubepopup(true);
      setRefresh((refresh) => refresh +1);
    }

    function ListmapDraw(datas){
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
            center: new kakao.maps.LatLng(user.USERINFO.latitude, user.USERINFO.longitude), // 지도의 중심좌표
            level: BasicLevel // 지도의 확대 레벨
    };



    var map = new kakao.maps.Map(mapContainer, mapOption);
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT); //

    var overlaysTmp = [];
    var overlays = [];


    for (var i = 0; i < datas.length; i ++){
        let overlay = {
        POSITION : {},
        NAME : "",
        ITEMS :datas,
        id :"",
        }

   
        let latitude = "";
        let longitude = "";


  

        latitude = datas[i].latitude;
        longitude =  datas[i].longitude;


        overlay.POSITION = new kakao.maps.LatLng(latitude, longitude);
        overlay.id = datas[i].lnmadr;
        overlay.NAME = datas[i].trrsrtNm;
        overlay.ITEMS = datas
        overlaysTmp.push(overlay);

    }


    overlaysTmp.forEach(function(overlayData, index) {

      var content = document.createElement('div');
      var customOverlay ={};

      kakao.maps.event.addListener(map, 'zoom_changed', function() {
          // 현재 지도 레벨 가져오기
          var level = map.getLevel();

          console.log('현재 지도 레벨: ' + level);

          // Custom Overlay 내용 생성

          content.className = 'maptourregionlay';

          content.innerHTML =
          '  <a>' +
          '    <div>' +
          '    <img src="'+ imageDB.youtube+'"style="width:32px;"/>' +
          '    </div>' +
          '    <div class="title">'+'하님떡갈비 본점' +'</div>' +
          '  </a>' +
          '</div>';
          

          // Custom Overlay 생성
          customOverlay = new kakao.maps.CustomOverlay({
              position: overlayData.POSITION,
              content: content,
              clickable: true // 클릭 가능하도록 설정
          });

          var customData = {
              id: overlayData.id,
              items : overlayData.ITEMS
          };
          customOverlay.customData = customData;
          // Custom Overlay 지도에 추가

          customOverlay.setMap(map);
          overlays.push(customOverlay);
    
      });

  
      // 클릭 이벤트 등록 
      // 지도에서 클릭 햇을때는 리스트에서 클릭 했을때와 달리 별도로 circle을 표시할 필요는 없다
      content.addEventListener('click', function(event) {
        _handleControlFromMap(customOverlay.customData.id, customOverlay.customData.items);

      });

      // 확대/축소 레벨 제한 설정
      const minLevel = 1;
      const maxLevel = 10;

      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
  
          const level = map.getLevel();

          if (level < minLevel) {
              map.setLevel(minLevel);
          } else if (level > maxLevel) {
              map.setLevel(maxLevel);
          }
      });


     });



     map.setLevel(map.getLevel() +1);
     setCurMap(map);


    //오버레이를 변수에 담아둔다
    setOverlays(overlays);

    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);



    }

  /**
   * 페이지내에 스크롤을 막아 주는 코드입니다 
   */
  //  useEffect(() => {
  //   document.documentElement.style.scrollbarGutter = 'stable'; // 추가

  //   if (show) document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, [show]);

    const _handleList = ()=>{

      navigate("/Mobilecommunitycontent" ,{state :{name :LIFEMENU.YOUTUBELIST}});
    }

    const MobileYoutubeItem =({containerStyle, callback}) =>  {

      /** 제목 정리
       ** 설명
       *! 중요한 내용
       * TODO 미진한 부분
       * ? 뤄리 API 설명
       * @param 파라미터 설명
       */
      
      
        const { dispatch, user } = useContext(UserContext);
        const { datadispatch, data} = useContext(DataContext);
      
        const location = useLocation();
        const navigate = useNavigate();
        const [refresh, setRefresh] = useState(1);
      
      
          useEffect(()=>{
      
          }, [refresh])
      
          useLayoutEffect(()=>{
      
          }, [])
      
          const _handlePopupClose = ()=>{
            callback();
          }
      
      
      
      
          return (
      
          <Container style={containerStyle}>
            <div style={{display:"flex", flexDirection:"column",width:"100%" }}>
                <BetweenRow style={{height:"40px", padding: '0px 20px'}}>
                  <Row>
                  <img src={imageDB.youtubelogo} style={{width:30}}/>
                  <div style={{color :`${COLORS.MAINCOLOR}`, fontFamily:"Pretendard-SemiBold"}}>성시경의 먹을텐데</div>
                  </Row>
          
                  <div style={{position:"absolute", right:10, top:5}} onClick={_handlePopupClose} >
                  <IoMdClose  size={25}/>
                  </div>
                
                </BetweenRow>
                <Storename>하남 숯불닭갈비 미사본점</Storename>
                <BetweenRow style={{padding:'0px 8px'}}>
                <Storeaddr>경기도 하남시 미사동 35번지</Storeaddr>
                <Row >
                  <TbGps size={20}/>
                  <div style={{fontSize: () => getFontSize(10)}}>내위치로부터 20km</div>
                </Row>
                </BetweenRow>
              
                <Storetel>031-8374-393</Storetel>
          
                <YouTubePlayer />
          
            </div>
          </Container>
          );
      
      
    }

    return (

    <Container style={containerStyle}>
      {
        item != null && <PopupWorkEx>    
            <MobileYoutubeItem  callback={_handlePopupClose}/>
        </PopupWorkEx>
      }
  

      {
        currentloading == true  && <LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />
      }

      
      <div style={{position:"absolute", width:"100%"}}>
        <div id="map" className="Map" style={mapstyle}></div>
      </div>


      <ButtonLayer>
          <ListButton onClick={_handleList}> 
            <RiListView size={18} color={'#131313'}/>
            <div style={{fontSize: () => getFontSize(16)}}>리스트보기</div>
          </ListButton>
     </ButtonLayer>
      

    </Container>
    );

}

export default MobileYoutubeRegion;

