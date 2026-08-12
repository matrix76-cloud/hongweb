import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

import { UserContext } from "../../context/User";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import { MOBILEMAINMENU } from "../../utility/screen";
import { LIFEMENU } from "../../utility/life";
import { getFontSize, isIOS } from "../../utility/fontsize";

import MobileLeisurecontainer from "../../container/main/MobileLeisurecontainer";
import MobileCommunitycontainer from "../../container/main/MobileCommunitycontainer";
import MobileAIsearchBoard from "../../components/MobileAISearchBoard";
import MobileLifeLayout from "../../screen/Layout/Layout/MobileLifeLayout";
import { imageDB } from "../../utility/imageData";
import MobileHealthcontainer from "../../container/main/MobileHealthcontainer";

const HEADER_HEIGHT = 50;
const FOOT_HEIGHT = 65;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  background-color: #fff;
  padding: 0 16px;

`;

const StickyTabButtons = styled.div`
  position: sticky;
  top: env(safe-area-inset-top, 0px);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  gap: 4px;
  padding: 10px 12px;
  height: 75px;
  background-color: white; // 스크롤 시 배경 고정
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  padding: 10px 12px;
  height: 75px;
`;

const TabButton = styled.div`
  flex: 1;
  padding: ${isIOS() ? "10px 0" : "6px 0"};
  font-size: ${() => `${getFontSize(14)}px`} !important;
  border : 1px solid #ededed;
  border-radius: 16px;
  background-color: #fff;
  color: #131313;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04); // optional
  font-family:"Pretendard-SemiBold";

  ${(props) =>
    props.active &&
    css`
 background: linear-gradient(to bottom, #fff8f2, #ffe9d6)
    `}
`;

const TabIcon = styled.img`
  width: 32px;
  height:32px;
  margin-bottom: 2px;
`;


const MobileLifepage = () => {
  const { dispatch, user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const [type, setType] = useState(tabParam || MOBILEMAINMENU.COMMUNITYMENU);


  const scrollableRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const _handleType1 = () => {
    navigate("/Mobilelife?tab=" + MOBILEMAINMENU.COMMUNITYMENU);
    setType(MOBILEMAINMENU.COMMUNITYMENU);
    scrollableRef.current?.scrollTo(0, 0); // ✅ 수정
  };
  const _handleType2 = () => {
    navigate("/Mobilelife?tab=" + MOBILEMAINMENU.LEISUREMENU);
    setType(MOBILEMAINMENU.LEISUREMENU);
    scrollableRef.current?.scrollTo(0, 0); // ✅ 수정
  };
  const _handleType3 = () => {
    navigate("/Mobilelife?tab=" + MOBILEMAINMENU.HEALTHMENU);
    setType(MOBILEMAINMENU.HEALTHMENU);
    scrollableRef.current?.scrollTo(0, 0); // ✅ 수정
  };
  const _handleType4 = () => {
    navigate("/Mobilelife?tab=" + LIFEMENU.AI);
    setType(LIFEMENU.AI);
    scrollableRef.current?.scrollTo(0, 0); // ✅ 수정
  };

  return (
    <MobileLifeLayout type={MOBILEMAINMENU.LIFEMENU}>
      <Container ref={scrollableRef}>
      <StickyTabButtons>
          <TabButton
            active={type === MOBILEMAINMENU.COMMUNITYMENU}
            onClick={_handleType1}
            bgcolor="#f28b82"
          >
            <TabIcon src={imageDB.lifehome} alt="일상생활" />
            {MOBILEMAINMENU.COMMUNITYMENU}
          </TabButton>
          <TabButton
            active={type === MOBILEMAINMENU.LEISUREMENU}
            onClick={_handleType2}
            bgcolor="#fbbc04"
          >
            <TabIcon src={imageDB.lifetour} alt="여가생활" />
            {MOBILEMAINMENU.LEISUREMENU}
          </TabButton>
          <TabButton
            active={type === MOBILEMAINMENU.HEALTHMENU}
            onClick={_handleType3}
            bgcolor="#34a853"
          >
            <TabIcon src={imageDB.lifehealth} alt="건강생활" />
            {MOBILEMAINMENU.HEALTHMENU}
          </TabButton>
          {/* <TabButton
            active={type === LIFEMENU.AI}
            onClick={_handleType4}
            bgcolor="#ffa500"
          >
            <TabIcon src={imageDB.lifeai} alt="홍여사 AI" />
            {LIFEMENU.AI}
          </TabButton> */}
        </StickyTabButtons>

        {type === MOBILEMAINMENU.COMMUNITYMENU && <MobileCommunitycontainer />}
        {type === MOBILEMAINMENU.LEISUREMENU && <MobileLeisurecontainer />}
        {type === MOBILEMAINMENU.HEALTHMENU && <MobileHealthcontainer />}
        {type === LIFEMENU.AI && <MobileAIsearchBoard />}
        {/* 건강생활 타입 추가 시 아래에 해당 컴포넌트 연결 */}
      </Container>
    </MobileLifeLayout>
  );
};

export default MobileLifepage;