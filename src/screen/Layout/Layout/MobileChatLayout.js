

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileChatheader from "../Header/MobileChatheader";
import MobileConfigheader from "../Header/MobileConfigheader";
import MobileWorkheader from "../Header/MobileWorkheader";
import styled from "styled-components";
import CommonHeader from "../../../components/CommonHeader";
import { FiVideo } from 'react-icons/fi'; // 영상통화 아이콘 사용
import CommonHeaderChat from "../../../components/CommonHeaderChat";


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

const MobileChatLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div style={{ height: "100%", overflow: "visible" }}> 
      <HeaderWrapper>
        <CommonHeaderChat
          onBackPressed={() => {
            let phone = user.USERINFO.phone;
            navigate("/mobilemain", { state: { phone } });
          }}
        />
      </HeaderWrapper>
      <main>
        {props.children}
      </main>
      <MobileFooter type={props.type}/>
    </div>
  );
};

export default MobileChatLayout;
