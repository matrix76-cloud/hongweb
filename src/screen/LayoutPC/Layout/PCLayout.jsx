

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
        props.main == true ? (    <PCMainheader  name={props.name} registbtn={props.registbtn} registmapbtn={props.registmapbtn}
           height={props.height}/> ):( <PCSubheader name={props.name} registmapbtn={props.registmapbtn}/> )
      }
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default PCLayout;
