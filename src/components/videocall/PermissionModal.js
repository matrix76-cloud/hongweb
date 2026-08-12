import React from 'react';
import styled from 'styled-components';
import { getFontSize } from '../../utility/fontsize';

const PermissionModal = ({ onConfirm, onCancel }) => {
    return (
        <Backdrop>
            <ModalBox>
                <Title>🎥 영상통화를 위해 권한이 필요해요</Title>
                <Desc>카메라와 마이크 권한을 허용해주세요.</Desc>
                <ButtonRow>
                    <CancelButton onClick={onCancel}>취소</CancelButton>
                    <ConfirmButton onClick={onConfirm}>권한 허용</ConfirmButton>
                </ButtonRow>
            </ModalBox>
        </Backdrop>
    );
};

export default PermissionModal;

// ---- styles ----
const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 80%;
  max-width: 320px;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Desc = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #666;
`;

const ButtonRow = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const ConfirmButton = styled.button`
  flex: 1;
  margin-left: 6px;
  background: #FF7125;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
`;

const CancelButton = styled.button`
  flex: 1;
  margin-right: 6px;
  background: #eee;
  color: #333;
  border: none;
  padding: 10px;
  border-radius: 8px;
`;
