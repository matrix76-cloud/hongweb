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
  height: 50px;
  font-family: 'Pretendard-Regular';
  /* 섹션 제목이 작아 보인다 — 16 에서 19 로 (형 리뷰 2026-08-15 "여기 글씨가 좀 작은듯") */
  font-size: 19px;
  background : var(--bg-soft);
  color :var(--text);



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
        {/* 고정폭 140px 은 긴 제목("무슨 일을 맡기실까요?")이 좁아 보이던 원인 — 자연폭으로 */}
        <div style={{fontFamily: 'Pretendard-Bold', whiteSpace:'nowrap', paddingLeft:15}}>{label}</div>
        <SubLabel>{sublabel}</SubLabel>
   
    </Container>
  );

}

export default Label;

