// 📦 FortuneInfoSettingModal (combo 스타일로 리팩터링)
import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 32px 24px;
  border-radius: 20px;
  width: 72%;
  max-width: 360px;
  font-family: 'Pretendard';
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h3`
  font-size: 18px;
  color: #2C2C2C;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const Select = styled.select`
  width: 100%;
  margin-top: 16px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 15px;
  box-sizing: border-box;

  &:first-of-type {
    margin-top: 0; // 첫 Select는 위에 여백 없음
  }
`;

const InfoText = styled.div`
  margin-top: 24px;
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const SaveButton = styled.button`
  margin-top: 24px;
  background: #f38d13;
  color: #fff;
  border: none;
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #d97706;
  }
`;

const CloseButton = styled.button`
  margin-top: 12px;
  background: #ddd;
  color: #333;
  border: none;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
`;

export const MobileFortuneInfoSettingModal = ({ defaultInfo, onSave, onClose }) => {
  const [birthYear, setBirthYear] = useState(defaultInfo.year || '');
  const [birthMonth, setBirthMonth] = useState(defaultInfo.month || '');
  const [birthDay, setBirthDay] = useState(defaultInfo.day || '');
  const [birthTime, setBirthTime] = useState(defaultInfo.time || '');

  const handleSave = () => {
    if (!birthYear || !birthMonth || !birthDay || !birthTime) {
      alert('모든 항목을 선택해주세요.');
      return;
    }

    const info = {
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      time: birthTime,
      isLunar: true,
    };
    onSave(info);
  };

  return (
    <ModalBackdrop>
      <ModalBox>
        <Title>운세 정보를 수정할 수 있어요</Title>

        <Select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
          <option value="">출생 연도 선택</option>
          {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </Select>

        <Select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
          <option value="">월 선택</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </Select>

        <Select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
          <option value="">일 선택</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{d}일</option>
          ))}
        </Select>

        <Select value={birthTime} onChange={(e) => setBirthTime(e.target.value)}>
          <option value="">출생 시간 선택</option>
          <option value="자시">자시 (23:00~01:00)</option>
          <option value="축시">축시 (01:00~03:00)</option>
          <option value="인시">인시 (03:00~05:00)</option>
          <option value="묘시">묘시 (05:00~07:00)</option>
          <option value="진시">진시 (07:00~09:00)</option>
          <option value="사시">사시 (09:00~11:00)</option>
          <option value="오시">오시 (11:00~13:00)</option>
          <option value="미시">미시 (13:00~15:00)</option>
          <option value="신시">신시 (15:00~17:00)</option>
          <option value="유시">유시 (17:00~19:00)</option>
          <option value="술시">술시 (19:00~21:00)</option>
          <option value="해시">해시 (21:00~23:00)</option>
        </Select>

        <SaveButton onClick={handleSave}>저장하기</SaveButton>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalBox>
    </ModalBackdrop>
  );
};
