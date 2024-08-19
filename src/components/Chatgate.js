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
  font-family:'Pretendard-SemiBold';
  font-size: 14px;
  letter-spacing: -0.02em;
  white-space: nowrap;

`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width :260px;
  color :#4d5159;
  font-size:14px;

`

const Info = styled.div`
  font-size:12px;
  color :#868b94;
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

 
  return (

    <Container style={containerStyle} className={'hoverChat'} >
      <ProfileImage imagetype={imagetype} source={img} read={read}/>
      <Column style={{paddingLeft:10, position:"relative"}}>
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

        {check == true &&  <AddButton onClick={_handleShowcontrol}>       
        <div style={{position:"relative"}}><FaEllipsis /></div></AddButton>} 
       
        {showcontrol && (
        <div
          style={{
            position: 'absolute',
            top: '100%', // 위치를 조정하여 버튼 위에 툴팁이 나타나게 합니다.
            left: '50%',
            transform: 'translateX(-20%)',
            marginBottom: '10px',
            padding: '5px 10px',
            border: '1px solid #ededed',
            background:'white',
            color: 'black',
            borderRadius: '4px',
            height:150,
            whiteSpace: 'nowrap',
            height: "150px",
            zIndex: 2,
            width:"150px"
          }}
        >
          <div>채팅 상단의 위치</div>
          <div>알림음 끄기</div>
          <div>고객센타 신고</div>
          <div>나가기</div>
        </div>
        )}
      </Column>
    
      
    </Container>
  );

}

export default Chatgate;

