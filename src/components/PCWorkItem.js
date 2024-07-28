import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";



const Container = styled.div`
  background: #fff;
  height: 250px;
  width: 18%;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 4px 0 rgba(72, 71, 66, .21);

`
const style = {
  display: "flex"
};

const PCWorkItem =({containerStyle}) =>  {

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
   
    </Container>
  );

}

export default PCWorkItem;

