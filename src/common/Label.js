import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";



const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-left: 10px;
  height: 50px;
  font-family: 'Pretendard-SemiBold';
  font-size: 18px;
`

const SubLabel= styled.div`
  font-size: 14px;
  font-family: Pretendard;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;


`
const style = {
  display: "flex"
};

const Label =({containerStyle, label, sublabel}) =>  {

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
        <div>{label}</div>
        <SubLabel>{sublabel}</SubLabel>
   
    </Container>
  );

}

export default Label;

