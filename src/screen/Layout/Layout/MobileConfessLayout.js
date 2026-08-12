

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileConfigheader from "../Header/MobileConfigheader";
import MobileWorkheader from "../Header/MobileWorkheader";
import MobileConfessheader from "../Header/MobileConfessheader";


const MobileConfessLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div style={{overflow:"hidden"}}> 
      <MobileConfessheader  name ={props.name}/>
      <main>
        {props.children}
      </main>
      <MobileFooter type={props.type}/>
    </div>
  );
};

export default MobileConfessLayout;
