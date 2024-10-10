

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileMapheader from "../Header/MobileMapheader";



const MobileMapLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileMapheader name={props.name} registbtn={props.registbtn}/>
      <main>
        {props.children}
      </main>

    </div>
  );
};

export default MobileMapLayout;
