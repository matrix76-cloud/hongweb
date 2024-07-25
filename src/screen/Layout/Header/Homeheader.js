import React, { Fragment, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";

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



const Homeheader = ({callback, name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);

  useEffect(() => {

  }, [refresh]);




  return (
    <Container
      id="header"
      style={{
        zIndex: 999,
        position: "fixed",
        background: "#fff",
        width: "100%",
        height: "60px",
        top: -10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
  
      }}
    >

      <LogoText >{name}</LogoText>


      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginRight:10, width:50}}>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} >
          <Image source={imageDB.bell} containerStyle={{width:20}} />
          <Badge badgeContent={0} color="warning"  style={{paddingBottom:15}}></Badge>
        </div>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} onClick={()=>{}}>
        <IoChatbubbleEllipsesOutline size={22} />
          <Badge badgeContent={1} color="warning" style={{paddingBottom:15}} className="alertblink" ></Badge>
        </div>
      </div>
    
    </Container>
  );
};

export default Homeheader;
