import React, { Fragment, useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { GrPrevious } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { CURRENTPAGE } from "../../../utility/router";
import { IoEllipseSharp } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { getFontSize } from "../../../utility/fontsize";
import { getFontSize } from "../../../utility/fontsize";
const Container = styled.div``;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pretendard-SemiBold';
    font-weight:600;
    padding-top: 5px;
    font-size: ${() => getFontSize(20)}px;
    padding-left: 10px;
    color :#000;

`



const MobileProfileheader = ({callback, registbtn, name, iconname}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);

  const location = useLocation();

  const _handleprev = () =>{

    if(location.pathname == CURRENTPAGE.MOBILESEARCH){
      navigation('/mobilemain');
    }else{
      navigation(-1);
    }
   
  }

  const _handlehistory = () =>{
    navigation("/Mobilesearchhistory");
  }


  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });
  return (
    <Container
      id="header"
      style={{
        zIndex: 999,
        left: isGalaxyFlipUnfolded ? "20%" : "0",
        position: "fixed",
        background: "#fff",
        width: isGalaxyFlipUnfolded ? "60%" : "100%",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: "1px solid #ededed",
        fontFamily:"Pretendard-SemiBold",
  
      }}
    >

      <div style={{paddingLeft:15, width:'10%', display:"flex"}}>
        <GrPrevious onClick={_handleprev} size={20} />
      </div>

      <div style={{width:'40%', display:"flex", fontFamily:"Pretendard-SemiBold", fontSize: () => getFontSize(18)}}>프로필</div>

      {
        iconname == 'searchmenu' &&  <div 
        onClick={_handlehistory}
        style={{paddingRight:20, width:'50%', display:"flex", justifyContent:"flex-end"}}>
        <GiHamburgerMenu size={22}/>
      </div>
      }
    
    
    </Container>
  );
};

export default MobileProfileheader;
