import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import MobileRecipecontainer from "../../container/main/MobileRecipecontainer";
import MobilePicturecontainer from "../../container/main/MobilePicturecontainer";
import MobileHongLayout from "../../screen/Layout/Layout/MobileHongLayout";
import MobileBasicLayout from "../../screen/Layout/Layout/MobileBasicLayout";
const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobilePicturepage =() =>  {

  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

  }, [])


 
  return (

    <MobileBasicLayout>
      <MobilePicturecontainer item={location.state.item} />
    </MobileBasicLayout>

  );

}

export default MobilePicturepage;

