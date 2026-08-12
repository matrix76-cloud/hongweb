// 📁 AILeftMessage.jsx (감성 챗 전용 말풍선)
import React from 'react';
import styled from 'styled-components';
import { getDateEx3 } from '../../utility/date';
import { getFontSize } from '../../utility/fontsize';
import CampCardList from '../card/CampCardList';
import AIMessageBody from './AIMessageBody';



const AILeftMessage = ({ data, leftimage, leftname, _handleimgView, forceBubble = false }) => {

  const card = data?.ITEM?.AI_CARD;

  const showCard = !!card && !forceBubble;   // ✅ 카드가 있어도 forceBubble이면 말풍선으로

  return (
    <Wrapper>
      <AvatarBox>
        <Avatar src={leftimage} alt="AI" />
        <Name>{leftname || 'AI 친구'}</Name>
      </AvatarBox>

      <MessageBlock>
        {showCard ? (
          // ✅ 카드가 있으면 AIMessageBody에게 전부 맡김
          <AIMessageBody data={data} _handleimgView={_handleimgView} />
        ) : (
          // ✅ 카드가 없으면 기존 말풍선 스타일
          <Bubble>{data.TEXT}</Bubble>
        )}
        
        <TimeText>{getDateEx3(data.CREATEDT)}</TimeText>
      </MessageBlock>
    </Wrapper>
  );
};

export default AILeftMessage;

const MessageBlock = styled.div`
  display: flex; flex-direction: column; align-items: flex-start;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const AvatarBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
  width: 40px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-size: ${() => getFontSize(10)}px !important;
  color: #aaa;
  margin-top: 4px;
  text-align: center;
`;



const Bubble = styled.div`
  background: #413e3ec4;
  border-radius: 20px;
  padding: 14px 18px;
  color: #fff;
  font-size: ${() => getFontSize(15)}px !important;
  line-height: 1.6;
  max-width: 80%;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);

`;

const Image = styled.img`
  max-width: 180px;
  border-radius: 16px;
  margin-bottom: 4px;
`;

const TimeText = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #999;
  margin-top: 6px;
`;
