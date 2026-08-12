import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

import MobileRecipeContentLayout from "../../screen/Layout/Layout/MobileRecipeContentLayout";
import MobileTourCourseAnalyzecontainer from "../../container/main/MobileTourCourseAnalyzecontainer";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import MobileHongLayout from "../../screen/Layout/Layout/MobileHongLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileTourCourseAnalyzepage =() =>  {

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

    <MobileHongLayout name={location.state.name} type={MOBILEMAINMENU.COMMUNITYMENU} image=''>
      <MobileTourCourseAnalyzecontainer item = {location.state.COURSEITEM} name={location.state.name}/>
    </MobileHongLayout>
  );

}

export default MobileTourCourseAnalyzepage;

