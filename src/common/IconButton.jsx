import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { IoFilterCircle } from "react-icons/io5";
import { MdOutlineRecommend } from "react-icons/md";
import { MdLockReset } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { imageDB } from "../utility/imageData";


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
    


`
const style = {
  display: "flex"
};

const IconButton =({containerStyle, text, height,width, radius, bgcolor, color, onPress, icon, iconcolor}) =>  {

  return (

    <Container 
    onClick={onPress}
    style={containerStyle} height={height} width={width} radius={radius} bgcolor={bgcolor} color={color}>
      {
        icon =='filter' &&  <img src={imageDB.filter}  style={{width:16, height:16}}/>
      }
      {
        icon =='recommend' &&  <MdOutlineRecommend size={30} color={iconcolor}/>
      }
      {
        icon =='reset' &&  <img src={imageDB.reset}  style={{width:16, height:16}}/>
      }
         {
        icon =='prev' &&  <FaArrowLeft size={30} color={iconcolor}/>
      }
        
      <div style={{marginLeft:5}}>{text}</div>
    </Container>
  );

}

export default IconButton;

