import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";

import MobileLifeMedicalDrugDetailcontainer from "../../container/main/MobileLifeMedicalDrugDetailcontainer";
import { MobileCommunityContentLayout2 } from "../../screen/Layout/Layout/MobileCommunityContentLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileLifeMedicalDrugDetailpage =() =>  {

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
    <MobileCommunityContentLayout2 name={location.state.name} type={MOBILEMAINMENU.COMMUNITYMENU} image=''>
      <MobileLifeMedicalDrugDetailcontainer name={location.state.name} index={location.state.index}  search={location.state.search}
        data={location.state.item}    />
    </MobileCommunityContentLayout2>
  );
}

export default MobileLifeMedicalDrugDetailpage;

