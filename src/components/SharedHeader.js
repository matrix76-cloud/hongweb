// SharedHeader.js

import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize'; // 프로젝트 폰트 유틸에 맞춰 조정
import { imageDB } from '../utility/imageData';

const HeaderContainer = styled.div`
  background: #FFFBEA;
  padding: 12px 16px;
  border-bottom: 1px solid #FFD796;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${getFontSize(16)}px;
  font-family: 'Pretendard-SemiBold';
  color: #FE6625;
  flex-direction: column;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border-radius: 50%;
  margin-bottom:10px;
  text-align:center;
`;

const SharedHeader = () => {
    return (
        <HeaderContainer>
          <Icon src={imageDB.hongladywebtoon} alt="구해줘 알바" />
          <div>이 콘텐츠는 구해줘 알바 <br /> 앱에서 따뜻하게 공유되었습니다</div>
        </HeaderContainer>
    );
};

export default SharedHeader;
