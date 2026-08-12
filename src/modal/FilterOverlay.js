import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WORKNAME } from '../utility/work';
import { getFontSize } from '../utility/fontsize';

const CATEGORY_LIST = Object.entries(WORKNAME)
    .filter(([key]) => key !== 'ALLWORK')
    .map(([code, label]) => ({ code, label }));

const GENDER_OPTIONS = ['남성', '여성'];
const AGE_OPTIONS = ['10대', '20대', '30대', '40대', '50대 이상'];
const DISTANCE_OPTIONS = [2, 5, 7];

const FilterOverlay = ({
    show,
    onClose,
    selectedCategories,
    setSelectedCategories,
    selectedGenders,
    setSelectedGenders,
    selectedAges,
    setSelectedAges,
    selectedDistance,
    setSelectedDistance,
    getMatchedCount,
}) => {
    const [matchedCount, setMatchedCount] = useState(0);

    useEffect(() => {
        localStorage.setItem('filter_categories', JSON.stringify(selectedCategories));
    }, [selectedCategories]);
    useEffect(() => {
        localStorage.setItem('filter_genders', JSON.stringify(selectedGenders));
    }, [selectedGenders]);
    useEffect(() => {
        localStorage.setItem('filter_ages', JSON.stringify(selectedAges));
    }, [selectedAges]);
    useEffect(() => {
        localStorage.setItem('filter_distance', selectedDistance);
    }, [selectedDistance]);

    useEffect(() => {
        const filters = {
            selectedCategories,
            selectedGenders,
            selectedAges,
            selectedDistance,
        };
        if (getMatchedCount) {
            const count = getMatchedCount(filters);
            setMatchedCount(count);
        }
    }, [selectedCategories, selectedGenders, selectedAges, selectedDistance, getMatchedCount]);

    const toggle = (setter, value) => {
        setter((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    if (!show) return null;

    return (
        <Overlay onClick={onClose}>
            <FilterBox onClick={(e) => e.stopPropagation()}>
                <Section>
                    <SectionTitle>카테고리</SectionTitle>
                    <ButtonGrid>
                        <ToggleButton
                            active={selectedCategories.length === 0}
                            onClick={() => setSelectedCategories([])}
                        >
                            전체보기
                        </ToggleButton>
                        {CATEGORY_LIST.map((cat) => (
                            <ToggleButton
                                key={cat.code}
                                active={selectedCategories.includes(cat.label)}
                                onClick={() => toggle(setSelectedCategories, cat.label)}
                            >
                                {cat.label}
                            </ToggleButton>
                        ))}
                    </ButtonGrid>
                </Section>

                <Section>
                    <SectionTitle>성별</SectionTitle>
                    <ButtonGrid>
                        {GENDER_OPTIONS.map((gender) => (
                            <ToggleButton
                                key={gender}
                                active={selectedGenders.includes(gender)}
                                onClick={() => toggle(setSelectedGenders, gender)}
                            >
                                {gender}
                            </ToggleButton>
                        ))}
                    </ButtonGrid>
                </Section>

                <Section>
                    <SectionTitle>연령대</SectionTitle>
                    <ButtonGrid>
                        {AGE_OPTIONS.map((age) => (
                            <ToggleButton
                                key={age}
                                active={selectedAges.includes(age)}
                                onClick={() => toggle(setSelectedAges, age)}
                            >
                                {age}
                            </ToggleButton>
                        ))}
                    </ButtonGrid>
                </Section>
{/* 
                <Section>
                    <SectionTitle>거리</SectionTitle>
                    <ButtonGrid>
                        {DISTANCE_OPTIONS.map((dist) => (
                            <ToggleButton
                                key={dist}
                                active={selectedDistance === dist}
                                onClick={() => setSelectedDistance(dist)}
                            >
                                {dist}km 이내
                            </ToggleButton>
                        ))}
                    </ButtonGrid>
                </Section> */}

                <CountText>총 <strong>{matchedCount}</strong>명 검색되었습니다.</CountText>

                <ButtonRow>
                    <CancelButton onClick={onClose}>닫기</CancelButton>
                    <ApplyButton onClick={onClose}>적용하기</ApplyButton>
                </ButtonRow>
            </FilterBox>
        </Overlay>
    );
};

export default FilterOverlay;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #494545c9;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  overflow-y: auto;
`;

const FilterBox = styled.div`
  width: 90%;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Section = styled.div``;

const SectionTitle = styled.h4`
  color: white;
  font-size: ${() => getFontSize(16)}px !important;
  margin-bottom: 4px;
  font-weight: 600;
  font-family: Pretendard-SemiBold;
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const ToggleButton = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  padding: 5px 8px;
  border-radius: 5px;
  background: ${({ active }) => (active ? '#2D6FF7' : '#111')};
  color: ${({ active }) => (active ? '#fff' : '#bbb')};
  cursor: pointer;
  white-space: nowrap;
  display: inline-block;
  user-select: none;
  transition: background 0.2s ease;
`;

const CountText = styled.div`
    color: #000000;
    font-size: ${() => getFontSize(14)}px !important;
    background: rgb(255 255 255 / 65%);
    padding: 6px 12px;
    border-radius: 8px;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 8px;
    font-family: 'Pretendard-SemiBold';

`;


const ApplyButton = styled.div`
  background: #2D6FF7;
  color: white;
  font-size: ${() => getFontSize(16)}px !important;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
`;

const CancelButton = styled.div`
  background: #ccc;
  color: #222;
  font-size: ${() => getFontSize(16)}px !important;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom:30px;
`;