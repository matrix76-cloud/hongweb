import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";

import { MOBILEMAINMENU } from "../../utility/screen";
import MobileLeisurecontainer from "../../container/main/MobileLeisurecontainer";



const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileHealthppage =() =>  {

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

    <MobileCommunityLayout registbtn ={false}  name={MOBILEMAINMENU.LEISUREMENU} type={MOBILEMAINMENU.LEISUREMENU} >
        <MobileLeisurecontainer/>
    </MobileCommunityLayout>
  );

}

export default MobileHealthppage;

