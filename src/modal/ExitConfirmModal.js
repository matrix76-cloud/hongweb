import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { imageDB } from '../utility/imageData';


const ExitConfirmModal = ({ onConfirm, onCancel }) => {
    return (
        <Overlay>
            <ModalBox>
                <ContentRow>
                    <Icon src={imageDB.hongladywebtoon} alt="구해줘 알바 아이콘" />
                    <Message>앱을 종료하시겠습니까?</Message>
                </ContentRow>
                <ButtonRow>
                    <CancelButton onClick={onCancel}>취소</CancelButton>
                    <ConfirmButton onClick={onConfirm}>예</ConfirmButton>
                </ButtonRow>
            </ModalBox>
        </Overlay>
    );
};

export default ExitConfirmModal;


const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 80%;
  max-width: 320px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  text-align: center;
`;

const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 16px;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
`;

const Message = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
  font-family: 'Pretendard-SemiBold';
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  font-size: ${() => getFontSize(14)}px !important;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: #ff7e19;
  color: #fff;
  font-size: ${() => getFontSize(14)}px !important;
  cursor: pointer;
`;
