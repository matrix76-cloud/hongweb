

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileCommunityContentheader from "../Header/MobileCommunityContentheader";
import MobileCommunityheader from "../Header/MobileCommunityheader";


export const MobileCommunityContentLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div style={{ovderflow:"hidden"}}> 
      <MobileCommunityContentheader  name ={props.name} image={props.image}/>
      <main>
        {props.children}
      </main>
      <MobileFooter type={props.type}/>
    </div>
  );
};

export const MobileCommunityContentLayout2 = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div style={{ ovderflow: "hidden" }}>
      <main>
        {props.children}
      </main>
    </div>
  );
};


