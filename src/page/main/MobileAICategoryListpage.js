import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import MobileSearchLayout from "../../screen/Layout/Layout/MobileSearchLayout";
import MobileAICategoryCreatecontainer from "../../container/main/MobileAICategoryCreatecontainer";
import MobileAICategoryListcontainer from "../../container/main/MobileAICategoryListcontainer";
import MobileAiCategoryLayout from "../../screen/Layout/Layout/MobileAiCategoryLayout";


const Container = styled.div`

`
const style = {
  display: "flex"
  
};

const MobileAICategoryListpage =() =>  {
  const location = useLocation();

  return (

    <MobileAiCategoryLayout name={location.state.category.CATEGORY} >
      <MobileAICategoryListcontainer name={location.state.category.CATEGORY} />
    </MobileAiCategoryLayout>
  );

}

export default MobileAICategoryListpage;

