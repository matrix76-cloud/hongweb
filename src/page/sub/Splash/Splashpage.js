import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Splashcontainer from "../../../container/sub/Splash/Splashcontainer";
import { UserContext } from "../../../context/User";



const Container = styled.div`

`
const style = {
  display: "flex"
};

const Splashpage =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])

 
  return (

    <Container style={containerStyle}>
        <Splashcontainer/>
    </Container>
  );

}

export default Splashpage;

