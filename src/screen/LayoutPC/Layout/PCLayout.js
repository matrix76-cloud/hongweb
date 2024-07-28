

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import PCMainheader from "../Header/PCMainheader";
import PCSubheader from "../Header/PCSubheader";



const PCLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();

  return (
    <div> 
      {
        props.main == true ? (    <PCMainheader/> ):( <PCSubheader name={props.name}/> )
      }
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default PCLayout;
