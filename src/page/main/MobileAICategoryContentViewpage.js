import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";

import MobileSearchLayout from "../../screen/Layout/Layout/MobileSearchLayout";
import MobileAICategoryCreatecontainer from "../../container/main/MobileAICategoryCreatecontainer";
import MobileAICategoryContentcontainer from "../../container/main/MobileAICategoryContentcontainer";
import MobileAICategoryContentViewcontainer from "../../container/main/MobileAICategoryContentViewcontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
  
};

const MobileAICategoryContentViewpage =() =>  {
  const location = useLocation();


  const [searchParams] = useSearchParams();

  const [categorycontent_id, setCategorycontent_id] = useState(searchParams.get('categorycontent_id'));// URL 쿼리에서 id 가져오기

  return (
    <MobileAICategoryContentViewcontainer CATEGORYCONTENT_ID={categorycontent_id} />
  );

}

export default MobileAICategoryContentViewpage;

