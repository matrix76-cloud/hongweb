import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import moment from "moment";

import { DataContext } from "../context/Data";


import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";

import { Column, FlexstartColumn } from "../common/Column";

import { GoNoEntry } from "react-icons/go";



import { ensureHttps, useSleep } from "../utility/common";

import LazyImage from "../common/LasyImage";

import { GrTip } from "react-icons/gr";
import { TbComponents } from "react-icons/tb";
import Recipe from "../components/Recipe";

import { RiCloseLargeLine } from "react-icons/ri";

const Container = styled.div`
  padding:0px 0px;
  height: 95%;
  width:100%;
  background : #f9f9f9;
  overflow-y : auto;

`

const Empty = styled.div`
  height: 2px;
  background: #ededed;
  margin: 20px 0px;

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
    width: 10%;
    color: #fff;
    background :#fe6625;
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
  width: 10%;
  color: #fff;
      background :#fe6625;
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
  border-radius: 5px;
  height: 30px;
  display:flex;
  justify-content:flex-start;
  align-items:center;
`
const LabelText = styled.div`
  margin-left:5px;
  font-family : Pretendard-SemiBold;
  font-size :16px;
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

/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const PCRecipe =({containerStyle, item, callback}) =>  {


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);
  const [ingredient, setIngredient] = useState([]);


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


  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){

      await useSleep(1000);
      setCurrentloading(false);
    } 
    FetchData();

  }, [])

  const _handleClose = () =>{
    callback();
  }



  return (
    <>

    {

      <Container style={containerStyle}>
        <FlexEndRow style={{marginRight:30, position:"fixed", background:"#fff", width:"100%", height:50}}>
          <RiCloseLargeLine size={30} onClick={_handleClose}/>
        </FlexEndRow>
          


        <LazyImage src={ensureHttps(item.ATT_FILE_NO_MAIN)} containerStyle={{width:'100%',  backgroundColor: '#fff' }}/>

        <Content>

        <SubContent>

          <FlexstartRow>
            <Tag1>{item.RCP_PAT2}</Tag1>
            <Tag2>{item.RCP_WAY2}</Tag2>
          </FlexstartRow>

          <FlexstartRow>
            <LableIconLayer>
              <GrTip color={'#131313'}/>
            </LableIconLayer>
            <LabelText>요리팁</LabelText>
          </FlexstartRow>
    

          <ContentText>{item.RCP_NA_TIP}</ContentText>
        </SubContent>

        <Empty/>

        <SubContent>
          <FlexstartRow>
            <LableIconLayer>
              <TbComponents color={'#131313'}/>
            </LableIconLayer>
            <LabelText>필요한 재료 {ingredient.length}개</LabelText>
          </FlexstartRow>

          <FlexstartColumn style={{marginTop:10}}>
          {
            ingredient.map((data)=>(
              <BetweenRow style={{width:"100%", margin:"5px auto"}}>
                <div style={{width:"100%"}}>{data}</div>
                {/* <Line></Line>
                <Property>{IngredientQty(data)}</Property> */}
              </BetweenRow>
            ))
          }
          </FlexstartColumn>

        </SubContent>
        <Empty/>


        <SubContent>
          <FlexstartRow>
            <LableIconLayer>
              <TbComponents color={'#131313'}/>
            </LableIconLayer>
            <LabelText>영양소</LabelText>
          </FlexstartRow>


          <BetweenRow style={{width:"100%", margin:"10px auto"}}>
                <div style={{width:"20%"}}>{'열량'}</div>
                <Line></Line>
                <Property>{item.INFO_ENG}cal</Property>
          </BetweenRow>

          <BetweenRow style={{width:"100%", margin:"10px auto"}}>
                <div style={{width:"20%"}}>{'탄수화물'}</div>
                <Line></Line>
                <Property>{item.INFO_CAR}g</Property>
          </BetweenRow>


          <BetweenRow style={{width:"100%", margin:"10px auto"}}>
                <div style={{width:"20%"}}>{'단백질'}</div>
                <Line></Line>
                <Property>{item.INFO_PRO}g</Property>
          </BetweenRow>


          <BetweenRow style={{width:"100%", margin:"10px auto"}}>
                <div style={{width:"20%"}}>{'지방'}</div>
                <Line></Line>
                <Property>{item.INFO_FAT}g</Property>
          </BetweenRow>

          <BetweenRow style={{width:"100%", margin:"10px auto"}}>
                <div style={{width:"20%"}}>{'나트륨'}</div>
                <Line></Line>
                <Property>{item.INFO_NA}g</Property>
          </BetweenRow>

    
        </SubContent>

        <Empty/>

        <SubContent>
          <FlexstartRow>
            <LableIconLayer>
              <TbComponents color={'#131313'}/>
            </LableIconLayer>
            <LabelText>조리방법</LabelText>
          </FlexstartRow>
        </SubContent>

 
        <Recipe item = {item}/>

        </Content>



   

  
      </Container>
    }


    </>


  );

}

export default PCRecipe;

