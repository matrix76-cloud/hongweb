

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileLifeheader from "../Header/MobileLifeheader";
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
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`; 

const MobileLifeLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div style={{ height: "100%", overflow: "visible" }}> 
      <MobileLifeheader name={props.name} />
      
      <HeaderWrapper>
        <CommonHeader
          title="라이프"
          pattern="chat"
          titleAlign="left"
        />
      </HeaderWrapper>
      
      <main>
        {props.children}
      </main>
      <MobileFooter type={props.type}/>
    </div>
  );
};

export default MobileLifeLayout;
