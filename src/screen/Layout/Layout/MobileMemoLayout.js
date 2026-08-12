

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobilePrevheader from "../Header/MobilePrevheader";
import MobileChatheader from "../Header/MobileChatheader";
import MobileOnlyPrevheader from "../Header/MobileOnlyPrevheader";
import MobileMemoheader from "../Header/MobileMemoheader";



const MobileMemoLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileMemoheader  iconname ={props.iconname} name={props.name}/>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobileMemoLayout;
