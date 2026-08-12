import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import moment from "moment";


import { BetweenRow, FlexstartRow, Row } from "../common/Row";

import { Column, FlexstartColumn } from "../common/Column";


import { ensureHttps, useSleep } from "../utility/common";

import Recipe from "../components/Recipe";
import LazyImage from "../common/LasyImage";
import { imageDB } from "../utility/imageData";
import KakaoShare from "./KakaoShare";
import { getFontSize } from "../utility/fontsize";
import { useRecipeAiTip } from "../hooks/useRecipeAiTip";



const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */

  touch-action: pan-y;
  margin-top:50px;
`

const Empty = styled.div`
  height: 10px;
  background: #F5F6F9;
  margin: 20px 0px;

`
const SubContent = styled.div`
  width: 90%;
  margin: 0 auto;

`
const Content = styled.div`
 
`

const ContentText = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  font-family : Pretendard-SemiBold;
`
const TipMenu = styled.div`

  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: ${({ highlight }) => highlight ? '#FFF0E9' : '#F5F6F9'};
  color: ${({ highlight }) => highlight ? '#FF7E19' : '#444'};
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
  width: 50px;
  padding: 5px 5px;
  height:20px;
    align-items: center;

`

const RecipeName = styled.div`
  font-size: ${() => getFontSize(20)}px !important;
  font-family : Pretendard-SemiBold;

`

const LableIconLayer = styled.div`
  border-radius: 5px;
  height: 30px;
  display:flex;
  justify-content:flex-start;
  align-items:center;
`
const LabelText = styled.div`
  font-family : Pretendard-SemiBold;
    font-size: ${() => getFontSize(18)}px !important;
`
const Line = styled.div`
  border: 1px dotted;
  background: #f1f1f1;
  width: 50%;

`
const Property = styled.div`
width: 10%;
display: flex;
justify-content: flex-end;
font-family:Pretendard-Light;

`


const PrevLayer = styled.div`
    font-size: ${() => getFontSize(18)}px !important;
    color: rgb(19, 19, 19);
    align-items: center;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    z-index: 10;
    position: fixed;
    top:0px;
    padding-left:15px;



`

const TipLayer = styled.div`
  background: #FFF7F1;
  color: #333;
  padding: 14px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #FF7E19;
  font-size: ${() => getFontSize(13)}px;
`;

const TipIcon = styled.img`
  width: 16px;
  margin-right: 6px;
`;

// AiTipBox.jsx
export const AITag = styled.div`
  display: inline-block;
  background-color: #FF7E19;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

export const Summary = styled.div`
  position: relative;
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  background-color: #fffaf5;
  border-left: 4px solid #FF7E19;
  border-radius: 8px;
  padding: 14px;
  box-shadow: 0 0 0 1px #f0f0f0;
  margin-top: 8px;

`;


/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileRecipeDetail =({containerStyle, item, callback, share= false, totalitem}) =>  {

 

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);
  const [ingredient, setIngredient] = useState([]);

  console.log("item", item);

  const { tip, loading: tipLoading } = useRecipeAiTip(totalitem.RECIPE_ID, item);


  useLayoutEffect(() => {
   let ingredientTmp =  item.RCP_PARTS_DTLS.split(',');
    setIngredient(ingredientTmp);
    



   setRefresh((refresh) => refresh +1);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setIngredient(ingredient);


  },[refresh])

  function IngredientName(ingredient){

    let startposition = ingredient.indexOf('(');
    let lastposition = ingredient.indexOf(')');

    if(startposition > 0){
      return ingredient.substring(0,startposition);

    }else{
      return ingredient;
    }
  
  

  }
  function IngredientQty(ingredient){

    let startposition = ingredient.indexOf('(');
    let lastposition = ingredient.indexOf(')');
  
    if(startposition > 0 && lastposition > 0){
      return ingredient.substring(startposition+ 1,lastposition);

    }else{
      return "";
    }


  }


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


  const _handleClose = () => {
    callback();
  }



  return (
    <>

    {

        <Container style={containerStyle}>

          <div>

            {share == false &&
              <PrevLayer>
                <img src={imageDB.close} style={{ height: 24 }} onClick={_handleClose} />
                <RecipeName style={{ paddingLeft: 10, fontSize: getFontSize(20) }}>{item.RCP_NM}</RecipeName>
              </PrevLayer>
            }

            <Content>
              <LazyImage src={ensureHttps(item.ATT_FILE_NO_MK)} containerStyle={{ width: '100%', backgroundColor: '#ededed' }} />
              <SubContent>

                <BetweenRow style={{ marginTop: 10 }}>
                  <Row>
                    <TipMenu>
                      {item.RCP_PAT2}
                    </TipMenu>
                    <TipMenu>{item.RCP_WAY2}</TipMenu>
                  </Row>

        
                </BetweenRow>
                <FlexstartRow style={{ margin: "20px auto" }}>
                  <RecipeName>{item.RCP_NM}</RecipeName>
                </FlexstartRow>

         
                
                <AITag>AI가 요약한 내용</AITag>

                <Summary>


                  {tipLoading ? (
                    <>AI가 요리를 분석 중입니다...</>
                  ) : (
                    <>
                      {tip}

                    </>)}
                </Summary>


              </SubContent>

              <Empty />

              <SubContent>
                <FlexstartRow>

                  <LabelText>필요한 재료 {ingredient.length}개</LabelText>
                </FlexstartRow>

                <FlexstartColumn style={{ marginTop: 10 }}>
                  {
                    ingredient.map((data) => (
                      <BetweenRow style={{ width: "100%", margin: "5px auto" }}>
                        <div style={{ width: "100%" }}>{data}</div>
                        {/* <Line></Line>
                <Property>{IngredientQty(data)}</Property> */}
                      </BetweenRow>
                    ))
                  }
                </FlexstartColumn>

              </SubContent>
              <Empty />


              <SubContent>
                <FlexstartRow>

                  <LabelText>영양소</LabelText>
                </FlexstartRow>


                <BetweenRow style={{ width: "100%", margin: "10px auto" }}>
                  <div style={{ width: "20%" }}>{'열량'}</div>
                  <Line></Line>
                  <Property>{item.INFO_ENG}cal</Property>
                </BetweenRow>

                <BetweenRow style={{ width: "100%", margin: "10px auto" }}>
                  <div style={{ width: "20%" }}>{'탄수화물'}</div>
                  <Line></Line>
                  <Property>{item.INFO_CAR}g</Property>
                </BetweenRow>


                <BetweenRow style={{ width: "100%", margin: "10px auto" }}>
                  <div style={{ width: "20%" }}>{'단백질'}</div>
                  <Line></Line>
                  <Property>{item.INFO_PRO}g</Property>
                </BetweenRow>


                <BetweenRow style={{ width: "100%", margin: "10px auto" }}>
                  <div style={{ width: "20%" }}>{'지방'}</div>
                  <Line></Line>
                  <Property>{item.INFO_FAT}g</Property>
                </BetweenRow>

                <BetweenRow style={{ width: "100%", margin: "10px auto" }}>
                  <div style={{ width: "20%" }}>{'나트륨'}</div>
                  <Line></Line>
                  <Property>{item.INFO_NA}g</Property>
                </BetweenRow>


              </SubContent>

              <Empty />

              <SubContent>
                <FlexstartRow>
                  <LabelText>조리방법</LabelText>
                </FlexstartRow>
              </SubContent>


              <Recipe item={item} />

            </Content>


          </div>

      </Container>
    }


    </>


  );

}

export default MobileRecipeDetail;

