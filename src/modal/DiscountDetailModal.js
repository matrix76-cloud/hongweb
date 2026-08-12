import React, { useEffect } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import ModalWrapper from './ModalWrapper';

const Overlay = styled.div`
  position: fixed;
  z-index: 999;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  width: 80%;
  max-width: 340px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  font-family: 'Pretendard';
  position: relative;
`;

const BrandTag = styled.div`
  background-color: ${({ brandColor }) => brandColor || '#999'};
  color: white;
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 999px;
  margin-bottom: 10px;
  display: inline-block;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 16px;
  font-size: ${() => getFontSize(18)}px;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  border-radius: 12px;
  margin: 12px 0;
`;

const Price = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-weight: 700;
  color: #d36100;
`;

const LinkButton = styled.button`
  width: 100%;
  padding: 12px 0;
  margin-top: 16px;
  background: #2c2c2c;
  color: white;
  font-size: ${() => getFontSize(15)}px;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard-SemiBold';
`;

const DiscountDetailModal = ({ item, onClose }) => {
    useEffect(() => {
        return () => {
            onClose?.(); // 모달 언마운트 시 클린업
        };
    }, []);

    const getBrandColor = (site) => {
        switch (site) {
            case "이마트몰": return '#FFDE58';
            case "홈플러스": return '#ED1C24';
            case "마켓컬리": return '#800080';
            case "G마켓": return '#00A84F';
            case "쿠팡": return '#0078FF';
            case "11번가": return '#E94444';
            default: return '#999';
        }
    };

    const getFinalPrice = (item) => {
        const price = item.할인가 || item.meta?.할인가 || item.price || null;
        return price ? `${Number(price).toLocaleString()}원` : '';
    };

    const getBrandLabel = (site) => {
        switch (site) {
            case "이마트몰": return "이마트 오반장";
            case "홈플러스": return "홈플러스 익스프레스";
            case "마켓컬리": return "마켓컬리 특가";
            case "G마켓": return "G마켓 슈퍼딜";
            case "11번가": return "11번가 쇼킹딜";
            default: return site;
        }
    };

    const _handleOpenLink = () => {
        try {
            const url = item?.link;

            // ✅ 유효성 검사
            if (!url || typeof url !== 'string' || url === 'undefined' || url === '') {
                console.warn("❌ 유효하지 않은 링크:", url);
                return;
            }

            setTimeout(() => {
                if (window.ReactNativeWebView?.postMessage) {
                    window.ReactNativeWebView.postMessage(`open::${encodeURI(url)}`);
                } else {
                    window.open(encodeURI(url), '_blank');
                }
            }, 200); // 렌더 이후에 실행
        } catch (e) {
            console.error("🚨 링크 열기 실패:", e);
        }
    };



    return (
        <ModalWrapper
            title="상품정보"
            submitLabel="상품 보러가기"
        >

            <div>test</div>

        </ModalWrapper>
    );
};

export default DiscountDetailModal;
