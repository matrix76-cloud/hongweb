// 📦 FortuneInfoInitModal (모든 항목 combo 방식으로 리팩터링)
import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'sonner';
import { getFontSize, isIOS } from '../utility/fontsize';
import { useNavigate } from 'react-router-dom';

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
  font-size: ${getFontSize(18)}px;
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
  font-size: ${getFontSize(15)}px;
  box-sizing: border-box;
  height: ${isIOS() ? '55px' : '50px'};
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
  font-size: ${getFontSize(16)}px;
  font-weight: 600;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #d97706;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${getFontSize(32)}px;
  color: #999;
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: 12px;

  &:hover {
    color: #555;
  }
`;

export const MobileFortuneInfoInitModal = ({ onSave }) => {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthTime, setBirthTime] = useState('');

  const navigate = useNavigate();

  const handleSave = () => {
    if (!birthYear || !birthMonth || !birthDay || !birthTime) {
      toast.warning('모든 정보를 정확히 선택해주세요.');
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

  const _handlePrev = () => {
    navigate(-1);
  }

  return (
    <ModalBackdrop>
   
      <ModalBox>
        <CloseButton onClick={() => _handlePrev()}>×</CloseButton>
        <Title>
          오늘의 운세를 전해드리기 위해<br />
          태어난 날과 시간을 알려주세요
        </Title>

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

        <InfoText>※ 모든 운세는 음력 기준으로 해석됩니다</InfoText>

        <SaveButton onClick={handleSave}>정보 저장하고 운세 보기</SaveButton>
      </ModalBox>
    </ModalBackdrop>
  );
};
