import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import MobileMapcontainer from "../../container/main/Mobilemapcontainer";
import PCMaincontainer from "../../container/PCmain/PCMaincontainer";
import PCMapcontainer from "../../container/PCmain/PCMapcontainer";
import { UserContext } from "../../context/User";
import MobileMapLayout from "../../screen/Layout/Layout/MobileMapLayout";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";
import MobilePrevLayout2 from "../../screen/Layout/Layout/MobileCommunityLayout";

import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import localforage from 'localforage';
import { KeywordAddress } from "../../utility/region";
import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../store/menu/MenuSlice";
const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileMappage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  console.log("TCL: PCMappage -> location", location)
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [address_name, setAddress_name] = useState(user.address_name);

  const reduxdispatch = useDispatch();
  const {value} = useSelector((state)=> state.menu);


  useLayoutEffect(()=>{

    localforage.getItem('userconfig')
    .then(function(value) {
      console.log("TCL: listener -> GetItem value", value.address_name)
      setAddress_name(value.address_name);
    })
    .catch(function(err) {

    });

    setRefresh((refresh) => refresh +1);
  },[value])



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
    setAddress_name(address_name);
  },[refresh])

 
  return (

    <MobileMapLayout name={KeywordAddress(address_name)} type={MOBILEMAINMENU.REGIONMENU} image=''>
        <MobileMapcontainer  ID={location.state.ID} TYPE={location.state.TYPE}  />
    </MobileMapLayout>
  );

}

export default MobileMappage;

