import React, { Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../../context/User";
import { useDispatch, useSelector } from "react-redux";
import localforage from 'localforage';
import "../../css/common.css"
import { GrPrevious } from "react-icons/gr";
import { imageDB } from "../../../utility/imageData";
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../../utility/fontsize";

const Container = styled.div`
`;


const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  /* ✅ iOS safe-area + 안드로이드 살짝 여유 */
  padding-top: calc(env(safe-area-inset-top, 0px) + 8px);

  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 8px;

  min-height: 52px;

  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  z-index: 999;

  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  /* ✅ 상태바(safe-area) 영역만 어둡게 깔아서 아이콘 가독성 확보 */
  &::before{
    content:"";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: env(safe-area-inset-top, 0px);
    background: rgba(0,0,0,0.72);
    z-index: 998;
    pointer-events: none;
  }
`;
const HeaderText = styled.div`
  font-size: ${() => `${getFontSize(18)}px`} !important;
  font-family:Pretendard-SemiBold;
  color: #333;
  flex: 1;
  lineHeight: 1.4;
  padding-left: 15px;
  `;



const MobileConfigContentheader = ({callback, registbtn, name}) => {

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
    <HeaderWrapper>

        <div style={{ display: "flex", fontSize:getFontSize(20), color: "#131313", alignItems: "center", paddingLeft: 10 }}>
         <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />  
        <HeaderText>
            {name}
        </HeaderText>
        </div>
    
    </HeaderWrapper>
  );
};

export default MobileConfigContentheader;
