

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileCommunityheader from "../Header/MobileCommunityheader";


const MobileCommunityLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div> 
      <MobileCommunityheader  name ={props.name} image={props.image}/>
      <main>
        {props.children}
      </main>
    </div>
  );
};

export default MobileCommunityLayout;
