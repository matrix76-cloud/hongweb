import React,{useState, useEffect} from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, Link, useNavigate} from "react-router-dom";
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
import { PiX } from 'react-icons/pi';
import LazyImage from './LasyImage';
import ButtonEx from './ButtonEx';
import { LIFEMENU, TOURISTMENU } from '../utility/life';
import { CONFIGMOVE } from '../utility/screen';
import { Column } from './Column';
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
  width: 100%;
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */





`
// background :#ec8260;

const Box = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  background: ${({ bgcolor }) => bgcolor};
  display: flex;
  justify-content: center;
  align-items: center;


`;

const MainItem = styled.div`
  width: 100%;
  font-family: 'Pretendard-Regular';
  color: ${({ color }) => color};
  font-size: ${() => getFontSize(20)}px;
  padding-left: 30px;
  padding-top: 24px;
  position: relative; /* ✅ absolute → relative 변경 */
  z-index: 1;
  line-height: 1.5;
`;

const MainItemType = styled.div`
  font-size: ${() => getFontSize(10)}px;
  background: ${({ $bg }) => $bg || '#FFA726'} !important;  // ✅ props 기반 색상 분기
  color: #fff;                     // ✅ 명확한 글자색
  display: flex;
  border-radius: 5px;
  justify-content: center;
  width: 70px;
  height: 20px;
  align-items: center;
  font-weight: 600;
  padding: 4px 14px;

`
const ButtonItemType = styled.div`
  font-size: ${() => getFontSize(14)}px;
  background: #1E1E1E;
  color: #FFF;
  display: inline-flex;                  /* ✅ 너비 최소화 */
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  margin-top: 20px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  align-self: flex-start;               /* ✅ 필요한 경우 중앙으로 조정 가능 */

`
const BackgroundImageLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;

  background: ${({ bgcolor }) => bgcolor || "#f8f8f8"};
  background: linear-gradient(
    135deg,
    ${({ bgcolor }) => bgcolor || "#f8f8f8"} 0%,
    #ffffff 100%
  );

  /* 선택적 세련된 라인 패턴 효과 */
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.03) 0px,
    rgba(255, 255, 255, 0.03) 2px,
    transparent 2px,
    transparent 4px
  );

  opacity: 0.95;
`;

const ImageLayer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 16px;
  background: linear-gradient(145deg, #ffffff, #dedede); // ✅ 입체감 강조
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); // ✅ 시각 부각
`

const WaterImageLayer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 16px;
  width: 120px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

`


const PositionLayer = styled.div`
  position: absolute;
  bottom: 12px;      /* ✅ 아래로 붙임 */
  right: 20px;       /* ✅ 우측 끝 고정 */
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.6);
  font-size: ${() => getFontSize(10)}px;
  color: white;
  border-radius: 12px;
  font-weight: 500;
`;


// 🔧 컴포넌트 상단에 추가 (styled, keyframes 아래)
const rotate = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const RouletteImage = styled.img`
  animation: ${rotate} 4s linear infinite;
  width: 80px;    
  height: 80px;
`;


const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 8px #ffddee);
    opacity: 1;
  }
  50% {
    filter: drop-shadow(0 0 12px #ff99ff) drop-shadow(0 0 20px #ff66cc);
    opacity: 0.6;
  }
`;

const FortuneImage = styled.img`
  animation: ${glow} 2.5s ease-in-out infinite;
  width: 70px;
`;


const cardImages = [
  imageDB.game1,
  imageDB.game2,
  imageDB.game3,
  imageDB.game4,
  imageDB.game5,
  imageDB.game6,
  imageDB.game7,
  imageDB.game8,
  imageDB.game9,

];

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;
const HatImage = styled.img`
  animation: ${shake} 3s ease-in-out infinite;
  width: 80px;
`;
    
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const LadyImage = styled.img`
  animation: ${bounce} 1.5s ease-in-out infinite;
  width: 80px;
`;

const WaterIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 14px;
  animation: drip 1.8s ease-in-out infinite;

  @keyframes drip {
    0% {
      transform: translateY(-10px) scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: translateY(5px) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translateY(0px) scale(1);
      opacity: 0.3;
    }
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const FridgeImage = styled.img`
  animation: ${blink} 0.6s steps(2, start) infinite;
  width: 60px;
`;

const MemoImage = styled.img`
  animation: ${blink} 0.6s steps(2, start) infinite;
  width: 120px;
`;


const SlickSliderComponent = ({width ,items, bgcolor}) => {

  const navigate = useNavigate();
  
  const [currentCard, setCurrentCard] = useState(0);
  
  const [refresh, setRefresh] = useState(false);

  const swiperRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(r => !r);
    }, 3000); // 3초마다 슬라이더 상태를 리렌더
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % cardImages.length);
    }, 1000); // 1초마다 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  const isDarkColor = (hex) => {
    const c = hex.replace('#', '');
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const getImageComponent = (data) => {
    if (data.buttontype === 2) {
      return (
        <ImageLayer>
          <RouletteImage src={data.buttonImage} alt="룰렛 이미지" />
        </ImageLayer>
      );
    } else if (data.buttontype === 3) {
      return (
        <ImageLayer>
          <img src={cardImages[currentCard]} width={80} alt="카드 이미지" />
        </ImageLayer>
      );
    } else if (data.buttontype === 4) {
      return (
        <ImageLayer>
          <HatImage src={data.buttonImage} /> 
        </ImageLayer>
      );
    } else if (data.buttontype === 5 || data.buttontype === 17 || data.buttontype === 7)  {
      return (
        <ImageLayer>
          <LadyImage src={data.buttonImage} alt="이미지" />
        </ImageLayer>
      );
    } else if (data.buttontype === 11) {
      return (
        <ImageLayer>
          <FortuneImage src={data.buttonImage} alt="운세" />
        </ImageLayer>
      );
    } else if (data.buttontype === 12) {
      return (
        <WaterImageLayer>
          <WaterIcon src={data.buttonImage} width={120} alt="물" />
        </WaterImageLayer>
      );
    } else if (data.buttontype === 13) {
      return (
        <ImageLayer>
          <FridgeImage src={data.buttonImage}  alt="냉장고" />
        </ImageLayer>
      );
    } else if (data.buttontype === 15) {
      return (
        <ImageLayer>
          <img src={data.buttonImage} width={60} alt="축제" />
        </ImageLayer>
      );
    } else if (data.buttontype === 16) {
      return (
        <ImageLayer>
          <MemoImage src={data.buttonImage}  alt="축제" />
        </ImageLayer>
      );
    } else {
      return (
        <ImageLayer>
          <img src={data.buttonImage} width={80} alt="일반 배너" />
        </ImageLayer>
      );
    }
  };


    const settings = {
      dots: false, // 슬라이더 하단에 점을 표시
      infinite: true, // 무한 루프 설정
      speed: 500, // 슬라이더 전환 속도
      slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
      slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
      autoplay: true, // 자동 슬라이드
      autoplaySpeed: 3000, // 자동 슬라이드 속도 (밀리초)
      swipeToSlide: true, // 슬라이드 간 스와이프
      adaptiveHeight: true, // Adjust slider height
      pauseOnHover: false,
      pauseOnFocus: false,
      pauseOnDotsHover: false,
    };
  
    const _handleBtn = () =>{

    }
  
    const _handleBanner = (data) => {
      if (data.buttontype == 1) {
        navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.TRANSACTIONKNOW, TYPE: "" } });
      } else if (data.buttontype == 2) {
        navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.RULLET } });
      } else if (data.buttontype == 3) {
        navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.GAME } });
      } else if (data.buttontype == 4) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.AI } });
      } else if (data.buttontype == 5) {
        navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.ATTENDANCE } }); 
      } else if (data.buttontype == 6) {
        navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.HONGKNOW, TYPE : ""}});
      } else if (data.buttontype == 7) {
        navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.TRANSACTIONKNOW, TYPE: "" } });
      } else if (data.buttontype == 13) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.BOARD } });
      } else if (data.buttontype == 12) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.WATER } });
      } else if (data.buttontype == 16) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.MEMO } });
      } else if (data.buttontype == 11) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.FORTUNEDAILY } });
      } else if (data.buttontype == 14) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.SALE } });
      } else if (data.buttontype == 17) {
        navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.WORK } });
      } else if (data.buttontype == 15) {
        navigate("/Mobileleisurecontent", { state: { name: TOURISTMENU.TOURFESTIVAL } });
      } 
    }
  
  const getTagColor = (type) => {
    if ([2, 3, 5].includes(type)) return '#FFA726'; // 이벤트: 주황
    if (type === 1) return '#00BCD4';               // 홍여사 TIP: 청록
    return '#112aff';                                // 기능: 진회색

    // return '#FFA726';
  };

    return (
     <Container width={width} bgcolor={bgcolor}>
  
          <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false, // 터치해도 멈추지 않음
          }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay.start(); // 🔥 강제 시작 (WebView 대응)
          }}
          style={{ width: '100%', height: '100%' }}
          >

          {
            items.map((data, index = 0) => {

              const effectiveTextColor = isDarkColor(data.bgcolor) ? "#FFFFFF" : "#222222";

              return (
                <>
                  <SwiperSlide key={index}>
                    <Box data-label={index + 1 + "/" + items.length} bgcolor={data.bgcolor}>


                    <MainItem color={effectiveTextColor}>

                      {/* ✅ 말머리 추가 */}
                      <div style={{
                        fontSize: getFontSize(11),
                        fontWeight: 600,
                        color: effectiveTextColor,
                        marginBottom: 6
                      }}>
                        {data.headline || "추천 콘텐츠"}
                      </div>

                      <MainItemType $bg={getTagColor(data.buttontype)}>
                        {
                          [2, 3, 5].includes(data.buttontype)
                            ? "EVENT"
                            : data.buttontype === 1
                              ? "홍여사 TIP"
                              : "홍여사 TIP"
                        }
                      </MainItemType>

                      {getImageComponent(data)}
                


                      <Column style={{
                        marginTop: 18,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        fontSize: getFontSize(16),
                        lineHeight: 1.6,
                        fontWeight: 500
                      }}>
                        <div>{data.maintext}</div>
                        <div>{data.subtext1}</div>
                      </Column>

                      <ButtonItemType onClick={() => _handleBanner(data)}>
                        {data.buttonText}
                      </ButtonItemType>

                
                    </MainItem>



                    <BackgroundImageLayer bgcolor={data.bgcolor} />

                    </Box>
                  </SwiperSlide>
                </>
              )
            }
       
  
       
            )
          }
      
          </Swiper>
      </Container>
    );
  };
  
  export default SlickSliderComponent;
  