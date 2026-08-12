

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import PCChatheader from "../Header/PCChatheader";
import PCMainheader from "../Header/PCMainheader";
import PCSubheader from "../Header/PCSubheader";



const PCChatLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <PCChatheader/>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default PCChatLayout;
