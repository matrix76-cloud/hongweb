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
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../../utility/fontsize";
import { safeTop } from "../../../utility/screen";
const Container = styled.div``;


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: ${({ isGalaxyFlipUnfolded }) => (isGalaxyFlipUnfolded ? "20%" : "0")};
  width: ${({ isGalaxyFlipUnfolded }) => (isGalaxyFlipUnfolded ? "60%" : "100%")};
  height: 50px;
  background-color: #fff;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Pretendard-SemiBold";
  padding: 0 16px;
`;


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



const MobileHongheader = ({callback, registbtn, name, iconname}) => {
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

  const _handleConfig=()=>{
    navigation("/Mobileconfig");
  }
  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });
  return (
    <HeaderWrapper>

      <div onClick={_handleprev}  style={{width:'100%', display:"flex", alignItems:"center"}}>
        <img  src={imageDB.leading} style={{width:24}} />
        <div style={{fontSize:"20px", paddingLeft:5}}>{name}</div>
      </div>
    </HeaderWrapper>
  );
};

export default MobileHongheader;
