import React, { Fragment, useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { GrPrevious } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { CURRENTPAGE } from "../../../utility/router";
import { IoEllipseSharp } from "react-icons/io5";
import { LuUserCircle } from "react-icons/lu";
import KakaoShare from "../../../components/KakaoShare";
import { CurrentMenu } from "../../../utility/screen";
import { useMediaQuery } from "react-responsive";
const Container = styled.div``;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pretendard-SemiBold';
    font-weight:600;
    padding-top: 5px;
  font-size: ${() => `${getFontSize(20)}px`} !important;
    padding-left: 10px;
    color :#000;

`
const Name = styled.div`
  font-size: ${() => `${getFontSize(20)}px`} !important;
  padding-left:10px;
`
const ShareBtnLayer = styled.div`
  
    display: flex;
    flex-direction : row;
    justify-content: flex-end;
    align-items: center;
    width :95%;
    margin-right:10px;


`


const MobileMemoheader = ({callback, registbtn, name, iconname, menu}) => {
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

      <div style={{ paddingLeft: 15, width: '100%', display: "flex", alignItems: "center" }} onClick={_handleprev} >
        <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
        <Name>{name}</Name>
      </div>


  
      
    </Container>
  );
};

export default MobileMemoheader;
