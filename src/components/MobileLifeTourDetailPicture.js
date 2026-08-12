

import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { imageDB } from "../utility/imageData";
import { BetweenRow } from "../common/Row";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ensureHttps } from "../utility/common";
import { getFontSize } from "../utility/fontsize";





const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  background : #fff;
`
const style = {
  display: "flex"
};



const BoxItem = styled.div`
  padding: 20px;
  background: #fff;
  font-family: "Pretendard-SemiBold";
  line-height:1.5;
  color :#131313;


`  

const MobileLifeTourDetailPicture =({containerStyle,item}) =>  {



/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [width, setWidth] = useState(0);
  const elementRef = useRef(null);


  useLayoutEffect(() => {
    setWidth(elementRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    const handleTouchMove = (event) => {
 
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
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

  const _handleprev = () => {
    navigate(-1);
  }
 

  return (
    <div ref={elementRef}>
      <Container style={containerStyle}>   
          <div style={{
            width: '100%',
            height: '550px',
            overflow: 'hidden'
        }}>
          


  


          <img src={ensureHttps(item.galWebImageUrl)} style={{
            maxWidth: '100%',
            height: '100%',
            objectFit: 'cover',
          }}/>  
          </div>
        

        <BoxItem>
            <div style={{fontSize: getFontSize(18),fontFamily:"Pretendard-Bold"}}>{item.galSearchKeyword}</div>
            <div style={{ fontSize: getFontSize(16), fontFamily: "Pretendard-Light",marginTop:10 }}>#{item.galPhotographyLocation}</div>
            <div style={{ fontSize: getFontSize(16), fontFamily: "Pretendard-Light", marginTop: 10 }}>#{item.galPhotographyMonth}</div>
          </BoxItem>

      </Container>
    </div>
  );

}

export default MobileLifeTourDetailPicture;

