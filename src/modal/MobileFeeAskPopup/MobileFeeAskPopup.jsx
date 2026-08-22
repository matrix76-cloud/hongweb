import React, { useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/**
 * 수수료 제안 받기 — 일하는 사람 화면에 뜨는 창. (형 지시 2026-08-20)
 *
 * 의뢰한 분이 금액을 보내면 대화방에 들어오는 순간 이 창이 뜬다.
 * 수락하면 계약이 서고, 거절하면 의뢰한 분이 금액을 다시 보낼 수 있다.
 */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Box = styled.div`
  width: 100%;
  max-width: 340px;
  box-sizing: border-box;
  background: var(--surface);
  border-radius: 16px;
  padding: 24px 20px 16px;
  text-align: center;
`;

const From = styled.div`
  font-size: 15px;
  color: #636363;
`;

const Amount = styled.div`
  margin-top: 10px;
  font-size: 34px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.01em;
`;

const Ask = styled.div`
  margin-top: 12px;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text);
`;

const Note = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #636363;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Btn = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border: ${({ $kind }) => ($kind === "ghost" ? "1px solid var(--border)" : "none")};
  background: ${({ $kind }) => ($kind === "ghost" ? "var(--surface)" : "#FF4E19")};
  color: ${({ $kind }) => ($kind === "ghost" ? "var(--text)" : "#fff")};
  &:disabled { opacity: .45; cursor: default; }
`;

const Later = styled.button`
  margin-top: 6px;
  width: 100%;
  height: 40px;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 15px;
  color: #636363;
  cursor: pointer;
`;

/**
 * @param amount    제안된 금액
 * @param fromName  보낸 사람 이름
 * @param onAccept  수락
 * @param onReject  거절
 * @param onLater   나중에 (창만 닫는다 — 제안은 그대로 남는다)
 */
const MobileFeeAskPopup = ({ amount, fromName, onAccept, onReject, onLater }) => {
  const [busy, setBusy] = useState("");
  const won = `${(Number(amount) || 0).toLocaleString("ko-KR")}원`;

  const run = async (kind, fn) => {
    if (busy) return;
    setBusy(kind);
    await fn?.();
  };

  return createPortal(
    <Dim>
      <Box>
        <From>{fromName ? `${fromName} 님이 보낸 수수료` : "의뢰하신 분이 보낸 수수료"}</From>
        <Amount>{won}</Amount>
        <Ask>{won}에 하시겠습니까?</Ask>
        <Note>수락하시면 계약이 됩니다. 그 뒤에 의뢰하신 분이 결제합니다.</Note>

        <Buttons>
          <Btn $kind="ghost" onClick={() => run("reject", onReject)} disabled={!!busy}>
            {busy === "reject" ? "처리 중..." : "거절"}
          </Btn>
          <Btn onClick={() => run("accept", onAccept)} disabled={!!busy}>
            {busy === "accept" ? "처리 중..." : "수락하기"}
          </Btn>
        </Buttons>

        <Later onClick={onLater} disabled={!!busy}>나중에 결정할게요</Later>
      </Box>
    </Dim>,
    document.body
  );
};

export default MobileFeeAskPopup;
