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
import { GrPrevious } from "react-icons/gr";
import { LIFEMENU } from "../../../utility/life";
import { Recipemenus } from "../../../store/jotai";
import { useAtom } from "jotai";
import MobileHeaderLayer from "../../../components/MobileHeaderLayer";
import { useMediaQuery } from "react-responsive";
import { getFontSize } from "../../../utility/fontsize";
const Container = styled.div`


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

`;

const ItemLayerBUnread = styled.div`
padding: 0px 5px;
background: #ff7e19;
color: #fff;
border-radius: 20px;

display: flex;
justify-content: center;
align-items: center;
margin-left: 5px;
font-size: ${() => getFontSize(12)}px;
animation: blink-effect 1s infinite;
`



const MobileRecipeContentheader = ({callback, registbtn, name}) => {
console.log("TCL: MobileRecipeContentheader -> name", name)

  const {value} = useSelector((state)=> state.menu);
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [address_name, setAddress_name] = useState(user.address_name);

  const [gpspopup, setGpspopup] = useState(false);
  const [unreadcount, setUnreadcount] = useState(0);

  const [recipemenus, setRecipemenus] = useAtom(Recipemenus);


  useEffect(() => {
    setAddress_name(address_name);
    setReigstbutton(registbutton);
    setGpspopup(gpspopup);
    setUnreadcount(unreadcount);
  }, [refresh]);


  // useEffect(()=>{

  //   async function FetchData(){

  //     const USERS_ID = user.USERS_ID;
  //     const items = await ReadChat({USERS_ID});
  
  //     let unreadcnt = 0;
  //     items.map((data)=>{
  //       unreadcnt += data.unReadcount;
  //     })
  //     setUnreadcount(unreadcnt);
  //     setRefresh((refresh) => refresh +1);
  //   }
  //   FetchData();
  // })

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

const _handleprev = () => {
  
  setRecipemenus([]);


  navigation(-1);
  // navigation("/Mobilecommunitycontent" ,{state :{name :LIFEMENU.BOARD}});
}
const _handleConfig=()=>{
  navigation("/Mobileconfig");
}

  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 450, maxWidth: 767 });
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
        justifyContent: "space-between",
        fontFamily :"Pretendard-SemiBold",
        flexShrink: 0,
        borderBottom : "1px solid #ededed"
  
      }}
    >


        <>
  
        <MobileHeaderLayer name = {name} callback={_handleprev}/>

        </> 
    


    
    </Container>
  );
};

export default MobileRecipeContentheader;
