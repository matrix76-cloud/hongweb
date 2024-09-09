import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import ProfileImage from "./ProfileImage";
import { FaEllipsis } from "react-icons/fa6";

import "./Chatgate.css";



const Container = styled.div`
  height: 80px;

  border-bottom: 1px solid #ededed;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size:14px;
`
const style = {
  display: "flex"
};

const Name  = styled.div`
  height: 20px;
  font-size: 16px;
  letter-spacing: -0.02em;
  white-space: nowrap;

`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width :260px;
  color :#636363;
  font-size:14px;

`

const Info = styled.div`
  font-size:12px;
  color :#A3A3A3;
  margin-left:10px;
`

const AddButton = styled.div`
  background: #fff;
  border: 1px solid #eded;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  position:absolute;
  left:230px;


`




const Chatgate =({containerStyle,imagetype,img,name, info, content,read, check}) =>  {
console.log("TCL: Chatgate -> img", img)

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
  const [showcontrol, setShowcontrol] = useState(false);



  const _handleShowcontrol = ()=>{
    setShowcontrol(true);
    setRefresh((refresh) => refresh +1);
  }

  const _handleHidecontrol = ()=>{
    setShowcontrol(false);
    setRefresh((refresh) => refresh +1);
  }

  useEffect(()=>{
    setShowcontrol(showcontrol);
  }, [refresh]);

  const _handleChat = () =>{
    navigate("/Mobilecontent");
  }

 
  return (

    <Container style={containerStyle} className={'hoverChat'} onClick={_handleChat} >
      <ProfileImage imagetype={imagetype} source={img} read={read}/>
      <Column style={{paddingLeft:10, justifyContent:"space-evenly", height:60}}>
        <FlexstartRow style={{width:"100%"}}>
          <Name>{name}</Name>
          <Info>{info}</Info>
        </FlexstartRow>
        <Content>
          <div style={{paddingRight:10}}>
          {content.slice(0, 28 )}
          {content.length > 28 ? "..." : null}
          </div>
        </Content>

    
 
      </Column>
    
      
    </Container>
  );

}

export default Chatgate;

