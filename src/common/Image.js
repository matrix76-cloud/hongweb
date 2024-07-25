import React,{useState, useEffect} from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, Link, useNavigate} from "react-router-dom";
import styled from 'styled-components';
import { imageDB } from '../utility/imageData';

const Container = styled.div`
  display:flex;
  justify-content: center;
`

const Imagesrc = styled.image`
    width:100%;
    borderRadius:100px;

`

const Image = ({containerStyle, source,Radius, imgWidth, imgHeight}) => {

  const navigate = useNavigate();




  return (
    <Container style={containerStyle}>
      {
        Radius == false ?  <img src={source} style={{width:imgWidth, height: imgHeight}}/> 
        :    <img src={source} style={{width:'100%',borderRadius:"100px"}}/>
      }
     
    </Container>
  );
}



export default Image;
