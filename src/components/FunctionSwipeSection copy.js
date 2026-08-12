import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.css";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LIFEMENU } from "../utility/life";

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
  margin-bottom: 16px;
`;

const FunctionCard = styled.div`
  background: ${({ bg }) => bg || "#fff"};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  height: 180px;
  position: relative;
  overflow: hidden;

   width: 100%;
  max-width: 240px;
  flex-shrink: 0;
    padding-bottom: 12px; // ✅ 하단 내용이 눌리는 거 방지
    


`;

const SmallLabel = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: ${({ color }) => color || "#ff7a00"};
  font-family: Pretendard-SemiBold;
  margin: 20px 20px 4px 20px;
`;

const MainText = styled.div`
  font-size: ${() => getFontSize(17)}px !important;
  font-family: Pretendard-Bold;
  color: ${({ color }) => color || "#111"};
  margin: 6px 20px 12px 20px; // top을 6px 정도 줘서 아래로 살짝 내림
  z-index: 2;
  position: relative;
`;

const DescBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: white;
  padding: 12px 16px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #555;
  display: flex;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  z-index: 1;
  font-family: Pretendard-SemiBold;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.08); // ✅ 위쪽에 부드럽게 그라데이션 그림자
`;

const FunctionSwipeSection = ({ width }) => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);


    useEffect(() => {
        if (swiperInstance) {
            setTimeout(() => {
                swiperInstance.update();
            }, 100); // 다른 뷰 갔다가 돌아올 때 렌더 안정화 시간 확보
        }
    }, [swiperInstance, width]);

    const FeatureFunc = (item) => {
        
    if (item.name == LIFEMENU.TOUR) {
        navigate('/MobileLeisure')
    } else {
        navigate('/Mobileconfigcontent', { state: { NAME: item.name, TYPE: '' } })
    }


    }
    
    const functionCards = [
        {
            bg: "linear-gradient(135deg, #2B2B2B, #4A4A4A)", // 다크 그레이
            label: "생활 기능",
            labelColor: "#FFD700",
            title: (
                <>
                    냉장고<br />
                    정리하는 날
                </>
            ),
            titleColor: "#FFFFFF",
            desc: "유통기한 지난 재료를 AI가 알려드려요!",
            onClick: () =>
                navigate("/Mobileconfigcontent", {
                    state: { NAME: LIFEMENU.FREEZE, TYPE: "" },
                }),
        },
        {
            bg: "linear-gradient(135deg, #4DA9F9, #1976D2)", // 블루 → 딥블루
            label: "생활 기능",
            labelColor: "#004080",
            title: (
                <>
                    레시피<br />
                    추천 드릴게요
                </>
            ),
            titleColor: "#FFFFFF",
            desc: "냉장고 속 재료로 가능한 요리를 추천해드릴게요!",
            onClick: () =>
                navigate("/Mobileconfigcontent", {
                    state: { NAME: LIFEMENU.RECIPE, TYPE: "" },
                }),
        },
        // {
        //     bg: "linear-gradient(135deg, #FBE0C3, #FFD8A9)", // 베이지 → 오렌지톤
        //     label: "생활 기능",
        //     labelColor: "#8B4513",
        //     title: (
        //         <>
        //             수분 보충<br />
        //             시간이에요
        //         </>
        //     ),
        //     titleColor: "#111",
        //     desc: "오늘 마신 물을 기록하고 목표도 체크해보세요!",
        //     onClick: () =>
        //         navigate("/Mobileconfigcontent", {
        //             state: { NAME: LIFEMENU.WATER, TYPE: "" },
        //         }),
        // },
        {
            bg: "linear-gradient(135deg, #FFA647, #FF7A00)", // 진한 오렌지
            label: "생활 기능",
            labelColor: "#FFFFFF",
            title: (
                <>
                    특가 상품<br />
                    모아봤어요
                </>
            ),
            titleColor: "#FFFFFF",
            desc: "근처 편의점 1+1 상품과 할인 정보를 알려드려요!",
            onClick: () =>
                navigate("/Mobileconfigcontent", {
                    state: { NAME: LIFEMENU.SALE, TYPE: "" },
                }),
        },
        {
            bg: "linear-gradient(135deg, #B3E5FC, #81D4FA)", // 하늘색 → 블루
            label: "생활 기능",
            labelColor: "#01579B",
            title: (
                <>
                    여행<br />
                    정보 드릴게요
                </>
            ),
            titleColor: "#111111",
            desc: "가까운 국내 여행지와 축제를 알려드릴게요!",
            onClick: () => navigate("/MobileLeisure"),
        },
        {
            bg: "linear-gradient(135deg, #E1BEE7, #CE93D8)", // 연보라 → 딥퍼플
            label: "생활 기능",
            labelColor: "#6A1B9A",
            title: (
                <>
                    오늘의<br />
                    운세 보기
                </>
            ),
            titleColor: "#111111",
            desc: "띠별 운세와 오늘의 운을 AI가 알려드려요!",
            onClick: () =>
                navigate("/Mobileconfigcontent", {
                    state: { NAME: LIFEMENU.FORTUNE, TYPE: "" },
                }),
        },
        {
            bg: "linear-gradient(135deg, #FFF9C4, #FFE082)", // 밝은 노랑 → 오렌지 느낌
            label: "생활 기능",
            labelColor: "#F57F17",
            title: (
                <>
                    우리 동네<br />
                    가게를 응원해요
                </>
            ),
            titleColor: "#111",
            desc: "동네 가게에 응원 메시지를 보내보세요!",
            onClick: () =>
                    navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.CONFESSCONFIG, TYPE: "" } }),
        }
    ];
      

    return (
        <Container width={width}>
            <SectionTitle>AI 생활 기능 추천</SectionTitle>
            <Swiper
                onSwiper={(swiper) => setSwiperInstance(swiper)}
                ref={swiperRef}
                slidesPerView={1.7}
                spaceBetween={12}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                grabCursor={true}
                touchStartPreventDefault={false}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {functionCards.map((card, idx) => (
                    <SwiperSlide key={idx} onClick={card.onClick}>
                        <FunctionCard bg={card.bg}>
                            <SmallLabel color={card.labelColor}>{card.label}</SmallLabel>
                            <MainText color={card.titleColor}>{card.title}</MainText>
                            <DescBox>{card.desc}</DescBox>
                        </FunctionCard>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default FunctionSwipeSection;
