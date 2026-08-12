

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileHongheader from "../Header/MobileHongheader";
import MobilePrevheader from "../Header/MobilePrevheader";



const MobileHongLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();

  return (
    <div style={{ height: "100%", overflow: "visible" }}> 
      <MobileHongheader  iconname ={props.iconname} name={props.name}/>
      <main>
        {props.children}
      </main>
      
    </div>
  );
};

export default MobileHongLayout;
