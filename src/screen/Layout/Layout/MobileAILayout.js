

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileMapheader from "../Header/MobileMapheader";
import styled from "styled-components";
import CommonHeader from "../../../components/CommonHeader";


const Container = styled.div`
  height: 100vh;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;

`
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

const MobileAILayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <Container> 
      <HeaderWrapper>
        <CommonHeader
          title="지원자의 지원서를 바탕으로 한 AI 이미지"
          pattern="default"
          titleAlign="left"
          pageId="Mobile_AI"
        />
      </HeaderWrapper>
      <main>
        {props.children}
      </main>
      <MobileFooter type={props.type}/>

    </Container>
  );
};

export default MobileAILayout;
