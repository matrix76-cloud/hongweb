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
import MobileConfessLayout from "../../screen/Layout/Layout/MobileConfessLayout";
import MobileConfesscontainer from "../../container/main/MobileConfesscontainer";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileConfesspage =() =>  {

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


    <MobileConfessLayout name={'한줄 칭찬이 동네	가게를 빛나게 합니다'} type={MOBILEMAINMENU.CONFESSMENU} >
      <MobileConfesscontainer />
    </MobileConfessLayout>
     

  );

}

export default MobileConfesspage;

