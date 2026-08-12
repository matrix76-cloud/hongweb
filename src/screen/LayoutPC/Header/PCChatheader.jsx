import React, { Fragment, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge, setRef } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";
import { WORKNAME } from "../../../utility/work";
import { WORK } from "../../../utility/db";
import { colors } from "../../../theme/theme";
import { BetweenRow, Row } from "../../../common/Row";
import Categorymenu from "../../../common/Categorymenu";
import { LoadingType, PCMAINMENU } from "../../../utility/screen";

import './PCMainheader.css';
import { model } from "../../../api/config";
import PcAipopup from "../../../modal/PcAiPopup/PcAiPopup";
import Loading from "../../../components/Loading";
import { useDispatch } from "react-redux";
import { ALLROOM, ALLWORK } from "../../../store/menu/MenuSlice";


const PCHeader = styled.div`
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 2;
  border :1px solid #ededed;
  height:80px;

`;


const PCChatheader = ({callback, name}) => {
  const navigation = useNavigate();
  const reduxdispatch = useDispatch();

  const {user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);



  
  useEffect(() => {
  
  }, [refresh]);

  const _handleMain=()=>{
    navigation("/PCmain");
  }

  return (
    <PCHeader>
      <BetweenRow width={'80%'} style={{margin:'20px auto'}}>
      <Row onClick={_handleMain}>
           <img src={imageDB.pclogo} width={118} height={34} />
      </Row>
      <Row>
            <div><img src={imageDB.person} style={{width:50}}/></div>
            <div style={{fontFamily:"Pretendard-SemiBold"}}>이행렬</div>
          
      </Row>
      </BetweenRow>

    </PCHeader>
  );
};

export default PCChatheader;
