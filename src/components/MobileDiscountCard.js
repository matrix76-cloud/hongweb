import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { imageDB } from "../utility/imageData";
import { getFontSize } from "../utility/fontsize";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import { LIFEMENU } from "../utility/life";
import useKurlyDiscount from "../hooks/useKurlyDiscount";
import useEmartDiscount from "../hooks/useEmartDiscount";
import useHomeplusDiscount from "../hooks/useHomeplusDiscount";
import useGmarketDiscount from "../hooks/useGmarketDiscount";
import useStreet11Discount from "../hooks/useStreet11Discount";
import { Row } from "../common/Row";

const BoxItem = [
  { image: imageDB.street, value: '11번가' },
  { image: imageDB.coupang, value: '쿠팡' },
  { image: imageDB.gmarket, value: 'G마켓' },
  { image: imageDB.homeplus, value: '홈플러스' },
  { image: imageDB.marketkurly, value: '마켓컬리' },
  { image: imageDB.emart, value: '이마트' },

];

const brands = ['이마트', '홈플러스', '마켓컬리', '쿠팡', '11번가', 'G마켓'];

const DiscountCard = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 20px auto;
  padding: 24px 20px;
  border-radius: 16px;
  background-color: #f5f6f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const DiscountTitle = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-weight: 700;
  color: #131313;
  font-family: 'Pretendard-SemiBold';
  text-align: center;
`;

const DiscountDesc = styled.div`
  font-size: ${() => getFontSize(15)}px;
  color: #4b5563;
  line-height: 1.5;
  text-align: center;
`;

const BrandLogoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  row-gap: 14px;
  padding: 12px 0 6px;
  max-width: 300px;
  margin: 0 auto;
`;

const BrandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 12px;
  justify-items: center;
  margin: 0 auto;
  padding: 20px 0;
`;

const BrandBox = styled.img`
    background-color: #dcedfd;
    color: #333;
    width: 65px;
    height: 64px;
    border: 1px solid #dcedfd;
    border-radius: 8px;
    font-size: 13px;
    text-align: center;
    display: flex   ;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    cursor: default;
`;

const CTAButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: #fff;
  font-size: ${() => getFontSize(16)}px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;


 const DiscountIntroWrapper = styled.div`
  width: 90%;
  margin: 20px auto 10px auto;
  padding-top: 10px;
  text-align: center;
`;

 const DiscountIntroTitle = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(17)}px;
  color: #2C2C2C;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
  letter-spacing: -0.5px;
`;

const FindLayer = styled.div`
  background: #e2e8f0;         // 부드러운 회색 배경
  padding: 10px 10px;
  borderRadius: 12px;
  text-align: center;
  font-size: ${() => getFontSize(13)}px;
  color: #1f2937;
  width:90%;
  display:flex;
  flex-direction : row;



`
const Find = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
`

const FindEmpasy = styled.div`

  font-family: Pretendard-SemiBold;
  font-size: ${()=>{getFontSize(22)}};
  color: #111;
  margin : 0px 3px;


  animation: sizeupblink 0.8s ease-in-out infinite;

  @keyframes sizeupblink {
  0%, 100% {
  transform: scale(1);
  }
  20% {
  transform: scale(1.1);
  }
  40% {
  transform: scale(1.2);
  }
  60% {
  transform: scale(1.1);
  }
  80% {
  transform: scale(1);
  }


`

const MobileDiscountCard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { items: kurlyItems, count: kurlyCount } = useKurlyDiscount();
  const { items: emartItems, count: emartCount } = useEmartDiscount();
  const { items: homeplusItems, count: homeplusCount } = useHomeplusDiscount();
  const { items: gmarketItems, count: gmarketCount } = useGmarketDiscount();
  const { items: stret11Items, count: streetCount } = useStreet11Discount();

  const [refresh, setRefresh] = useState(-1);
  

  useEffect(() => {
      const newData = {
      "마켓컬리": { items: kurlyItems },
      "이마트몰": { items: emartItems },
      "홈플러스": { items: homeplusItems },
      "G마켓": { items: gmarketItems },
        "11번가": { items: stret11Items },
      };

    setData(newData);

    console.log("newdata", newData);
    setRefresh((refresh) => refresh + 1);
  }, [kurlyItems, emartItems, homeplusItems, gmarketItems, stret11Items]);


  useEffect(() => {
    setData(data);
  },[refresh])

  
  const totalCount =
    (data["마켓컬리"]?.items?.length || 0) +
    (data["이마트몰"]?.items?.length || 0) +
    (data["홈플러스"]?.items?.length || 0) +
    (data["G마켓"]?.items?.length || 0) +
    (data["11번가"]?.items?.length || 0)
  


  const newCount = Object.values(data)
    .flatMap(market => market.items || [])
    .filter(item => item?.new)
    .length;
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timeout);
  }, []);

  const goToSalePage = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.SALE, search: "" } });
  };

  const _handleBrandSalePage = (site) => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.SALE, search: site } });
  }

  return (
    <>
      <DiscountIntroWrapper>
        <DiscountIntroTitle>
          구해줘 알바가 오늘의 특가를 찾고 있어요
        </DiscountIntroTitle>
      </DiscountIntroWrapper>
      <DiscountCard>
        <>
          <DiscountDesc>
            구해줘 알바가  아래 사이트들에서 특가 상품을 찾고 있어요!
            오늘 뭐가 싸게 나왔는지 같이 볼까요?
          </DiscountDesc>

          <BrandGrid>
            {BoxItem.map((brand, index) => (
              <BrandBox key={index} src= {brand.image} onClick={()=>{_handleBrandSalePage(brand.value)}}></BrandBox>
            ))}
          </BrandGrid>

          <FindLayer onClick={goToSalePage}>
            <div style={{ width: "100%", textAlign: "center", lineHeight: 1.6 }}>
              <Row>
                🛍️ 총 <FindEmpasy>{totalCount.toLocaleString()}</FindEmpasy>개 특가 중<br />
              </Row>
              <Row>
                <FindEmpasy>{newCount.toLocaleString()}</FindEmpasy>개는 신규 특가에요!
              </Row>
   
            </div>
          </FindLayer>

          <CTAButton onClick={goToSalePage}>
            할인항목 보러가기
          </CTAButton>
        </>
      </DiscountCard>
    </>

  );
};

export default MobileDiscountCard;
