// MessageList.js
import React, { useEffect, forwardRef, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { CHATCONTENTTYPE } from '../../utility/screen';
import AILeftMessage from './AILeftMessage';
import AIRightMessage from './AIRightMessage';
import InfoBoxItem from './InfoBoxItem';
import { getFortuneProfile, saveFortuneProfile } from '../../features/features/fortuneStorage';
import { CreateMessage } from '../../service/ChatService';
import FortuneInlineForm from '../card/FortuneInlineForm';

// ⬇️ 추가




const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const AImessageList = forwardRef(({ messages, user, leftimage, ITEM, leftname, handlers, uploading }, ref) => {
    const { _handleimgView, _handlesend } = handlers || {};

    useEffect(() => {
        if (ref?.current) {
            const id = setTimeout(() => (ref.current.scrollTop = ref.current.scrollHeight), 150);
            return () => clearTimeout(id);
        }
    }, [messages, ref]);

    // ⬇️ 저장된 운세 프로필 여부
    const [hasProfile, setHasProfile] = React.useState(() => !!getFortuneProfile(user?.USERS_ID || ''));
    // ⬇️ 자동 질의 중복 방지
    const autoAskSentRef = useRef(false);

    const isFortuneFormMsg = (m) => {
        const type = m?.MSG_TYPE || m?.msgType;
        const aiCard = (m?.ITEM && m.ITEM.AI_CARD) || (m?.item && m.item.AI_CARD);
        return type === 'FORTUNE_FORM' || aiCard?.type === 'fortune_form';
    };


   
    useEffect(() => {
         // 유저가 바뀌면 저장 여부 다시 로드
          setHasProfile(!!getFortuneProfile(user?.USERS_ID || ''));
     }, [user?.USERS_ID]);
    

    return (
        <ScrollArea ref={ref}>
            {messages.map((data, index) => {
                const key = data.MESSAGE_ID || index;

                if (isFortuneFormMsg(data)) {
                    // ✅ 이미 저장된 경우: 폼은 숨기고 1회 자동 질의
                    if (hasProfile) {
                        if (!autoAskSentRef.current && typeof _handlesend === 'function') {
                            autoAskSentRef.current = true;
                            setTimeout(() => _handlesend('오늘 운세 알려줘'), 0);
                        }
                        return data.TEXT ? (
                            <AILeftMessage
                                key={key}
                                data={data}
                                user={user}
                                leftimage={leftimage}
                                leftname={leftname}
                                ITEM={ITEM}
                                _handleimgView={_handleimgView}
                            />
                        ) : null; // 텍스트 없으면 아무것도 렌더 안 함
                    }
                    
                    // ✅ 아직 미저장: 폼 띄우기
                    const aiCard = (data.ITEM && data.ITEM.AI_CARD) || (data.item && data.item.AI_CARD);
                    const initial = aiCard?.initial || {};

                    return (
                        <React.Fragment key={key}>
                            {data.TEXT ? (
                                <AILeftMessage
                                    forceBubble
                                    data={data}
                                    user={user}
                                    leftimage={leftimage}
                                    leftname={leftname}
                                    ITEM={ITEM}
                                    _handleimgView={_handleimgView}
                                />
                            ) : null}

                            <div style={{ padding: 8 }}>
                                <FortuneInlineForm
                                    initial={initial}
                                    
                                    onSubmit={async (profile) => {
                                        // 저장
                                 
                                        // 1) 폼부터 바로 숨기기 (낙관적)
                                        setHasProfile(true);
                                         // 2) 로컬 저장 (실패해도 폼은 숨김 유지)
                                         try {
                                            saveFortuneProfile(user?.USERS_ID || '', profile);
                                         } catch (e) {
                                            console.warn('saveFortuneProfile failed:', e);
                                         }
                                        
                                        await CreateMessage({
                                            CHAT_ID: data.CHAT_ID || ITEM?.CHAT_ID,
                                            msg: '정보 저장 완료! 바로 운세를 확인할게요 🔮',
                                            users_id: 'ai-friend-id',
                                            CHAT_CONTENT_TYPE: 'TEXT',
                                            read: [user?.USERS_ID],
                                            ITEM,
                                        });
                                        // 질의
                                        _handlesend?.('오늘 운세 알려줘');
                                    }}
                                />
                            </div>
                        </React.Fragment>
                    );
                }

                // 일반 메시지
                return (
                    <React.Fragment key={key}>
                        {(data.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.ENTER ||
                            data.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.EXIT) && <InfoBoxItem data={data} />}

                        {data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.EXIT &&
                            data.CHAT_CONTENT_TYPE !== CHATCONTENTTYPE.ENTER &&
                            (user.USERS_ID !== data.USERS_ID ? (
                                <AILeftMessage
                                    data={data}
                                    user={user}
                                    leftimage={leftimage}
                                    leftname={leftname}
                                    ITEM={ITEM}
                                    _handleimgView={_handleimgView}
                                />
                            ) : (
                                <AIRightMessage data={data} user={user} _handleimgView={_handleimgView} uploading={uploading} />
                            ))}
                    </React.Fragment>
                );
            })}

            <div id="chat-bottom-anchor" style={{ height: '1px' }} />
        </ScrollArea>
    );
});

export default AImessageList;
