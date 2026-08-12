import React, { useState } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';

const WorkerStatsCard = ({ categoryData }) => {
    const [showPopup, setShowPopup] = useState(false);
    console.log("WorkerStatsCard", categoryData);
    const [showAll, setShowAll] = useState(false);
    const maxCategory = Math.max(
        ...Object.values(categoryData || {}).map(v => v && typeof v === 'object' && 'total' in v ? v.total : 0)
      );
    const sortedEntries = Object.entries(categoryData || {}).sort((a, b) => b[1].total - a[1].total);
    const visibleEntries = Array.isArray(sortedEntries) ? (showAll ? sortedEntries : sortedEntries.slice(0, 3)) : [];
  
    const totalFemale = getTotalFemale(categoryData);
    const totalMale = getTotalMale(categoryData);
    const total = totalFemale + totalMale;
    const femaleRatio = total > 0 ? totalFemale / total : 0;
    const maleRatio = 1 - femaleRatio;
    const makePiePath = (percent, radius = 36, cx = 40, cy = 40) => {
        const adjustedPercent = Math.max(percent, 0.015); // 최소 시각 보장
        const angle = adjustedPercent * 360;
        const radians = (Math.PI / 180) * angle;
        const x = cx + radius * Math.cos(radians - Math.PI / 2);
        const y = cy + radius * Math.sin(radians - Math.PI / 2);
        const largeArc = angle > 180 ? 1 : 0;
        return `M${cx},${cy} L${cx},${cy - radius} A${radius},${radius} 0 ${largeArc} 1 ${x},${y} Z`;
    };



    console.log("visibleEntries", visibleEntries);

    return (
        <CardContainer>
            <SectionTitle>어떤 일에 사람들이 많이 몰렸을까요?</SectionTitle>
            {/* {visibleEntries.map(([label, value]) => (
                <ItemBox key={label}>
                    <ProgressRow>
                        <Label>{label}</Label>
                        <Bar>
                            <Fill style={{ width: `${(value.total / maxCategory) * 100}%` }} />
                        </Bar>
                        <Count>{value.total}명</Count>
                    </ProgressRow>
                    <GenderLine>
                        여자 {value.female}명 / 남자 {value.male}명
                    </GenderLine>
                </ItemBox>
            ))}
            {sortedEntries.length > 3 && (
                <MoreButton onClick={() => setShowPopup(true)}>
                    자세히 보기
                </MoreButton>
            )}

            {showPopup && (
                <PopupOverlay onClick={() => setShowPopup(false)}>
                    <PopupContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setShowPopup(false)}>✕ 닫기</CloseButton>
                        <div style={{ fontSize: getFontSize(16), marginBottom: 12 }}>전체 항목</div>
                        {sortedEntries.map(([label, value]) => {
                            const total = value.female + value.male;
                            const femaleRatio = total > 0 ? value.female / total : 0;
                            const maleRatio = 1 - femaleRatio;
                            return (
                                <ItemBox key={label}>
                                    <ProgressRow>
                                        <Label>{label}</Label>
                                        <Bar>
                                            <Fill style={{ width: `${(value.total / maxCategory) * 100}%` }} />
                                        </Bar>
                                        <Count>{value.total}명</Count>
                                    </ProgressRow>
                                    <RowWrapper>
                                        <PiePreview>
                                            {
                                                total === 0 ? (
                                                    <svg width="80" height="80" viewBox="0 0 80 80">
                                                        <circle r="36" cx="40" cy="40" fill="#E0E0E0" />
                                                    </svg>
                                                ) : total === value.female ? (
                                                    <svg width="80" height="80" viewBox="0 0 80 80">
                                                        <circle r="36" cx="40" cy="40" fill="#FF4D6D" />
                                                    </svg>
                                                ) : total === value.male ? (
                                                    <svg width="80" height="80" viewBox="0 0 80 80">
                                                    <circle r="36" cx="40" cy="40" fill="#007ACC" />
                                                    </svg>
                                                ) : (
                                                    <svg width="80" height="80" viewBox="0 0 80 80">
                                                        <circle r="36" cx="40" cy="40" fill="#007ACC" />
                                                        <path d={makePiePath(femaleRatio)} fill="#FF4D6D" />
                                                    </svg>
                                                )
                                            }
                                            <PieText>
                                                🔴 여성 {value.female}명 / 🔵 남성 {value.male}명
                                            </PieText>
                                        </PiePreview>
                                        <SimpleTable>
                                            <tbody>
                                                <tr><th>20대</th><td>{value.age20 || 0}명</td></tr>
                                                <tr><th>30대</th><td>{value.age30 || 0}명</td></tr>
                                                <tr><th>40대</th><td>{value.age40 || 0}명</td></tr>
                                                <tr><th>50대</th><td>{value.age50 || 0}명</td></tr>
                                                <tr><th>60대+</th><td>{value.age60 || 0}명</td></tr>
                                            </tbody>
                                        </SimpleTable>
                                    </RowWrapper>
                                </ItemBox>
                            );
                        })}
             
                    </PopupContent>
                </PopupOverlay>
            )} */}
        </CardContainer>
    );
};

