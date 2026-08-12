// components/ai-friend/AIFriendFlowView.jsx

import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import MessageList from "./MessageList"; // 기존 그대로 재사용 가능
import ChatInput from "./ChatInput"; // 입력창도 재사용
import { imageDB } from "../../utility/imageData";
import AImessageList from "./AImessageList";
import AIChatInput from "./AIChatInput";




const AIChatFlowView = ({
    user,
    ITEM,
    messages,
    message,
    setMessage,
    _handlesend,
    isAITyping,
    bgImage,
    leftimage,
    leftname,
}) => {

    const chatRef = useRef(null);        // 스크롤 컨테이너(고정 높이)
    const contentRef = useRef(null);     // 실제 높이가 변하는 내부 컨텐츠

    const bottomGap = 180;
    const [isOverflow, setIsOverflow] = useState(false);


    // 스크롤 영역이 넘치는지 계산
    useEffect(() => {
        const el = chatRef.current;
        const content = contentRef.current;
        if (!el || !content) return;

        const check = () => setIsOverflow(el.scrollHeight > el.clientHeight);

        // 콘텐츠/레이아웃 변동 감지
        const ro = new ResizeObserver(check);
        ro.observe(content);
        window.addEventListener('resize', check);
        check();

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', check);
        };
    }, []);


    // 1) 내부 컨텐츠 크기 변할 때마다 맨 아래로
    useEffect(() => {
        const el = chatRef.current;
        const content = contentRef.current;
        if (!el || !content) return;

        const ro = new ResizeObserver(() => {
            el.scrollTop = el.scrollHeight;
        });
        ro.observe(content);

        // 초기 진입에도 한 번 내려주기
        el.scrollTop = el.scrollHeight;

        return () => ro.disconnect();
    }, []);

    // 2) messages 변경 시 한 프레임 뒤에 한 번 더 보정
    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;
        // 즉시 1번
        el.scrollTop = el.scrollHeight;
        // 레이아웃/이미지 로딩 후 1프레임 뒤 1번 더
        const id = requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
        return () => cancelAnimationFrame(id);
    }, [messages]);

    const handleimgView = (url) => {
    };

    return (
        <Wrapper $bg={bgImage}>
            <MessageContainer >
                <ChatArea ref={chatRef}>
                    <div ref={contentRef}>
                    <AImessageList
                    messages={messages}
                    user={user}
                    ITEM={ITEM}
                    leftimage={leftimage}
                    leftname={leftname}
                    isAI={true}
                    handlers={{ handleimgView, _handlesend }} // ✅ 이렇게 확실히 넘겨줘
                        />
                    {/* ✅ 스크롤 있을 때만 하단 여백 */}
                    <div style={{ height: isOverflow ? bottomGap : 0 }} />
                    </div>
                </ChatArea>
        
            </MessageContainer>

            <AIChatInput
                isBlocked={false}
                message={message}
                setMessage={setMessage}
                _handlesend={_handlesend}
                isAITyping={isAITyping}
            />
        </Wrapper>
    );
};

export default AIChatFlowView;

const Wrapper = styled.div`
  display:flex; flex-direction:column; width:100%; height:100vh;
  background-image: url(${p => p.$bg});
  background-size: cover; background-position: center; background-repeat: no-repeat;
  position:relative; z-index:0;
  &::before{ content:""; position:absolute; inset:0; background:rgba(0,0,0,.4); z-index:1; }
`;



const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-image: url(${imageDB.airoom});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow: hidden;      /* ✅ 스크롤은 ChatArea 한 군데만 */
  padding: 16px;
  padding-bottom: 100px;  /* 입력창 높이만큼 여백 */
  z-index: 1;
  position: relative;
  padding-top: 64px; /* 헤더 높이만큼 여백 */   
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  height: calc(100dvh - 64px); /* ✅ 모바일에서 100dvh가 튐 적음 */
  padding: 16px 8px;
  position: relative;
  z-index: 2;               /* ✅ 배경 오버레이보다 위로 */

   -ms-overflow-style: none;      /* IE/Edge(레거시) */
 scrollbar-width: none;         /* Firefox */
 &::-webkit-scrollbar {        

  width: 0;
  height: 0;
  display: none;
}


`;

const Inner = styled.div`
  min-height: 100%;            /* 스크롤 높이보다 작으면 영역을 꽉 채움 */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;   /* ✅ 항상 아래로 붙임 */
  gap: 12px;                   /* 말풍선 간 간격 */
  align-items: flex-start;     /* 말풍선이 가로로 늘어나지 않게 */

`;