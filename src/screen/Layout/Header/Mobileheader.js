import React, { Fragment, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";
import { GoPlus } from "react-icons/go";
import { MOBILEMAINMENU } from "../../../utility/screen";

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
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);

  useEffect(() => {

    setReigstbutton(registbutton);
  }, [refresh]);




/**
 * 둥록이 헤더쪽에 있기 때문에 일감 등록과 공간 등록을 구분할수 있어여 한다
 * 파라미터에서 들어온 name 을 가지고 등록유형을 구분하자
 */
  const _handleRegister = () =>{
    if(name == MOBILEMAINMENU.HOMEMENU){
      navigation("/Mobileworkregister");
    }else if(name == MOBILEMAINMENU.ROOMMENU){
      navigation("/Mobileroomregister");
    }
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
        height: "60px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
  
      }}
    >

      <div style={{paddingLeft:15, width:'30%', display:"flex", paddingBottom:10}}>
        <img src={imageDB.pclogo} width={114} height={30} />
      </div>



      <div style={{paddingLeft:15, width:'50%', display:"flex",color:"#636363", fontSize:"14px",fontWeight:500}}>
      남양주시 다산동
      </div>

      <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:10, width:'20%'}}>


{/* 
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} >
          <Image source={imageDB.bell} containerStyle={{width:20}} />
          <Badge badgeContent={0} color="warning"  style={{paddingBottom:15}}></Badge>
        </div> */}
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} onClick={()=>{}}>
        <IoChatbubbleEllipsesOutline size={22} />
          <Badge badgeContent={1} color="warning" style={{paddingBottom:15}} className="alertblink" ></Badge>
        </div>
      </div>

      {/* {registbutton == true && (registbtn == true ) && (
          <div className="RegisterMobileShowButton" onClick={_handleRegister}>
            <GoPlus/> 등록</div>
        )} */}

    
    </Container>
  );
};

export default Mobileheader;
