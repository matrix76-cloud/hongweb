import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import MobileFreezeRecipecontainer from "../../container/main/MobileFreezeRecipecontainer";
import { MobileCommunityContentLayout } from "../../screen/Layout/Layout/MobileCommunityContentLayout";
import MobileRecipeContentLayout from "../../screen/Layout/Layout/MobileRecipeContentLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileFreezeRecipepage =() =>  {

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

    <MobileFreezeRecipecontainer name={location.state.name}  filterary={location.state.filterary}   />

  );

}

export default MobileFreezeRecipepage;

