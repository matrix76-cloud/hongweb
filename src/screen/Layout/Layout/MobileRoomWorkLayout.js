

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileWorkheader from "../Header/MobileWorkheader";


const MobileRoomWorkLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileWorkheader  name ={props.name} image={props.image}/>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobileRoomWorkLayout;
