
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { DateArray10, ensureHttps, shuffleArray10, sleep, useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival, ReadTourPicture } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { ReadCommunitySummary } from "../service/CommunityService";
import TimeAgo from 'react-timeago';
import { getFullTime } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { PCCOMMNUNITYMENU } from "../utility/screen";
import { ReadRECIPE } from "../service/RecipeService";

import { shuffleArray } from "../utility/common";
import { getNewDate } from "../utility/date";
import LazyImage from "../common/LasyImage";

import { FiPlus } from "react-icons/fi";
import ButtonEx from "../common/ButtonEx";
import Empty from "./Empty";
import MobileRecipeadd from "../modal/MobileRecipeadd";
import { ReadFREEZE, UpdateFREEZECHECKid } from "../service/FreezeService";
import MobileRecipeadjust from "../modal/MobileRecipeadjust";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import IconButton from "../common/IconButton";
import MobileRecipePopup from "../modal/MobileRecipePopup";
import MobilePicturePopup from "../modal/MobilePicturePopup";
import { TourPicture } from "../store/jotai";
import { useAtom } from "jotai";
import { LazyTourImageex } from "../common/LasyImageex";
import { getFontSize } from "../utility/fontsize";


const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 10px;
    padding: 5px 0px 0px;
    scroll-behavior: smooth;
    width: ${({width}) =>width}px;


`
const style = {
  display: "flex"
};



const BoxLayer = styled.div`

`

const BoxItem = styled.div`


`


const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}



const RecommendTitle = styled.div`
  font-family: 'Pretendard-Bold';
  margin: 20px 0px;

`

const RecommendButton = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  color: #fff;
`


const Recipereview = styled.div`
font-size: ${() => getFontSize(12)}px !important;
font-family: 'Pretendard-Light';
margin-top:10px;
color :#66686F
`

const Tag1 = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  background: #FFF0E9;
  padding :5px 10px;
  color: #FE6625;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 5px;
`
const Tag2= styled.div`

  font-size: ${() => getFontSize(12)}px !important;
  background: #fff;
  color: #96989C;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-left:5px;
`

const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px !important;
  color: #1A1E28;
  margin-top:5px;
`

const Recipetip = styled.div`
  color: #96989C;
  font-family: 'Pretendard-Light';
  font-size: ${() => getFontSize(12)}px !important;
`



const CheckLayer = styled.div`
  display : flex;
  width :20px;
  height :15px;
`
const RecommendLayer = styled.div`

  width: 90%;
  height: 50px;
  background: #FE6625;
  margin: 20px auto;
  border-radius: 5px;
  display : flex;
  justify-content:center;
  align-items:center;

`
const TipMenu = styled.div`

  background: #FFF0E9;
  color: #FE6625;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px;
  display: flex;
  justify-content: space-around;
  align-items : center;
  width: 40px;
  height:20px;

`

const TipMenu2 = styled.div`
  background: #F5F6F9;
  color: #66686F;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px;
  display: flex;
  justify-content: center;
  align-items : center;
  width: 40px;
  height:20px;

`
const PictureStyle = `

  .hidden-scrollbar {
    overflow: auto;
    -ms-overflow-style: none; /* IE, Edge */
    scrollbar-width: none; /* Firefox */
  }

  .hidden-scrollbar:: -webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`


const MobilePictureDisplayBoard =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [displayitems, setDisplayitems] = useState([]);



  const [loading, setLoading] = useState(true);
  const [recipepopup, setRecipepopup] = useState(false);
  const [pictureitem, setPictureitem] = useState({});
  const [pictureopen, setPictureopen] = useState(false);
  const [tourpicturemenu, setTourpicturemenu] = useAtom(TourPicture);

  const windowWidth = window.innerWidth;

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setDisplayitems(displayitems);
    setLoading(loading);
    setPictureitem(pictureitem);
    setPictureopen(pictureopen);

  },[refresh])


  useEffect(()=>{
    SelectFetchData();
  }, [])


  const downloadImage = async (imageUrl) => {
    const response = await fetch((imageUrl));
    const blob = await response.blob();
    return blob;
  };

  const resizeImage = (blob, maxWidth = 300, maxHeight = 300) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((resizedBlob) => {
          resolve(resizedBlob);
        }, 'image/jpeg', 0.8); // 품질 조정 (0.8 = 80%)
      };
    });
  };


  const uploadToFirebase = async (resizedBlob) => {
   
    return new Promise((resolve, reject) => {
      const imagefile = "images/tour/" + random + ".webp";
      const spaceRef = ref(storage, imagefile);

      uploadBytes(spaceRef, resizedBlob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // blob.close(); 주석을 임시로 삭제
          resolve(url);
        });
      });
    });

  };


  const processImage = async (imageUrl) => {
    try {
      const blob = await downloadImage(imageUrl);
      const resizedBlob = await resizeImage(blob);
      await uploadToFirebase(resizedBlob);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  async function SelectFetchData(type){



    if (tourpicturemenu.length == 0) {

      const tourpictureitem = await ReadTourPicture();
      const dataToSavpicture = JSON.parse(tourpictureitem);

      setTourpicturemenu(dataToSavpicture.response.body.items.item);



      let itemsTmp = DateArray10(dataToSavpicture.response.body.items.item);

      setDisplayitems(itemsTmp);
    } else {
  
      let itemsTmp = DateArray10(tourpicturemenu);

      setDisplayitems(itemsTmp);
    }



    setLoading(false);
    setRefresh((refresh) => refresh+1);
  }



  const Mobilepictureclose = () => {
    setPictureopen(false);
    setRefresh((refresh) => refresh + 1);
  }
  const _handleView = (data) => {

    navigate("/Mobilepicture", { state: { item: data } })
    setRefresh((refresh) => refresh + 1);
  }


  
  return (

    <>
      <style>{PictureStyle}</style>


      <Container style={containerStyle} width={windowWidth } className="hidden-scrollbar">
        {
          displayitems.map((data, index) => (
            <BoxItem onClick={() => { _handleView(data) }} key={index}>
              <LazyTourImageex src={ensureHttps(data.galWebImageUrl)} containerStyle={{
                width: '120px',
                backgroundColor: '#ededed', height: '120px', borderRadius: 10
              }} />

              <Recipename>
                {data.galPhotographyLocation.slice(0, 8)}
                {data.galPhotographyLocation.length > 8 ? "..." : null}
              </Recipename>
              <Recipetip>
                {data.galSearchKeyword.slice(0, 25)}
                {data.galSearchKeyword.length > 25 ? "..." : null}
              </Recipetip>

            </BoxItem>
          ))
        }
      </Container>
    </>

  );

}

export default MobilePictureDisplayBoard;

