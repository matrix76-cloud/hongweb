
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";

import "./medicaltable.css";
import "./medicalinput.css";
import axios from "axios";
import LottieAnimation from "../common/LottieAnimation";
import ResultLabel from "../common/ResultLabel";
import Border from "../common/Border";
import Empty from "./Empty";

import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { IoClose } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import  "../screen/css/common.css";
import { MEDICALMENU } from "../utility/life";
import KakaoShare from "./KakaoShare";

import { getFontSize } from '../utility/fontsize';
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

const MobileLifeMedicalDrugDetail=({containerStyle, data}) =>  {


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

  const [search, setSearch] = useState('');
  const [resultitem, setResultitem] = useState([]);

  const [searching, setSearching] = useState(false);

  const [searchcomplete, setSearchcomplete] = useState(false);

  const scrollableDivRef = useRef(null);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);





  const _handleprev = () => {
    navigate(-1);
  }
  


  return (

    <Container style={containerStyle}>

      <BetweenRow style={{ width: "90%", paddingTop: 20, position: "fixed", backgroundColor: '#fff', zIndex: 10 }}>
        <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center" }} onClick={_handleprev} >
          <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
          <div style={{ paddingLeft: 10, fontSize: () => getFontSize(20), fontFamily: "Pretendard-SemiBold", color: "#1A1E28" }}>{'의약품 상세정보'}</div>
        </div>

      </BetweenRow>  

        


      <Column style={{ alignItems: "flex-start", marginTop:30 }}>
        <Row style={{ width: "90%", margin:"0 auto" }}>
          {/* <Column style={{ width: '30%', alignItems: "center", background: "#ededed", height: "80px", borderRadius: 15 }}>

            {
              data.itemImage == null ? (<LazyLoadImage
                style={{ borderRadius: 10, background: "#ededed" }}
                src={imageDB.medical}
                alt="Lazy Loaded Example"
                effect="blur"
                offset={100} // 이미지가 보이기 100px 전 미리 로드
                width={'40px'}
                height={'40px'}
              />) : (<LazyLoadImage
                style={{ borderRadius: 10, background: "#ededed" }}
                src={data.itemImage}
                alt="Lazy Loaded Example"
                effect="blur"
                offset={100} // 이미지가 보이기 100px 전 미리 로드
                width={'100%'}
                height={'80px'}
              />)
            }


          </Column> */}

          <Column style={{ width: '100%', alignItems: "flex-start", paddingLeft: 10 }}>
            <div style={{ color: "#636363", fontSize: '12px' }}>{data.entpName}</div>
            <div style={{ color: "#131313", fontSize: '16px', marginTop: 10 }}>{data.itemName}</div>
          

          </Column>
        </Row>

        <ContentItem style={{marginTop:30}}>
          <Row style={{justifyContent:"center", alignItems:"center"}}>
            <Label>효능</Label>
          </Row>

          {
            data.efcyQesitmopen == true && <Content>{data.efcyQesitm}</Content>
          }
        
        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{justifyContent:"center", alignItems:"center"}}>
            <Label>사용법</Label>
          </Row>

          {
            data.useMethodQesitmopen == true && <Content>{data.useMethodQesitm}</Content>
          }
        
        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{justifyContent:"center", alignItems:"center"}}>
            <Label>사용상 주의사항</Label>
          </Row>

          {
            data.atpnQesitmopen == true && <Content>{data.atpnQesitm}</Content>
          }
        
        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{justifyContent:"center", alignItems:"center"}}>
            <Label>주의해야할 약 음식</Label>
          </Row>

          {
            data.intrcQesitmopen == true && <Content>{data.intrcQesitm}</Content>
          }
        
        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />
        <ContentItem>
          <Row style={{justifyContent:"center", alignItems:"center"}}>
            <Label>부작용</Label>
          </Row>

          {
            data.seQesitmopen == true && <Content>{data.seQesitm}</Content>
          }
        
        </ContentItem>
        <Border containerStyle={{ height: '10px', background: "#F5F6F9", margin: "10px 0px 20px" }} />


        <ContentItem>
          <Row style={{justifyContent:"center", alignItems:"center"}}>
            <Label>보관 방법</Label>
          </Row>

          {
            data.depositMethodQesitmopen == true && <Content>{data.depositMethodQesitm}</Content>
          }
        
        </ContentItem>
        <div style={{ height: "150px" }} />

      </Column>


         
    </Container>
  );

}

export default MobileLifeMedicalDrugDetail;

