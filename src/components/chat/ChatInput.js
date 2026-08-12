import React, { useRef } from 'react';
import styled from 'styled-components';
import { SlPaperClip } from 'react-icons/sl';
import { imageDB } from '../../utility/imageData';
import { getFontSize } from "../../utility/fontsize";
import { BetweenRow } from '../../common/Row';

const ChatInput = ({ message, setMessage, handleUploadClick, _handlesend, handlefileuploadChange, fileInput, isBlocked}) => {
    const textareaRef = useRef(null);

    const handleResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const _handleUploadClick = () => {
        handleUploadClick();
    };

    return (
      <>
        {
          isBlocked ? (
            <div style={{ padding: 16, color: '#999', textAlign: 'center', background:"#fff" }} >
              상대방이 채팅방을 나갔습니다.메시지를 보낼 수 없습니다.
            </div>
          ) : (
            <BottomLine>
              <StyledTextarea
                ref={textareaRef}
                rows={1}
                value={message}
                placeholder="메시지입력"
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleResize(e);
                }}
              />


              <ButtonLine>
                <UploadIcon onClick={handleUploadClick}>
                  <SlPaperClip size={20} />
                </UploadIcon>

                <SendButton onClick={_handlesend}>
                  <img src={imageDB.ic_chat_btn_send_nor} style={{ width: 24 }} />
                </SendButton>
              </ButtonLine>

              <input
                type="file"
                ref={fileInput}
                onChange={handlefileuploadChange}
                style={{ display: "none" }}
              />



            </BottomLine>
          )}
      </>

    );
};

export default ChatInput;




const ChatbtnLayer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 95%;
  margin: 0 auto;
  gap: 10px;
`;

const ChatIconLayer = styled.div`
  display: flex;
  width: 10%;
  justify-content: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  background: #ffffff;
  border-radius: 20px;
  padding: 10px 14px;
  margin: 0 10px;
  box-shadow: 0 0 0 1.5px #f0d5b3 inset;
  font-family: 'Pretendard', sans-serif;
  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
`;


const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: ${() => getFontSize(15)}px !important;
  font-family: 'Pretendard-Light';
  color: #333;
  outline: none;

  &::placeholder {
    color: #999;
    text-align: center;
    font-family: 'Pretendard-Light';
  }
`;


const BottomLine = styled.div`
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 12px 16px 12px 16px;
`;


const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  overflow-y: auto;
  min-height: 44px;
  max-height: 120px;
  padding:  0px; /* 좌우 여백 제거 */
  font-size: ${() => getFontSize(15)}px !important;
  font-family: 'Pretendard-Light';
  color: #333;
  background: transparent; // ✅ 배경 없애기
  outline: none;
  line-height: 1.5;
  text-align: left;
  vertical-align: top;

  &::placeholder {
    color: #bbb;
    padding: 0px;
    font-family: 'Pretendard-Light';
    text-align: left;
    font-size: ${() => getFontSize(15)}px !important;
  }
`;


const ButtonLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  
`;

const UploadIcon = styled.div`
  cursor: pointer;
`;

const SendButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  padding: 4px;
  cursor: pointer;

  img {
    width: 24px;
  }
`;