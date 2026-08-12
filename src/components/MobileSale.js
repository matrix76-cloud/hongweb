// 💸 홍여사 할인 탐지기 - MobileSale.jsx

import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { imageDB } from "../utility/imageData";
import { BetweenRow, FlexstartRow } from "../common/Row";
import KakaoShare from "./KakaoShare";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Column } from "../common/Column";
import { getFontSize, isIOS } from "../utility/fontsize";
import { UserContext } from "../context/User";
import useKurlyDiscount from "../hooks/useKurlyDiscount";
import useEmartDiscount from "../hooks/useEmartDiscount";
import useHomeplusDiscount from "../hooks/useHomeplusDiscount";
import useGmarketDiscount from "../hooks/useGmarketDiscount";
import ShoppingSpinner from "./ShoppingSpinner";
import DiscountDetailModal from "../modal/DiscountDetailModal";
import useFavorites from "../hooks/useFavorites";
import useStreet11Discount from "../hooks/useStreet11Discount";
import DiscountItemCard from "./DiscountItemCard";
import ShareButton from "./ShareButton";

const brandInfo = [
    { site: "쿠팡", label: "핫딜", image: imageDB.coupang },
    { site: "G마켓", label: "빅딜", image: imageDB.gmarket },
    { site: "11번가", label: "오늘의 특가", image: imageDB.street },
    { site: "이마트몰", label: "행사상품", image: imageDB.emart },
    { site: "홈플러스", label: "기획전", image: imageDB.homeplus },
    { site: "마켓컬리", label: "이벤트 특가", image: imageDB.marketkurly },
];

const siteLogos = {
    "쿠팡": imageDB.coupang,
    "G마켓": imageDB.gmarket,
    "11번가": imageDB.street,
    "이마트몰": imageDB.emart,
    "홈플러스": imageDB.homeplus,
    "마켓컬리": imageDB.marketkurly
};


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 15px;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`;
const HeaderText = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #666;
  flex: 1;
  text-align: flex-start;
  margin-right: 24px; // ← 하트나 공유 버튼 고려 시 여백
  padding-left:5px;
`;

const HEADER_HEIGHT = 44;

const Container = styled.div`

  height: calc(100dvh - ${HEADER_HEIGHT }px);
  overflow-y: auto;
  
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;
  padding: 0 16px;
`;

const DiscountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;

`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  border-radius:5px;
  position:relative;
  margin-bottom:15px;
`;

const Thumbnail = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3; // 또는 3 / 2, 사진에 따라 조정
  object-fit: contain;
  margin-bottom: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(12)}px;
  color: #333;
  margin-bottom: 4px;
`;

const Price = styled.div`
  font-size: ${() => getFontSize(15)}px;
  font-weight: 700;
  color: #d36100;
  font-family: Pretendard-SemiBold;
`;

const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;

const DiscountRateBadge = styled.div`

  background: rgba(255, 87, 34, 0.95); /* 감성 주황 */
  color: white;
  font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(11)}px;  
  padding: 3px 8px;
  border-radius: 6px;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const PriceBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 2px;
  padding: 6px 12px;                 // ⬆️ 여백 늘림
  font-family: 'Pretendard-Bold';    // ⬆️ 더 굵은 강조
  font-size: 15px;                   // ⬆️ 더 크게
  color: white;
  background: rgba(0,0,0,0.75);
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

const EmptyTitle = styled.div`
    margin-top: 20px;
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(22)}px;
    color: #423f3f;
`

const EmptySubTitle = styled.div`
  margin: 5px 0px;
`
const BrandBadge = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${()=> getFontSize(11.5)}px;               // 살짝 작게
  padding: 3px 10px;               // 얇고 길게
  background-color: ${({ brand }) => {
    switch (brand) {
        case '이마트몰':
            return '#FFDE58';
        case '홈플러스':
            return '#ED1C24';
        case '마켓컬리':
            return '#800080';
        case '쿠팡':
            return '#0078FF';
        case 'G마켓':
            return '#00A84F';
        case '11번가':
            return '#E94444';
        default:
            return '#999';
    }
    }};
  color: ${({ brand }) => {
        switch (brand) {
            case '이마트몰':
                return '#131313';
        
            default:
                return '#fff';
        }
    }};;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.06);
  text-align: center;
`;

// const shuffleArray = (arr) => {
//     return arr
//         .map((item) => ({ item, sort: Math.random() }))
//         .sort((a, b) => a.sort - b.sort)
//         .map(({ item }) => item);
// };


const tabs = [
    "전체", "찜한 상품", "신규 상품", "마켓컬리", "이마트몰", "홈플러스", "G마켓", "쿠팡", "11번가"
];

const TabWrapper = styled.div`
 position: sticky;
 top: 0px;
 background :#fff;
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 5px 0;
  white-space: nowrap;
  &::-webkit-scrollbar { display: none; }
  z-index :100;
