import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import { Row } from "../../common/Row";

const Container = styled.div`
    margin-top:30px;
    height:1000px;
`
const style = {
  display: "flex"
};


const PCCommunitycontainer =({containerStyle}) =>  {

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
    <Container style={containerStyle}>
      <Row>
        <div style={{display:"flex", width:'100%', height:1000, backgroundColor:'#ededed'}}></div>
      </Row>
    </Container>
  );

}

export default PCCommunitycontainer;

