import React,{useState, useEffect} from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, Link, useNavigate} from "react-router-dom";
import styled from 'styled-components';

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

const Container = styled.div`
  width: 93%;
  margin :20px auto;
`
const SlickSliderComponent = ({width ,images}) => {
    const settings = {
      dots: true, // 슬라이더 하단에 점을 표시
      infinite: true, // 무한 루프 설정
      speed: 500, // 슬라이더 전환 속도
      slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
      slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
      autoplay: true, // 자동 슬라이드
      autoplaySpeed: 2000, // 자동 슬라이드 속도 (밀리초)
      swipeToSlide: true, // 슬라이드 간 스와이프
      adaptiveHeight: true, // Adjust slider height
    };
  
    return (
     <Container width={width}>
        <Slider {...settings}>
          {
            images.map((data)=>(
              <div style={{height:"100px"}}>
              <img src= {data} style={{height:"100px", width:"330px"}}/>   
              </div>
            ))
          }
       
       
        </Slider>
      </Container>
    );
  };
  
  export default SlickSliderComponent;
  