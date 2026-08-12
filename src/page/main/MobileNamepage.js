import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MobileGatecontainer from "../../container/main/MobileGatecontainer";
import MobilePhonecontainer from "../../container/main/MobilePhonecontainer";
import MobilePolicycontainer from "../../container/main/MobilePolicycontainer";

import MobileSplashcontainer from "../../container/main/MobileSplashcontainer";
import { UserContext } from "../../context/User";

import MobileNamecontainer from "../../container/main/MobileNamecontainer";
import MobileHongLayout from "../../screen/Layout/Layout/MobileHongLayout";
import MobileNameLayout from "../../screen/Layout/Layout/MobileNameLayout";




const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileNamepage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);



 
  return (
    <div>
      <MobileNameLayout>
        <MobileNamecontainer />
      </MobileNameLayout>
    </div>

  
  );

}

export default MobileNamepage;

