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

const EmptyLine = styled.div`
  height: 20px;
  background: #f8f8f8;
  width: 100%;
  margin: 30px 0px;

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



const MobileYoutubeList =({containerStyle}) =>  {

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
   
        }
        FetchData();
    }, [])

 


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

    const _handleMap = ()=>{
      navigate("/Mobilecommunitycontent" ,{state :{name :LIFEMENU.YOUTUBE}});
    }

    const MobileYoutubeItem =({containerStyle, callback}) =>  {   
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

            <EmptyLine/>
      
        </div>
      </Container>
      ); 
    }

    return (

    <Container style={containerStyle}>
  
      <MobileYoutubeItem containerStyle={{marginBottom:20}}/>
      <MobileYoutubeItem containerStyle={{marginBottom:20}}/>
      <MobileYoutubeItem containerStyle={{marginBottom:20}}/>
      <MobileYoutubeItem containerStyle={{marginBottom:20}}/>
  

      {/* {
        currentloading == true  && <LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />
      } */}



      <ButtonLayer>
          <ListButton onClick={_handleMap}> 
            <RiListView size={18} color={'#131313'}/>
            <div style={{fontSize: () => getFontSize(16)}}>지도로보기</div>
          </ListButton>
     </ButtonLayer>
      

    </Container>
    );

}

export default MobileYoutubeList;

