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
import { PiX } from 'react-icons/pi';

const Container = styled.div`
  width: 100%;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
`


const Box = styled.div`
position: relative;
width: 130px;
height: 100%;

display: flex;
justify-content: center;
align-items: center;

&::before {

  content : attr(data-label);

  position: absolute;
  top: 100px;
  left: 10px;
  background-color: #141413a1;
  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}
` 


const SlickSliderComponent = ({width ,images}) => {
    const settings = {
      dots: false, // 슬라이더 하단에 점을 표시
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
            images.map((data, index)=>(
              <Box 
              data-label = {index+ 1 + "/" + images.length}
              >
                  <img src= {data} style={{height:"130px", width:'100%'}}/>   
              </Box>
            ))
          }
      
        </Slider>
      </Container>
    );
  };
  
  export default SlickSliderComponent;
  