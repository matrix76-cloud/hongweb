import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.css"; // 필요 시 추가

import styled from "styled-components";
import SeniorJobCard from "./SeniorJobCard";
import { getFontSize } from "../utility/fontsize";
import { Row } from "../common/Row";
import { useNavigate } from "react-router-dom";


SwiperCore.use([Autoplay]);

const Container = styled.div`
  width: ${({ width }) => width}px;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  margin-top:30px;
`

const Section = styled.div`
  margin-top: 30px;
  
`;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-Bold;
  color: #111;
  margin-bottom: 12px;
`;

const Box = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;

`;

const SlideCard = styled(SwiperSlide)`
  padding-right: 12px;  // 또는 margin-right
  box-sizing: border-box;
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



const SeniorJobSwiperSection = ({ width, jobs }) => {
    
    const navigate = useNavigate();
    
    const onSeeAll = () => {
        navigate("/MobileResult", { state: { NAME: "중장년 일자리 전체보기", TYPE: "senior" } });
    }

    return (
        <Container width={width} >
      
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <SectionTitle style={{ marginBottom: "unset" }}>
            중장년 일자리 ({jobs.length}건)
            </SectionTitle>

            {/* 전체보기 텍스트 */}
            <SeeAllText onClick={onSeeAll}>전체보기</SeeAllText>
            </Row>

           
            <Swiper
                slidesPerView={1.5}
                spaceBetween={12}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                grabCursor={true}
                touchStartPreventDefault={false}
                threshold={10} // ⭐ 클릭 vs 스와이프 구분 핵심!
            >
            {jobs.map((job) => (
                <SwiperSlide key={job.id}>
                <SeniorJobCard job={job} compact={true} jobId={job.id} />
                </SwiperSlide>
            ))}
            </Swiper>
    

        </Container>
    );
};

export default SeniorJobSwiperSection;
