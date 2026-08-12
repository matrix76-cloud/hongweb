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
import localforage from 'localforage';
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import MobileLogoutSuccessPopup from "../../../modal/MobileSuccessPopup/MobileLogoutSuccessPopup";

import { LuUserCircle } from "react-icons/lu";
import { BetweenRow } from "../../../common/Row";
import { useMediaQuery } from "react-responsive";
import { getFontSize } from "../../../utility/fontsize";
const Container = styled.div``;


const ProfileConfigBtn = styled.div`
  background: #f9f9f9;
  padding: 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(12)}px !important;
  margin-right:20px;
`

const HeaderText = styled.div`
  font-size: ${() => getFontSize(20)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #666;
  flex: 1;
  padding-left:15px;
`;


const MobileChatContentheader = ({callback, image,name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);

  const [successpopup, setSuccesspopup] = useState(false);
  const [refresh, setRefresh] = useState(-1);

  const location = useLocation();


  const _handlelogout = async() =>{

    setSuccesspopup(true);

    await localforage.removeItem('userconfig');
    setRefresh((refresh) => refresh+1);


  }

  const successcallback = () =>{
    setSuccesspopup(false);
    setRefresh((refresh) => refresh+1);

  }

  useEffect(()=>{
    setSuccesspopup(successpopup);
  },[refresh])

  const _handleprev = () =>{
    navigation(-1);
  }

  const _handleConfig=()=>{
    navigation("/Mobileconfig");
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
        alignItems: "flex-end",
        justifyContent: "space-between",
        borderBottom: "1px solid #ededed",
        padding :"0px 10px",
        fontFamily: "Pretendard-SemiBold",
        paddingBottom:10,
        flexShrink: 0
      }}
    >



        <BetweenRow style={{width:"100%"}}>
        <div style={{ width: '100%', display: "flex", alignItems: "center" }} onClick={_handleprev}>
          <img src={imageDB.ic_common_top_back_nor} style={{height:24}}/>
          <HeaderText>{name} 님과 대화</HeaderText>
        </div>
        <img src={image} style={{ width: "35px", height: "30px", borderRadius:"35px", marginRight:20 }} />

      </BetweenRow>  



    </Container>
  );
};

export default MobileChatContentheader;
