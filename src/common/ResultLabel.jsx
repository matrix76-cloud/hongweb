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
  /* 목록 컨테이너가 이미 좌측 15px 를 들여쓴다 — 여기서 또 주면 이 줄만 안으로 밀린다.
     화면의 좌측 라인을 하나로 맞춘다 (형 지적 2026-08-19) */
  margin-left:0;
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

