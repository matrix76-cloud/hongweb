

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";



const MobileLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <Mobileheader  name={props.name} registbtn={props.registbtn}/>
      <main>
        {props.children}
      </main>
      <MobileFooter/>
    </div>
  );
};

export default MobileLayout;
