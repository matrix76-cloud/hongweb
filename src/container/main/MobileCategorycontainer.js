import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { WORKNAME, WORKPOLICY } from "../../utility/work";
import { imageDB } from "../../utility/imageData";
import { getFontSize } from "../../utility/fontsize";
import { UserContext } from "../../context/User";
import { Toaster, toast } from 'sonner';

const HEADER_HEIGHT = 50;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  background-color: #f7f8fa; /* 🔧 은은한 배경 */
  padding: 12px;
  box-sizing: border-box;
`;

const Header = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0; right: 0;
  height: ${HEADER_HEIGHT}px;
  background-color: #fff;
  display: flex; align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  z-index: 10;
  font-size: ${getFontSize(22)}px !important;
`;

const Title = styled.div`
  font-size: ${getFontSize(20)}px !important;
  font-family: Pretendard-SemiBold;
  color: #131313;
  padding-left:5px;
`;

/* 🔧 3열 고정 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const CategoryCard = styled.button`
  appearance: none;
  border: none;
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  padding: 14px 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px;
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.06),
    0 6px 14px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform .08s ease, box-shadow .12s ease;

  &:active { transform: scale(0.96); }
  &:hover  { box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.08); }
`;

const IconBadgeColor = styled.div`
  width: 60px; height: 60px;
  border-radius: 50%;
  background: ${({ tone = "#eef2f7" }) => tone};
  display: grid; place-items: center;
`;

const CategoryImage = styled.img`
  width: 38px; height: 38px; object-fit: contain;
  filter: saturate(0.92) contrast(1.02);
`;

const CategoryLabel = styled.div`
  font-size: ${getFontSize(13)}px !important;
  font-family: Pretendard-Medium;
  color: #222;
  letter-spacing: -0.2px;
  text-align: center;
  line-height: 1.25;
`;

// 🔧 카테고리별 배경 톤 맵핑
const palette = {
  default: "#eef2f7",
  clean: "#EAF5FF",
  care: "#FCEFEF",
  move: "#F3F7EA",
  cook: "#F7F0FF",
};

const toneFor = (name) => {
  if (name.includes("청소")) return palette.clean;
  if (name.includes("간병") || name.includes("병원")) return palette.care;
  if (name.includes("이사") || name.includes("운반") || name.includes("가구")) return palette.move;
  if (name.includes("요리") || name.includes("식사")) return palette.cook;
  return palette.default;
};

const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move },
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

const MobileCategorycontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [totalset, setTotalset] = useState(0);

  const handleSelect = async (checkmenu) => {
    const latitude = user.USERINFO?.latitude;
    const longitude = user.USERINFO?.longitude;

    if (!latitude || !longitude) {
      toast.warning("위치 정보가 필요합니다. 위치를 먼저 설정해주세요.");
      return;
    }

    let _total = WORKPOLICY[checkmenu] || WORKPOLICY.OFFICEEVENT;
    setTotalset(_total);
    navigate("/Mobileregist", { state: { WORKTYPE: checkmenu, WORKTOTAL: _total } });
  };

  const _handleprev = () => navigate(-1);

  return (
    <>
      <Header>
        <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
        <Title>어떤 일을 요청하시겠어요?</Title>
      </Header>
      <Container style={containerStyle}>
        <Grid>
          {WorkItems.map((item, idx) => (
            <CategoryCard key={idx} onClick={() => handleSelect(item.name)}>
              <IconBadgeColor tone={toneFor(item.name)}>
                <CategoryImage src={item.img} alt={item.name} />
              </IconBadgeColor>
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
