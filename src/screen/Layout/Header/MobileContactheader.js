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
import { HeaderAddress, KeywordAddress, SubKeywordAddress } from "../../../utility/region";
import { FaChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useSleep } from "../../../utility/common";
import localforage from 'localforage';
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import MobileGpsPopup from "../../../modal/MobileGpsPopup/MobileGpsPopup";
import { ReadChat } from "../../../service/ChatService";

import "../../css/common.css"
import { Row } from "../../../common/Row";
import { LuUserCircle } from "react-icons/lu";
import { GoBell } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import MobileHeaderLayer from "../../../components/MobileHeaderLayer";
import { useMediaQuery } from "react-responsive";
const Container = styled.div`


`;





const MobileContactheader = ({callback, registbtn, name}) => {

  const {value} = useSelector((state)=> state.menu);
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [address_name, setAddress_name] = useState(user.address_name);

  const [gpspopup, setGpspopup] = useState(false);
  const [unreadcount, setUnreadcount] = useState(0);

  useEffect(() => {
    setAddress_name(address_name);
    setReigstbutton(registbutton);
    setGpspopup(gpspopup);
    setUnreadcount(unreadcount);
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

    setAddress_name(user.address_name);
    setRefresh((refresh) => refresh +1);
  },[useDispatch])




  const _handlemapreconfig = () =>{
    navigation("/Mobilemapreconfig",{state :{TYPE : "ADDRREGIST"}});

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

const _handleprev = () =>{
  navigation(-1);
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
        <Container onClick={_handleprev} >
            <div style={{ display: "flex", fontSize: () => getFontSize(20), color: "#131313", alignItems: "center", paddingLeft: 15 }}>
            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
                <div style={{ paddingLeft: 5 }}>
                    
                    {name.slice(0, 17)}
                    {name > 17 ? "..." : null}

                
                </div>
            </div>

        </Container>
  );
};

export default MobileContactheader;
