// MobileWorkerPopup.jsx
import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';


import { WORKNAME } from '../utility/work';
import { imageDB } from '../utility/imageData';
import HongButton from '../components/HongButton';
import { Row } from '../common/Row';


const PopupContainer = styled.div`
  position: fixed;
  bottom: 50px;
  width: 100%;
  background: #fff;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);

  padding: 24px 16px 20px;
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
  width: 90%;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-Bold;
`;

const Info = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  color: #555;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const CloseIcon = styled.div`
  font-size: ${() => getFontSize(30)}px !important;
  color: #888;
  cursor: pointer;
  z-index: 11;
`;

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const TagBadge = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: ${() => getFontSize(14)}px !important;
  color: #333;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`;

const WorkItems = [
    { name: WORKNAME.HOMECLEAN, img: imageDB.house },
    { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business },
    { name: WORKNAME.MOVECLEAN, img: imageDB.move },
    { name: WORKNAME.STORECLEAN, img: imageDB.storeclean },
    { name: WORKNAME.ERRAND, img: imageDB.help },
    { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe },
    { name: WORKNAME.FOODPREPARE, img: imageDB.cook },
    { name: WORKNAME.SHOPPING, img: imageDB.shopping },
    { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool },
    { name: WORKNAME.BABYCARE, img: imageDB.babycare },
    { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent },
    { name: WORKNAME.LESSON, img: imageDB.lesson },
    { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare },
    { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital },
    { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital },
    { name: WORKNAME.GODOGWALK, img: imageDB.dog },
    { name: WORKNAME.CARRYLOAD, img: imageDB.carry },
    { name: WORKNAME.AIRCON, img: imageDB.aircon },
    { name: WORKNAME.CURTAIN, img: imageDB.curtain },
    { name: WORKNAME.ASSEMBLE, img: imageDB.assemble },
];


function getKoreanGender(gender) {
    if (!gender) return '미지정';
    const lower = gender.toLowerCase();
    if (lower === 'male') return '남성';
    if (lower === 'female') return '여성';
    return '기타';
}


export default function MobileWorkerMiniPopup({ data, onClose, onChat, onDetail }) {
    if (!data) return null;

    return (
        <PopupContainer>
 

            <Header>
                <Row>
                    <ProfileImage src={data.profileImg || imageDB.defaultProfile} alt="프로필" />
                    <Title>{data.chatName || '아르바이트 지원자'}</Title>
                </Row>
      
                <CloseIcon onClick={onClose}>×</CloseIcon>
            </Header>

            <Info>
                {getKoreanGender(data.gender)} / {data.ageGroup || '30대'}<br />
                {data.intro || '간단한 청소, 정리 가능합니다.'}
            </Info>

            <TagWrapper>
                {(data.tags || []).map(tag => {
                    const matched = WorkItems.find(w => w.name === tag);
                    return (
                        <TagBadge key={tag}>
                            {matched?.img && <img src={matched.img} alt="" />}
                            {tag}
                        </TagBadge>
                    );
                })}
            </TagWrapper>

            <Row style={{marginBottom: 16, marginTop: 16, justifyContent: 'space-between', width:'90%'}}>
          <HongButton
            size={'small'}
                    style={{ marginTop: 16, height: 35, width: '48%' }}
                    onClick={() => onChat?.(data)}
                >
                    채팅하기
                </HongButton>
          <HongButton
            size={'small'}
                    style={{ marginTop: 16, height: 35, width: '48%' }}
                    onClick={() => onDetail?.(data)}
                >
                    프로필보기
                </HongButton>

            </Row>

        </PopupContainer>
    );
}
