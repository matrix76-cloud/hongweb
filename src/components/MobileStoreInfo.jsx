import React from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { CENTERTYPE, LAWTYPE } from "../utility/screen";
import { CONFIGMOVE } from "../utility/screen";




const TRANSPARENT = 'transparent';

const Container = styled.div`
    background-color : var(--bg-soft);
    min-height: ${({height}) =>height}px;
    padding: 20px 30px;
    margin-bottom:30px;
`

const StoreNameView = styled.div`
   display:flex;
`
const StoreNameText = styled.span`
    font-size: 25px;
    font-family : ${({theme}) =>theme.BOLD};
`

const StoreLineView = styled.div`
    background-color : var(--border-soft);
    height :1px;
`
const StoreButtonView = styled.div`
    display:flex;
    flex-direction : row;
    justify-content : flex-start;
    align-items : flex-start;
    margin-top:10px;
    flex-wrap:wrap;
    row-gap : 4px;
`
const StoreButton = styled.div`
    margin-right: 5px;
`
const StoreButtonText = styled.span`
    font-size: 12px;
    font-family : ${({theme}) =>theme.REGULAR};
`
const StoreBusinessView = styled.div`
    /* 세 줄이 가로로 붙어 서로 파고들며 깨졌다. 한 줄씩 아래로 쌓는다. (형 지적 2026-08-20) */
    display:flex;
    flex-direction : column;
    align-items : flex-start;
    row-gap : 4px;
    margin-top:20px;
`
const StoreBusinessText = styled.span`
    font-size: 16px;
    font-family : ${({theme}) =>theme.REGULAR};
    line-height : 1.5;
`
const StoreBusinessInfoView = styled.div`
    display:flex;
    margin-bottom:10px;
    margin-top:10px;
`
const StoreBusinessInfoText = styled.span`
    font-size: 12px;
    font-family : ${({theme}) =>theme.REGULAR};
    color :#ACACAC;
    text-align: left;
`



const MobileStoreInfo  = ({containerStyle, height = 200})=>{

    const navigation = useNavigate();

    /* 여기는 홈(모바일) 밑에 붙는 줄인데 PC 전용 화면(/PCPolicy · /PCcenter)으로 보내고 있었다.
       폰에서 열면 PC 폭으로 그려져 글이 넘치고 버튼이 밀렸다. 모바일 화면은 이미 다 있어서
       그쪽으로 연결만 바꾼다. (형 지적 2026-08-20) */
    const _move = (name) => navigation("/Mobileconfigcontent", { state: { NAME: name, TYPE: "" } });

    const _handleUSEPolicy     = () => _move(CONFIGMOVE.LAWPOLICY);
    const _handlePRIVACYPolicy = () => _move(CONFIGMOVE.LAWPRIVACY);
    const _handleGPSPolicy     = () => _move(CONFIGMOVE.LAWGPS);
    const _handleCenter        = () => _move(CONFIGMOVE.SUPPORT);
    const _handleAbout         = () => _move(CONFIGMOVE.ABOUT);


    return(
        <Container style={containerStyle} height={ height}>
            <StoreNameView>
                {/* 서비스 이름은 "구해줘 홍여사" 다 (형 리뷰 2026-08-12) */}
                <StoreNameText>구해줘 홍여사</StoreNameText>
            </StoreNameView>


            <StoreButtonView>
                <StoreButton onClick={_handleUSEPolicy}>
                    <StoreButtonText>이용약관</StoreButtonText>
                </StoreButton>
                <StoreButton onClick={_handlePRIVACYPolicy}>
                    <StoreButtonText>개인정보 처리방침</StoreButtonText>
                </StoreButton>
                <StoreButton onClick={_handleGPSPolicy}>
                    <StoreButtonText>위치정보기반 수집동의 규정</StoreButtonText>
                </StoreButton>
                <StoreButton onClick={_handleCenter}>
                    <StoreButtonText>고객센타</StoreButtonText>
                </StoreButton>
                <StoreButton onClick={_handleAbout}>
                    <StoreButtonText>홍여사 알아보기</StoreButtonText>
                </StoreButton>

                {/* 공간대여는 이 서비스에 없는 메뉴다 — 뺐다 (형 지시 2026-08-20) */}
            </StoreButtonView>

            {/* 다른 회사(에듀컴) 정보가 그대로 남아 있었다 — 실제 운영 주체로 바꿨다.
                사업자등록증 원본 기준. (형 확인 2026-08-20)
                ※ 통신판매업 신고번호는 사업자등록증에 없는 별도 신고사항이라 아직 못 넣었다. */}
            <StoreBusinessView>
                    <StoreBusinessText style={{fontSize:12}}>
                    주식회사 홍컴즈 | 대표 이행렬 | 사업자등록번호 480-86-03245
                    </StoreBusinessText>
                    <StoreBusinessText style={{fontSize:12}}>
                    서울특별시 서초구 사임당로8길 13, 4층 402-제이681호
                    </StoreBusinessText>
                    <StoreBusinessText style={{fontSize:12}}>
                    대표전화 070-4544-7684
                    </StoreBusinessText>
            </StoreBusinessView>
            <StoreBusinessInfoView>
                <StoreBusinessInfoText>
                주식회사 홍컴즈는 통신판매중개자이며, 통신판매의 당사자가 아닙니다.
                따라서, 상품의 예약, 이용 및 환불 등과 관련한 책임을 지지 않습니다.
                </StoreBusinessInfoText>
            </StoreBusinessInfoView>
    
        </Container>
    );
}



MobileStoreInfo.propTypes = {
    containerStyle : PropTypes.object,
}

export default MobileStoreInfo;
