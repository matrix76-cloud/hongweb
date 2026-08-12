import React, { useContext, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";
import { distanceFunc } from "../utility/region";
import MobileWorkerPopup from "../modal/MobileWorkerPopup";

const SelfIntroworker = ({ list = [] }) => {
  const { user } = useContext(UserContext);

  const [selectedWorker, setSelectedWorker] = useState(null);


  if (!list.length) return null;

  return (
    <CardListContainer>
      <CardList>
        {list.map((item, idx) => (
          <CardWrapper  key={idx} onClick={() => setSelectedWorker(item)}>
            {item.videoUrl ? (
              <VideoContainer>
                <VideoPlayer
                  src={item.videoUrl}
                  muted
                  autoPlay
                  playsInline
                  loop
                  controls
                />
              </VideoContainer>
            ) : null}
            <Info>
              {/* <SubInfo>
                성별 / 연령: {item.gender === 'male' ? '남성' : item.gender === 'female' ? '여성' : '기타'} / {item.age || '연령 미입력'}
              </SubInfo>
              <SubInfo>
                {item.address || '주소 미입력'}
              </SubInfo>
              {user?.USERINFO?.latitude && user?.USERINFO?.longitude && item.latitude && item.longitude && (
                <SubInfo>📍 내 위치로부터 약 {distanceFunc(user.USERINFO.latitude, user.USERINFO.longitude, item.latitude, item.longitude).toFixed(1)}km</SubInfo>
              )} */}
              <NameRow>
                <Name>{item.chatName} ({item.age} / {item.gender === 'male' ? '남성' : item.gender === 'female' ? '여성' : '기타'})</Name>
         
              </NameRow>
              <Tags>
                {item.tags?.map((tag, i) => (
                  <Tag key={i}>#{tag}</Tag>
                ))}
              </Tags>
              {/* <Description>{item.description}</Description> */}
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

export default SelfIntroworker;


const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;  // 간격 넉넉하게
  justify-content: space-between;
`;

const CardWrapper = styled.div`
  width: calc(50% - 8px);  // ✅ 한 줄에 2개 카드
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;

  @media (max-width: 360px) {
    width: 100%;  // 작은 화면에선 1열
  }
`;
const ThumbnailImage = styled.img`
  width: 100%;
  aspect-ratio: 9/16;
  object-fit: cover;
  background: #000;
`;

const ScrollContainer = styled.div`
  height: 100dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
`;

const CardListContainer = styled.div`
  padding: 8px;
`;



const VideoContainer = styled.div`
  width: 100%;
  height: 220px;           // ✅ 고정 높이로 제한
  overflow: hidden;
  border-radius: 12px;
  background: #000;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: auto;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  border-radius: 0;
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

const IntroBadge = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

const SubInfo = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #555;
  margin-top: 4px;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #555;
`;
