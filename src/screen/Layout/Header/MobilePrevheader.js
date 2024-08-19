import React, { Fragment, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { GrPrevious } from "react-icons/gr";

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



const MobilePrevheader = ({callback, registbtn, name}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);


  const _handleprev = () =>{
    navigation(-1);
  }




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
        alignItems: "center",
        borderBottom: "1px solid #ededed"
  
      }}
    >

      <div style={{paddingLeft:15, width:'30%', display:"flex"}}>
        <GrPrevious onClick={_handleprev} size={22} />
      </div>




    
    </Container>
  );
};

export default MobilePrevheader;
