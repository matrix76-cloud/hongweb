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
   
`
const ImageLayout2 = styled.div`
    background: #fff;
    height: 50px;
    border-radius: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items:center;

`





const ProfileImage =({containerStyle,imagetype, source,read}) =>  {

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
      <img src={source} style={{width:70, height:65}}/>
      </ImageLayout>
    </Container>
  );

}

export default ProfileImage;

