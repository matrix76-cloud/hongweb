import React, { Fragment, useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { GrPrevious } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { CURRENTPAGE } from "../../../utility/router";
import { IoEllipseSharp } from "react-icons/io5";

const Container = styled.div``;

const HeaderTitle = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pretendard-SemiBold';
    font-weight:600;
    padding-top: 5px;
    font-size: 20px;
    padding-left: 10px;
    color :#000;

`



const MobilePrevheader = ({callback, registbtn, name, iconname}) => {
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
        background: "var(--surface)",
        width: "100%",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: "1px solid var(--border-soft)",
        fontFamily:"Pretendard-SemiBold",
  
      }}
    >

      {/* 화살표만 있으면 지금 어느 화면인지 알 수 없다 — 제목을 옆에 둔다 (형 리뷰 2026-08-12) */}
      <div style={{paddingLeft:15, display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1}}>
        <GrPrevious onClick={_handleprev} size={22} style={{flexShrink:0, cursor:"pointer"}} />
        {name && <HeaderTitle>{name}</HeaderTitle>}
      </div>

      {
        iconname == 'searchmenu' &&  <div 
        onClick={_handlehistory}
        style={{paddingRight:20, display:"flex", justifyContent:"flex-end", flexShrink:0}}>
        <GiHamburgerMenu size={22}/>
      </div>
      }
    
    
    </Container>
  );
};

export default MobilePrevheader;
