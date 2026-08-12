// 💎 DiscountItemCard.jsx

import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { imageDB } from '../utility/imageData';



const Card = styled.div`
  width: 100%;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  position: relative;
  cursor: pointer;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
`;

const InfoBlock = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SiteLogo = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const BrandLabel = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  font-family: 'Pretendard-SemiBold';
`;

const DiscountRateBadge = styled.div`
  background: #ff5722;
  color: white;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 2px 8px;
  border-radius: 8px;
  font-family: Pretendard-Bold;
`;

const Price = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: bold;
  color: #d94d00;
  font-family: 'Pretendard-SemiBold';
`;

const Title = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #333;
  line-height: 1.4;
  font-family: 'Pretendard-Regular';
  max-height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
`;


const OriginalPrice = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #999;
  text-decoration: line-through;
  font-family: 'Pretendard-Regular';
`;

const OctagonDiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 46px;
  height: 46px;
  background: #ff6f00;
  color: #fff;
  font-size: ${() => getFontSize(14)}px !important;
  font-family: 'Pretendard-Bold';
  display: flex;
  align-items: center;
  justify-content: center;
 
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  z-index: 5;
  animation: blinkOctagon 1.8s infinite ease-in-out;
`;


const StarDiscountBadge = styled.div`
   position: absolute;
  top: 10px;
  right: 10px;
  width: 72px;   // 🔺 기존 48 → 72로 약 1.5배 키움
  height: 72px;
  background: #ff7706;
  color: #fff;
  font-size: ${() => getFontSize(16)}px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(
    50% 5%,
    63% 35%,
    98% 35%,
    70% 57%,
    80% 92%,
    50% 72%,
    20% 92%,
    30% 57%,
    2% 35%,
    37% 35%
  );
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  z-index: 5;
  animation: blinkStar 1.6s infinite ease-in-out;  // 👈 부드러운 깜빡임
`;

const Heart = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  cursor: pointer;
  z-index: 5;
  padding-left: 2px;
`;

const HeaderText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #666;
  flex: 1;
  text-align: center;
  margin-right: 24px; // ← 하트나 공유 버튼 고려 시 여백
`;

const NewBadge = styled.div`
  background-color: #f43f5e;
  color: white;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 2px 6px;
  border-radius: 8px;
  font-family: 'Pretendard-Bold';
`;

// 💫 깜빡임 애니메이션 정의
const GlobalStyle = createGlobalStyle`
  @keyframes blinkStar {
    0%   { opacity: 1; }
    50%  { opacity: 0.75; transform: scale(1.05); }
    100% { opacity: 1; }
  }
`;
const BoxItem = [
    { image: imageDB.street, value: '11번가' },
    { image: imageDB.coupang, value: '쿠팡' },
    { image: imageDB.gmarket, value: 'G마켓' },
    { image: imageDB.homeplus, value: '홈플러스' },
    { image: imageDB.marketkurly, value: '마켓컬리' },
    { image: imageDB.emart, value: '이마트몰' },
  
  ];

const DiscountItemCard = ({ item, isFavorite, toggleFavorite, onClick }) => {

const getBrandLabel = (site) => {
    switch (site) {
        case "이마트몰":
            return "이마트 오반장";
        case "홈플러스":
            return "홈플러스 익스프레스";
        case "마켓컬리":
            return "마켓컬리 특가";
        case "G마켓":
            return "G마켓 슈퍼딜";
        case "11번가":
            return "11번가 쇼킹딜";
        default:
            return site; // 쿠팡, 11번가, G마켓 등은 그대로
    }
    };


const siteLogos = (site)=>{
    const FindIndex = BoxItem.findIndex(x=>x.value == site);

  

    return BoxItem[FindIndex].image;
}
    const getFinalPrice = (item) => {
        if (!item) return '';

        // 💜 마켓컬리 대응
        if (item.할인가) {
            return `${Number(item.할인가).toLocaleString()}원`;
        }

        // ❤️ 홈플 meta에 있을 수도 있음
        if (item.meta?.할인가) {
            return `${Number(item.meta.할인가).toLocaleString()}원`;
        }

        // 💛 공통 price 필드
        if (item.price) {
            return `${Number(item.price).toLocaleString()}원`;
        }

        return '';
    };
        
  return (
    <Card onClick={() => onClick(item)}>
      <ProductImage src={item.image} alt={item.title} />
        <GlobalStyle/>
      <InfoBlock>
        <BrandRow>
          <SiteLogo src={siteLogos(item.site)} />
          {item.new && <NewBadge>신규</NewBadge>}
          <BrandLabel>{getBrandLabel(item.site)}</BrandLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {item.할인율 &&    <OctagonDiscountBadge>{item.할인율}%</OctagonDiscountBadge>}
                <Heart
                onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item);
                }}
                >
                {isFavorite ? '❤️' : '🤍'}
                </Heart>
            </div>

        </BrandRow>

        {item.원가 > 0 && (
          <OriginalPrice>{Number(item.원가).toLocaleString()}원</OriginalPrice>
        )}

        <Price>{getFinalPrice(item)}</Price>
        <Title>{item.title}</Title>
      </InfoBlock>


    </Card>
  );
};

export default DiscountItemCard;
