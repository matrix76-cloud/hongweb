// RightMessage.js
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getDate, getDateEx3, getTime } from '../../utility/date';
import { getFontSize } from "../../utility/fontsize";
import { COLORS } from '../../utility/colors';


const RightMessage = ({ data, user, _handleimgView, uploading }) => {





    return (
        <ItemLayerB>
            <ItemLayerBBox>
                <ItemLayerBdate>
            <BDate>{getDateEx3(data.CREATEDT)}</BDate>

                </ItemLayerBdate>
            </ItemLayerBBox>
            {uploading && data.TEMP_ID === 'uploading-image' ? (
                <LoadingWrapper><Spinner /></LoadingWrapper>
            ) : data.CHAT_CONTENT_TYPE === 'IMAGE' ? (
                <img
                    src={data.TEXT}
                    onClick={() => _handleimgView(data.TEXT)}
                    style={{ height: '180px', padding: '10px', borderRadius: '20px' }}
                />
            ) : (
                <ItemBoxB>{data.TEXT}</ItemBoxB>
            )}
        </ItemLayerB>
    );
};

export default RightMessage;

const ItemLayerB = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px; // 오른쪽 여백 주기

`;

const ItemLayerBBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ItemBoxB = styled.div`
 background: #dcf8c6; // 송신자용 – 연두색 말풍선
  border-radius: 18px;
  padding: 12px 16px;
  margin: 4px 6px 0px 10px;
  color: #1a1e28;
  max-width: 60%;
  font-size: ${() => getFontSize(14)}px !important;
  line-height: 1.5;
  text-align: left;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ItemLayerBdate = styled.div`
 font-size: ${() => getFontSize(11)}px !important;
  color: #999999;
  margin-top: 4px;
  padding-bottom: 8px;
  display: flex;
  justify-content: flex-end;
`;
const BDate = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  text-align: left;
`;


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-top: 4px solid ${COLORS.primary}; // ✅ primary 컬러로 교체
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #fff0e9;
  border-radius: 10px;
  margin: 10px 10px 0px;
  height: 180px;
`;

