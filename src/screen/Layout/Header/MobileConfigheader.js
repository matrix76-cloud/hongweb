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

const Container = styled.div``;


const ProfileConfigBtn = styled.div`
  background: #f9f9f9;
  padding: 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: 12px;
  margin-right:20px;
`


const MobileConfigheader = ({callback, image,name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);

  const [successpopup, setSuccesspopup] = useState(false);
  const [refresh, setRefresh] = useState(-1);

  const location = useLocation();
  const _handleprev = () =>{
    if(location.pathname == CURRENTPAGE.MOBILESEARCH){
    
      navigation('/mobilemain');
    }else{
      navigation(-1);
    }
   
  }

  const _handlelogout = () =>{

    setSuccesspopup(true);

    let user ={};

    localforage.setItem('userconfig', user)
    .then(function(value) {
      console.log("TCL: userconfig save", value)
    
    })
    .catch(function(err) {
      console.error('TCL : userconfig 데이터 저장 실패:', err);
    });

    setRefresh((refresh) => refresh+1);


  }

  const successcallback = () =>{
    setSuccesspopup(false);
    setRefresh((refresh) => refresh+1);

  }

  useEffect(()=>{
    setSuccesspopup(successpopup);
  },[refresh])


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
        padding :"0px 10px",
        fontFamily:"Pretendard-SemiBold",
  
      }}
    >



        <>
        <div style={{ display:"flex", fontWeight:700, fontSize:'16px', color:"#131313", alignItems:"center"}}>
          <div style={{paddingLeft:10}}>{name}</div>
        </div>
        {successpopup == true &&<MobileLogoutSuccessPopup callback={successcallback} content={'성공적으로 로그 아웃 되었습니다'} />}
        <ProfileConfigBtn onClick={_handlelogout}>로그아웃</ProfileConfigBtn>
        </>  



    </Container>
  );
};

export default MobileConfigheader;
