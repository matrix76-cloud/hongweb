

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileMapheader from "../Header/MobileMapheader";
import styled from "styled-components";
import CommonHeader from "../../../components/CommonHeader";
import CommonHeaderWork2 from "../../../components/CommonHeaderWork2";
import MobileGpsPopup from "../../../modal/MobileGpsPopup/MobileGpsPopup";
import { MOBILEMAINMENU } from "../../../utility/screen";
import CommonHeaderResult from "../../../components/CommonHeaderResult";


const Container = styled.div`
  height: 100%;
  overflow: visible;
  background: #fff;
`

const MobileResultLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [gpspopup, setGpspopup] = useState(false);
  const gpspopupcallback = () => setGpspopup(false);

  return (
    <Container>
      <CommonHeaderResult
        onLocationClick={() => setGpspopup(true)}
        onBackPressed={() => {
          let phone = user.USERINFO.phone;
          navigate("/mobilemain", { state: { phone } });
        }}
        NAME={props.NAME}
      />
      <main>
        {props.children}
      </main>
      <MobileFooter type={MOBILEMAINMENU.HOMEMENU}/>
    </Container>
  );
};

export default MobileResultLayout;
