import React from "react";
import styled from "styled-components";
import { getFontSize } from "../../utility/fontsize";
import { VIDEO_LAYER_Z_INDEX } from "./constants";

// ✅ callerName: 발신자의 이름, 없을 시 기본값은 "상대방"
// ✅ onAccept: 수락 버튼을 눌렀을 때 실행되는 콜백 함수
// ✅ onReject: 거절 버튼을 눌렀을 때 실행되는 콜백 함수
// 상대방이 나에게 영상통화를 걸면 Firestore에 offer 생성
// 나는 실시간 감지해서 setIncomingCall({ chatId, callerName })
// 그걸 보고 IncomingCallModal을 렌더링
// 사용자가[수락] 누르면 → onAccept() 호출 → acceptCall() 실행
// 사용자가[거절] 누르면 → onReject() → 모달 닫고 흐름 종료

const IncomingCallModal = ({ callerName = "상대방", onAccept, onReject }) => {
    return (
        <Backdrop>
            <ModalBox>
                <Title>📞 영상통화 요청</Title>
                <Description>
                    <strong>{callerName}</strong> 님이 영상통화를 요청했어요.
                </Description>
                <SubText>얼굴 보고 이야기해볼까요?</SubText>

                <ButtonGroup>
                    <RejectButton onClick={onReject}>거절</RejectButton>
                    <AcceptButton onClick={onAccept}>수락</AcceptButton>
                </ButtonGroup>
            </ModalBox>
        </Backdrop>
    );
};

export default IncomingCallModal;

// -------- styled --------
const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: ${VIDEO_LAYER_Z_INDEX};
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* ✅ 모바일에서 보장 */
`;

const ModalBox = styled.div`
  width: 80%;
  max-width: 320px;
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Description = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  color: #222;
`;

const SubText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #777;
  margin-top: 6px;
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const AcceptButton = styled.button`
  flex: 1;
  background: #FF7125;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 16px;
  margin-left: 6px;
  border-radius: 8px;
  cursor: pointer;
`;

const RejectButton = styled.button`
  flex: 1;
  background: #ccc;
  color: #222;
  font-weight: bold;
  border: none;
  padding: 10px 16px;
  margin-right: 6px;
  border-radius: 8px;
  cursor: pointer;
`;
