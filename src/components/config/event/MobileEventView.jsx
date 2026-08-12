import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartRow } from "../../../common/Row";
import { UserContext } from "../../../context/User";
import { EventItems } from "../../../utility/screen";



const Container = styled.div`

`
const style = {
  display: "flex"
};

const EventBox = styled.div`

  margin-top:30px;
  width: 95%;
  margin-bottom: 30px;
  cursor: pointer;
  transition: .2s all;
  margin:0 auto;
  
`
const txtWrap = {
  backgroundColor:'#fafafa',
  padding: '18px 20px 24px',
  lineHeight:2
}

const tit ={
  fontSize: '18px',
  fontWeight: 700,
}

const day = {
  color: '#797979',
  fontSize: '16px'
}


const MobileEventView =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


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

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  

  const _handeleventdetail = (data) =>{
    console.log("TCL: _handeleventdetail -> data", data)
  
      
      navigate("/Mobileeventdetail",{state :{EVENTITEM :data}});
  

  }
  
 
  return (

    <Container style={containerStyle}>
        <FlexstartRow style={{flexWrap:"wrap", width:'100%'}}>
          {
            EventItems.map((data, index)=>(
              <EventBox onClick={()=>{_handeleventdetail(data)}}>
              <img src={data.img} style={{width:'100%', height:450}}/>
              <div style={txtWrap}>
              <div style={tit}>{data.desc}</div>
              <div style={day}>{data.date}</div>
              </div>
              </EventBox>
            ))
          }
        
       
        </FlexstartRow>
    </Container>
  );

}

export default MobileEventView;

