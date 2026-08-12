import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";

import { DataContext } from "../../context/Data";


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column, FlexstartColumn } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";

import LottieAnimation from "../../common/LottieAnimation";
import { ensureHttps, removeSymbols, shuffleArray, useSleep } from "../../utility/common";

import { GrTip } from "react-icons/gr";
import { TbComponents } from "react-icons/tb";
import Recipe from "../../components/Recipe";
import { ReadRECIPE } from "../../service/RecipeService";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Empty from "../../components/config/Empty";
import { LoadingSearchAnimationStyle } from "../../screen/css/common";
import { model } from "../../api/config";
import LazyImage from "../../components/LazyImage";
import { Recipemenus } from "../../store/jotai";
import { useAtom } from "jotai";
import MobileRecipePopup from "../../modal/MobileRecipePopup";
import { getFontSize } from "../../utility/fontsize";

const Container = styled.div`
  padding:10px 0px;
  width: 90%;
  margin: 0 auto;
`


const SubContent = styled.div`
  width: 90%;
  margin: 0 auto;

`
const Content = styled.div``

const ContentText = styled.div`
  font-size: ${() => getFontSize(16)}px;
  font-family : Pretendard-SemiBold;
  margin : 20px 0px;
`
const Tag1 = styled.div`
    font-size: ${() => getFontSize(16)}px;
    width: 30%;
    color: #070606;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    height: 25px;
    margin: 20px 0px;
    border: 1px solid #ededed;

`

const Tag2 = styled.div`
  font-size: ${() => getFontSize(16)}px;
  width: 30%;
  color: #070606;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 25px;
  margin: 20px 0px;
  border: 1px solid #ededed;
  margin-left:20px;

`
const LableIconLayer = styled.div`
  background: #ff7e19;
  width: 30px;
  border-radius: 5px;
  height: 30px;
  display:flex;
  justify-content:center;
  align-items:center;
`
const LabelText = styled.div`
  margin-left:5px;
  font-family : Pretendard-SemiBold;
  font-size :16px;
`

const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(16)}px;
  margin-top:5px;
`


const MenuButton = styled.div`
  background: ${({ enable }) => enable == true ? ('#484B53') : ('#F5F6F9')};
  color: ${({ enable }) => enable == true ? ('#fff') : ('#96989C')};
  padding: 5px 15px;
  border: 1px solid #ededed;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(14)}px !important;
  display: flex;
  justify-content: center;
`

const TipMenu = styled.div`

  background: #FFF0E9;
  color: #FE6625;
  padding: 3px 10px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: center;
  width: 40px;

`

const TipMenu2 = styled.div`
  background: #F5F6F9;
  color: #66686F;
  padding: 3px 10px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: center;
  width: 40px;

`





const CheckLayer = styled.div`
  display : flex;
  width :20px;
  height :15px;
`

const BoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom:30px;
`

const BoxItem = styled.div`
  width : 49%;
  height : 100%; 
  margin-bottom:40px;

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

const Recipetip = styled.div`
font-size: ${() => getFontSize(12)}px !important;
font-family: 'Pretendard-Light';
color :#96989C;
`
const Recipereview = styled.div`
font-size: ${() => getFontSize(14)}px !important;
font-family: 'Pretendard-Light';
margin-top:10px;
`
const AILabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Pretendard-SemiBold;
  width: 100%;
  align-items: center;
  padding-left: 5px;
  font-size: ${() => getFontSize(18)}px !important;
  margin-top: 20px;
  color: #1A1E28;
  padding: 15px 5px;
  width: 90%;
`
const Return = styled.div`
  white-space: pre-line;
  font-size: ${() => getFontSize(14)}px !important;
  padding: 0px 5px;
  word-break: break-word;
  line-height: 2;
  padding: 5px 10px;
  border: 1px solid #ededed;
  border-radius: 15px;

  

`

const Header = styled.div`
    width: 100%;
    margin: 0px auto;
    padding-left: 0px;
    padding-top:15px;
    position: fixed;
    top: 0px;
    height: 40px;
    background: #fff;
    z-index: 5;
`


const ScrollWrapper = styled.div`
  max-height: calc(100dvh - 60px); /* 헤더 + 버튼 제외한 영역 */
  overflow-y: auto;
  padding-bottom: 80px; /* 버튼 영역 확보 */
`;

const HeaderTitle = styled.span`
  padding-left: 10px;
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-SemiBold;
  color: #1A1E28;
`;


