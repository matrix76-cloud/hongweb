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
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../../utility/fontsize";
import CommonHeader from "../../../components/CommonHeader";
const Container = styled.div``;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pretendard-SemiBold';
    font-weight:600;
    padding-top: 5px;
    font-size: ${() => getFontSize(16)}px;
    padding-left: 10px;
    color :#000;

`

const HeaderText = styled.div`
  font-size: ${() => `${getFontSize(20)}px`} !important;
  font-family:Pretendard-SemiBold;
  color: #333;
  flex: 1;
  line-height: 1.4;
  padding-left :10px;

  `;
const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  flex-direction:row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
  width :100%;
`;




const MobileWorkerheader = ({callback, image,name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);

  const location = useLocation();

  const _handleprev = () =>{

    if(location.pathname == CURRENTPAGE.MOBILESEARCH){
  
      navigation(-1);
    } else {

      navigation(-1);
    }
   
  }

  const _handlehistory = () =>{
    navigation("/Mobilesearchhistory");
  }

  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 450, maxWidth: 767 });

  return (
    <HeaderWrapper>
    
      <CommonHeader
        title="아르바이트 등록"
        pattern="default"
        pageId="registerWorker"
        titleAlign="left"
      />
    
    </HeaderWrapper>
  );
};

export default MobileWorkerheader;
