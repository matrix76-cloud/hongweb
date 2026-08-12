

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobilePrevheader from "../Header/MobilePrevheader";
import MobileSearchheader from "../Header/MobileSearchheader";
import MobileAiCategoryheader from "../Header/MobileAiCategoryheader";



const MobileAiCategoryLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileAiCategoryheader  iconname ={props.iconname} name={props.name} />
      <main>
        {props.children}
      </main>

    </div>
  );
};

export default MobileAiCategoryLayout;
