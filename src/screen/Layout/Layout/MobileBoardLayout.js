

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileConfigheader from "../Header/MobileConfigheader";
import MobileWorkheader from "../Header/MobileWorkheader";
import styled from "styled-components";
import MobileLogoutSuccessPopup from "../../../modal/MobileSuccessPopup/MobileLogoutSuccessPopup";
import localforage from 'localforage';
import CommonHeader from "../../../components/CommonHeader";
import CommonHeaderProfile from "../../../components/CommonHeaderProfile";

const MobileBoardLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  const [successpopup, setSuccesspopup] = useState(false);

  const handleLogout = async () => {
    setSuccesspopup(true);
    await localforage.removeItem('userconfig');
  }
  const successcallback = () => {
    setSuccesspopup(false);
  }

  return (
    <div style={{ height: "100%", overflow: "visible" }}>
      <CommonHeaderProfile
        title="게시판"
        onBackPressed={() => {
          let phone = user.USERINFO.phone;
          navigation("/mobilemain", { state: { phone } });
        }}
      />
      <main>
        {props.children}
      </main>
      {successpopup == true && <MobileLogoutSuccessPopup callback={successcallback} content={'성공적으로 로그 아웃 되었습니다'} />}
      <MobileFooter type={props.type}/>
    </div>
  );
};

export default MobileBoardLayout;
