import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.css";
import styled from "styled-components";
import SeniorJobCard from "./SeniorJobCard";
import { getFontSize } from "../utility/fontsize";
import { Row } from "../common/Row";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

SwiperCore.use([Autoplay]);

const Container = styled.div`
  width: ${({ width }) => width}px;
  overflow-x: hidden;
  margin-top: 30px;
`;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-Bold;
  color: #111;
`;

const SlideGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 8px;
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

const IndexNumber = styled.span`
  color: #ff6699;
  font-weight: bold;
  cursor: pointer;
  font-size: ${() => getFontSize(13)}px !important;
`;

const SeniorJobSwiperSection = ({ width, jobs }) => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const onSeeAll = () => {
        navigate("/MobileResult", {
            state: { NAME: "중장년 일자리 전체보기", TYPE: "senior" },
        });
    };

    // 6개씩 묶는 chunking 함수
    const chunkArray = (arr, size) => {
        const chunked = [];
        for (let i = 0; i < arr.length; i += size) {
            chunked.push(arr.slice(i, i + size));
        }
        return chunked;
    };

    const chunkedJobs = chunkArray(jobs, 3);

    const totalSlides = chunkedJobs.length;

    const swiperRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    return (
        <Container width={width}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                <SectionTitle style={{ marginBottom: "unset" }}>
                    중장년 일자리 ({jobs.length}건)
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
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={16}
                loop={false}
                grabCursor={true}
                touchStartPreventDefault={false}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // ⭐ 핵심
            >
                {chunkedJobs.map((group, index) => (
                    <SwiperSlide key={index}>
                        <SlideGroup>
                            {group.map((job) => (
                                <SeniorJobCard key={job.id} job={job} compact={true} jobId={job.id}  />
                            ))}
                        </SlideGroup>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default SeniorJobSwiperSection;
