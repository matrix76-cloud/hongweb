import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";
import MobileMapLayout from "../../screen/Layout/Layout/MobileMapLayout";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import localforage from 'localforage';
import { KeywordAddress } from "../../utility/region";
import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../store/menu/MenuSlice";
import MobileListcontainer from "../../container/main/MobileListcontainer";
import MobileListLayout from "../../screen/Layout/Layout/MobileListLayout";
import MobileIntroduceListcontainer from "../../container/main/MobileIntroduceListcontainer";
import MobileIntroduceListLayout from "../../screen/Layout/Layout/MobileIntroduceListLayout";
const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileIntroduceListpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [address_name, setAddress_name] = useState(user.address_name);

  const reduxdispatch = useDispatch();






  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();    
    reduxdispatch(RESET());
  }, [])
  useEffect(()=>{
    // setAddress_name(address_name);
  },[refresh])

 
  return (

    <MobileIntroduceListLayout name={'자기소개가 있는 아르바이트지원 현황'}>
      <MobileIntroduceListcontainer  />
    </MobileIntroduceListLayout>
  );

}

export default MobileIntroduceListpage;

