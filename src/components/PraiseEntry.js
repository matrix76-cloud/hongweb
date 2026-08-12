// 라이프 탭 내 '동네 가게 응원하기' 진입 배너 컴포넌트
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getFontSize } from '../utility/fontsize';
import { imageDB } from '../utility/imageData';

const PraiseEntryBanner = () => {
    const navigate = useNavigate();

    return (
        <BannerContainer onClick={() => navigate('/MobileConfess')}>
            <Icon src={imageDB.praiseentry} alt="동네가게 아이콘" />
            <TextWrapper>
                <Title>우리 동네 가게를 응원해요</Title>
                <SubText>좋은 가게를 발견했다면 따뜻한 한마디로 칭찬해주세요</SubText>
            </TextWrapper>
        </BannerContainer>
    );
};

export default PraiseEntryBanner;

// styled-components
const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  background: #fff6e5;
  border: 1px solid #ffd699;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 16px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(17)}px !important;
  font-weight: bold;
  color: #333;
`;

const SubText = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #666;
  margin-top: 4px;
`;
