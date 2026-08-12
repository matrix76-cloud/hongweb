import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import MobileRecipecontainer from "../../container/main/MobileRecipecontainer";
import MobilePicturecontainer from "../../container/main/MobilePicturecontainer";
import MobileWebtooncontainer from "../../container/main/MobileWebtooncontainer";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";
const Container = styled.div`

`
const style = {
  display: "flex"
};


const ScrollWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`



const MobileWebtoonpage =() =>  {

  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

  }, [])


 
  return (

    <MobilePrevLayout>
      <MobileWebtooncontainer image={location.state.image} name={location.state.name} />
    </MobilePrevLayout>


  );

}

export default MobileWebtoonpage;

