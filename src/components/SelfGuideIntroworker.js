import React, { useContext, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";
import { distanceFunc } from "../utility/region";
import MobileWorkerPopup from "../modal/MobileWorkerPopup";

const SelfGuideIntroworker = ({ list = [] }) => {
  const { user } = useContext(UserContext);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  console.log("list", list);

  if (!list.length) return null;

  return (
    <CardListContainer>
      <CardList>
        {list.map((item, idx) => (
          <CardWrapper key={idx} onClick={() => {
            if (item.videoUrl) {
              setSelectedVideoId(item.id || idx); // 고유 ID 또는 인덱스
          }}}>
            {item.videoUrl && selectedVideoId === (item.id || idx) ? (
              <VideoPlayer src={item.videoUrl} controls autoPlay />
            ) : item.videoThumbnail ? (
              <ThumbnailImage src={item.videoThumbnail} alt="썸네일" />
              ) : (
                  <>
                    <ThumbnailPlaceholder>
                      자기소개 영상 등록하기
                      <ThumbnailSubText>
                        자신을 어필할수 있는 영상을 올려주세요
                      </ThumbnailSubText>
                    </ThumbnailPlaceholder>
         
                  
                  </>
   
            )}
            <Info>
              <NameRow>
                <Name>
                  {item.chatName} ({item.age} / {item.gender === 'male' ? '남성' : item.gender === 'female' ? '여성' : '기타'})
                </Name>
              </NameRow>
              <Tags>
                {item.tags?.map((tag, i) => (
                  <Tag key={i}>#{tag}</Tag>
                ))}
              </Tags>
            </Info>
          </CardWrapper>
        ))}
      </CardList>
      {selectedWorker && (
        <MobileWorkerPopup
          data={selectedWorker}
          containerStyle={{ height: 'calc(100vh - 40px)' }}
          onChat={() => {
            // 원하는 행동 정의
          }}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </CardListContainer>
  );
};

export default SelfGuideIntroworker;


const VideoPlayer = styled.video`
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
`;

const CardListContainer = styled.div`
  padding: 8px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
`;

const ThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: #000;
  color: #ff7e19;
  display: flex;
  flex-direction : column;
  align-items: center;
  justify-content: center;
  font-size: ${() => getFontSize(20)}px !important;
  font-weight: 700;
  font-family : Pretendard-SemiBold;
  border-radius: 12px 12px 0 0;
`;

const ThumbnailSubText = styled.div`
  width: 100%;
  background: #000;
  color: #ff7e19;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 700;
  font-family : Pretendard-Regular;

`;

const Info = styled.div`
  padding: 12px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Name = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 600;
`;

const Tags = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.div`
  background: #eee;
  color: #333;
  font-size: ${() => getFontSize(12)}px !important;
  padding: 4px 8px;
  border-radius: 8px;
`;
