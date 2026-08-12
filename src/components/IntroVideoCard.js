import React, { useState } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { BetweenRow } from '../common/Row';
import IntroVideoModal from '../modal/IntroVideoModal';
import MobileWorkerPopup from '../modal/MobileWorkerPopup';
import { imageDB } from '../utility/imageData';

const IntroVideoCard = ({ worker, handleChat }) => {
    const [activeVideoUrl, setActiveVideoUrl] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);

    const handlePlay = (e, videoUrl) => {
        e.stopPropagation();
        setActiveVideoUrl(videoUrl);
    };

    if (!worker) return null;

    const tagList = worker.tags || [];
    const displayedTags = tagList.slice(0, 2);
    const hasMoreTags = tagList.length > 2;

    return (
        <>
            <Card onClick={() => setSelectedWorker(worker)}>
                <ImageSection>
                    <ThumbnailImage src={worker.videoThumbnail || imageDB.hongladywebtoon} alt="썸네일" />
                    <PlayOverlay>
                        <PlayButton onClick={(e) => handlePlay(e, worker.videoUrl)}>▶</PlayButton>
                    </PlayOverlay>
                </ImageSection>

                <InfoSection>
                    <BetweenRow>
                        <Name>{worker.chatName}</Name>
                        <Meta>{worker.gender === 'male' ? '남성' : worker.gender === 'female' ? '여성' : '-'} / {worker.age}</Meta>
                    </BetweenRow>

                    <CategoryList>
                        {displayedTags.map((cat, idx) => (
                            <CategoryTag key={idx}>{cat}</CategoryTag>
                        ))}
                        {hasMoreTags && <CategoryTag>+{tagList.length - 2}</CategoryTag>}
                    </CategoryList>
                </InfoSection>
            </Card>

            {activeVideoUrl && (
                <IntroVideoModal
                    videoUrl={activeVideoUrl}
                    onClose={() => setActiveVideoUrl(null)}
                />
            )}

            {selectedWorker && (
                <MobileWorkerPopup
                    data={selectedWorker}
            containerStyle={{ height: 'calc(100vh - 40px)' }}
                    onChat={() => handleChat(selectedWorker)}
                    onClose={() => setSelectedWorker(null)}
                />
            )}
        </>
    );
};

export default IntroVideoCard;

// 스타일 컴포넌트

const Card = styled.div`
  flex: 0 0 auto;
  width: 140px;
  border-radius: 6px;
  overflow: hidden;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;  // ✅ 기존 3/4보다 짧아짐 (더 낮게 하고 싶으면 5/6도 가능)
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// ✅ 재생 버튼을 안정적으로 중앙에 고정
const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; // 부모 클릭은 살리고 버튼만 보이게
`;

const PlayButton = styled.div`
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: ${() => getFontSize(20)}px !important;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  pointer-events: auto; // 버튼 자체는 클릭되게
`;

const InfoSection = styled.div`
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 600;
  color: #111;
`;

const Meta = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #666;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const CategoryTag = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  background: #E6F0FF;
  color: #333;
  border-radius: 9999px;
  padding: 2px 6px;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1px solid #ddd; // 또는 accent 컬러
`;
