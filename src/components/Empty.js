import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";



const Container = styled.div`
  height :${({height}) => height}px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom:50px;

`
const style = {
  display: "flex"
};

const Empty =({containerStyle, content, height}) =>  {
 
  return (

    <Container style={containerStyle} height={height} >
       <img src={imageDB.Empty} style={{height:60, width:60}}/>
       <div style={{fontSize:14, marginTop:10}}>{content}</div>
   
    </Container>
  );

}

export default Empty;

