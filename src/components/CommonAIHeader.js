// components/AIFriendHeader.jsx
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoTrashOutline } from 'react-icons/io5';
import { getFontSize } from '../utility/fontsize';
import { UserContext } from '../context/User';

const CommonAIHeader = ({ title, onBackPressed, onResetConversation, resetting = false }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);


    useEffect(() => {
        return () => {
            const mapDiv = document.getElementById("map");
            if (mapDiv) mapDiv.remove(); // ✅ 지도 DOM 제거
        };
    }, []);

    const handleBack = () => {
        navigate(-1);
    }
    

    return (
        <HeaderWrapper>
            <IconWrapper onClick={handleBack}>
                <IoArrowBackOutline size={24} color="#333" />
            </IconWrapper>
            <Title>{title}와 대화중</Title>

            <RightActions>
                <ResetBtn
                    role="button"
                    tabIndex={0}
                    aria-label="대화내용 삭제하기"
                    aria-disabled={resetting}
                    onClick={() => !resetting && onResetConversation?.()}
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !resetting) onResetConversation?.();
                    }}
                >
                    <IoTrashOutline size={15} />
                    <span>{resetting ? '삭제 중…' : '대화삭제'}</span>
                </ResetBtn>
            </RightActions>

        </HeaderWrapper>
    );
};

export default CommonAIHeader;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 52px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  z-index: 999;
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RightActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 0 0 auto;
  margin-right: calc(22px + env(safe-area-inset-right)); /* 아이폰 노치 대응 */
`;

const ResetBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: #f6f7fb;
  border: 1px solid #e6e8f0;
  color: #1A1E28;
  font-size: ${() => getFontSize(12)}px !important;
  cursor: pointer;
  user-select: none;
  transition: background .15s ease, transform .06s ease, opacity .2s ease;
  &:hover { background: #eef1f6; }
  &:active { transform: translateY(1px); }
  &[aria-disabled="true"] { opacity:.5; pointer-events:none; }
`;
