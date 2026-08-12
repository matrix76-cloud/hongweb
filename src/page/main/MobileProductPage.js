import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, isIOS } from "../../utility/fontsize";
import { imageDB } from "../../utility/imageData";
import { Column } from "../../common/Column";
import { BetweenRow } from "../../common/Row";


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;
const HEADER_HEIGHT = 44; 
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  padding: 16px;
`;

const Img = styled.img`

  width: 100%;
  height: 400px;
  object-fit: cover; /* 꼭 있어야 비율 왜곡 방지 */

  border-radius: 12px;
  margin-bottom: 12px;
`;

const Price = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  color: #d36100;
  font-weight: bold;
  margin-bottom: 6px;
`;

const Title = styled.h2`
  font-size: ${() => getFontSize(18)}px!important;
  font-weight: 600;
  margin-top: 16px;
`;

const OriginalPrice = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #999;
  text-decoration: line-through;
`;

const Discount = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #FF5722;
  margin-top: 4px;
`;

const LinkButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 14px 0;
  background: #2c2c2c;
  color: white;
  font-size: ${() => getFontSize(15)}px !important;
  border: none;
  border-radius: 10px;
  font-family: 'Pretendard-SemiBold';
`;

const CTAButton = styled.a`
  display: block;
  width: 80%;
  margin : 50px auto;
  text-align: center;
  background-color: #ff7e19;
  color: white;
  font-weight: bold;
  padding: 14px;
  border-radius: 12px;
  font-size: ${() => getFontSize(16)}px !important;
  text-decoration: none;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);

`;


const BigImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
`;

const MobileProductPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [item, setItem] = useState(location.state);

    useEffect(() => {
        if (!item) {
            alert("상품 정보가 만료되었습니다.");
            navigate(-1);
        }
    }, [item]);

    const _handleOpenLink = () => {
        try {
            const url = item?.link;

            if (!url) return;
            if (window.ReactNativeWebView?.postMessage) {
                window.ReactNativeWebView.postMessage(`open::${encodeURI(url)}`);
            } else {
                window.open(encodeURI(url), '_blank');
            }
        } catch (e) {
            console.error("링크 열기 실패", e);
        }
    };

    if (!item) return null;

    const safeImage = item.image?.startsWith("http") ? item.image : "/assets/fallback.jpg";
    const isValidLink = item.link && typeof item.link === 'string' && item.link.trim() !== '';

    const _handleprev = () => {
        navigate(-1);
    }
    return (
        <>
        
            <HeaderWrapper>
                <Column style={{ width: '100%' }}>
                    <BetweenRow style={{ width: '90%', paddingTop: 20, margin: '0 auto' }}>
                        <div style={{ display: 'flex', fontSize: '18px', color: '#131313', alignItems: 'center' }}>
                            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
                        </div>
                
                    </BetweenRow>
                </Column>
            </HeaderWrapper>
            <Container>

            <BigImage src={safeImage} alt={item.title} />


                <Title>{item.title}</Title>


                {item.originalPrice && (
                    <OriginalPrice>
                        {Number(item.originalPrice).toLocaleString()}원
                    </OriginalPrice>
                )}

                <Price>
                    {item.price ? Number(item.price).toLocaleString() + "원" : "가격 미정"}
                </Price>

                {item.discountRate > 0 && (
                    <Discount>🔥 {item.discountRate}% 할인중!</Discount>
                )}

                {isValidLink && (
                    <CTAButton onClick={_handleOpenLink}>
                        상품 보러가기
                    </CTAButton>
                )}
            </Container>
        
        </>

    );
};

export default MobileProductPage;
