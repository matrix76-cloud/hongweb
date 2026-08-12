import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";

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
import MobileStoreInfo from "../../components/MobileStoreInfo";

import { getFontSize } from "../../utility/fontsize";
import { ensureHttps, useSleep } from "../../utility/common";


import { GrTip } from "react-icons/gr";
import { TbComponents } from "react-icons/tb";
import Recipe from "../../components/Recipe";
import LazyImage from "../../common/LasyImage";
import { imageDB } from "../../utility/imageData";

const Container = styled.div`
  padding:50px 0px;
  height: 100%;
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
const Content = styled.div``

const ContentText = styled.div`
  font-size: ${() => getFontSize(12)}px;
  font-family : Pretendard-SemiBold;
`
const TipMenu = styled.div`

  background: #FFF0E9;
  color: #FE6625;
  padding: 3px 10px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px;
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
  font-size: ${() => getFontSize(12)}px;
  display: flex;
  justify-content: center;
  width: 40px;

`

const RecipeName = styled.div`
  font-size: ${() => getFontSize(20)}px;
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
  font-size :18px;
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
const TipLayer = styled.div`
    background: rgb(255, 248, 235);
    color: rgb(255, 140, 0);
    padding: 15px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

`

/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileRecipeItem = ({ containerStyle, item }) => {
    const { dispatch, user } = useContext(UserContext);
    const { datadispatch, data } = useContext(DataContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(1);
    const [currentloading, setCurrentloading] = useState(true);
    const [ingredient, setIngredient] = useState([]);


    useLayoutEffect(() => {
        let ingredientTmp = item.RCP_PARTS_DTLS.split(',');
        setIngredient(ingredientTmp);
        setRefresh((refresh) => refresh + 1);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => { };
    }, []);

    useEffect(() => {
        setCurrentloading(currentloading);
        setIngredient(ingredient);


    }, [refresh])

    function IngredientName(ingredient) {

        let startposition = ingredient.indexOf('(');
        let lastposition = ingredient.indexOf(')');

        if (startposition > 0) {
            return ingredient.substring(0, startposition);

        } else {
            return ingredient;
        }



    }
    function IngredientQty(ingredient) {

        let startposition = ingredient.indexOf('(');
        let lastposition = ingredient.indexOf(')');

        if (startposition > 0 && lastposition > 0) {
            return ingredient.substring(startposition + 1, lastposition);

        } else {
            return "";
        }


    }

    /**
  
     */
    useEffect(() => {
        const now = moment();

        async function FetchData() {

            await useSleep(1000);
            setCurrentloading(false);
        }
        FetchData();

    }, [])



    return (
        <>

            {

                <Container style={containerStyle}>
                    <LazyImage src={ensureHttps(item.ATT_FILE_NO_MAIN)} containerStyle={{ width: '100%', backgroundColor: '#ededed' }} />

                    <Content>

                        <SubContent>

                            <FlexstartRow style={{ marginTop: 10 }}>
                                <TipMenu>{item.RCP_PAT2}</TipMenu>
                                <TipMenu2>{item.RCP_WAY2}</TipMenu2>
                            </FlexstartRow>
                            <FlexstartRow style={{ margin: "20px auto" }}>
                                <RecipeName>{item.RCP_NM}</RecipeName>
                            </FlexstartRow>

                            <TipLayer>
                                <FlexstartRow>
                                    <LableIconLayer>
                                        <img src={imageDB.ic_common_etc_tip} style={{ width: 18 }} />
                                    </LableIconLayer>
                                    <LabelText style={{ marginLeft: 5, fontSize: () => getFontSize(14) }}>TIP</LabelText>
                                </FlexstartRow>
                                <ContentText>{item.RCP_NA_TIP}</ContentText>
                            </TipLayer>

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






                </Container>
            }


        </>


    );

}

export default MobileRecipeItem;

