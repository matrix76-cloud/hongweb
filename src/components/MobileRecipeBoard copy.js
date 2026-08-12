
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { ensureHttps, shuffleArray10, sleep, useSleep } from "../utility/common";
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
import {LazyFoodImageex} from "../common/LasyImageex";
import IconButton from "../common/IconButton";
import MobileRecipePopup from "../modal/MobileRecipePopup";
import { getFontSize, isIOS } from "../utility/fontsize";


const formatter = buildFormatter(koreanStrings); 


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`;


const HEADER_HEIGHT = 47;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;
  padding: 0 16px;
`;


const style = {
  display: "flex"
};



const BoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const BoxItem = styled.div`
  width : 49%;
  height : 100%; 
  margin-bottom:20px;

`
const FreezeItem = styled.div`
  width : 100%;
  height : 100%; 
  margin-bottom:40px;
  display : flex;
  flex-direction: row;

`

const FreezeBoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const FreezeBoxItem = styled.div`
  width : 49%;
  background: ${({enable})=> enable== true ? ('bisque') :('#f9f9f9')};
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction:column;
  border-radius: 5px;
  margin-bottom:5px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }


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

const EmptyLine = styled.div`
  height: 2px;
  background: #ededed;
  margin: 20px 0px;

`
const Dday = styled.div`
  font-size: ${() => getFontSize(10)}px;
  background-color : ${({out}) => out == true ? ('#ff7e19') :('#fff')};
  border-radius: 20px;
  border : ${({out}) => out == true ? ('1px solid #ff7e19') :('1px solid #ff7e19')};
  color : ${({out}) => out == true ? ('#fff') :('#ff7e19')};

  padding: 5px 10px;
  margin-left: 10px;
  font-family: 'Pretendard-Bold';
`

const Alarm = styled.div`

  font-size: ${() => getFontSize(10)}px;
  border: 1px solid #1982ff;
  background-color : #1982ff;
  border-radius: 20px;
  color: #fff;
  padding: 5px 10px;
  margin-left: 10px;
  font-family: 'Pretendard-Bold';


`
const Freezename = styled.div`
  font-size: ${() => getFontSize(16)}px;

`
const Property = styled.div`
  font-size: ${() => getFontSize(10)}px;

`

const MenuButton = styled.div`
  background: ${({enable})=> enable == true ? ('#ff7e19'):('#fff')};
  color: ${({enable})=> enable == true ? ('#fff'):('#131313')};
  padding: 5px;
  border: 1px solid #ededed;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px;
  width: 50px;
  display: flex;
  justify-content: center;

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
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: space-around;
  align-items : center;
  width: 60px;
  height:20px;
  padding : 0px 3px;

`

const TipMenu2 = styled.div`
  background: #F5F6F9;
  color: #66686F;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: center;
  align-items : center;
  width: 60px;
  height:20px;
  padding : 0px 3px;

`
const HeaderTitle = styled.span`
  padding-left: 10px;
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-SemiBold;
  color: #1A1E28;
`;


const MobileRecipeBoard =({containerStyle}) =>  {

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
  const [totalitem, setTotalitem] = useState({});


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);




  const _handleRecommend = async() =>{

    setLoading(true);
    setRefresh((refresh) => refresh +1);

    await sleep(500);
    let itemsTmp = shuffleArray10(totalitems);
    setDisplayitems(itemsTmp);
    setLoading(false);
    setRefresh((refresh) => refresh +1);

  }


  useEffect(()=>{
    SelectFetchData();
  }, [])



  async function SelectFetchData(type){

    const items = await ReadRECIPE();

    setTotalitems(items);
    
  
    let itemsTmp = shuffleArray10(items);
    setDisplayitems(itemsTmp);
    setLoading(false);
    setRefresh((refresh) => refresh+1);
  }




  const _handleRecipe = (item) => {
    
    setRecipeitem(item.ITEM);
    setTotalitem(item);
    
    setRecipepopup(true);

    // navigate("/Mobilerecipe", {state : {item: item.ITEM}})
  }

  const _handleprev = () => {
    navigate(-1); 
  }

  const mobilerecipepopupclose = () => {
    setRecipepopup(false);
    setRefresh((refresh) => refresh + 1);
  }

  return (

    <>
      {recipepopup == true && <MobileRecipePopup callback={mobilerecipepopupclose} item={recipeitem} totalitem={totalitem} />}    
    <HeaderWrapper>
      <Column style={{ width: '100%' }}>
        <BetweenRow style={{ width: '90%', margin: '0 auto' }}>
          <div style={{ display: 'flex', fontSize: '18px', color: '#131313', alignItems: 'center' }}>
            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
          
              <HeaderTitle>{'요리 레시피'}</HeaderTitle>
            </div>

        </BetweenRow>
      </Column>
      </HeaderWrapper>
      <Container style={containerStyle}>

     

        {
          loading == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'} />)
            : (
              <>
    
                <Column style={{ width: "100%", margin: "0 auto", paddingTop: "0px" }}>

                  <div style={{ overflowY: "hidden", width: "90%", margin: "0px auto" }}>


                    <BoxLayer>
                      {
                        displayitems.map((data, index) => (
                          <BoxItem onClick={() => { _handleRecipe(data) }} >

                            <LazyFoodImageex src={ensureHttps(data.ITEM.ATT_FILE_NO_MK)} containerStyle={{
                              width: '100%',
                              height: "180px",
                              backgroundColor: '#ededed', borderRadius: 10
                            }} />


                            <FlexstartRow style={{ margin: "3px 0px" }}>
                              <TipMenu>
                                <img src={imageDB.Group385} />
                                {data.ITEM.RCP_PAT2}
                              </TipMenu>
                              <TipMenu2>{data.ITEM.RCP_WAY2}</TipMenu2>
                            </FlexstartRow>
                            <Recipename>
                              {data.ITEM.RCP_NM.slice(0, 12)}
                              {data.ITEM.RCP_NM.length > 12 ? "..." : null}
                            </Recipename>
                            <Recipetip>
                              {data.ITEM.RCP_NA_TIP.slice(0, 32)}
                              {data.ITEM.RCP_NA_TIP.length > 32 ? "..." : null}
                            </Recipetip>
                          </BoxItem>
                        ))
                      }
                    </BoxLayer>

                    <RecommendLayer>
                      <RecommendButton onClick={_handleRecommend}>다시 추천하기</RecommendButton>
                    </RecommendLayer>

                  </div>
                </Column>
              </>
            )
        }
      </Container>
      
    </>

  );

}

export default MobileRecipeBoard;

