// LeftMessage.js
import React from 'react';
import styled from 'styled-components';
import { getDate, getDateEx3, getTime } from '../../utility/date';
import { getFontSize } from "../../utility/fontsize";
import { Column } from '../../common/Column';

const LeftMessage = ({ data, user,leftimage, ITEM, _handleimgView, leftname }) => {
    return (
        <ItemLayerA>
            <Row>
              <Column>
                <ChatUserImg>
                  <img
                    src={leftimage}
                    style={{ width: 32, height: 32, borderRadius: 32 }}
                  />
                </ChatUserImg>
                <ChatUsername>{leftname}</ChatUsername>
              
              </Column>
   
                <MessageRow>
                    {data.CHAT_CONTENT_TYPE === 'IMAGE' ? (
                        <img
                            src={data.TEXT}
                            style={{ height: '180px', padding: '10px', borderRadius: '20px' }}
                            onClick={() => _handleimgView(data.TEXT)}
                        />
                    ) : (

                        <ItemBoxA>{data.TEXT}</ItemBoxA>
                    )}
                    <ItemLayerAdate>
                      <ADate>{getDateEx3(data.CREATEDT)}</ADate>
                    </ItemLayerAdate>
          </MessageRow>
            </Row>
        </ItemLayerA>
    );
};

export default LeftMessage;


const ADate = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  text-align: left;
`;

const Row = styled.div`
  display: flex;
`;

const ItemLayerA = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ChatUserImg = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #000;
  padding-left: 10px;
  font-size: ${() => getFontSize(12)}px !important;
`;


const ChatUsername = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #000;
  padding-left: 10px;
  font-size: ${() => getFontSize(10)}px !important;
  padding-top:5px;
  color: #a3a3a3;
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top :20px;
`;

const ItemBoxA = styled.div`
  background: #ffffff; // 수신자용 – 흰색 말풍선
  border-radius: 18px;
  padding: 12px 16px;
  margin: 4px 10px 0px 6px;
  color: #1a1e28;
  max-width: 70%;
  font-size: ${() => getFontSize(14)}px !important;
  line-height: 1.5;
  text-align: left;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ItemLayerAdate = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #999999;
  margin-top: 4px;
  display: flex;
  justify-content: center;
`;


