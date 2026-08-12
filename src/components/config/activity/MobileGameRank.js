// 📦 MobileGameRank.jsx 리팩터링 버전

import React, { memo, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Row, Column } from "../../../common/Row";
import { getFontSize } from "../../../utility/fontsize";
import LottieAnimation from "../../../common/LottieAnimation";
import { imageDB } from "../../../utility/imageData";
import MobileGameRankContent from "./MobileGameRankContent";
import { UserContext } from "../../../context/User";
import ShareButton from "../../ShareButton";

const Container = styled.div`
  background-color: #fff;
  overflow-x: hidden;
  height: 100vh;
  position: relative; /* ✅ 추가 */
`;

const RewardButton = styled.div`

  right: 16px;
  background: #FFF;
  border : 1px solid #FF7E19;
  padding: 6px 20px;
  border-radius: 5px;
  font-size: ${getFontSize(14)}px;
  font-family : Pretendard-SemiBold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color :#FF7E19;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  z-index: 9999;

`;





const RewardPopup = styled.div`
  position: absolute;
  top: 48px;
  right: 16px;
  background: #fff;
  border: 1px solid #ffdb9b;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  padding: 16px;
  width: 260px;
  font-size: ${getFontSize(13)}px;
  line-height: 1.6;
  z-index: 99;
`;

const UserStatBox = styled.div`
  width: 100%;
  background: #f1f9ff;
  border-radius: 12px;
  padding: 16px;
  line-height: 1.6;
  font-size: ${getFontSize(14)}px;
  color: #333;
  margin-top: 12px;
`;

const getMedalEmoji = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2 || rank === 3) return '🥈';
  if (rank >= 4 && rank <= 10) return '🥉';
  return '';
};

const MobileGameRank = memo(() => {
  const [showReward, setShowReward] = useState(false);
  const [items, setItems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  

  // useEffect(() => {
  //   async function FetchData() {
  //     try {
  //       const res = await fetch("/dummy_game_ranking_data.json");
  //       const dummy = await res.json();
  //       setItems(dummy);
  //       setCurrentloading(false);
  //     } catch (err) {
  //       console.error("더미 데이터 불러오기 실패", err);
  //     }
  //   }
  //   FetchData();
  // }, []);

  return (
    <Container>
      <Row style={{ justifyContent: 'flex-end', paddingRight: 20, paddingBottom: 10, paddingTop:10 }}>
        
        <ShareButton
          text="🏆 도전 알바 나의 랭킹을 공유합니다!"
          url={`https://honglady.co.kr/share?type=game&uid=${user?.USERS_ID}`}

          style={{
            background: '#FF6A00',
            padding: '6px 20px',
            borderRadius: '5px',
            fontSize: `${getFontSize(14)}px`,
            fontFamily: 'Pretendard-SemiBold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 9999,
            marginRight: '5px',
          }}
        >
          랭킹 공유하기
        </ShareButton>

  


        {/* <RewardButton onClick={() => setShowReward(!showReward)}>보상</RewardButton> */}
      </Row>
 
      {/* {showReward && (
        <RewardPopup>
          👵 <strong>매주 목요일 22:00 순위 확정</strong><br /><br />
          전국 순위 100등까지 들면 커피쿠폰(컴포즈)을 보내 드려요. 매주 진행 합니다.
        </RewardPopup>
      )} */}


      {currentloading ? (
        <LottieAnimation
          containerStyle={{ marginTop: 40 }}
          animationData={imageDB.loading}
          width="50px"
          height="50px"
        />
      ) : (
        <MobileGameRankContent  />
      )}
    </Container>
  );
});

export default MobileGameRank;