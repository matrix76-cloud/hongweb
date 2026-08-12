import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../context/User";


import { CiHeart } from "react-icons/ci";
import { USELAW } from "../utility/law";
import { BetweenRow, Row } from "../common/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";
import { ref } from "firebase/storage";
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
    width: 70%;
    margin: 50px auto;
    font-size: ${() => getFontSize(18)}px;
`
const RowItem = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding-bottom:20px;
    padding-top:20px;
`
const ColumnItem = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding-bottom:20px;
    padding-top:20px;
`
const Indexno = styled.div`
    color: #849dd2;
    font-weight: 600;
`
const Label  = styled.div`
    margin-left:20px;
`


const style = {
  display: "flex"
};

const { kakao } = window;

const KakaoCenter =({containerStyle}) =>  {

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
    async function FetchData(){
    } 
    FetchData();
  }, [])

  useEffect(() => {
    // 카카오 SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); // 여기에는 카카오 디벨로퍼스에서 받은 JavaScript 키를 입력합니다.
      }

    // 상담 버튼 생성
    window.Kakao.Channel.createChatButton({
      container: '#kakao-talk-channel-chat-button', // 버튼을 넣을 컨테이너의 ID
      channelPublicId: '_JAKqn', // 카카오톡 채널의 ID, _로 시작하는 ID
      size: 'large',
      color: 'yellow', // 버튼 색상
      supportMultipleDensities: true, // 고해상도 디스플레이 지원
    });
  }, []);

 
  return <div id="kakao-talk-channel-chat-button" />;

}

export default KakaoCenter;

