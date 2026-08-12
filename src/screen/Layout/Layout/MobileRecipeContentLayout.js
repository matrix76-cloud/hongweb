

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileCommunityContentheader from "../Header/MobileCommunityContentheader";
import MobileCommunityheader from "../Header/MobileCommunityheader";
import MobileRecipeContentheader from "../Header/MobileRecipeContentheader";


const MobileRecipeContentLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <div style={{ovderflow:"hidden"}}> 
      <MobileRecipeContentheader  name ={props.name} image={props.image}/>
      <main>
        {props.children}
      </main>

    </div>
  );
};

export default MobileRecipeContentLayout;
