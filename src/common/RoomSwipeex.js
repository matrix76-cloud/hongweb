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
import { getFontSize } from '../utility/fontsize';
const Container = styled.div`
  width: 100%;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  min-height:210px;

  background :#fff;
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




const RoomSlickSliderComponentEx = ({width ,items, bgcolor}) => {

    const navigate = useNavigate();

    const settings = {
      dots:true, // 슬라이더 하단에 점을 표시
      infinite: true, // 무한 루프 설정
      speed: 500, // 슬라이더 전환 속도
      slidesToShow: 2.5, // 한 번에 보여줄 슬라이드 수
      slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
      autoplay: true, // 자동 슬라이드
      autoplaySpeed: 3000, // 자동 슬라이드 속도 (밀리초)
      swipeToSlide: false, // 슬라이드 간 스와이프
      adaptiveHeight: true, // Adjust slider height
    };
  
    const _handleBtn = () =>{

    }
    const _handleSearch = ()=>{
      navigate("/Mobilesearch" ,{state :{search :""}});
    }
    const _handleCommunity = ()=>{
      navigate("/Mobilecommunitycontent" ,{state :{name :LIFEMENU.BOARD}});
    }

    const _handleAttendance = ()=>{
      navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.ATTENDANCE, TYPE : ""}});

    }

    const _handleRullet = ()=>{
      navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.RULLET, TYPE : ""}});
    }

    const _handleRoom = ()=>{
      navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.ROOMKNOW, TYPE : ""}});
    }
    const _handleContact = ()=>{
      navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.CONTACTKNOW, TYPE : ""}});
    }
    const _handleTransaction = ()=>{
      navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.TRANSACTIONKNOW, TYPE : ""}});
    }
    return (
     <Container width={width} bgcolor={bgcolor}>
        <Slider {...settings}>
          {
            items.map((data, index)=>(
              <>
              <Box>
                <LazyImageex src={data.image} containerStyle={{width:'97%', backgroundColor: '#fff', height:'400px' }}/>
              </Box>
              </>
       
            ))
          }
      
        </Slider>
      </Container>
    );
  };
  
  export default RoomSlickSliderComponentEx;
  