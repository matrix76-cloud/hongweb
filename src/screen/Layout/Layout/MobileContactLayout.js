

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileCommunityheader from "../Header/MobileCommunityheader";
import MobileContactheader from "../Header/MobileContactheader";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;


`
const MobileContactLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();


  return (
    <Container> 
      <MobileContactheader  name ={props.name} image={props.image}/>
      <main>
        {props.children}
      </main>
    </Container>
  );
};

export default MobileContactLayout;
