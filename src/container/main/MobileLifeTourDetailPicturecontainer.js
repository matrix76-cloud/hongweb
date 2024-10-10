

import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';






const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
`
const style = {
  display: "flex"
};



const BoxItem = styled.div`
  padding: 20px;
  color: #131313;
  font-family: "Pretendard-Light";
  line-height:1.5;


`  

const MobileLifeTourDetailPicturecontainer =({containerStyle, index, items}) =>  {
console.log("TCL: MobileLifeTourAutoPicturecontainer -> index", index)
console.log("TCL: MobileLifeTourAutoPicturecontainer -> items", items)


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


 

  return (
    <div ref={elementRef}>
      <Container style={containerStyle}>   
          <div style={{
            width: '100%',
            height: '550px',
            overflow: 'hidden'
          }}>
          <img src={items[index].galWebImageUrl} style={{
            maxWidth: '100%',
            height: '100%',
            objectFit: 'cover',
          }}/>  
          </div>
        

          <BoxItem>
            <div>{items[index].galTitle}</div>
            <div>{items[index].galPhotographyLocation}</div>
            <div>{items[index].galSearchKeyword}</div>
            <div>{items[index].galPhotographyMonth}</div>
          </BoxItem>

      </Container>
    </div>
  );

}

export default MobileLifeTourDetailPicturecontainer;

