import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ContractView from "./ContractView";
import PaymentView from "./PaymentView";
import Complete from "./Complete";
import ReviewView from "./ReviewView";
import TabProgressWithAjumma from "./TabProgressWithAjumma";
import { CHATCONTENTTYPE, CONTACTTYPE } from "../../utility/screen";

const ChatFlowViews = ({ ITEM, OWNER, user, currentStep,CONTACTITEM,
    leftimage, leftname, messages, message, setMessage,
    _handlesend, _handleimgView,
    handleUploadClick, handlefileuploadChange, fileInput,
    uploading, imgview, imgviewpopup, setImgviewpopup,

}) => {

    console.log("ChatFlowViews", ITEM);
    const [tab, setTab] = useState("chat");
    const [expanded, setExpanded] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        if (!expanded) {
            setTimeout(() => {
                const container = scrollRef.current;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 200);
        }
    }, [expanded]);




    
    const isFixedAdminChat = ITEM.CHAT_ID?.startsWith("hongyeosa_fixed_");


    const lastMessage = messages?.[messages.length-1]; // 가장 상단 항목 기준 메시지
    const isBlocked = lastMessage?.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.EXIT && lastMessage?.USERS_ID !== user.USERS_ID;




    return (
        <Wrapper>

            {!isFixedAdminChat &&
                <TabProgressWithAjumma chatId={ITEM.CHAT_ID} currentStep={currentStep} setTab={setTab}
                isBlocked={isBlocked} />}

            <ContentArea ref={scrollRef}>
                {tab === "chat" && (
                    <>
                        <MessageList
                            messages={messages}
                            user={user}
                            ITEM={ITEM}
                            leftimage={leftimage}
                            leftname ={leftname}
                            uploading={uploading}
                            imgview={imgview}
                            imgviewpopup={imgviewpopup}
                            setImgviewpopup={setImgviewpopup}
                         
                            handlers={{
                                _handleimgView,
                            }}
                        />
                        <ChatInput
                            isBlocked={isBlocked} 
                            message={message}
                            setMessage={setMessage}
                            fileInput={fileInput}
                            handleUploadClick={handleUploadClick}
                            _handlesend={_handlesend}
                            handlefileuploadChange={handlefileuploadChange}
                        />
                    </>
                )}
                {tab === "contract" && <ContractView ITEM={ITEM} user={user} CONTACTITEM={CONTACTITEM} />}
                {tab === "payment" && <PaymentView ITEM={ITEM} user={user} CONTACTITEM={CONTACTITEM} />}
                {tab === "complete" && <Complete ITEM={ITEM} CONTACTITEM={CONTACTITEM} />}
                {tab === "review" && <ReviewView ITEM={ITEM} user={user} CONTACTITEM={CONTACTITEM} />}
            </ContentArea>
        </Wrapper>
    );
};

export default ChatFlowViews;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #e5ddd5; // ✅ 배경 고정
`;
