import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import React, { useState, useEffect, useRef } from 'react';
import { imageDB } from "../utility/imageData";
import { LIFEMENU } from "../utility/life";
import { useNavigate } from "react-router-dom";

import { MdKitchen } from 'react-icons/md';

import { LuGlassWater } from 'react-icons/lu';
import { TbChefHat } from 'react-icons/tb';
import { MdStars } from 'react-icons/md';
import { FiTag } from 'react-icons/fi';
import { FaPlaneDeparture } from 'react-icons/fa';


// 🧩 기능 소개 그리드형 배너 (아이콘 없는 row형 구조)
const FeatureGrid = () => {

  const navigate = useNavigate();
  const features = [
    { label: '냉장고 관리', icon: <MdKitchen size={22} color="#FF7A00" />, name: LIFEMENU.FREEZE },
    { label: '레시피 정보', icon: <TbChefHat size={22} color="#FF7A00" />, name: LIFEMENU.RECIPE },
    { label: '운세 보기', icon: <MdStars size={22} color="#FF7A00" />, name: LIFEMENU.FORTUNE },
    { label: '특가 상품', icon: <FiTag size={22} color="#FF7A00" />, name: LIFEMENU.SALE },
    { label: '여행 정보', icon: <FaPlaneDeparture size={22} color="#FF7A00" />, name: LIFEMENU.TOUR },
    { label: '물섭취 관리', icon: <LuGlassWater size={22} color="#FF7A00" />, name: LIFEMENU.WATER },
    ];
  
  const FeatureFunc = (item) => {
      
    if (item.name == LIFEMENU.TOUR) {
      navigate('/MobileLeisure')
    } else {
      navigate('/Mobileconfigcontent', { state: { NAME: item.name, TYPE: '' } })
    }


  }


    return (
        <GridContainer>
            <GridTitle>이런 기능도 있어요</GridTitle>
            <Grid>
          {features.map((f, i) => (
            <GridItem key={i} onClick={() => {FeatureFunc(f)}}>
                        <RowContent>
                            {f.icon}
                            <GridLabel>{f.label}</GridLabel>
                        </RowContent>
                    </GridItem>
                ))}
            </Grid>
        </GridContainer>
    );
};

export default FeatureGrid;

const GridContainer = styled.div`
    margin-top: 24px;

  `;

const GridTitle = styled.div`
    font-size: ${() => getFontSize(18)}px !important;
    font-family: Pretendard-Bold;
    color: #111;
    margin-bottom: 12px;
  `;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 16px;
  `;

const GridItem = styled.div`
    background-color: #f6f5f5;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    align-items: center;

      &:hover ${'' /* PlainIcon에 hover 효과 */} {
    filter: brightness(1.1);
    transform: scale(1.05);
    transition: all 0.2s ease;
  }
  `;

const RowContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  `;

const PlainIcon = styled.img`
    width: 38px;
    height:38px;

  `;

const GridLabel = styled.div`
    font-size: ${() => getFontSize(14)}px !important;
    font-weight: 500;
    color: #1A1E27;
    font-family: Pretendard-SemiBold;
  `;
  