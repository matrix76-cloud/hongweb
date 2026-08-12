import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import moment from "moment";

import { DataContext } from "../context/Data";
import CourseMap from "../components/CourseMap";

const Container = styled.div`
  height: 100%;

`


/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileTourCourseTrace =({containerStyle, item, name}) =>  {

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

export default MobileTourCourseTrace;

