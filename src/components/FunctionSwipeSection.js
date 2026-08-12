import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.css";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CONVENIENCEMENU, LIFEMENU, TOURISTMENU } from "../utility/life";
import { imageDB } from "../utility/imageData";

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
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 10px;
  height: 100px;
  width: 100%;
  max-width: 240px;
`;


const SmallLabel = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: ${({ color }) => color || "#ff7a00"};
  font-family: Pretendard-SemiBold;
  margin: 10px 20px 4px 10px;
`;

const MainText = styled.div`
  font-size: ${() => getFontSize(17)}px !important;
  font-family: Pretendard-Bold;
  color: ${({ color }) => color || "#111"};
  margin: 6px 20px 12px 10px; // top을 6px 정도 줘서 아래로 살짝 내림
  z-index: 2;
  position: relative;
`;

const DescBox = styled.div`
  background: white;
  padding: 12px 16px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #555;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),   /* 메인 그림자: 연하게 */
    0 2px 4px rgba(0, 0, 0, 0.04);    /* 서브 그림자: 부드럽게 퍼짐 */
  font-family: Pretendard-SemiBold;
  letter-spacing: -0.9px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 240px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;

  padding-bottom: 16px; /* ✅ 아래에 여백 줘서 잘림 방지 */
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
    
      const _handleCourse = () => {
    
        navigate("/Mobileleisurecontent", { state: { name:  TOURISTMENU.TOURCOURSE } });
    
      }
    
      const _handleFestival = () => {
    
        navigate("/Mobileleisurecontent", { state: { name: TOURISTMENU.TOURFESTIVAL } });
    
      }
    
      const _handleConcert = () => {
    
        navigate("/Mobileleisurecontent", { state: { name: TOURISTMENU.TOUREVENT } });
    
      }
    
      const _handleCamping = () => {
    
        navigate("/Mobileleisurecontent", { state: { name: CONVENIENCEMENU.CONVENIENCECAMPING } });
    
      }
    
    const functionCards = [
        {
            bg: "linear-gradient(135deg, #FFA647, #FF7A00)", // 진한 오렌지
            label: "생활 기능",
            labelColor: "#FFFFFF",
            title: (
                <>
                    냉장고<br />
                    정리하는 날
                </>
            ),
            titleColor: "#FFFFFF",
            icon: imageDB.freeze,
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
            icon: imageDB.cook,
            desc: "냉장고 속 재료를 관리해드려요!",
            onClick: () =>
                navigate("/Mobileconfigcontent", {
                    state: { NAME: LIFEMENU.RECIPE, TYPE: "" },
                }),
        },

        {
            bg: "linear-gradient(135deg, #F5F7FA, #C3D7F5)",
            label: "여행 기능",
            labelColor: "#3F51B5",
            icon: imageDB.convenience,
            title: (
                <>
                    추천 관광<br />
                    코스
                </>
            ),
            titleColor: "#111",
            desc: "AI가 국내 명소를 추천해드려요!",
            onClick: _handleCourse,
        },
        {
            bg: "linear-gradient(135deg, #FFE082, #FFCA28)",
            label: "여행 기능",
            labelColor: "#EF6C00",
            icon: imageDB.region5,
            title: (
                <>
                    문화 축제<br />
                    정보
                </>
            ),
            titleColor: "#111",
            desc: "요즘 뜨는 축제 정보 알려드려요!",
            onClick: _handleFestival,
        },
        {
            bg: "linear-gradient(135deg, #E1BEE7, #CE93D8)",
            label: "여행 기능",
            labelColor: "#6A1B9A",
            icon: imageDB.tourfestival,
            title: (
                <>
                    공연 행사<br />
                    정보
                </>
            ),
            titleColor: "#111",
            desc: "가까운 공연/행사를 추천해드려요!",
            onClick: _handleConcert,
        },
        {
            bg: "linear-gradient(135deg, #A5D6A7, #81C784)",
            label: "여행 기능",
            icon: imageDB.camping,
            labelColor: "#2E7D32",
            title: (
                <>
                    캠핑장<br />
                    정보
                </>
            ),
            titleColor: "#111",
            desc: "자연 속 힐링! 캠핑 정보 알려드려요",
            onClick: _handleCamping,
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
        // {
        //     bg: "linear-gradient(135deg, #FFA647, #FF7A00)", // 진한 오렌지
        //     label: "생활 기능",
        //     labelColor: "#FFFFFF",
        //     title: (
        //         <>
        //             특가 상품<br />
        //             모아봤어요
        //         </>
        //     ),
        //     titleColor: "#FFFFFF",
        //     desc: "근처 편의점 1+1 상품과 할인 정보를 알려드려요!",
        //     onClick: () =>
        //         navigate("/Mobileconfigcontent", {
        //             state: { NAME: LIFEMENU.SALE, TYPE: "" },
        //         }),
        // },
        // {
        //     bg: "linear-gradient(135deg, #B3E5FC, #81D4FA)", // 하늘색 → 블루
        //     label: "생활 기능",
        //     labelColor: "#01579B",
        //     title: (
        //         <>
        //             여행<br />
        //             정보 드릴게요
        //         </>
        //     ),
        //     titleColor: "#444",
        //     desc: "가까운 국내 여행지와 축제를 알려드릴게요!",
        //     onClick: () => navigate("/MobileLeisure"),
        // },
    //     {
    //         bg: "linear-gradient(135deg, #E1BEE7, #CE93D8)", // 연보라 → 딥퍼플
    //         label: "생활 기능",
    //         labelColor: "#6A1B9A",
    //         title: (
    //             <>
    //                 오늘의<br />
    //                 운세 보기
    //             </>
    //         ),
    //         titleColor: "#333",
    //         desc: "띠별 운세와 오늘의 운을 AI가 알려드려요!",
    //         onClick: () =>
    //             navigate("/Mobileconfigcontent", {
    //                 state: { NAME: LIFEMENU.FORTUNE, TYPE: "" },
    //             }),
    //     },
    //     {
    //         bg: "linear-gradient(135deg, #FFF9C4, #FFE082)", // 밝은 노랑 → 오렌지 느낌
    //         label: "생활 기능",
    //         labelColor: "#F57F17",
    //         title: (
    //             <>
    //                 우리 동네<br />
    //                 가게를 응원해요
    //             </>
    //         ),
    //         titleColor: "#333",
    //         desc: "동네 가게에 응원 메시지를 보내보세요!",
    //         onClick: () =>
    //                 navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.CONFESSCONFIG, TYPE: "" } }),
    //     }
     ];
      

    return (
        <Container width={width}>
            <SectionTitle>AI 생활 기능 추천</SectionTitle>
            <Swiper
                onSwiper={(swiper) => setSwiperInstance(swiper)}
                ref={swiperRef}
                slidesPerView={2}
                spaceBetween={12}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                grabCursor={true}
                touchStartPreventDefault={false}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {functionCards.map((card, idx) => (
                    <SwiperSlide key={idx} onClick={card.onClick}>
                        <CardWrapper>
                            <FunctionCard bg={card.bg}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <SmallLabel color={card.labelColor}>{card.label}</SmallLabel>
                                    {card.icon && (
                                        <img
                                            src={card.icon}
                                            alt="card-icon"
                                            style={{
                                                position: "absolute",
                                                top: 10,           // ⬅️ 상단 기준으로 약간 띄우기
                                                right: 10,         // ⬅️ 오른쪽 여백
                                                width: 34,
                                                height: 34, }}
                                        />
                                    )}
                                </div>
                                <MainText color={card.titleColor}>{card.title}</MainText>
                            </FunctionCard>
                            <DescBox>{card.desc}</DescBox>
                        </CardWrapper>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default FunctionSwipeSection;
