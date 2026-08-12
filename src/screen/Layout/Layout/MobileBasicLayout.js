

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileHongheader from "../Header/MobileHongheader";
import MobilePrevheader from "../Header/MobilePrevheader";
import styled from "styled-components";


const HEADER_HEIGHT = 56; // 헤더 높이 조정 시 여기만 수정
const Main = styled.main`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
`;


const MobileBasicLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();

  return (
    <div style={{ height: "100%", overflow: "visible" }}> 
      <MobileHongheader  iconname ={props.iconname} name={props.name}/>
      <Main>
        {props.children}
      </Main>
      
    </div>
  );
};

export default MobileBasicLayout;
