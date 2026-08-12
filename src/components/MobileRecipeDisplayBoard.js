
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
import { ReadTourFestival } from "../service/LifeService";
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
import { LazyFoodImageex } from "../common/LasyImageex";
import IconButton from "../common/IconButton";
import MobileRecipePopup from "../modal/MobileRecipePopup";
import { getFontSize } from "../utility/fontsize";


const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 10px;
    padding: 10px 10px;
    scroll-behavior: smooth;
    height: 220px;
    width: ${({ width }) => width}px;



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

const RecommendButton = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  color: #fff;
`;

const Recipereview = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  font-family: 'Pretendard-Light';
  margin-top: 10px;
  color: #66686F;
`;

const Tag1 = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  background: #FFF0E9;
  padding: 5px 10px;
  color: #FE6625;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 5px;
`;

const Tag2 = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  background: #fff;
  color: #96989C;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-left: 5px;
`;

const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px !important;
  color: #1A1E28;
  margin-top: 5px;
`;

const Recipetip = styled.div`
  color: #96989C;
  font-family: 'Pretendard-Light';
  font-size: ${() => getFontSize(12)}px !important;
`;

const TipMenu = styled.div`
  background: #FFF0E9;
  color: #FE6625;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 50px;
  height: 20px;
  padding: 0px 5px;
`;

const TipMenu2 = styled.div`
  background: #F5F6F9;
  color: #66686F;
  border-radius: 5px;
  margin-bottom: 5px;
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 20px;
`;


const MobileRecipeDisplayBoard =({containerStyle}) =>  {

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

  const [totalitems, setTotalitems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recipepopup, setRecipepopup] = useState(false);
  const [recipeitem, setRecipeitem] = useState({});

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

    setTotalitems(totalitems);
  },[refresh])


  const _handleRecommend = async() =>{

    setLoading(true);
    setRefresh((refresh) => refresh +1);

    await sleep(500);
    let itemsTmp = shuffleArray10(totalitems);
    setDisplayitems(itemsTmp);
    setLoading(false);
    setRefresh((refresh) => refresh +1);

  }


  useLayoutEffect(()=>{
    SelectFetchData();
  }, [])



  async function SelectFetchData(type){

    const items = await ReadRECIPE();
    setTotalitems(items);
  
    let itemsTmp = DateArray10(items);
    setDisplayitems(itemsTmp);
    setLoading(false);
    setRefresh((refresh) => refresh+1);
  }


  const _handleRecipe = (item) => {
     navigate("/Mobilerecipe", {state : {item: item.ITEM, totalitem: item}})
  }

  const _handleprev = () => {
    navigate(-1); 
  }


  
  return (

    <>
      <style>{PictureStyle}</style>
      <Container style={containerStyle} width={windowWidth} className="hidden-scrollbar">

        {
          displayitems.map((data, index) => (
            <BoxItem onClick={() => { _handleRecipe(data) }} >

              <LazyFoodImageex src={ensureHttps(data.ITEM.ATT_FILE_NO_MK)} containerStyle={{
                width: '120px',
                backgroundColor: '#ededed', height: '120px', borderRadius: 10
              }} />

              <FlexstartRow style={{ margin: "3px 0px" }}>
                <TipMenu>
                  <img src={imageDB.Group385}/>
                  {data.ITEM.RCP_PAT2}</TipMenu>
                <TipMenu2>{data.ITEM.RCP_WAY2}</TipMenu2>
              </FlexstartRow>
              <Recipename>
                {data.ITEM.RCP_NM.slice(0, 8)}
                {data.ITEM.RCP_NM.length > 8 ? "..." : null}
              </Recipename>
              <Recipetip>
                {data.ITEM.RCP_NA_TIP.slice(0, 22)}
                {data.ITEM.RCP_NA_TIP.length > 22 ? "..." : null}
              </Recipetip>
            </BoxItem>
          ))
        }
      </Container>
    </>


  );

}

export default MobileRecipeDisplayBoard;

