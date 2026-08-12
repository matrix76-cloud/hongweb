import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

import MobileRecipeContentLayout from "../../screen/Layout/Layout/MobileRecipeContentLayout";
import MobileTourCourseTracecontainer from "../../container/main/MobileTourCourseTracecontainer";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileTourCourseTracepage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  console.log("TCL: PCMappage -> location", location)
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])

 
  return (

    // <MobileRecipeContentLayout name={location.state.eventname} type={MOBILEMAINMENU.COMMUNITYMENU} image=''>
    <MobileTourCourseTracecontainer item={location.state.COURSEITEM} name={location.state.eventname} />
    // </MobileRecipeContentLayout>
  );

}

export default MobileTourCourseTracepage;

