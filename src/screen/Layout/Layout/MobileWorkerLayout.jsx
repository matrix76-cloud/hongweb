

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileWorkheader from "../Header/MobileWorkheader";
import MobileWorkerheader from "../Header/MobileWorkerheader";
import styled from "styled-components";
import CommonHeader from "../../../components/CommonHeader";


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  flex-direction:row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
  width :100%;
`;


const MobileWorkerLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();



  return (
    <div>   
      <HeaderWrapper>   
        <CommonHeader
          title= {props.name}
          pattern="default"
          pageId="registerWork"
          titleAlign="left"
        />     
      </HeaderWrapper>
      
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobileWorkerLayout;
