import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import MobileSearchLayout from "../../screen/Layout/Layout/MobileSearchLayout";
import MobileAICategoryCreatecontainer from "../../container/main/MobileAICategoryCreatecontainer";
import MobileAICategoryContentcontainer from "../../container/main/MobileAICategoryContentcontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
  
};

const MobileAICategoryContentpage =() =>  {
  const location = useLocation();

  return (

    <MobileSearchLayout name={location.state.KEYWORD} >
        <MobileAICategoryContentcontainer CATEGORYCONTENT_ID={location.state.CATEGORYCONTENT_ID}
        CONTENT ={location.state.CONTENT} MEMOITEMS ={location.state.MEMOITEMS} />
    </MobileSearchLayout>
  );

}

export default MobileAICategoryContentpage;

