import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { updateDoc, doc } from 'firebase/firestore';
import { UserContext } from '../../../context/User';
import { db } from '../../../api/config';
import { usePolicyNews } from '../../../hooks/usePolicyNews';
import { Row } from '../../../common/Row';
import { getFontSize } from '../../../utility/fontsize';

const MobilePolicyNewsView = () => {
  const { user } = useContext(UserContext);
  const { news, loading } = usePolicyNews(user?.USERS_ID);

  const [filter, setFilter] = useState("종합");

  const fullMinisterList = ["종합", ...new Set(news.map(n => n.ministerCode || "기타"))];

  const filteredNews = filter === "종합"
    ? news
    : news.filter(n => n.ministerCode === filter);


  useEffect(() => {
    return () => {
      if (user?.USERS_ID) {
        updateDoc(doc(db, "USERS", user.USERS_ID), {
          lastReadPolicyNewsAt: Date.now(),
        });
      }
    };
  }, []);

  return (
    <Wrapper>
      <TopSection>

        <MinisterScroll>
          {fullMinisterList.map((dept) => (
            <MinisterTab
              key={dept}
              selected={filter === dept}
              onClick={() => setFilter(dept)}
            >
              {dept}
            </MinisterTab>
          ))}
        </MinisterScroll>

        <Source>
          자료출처 정책브리핑 www.korea.kr
        </Source>
      </TopSection>

      <NewsList>
        {filteredNews.map((item, index) => (
          <NewsCard key={item.newsId} index={index}>
            <Row style={{ alignItems: "flex-start" }}>
              {item.imageUrl && <NewsImage src={item.imageUrl} alt="뉴스 이미지" />}

              <Title>{item.title}</Title>
            </Row>

            <AITag>AI가 요약한 내용</AITag>

            <Summary>{item.summaryShort}</Summary>
            <DateText>{dayjs(item.approveDate, "MM/DD/YYYY HH:mm:ss").format("YYYY.MM.DD HH:mm")} {item.ministerCode}</DateText>
          </NewsCard>
        ))}
      </NewsList>
    </Wrapper>
  );
};

export default MobilePolicyNewsView;

// 스타일
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 100px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const TopSection = styled.div`
  padding: 16px;
`;


const MinisterScroll = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const MinisterTab = styled.div`
  padding: 6px 4px;
  font-size: 15px;
  font-weight: ${({ selected }) => (selected ? 700 : 400)};
  color: ${({ selected }) => (selected ? '#111' : '#999')};
  border-bottom: ${({ selected }) => (selected ? '2px solid #FF7E19' : '2px solid transparent')};
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
`;


const NewsList = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NewsCard = styled.div`
  position: relative;
  background: #fff;
  padding: 20px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transform: ${({ index }) => (index % 2 === 0 ? 'rotate(-0.3deg)' : 'rotate(0.3deg)')};
  transform-origin: top left;
  margin-bottom: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: repeating-linear-gradient(
      45deg,
      #f0f0f0,
      #f0f0f0 2px,
      #fff 2px,
      #fff 4px
    );
    opacity: 0.4;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: repeating-linear-gradient(
      -45deg,
      #f0f0f0,
      #f0f0f0 2px,
      #fff 2px,
      #fff 4px
    );
    opacity: 0.4;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const NewsImage = styled.img`
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
  image-rendering: -webkit-optimize-contrast;
`;

const NewBadge = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  background: #FF3B30;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 600;
  font-family : Pretendard-SemiBold;
  display:flex;
  justify-content : flex-start;
  align-items : center;
  padding :0px 5px;
`;

const Summary = styled.div`
  position: relative;

  line-height: 1.6;
  color: #444;
  background-color: #fffaf5;
  border-left: 4px solid #FF7E19;
  border-radius: 6px;
  padding: 12px 14px;
  box-shadow: 0 0 0 1px #f0f0f0;
  margin-top: 8px;
  white-space: normal;
    font-size: ${() => getFontSize(14)}px !important;

  &::before {
    content: "\1F4AC"; /* 💬 말풍선 */
    position: absolute;
    left: -26px;
    top: 6px;
    font-size: 16px;
  }
`;

const DateText = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #aaa;
  margin-top:5px;
`;

const AITag = styled.div`

  display: inline-block;
  background-color: #FF7e19; /* or #007AFF for 파란색 */
  color: #fff;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  margin-bottom: 8px;
  margin-top:10px;
`

const Source = styled.div`
  display : flex;
  justify-content : flex-end;
  font-size: ${() => getFontSize(12)}px !important;
  color: #aaa;
  margin-top:20px;



`