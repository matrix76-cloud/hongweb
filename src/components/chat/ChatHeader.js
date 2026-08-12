// 📁 ChatHeader.js (최종 리팩터링: 사용자 입장에 따라 역할/문구/태그 분기)
import React from 'react';
import styled from 'styled-components';
import { imageDB, Seekimage } from '../../utility/imageData';
import { Row, FlexstartRow } from '../../common/Row';
import { distanceFunc } from '../../utility/region';
import { extractPriceFromWorkInfo } from '../../utility/work';
import { getFontSize } from "../../utility/fontsize";

const ChatHeader = ({ ITEM, user, _handleprofile, expanded, setExpanded, isVirtual }) => {
  const isSupporter = user.USERS_ID === ITEM.SUPPORTER_ID;
  const isOwner = user.USERS_ID === ITEM.OWNER_ID;

  return (
    <Enter>
      {expanded && (
        <Row style={{ paddingTop: 10 }}>
          <Row style={{ width: "15%" }}>
            <ThumbCircle>
              {isVirtual ? (
                <img
                  src={isSupporter ? ITEM.OWNER.USERINFO.userimg : ITEM.SUPPORTER.USERINFO.userimg}
                  alt="상대 프로필"
                  style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <img
                  src={Seekimage(ITEM.INFO.WORKTYPE)}
                  alt="작업 썸네일"
                  style={{
                    width: '65px',
                    height: '65px'
                  }}
                />
              )}
            </ThumbCircle>
          </Row>

          <Row style={{ width: "85%", justifyContent: "flex-start", paddingLeft: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", paddingLeft: "10px", lineHeight: 1.9 }}>
         
                <FlexstartRow style={{ justifyContent: "space-between", flex: 1 }}>
                  {!isVirtual && <StoreName>{ITEM.INFO.WORKTYPE}</StoreName>}
                  <ProfileBtn onClick={_handleprofile}>
                    {isVirtual
                      ? "상대 프로필 보기"
                      : isSupporter
                        ? "의뢰자 프로필 보기"
                        : "지원자 프로필 보기"}
                  </ProfileBtn>
                </FlexstartRow>
     

              <StoreAddr>
                {ITEM.OWNER.USERINFO.address_name.slice(0, 25)}
                {ITEM.OWNER.USERINFO.address_name.length > 25 ? '...' : null}
              </StoreAddr>
              <StorePrice>
                <StoreDistance>
                  거리 {parseInt(distanceFunc(user.USERINFO.latitude, user.USERINFO.longitude, user.USERINFO.latitude, user.USERINFO.longitude) / 1000)}km
                </StoreDistance>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', width: 16, height: 16 }}>
                    <img src={imageDB.ic_common_money_16} />
                  </div>
                  <div style={{ display: 'flex', color: '#1A1E28' }}>
                    {extractPriceFromWorkInfo(ITEM.INFO.WORK_INFO)}
                  </div>
                </div>
              </StorePrice>
            </div>
          </Row>
        </Row>
      )}
      <Row style={{ width: "90%", justifyContent: "flex-end", padding: "6px 10px 0 0" }}>
        <CollapseToggle onClick={() => setExpanded(!expanded)}>
          {expanded ? "▲ 접기" : "▼ 자세히 보기"}
        </CollapseToggle>
      </Row>
    </Enter>
  );
};

export default ChatHeader;

const Enter = styled.div`
  text-align: left;
  padding: 65px 15px 10px;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  background-color: white;
  width: 100%;
  flex-direction: column;
  z-index: 2;
`;

const ThumbCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: #F5F6F9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StoreName = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: bold;
`;

const StoreAddr = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #96989C;
  display: flex;
  flex-direction: row;
`;

const StoreDistance = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #FE6625;
`;

const StorePrice = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

const ProfileBtn = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 10px;
  margin-left: 10px;
  white-space: nowrap;
`;

const CollapseToggle = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #999;
  text-align: right;
  cursor: pointer;
`;
