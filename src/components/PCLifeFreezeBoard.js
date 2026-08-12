import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { Column, FlexstartColumn } from "../common/Column";
import { imageDB } from "../utility/imageData";
import ButtonEx from "../common/ButtonEx";
import "../screen/css/common.css"

import StoreInfo from "./StoreInfo";
import PCLifeheader from "../screen/LayoutPC/Header/PCLifeheader";


const Container = styled.div`
  background-color : #00000060;
  background-image: url(${imageDB.FREEZEBG});
  background-size: cover;
  background-position: center; 
  height: 100vh;
  width: 100%;

`

const InfoItem = styled.div`
  width: 22%;
  height: 73%;
  position: relative;
  top: 25%;
  left: 22%;

`
const InfoItemLayer1 = styled.div`
  font-size: ${() => getFontSize(30)}px;
  font-family : Pretendard-Bold;
  color : #fff;

`

const InfoItemLayer2 = styled.div`
  font-size: ${() => getFontSize(60)}px;
  font-family : Pretendard-Bold;
  margin: 20px 0px;
  color : #fff;
`
const InfoItemLayer3 = styled.div`
  color : #c4bebe;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height:1.7;
`

const ButtonLayer = styled.div`
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    width: 100%;
    margin-top: 20px;
    background: #FE6625;

`
const VideoStyle = `

.video-container {
  position: relative;
  width: 100%;
  /* 높이 비율: 16:9 기준 */
  padding-top: 26.25%; /* (9 / 16) * 100 */
  overflow: hidden;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율을 유지하며 비디오를 채움 */
  filter: blur(5px); /* 흐림 효과 */
}

.video-subcontainer {

  /* 높이 비율: 16:9 기준 */

  overflow: hidden;

}

.video-subcontainer video {

  top: 0;
  left: 0;
  height: 100%;
  width : 100%;

}

`







const PCLifeFreezeBoard = memo(({containerStyle, data}) =>  {

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
  const [number, setNumber] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

    setCurrentloading(currentloading);
  }, [refresh])

  async function FetchData(){
       
   
  }

  useEffect(()=>{
  
      FetchData();
  }, [])
  
  const _handleAppDownload = ()=>{
    navigate("/PCAppDownload");
  }
 
  

  const handleCanPlay = () => {

    setRefresh((refresh) => refresh + 1);
  }


  return (

    <>
      <Container style={containerStyle}>

        <PCLifeheader name={''} ></PCLifeheader>

        <InfoItem>
          <InfoItemLayer1>냉장고를 정리해보세요</InfoItemLayer1>
          <InfoItemLayer2>나의 냉장고</InfoItemLayer2>
          <InfoItemLayer3>
            <div>냉장고에서 관리해야하는 요리재료를 입력하여 관라하세요 </div>
            <div></div>
            <div>유효기간이 다가오는 요리재료를 실시간 알람을 보여주고</div>
            <div>이에 맞는 요리 레시피를 보내드려요</div>
          </InfoItemLayer3>

          <ButtonLayer onClick={_handleAppDownload}>나의 냉장고 사용하러가기 </ButtonLayer>

          <style>{VideoStyle}</style>
          <div class="video-subcontainer" style={{ marginTop: 20, borderRadius: 10 }} >
            <video poster={imageDB.introducethumnail4} preload="metadata" autoPlay muted loop onCanPlay={handleCanPlay}>
              <source src={imageDB.introduce4} type="video/mp4" />
            </video>
          </div>
        </InfoItem>

      </Container>
      <StoreInfo padding={22} />
    </>

  );

})

export default PCLifeFreezeBoard;

