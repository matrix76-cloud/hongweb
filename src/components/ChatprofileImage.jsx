import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartRow } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { CHATIMAGETYPE } from "../utility/screen";
import "./ProfileImage.css"



const Container = styled.div`

`
const style = {
  display: "flex"
};

const ImageLayout = styled.div`
    background: #fff;
    height: 50px;
    border-radius: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items:center;
    position:absolute;
   
`
const Tag = styled.div`
  position: relative;
  height: 30px;
  border: 1px solid #ededed;
  width: 30px;
  top: 25px;
  background: ${({OWNER}) => OWNER == true ? ('#FF7125') :('#25a3ff')};
  left: 20px;
  color : #fff;
  font-size:12px;
  display: flex;
  justify-content:center;
  align-items:center;
  border-radius : 5px;

`





const ChatprofileImage =({containerStyle, source, OWNER}) =>  {

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


 
  return (

    <Container style={containerStyle}>
      <ImageLayout>
      <img src={source} style={{width:75, height:75}}/>
      </ImageLayout>
      <Tag OWNER={OWNER}>
        {OWNER == true ? (<span>의뢰</span>) :(<span>지원</span>)}
      </Tag>
    </Container>
  );

}

export default ChatprofileImage;

