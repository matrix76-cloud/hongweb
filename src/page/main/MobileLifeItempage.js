import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

import MobileLifeItemcontainer from "../../container/main/MobileLifeItemcontainer";
import MobileOnlyPrevLayout from "../../screen/Layout/Layout/MobileOnlyPrevLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileLifeItempage =() =>  {

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

    <MobileOnlyPrevLayout name={''} type={MOBILEMAINMENU.COMMUNITYMENU} image=''>
        <MobileLifeItemcontainer item={location.state.item}     />
    </MobileOnlyPrevLayout>
  );

}

export default MobileLifeItempage;

