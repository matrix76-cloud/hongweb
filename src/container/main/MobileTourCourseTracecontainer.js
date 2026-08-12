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

import CourseMap from "../../components/CourseMap";

const Container = styled.div`
  height: 100%;

`


/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileTourCourseTracecontainer =({containerStyle, item, name}) =>  {

  console.log("TCL: MobileTourCourseContentcontainer -> item", item)



  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [region, setRegion] = useState('');


  useLayoutEffect(() => {

  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setRegion(region);

  },[refresh])


  /**

   */
  useEffect(()=>{
    const now = moment();

    const Region = item[0]["관광지명"];


    let RegionTmp =  Region.match(/\(([^)]+)\)/);
  



    setRegion(RegionTmp[1]);
    setRefresh((refresh) => refresh +1);
  }, [])
  
  const _handleprev = () => {
    navigate(-1);
  }


  return (
    <Container style={containerStyle}>


      <CourseMap items={item} name={name} />

    </Container>


  );

}

export default MobileTourCourseTracecontainer;