/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileFreezeRecipecontainer =({containerStyle, name, filterary}) =>  {



  const [loading, setLoading] = useState(true);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [totalitems, setTotalitems] = useState([]);
  const [displayitems, setDisplayitems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [freezerecommenditems, setFreezerecommenditems] = useState([]);
  const [freezerecommenddisplayitems, setFreezerecommenddisplayitems] = useState([]);

  const [categoryMenu, setCategoryMenu] = useState('전체');
  const [visibleImages, setVisibleImages] = useState(10);
  const [airecipe, setAirecipe] = useState('');
  const [recipemenus, setRecipemenus] = useAtom(Recipemenus);
  const [recipepopup, setRecipepopup] = useState(false);
  const [recipeitem, setRecipeitem] = useState({});
  const [totalitem, setTotalitem] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setFreezerecommenditems(freezerecommenditems);
    setFreezerecommenddisplayitems(freezerecommenddisplayitems);
    setCategoryItems(categoryItems);
    setTotalitems(totalitems);
    setDisplayitems(displayitems);
    setLoading(loading);
    setAirecipe(airecipe);
    setRecipepopup(recipepopup);
    setRecipeitem(recipeitem);
    setTotalitems(totalitem);

  },[refresh])

  const fetchData = async () => {
    const allRecipes = await ReadRECIPE();


    const matched = allRecipes.filter(recipe => {
      const parts = recipe.ITEM.RCP_PARTS_DTLS;
      return filterary.every(keyword => parts.includes(keyword));
    });

    const prompt = filterary.length === 1
      ? `${filterary[0]}을 활용한 요리 방법 알려줘`
      : `${filterary[0]}와 ${filterary[1]}을 활용한 요리 방법 알려줘`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    setAirecipe(removeSymbols(text));
    setFreezerecommenddisplayitems(matched);
    setLoading(false);
  };

  /**

   */
  // useEffect(()=>{
  //   const now = moment();

  //   console.log("기준값1", JSON.stringify(recipemenus));
  //   console.log("기준값2", JSON.stringify(filterary));

  //   if (JSON.stringify(recipemenus) == JSON.stringify(filterary) ) {
  //     console.log("같지 않을때 이다");
  //     FetchData();
  //   } else {
  //     setLoading(false);
  //   }

  // }, [])


  const _handleCategory = (category)=>{

    setCategoryMenu(category);

    if(category == '전체'){
      setFreezerecommenddisplayitems(freezerecommenditems);
    }else{

      let items = [];
      freezerecommenditems.map((data)=>{
        if(data.ITEM.RCP_PAT2 == category){
          items.push(data);
        }
      })

      setFreezerecommenddisplayitems(items);
    }
    setRefresh((refresh) => refresh +1);
  }



  // 모달창을 여기서 띄우자
  const _handleRecipe = (item)=>{
    // navigate("/Mobilerecipe", { state: { item: item.ITEM } })
    setRecipeitem(item.ITEM);
    setTotalitems(item);
    setRecipepopup(true);
    setRefresh((refresh) => refresh + 1);
  }
  const mobilerecipepopupclose = () => {
    setRecipepopup(false);
    setRefresh((refresh) => refresh + 1);
  }

  const _handleprev = () => {
    navigate(-1);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  return (
    <>
      {recipepopup == true && <MobileRecipePopup callback={mobilerecipepopupclose} item={recipeitem} totalitem={totalitem} />}

      {loading == true ? (
        <LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'} />
      ) : (
        <Container style={containerStyle}>
          <Header onClick={_handleprev}>
            <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center" }}>
              <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
              <HeaderTitle>{name}</HeaderTitle>
            </div>
          </Header>

          <ScrollWrapper>
            <AILabel style={{ marginTop: 35 }}>구해줘 알바가 요리재료를 바탕으로 분석한 레시피는 다음과 같습니다</AILabel>

            <Row style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
              <Return>
                <FlexstartRow style={{ marginBottom: 20 }}>
                  <div style={{ width: "10%" }}>
                    <div style={{ background: "#E8E9EA", width: 40, borderRadius: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img src={imageDB.teachericon} style={{ width: "30px" }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: () => getFontSize(16), paddingLeft: 20 }}>{'구해줘 알바 AI 레시피 \n'}</div>
                </FlexstartRow>
                {airecipe}
              </Return>
            </Row>

            <AILabel>맞춤 레시피는 다음과 같습니다</AILabel>

            {freezerecommenddisplayitems.length === 0 && (
              <Column style={{ marginTop: 50, marginBottom: 40 }}>
                <Empty content={'냉장고 재료에 맞는 맞춤 레시피가 없습니다'} fontsize={'14px'} />
              </Column>
            )}

            {freezerecommenddisplayitems.length > 0 && (
              <Column style={{ marginBottom: 50 }}>
                <FlexstartRow style={{ width: "100%", flexWrap: "wrap", marginBottom: 20, marginTop: 10 }}>
                  <MenuButton enable={categoryMenu == '전체'} onClick={() => { _handleCategory('전체') }}>전체</MenuButton>
                  {categoryItems.map((data) => (
                    <MenuButton enable={categoryMenu == data.key} onClick={() => { _handleCategory(data.key) }}>{data.key}{data.size}</MenuButton>
                  ))}
                </FlexstartRow>

                <BoxLayer>
                  {freezerecommenddisplayitems.slice(0, visibleImages).map((data, index) => (
                    <FreezeItem key={index} onClick={() => { _handleRecipe(data) }}>
                      <div style={{ width: "35%" }}>
                        <LazyLoadImage
                          src={ensureHttps(data.ITEM.ATT_FILE_NO_MAIN)}
                          effect="blur"
                          width={120}
                          height={120}
                          style={{ display: "block", objectFit: "cover", borderRadius: "5px" }}
                        />
                      </div>
                      <div style={{ width: "60%", marginLeft: "5%" }}>
                        <FlexstartRow>
                          <TipMenu>{data.ITEM.RCP_PAT2}</TipMenu>
                          <TipMenu2>{data.ITEM.RCP_WAY2}</TipMenu2>
                        </FlexstartRow>
                        <Recipename>{data.ITEM.RCP_NM}</Recipename>
                        <Recipetip>{data.ITEM.RCP_NA_TIP}</Recipetip>
                      </div>
                    </FreezeItem>
                  ))}
                </BoxLayer>
              </Column>
            )}
          </ScrollWrapper>
        </Container>
      )}
    </>
  );

}

export default MobileFreezeRecipecontainer;

