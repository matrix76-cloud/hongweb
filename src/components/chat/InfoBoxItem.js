// InfoBoxItem.jsx
import React from 'react';
import styled from 'styled-components';
import { Row } from '../../common/Row';
import ButtonEx from '../../common/ButtonEx';
import { imageDB } from '../../utility/imageData';
import { getFontSize } from "../../utility/fontsize";

const InfoBoxItem = ({ containerStyle, data, singlebutton, multibutton, buttonText1, subText, callback1, buttonText2, callback2 }) => {
    return (
        <InfoBox style={containerStyle}>
            <InfoBoxLayer>
                <Row>
                    <img src={imageDB.logo} style={{ width: 16 }} alt="logo" />
                    <AlarmTag>구해줘 알바 알림</AlarmTag>
                </Row>

                <div style={{ marginTop: 5 }}>
                    {Array.isArray(data.TEXT) ? (
                        data.TEXT.map((item, index) => (
                            data.TEXT.length === index + 1 ? (
                                <InfoText2 key={index}>{item}</InfoText2>
                            ) : (
                                <InfoText key={index}>{item}</InfoText>
                            )
                        ))
                    ) : (
                        <InfoText>{data.TEXT}</InfoText>
                    )}
                </div>

            </InfoBoxLayer>
        </InfoBox>
    );
};

export default InfoBoxItem;

const InfoBox = styled.div`
  font-size: ${() => getFontSize(14)}px;
  display: flex;
  flex-direction: row;
  width: 90%;
  margin: 10px auto;
  color: #131313;
`;

const InfoBoxLayer = styled.div`
  width: 100%;
  border: 1px solid #ededed;
  padding: 15px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: #f0f0f0;
`;

const AlarmTag = styled.div`
  color: #1a1e28;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  padding-left: 7px;
`;

const InfoText = styled.span`
  font-size: ${() => getFontSize(14)}px !important;
  letter-spacing: -0.5px;
  color: #66686f;
`;

const InfoText2 = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #66686f;
  background: #fff;
  padding: 10px;
  margin: 10px 0px;
`;
