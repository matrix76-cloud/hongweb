import React from 'react';
import styled, { keyframes } from 'styled-components';
import { getDateEx3 } from '../../utility/date';
import { getFontSize } from "../../utility/fontsize";
import { COLORS } from '../../utility/colors';

const AIRightMessage = ({ data, user, _handleimgView, uploading }) => {
  return (
    <ItemLayerB>
      <ItemLayerBBox>
        <ItemBoxB>{data.TEXT}</ItemBoxB>
        <ItemLayerBdate>
          <BDate>{getDateEx3(data.CREATEDT)}</BDate>
        </ItemLayerBdate>
      </ItemLayerBBox>


    </ItemLayerB>
  );
};

export default AIRightMessage;

const ItemLayerB = styled.div`
    border-radius: 20px;
    color: #111;
    font-size: ${() => getFontSize(16)}px !important;
    line-height: 1.6;

    word-break: break-word;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ItemLayerBBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ItemBoxB = styled.div`
  display: flex;
  justify-content: flex-end;
  border-radius: 16px;
  margin: 4px 0px;
  color: #fff;
  font-size: ${() => getFontSize(14)}px !important;
  line-height: 1.6;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(1px);
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
  border: 4px solid #eee;
  border-top: 4px solid ${COLORS.primary};
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

const StyledImage = styled.img`
  height: 180px;
  border-radius: 16px;
  padding: 10px;
`;
