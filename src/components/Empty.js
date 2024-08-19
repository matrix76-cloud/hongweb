import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";



const Container = styled.div`
  height :${({height}) => height}px;
  background-color : ${({bgcolor}) =>bgcolor};
  margin: 50px 0px 30px;
`
const style = {
  display: "flex"
};

const Empty =({containerStyle, height, bgcolor}) =>  {
 
  return (

    <Container style={containerStyle} height={height} bgcolor={bgcolor}>
   
    </Container>
  );

}

export default Empty;

