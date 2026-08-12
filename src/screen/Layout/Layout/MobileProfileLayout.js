

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobilePrevheader from "../Header/MobilePrevheader";
import MobileProfileheader from "../Header/MobileProfileheader";
import MobileSearchheader from "../Header/MobileSearchheader";



const MobileProfileLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileProfileheader  iconname ={props.iconname}/>
      <main>
        {props.children}
      </main>

    </div>
  );
};

export default MobileProfileLayout;
