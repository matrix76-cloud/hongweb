import React, { Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import { WORKNAME, WORKPOLICY } from "../../utility/work";
import { imageDB } from "../../utility/imageData";
import { getFontSize } from "../../utility/fontsize";
import { UserContext } from "../../context/User";
import { Toaster, toast } from 'sonner';

const HEADER_HEIGHT = 50;
const FOOT_HEIGHT = 70;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  background-color: #fcfbf7;
  padding: 16px;
  box-sizing: border-box;
    gap: 24px; // 요소 간 여백 줌 (ex: 말풍선-캘린더, 캘린더-버튼)
`;

const Header = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  z-index: 10;
  display: flex;
  font-size: ${getFontSize(22)}px !important;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: ${getFontSize(20)}px !important;
  margin-right: 12px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: ${getFontSize(20)}px !important;
  font-family: Pretendard-SemiBold;
  color: #131313;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border-radius: 12px;
  background-color: #f8f5ee; // 기본 고정
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    background-color: #e0f0ff; // 호버 시 파란 계열로 변경
  }
`;

const CategoryImage = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
`;

const CategoryLabel = styled.div`
  font-size: ${getFontSize(14)}px !important;
  font-family: Pretendard-Regular;
  color: #333;
  text-align: center;
`;

const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house, bgcolor: "#f9f9f9" },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business, bgcolor: "#f9f9f9" },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move, bgcolor: "#f9f9f9" },
  { name: WORKNAME.STORECLEAN, img: imageDB.storeclean, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ERRAND, img: imageDB.help, bgcolor: "#c6e2ff" },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook, bgcolor: "#c6e2ff" },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping, bgcolor: "#c6e2ff" },
  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool, bgcolor: "#f4f4f4" },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare, bgcolor: "#f4f4f4" },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent, bgcolor: "#f4f4f4" },
  { name: WORKNAME.LESSON, img: imageDB.lesson, bgcolor: "#f4f4f4" },
  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare, bgcolor: "#fff1c6" },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital, bgcolor: "#fff1c6" },
  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital, bgcolor: "#f9f9f9" },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CARRYLOAD, img: imageDB.carry, bgcolor: "#c6e2ff" },
  { name: WORKNAME.AIRCON, img: imageDB.aircon, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CURTAIN, img: imageDB.curtain, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ASSEMBLE, img: imageDB.assemble, bgcolor: "#f9f9f9" },
];

const MobileCategorycontainer = ({ containerStyle }) => {
  const navigate = useNavigate();

  const { dispatch, user } = useContext(UserContext);
    const [totalset, setTotalset] = useState(0);
  const handleSelect = async (checkmenu) => {

    const latitude = user.USERINFO?.latitude;
    const longitude = user.USERINFO?.longitude;

    if (!latitude || !longitude) {
      toast.warning("위치 정보가 필요합니다. 위치를 먼저 설정해주세요.");
      return;
    }



 

    let totalset = 0;

    if (checkmenu == WORKNAME.HOMECLEAN) {
      setTotalset(WORKPOLICY.HOMECLEAN);
      totalset = WORKPOLICY.HOMECLEAN;
    } else if (checkmenu == WORKNAME.BUSINESSCLEAN) {
      setTotalset(WORKPOLICY.BUSINESSCLEAN);
      totalset = WORKPOLICY.BUSINESSCLEAN;
    } else if (checkmenu == WORKNAME.MOVECLEAN) {
      setTotalset(WORKPOLICY.MOVECLEAN);
      totalset = WORKPOLICY.MOVECLEAN;
    } else if (checkmenu == WORKNAME.FOODPREPARE) {
      setTotalset(WORKPOLICY.FOODPREPARE);
      totalset = WORKPOLICY.FOODPREPARE;
    } else if (checkmenu == WORKNAME.GOOUTSCHOOL) {
      setTotalset(WORKPOLICY.GOOUTSCHOOL);
      totalset = WORKPOLICY.GOOUTSCHOOL;
    } else if (checkmenu == WORKNAME.BABYCARE) {
      setTotalset(WORKPOLICY.BABYCARE);
      totalset = WORKPOLICY.BABYCARE;
    } else if (checkmenu == WORKNAME.LESSON) {
      setTotalset(WORKPOLICY.LESSON);
      totalset = WORKPOLICY.LESSON;
    } else if (checkmenu == WORKNAME.PATIENTCARE) {
      setTotalset(WORKPOLICY.PATIENTCARE);
      totalset = WORKPOLICY.PATIENTCARE;
    } else if (checkmenu == WORKNAME.GOHOSPITAL) {
      setTotalset(WORKPOLICY.GOHOSPITAL);
      totalset = WORKPOLICY.GOHOSPITAL;
    } else if (checkmenu == WORKNAME.RECIPETRANSMIT) {
      setTotalset(WORKPOLICY.RECIPETRANSMIT);
      totalset = WORKPOLICY.RECIPETRANSMIT;
    } else if (checkmenu == WORKNAME.GOSCHOOLEVENT) {
      setTotalset(WORKPOLICY.GOSCHOOLEVENT);
      totalset = WORKPOLICY.GOSCHOOLEVENT;
    } else if (checkmenu == WORKNAME.GODOGHOSPITAL) {
      setTotalset(WORKPOLICY.GODOGHOSPITAL);
      totalset = WORKPOLICY.GODOGHOSPITAL;
    } else if (checkmenu == WORKNAME.GODOGWALK) {
      setTotalset(WORKPOLICY.GODOGWALK);
      totalset = WORKPOLICY.GODOGWALK;
    } else if (checkmenu == WORKNAME.CARRYLOAD) {
      setTotalset(WORKPOLICY.CARRYLOAD);
      totalset = WORKPOLICY.CARRYLOAD;
    } else if (checkmenu == WORKNAME.ERRAND) {
      setTotalset(WORKPOLICY.ERRAND);
      totalset = WORKPOLICY.ERRAND;
    } else if (checkmenu == WORKNAME.SHOPPING) {
      setTotalset(WORKPOLICY.SHOPPING);
      totalset = WORKPOLICY.SHOPPING;
    } else if (checkmenu == WORKNAME.AIRCON) {
      setTotalset(WORKPOLICY.AIRCON);
      totalset = WORKPOLICY.AIRCON;
    } else if (checkmenu == WORKNAME.STORECLEAN) {
      setTotalset(WORKPOLICY.STORECLEAN);
      totalset = WORKPOLICY.STORECLEAN;
    } else if (checkmenu == WORKNAME.CURTAIN) {
      setTotalset(WORKPOLICY.CURTAIN);
      totalset = WORKPOLICY.CURTAIN;
    } else if (checkmenu == WORKNAME.ASSEMBLE) {
      setTotalset(WORKPOLICY.ASSEMBLE);
      totalset = WORKPOLICY.ASSEMBLE;
    } else if (checkmenu == WORKNAME.SHOPCLEAN) {
      setTotalset(WORKPOLICY.SHOPCLEAN);
      totalset = WORKPOLICY.SHOPCLEAN;
    } else if (checkmenu == WORKNAME.COMPUTER) {
      setTotalset(WORKPOLICY.COMPUTER);
      totalset = WORKPOLICY.COMPUTER;
    } else if (checkmenu == WORKNAME.FAMILYEVENT) {
      setTotalset(WORKPOLICY.FAMILYEVENT);
      totalset = WORKPOLICY.FAMILYEVENT;
    } else if (checkmenu == WORKNAME.OFFICE) {
      setTotalset(WORKPOLICY.OFFICEEVENT);
      totalset = WORKPOLICY.OFFICEEVENT;
    } else {
      setTotalset(WORKPOLICY.OFFICEEVENT);
      totalset = WORKPOLICY.OFFICEEVENT;
    }


    navigate("/Mobileregist", { state: { WORKTYPE: checkmenu, WORKTOTAL: totalset } });

  }

  const _handleprev = () => {
    navigate(-1);
  };

  return (
    <>
      <Header>
        <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
        <Title>어떤 일을 요청하시겠어요?</Title>
      </Header>
      <Container style={containerStyle}>
        <Grid>
          {WorkItems.map((item, idx) => (
            <CategoryCard key={idx} onClick={() => handleSelect(item.name)} >
              <CategoryImage src={item.img} alt={item.name} />
              <CategoryLabel>{item.name}</CategoryLabel>
            </CategoryCard>
          ))}
        </Grid>

        <Toaster position="bottom-right" richColors />
      </Container>
    </>
  );
};

export default MobileCategorycontainer;