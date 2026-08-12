import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import { imageDB } from '../utility/imageData';
import '../screen/css/common.css'
import { getFontSize } from '../utility/fontsize';
import { LIFEMENU } from '../utility/life';
import { CONFIGMOVE } from '../utility/screen';



SwiperCore.use([Autoplay]);


const Container = styled.div`
  width: ${({ width }) => width}px;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
`
const BannerCard = styled.div`
  background: ${({ color }) => color || '#f0f0f0'};
  border-radius: 6px;
  padding: 16px;
  height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  position: relative;
   z-index: 1; /* ✅ 고정 */
  width: 100%;
`;

const Icon = styled.div`
  font-size: 28px;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div`
  font-weight: 700;
 font-size: ${() => getFontSize(12)}px !important;
  font-family: 'Pretendard-Light';
  color: #fff;
`;

const Subtitle = styled.div`
    font-size: ${() => getFontSize(16)}px !important;
    color: #fff;
    font-family: 'Pretendard-SemiBold';
    line-height: 1.4;
    font-weight: 600;
    letter-spacing: -0.2px;
`;

const PageDots = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? '#1A1E27' : '#D9D9D9')};
  transition: background-color 0.3s;
`;



const BannerSlide = ({ width, items, bgcolor }) => {

    const navigate = useNavigate();

    const [currentCard, setCurrentCard] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [refresh, setRefresh] = useState(false);

    const swiperRef = useRef(null);


    useEffect(() => {
        // ✅ mount되고 나서도 autoplay 강제로 발동
        if (swiperRef.current) {
            setTimeout(() => {
                swiperRef.current.autoplay?.start();
                console.log("✅ autoplay 강제 실행됨");
            }, 300); // 늦게 호출해야 WebView에서 잘 먹힘
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh(r => !r);
        }, 5000); // 3초마다 슬라이더 상태를 리렌더
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCard(prev => (prev + 1) % banners.length);
        }, 1000); // 1초마다 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, []);


    const _handlemove = (goal) => {
        if (goal == 'attendance') {
            navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.ATTENDANCE, TYPE: "" }}); 
        } else if (goal == 'rullet') {
            navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.RULLET, TYPE: "" }}); 
        } else if (goal == 'race') {
            navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.RACE, TYPE: "" } });
        }
    }


    const settings = {
        dots: false, // 슬라이더 하단에 점을 표시
        infinite: true, // 무한 루프 설정
        speed: 500, // 슬라이더 전환 속도
        slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
        slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
        autoplay: true, // 자동 슬라이드
        autoplaySpeed: 8000, // 자동 슬라이드 속도 (밀리초)
        swipeToSlide: true, // 슬라이드 간 스와이프
        adaptiveHeight: true, // Adjust slider height
        pauseOnHover: false,
        pauseOnFocus: false,
        pauseOnDotsHover: false,
    };



    const banners = [
        {
            image: imageDB.attendancebanner,
            title: '출석리워드',
            subtitle: '출석은 하루 한 번! 출석도장 찍고 포인트 받자!',
            color: '#2563EB',   // 블루 (가독성 좋고 선명)
            goal:'attendance'
        },
        {
            image: imageDB.rulletbanner,
            title: '오늘의 룰렛',
            subtitle:'매일 룰렛 돌리고 행운을 점쳐보세요!',
            color: '#10B981',   // 에메랄드 (보상/행운 느낌)
            goal : 'rullet',
        },
    ];
      
      
    return (
        <Container width={width} bgcolor={bgcolor}>
            <Swiper
                modules={[Autoplay]}
                loop={true}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                observer={true}
                observeParents={true}
                onSlideChange={(swiper) => {
                    setCurrentIndex(swiper.realIndex); // ✅ 실 인덱스 추적
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    swiper.autoplay?.start(); // 1차 시도
                }}>
                {
                    banners.map((banner, index = 0) => {

                        return (
                            <SwiperSlide>
                                <BannerCard color={banner.color} onClick ={()=>{_handlemove(banner.goal)}}>
                               
                                    <TextGroup>
                                        <Title>{banner.title}</Title>
                                        <Subtitle>{banner.subtitle}</Subtitle>
                                    </TextGroup>
                                    <PageDots>
                                        {banners.map((_, idx) => (
                                            <Dot key={idx} active={idx === currentIndex} />
                                        ))}
                                    </PageDots>

                                    <img src={banner.image} alt={banner.title} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                </BannerCard>
                            </SwiperSlide>
                        )
                    }
                    )
                }

            </Swiper>
        </Container>
    );
};

export default BannerSlide;
