import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/**
 * 확인 · 입력 · 알림 창 (공용). (형 지시 2026-08-12)
 *
 * window.confirm / prompt / alert 는 브라우저 기본 창이라 앱 안에서 튄다.
 * 셋을 이 하나로 대신한다. 필요한 것만 넘기면 그 모양으로 나온다.
 *
 *   확인/취소 : <MobileConfirmPopup title="…" message="…" onConfirm={} onCancel={} />
 *   입력      : ... input={{ placeholder:'사유' }} onConfirm={(값)=>{}}
 *   알림      : ... alertonly
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
  max-width: 320px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16px;
  padding: 22px 20px 16px;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #131313;
`;

const Message = styled.div`
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.6;
  color: #636363;
  white-space: pre-wrap;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin-top: 14px;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #E3E3E3;
  border-radius: 10px;
  font-size: 15px;
  color: #131313;
  outline: none;
  &:focus { border-color: #FF4E19; }
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
`;

const Btn = styled.button`
  flex: 1;
  height: 46px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border: ${({ $kind }) => ($kind === "ghost" ? "1px solid #E3E3E3" : "none")};
  background: ${({ $kind }) =>
    $kind === "ghost" ? "#fff" : $kind === "danger" ? "#c02020" : "#FF4E19"};
  color: ${({ $kind }) => ($kind === "ghost" ? "#131313" : "#fff")};
  &:disabled { opacity: .5; cursor: default; }
`;

const MobileConfirmPopup = ({
  title,
  message,
  input,
  confirmText = "확인",
  cancelText = "취소",
  danger = false,
  alertonly = false,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState("");

  // 열릴 때마다 입력값을 비운다
  useEffect(() => { setValue(""); }, [title, message]);

  const confirm = () => {
    if (input && !value.trim()) return;
    onConfirm?.(input ? value.trim() : undefined);
  };

  return createPortal(
    <Dim onClick={() => (alertonly ? onConfirm?.() : onCancel?.())}>
      <Box onClick={(e) => e.stopPropagation()}>
        {title && <Title>{title}</Title>}
        {message && <Message>{message}</Message>}

        {input && (
          <Input
            autoFocus
            value={value}
            placeholder={input.placeholder || ""}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") confirm(); }}
          />
        )}

        <Buttons>
          {!alertonly && (
            <Btn $kind="ghost" onClick={onCancel}>{cancelText}</Btn>
          )}
          <Btn
            $kind={danger ? "danger" : "primary"}
            disabled={!!input && !value.trim()}
            onClick={confirm}
          >
            {confirmText}
          </Btn>
        </Buttons>
      </Box>
    </Dim>,
    document.body
  );
};

export default MobileConfirmPopup;
