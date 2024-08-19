

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobilePrevheader from "../Header/MobilePrevheader";



const MobilePrevLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobilePrevheader />
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobilePrevLayout;
