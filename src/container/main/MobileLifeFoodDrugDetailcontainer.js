

import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Border from "../../common/Border";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import  "../../screen/css/common.css";
import { Column, FlexstartColumn } from "../../common/Column";
import { BetweenRow, Row } from "../../common/Row";
import { imageDB } from "../../utility/imageData";
import { MEDICALMENU } from "../../utility/life";
import KakaoShare from "../../components/KakaoShare";
import { getFontSize } from "../../utility/fontsize";

const Container = styled.div`
  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;

  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;

`
const style = {
  display: "flex"
};

const MainLabelInfo = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: ${() => getFontSize(20)}px;
`


const SubLabelInfo = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: ${() => getFontSize(18)}px;
`



const StyledInput = styled.input`
  ::placeholder {
    font-size: ${() => getFontSize(22)}px;
  }
`;

const SearchSticky = styled.div`
    width: 90%;
    position: sticky;
    top: 0px;
    height: 60px;
    background: #fff;
    margin : 15px auto;

`


const Inputstyle ={
  background: '#FFF',
  borderRadius:'10px',
  fontSize: '16px',
  padding: '0px 16px 0px 45px',
  height : '40px',
  border : "1px solid #FF7125",
  width: '90%',
  margin: '0 auto',
  fontFamily:'Pretendard-Regular',
}


const  SearchLayer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  

`



const Label = styled.div`
  font-size: ${() => getFontSize(18)}px;
  color : #131313;
  font-weight: 500
`
const Content = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color : #636363;
  line-height:2.5;
`
const CloseLayer = styled.div`
  background: rgb(184, 185, 188);
  height: 20px;
  width: 20px;
  border-radius: 20px;
  position: absolute;
  left: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
    &:active {
    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }


`

const ContentItem = styled.div`
  align-items: flex-start;
  margin: 0px auto;
  width: 90%;

  display: flex;
  flex-direction: column;
  justify-content: center;


`

const MobileLifeFoodDrugDetailcontainer=({containerStyle, data, search}) =>  {


/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const location = useLocation();
  const navigate = useNavigate();

 

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);





  const _handleprev = () => {
    navigate("/Mobilecommunitycontent", { state: { name: MEDICALMENU.FOODINFOMATION, search : search } });
  }
  


  return (

    <Container style={containerStyle}>


      <BetweenRow onClick={_handleprev}  style={{ width: "90%", paddingTop: 10, position: "fixed", backgroundColor: '#fff', zIndex: 10, height: 40, left:15 }}>
        <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center"}}>
          <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }}  />
          <div style={{ paddingLeft: 10, fontSize: () => getFontSize(20), fontFamily: "Pretendard-SemiBold", color: "#1A1E28" }}>{'건강식품 상세정보'}</div>
        </div>
      </BetweenRow>  

  
      <Column style={{ alignItems: "flex-start", marginTop:80 }}>
        <Row style={{ width: "90%", margin:"0 auto" }}>


          <FlexstartColumn style={{  alignItems: "flex-start",}}>
            <div style={{ color: "#636363", fontSize: '12px' }}>{data.item.ENTRPS}</div>
            <Row>
              <div style={{ color: "#131313", fontSize: '18px', marginTop: 10 }}>{data.item.PRDUCT}</div>
      
         
            </Row>
        
          </FlexstartColumn>
        </Row>

        <ContentItem style={{ marginTop: 30 }}>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>등록일</Label>

          </Row>

          {
            data.item.REGIST_DTopen == true && <Content>{data.item.REGIST_DT}</Content>
          }

        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>유효기간</Label>

          </Row>

          {
            data.item.DISTB_PDopen == true && <Content>{data.item.DISTB_PD}</Content>
          }

        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>특징</Label>

          </Row>

          {
            data.item.SUNGSANGopen == true && <Content>{data.item.SUNGSANG}</Content>
          }

        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>사용법</Label>

          </Row>

          {
            data.item.SRV_USEopen == true && <Content>{data.item.SRV_USE}</Content>
          }

        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>보관방법</Label>

          </Row>

          {
            data.item.PRSRV_PDopen == true && <Content>{data.item.PRSRV_PD}</Content>
          }

        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>기능</Label>

          </Row>

          {
            data.item.MAIN_FNCTNopen == true && <Content>{data.item.MAIN_FNCTN}</Content>
          }

        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Label>부작용</Label>

          </Row>

          {
            data.item.INTAKE_HINT1open == true && <Content>{data.item.INTAKE_HINT1}</Content>
          }

        </ContentItem>

      </Column>

      <div style={{height:100}}/>
         
    </Container>
  );

}

export default MobileLifeFoodDrugDetailcontainer;

