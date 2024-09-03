import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LottieAnimation from "../../common/LottieAnimation";
import { UserContext } from "../../context/User";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";


const Container = styled.div`
    margin-top:60px;
`
const style = {
  display: "flex"
};

const Communitycontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
      await useSleep(10000);
      setCurrentloading(false);
    } 
    FetchData();
  }, [])
  useEffect(()=>{
    setCurrentloading(currentloading);
  },[refresh])

 
  return (

    <Container style={containerStyle}>
    {
        currentloading == true ?
        ( <LottieAnimation containerStyle={{marginTop:"60%"}} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>) :(<div style={{height:"500px", width:"100%", background:"#ff0000"}}></div>)
    }
    </Container>
  );

}

export default Communitycontainer;

