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
import { FaChevronRight } from "react-icons/fa6";
import MobileGpsPopup from "../../../modal/MobileGpsPopup/MobileGpsPopup";

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



const MobileMapheader = ({callback, image,name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [gpspopup, setGpspopup] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setGpspopup(gpspopup);
  }, [refresh]);


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

  const _handlemapreconfig = () =>{
    navigation("/Mobilemapreconfig");   

  }

  const  _handlemapgps = () =>{
    setGpspopup(true);
    setRefresh((refresh) => refresh +1);
  }

  const gpspopupcallback = () =>{
    setGpspopup(false);
    setRefresh((refresh) => refresh +1); 
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
        fontFamily: 'Pretendard-SemiBold',
  
      }}
    >


      {
        gpspopup == true && <MobileGpsPopup callback={gpspopupcallback} />
      }

      <div style={{paddingLeft:15, width:'90%', display:"flex",color:"#131313", 
      fontSize:"16px",display:"flex", justifyContent:"flex-start", alignItems:"center",
      fontWeight:400}}>
        <img src={imageDB.mappin} style={{width:20, height:20}} onClick={_handlemapgps}/>
        <div style={{marginLeft:10, marginRight:10}}>{name}</div>
        <FaChevronRight onClick={_handlemapreconfig}/>
      </div>
 
      <div  style={{display: "flex",flexDirection: "row",justifyContent: "flex-end",marginRight: "20px",width: "10%"}}>
        <img onClick={_handleprev} src={imageDB.close2} style={{width:24}}/>
      </div>
    </Container>
  );
};

export default MobileMapheader;
