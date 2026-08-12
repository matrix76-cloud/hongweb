// 🧭 IntroCarousel - 전체화면 인트로 안내 슬라이드
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FiXCircle } from 'react-icons/fi';

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

const slides = [
    // {
    //     title: '앱 이름이 바뀌었어요',
    //     subtitle: '이제는 구해줘 알바! 더 직관적이고 깔끔하게!',
    //     image: imageDB.IntroCarousel1,
    //     framed: false
  // },

    {
      title: 'AI가 이미지도, 자기소개도 대신 만들어줘요',
      subtitle: '지원서만 간단히 작성하면, AI가 자연스러운 자기소개와 어울리는 이미지까지 자동 생성해드려요',
      image: imageDB.IntroCarousel4,
      framed: false
    },
    {
      title: '구해줘 AI에게 무엇이든 물어보세요',
      subtitle: '궁금한 건 언제든 구해줘 AI가 빠르게 도와드려요.',
      image: imageDB.IntroCarousel1,
      framed: false
    },
    {
      title: 'UI 전면 리뉴얼',
      subtitle: '지원자의 상세정보를 현재 위치 기준으로 가장 가까운 위치로 표시하고 보다 알기쉽게 구성하였어요!',
      image: imageDB.IntroCarousel2,
      framed: false,
      width: "90%"
    },
    // {
    //   title: '채팅 기능 고도화',
    //   subtitle: '일거리 매칭 시작에서 계약 완료 평가까지 모두 한 화면에서 할수 있도록 구성했어요!',
    //   image: imageDB.IntroCarousel3,
    //   framed: false,
  
    // },
    // {
    //   title: '영상채팅 기능 추가',
    //   subtitle: '영상 채팅 기능을 추가해 이제 믿을수 있는 사람에게 일을 맡길 수 있도록 했어요!',
    //   image: imageDB.IntroCarousel6,
    //   framed: false,
    //   width: "90%"

    // },
    // {
    //     title: '자기소개 영상 등록',
    //     subtitle: '알바를 원하는 사람은  자기소개영상을 등록함으로 보다 적극적으로 자신을 어필할수 있도록 했어요!',
    //     image: imageDB.IntroCarousel5,
    //     framed: false,
    //     width : '80%'
    // },

];

const IntroCarousel = () => {
    const [show, setShow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationTrigger, setAnimationTrigger] = useState(0);

    useEffect(() => {
        const seen = localStorage.getItem('Carousel0721');
        const today = new Date().toISOString().split('T')[0];
        if (seen !== 'permanent' && seen !== today) {
            setShow(true);
        }
    }, []);

    const handleCloseToday = () => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('Carousel0721', today);
        setShow(false);
    };

    const handleNeverShowAgain = () => {
        localStorage.setItem('Carousel0721', 'permanent');
        setShow(false);
    };

    if (!show) return null;

    return (
        <Overlay>
            <Swiper
                onSlideChange={(swiper) => {
                    setCurrentIndex(swiper.realIndex);
                    setAnimationTrigger(prev => prev + 1); // ✅ 이걸로 강제 리렌더 트리거
                }}
                slidesPerView={1}
                loop={false}
              
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={idx}>
                        <FadeInSlide>
                            <DotNav>
                                {slides.map((_, i) => (
                                    <Dot key={i} active={i === currentIndex} />
                                ))}
                            </DotNav>
            
                            <AnimatedTitleText key={`title-${animationTrigger}`} delay={0.2}>
                                {slide.title}
                            </AnimatedTitleText>

                            <AnimatedSubText key={`sub-${animationTrigger}`} delay={0.6}>
                                {slide.subtitle}
                            </AnimatedSubText>

                          {
                        slide.width !== undefined ? (<Image src={slide.image} alt={slide.title} framed={slide.framed}
                          style={{width:"80%"}} />) : (<Image src={slide.image} alt={slide.title} framed={slide.framed} />)
                            }
                       

                            <TextButtonRow>
                                <TextButton onClick={handleNeverShowAgain}>다시 보지 않기</TextButton>

                                <TextButton onClick={handleCloseToday}><FiXCircle size={16} style={{ marginRight: 6 }} /> 닫기</TextButton>
                         
                            </TextButtonRow>
                        </FadeInSlide>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Overlay>
    );
};

export default IntroCarousel;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const AnimatedTitleText = styled.div`
  font-size: ${() => getFontSize(26)}px !important;
  font-family : Pretendard-Bold;
  margin-bottom: 8px;
  margin-top: 50px;

  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: ${({ delay }) => delay || 0}s;
`;
const AnimatedSubText = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  color: #888;
  margin-bottom: 20px;
  text-align: center;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: ${({ delay }) => delay || 0}s;
`;


const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eee;
  margin-bottom: 12px;
`;





const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
`;

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  height: 100vh;
  box-sizing: border-box;
  width :100%;
`;

const DotNav = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Dot = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: ${({ active }) => (active ? '#1A1E27' : '#D9D9D9')};
  width: ${({ active }) => (active ? '16px' : '6px')};
  transition: all 0.3s;
`;



const Title = styled.div`
  font-size: ${() => getFontSize(24)}px !important;
  font-family : Pretendard-Bold;
  margin-bottom: 8px;
  margin-top: 50px;

  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.2s;
`;
const Sub = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #888;
  margin-bottom: 20px;
  text-align: center;

  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.6s;
`;

const Image = styled.img`
    width: 100%;
    object-fit: cover;
    margin-bottom: 32px;
    border-radius: ${({ framed }) => (framed ? '24px' : '0')};
    box-shadow: ${({ framed }) => (framed ? '0 6px 16px rgba(0,0,0,0.15)' : 'none')};
    height:450px;

`;

const TextButtonRow = styled.div`
  display: flex;
  justify-content : space-between;
  width : 100%;
  margin-top: auto;
`;

const TextButton = styled.div`
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  padding: 8px 12px;
  transition: all 0.2s;
  &:hover {
    background: #e1e1e1;
  }
`;

const FadeInSlide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  height: 100vh;
  box-sizing: border-box;
  width: 100%;
  animation: ${fadeIn} 0.5s ease;
`;
