import styled from 'styled-components';
import { imageDB } from '../utility/imageData';
import { BetweenRow, Row } from '../common/Row';
import { useNavigate } from 'react-router-dom';
import { LIFEMENU, MEDICALMENU } from '../utility/life';
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../context/User';
import { getFontSize, isIOS } from '../utility/fontsize';


const HealthCardWrapper = styled.div`

  background-color: #E7F6EF; /* 추천 톤 */
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;


`;

const CardIcon = styled.img`
  width: 60px;
  height: auto;
  margin-bottom: 16px;
`;

const CardTitle = styled.div`
 font-size: ${() => getFontSize(20)}px;
  font-weight: 700;
  color: #131313;
  font-family: ${() => isIOS
    () ? `'Pretendard-SemiBold'` : `'Pretendard-Bold'`};
`;

const CardDesc = styled.div`
 font-size: ${() => getFontSize(14)}px;
  font-family: 'Pretendard-Regular';
  color: #333;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
  white-space: normal;
  word-break: keep-all;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 12px;
  width: 60%;
`;

const ActionButton = styled.button`
  background: ${({ color }) => color || '#FF7E19'};
  color: #fff;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(16)}px; // ← 기존 14 → 16
  padding: 14px 22px; // ← 기존보다 넉넉하게
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
`;





 const EtcIntroWrapper = styled.div`
  width: 90%;
  margin: 20px auto 10px auto;
  padding-top: 10px;
  text-align: center;
`;

 const EtcIntroTitle = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(17)}px;
  color: #2C2C2C;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;

  letter-spacing: -0.5px;
`;



const MobileEtcCard =() =>  {

    const { dispatch, user } = useContext(UserContext);


    const navigate = useNavigate();
  

    const goToMedicine = () => {
      
      navigate("/Mobilecommunitycontent", { state: { name: MEDICALMENU.MEDICALMEDICINE, search: "" } });

    }
    const goToHealthfood = () => {
      navigate("/Mobilecommunitycontent", { state: { name: MEDICALMENU.FOODINFOMATION, search: "" } });  
    }

    return (
      <div style={{margin: "50px auto 20px"}}>
        <EtcIntroWrapper>
            <EtcIntroTitle>
            복용 중인 약 섭취하는 건강식품이 <br />
                궁금할 땐 여기에서.
           </EtcIntroTitle>
        </EtcIntroWrapper>   
        <HealthCardWrapper>

          <CardIcon src={imageDB.medical} />
          <CardTitle>건강 정보 검색</CardTitle>
          <CardDesc>의약품과 건강식품 정보를 쉽고 빠르게 찾아보세요.</CardDesc>
          <ButtonGroup>
            <ActionButton color="#FF7E19" onClick={goToMedicine}>의약품 검색</ActionButton>
            <ActionButton color="#3A853B" onClick={goToHealthfood}>건강식품 조회</ActionButton>
          </ButtonGroup>

        </HealthCardWrapper>

      </div>
  );

}

export default MobileEtcCard;

