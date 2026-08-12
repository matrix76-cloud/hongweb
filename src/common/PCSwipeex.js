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
import { getFontSize } from '../utility/fontsize';
const Container = styled.div`
  width: 100%;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  background :#fff;
  padding: 15px;
`
// background :#ec8260;

const Box = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 5px;
  width:100%;
  padding: 0px 20px 40px;


` 
const MainItem = styled.div`

  position:absolute;
  top:50px;
  left: 15px;
  font-family :'Pretendard-SemiBold';
  color :#fff;
  font-size: ${() => getFontSize(17)}px;

`

const SubItem1 = styled.div`

  position:absolute;
  top:80px;
  left: 15px;
  font-family :'Pretendard-SemiBold';
  color :#fff;
  font-size: ${() => getFontSize(17)}px;

`

const SubItem2 = styled.div`

  position:absolute;
  top:105px;
  left: 15px;
  font-family :'Pretendard-SemiBold';
  color :#fff;
  font-size: ${() => getFontSize(16)}px;

`
const ButtonLayer = styled.div`
  position:absolute;
  top:145px;
  left: 15px;
  width:100%;


`
const Info = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;


`





const PCSlickSliderComponentEx = ({width ,items, bgcolor, color, containerStyle}) => {

    const navigate = useNavigate();

    const settings = {
      dots: false, // 슬라이더 하단에 점을 표시
      infinite: true, // 무한 루프 설정
      speed: 500, // 슬라이더 전환 속도
      slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
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
              <PCBanner main1={data.main1} button={true} backgroundcolor={data.color} sub1={data.main2} 
              top={'25px'}
              containerStyle={containerStyle}
              sub2={data.main3} image={data.image}  imagewidth={'120px'} imageheight={'120px'} type={data.type} /> 
            ))
          }
      
        </Slider>
      </Container>
    );
  };
  
  export default PCSlickSliderComponentEx;
  