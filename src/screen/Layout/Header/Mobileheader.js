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

  useEffect(() => {
    setAddress_name(address_name);
    setReigstbutton(registbutton);
  }, [refresh]);


  useLayoutEffect(()=>{
    console.log("TCL: Mobileheader -> [value]", [value],user)

    localforage.getItem('address_name')
    .then(function(value) {
      console.log("TCL: listener -> GetItem address_name", value)
      setAddress_name(value);
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

  const _handleChat = () =>{
    navigation("/Mobilechat");   
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

      {/* <div style={{paddingLeft:15, width:'30%', display:"flex", paddingBottom:10}}>
        <img src={imageDB.pclogo} width={114} height={30} />
      </div> */}



      <div style={{paddingLeft:15, width:'80%', display:"flex",color:"#131313", fontSize:"16px",
      display:"flex", justifyContent:"flex-start", alignItems:"center",
      fontWeight:400}}>
        <img src={imageDB.mappin} style={{width:20, height:20}} onClick={_handlemapreconfig}/>
        <div style={{marginLeft:10, marginRight:10}}>{KeywordAddress(address_name)}</div>
        <FaChevronRight onClick={_handlemapreconfig}/>
      </div>

      <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:20, width:'10%'}}>


        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} onClick={_handleChat}>
        <IoChatbubbleEllipsesOutline size={22} />
          <Badge badgeContent={4} color="warning" style={{paddingBottom:15}} className="alertblink" ></Badge>
        </div>
      </div>


    
    </Container>
  );
};

export default Mobileheader;
