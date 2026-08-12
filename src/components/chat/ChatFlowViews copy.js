// 📁 ChatFlowViews.js
import React, { useRef, useState, useEffect } from "react";
import ContractView from "./ContractView";
import PaymentView from "./PaymentView";
import Complete from "./Complete";
import ReviewView from "./ReviewView";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import MobileChatProfilePopup from "./MobileChatProfilePopup";
import MobileContactMainPopup from "./MobileContactMainPopup";
import styled from "styled-components";
import { getFontSize } from "../../utility/fontsize";

const ChatFlowViews = ({ ITEM,
    OWNER,
    user,
    leftimage,
    messages,
    message,
    setMessage,
    _handlesend,
    _handleimgView,
    handleUploadClick,
    handlefileuploadChange,
    fileInput,
    uploading,
    imgview,
    imgviewpopup,
    setImgviewpopup,
    _handlePaymentClick,
    _handleCompleteClick,
    _handleReviewClick,
    signcomplete,
    profilepopup,
    setProfilepopup,
    contactpopup,
    setContactpopup,
    completePopupOpen,
    setCompletePopupOpen,
    paymentPopupOpen,
    setPaymentPopupOpen,
    realprice,
    reviewPopupOpen,
    setReviewPopupOpen }) => {
    const [tab, setTab] = useState("chat");
    const [expanded, setExpanded] = useState(true); // ✅ 추가
    const messageListRef = useRef(); // ✅ 추가


    const _handleprofile = () => setProfilepopup(true);
    const Profilecallback = () => setProfilepopup(false);
    const _handlecontact = () => setContactpopup(true);
    const Contactcallback = () => setContactpopup(false);

    const progressMessage = {
        contract: "계약서 작성 및 서명을 완료해야 다음 단계로 진행됩니다.",
        payment: "결제 후 작업이 시작됩니다. 금액을 확인해 주세요.",
        complete: "작업 완료 후 사진과 함께 보고해주세요.",
        review: "작업이 끝났다면, 상대방을 평가해주세요."
    };

    useEffect(() => {
        if (!expanded) {
            setTimeout(() => {
                const anchor = document.getElementById("chat-bottom-anchor");
                anchor?.scrollIntoView({ behavior: 'smooth' });

                // 혹시 모자르면 이걸로 추가로 밀어줌
                window.scrollTo({
                    top: document.body.scrollHeight + 300,
                    behavior: 'smooth',
                });
            }, 200);
        }
    }, [expanded]);

    return (
        <>
            {profilepopup && <MobileChatProfilePopup ITEM={ITEM} callback={Profilecallback} />}
            {contactpopup && (
                <MobileContactMainPopup
                    ITEM={ITEM}
                    OWNER_ID={ITEM.OWNER_ID}
                    SUPPORTER_ID={ITEM.SUPPORTER_ID}
                    CHAT_ID={ITEM.CHAT_ID}
                    messages={ITEM.INFO}
                    callback={Contactcallback}
                />
            )}

            <ChatHeader
                ITEM={ITEM}
                OWNER={ITEM.OWNER}
                user={user}
                _handleprofile={_handleprofile}
                signcomplete={ITEM.signcomplete}
                _handlecontact={_handlecontact}
                expanded={expanded} // ✅ 전달
                setExpanded={setExpanded} // ✅ 전달
            
            />

            <TabRows expanded={expanded}>
                <TabRow>
                    <Tab selected={tab === "chat"} onClick={() => setTab("chat")}>체팅</Tab>
                    <Tab selected={tab === "contract"} onClick={() => setTab("contract")}>계약서작성</Tab>
                    <Tab selected={tab === "payment"} onClick={() => setTab("payment")}>결제</Tab>
                    <Tab selected={tab === "complete"} onClick={() => setTab("complete")}>완료 보고</Tab>
                    <Tab selected={tab === "review"} onClick={() => setTab("review")}>후기 평가</Tab>
                </TabRow>
    
                {tab !== "chat" && <ProgressStatusBox>{progressMessage[tab]}</ProgressStatusBox>}
            </TabRows>
      
     

            <ContentArea>
                {tab === "chat" && (
                    <>
                        <MessageList
                            messages={messages}
                            user={user}
                            ITEM={ITEM}
                            leftimage={leftimage}
                            uploading={uploading}
                            imgviewpopup={imgviewpopup}
                            setImgviewpopup={setImgviewpopup}
                            imgview={imgview}
                            paymentPopupOpen={paymentPopupOpen}
                            setPaymentPopupOpen={setPaymentPopupOpen}
                            realprice={realprice}
                            completePopupOpen={completePopupOpen}
                            setCompletePopupOpen={setCompletePopupOpen}
                            reviewPopupOpen={reviewPopupOpen}
                            setReviewPopupOpen={setReviewPopupOpen}
                            handlers={{
                                _handleimgView,
                                _handlePaymentClick,
                                _handleCompleteClick,
                                _handleReviewClick,
                            }}
                        />
                        <ChatInput
                            message={message}
                            setMessage={setMessage}
                            fileInput={fileInput}
                            handleUploadClick={handleUploadClick}
                            _handlesend={_handlesend}
                            handlefileuploadChange={handlefileuploadChange}
                        />
                    </>
                )}
                {tab === "contract" && <ContractView ITEM={ITEM} user={user} />}
                {tab === "payment" && <PaymentView ITEM={ITEM} user={user} />}
                {tab === "complete" && <Complete ITEM={ITEM} />}
                {tab === "review" && <ReviewView ITEM={ITEM} user={user} />}
            </ContentArea>
        </>
    );
};

export default ChatFlowViews;

const TabRows = styled.div`
  position: sticky;
  top: ${({ expanded }) => (expanded ? '200px' : '110px')}; // ← 요기
  z-index: 10;
  transition: top 0.2s ease;
`;

const TabRow = styled.div`

  z-index: 10;
  background: #fff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-bottom: 1px solid #ededed;
`;


const Tab = styled.div`
  flex: 1;
  text-align: center;
  font-weight: bold;
  padding: 10px 4px;
  font-size: ${() => getFontSize(13)}px;
  color: ${({ selected }) => (selected ? "#FF7125" : "#999")};
  border-bottom: 2px solid ${({ selected }) => (selected ? "#FF7125" : "transparent")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressStatusBox = styled.div`
  padding: 10px 16px;
  font-size: ${() => getFontSize(14)}px;
  color: #666;
  background: #fafafa;
  border-bottom: 1px solid #eee;
`;

const ContentArea = styled.div`
  padding-top: 16px;
  min-height: 60vh;
  background: #fff;
`;
