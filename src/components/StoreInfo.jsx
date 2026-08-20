import React from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { CENTERTYPE, LAWTYPE } from "../utility/screen";




const TRANSPARENT = 'transparent';

const Container = styled.div`
    background-color : var(--bg-soft);
    height: ${({height}) =>height}px;
    padding: 20px 30px;
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
`
const StoreButton = styled.div`
    margin-right :20px;
`
const StoreButtonText = styled.span`
    font-size: 16px;
    font-family : ${({theme}) =>theme.REGULAR};
`
const StoreBusinessView = styled.div`
    display:flex;
    margin-top:20px;
`
const StoreBusinessText = styled.span`
    font-size: 16px;
    font-family : ${({theme}) =>theme.REGULAR};
`
const StoreBusinessInfoView = styled.div`
    display:flex;
    margin-bottom:10px;
    margin-top:10px;
`
const StoreBusinessInfoText = styled.span`
    font-size: 14px;
    font-family : ${({theme}) =>theme.REGULAR};
    color :#ACACAC;
    text-align: left;
`



const StoreInfo  = ({containerStyle, height})=>{

    const navigation = useNavigate();

    const _handleUSEPolicy =() =>{
        navigation("/PCPolicy" ,{state :{LAWTYPE :LAWTYPE.USELAW}});
    }
    const _handlePRIVACYPolicy =() =>{
        navigation("/PCPolicy" ,{state :{LAWTYPE :LAWTYPE.PRIVACYLAW}});
    }

    const _handleGPSPolicy =() =>{
        navigation("/PCPolicy" ,{state :{LAWTYPE :LAWTYPE.GPSLAW}});
    }

    const _handleCenter = () =>{
        navigation("/PCcenter",{state :{CENTERTYPE :CENTERTYPE.NOTICE}});
      }


    return(
        <Container style={containerStyle} height={ height}>
            <StoreNameView>
                <StoreNameText>홍여사</StoreNameText>
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
                <StoreButton onClick={_handleCenter}>
                    <StoreButtonText>홍여사 알아보기</StoreButtonText>
                </StoreButton>

                <StoreButton onClick={_handleCenter}>
                    <StoreButtonText>공간대여 알아보기</StoreButtonText>
                </StoreButton>
            </StoreButtonView>

            <StoreBusinessView>
                <StoreBusinessText>주식회사 홍컴즈 | 대표 이행렬 | 사업자등록번호 480-86-03245 | 서울특별시 서초구 사임당로8길 13, 4층 402-제이681호 | 대표전화 070-4544-7684</StoreBusinessText>
                
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



StoreInfo.propTypes = {
    containerStyle : PropTypes.object,
}

StoreInfo.defaultProps ={
    height : 150,
}
export default StoreInfo;
