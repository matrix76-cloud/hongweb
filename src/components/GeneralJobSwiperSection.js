import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.css";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { Row } from "../common/Row";
import GeneralJobCard from "./GeneralJobCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MainGeneralJobCard from "./MainGeneralJobCard";

SwiperCore.use([Autoplay]);

const Container = styled.div`
  width: ${({ width }) => width}px;
  margin-top: 30px;
  overflow-x: hidden;
`;

/* ✅ 크림톤 섹션 배경 */
const CreamSurface = styled.div`
  background: linear-gradient(180deg, #fff7e1 0%, #fff3d6 100%);
  border: 1px solid #ffe6a7;
  padding: 12px;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(255, 199, 95, 0.12) inset, 0 2px 8px rgba(0,0,0,0.04);
`;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-Bold;
  color: #111;
  margin-bottom: 12px;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SlideIndex = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #999;
  font-family: Pretendard-SemiBold;
`;

const SeeAllText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #555;
    text-decoration: underline;
  }
`;

// const SlideGroup = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr); /* 2열 */
//   gap: 10px 10px;
// `;

const SlideGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
  width: 100%;
   `;

const IndexNumber = styled.span`
  color: #ff6699;
  cursor: pointer;
  font-size: ${() => getFontSize(13)}px !important;
`;

const GeneralJobSwiperSection = ({ width, jobs }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const onSeeAll = () => {
    navigate("/MobileResult", {
      state: { NAME: "일반 일자리 전체보기", TYPE: "general" },
    });
  };

  // 4개씩 그룹
  const chunkedJobs = Array.from(
    { length: Math.ceil(jobs.length / 4) },
    (_, i) => jobs.slice(i * 4, i * 4 + 4)
  );
  const totalSlides = chunkedJobs.length;

  return (
    <Container width={width}>
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionTitle style={{ marginBottom: "unset" }}>
          일반 일자리 ({jobs.length}건)
        </SectionTitle>
        <RightArea>
          <SlideIndex
            onClick={() => {
              if (swiperInstance && activeIndex + 1 < totalSlides) {
                swiperInstance.slideTo(activeIndex + 1);
              }
            }}
          >
            <IndexNumber>{activeIndex + 1}</IndexNumber> / {totalSlides}
          </SlideIndex>
          <SeeAllText onClick={onSeeAll}>전체보기</SeeAllText>
        </RightArea>
      </Row>

      {/* ✅ 카드 묶음에 크림톤 배경 적용 */}
      <CreamSurface>
        <Swiper
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          slidesPerView={1}
          loop={false}
          grabCursor={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {chunkedJobs.map((group, idx) => (
            <SwiperSlide key={idx}>
              <SlideGroup>
                {group.map((job) => (
                  <MainGeneralJobCard key={job.id} job={job} jobId={job.id} compact />
                ))}
              </SlideGroup>
            </SwiperSlide>
          ))}
        </Swiper>
      </CreamSurface>
    </Container>
  );
};

export default GeneralJobSwiperSection;
