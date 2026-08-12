// 📁 MessageList.js (리팩 완성 버전)
import React, { useEffect, forwardRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { CHATCONTENTTYPE } from '../../utility/screen';
import InfoBoxItem from './InfoBoxItem';
import RightMessage from './RightMessage';
import LeftMessage from './LeftMessage';
import MobileChatImgPopup from '../../modal/MobileChatImgPopup';
import AILeftMessage from './AILeftMessage';
import AIRightMessage from './AIRightMessage';


const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;

`;

const AImessageList = forwardRef(({ messages, user, leftimage, ITEM, leftname, handlers, uploading, imgview,
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
      


            {messages.map((data, index) => (
                <React.Fragment key={index}>
                    {(data.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.ENTER || data.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.EXIT) && (
                        <InfoBoxItem data={data} />
                    )}

                    {(data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.EXIT &&
                        data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.ENTER) && (
                            user.USERS_ID !== data.USERS_ID ? (
                                <AILeftMessage data={data} user={user} leftimage={leftimage} leftname={leftname} ITEM={ITEM} _handleimgView={_handleimgView} />
                            ) : (
                                <AIRightMessage data={data} user={user} _handleimgView={_handleimgView} uploading={uploading} />
                            )
                        )}
                </React.Fragment>
            ))}

            {/* 🔽 스크롤 끝 앵커 */}
            <div id="chat-bottom-anchor" style={{ height: '1px' }} />
        </ScrollArea>
    );
});

export default AImessageList;