const getTotalFemale = (data) => {
    return Object.values(data || {}).reduce((sum, v) => sum + (v.female || 0), 0);
};
const getTotalMale = (data) => {
    return Object.values(data || {}).reduce((sum, v) => sum + (v.male || 0), 0);
};
  


export default WorkerStatsCard;
const CardContainer = styled.div`
  margin-top: 12px;
  background: #fff6e0;
  border-radius: 12px;

`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: ${() => getFontSize(15)}px !important;
  margin-bottom: 8px;
  padding: 16px 0px 0px 16px;
`;

const ItemBox = styled.div`
 background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  background-image: linear-gradient(
    135deg,
    rgba(255,255,255,0.04) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.04) 50%,
    rgba(255,255,255,0.04) 75%,
    transparent 75%,
    transparent
  );
  background-size: 16px 16px;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Label = styled.div`
  width: 100px;
  font-size: ${() => getFontSize(14)}px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Bar = styled.div`
  flex: 1;
  background: #eee;
  border-radius: 9999px;
  height: 14px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  background: #2D6FF7;
  border-radius: 9999px;
`;

const Count = styled.div`
  width: 40px;
  text-align: right;
  font-size: ${() => getFontSize(13)}px !important;
`;

const GenderLine = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #555;
  margin-top: 2px;
  text-align: right;
`;

const MoreButton = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  color: #2D6FF7;
  cursor: pointer;
`;

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: #fff;

  padding: 24px;
  width: 90%;
  max-height: 75vh;
  overflow-y: auto;
  position: relative;
`;

const PiePreview = styled.div`
  margin-top: 16px;
  font-size: ${() => getFontSize(13)}px !important;
  text-align: center;
  color: #333;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PieText = styled.div`
  margin-top: 8px;
  font-size: ${() => getFontSize(13)}px !important;
  white-space: nowrap;
`;

const AgeStats = styled.div`
  margin-top: 16px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #333;
`;

const PieGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 6px;
`;

const PieLabel = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #555;
  margin-top: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: bold;
  cursor: pointer;
  color: #333;
`;


const PieAndTableRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
  flex-wrap: wrap;
`;

const SimpleTable = styled.table`

  margin-left: 12px;
  border-collapse: collapse;
  font-size: ${() => getFontSize(13)}px !important;
  color: #333;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  th, td {
    padding: 4px 8px;
    text-align: left;
    font-size: ${() => getFontSize(13)}px !important;
  }

  th {
    color: #666;
    font-size: ${() => getFontSize(13)}px !important;
    width: 60px;
  }
`;
const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 0;
  margin-top: 12px;
  width: 100%;

  & > div, & > table {
    width: 50%;
  }
`;