import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartRow } from "../../../common/Row";
import { UserContext } from "../../../context/User";
import { imageDB } from "../../../utility/imageData";
import MobileHeaderLayer from "../../MobileHeaderLayer";
import ReactPlayer from "react-player";
import { getFontSize } from "../../../utility/fontsize";

const Container = styled.div`
  scrollbar-width: none;
  overflow-x: hidden;
  overscroll-behavior: none;
  height: calc(100vh - 50px);
  touch-action: pan-y;
  background: #fff;
`;

const EventBox = styled.div`
  width: 95%;
  cursor: pointer;
  transition: 0.2s all;
  margin: 12px auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  padding-bottom: 16px;
`;

const txtWrap = {
  padding: '18px 20px 24px',
  lineHeight: 2
};

const EventTitle = {
  background: 'linear-gradient(to right, #ff7f50, #ff5733)',
  color: "white",
  textAlign: "center",
  padding: '10px 12px',
  borderRadius: '8px',
  fontSize: getFontSize(16),  // ✅ 여기 변경!
  fontFamily: "Pretendard-SemiBold",
  marginTop: "20px",
  marginBottom: '20px',
  cursor: "pointer",
  border: "none",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
};

const EventDesc = {
  color: '#444',
  fontSize: '15px',
  lineHeight: 1.6
};

const EventUse = {
  color: '#777',
  fontSize: '14px',
  fontStyle: "italic",
  marginTop: 8
};

const windowWidth = window.innerWidth;

const MobileUseView = ({ containerStyle }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const _handleprev = () => {
    navigate(-1);
  };

  useLayoutEffect(() => { }, []);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Container style={containerStyle}>
      <MobileHeaderLayer name={'구해줘 알바 100% 사용해보기 TIP'} callback={_handleprev} />

      <FlexstartRow style={{ flexWrap: "wrap", width: '100%', marginTop: 20 }}>

        {/* 특가 기능 */}
        <EventBox>
          <div style={txtWrap}>
            <div style={EventTitle}>💸 특가 상품 기능</div>
            <div style={EventDesc}>
              매일 바뀌는 마트 특가 상품을 한눈에!<br />
              홈플러스, 이마트, 쿠팡 특가 비교하고 가족과 찜/공유까지 가능해요.
            </div>
            <div style={EventUse}>
              홈쇼핑 가격 비교를 앱 하나로 쉽게!
            </div>
            <div style={{ marginTop: 20 }}>
              <ReactPlayer
                url="https://www.youtube.com/watch?v=QOOQLEXwrgw"
                controls
                width={windowWidth - 60}
                height="280px"
              />
            </div>
          </div>
        </EventBox>

        {/* 냉장고 기능 */}
        <EventBox>
          <div style={txtWrap}>
            <div style={EventTitle}>🧊 냉장고 관리 기능</div>
            <div style={EventDesc}>
              냉장고 속 재료를 등록하면<br />
              꺼낼 날짜 알림과 요리 추천까지 자동으로!
            </div>
            <div style={EventUse}>
              냉장고 관리의 새로운 시대를 열어보세요.
            </div>
            <div style={{ marginTop: 20 }}>
              <ReactPlayer
                url="https://www.youtube.com/watch?v=_Gih2KzN_y8"
                controls
                width={windowWidth - 60}
                height="280px"
              />
            </div>
          </div>
        </EventBox>

        {/* 도전 홍여사 */}
        <EventBox>
          <div style={txtWrap}>
            <div style={EventTitle}>🎮 도전 알바! 전국 랭킹 커피 이벤트</div>
            <div style={EventDesc}>
              2분 게임으로 커피 받자!<br />
              매주 목요일 순위 확정 ☕
            </div>
            <div style={EventUse}>
              지금 바로 플레이하고 순위 진입 도전!
            </div>
            <div style={{ marginTop: 20 }}>
              <ReactPlayer
                url="https://www.youtube.com/watch?v=8F8GV4Jj3v4"
                controls
                width={windowWidth - 60}
                height="280px"
              />
            </div>
          </div>
        </EventBox>

      </FlexstartRow>
    </Container>
  );
};

export default MobileUseView;
