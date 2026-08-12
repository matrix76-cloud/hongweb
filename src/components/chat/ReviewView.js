import React, { useState, useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { UserContext } from '../../context/User';
import { CHATCONTENTTYPE, ReviewContent } from '../../utility/screen';
import { UpdateContactByReview } from '../../service/ContactService';
import { sleep } from '../../utility/common';
import { CreateMessageEx3 } from '../../service/ChatService';
import { getFontSize } from "../../utility/fontsize";
import HongButton from '../HongButton';
import useContractFlow from '../../hooks/useContractFlow';

const Container = styled.div`
  padding: 20px;
  background: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 10px 0;
`;

const fade = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.05); }
`;

const Tag = styled.div`
  background: ${({ selected }) => (selected ? '#ff4e193b' : '#f4f4f4')};
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: ${() => getFontSize(13)}px !important;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  word-break: keep-all;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 6px;

  ${({ selected }) =>
        selected &&
        css`
      animation: ${fade} 0.2s ease-in-out;
      border-color: #ff4e19;
      color: #ff4e19;
    `}
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  font-size: ${() => getFontSize(14)}px !important;
  resize: none;
  box-sizing: border-box;
  line-height: 1.6;
  font-family: Pretendard-Light;
  margin-bottom: 15px;
`;

const NoticeText = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #888;
  text-align: center;
  margin-top: 20px;
  line-height: 1.5;
`;

const ReviewText = styled.div`
  margin: 16px 0 12px;
  font-size: ${() => getFontSize(14)}px !important;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const emojiMap = {
    '친절해요': '😊',
    '시간 약속을 잘지켜요': '⏰',
    '편안해요': '💆‍♀️',
    '전문적 이에요': '📚',
    '소통을 잘해요': '💬',
    '일을 꼼꼼하게 처리해요': '🛠️',
    '배려심이 좋아요': '🤝'
};

const Review = ({ ITEM, callback, CONTACTITEM }) => {
    const { user } = useContext(UserContext);
    const [review, setReview] = useState('');
    const [tags, setTags] = useState(ReviewContent.map(tag => ({ ...tag, count: 0 })));
    const [error, setError] = useState('');

    const contactId = CONTACTITEM.CONTACT_ID;
    const flow = useContractFlow(contactId);
    const isSupporter = user.USERS_ID === flow.SUPPORTER_ID;

    const _handleComplete = async () => {
        const selectedTags = tags.filter(t => t.count === 1);
        if (review.trim() === '') return setError('내용을 입력해주세요.');
        if (selectedTags.length === 0) return setError('태그를 한 개 이상 선택해주세요.');

        await UpdateContactByReview({
            CONTACT_ID: contactId,
            REVIEW: { type: 'review', text: review, tags: selectedTags },
            CONTACTSTATUS: "평가완료"
        });

        const msgitems = [
            `${ITEM.OWNER.USERINFO.nickname}님이 작업에 대해 평가를 남기셨습니다.`,
            `${ITEM.SUPPORTER.USERINFO.nickname}님께는 24시간 이내에 등록된 계좌로 입금됩니다.`
        ];

        await CreateMessageEx3({
            CHAT_ID: ITEM.CHAT_ID,
            msgitems,
            resultitems: [{ result: review, items: selectedTags }],
            users_id: user.USERS_ID,
            read: [user.USERS_ID],
            CHAT_CONTENT_TYPE: CHATCONTENTTYPE.REVIEW
        });

        await sleep(500);
        callback();
    };

    const handleTagClick = (index) => {
        const selectedCount = tags.filter(t => t.count === 1).length;
        const updated = [...tags];

        if (updated[index].count === 1) {
            updated[index].count = 0;
        } else if (selectedCount < 3) {
            updated[index].count = 1;
        } else {
            setError('최대 3개까지 선택할 수 있습니다.');
            return;
        }

        setTags(updated);
        setError('');
    };

    return (
        <Container>
            {flow.isReviewDone && (
                <>
                    <NoticeText>
                        {isSupporter
                            ? <>의뢰자가 평가를 완료하였습니다.<br />24시간 이내에 입금되겠습니다.</>
                            : "✅ 평가가 완료되었습니다."}
                    </NoticeText>
                    {!isSupporter && (
                        <>
                            <ReviewText>{flow.reviewText}</ReviewText>
                            {flow.reviewTags.length > 0 && (
                                <Grid>
                                    {flow.reviewTags.map((tag, i) => (
                                        <Tag key={i} selected>
                                            {emojiMap[tag.content] || ''} {tag.content}
                                        </Tag>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </>
            )}

            {!flow.isReviewDone && isSupporter && (
                <NoticeText>
                    의뢰자가 평가를 완료하면,<br />등록하신 계좌로 <b>24시간 이내 입금</b>됩니다.
                </NoticeText>
            )}

            {!flow.isReviewDone && !isSupporter && (
                <>
                    <Textarea
                        placeholder="간단한 평가 한마디를 남겨주세요 예: 시간 약속을 잘 지켜주셔서 감사했어요!"
                        value={review}
                        onChange={e => setReview(e.target.value)}
                    />
                    <Grid>
                        {tags.map((tag, i) => (
                            <Tag key={i} selected={tag.count === 1} onClick={() => handleTagClick(i)}>
                                {emojiMap[tag.content] || ''} {tag.content}
                            </Tag>
                        ))}
                    </Grid>
                    {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
                    <HongButton variant="primary" fullWidth onClick={_handleComplete} style={{ marginTop: 15, marginBottom:30 }}>
                        평가완료
                    </HongButton>
                </>
            )}
        </Container>
    );
};

export default Review;
