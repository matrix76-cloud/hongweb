import React from 'react';
import styled, { keyframes } from 'styled-components';
import { imageDB } from '../../utility/imageData';

/**
 * 바텀시트 필터 공통 껍데기 (형 리뷰 2026-08-12 "필터가 바텀에서 올라오는 부분 모두 좀 세련되게").
 *
 * 기존엔 MUI Modal 을 top:85% · width:400px · height 고정으로 띄워서
 * 화면 가운데에 어정쩡하게 걸치고, 기기 폭이 400 이 아니면 좌우가 잘리거나 떴다.
 * 여기서는 진짜 바텀시트로 — 아래에 딱 붙고, 좌우 꽉 차고, 위로 밀려 올라온다.
 *
 * 쓰는 쪽은 제목/항목/선택여부만 넘기면 된다.
 *   <MobileFilterSheet title="..." onClose={...} onApply={...}>
 *     <FilterOption .../>
 *   </MobileFilterSheet>
 */

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const slideup = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(19, 19, 19, 0.45);
  animation: ${fadein} 0.2s ease-out;
`;

const Sheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1201;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.12);
  animation: ${slideup} 0.26s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  max-height: 82vh;
  overflow: hidden;
`;

/* 잡는 손잡이 — 시트라는 걸 알려주는 표시 */
const Grabber = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 100px;
  background: #E0E0E0;
  margin: 10px auto 2px;
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 14px;
  flex-shrink: 0;
`;
/* 제목 앞 아이콘 (형 리뷰 2026-08-13) */
const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;
const TitleIcon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: var(--text);
`;
const Title = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const CloseButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: -6px;
  &:active { opacity: 0.5; }
`;

/* 항목 영역 — 개수가 달라도 시트 키가 들쭉날쭉하지 않게 최소 높이를 잡는다 */
const Body = styled.div`
  padding: 0 20px 8px;
  overflow-y: auto;
  min-height: ${({ $minheight }) => $minheight || 160}px;
  flex: 1 1 auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => `repeat(${$columns || 2}, 1fr)`};
  gap: 10px;
  padding-bottom: 4px;
`;

const Option = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 52px;
  padding: 0 14px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  background: var(--surface);
  border: 1px solid ${({ $on }) => ($on ? '#FF4E19' : '#E6E6E6')};
  box-shadow: ${({ $on }) => ($on ? 'inset 0 0 0 1px #FF4E19' : 'none')};
  transition: border-color 0.15s ease, transform 0.12s ease;
  &:active { transform: scale(0.98); }
`;
const OptionText = styled.span`
  font-size: 16px;
  font-weight: ${({ $on }) => ($on ? 700 : 500)};
  color: ${({ $on }) => ($on ? '#FF4E19' : 'var(--text)')};
  line-height: 1.3;
  word-break: keep-all;
`;
/* 선택 표시는 체크 하나로 통일. 안 고른 항목엔 빈 자리를 남겨 글자가 흔들리지 않게 한다 */
const CheckSlot = styled.span`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.div`
  flex-shrink: 0;
  padding: 12px 20px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border-soft);
  background: var(--surface);
`;
const ApplyButton = styled.div`
  height: 54px;
  border-radius: 12px;
  background: #FF4E19;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:active { opacity: 0.85; }
`;

/** 시트 안의 선택 항목 하나 */
export const FilterOption = ({ label, selected, onClick }) => (
  <Option $on={selected} onClick={onClick}>
    <OptionText $on={selected}>{label}</OptionText>
    <CheckSlot>
      {selected && <img src={imageDB.check_e} alt="" style={{ width: 16, height: 16 }} />}
    </CheckSlot>
  </Option>
);

const MobileFilterSheet = ({ title, icon, onClose, onApply, children, minheight, applytext = '적용하기' }) => (
  <>
    <Dim onClick={onClose} />
    <Sheet role="dialog" aria-label={title}>
      <Grabber />
      <Header>
        <TitleWrap>
          {icon && <TitleIcon>{icon}</TitleIcon>}
          <Title>{title}</Title>
        </TitleWrap>
        <CloseButton onClick={onClose}>
          <img src={imageDB.close} alt="닫기" style={{ width: 20, height: 20 }} />
        </CloseButton>
      </Header>
      <Body $minheight={minheight}>{children}</Body>
      <Footer>
        <ApplyButton onClick={onApply}>{applytext}</ApplyButton>
      </Footer>
    </Sheet>
  </>
);

export default MobileFilterSheet;
