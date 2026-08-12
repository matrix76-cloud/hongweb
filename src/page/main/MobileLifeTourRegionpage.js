import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import MobileLifeTourRegioncontainer from "../../container/main/MobileLifeTourRegioncontainer";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileLifeTourRegionpage =() =>  {

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

    <MobileCommunityLayout name={'관광지'} type={MOBILEMAINMENU.COMMUNITYMENU} image=''>
        <MobileLifeTourRegioncontainer name={'관광지'}    />
    </MobileCommunityLayout>
  );

}

export default MobileLifeTourRegionpage;

