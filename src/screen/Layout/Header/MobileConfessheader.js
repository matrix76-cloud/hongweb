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
import { FlexEndRow } from "../../../common/Row";
import { DeleteUSERByUSERS_ID } from "../../../service/UserService";
import MobileUserDeleteSuccessPopup from "../../../modal/MobileUserDeleteSuccessPopup";
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../../utility/fontsize";
const Container = styled.div``;


const ProfileConfigBtn = styled.div`

  margin-right: 5px;
  backgroundColor: #FFF5F0;
  color: #D35400;
  border: 1px solid #F5CBA7;
  border-radius: 8px;
  padding: 8px 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(12)}px !important;


`


const DeleteConfigBtn = styled.div`
  color: white;
  border: none;
  background-color: #FF7E19;
  padding: 8px 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 8px;

`

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
`
const HeaderLayer = styled.div`
    padding-left: 15px;
    display: flex;
    color: rgb(19, 19, 19);
    font-size: ${() => getFontSize(18)}px;
    justify-content: space-between;
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


const MobileConfessheader = ({callback, image,name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);

  const [successpopup, setSuccesspopup] = useState(false);
  const [deletepopup, setDeletepopup] = useState(false);
  const [refresh, setRefresh] = useState(-1);

  const location = useLocation();


  const _handlelogout = async() =>{

    setSuccesspopup(true);

    await localforage.removeItem('userconfig');
    setRefresh((refresh) => refresh+1);

  }

  const _handleDelete = async () => {
    

    setDeletepopup(true);

  
  }

  const successcallback = () =>{
    setSuccesspopup(false);
    setRefresh((refresh) => refresh+1);

  }

  const deletecallback = async(data) => {

    if (data == 'ok') {
      const USERS_ID = user.USERS_ID;
      await DeleteUSERByUSERS_ID({ USERS_ID });

      await localforage.removeItem('userconfig');
      setRefresh((refresh) => refresh + 1);
      navigation("/Mobile");

    }
    setDeletepopup(false);
    setRefresh((refresh) => refresh + 1);

  }


  useEffect(()=>{
    setSuccesspopup(successpopup);
    setDeletepopup(deletepopup);
  },[refresh])

  const _handleprev = () =>{
    navigation('/mobilemain');
  }

  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });
  return (
    <HeaderWrapper>
      <HeaderLayer>
        <HeaderText>
          {name}
        </HeaderText>

      </HeaderLayer>
      
    </HeaderWrapper>
  );
};

export default MobileConfessheader;
