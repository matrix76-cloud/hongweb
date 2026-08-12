import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";
import { getFontSize } from "../../utility/fontsize";


const Container = styled.div`
  height :${({height}) => height}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom:20px;
  margin-top:40px;

`
const style = {
  display: "flex"
};

const Contentitem = styled.div`
  font-size: ${({fontsize}) => fontsize};
  margin-top: 20px;
  font-family: 'Pretendard-Light';
`

const ChatStyle = `
.chat-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px 15px;
  text-align: center;
}

.chat-bubble {
  background-color: #f1f1f1;
  color: #555;
  padding: 16px 20px;
  border-radius: 20px;
  max-width: 280px;
  font-size: ${() => getFontSize(15)}px;
  line-height: 1.6;
  position: relative;
  text-align : left;
}

.chat-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: #f1f1f1 transparent transparent transparent;
}
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.chat-wrapper.blinking {
  animation: blink 1.2s ease-in-out infinite;
}

`

const Empty =({containerStyle, content, height, fontsize='16px'}) =>  {
 
  return (

    <Container style={containerStyle} height={height} >


      <style>{ChatStyle}</style>

      <div class="chat-wrapper blinking">
        <div class="chat-bubble">
          {content}
        </div>
      </div>
      <img src={imageDB.EMPTYINFO} style={{height:80, width:70}}/>
      
    </Container>
  );

}

export default Empty;

