import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import MobileSearchLayout from "../../screen/Layout/Layout/MobileSearchLayout";
import MobileAICategoryCreatecontainer from "../../container/main/MobileAICategoryCreatecontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
  
};

const MobileAICategoryCreatepage =() =>  {

  return (


      <MobileAICategoryCreatecontainer name={'카테고리'} />

  );

}

export default MobileAICategoryCreatepage;

