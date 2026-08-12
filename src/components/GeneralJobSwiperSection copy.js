import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.css";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { Row } from "../common/Row";
import GeneralJobCard from "./GeneralJobCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

SwiperCore.use([Autoplay]);

const Container = styled.div`
  width: ${({ width }) => width}px;
  margin-top: 30px;
  overflow-x: hidden;
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

const SlideGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 2열
  gap: 8px 8px;

  
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

  // 6개씩 그룹으로 나누기
  const chunkedJobs = Array.from(
    { length: Math.ceil(jobs.length / 4) },
    (_, i) => jobs.slice(i * 4, i * 4 + 4)
  );

  const totalSlides = chunkedJobs.length;


  return (
    <Container width={width}>
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
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
          ><IndexNumber>{activeIndex + 1} </IndexNumber>/ {totalSlides}</SlideIndex>
          <SeeAllText onClick={onSeeAll}>전체보기</SeeAllText>
        </RightArea>
      </Row>

      <Swiper
        onSwiper={(swiper) => setSwiperInstance(swiper)} // ✅ 여기!
        slidesPerView={1}
        loop={false}
        grabCursor={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // ⭐ 핵심
      >
        {chunkedJobs.map((group, idx) => (
          <SwiperSlide key={idx}>
            <SlideGroup>
              {group.map((job) => (
                <GeneralJobCard key={job.id} job={job} jobId={job.id}   compact />
              ))}
            </SlideGroup>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default GeneralJobSwiperSection;
