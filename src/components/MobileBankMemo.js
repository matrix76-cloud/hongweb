
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { getFontSize } from '../utility/fontsize';


const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`

  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh);
  touch-action: pan-y;
  background:#fff;

`

const ContentLayer = styled.div`

  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top:110px;


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

const ClipboardApplyButton = styled.div`
    background-color :#FE6625;
    width:40px;
    border-radius :10px;
    height:20px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-right:20px;
  

`
const ClipboardApplyButtonText = styled.span`
  color :#fff;
  font-size :12px;
  font-family : ${({ theme }) => theme.REGULAR};
  font-weight:700;
`



const MobileBankMemo =({containerStyle, items}) =>  {

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

  const [bankitems, setBankitems] = useState(items);



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(() => {
    setBankitems(bankitems);
  },[refresh])



  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.info("클립보드에 저장되었습니다", {
          duration: 1000,
          style: { background: "#3C3C3C", color: "white", fontSize: () => getFontSize(16) }, // 스타일 변경
        })

      }
      )
      .catch((err) => console.error("복사 실패:", err));
  };



  const _handleDelete = async(data) => {
    const MEMO_ID = data.MEMO_ID;
    await DeleteMemoByMEMO_ID({ MEMO_ID });

    const FindIndex = bankitems.findIndex(x => x.MEMO_ID == data.MEMO_ID);

    if (FindIndex != -1) {
      bankitems.splice(FindIndex, 1);
    }

    setBankitems(bankitems);
    setRefresh((refresh) => refresh + 1);
   
  }



  return (

    <>

      <Container style={containerStyle}>
        <ContentLayer>
          {
            bankitems.map((data) => (
              <MainItem>
                <Item>

                  <Row>

                    <Row>
                      <img src={imageDB.ic_myinfo_menu_pay} style={{ width: 24 }} />
                    </Row>
                    <FlexstartColumn>
                      <Title>{data.BANKNAME}</Title>
                      <SubTitle>{data.BANKNUM}</SubTitle>
                    </FlexstartColumn>
                  </Row>
                  <Row>
                    <ClipboardApplyButton onClick={() => { copyToClipboard(data.BANKNUM) }}><ClipboardApplyButtonText>복사</ClipboardApplyButtonText></ClipboardApplyButton>
                    <FaRegTrashAlt color={'#131313'} onClick={() => { _handleDelete(data) }} />
                  </Row>

                </Item>
              </MainItem>
            ))
          }
          {
            bankitems.length == 0 && <Empty content={'계좌번호를 상대방에게 불러줘야 할때 복사해서 사용해보세요'}
              height={400} fontsize={'14px'} />
          }



        </ContentLayer>
        <div style={{height:600}}/>

      </Container>
      </>

 

  );
}

export default MobileBankMemo;

