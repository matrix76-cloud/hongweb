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
import LazyImage from './LasyImage';
import ButtonEx from './ButtonEx';
import { LIFEMENU } from '../utility/life';
import { CONFIGMOVE } from '../utility/screen';
import LazyImageex from './LasyImageex';
import PCBanner from '../components/PCBanner';
import { FlexstartColumn } from './Column';
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
  width: 100%;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  padding: 15px;

`
// background :#ec8260;

const MassBox = styled.div`

  background: #fff;
  color :  #131313;
  font-size : 13px;
  font-family : 'Pretendard-Regular';
  font-weight:500;
  align-items: flex-start;
  display: flex !important;
  justify-content: flex-start;
  flex-direction: column;
  width:90% !important;
  margin: 20px;
  z-index: 2;
  overflow-x: auto;
  border-radius: 10px;
  padding :15px 10px;
  cursor: pointer;
  min-height: 170px;
  transition: transform 1s ease, box-shadow 0.1s ease;




`



const PCLifeSwipeex = ({width ,items, bgcolor, color, containerStyle}) => {

    const navigate = useNavigate();

    const settings = {
      dots: false, // 슬라이더 하단에 점을 표시
      infinite: true, // 무한 루프 설정
      speed: 1000, // 슬라이더 전환 속도
      slidesToShow: 5, // 한 번에 보여줄 슬라이드 수
      slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
      autoplay: true, // 자동 슬라이드
      autoplaySpeed: 3000, // 자동 슬라이드 속도 (밀리초)
      swipeToSlide: false, // 슬라이드 간 스와이프
      adaptiveHeight: true, // Adjust slider height
    };
  
 
    return (
     <Container width={width} bgcolor={bgcolor} style={containerStyle}>
        <Slider {...settings}>
          {
            items.map((data, index)=>(
              <MassBox  bgcolor = {data.background} >
              <img src={data.img} width={60}/>
              <FlexstartColumn style={{lineHeight:2}}>
              <div style={{ marginTop:10, fontSize: () => getFontSize(16), color:"#131313", fontFamily:"Pretendard-SemiBold"}}>{data.name}</div>
              <div style={{ fontSize: () => getFontSize(14), color:"#777"}}>{data.desc}</div>
              </FlexstartColumn>
 
            </MassBox>
            ))
          }
      
        </Slider>
      </Container>
    );
  };
  
  export default PCLifeSwipeex;
  