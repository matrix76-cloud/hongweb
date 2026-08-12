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
    font-family: 'Pretendard-SemiBold';
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

      {/* 화살표(>)와 닫기(X) 제거 — 지도는 하단 탭 화면이라 뒤로 갈 곳이 탭이다 (형 리뷰 2026-08-12).
          위치 변경은 지역명 자체를 누르면 된다. */}
      <div style={{paddingLeft:20, width:'100%', display:"flex", color:"#131313",
      fontSize:"17px", justifyContent:"flex-start", alignItems:"center",
      fontWeight:600, gap:8, cursor:"pointer"}} onClick={_handlemapreconfig}>
        <img src={imageDB.mappin} style={{width:20, height:20}}/>
        <div>{name}</div>
      </div>
    </Container>
  );
};

export default MobileMapheader;
