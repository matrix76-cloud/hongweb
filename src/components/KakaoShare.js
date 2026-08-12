import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';


import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";

import { IoMdShare } from "react-icons/io";
import { imageDB } from "../utility/imageData";
import { getFontSize } from "../utility/fontsize";

const Container = styled.div`


`


          


const SubContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 8px 12px;
  background-color: #FFA95E;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #ff9d47;
  }
`;

const ShareText = styled.span`
  color: #fff;
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(15)}px;
  margin-left: 8px;
  line-height: 1;
`;


const style = {
  display: "flex"
};




const KakaoShare = ({height=30, width = 30, text, url }) => {
  useEffect(() => {

  }, []);

  console.log("text url", text, url);
  const shareToKakao = ( text, url) => {

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ command: 'share', text: text, url: url }));
    }

  };

  return (
    <Container>
      <SubContainer onClick={() => { shareToKakao(text, url) }} height={height} width={width}> 
        <IoMdShare size={18} color={'#FFF'} />
        <ShareText>공유하기</ShareText>

      </SubContainer>
    </Container>

  );
};

export default KakaoShare;


