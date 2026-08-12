// 📁 MessageList.js (리팩 완성 버전)
import React, { useEffect, forwardRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { CHATCONTENTTYPE } from '../../utility/screen';
import InfoBoxItem from './InfoBoxItem';
import RightMessage from './RightMessage';
import LeftMessage from './LeftMessage';
import MobileChatImgPopup from '../../modal/MobileChatImgPopup';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 10px;
  width: 80%;
  margin: 0 auto;
`;

const GridCell = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #fafafa;
  border: 1.5px dashed #bbb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px;
  background-color: #e5ddd5; // ✅ 배경 고정
`;

const MessageList = forwardRef(({ messages, user, leftimage, ITEM, leftname, handlers, uploading, imgview,
    imgviewpopup, setImgviewpopup,
    realprice }, ref) => {

    const {
        _handleimgView,
     
    } = handlers;

    useEffect(() => {
        if (ref?.current) {
            setTimeout(() => {
                ref.current.scrollTop = ref.current.scrollHeight;
            }, 150);
        }
    }, [messages]);


    console.log("messages", messages);

    return (
        <ScrollArea ref={ref}>
            {imgviewpopup && (
                <MobileChatImgPopup img={imgview} callback={() => setImgviewpopup(false)} />
            )}

    
            {/* ✅ 관리자 고정 인포박스 */}
            {ITEM?.CHAT_ID?.startsWith("hongyeosa_fixed_") && (
                <InfoBoxItem
                    containerStyle={{ marginTop: 80 }}
                    data={{
                    CHAT_CONTENT_TYPE: "INFO",
                    TEXT: "고객님, 무엇을 도와드릴까요?",
                        CREATEDT: new Date()
                }} />
            )}


            {messages.map((data, index) => (
                <React.Fragment key={index}>
                    {(data.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.ENTER || data.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.EXIT) && (
                        <InfoBoxItem data={data} />
                    )}

                    {(data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.EXIT &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.RIGHTSIGN &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.PURCHASE &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.COMPLETE &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.REVIEW &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.LEFTSIGN &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.ENTER) && (
                            user.USERS_ID !== data.USERS_ID ? (
                                <LeftMessage data={data} user={user} leftimage={leftimage} leftname={leftname} ITEM={ITEM} _handleimgView={_handleimgView} />
                            ) : (
                                <RightMessage data={data} user={user} _handleimgView={_handleimgView} uploading={uploading} />
                            )
                        )}
                </React.Fragment>
            ))}

            {/* 🔽 스크롤 끝 앵커 */}
            <div id="chat-bottom-anchor" style={{ height: '1px' }} />
        </ScrollArea>
    );
});

export default MessageList;
