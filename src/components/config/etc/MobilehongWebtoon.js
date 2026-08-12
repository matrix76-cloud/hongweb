
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { GoDotFill } from "react-icons/go";
import { TbCircleNumber1Filled } from "react-icons/tb";
import { TbCircleNumber2Filled } from "react-icons/tb";
import { TbCircleNumber3Filled } from "react-icons/tb";
import { UserContext } from "../../../context/User";
import { sleep } from "../../../utility/common";
import { CONFIGMOVE, KnowItem, KnowMenu } from "../../../utility/screen";
import { Column } from "../../../common/Column";
import { imageDB } from "../../../utility/imageData";
import { FlexstartRow } from "../../../common/Row";
import LottieAnimation from "../../../common/LottieAnimation";
import ButtonEx from "../../../common/ButtonEx";
import LazyGuideImage from "../../../common/LasyGuideImage";
import { getFontSize } from "../../../utility/fontsize";



const Container = styled.div`
  width:95%;
  margin:10px auto;
  color : #131313;
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh-50px);
  touch-action: pan-y;


`

const HongIntroBanner = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff2d8;
  padding: 16px 20px;
  border-radius: 20px;
  margin: 40px 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const HongImage = styled.img`
  width: 60px;
  height: auto;
  margin-right: 16px;
`;

const HongText = styled.div`
  font-size: ${() => getFontSize(16)}px;
  line-height: 1.5;
  color: #1e1e1e;
  font-weight: 500;
  font-family: 'Pretendard', sans-serif;

  strong {
    font-weight: 700;
  }
`;



const WebtoonListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 16px;
`;

const WebtoonListItem = styled.button`
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
  font-size: ${() => getFontSize(15)}px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fff3e0;
  }

  &:active {
    background-color: #ffe0b2;
  }
`;

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`


const MobilehongWebtoon =({containerStyle}) =>  {

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

  }, [])
 
  const _handleWebtoonMove=(menu)=>{
    navigate("/Mobilewebtoon",{state :{image :"", name : menu}});
  }
 
  return (

    <ScrollWrapper>
      <Container className="WorkLayer">


        <HongIntroBanner>
          <HongImage src={imageDB.hongladywebtoon} alt="구해줘 알바" />
          <HongText>
            <strong>웹툰 형식으로</strong><br />
            구해줘 알바를 알아보세요 😊
          </HongText>
        </HongIntroBanner>




        <WebtoonListContainer>
          {
            KnowItem.map((data) => (
              <WebtoonListItem onClick={() => { _handleWebtoonMove(data.value) }}>
                {data.value}
              </WebtoonListItem>

            ))
          }

        </WebtoonListContainer>

      </Container>
    </ScrollWrapper>

  );

}

export default MobilehongWebtoon;

