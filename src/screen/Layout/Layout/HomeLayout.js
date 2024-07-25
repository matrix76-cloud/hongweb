

import React, { useContext } from "react";
import Homeheader from "../Header/Homeheader";
import HomeFooter from "../Footer/HomeFooter";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";



const HomeLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();

  return (
    <div> 
        {
          (props.header == true) &&
            <Homeheader name={props.name}/> 
        }
        <main>
          {props.children}
        </main>

        {
          (props.bottom == true) &&
            <HomeFooter  type={props.type} />
        }

   
    </div>
  );
};

export default HomeLayout;
