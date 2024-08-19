import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";



const Container = styled.div`

    height: ${({height})=> height};
    width: ${({width})=> width};
    border-radius: ${({radius})=> radius};
    background: ${({bgcolor})=> bgcolor};
    color :${({color})=> color};
    margin: 0px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border : ${({enable}) => enable == true ? ('2px solid #76baff'):('1px solid')};
    &:hover{
      background :#76baff;
      color :#fff;
    } 
`
const style = {
  display: "flex"
};

const Button =({containerStyle, text, height,width, radius, bgcolor, color, onPress, enable}) =>  {

  return (

    <Container 
    onClick={onPress} enable={enable}
    style={containerStyle} height={height} width={width} radius={radius} bgcolor={bgcolor} color={color}>
        <div>{text}</div>
    </Container>
  );

}

export default Button;

