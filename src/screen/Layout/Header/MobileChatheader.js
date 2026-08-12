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
import { GoBell } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../../utility/fontsize";
const Container = styled.div``;



const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`;

const HeaderLayer = styled.div`
    padding-left: 15px;
    display: flex;
    color: rgb(19, 19, 19);
    font-size: ${() => getFontSize(18)}px;
    justify-content: flex-start;
    align-items: center;
    font-family: Pretendard-SemiBold;
    width :100%;
   

`
const HeaderText = styled.div`
  font-size: ${() => `${getFontSize(20)}px`} !important;
  font-family:Pretendard-SemiBold;
  color: #333;
  flex: 1;
  lineHeight: 1.4
  `;



const MobileChatheader = ({callback, image,name}) => {
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
    navigation('/mobilemain');
  }

  const _handleConfig=()=>{
    navigation("/Mobileprofile");
  }


  const _handleAI = async() =>{
    navigation("/Mobileaisearch");
    setRefresh((refresh) => refresh +1);
    
  }
  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });

  return (
    <HeaderWrapper>
      <HeaderLayer>
        <HeaderText>
          채팅하기
        </HeaderText>
      </HeaderLayer>

    </HeaderWrapper>
  );
};

export default MobileChatheader;
