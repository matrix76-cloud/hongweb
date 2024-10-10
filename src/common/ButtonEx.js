import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";



const Container = styled.div`
    height: 44px;
    width: ${({width})=> width}%;
    border-radius: 4px;
    background: ${({bgcolor})=> bgcolor};
    color :${({color})=> color};
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    font-size: 18px;
    margin: 0px auto;
    font-family:"Pretendard-SemiBold";
`
const style = {
  display: "flex"
};

const ButtonEx =({containerStyle, text, width, bgcolor, color, onPress}) =>  {

  return (

    <Container 
    onClick={onPress} 
    style={containerStyle}  width={width} bgcolor={bgcolor} color={color}>
        <div>{text}</div>
    </Container>
  );

}

export default ButtonEx;

