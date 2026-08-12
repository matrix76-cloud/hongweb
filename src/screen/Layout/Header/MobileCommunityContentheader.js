import React, { Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";
import { GoPlus } from "react-icons/go";
import { MOBILEMAINMENU, PCMAINMENU } from "../../../utility/screen";
import { HeaderAddress, KeywordAddress, SubKeywordAddress } from "../../../utility/region";
import { FaChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useSleep } from "../../../utility/common";
import localforage from 'localforage';
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import MobileGpsPopup from "../../../modal/MobileGpsPopup/MobileGpsPopup";
import { ReadChat } from "../../../service/ChatService";

import "../../css/common.css"
import { BetweenRow, Row } from "../../../common/Row";
import { LuUserCircle } from "react-icons/lu";
import { GrPrevious } from "react-icons/gr";
import { LIFEMENU } from "../../../utility/life";
import IconButton from "../../../common/IconButton";
import { FiPlus } from "react-icons/fi";
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
const AdddButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color : #ff7e19;
  display:flex;
`
const AddButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(17)}px;
  color : #F75100;
  display : flex;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }

`


const MobileCommunityContentheader = ({callback, registbtn, name}) => {

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

const _handleprev = () =>{
  navigation(-1);
}

const _handleCategory = () =>{
  navigation("/Mobileaicategorycreate");
}
const _handleRecommend = () =>{
}
const _handleGameRank = () =>{
  navigation("/Mobilecommunitycontent" ,{state :{name :LIFEMENU.GAMERANK}});
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
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontFamily :"Pretendard-SemiBold",
        flexShrink: 0,
        borderBottom : "1px solid #ededed"
  
      }}
    >

      <BetweenRow style={{width:"100%"}}>
        <div onClick={_handleprev}  style={{ display:"flex", fontSize:getFontSize(20), color:"#131313", alignItems:"center", paddingLeft:15, fontFamily:"Pretendard-SemiBold"}}>
        <GrPrevious  size={22} />
          <div style={{ paddingLeft: 15 }}>
            {name.slice(0, 17)}
            {name.length > 17 ? "..." : null}
          </div>
      </div>
      <div style={{marginRight:10}}>
        {
          // eslint-disable-next-line eqeqeq
          name ==  LIFEMENU.AI && <IconButton
          icon={'teacher'}
          text={'지식창고 가기'} width={'100'} containerStyle={{
          fontSize: '14px',
          fontFamily:"Pretendard",
          color :"#fff",
          background: '#ff7e19',
          padding: '5px',
          borderRadius:'5px',
          boxShadow:"none"
        }}
        onPress={_handleCategory} bgcolor={'#00000057'} color={'#fff'} />
        }


        {
    
          name ==  LIFEMENU.GAME && <BetweenRow style={{width:"100%"}}>

    
          <IconButton
          icon={'ranking'}
          text={'도전 알바 주간순위 보기'} width={'100'} containerStyle={{
          fontSize: '14px',
          fontFamily:"Pretendard",
          color :"#fff",
          background: '#ff7e19',
          padding: '5px',
          borderRadius:'5px',
          boxShadow:"none"
        }}
        onPress={_handleGameRank} bgcolor={'#00000057'} color={'#fff'} />


          
          </BetweenRow>
        }
  
      
      </div>
      </BetweenRow>  
    </Container>
  );
};

export default MobileCommunityContentheader;
