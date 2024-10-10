import React, { Fragment, useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB, Seekimage } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { GrPrevious } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { CURRENTPAGE } from "../../../utility/router";
import { IoEllipseSharp } from "react-icons/io5";
import { autoBatchEnhancer } from "@reduxjs/toolkit";

const Container = styled.div``;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'SF-Pro-Text-Semibold';
    font-weight:600;
    padding-top: 5px;
    font-size: 16px;
    padding-left: 10px;
    color :#000;

`



const MobileCommunityheader = ({callback, image,name}) => {
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



  return (
    <Container
      id="header"
      style={{
        zIndex: 999,
        position: "fixed",
        background: "#fff",
        width: "100%",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1px solid #ededed",
        fontFamily:"Pretendard-SemiBold",
  
      }}
    >


      <div style={{paddingLeft:15, display:"flex", fontWeight:700, fontSize:'16px', color:"#131313", alignItems:"center"}}>
        <div>{name}</div>
      </div>

      <div  style={{paddingRight:15, display:"flex"}}>
        <img onClick={_handleprev} src={imageDB.close2} style={{width:24}}/>
      </div>


    
    
    </Container>
  );
};

export default MobileCommunityheader;
