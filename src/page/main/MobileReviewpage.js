import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';


import { UserContext } from "../../context/User";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

import MobileReviewcontainer from "../../container/main/MobileReviewcontainer";
import MobileOnlyPrevLayout from "../../screen/Layout/Layout/MobileOnlyPrevLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileReviewpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
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

    <MobileOnlyPrevLayout name={'일꾼 평가'} type={MOBILEMAINMENU.CHATMENU}>
        <MobileReviewcontainer ITEM ={location.state.ITEM} NAME={location.state.NAME} OWNER={location.state.OWNER} LEFTIMAGE={location.state.LEFTIMAGE}
        LEFTNAME= {location.state.LEFTNAME}/>
    </MobileOnlyPrevLayout>
  )

}

export default MobileReviewpage;