`;

const TabButton = styled.button`
  font-family: Pretendard-SemiBold;
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  min-height: 35px;
  flex-shrink: 0;
  font-size :${()=>getFontSize(16)}px;
  background: ${({ active }) => (active ? '#131313' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
`;


const Heart = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: ${()=>getFontSize(18)}px;
  cursor: pointer;
  z-index: 10;
`;






const MobileSale = ({search}) => {
    const [data, setData] = useState([]);
    const { user, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const scrollYRef = useRef(0);
    const [searchParams] = useSearchParams();
    const isExternal = searchParams.get("external") === "true";


    const { items: kurlyItems, count: kurlyCount } = useKurlyDiscount();
    const { items: emartItems, count: emartCount } = useEmartDiscount();
    const { items: homeplusItems, count: homeplusCount } = useHomeplusDiscount();
    const { items: gmarketItems, count: gmarketCount } = useGmarketDiscount();
    const { items: street11Items, count: streetCounnt } = useStreet11Discount();

    const { favorites, isFavorite, toggleFavorite } = useFavorites();

    const [selectedItem, setSelectedItem] = useState(null);
    const [scrollY, setScrollY] = useState(0);  // ✅ 스크롤 위치 저장용
    const [loading, setLoading] = useState(true);
    const [allItems, setAllItems] = useState([]);
   

    const [activeTab, setActiveTab] = useState(search || "전체");

    const tabRefs = useRef({});


    const handleTabClick = (tab) => {
        setActiveTab(tab);

        // 💫 탭 이동 처리
        if (tabRefs.current[tab]) {
            tabRefs.current[tab].scrollIntoView({
                behavior: 'smooth',
                inline: 'center', // 가운데 정렬 느낌
                block: 'nearest',
            });
        }
    };



    const filteredItems = allItems.filter(item => {
        if (activeTab === '전체') return true;
        if (activeTab === '찜한 상품') return item.isLiked;
        if (activeTab === '신규 상품') return item.new === true;
        return item.site === activeTab;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        const aPrice = Number(a.할인가 || a.price || 0);
        const bPrice = Number(b.할인가 || b.price || 0);
        return aPrice - bPrice;
    });
    
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


    const _handleprev = () => {
        navigate(-1);
    }

    // const allItems = shuffleArray(
    //     brandInfo.flatMap(({ site }) =>
    //         data?.[site]?.items?.map((item) => ({ ...item, site })) || []
    //     )
    // );
    const formatPrice = (price) => {
        if (!price) return '';
        return `₩${Number(price).toLocaleString()}`;
    };
    const getDiscountRateFromTitle = (title) => {
        const match = title?.match(/(\d{1,3})%/);  // ex: "30%", "40%"
        return match ? parseInt(match[1], 10) : null;
    };

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

    const calculateDiscount = (price, originalPrice) => {
        if (!price || !originalPrice || originalPrice === 0) return null;
        return Math.floor(((originalPrice - price) / originalPrice) * 100);
    };

    const normalizeItem = (item) => {
        const 원가 = item.원가 || item.originalPrice || item.meta?.원가 || null;
        const 판매가 = item.price || item.할인가 || item.meta?.할인가 || null;
        const 계산된할인율 = calculateDiscount(판매가, 원가);

        return {
            ...item,
            원가,
            할인가: 판매가,
            할인율: item.할인율 || item.discountPercent || 계산된할인율 || getDiscountRateFromTitle(item.title),
        };
    };



    useEffect(() => {
        const newData = {
            "마켓컬리": { items: kurlyItems },
            "이마트몰": { items: emartItems },
            "홈플러스": { items: homeplusItems },
            "G마켓": { items: gmarketItems },
            "11번가": { items: street11Items },
        };

        const updatedItems = brandInfo.flatMap(({ site }) =>
            newData?.[site]?.items?.map((item) => ({
                ...normalizeItem(item), // ✅ 적용 위치 정확함!
                site,
                isLiked: isFavorite(item),
            })) || []
        );

        // ✅ shuffle 제거 → 고정 순서 유지
        setAllItems(updatedItems);
    }, [kurlyItems, emartItems, homeplusItems, gmarketItems, street11Items, favorites]);

    const handleCloseModal = () => {
        setSelectedItem(null); // 모달 닫기
    };

    const _handleProductView = (item) => {
        if (!item) return;

        navigate("/MobileProductPage", {
            state: item, // ✅ 전체 item 객체 전달
        });
    }

    useEffect(() => {
        if (tabRefs.current[activeTab]) {
            tabRefs.current[activeTab].scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    }, [activeTab]); 

    return (
        <>
            {!isExternal && (
                <HeaderWrapper>
                    <img
                        src={imageDB.ic_common_top_back_nor}
                        onClick={_handleprev}
                        style={{ width: 20 }}
                    />
                    <HeaderText>오늘의 특가</HeaderText>
       
                </HeaderWrapper>
            )}

            <Container>
            <TabWrapper>
                {tabs.map((tab) => (
                    <TabButton
                        key={tab}
                        active={tab === activeTab}
                        ref={el => (tabRefs.current[tab] = el)}  // 🪄 ref 등록
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </TabButton>
                ))}
            </TabWrapper>
                {sortedItems.length === 0 ? (
                    <Column style={{ alignItems: 'center', marginTop: 60 }}>
                        <EmptyImage src={siteLogos[activeTab] || imageDB.memo_basket} />
                        <EmptyTitle>
                            {activeTab === '찜한 상품'
                                ? '찜한 상품이 아직 없어요 💔'
                                : '오늘은 새로운 특가가 없어요 🥲'}
                        </EmptyTitle>
                        <EmptySubTitle>
                            {activeTab === '찜한 상품'
                                ? '마음에 드는 상품을 꾹 눌러 찜해보세요!'
                                : '내일 또 들어올 특가를 기다려볼까요?'}
                        </EmptySubTitle>
                    </Column>
                ) : (
                    <DiscountGrid>
                        {sortedItems.map((item, idx) => (
                            <DiscountItemCard
                                key={idx}
                                item={item}
                                isFavorite={isFavorite(item)}
                                toggleFavorite={toggleFavorite}
                                onClick={() => _handleProductView(item)}
                            />
                        ))}
                    </DiscountGrid>
                )}
            </Container>
        </>

    );
};

export default MobileSale;
