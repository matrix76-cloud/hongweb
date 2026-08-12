

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileOnlyPrevheader from "../Header/MobileOnlyPrevheader";
import MobilePrevheader from "../Header/MobilePrevheader";



const MobileOnlyPrevLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileOnlyPrevheader  iconname ={props.iconname} name={props.name}/>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobileOnlyPrevLayout;
