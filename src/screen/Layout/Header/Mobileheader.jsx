import React, { Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";
import { GoPlus } from "react-icons/go";
import { MOBILEMAINMENU } from "../../../utility/screen";
import { HeaderAddress, KeywordAddress } from "../../../utility/region";
import { FaChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useSleep } from "../../../utility/common";
import localforage from 'localforage';
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import MobileGpsPopup from "../../../modal/MobileGpsPopup/MobileGpsPopup";
const Container = styled.div``;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'SF-Pro-Text-Semibold';
    font-weight:600;
    padding-top: 5px;
    font-size: 20px;
    padding-left: 10px;
    color :#000;

`



const Mobileheader = ({callback, registbtn, name}) => {

  const {value} = useSelector((state)=> state.menu);
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [address_name, setAddress_name] = useState(user.address_name);

  const [gpspopup, setGpspopup] = useState(false);

  useEffect(() => {
    setAddress_name(address_name);
    setReigstbutton(registbutton);
    setGpspopup(gpspopup);
  }, [refresh]);


  useLayoutEffect(()=>{
    localforage.getItem('userconfig')
    .then(function(value) {
      console.log("TCL: listener -> GetItem value", value.address_name)
      setAddress_name(value.address_name);
    })
    .catch(function(err) {

    });

  
    setRefresh((refresh) => refresh +1);
  },[value])

  useLayoutEffect(()=>{
    console.log("TCL: Mobileheader -> [value]", [value],user)
    setAddress_name(user.address_name);
    setRefresh((refresh) => refresh +1);
  },[useDispatch])




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

  const _handleChat = () =>{
    navigation("/Mobilechat");   
  }

  const _handleAI = async() =>{
    navigation("/Mobilesearch" ,{state :{search :""}});
    setRefresh((refresh) => refresh +1);
  }


/**
 * 마우스를 움직일때 사라지고 없어지고 한다
 * ! id 값 : oneheader, twohenader
 */
useEffect(() => {
  const handleShowButton = () => {

    if (window.scrollY > 10) {
      setReigstbutton(true);
    } else {
      setReigstbutton(false);
    }
    setRefresh((refresh)=> refresh +1);
  };

  window.addEventListener("scroll", handleShowButton);

  return () => {
    window.removeEventListener("scroll", handleShowButton);
  };
}, []);

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
        fontFamily :"Pretendard-SemiBold"
  
      }}
    >


     

        <div style={{marginLeft:15, display:"flex",color:"#131313", fontSize:"16px",
        display:"flex", justifyContent:"flex-start", alignItems:"center",fontFamily:"Pretendard-SemiBold",
        fontWeight:400}}>
          <img src={imageDB.honglogo} style={{width:60, height:23}}/>
          <img src={imageDB.mappin} style={{width:20, height:20, marginLeft:5}} onClick={_handlemapgps}/>
          <div style={{ marginRight:10}}>{KeywordAddress(address_name)}</div>
          <FaChevronRight onClick={_handlemapreconfig}/>

          {
            gpspopup == true && <MobileGpsPopup callback={gpspopupcallback} />
          }

        </div>

     
        <div style={{display:"flex", flexDirection:"row", alignItems:"center",paddingRight:20}} >

        <img src={imageDB.search} width={24} onClick={_handleAI} style={{paddingRight:10}}/>
        <IoChatbubbleEllipsesOutline size={22}  onClick={_handleChat}/>
          <Badge badgeContent={4} color="warning" style={{paddingBottom:15}} className="alertblink" ></Badge>
        </div>
    


    
    </Container>
  );
};

export default Mobileheader;
