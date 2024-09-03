

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";

import MobilePrevheader2 from "../Header/MobilePrevheader2";



const MobilePrevLayout2 = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobilePrevheader2  name ={props.name}/>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobilePrevLayout2;
