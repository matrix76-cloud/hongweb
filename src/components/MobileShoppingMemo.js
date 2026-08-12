
import { Table } from "@mui/material";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { AroundRow, BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { sleep, useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { ReadCommunitySummary } from "../service/CommunityService";
import TimeAgo from 'react-timeago';
import { getFullTime, getNewDate } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { CurrentMenu, PCCOMMNUNITYMENU } from "../utility/screen";

import ButtonEx from "../common/ButtonEx";
import { Toaster, toast } from 'sonner';
import { FaRegTrashAlt } from "react-icons/fa";
import BirthCalendar from "./BirthCalendar";
import MobileMemoPopup from "../modal/MobileMemoPopup";
import { DeleteMemoByMEMO_ID, ReadMemoByIndividually, Update_memobymemoid } from "../service/MemoService";
import MobileBirthdayadd from "../modal/MobileBirthdayadd";
import Empty from "./Empty";

import KakaoShare from "./KakaoShare";
import { SlBasket } from "react-icons/sl";
import { getFontSize } from "../utility/fontsize";


const formatter = buildFormatter(koreanStrings);

const HEADER_HEIGHT = 44;
const BOTTOM_HEIGHT = 50;
const Container = styled.div`

  margin-top: calc(env(safe-area-inset-top, 0px) + ${HEADER_HEIGHT + BOTTOM_HEIGHT}px); // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT + BOTTOM_HEIGHT }px);
  overflow-y: auto;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;


`

const ContentLayer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;


`
const MainItem = styled.div`
  display:flex;
  flex-direction :row;
  justify-content: space-between;
  align-items:center;
  border-bottom : 1px solid #ededed;
  width:100%;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 90%;
  margin: 0 auto;
`
const Title = styled.div`
  padding-left:10px;
  font-family:Pretendard-Regular;
  font-size: ${() => getFontSize(14)}px;
  color: ${({ check }) => check == true ? ('#b5afac') : ('#131313')};
  text-decoration: ${({ check }) => check == true ? ('line-through') : (null)};
`

const SubTitle = styled.div`
  padding-left:10px;
  font-family:Pretendard;

`

const CheckStyle = `

/* 체크박스 전체 컨테이너 정리 */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px; /* 체크박스와 아이콘 사이의 간격 */
  padding: 10px 0;
}

/* 체크박스 스타일 */
input[type="checkbox"] {
  appearance: none; /* 기본 스타일 제거 */
  width: 20px;
  height: 20px;
  border: 2px solid #ff7e19; /* 기본 테두리 색상 */
  border-radius: 6px; /* 둥근 체크박스 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 체크박스 선택 시 스타일 */
input[type="checkbox"]:checked {
  background-color: #ff7e19; /* 체크된 배경색 */
  border-color: #ff7e19;
  position: relative;
}

/* 체크박스 내부 체크 표시 */
input[type="checkbox"]:checked::after {
  content: "✔"; /* 체크 아이콘 */
  font-size: ${() => getFontSize(14)}px;
  color: white;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 체크된 항목의 텍스트 색상 흐리게 */
.checked-text {
  color: #bbb; /* 체크된 텍스트 색상 */
  text-decoration: line-through; /* 체크된 항목 강조 */
}



`

const TextInput = `

 .textarea{
    width: 80%;
    margin : 0 auto;
    resize: none;
    border-radius: 30px;
    height: 30px;
    outline: 0;
    font-size: 17px;
    padding: 10px;
    color: #131313;
    background: #fff;
    border: none;
    font-family: Pretendard-Light;
    position: relative;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
 }

`


const BottomLine = styled.div`
  height: 70px;
  background-color: white;
  position: fixed;
  width: 100%;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom, 20px);  /* 👈 아이폰 대응 */
  box-shadow: 0 -2px 8px rgba(0,0,0,0.04); /* 아래 그림자 */
  z-index: 10;
`;
const ChatbtnLayer = styled.div`
  background-color: #f8f8f8;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 12px 16px calc(env(safe-area-inset-bottom, 16px) + 12px); /* ✅ SafeArea 대응 */
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.04);
  z-index: 20;
`;

const ChatIconLayer = styled.div`
  display: flex;
  flex-direction: row;
  width: 10%;
  justify-content: space-around;
  padding-left:10px;
`;

const InputChat = styled.input`
  flex: 1;
  border-radius: 30px;
  height: 38px;
  outline: 0;
  font-size: ${() => getFontSize(16)}px;
  padding: 0 14px;
  color: #131313;
  background: #fff;
  font-family: Pretendard-Light;
`;

const MemoButton = styled.div`
  background: #676565;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  flex-shrink: 0;
`;
const ShareBtnLayer = styled.div`

    display: flex;
    flex-direction : row;
    justify-content: flex-start;
    align-items: center;
    margin-right:40px;

`


const MemoButtonData = styled.div`
    font-size: ${() => getFontSize(25)}px;
    justify-content: center;
    display: flex;
    align-items: center;
    padding-bottom: 5px;
`
const InstallButton = styled.a`
display: inline-flex;
align-items: center;
justify-content: center;
background-color: #FFA95E;
color: white;
font-weight: 600;
font-size: ${() => getFontSize(17)}px;
text-decoration: none;
border-radius: 9999px;
padding: 12px 20px;
line-height: 1.4;
height: 44px;
min-width: 240px;
text-align: center;
box-shadow: 0 1px 2px rgba(0,0,0,0.1);

&:hover {
  background-color: #FF9C3E;
}
`;
const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;
const EmptyTitle = styled.div`
    margin-top: 20px;
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(22)}px;
    color: #423f3f;
