
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { ensureHttps, shuffleArray10, shuffleArray18, shuffleArray20, shuffleArray9, sleep, useSleep } from "../utility/common";
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
import { LoadingCommunityStyle, LoadingListStyle, LoadingPCLifeSearchAnimationStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { PCCOMMNUNITYMENU } from "../utility/screen";
import { ReadRECIPE } from "../service/RecipeService";

import { shuffleArray } from "../utility/common";
import { getNewDate } from "../utility/date";
import LazyImage from "../common/LasyImage";

import { FiPlus } from "react-icons/fi";
import ButtonEx from "../common/ButtonEx";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import LazyTourImageex from "../common/LasyImageex";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { recipemenuitem, recipemenuitems } from "../store/jotai";
import PCRecipePopup from "../modal/PCRecipePopup";

import { LIFEMENU } from "../utility/life";

import PCGateheader from "../screen/LayoutPC/Header/PCGateheader";

import StoreInfo from "./StoreInfo";
import PCLifeheader from "../screen/LayoutPC/Header/PCLifeheader";


const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  overflow : auto;
  width :100%;

`
const style = {
  display: "flex"
};



const BoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height : 500px;
`

const BoxItem = styled.div`
  width : 22%;
  height : 100%; 
  margin  :10px;

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
const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(18)}px;
`
const RecommendButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color: #ff391d;
`
const AdddButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color : #ff7e19;
  display:flex;
`

const Recipetip = styled.div`
font-size: ${() => getFontSize(16)}px;
font-family: 'Pretendard-Light';
`
const Recipereview = styled.div`
font-size: ${() => getFontSize(14)}px;
font-family: 'Pretendard-Light';
margin-top:10px;
`

const Tag1 = styled.div`

font-size: ${() => getFontSize(14)}px;
background: #fff;
color: #070606;
display: flex;
justify-content: center;
align-items: center;
border-radius: 10px;
`
const Tag2= styled.div`

  font-size: ${() => getFontSize(14)}px;
  background: #fff;
  color: #070606;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-left:5px;
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

const BannerItems =[
  {type:LIFEMENU.RECIPE,image : imageDB.recipe, main1:"요리레시피", main3:"매일매일 제공되는 추천레시피"+'\n'+"조리법, 식재료명,식재료 수량 및 단위를 제공"+
  "조리순서별 이미지와 요리팁으로  요리초보도 쉽게 따라할수 있어요",color:"#2b2b2b"},
]

const MainContent1 = styled.div`

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  white-space: pre-wrap;
  line-height:1.7;
  margin-top:70px;
  color : #fff;
`
const MainContent2 = styled.div`
  width: 40%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position:relative;
  top:40px;


`

const MainContentTxt1 = styled.div`
  margin-top:20px;
  font-size: ${() => getFontSize(23)}px;
  letter-spacing: -0.32px;
  font-family :Pretendard-SemiBold;
  color : #fff;
`
const MainContentTxt2 = styled.div`

  font-size: ${() => getFontSize(16)}px;
  letter-spacing: -0.32px;
  color : #9c9898;
`


const Info = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;



`


const MainComponent = ({ width, items, bgcolor, color, containerStyle }) => {

  const navigate = useNavigate();




  return (
    <Container width={width} bgcolor={bgcolor} style={{background:'#2B2B2B', height:250}}>

        {
          items.map((data, index) => (
            <Row style={{ width: "70%", margin: "20px auto 0px" }}>
              <MainContent1 style={{ justifyContent: "flex-start" }}>
                <MainContentTxt1 top={top}>{'요리 레시피'}</MainContentTxt1>

                <Info>
                  <MainContentTxt2>{'매일매일 제공되는 추천 레시피'}</MainContentTxt2>
                  <MainContentTxt2>{'조리법, 식재료명, 식재료 수량 및 단위를 제공 조리순서별로 이미지와 요리팁으로 요리초보도 쉽게 따라 할수 있어요.'}</MainContentTxt2>
    
                </Info>

              </MainContent1>

              <MainContent2>
                <img src={imageDB.recipe} style={{ width: 150 }} />
              </MainContent2>
            </Row>
            
          ))
        }


    </Container>
  );
};


const PCRecipeBoard =({containerStyle}) =>  {

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
  const setItem = useSetAtom(recipemenuitem);

  const getItem = useAtomValue(recipemenuitem);

  const [recipepopup, setRecipepopup] = useState(false);




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
    setRecipepopup(recipepopup);
  },[refresh])


  const _handleRecommend = async() =>{

    setLoading(true);
    setRefresh((refresh) => refresh +1);

    await sleep(500);
    let itemsTmp = shuffleArray20(totalitems);
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
  
    let itemsTmp = shuffleArray20(items);
    setDisplayitems(itemsTmp);
    setLoading(false);
    setRefresh((refresh) => refresh+1);
  }




  const _handleRecipe = (item) => {

    setItem(item);
    setRecipepopup(true);
    setRefresh((refresh) => refresh +1);

   // window.open('/PCrecipe', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }
  const _handlecallback = () =>{
    setRecipepopup(false);
    setRefresh((refresh) => refresh +1);
  }


  return (

    <>
      <Container style={containerStyle}>

        <PCLifeheader name={''} ></PCLifeheader>


        <MainComponent width={"100%"} items={BannerItems} bgcolor={'#2b2b2b'} top={25} containerStyle={{ color: '#fff' }} />

        {
          loading == true ? (<LottieAnimation containerStyle={LoadingListStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'} />)
            : (
              <Column style={{ marginTop: 10, width: "70%", margin: "0 auto", paddingTop: "0px", minHeight:500 }}>


                {
                  recipepopup == true && <PCRecipePopup callback={_handlecallback} item={getItem.ITEM} />
                }

                <div style={{ overflowY: "hidden", width: "100%", margin: "30px auto", minHeight:500, height:2500  }}>


                  <BoxLayer>
                    {
                      displayitems.map((data, index) => (
                        <BoxItem onClick={() => { _handleRecipe(data) }} >


                          <LazyLoadImage
                            style={{ borderRadius: 10, background: "#ededed" }}
                            src={ensureHttps(data.ITEM.ATT_FILE_NO_MAIN)}
                            alt="Lazy Loaded Example"
                            effect="blur"
                            offset={100} // 이미지가 보이기 100px 전 미리 로드
                            width={'100%'}
                          />


                          <FlexstartRow style={{ margin: "3px 0px" }}>
                            <Tag1>{data.ITEM.RCP_PAT2}</Tag1>
                            <Tag2>{data.ITEM.RCP_WAY2}</Tag2>
                          </FlexstartRow>
                          <Recipename>{data.ITEM.RCP_NM}</Recipename>
                          <Recipetip>{data.ITEM.RCP_NA_TIP}</Recipetip>

                        </BoxItem>
                      ))
                    }
                  </BoxLayer>


                  <Row style={{ width: "100%", height: 80 }}>
                    <ButtonEx text={"다시 추천받기"} onPress={_handleRecommend}
                      containerStyle={{
                        backgroundColor: "#ff6625", color: "#fff", borderRadius: "10px", border: "none",
                        fontSize: () => getFontSize(16), width: "40%", margin: "20px auto 10px", height: "48px"
                      }} />
                  </Row>

                </div>
              </Column>)
        }
      </Container>
      <StoreInfo padding={14} />
    </>

  );

}

export default PCRecipeBoard;

