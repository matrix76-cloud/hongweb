import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Configcontainer from "../../container/main/Configcontainer";
import Maincontainer from "../../container/main/Maincontainer";
import Mapcontainer from "../../container/main/Mapcontainer";
import MobileConfigcontainer from "../../container/main/MobileConfigcontainer";
import { UserContext } from "../../context/User";
import HomeLayout from "../../screen/Layout/Layout/HomeLayout";
import MobileConfigLayout from "../../screen/Layout/Layout/MobileConfigLayout";
import MobileLayout from "../../screen/Layout/Layout/MobileLayout";
import { MOBILEMAINMENU } from "../../utility/screen";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileConfigpage =() =>  {

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

    <MobileConfigLayout  name={MOBILEMAINMENU.CONFIGMENU} type={MOBILEMAINMENU.CONFIGMENU} >
      <MobileConfigcontainer/>
    </MobileConfigLayout>
     

  );

}

export default MobileConfigpage;

