

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import PCGateheader from "../Header/PCGateheader";




const PCGateLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <PCGateheader  name={props.name} ></PCGateheader>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default PCGateLayout;
