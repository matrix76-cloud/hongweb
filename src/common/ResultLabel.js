import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";



const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  font-weight:700;
  margin-left:15px;
  margin-bottom:10px;
  font-family : 'Pretendard-SemiBold';

`

const SubLabel= styled.div`
  color:#F75100;
  margin-left:7px


`
const style = {
  display: "flex"
};

const ResultLabel =({containerStyle, label, result, unit}) =>  {

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
        <SubLabel>{result}</SubLabel><span>{unit}</span>
    </Container>
  );

}

export default ResultLabel;

