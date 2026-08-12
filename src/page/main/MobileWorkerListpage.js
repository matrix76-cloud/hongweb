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
import MobileWorkerListcontainer from "../../container/main/MobileWorkerListcontainer";
import MobileListLayout from "../../screen/Layout/Layout/MobileListLayout";
import MobileWorkerListLayout from "../../screen/Layout/Layout/MobileWorkerListLayout";
const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileWorkerListpage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [address_name, setAddress_name] = useState(user.address_name);

  const reduxdispatch = useDispatch();
  const {value} = useSelector((state)=> state.menu);





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

    <MobileWorkerListLayout type={MOBILEMAINMENU.HOMESEARCHMENU}>
        <MobileWorkerListcontainer />
    </MobileWorkerListLayout>
  );

}

export default MobileWorkerListpage;

