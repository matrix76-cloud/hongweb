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
    display: flex;
    justify-content: center;
    align-items: center;
    border : ${({enable}) => enable == true ? ('1px solid #F75100'):('1px solid #C3C3C3')};
    &:hover{
      color :#000;
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

