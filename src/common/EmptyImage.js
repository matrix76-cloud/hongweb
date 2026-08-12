import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { getFontSize } from '../utility/fontsize';


const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 50px;
  font-family: 'Pretendard-Regular';
  font-size: ${() => getFontSize(16)}px !important;
  background : #F9F9F9;
  color :#131313;



`

const SubLabel= styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  font-family: 'Pretendard-Regular';
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;


`
const style = {
  display: "flex"
};

const EmptyImage =({containerStyle}) =>  {


 
  return (

    <Container style={containerStyle}>
        <img src={src}/>
   
    </Container>
  );

}

export default EmptyImage;