`

const EmptySubTitle = styled.div`
  margin: 5px 0px;

`

const MobileShoppingMemo = ({ containerStyle, items, isShared, callback }) => {

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

  const [loading, setLoading] = useState(true);

  const [shoppingitems, setShoppingitems] = useState(items);

  const [memo, setMemo] = useState('');



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { };
  }, []);

  useEffect(() => {
    setShoppingitems(shoppingitems);
    setMemo(memo);
  }, [refresh])




  const handleChange = async (event) => {

    const FindIndex = shoppingitems.findIndex(x => x.MEMO_ID == event.target.value);

    const MEMO_ID = event.target.value;

    if (FindIndex != -1) {

      if (shoppingitems[FindIndex].CHECK == true) {
        shoppingitems[FindIndex].CHECK = false;

        const CHECK = false;

        await Update_memobymemoid({ CHECK, MEMO_ID });

      } else {
        shoppingitems[FindIndex].CHECK = true;
        const CHECK = true;
        await Update_memobymemoid({ CHECK, MEMO_ID });
      }
    }
    console.log("handleChange", FindIndex, event.target.value, shoppingitems);
    setShoppingitems(shoppingitems);
    setRefresh((refresh) => refresh + 1);

  }




  const _handleDelete = async (data) => {
    const MEMO_ID = data.MEMO_ID;
    await DeleteMemoByMEMO_ID({ MEMO_ID });

    const FindIndex = shoppingitems.findIndex(x => x.MEMO_ID == data.MEMO_ID);

    if (FindIndex != -1) {
      shoppingitems.splice(FindIndex, 1);
    }

    setShoppingitems(shoppingitems);
    setRefresh((refresh) => refresh + 1);

  }

  const _handleconfig = () => {
    callback(memo);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      callback(memo);
    }
  };

  const _handleInstall = () => {
    window.location.href = "https://honglady.co.kr";
  }


  return (

    <>

      <Container>
   
        <style>{CheckStyle}</style>
        <ContentLayer >
          {
            shoppingitems.map((data) => (
              <MainItem>
                <Item>
                  <Row className="checkbox-container">
                    <input type="checkbox" checked={data.CHECK}
                      value={data.MEMO_ID}
                      onChange={handleChange} />
                    <Row>
                      <img src={imageDB.shopping} style={{ width: 24, paddingRight: 5 }} />
                    
                      <span style={{fontFamily:"Pretendard-SemiBold"}} className={data.CHECK ? "checked-text" : ""}>{data.MEMO}</span>
                    </Row>

                  </Row>
                  {
                    isShared != true && <div>
                      <FaRegTrashAlt color={'#131313'} onClick={() => { _handleDelete(data) }} />
                    </div>
                  }
              
                </Item>
              </MainItem>
            ))
          }

          {
            shoppingitems.length == 0 && 

            
            <Column
            style={{
              paddingTop:150
            }}
            >

            <EmptyImage src={imageDB.homework} loading="eager" />
            <EmptyTitle>기록된 메모가 없습니다</EmptyTitle>
            <EmptySubTitle style={{ marginTop: 20 }}>
              필요한 물품등을 기록해 보세요
            </EmptySubTitle>
            <EmptySubTitle>메모기능 공유기능을 사용해 보세요</EmptySubTitle>


            </Column>
            
          }


        </ContentLayer>

    
  

        {isShared != true && <BottomLine>
          <style>{TextInput}</style>
          <ChatbtnLayer>

            <div className="textarea">
              <InputChat
                type={'text'}
                id="yourTextInputId"
                value={memo}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setMemo(e.target.value);
                  setRefresh((refresh) => refresh + 1);
                }}
              />


              <MemoButton onClick={_handleconfig}>
                <MemoButtonData>+</MemoButtonData>
              </MemoButton>


            </div>
            {/* <ShareBtnLayer>
              <KakaoShare url={`https://honglady.co.kr/MobileSmartMemoView?id=${user.USERS_ID}&&type=${'shopping'}`} />
            </ShareBtnLayer> */}

          </ChatbtnLayer>



        </BottomLine>}

  

  

      </Container>
    </>



  );
}

export default MobileShoppingMemo;

