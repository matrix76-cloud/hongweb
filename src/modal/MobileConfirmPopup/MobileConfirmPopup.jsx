import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { PiCheckBold, PiXBold, PiWarningBold } from "react-icons/pi";

/**
 * 확인 · 입력 · 알림 창 — 앱의 모든 작은 팝업이 이 하나를 쓴다.
 * (형 지시 2026-08-12 "window.confirm 대신", 2026-08-22 "모든 팝업을 공통으로 세련되게")
 *
 * 성공/실패/경고 팝업(MobileSuccessPopup·MobileFailPopup·MobileWarningPopup·MobileLogoutSuccessPopup)은
 * 전부 이 컴포넌트를 감싼 얇은 껍데기다. 모양을 바꾸려면 여기만 고친다.
 *
 *   확인/취소 : <MobileConfirmPopup title="…" message="…" onConfirm={} onCancel={} />
 *   입력      : ... input={{ placeholder:'사유' }} onConfirm={(값)=>{}}
 *   알림      : ... alertonly
 *   아이콘    : ... icon="success" | "fail" | "warning"
 */
const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const popin = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(17, 19, 24, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${fadein} .16s ease-out;
`;

const Box = styled.div`
  width: 100%;
  max-width: 340px;
  box-sizing: border-box;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 6px;
  padding: 26px 22px 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, .18);
  animation: ${popin} .18s ease-out;
`;

/* 성공/실패/경고 — 먹색 원 하나에 흰 아이콘. 색 남발 대신 실패만 검붉게 */
const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $kind }) => ($kind === "fail" ? "#c02020" : "#1b1f27")};
  color: #fff;
  margin: 0 auto 14px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text);
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  word-break: keep-all;
`;

const Message = styled.div`
  margin-top: ${({ $hasTitle }) => ($hasTitle ? "8px" : "0")};
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
  word-break: keep-all;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin-top: 14px;
  height: 46px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
  outline: none;
  &:focus { border-color: #1b1f27; }
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 22px;
`;

const Btn = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  border: ${({ $kind }) => ($kind === "ghost" ? "1px solid var(--border)" : "none")};
  background: ${({ $kind }) =>
    $kind === "ghost" ? "var(--surface)" : $kind === "danger" ? "#c02020" : "#1b1f27"};
  color: ${({ $kind }) => ($kind === "ghost" ? "var(--text)" : "#fff")};
  -webkit-tap-highlight-color: transparent;
  &:active { opacity: .85; }
  &:disabled { opacity: .4; cursor: default; }
`;

const ICONS = {
  success: <PiCheckBold size={24} />,
  fail: <PiXBold size={24} />,
  warning: <PiWarningBold size={24} />,
};

const MobileConfirmPopup = ({
  title,
  message,
  input,
  icon,
  confirmText = "확인",
  cancelText = "취소",
  danger = false,
  alertonly = false,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState("");
  const center = !!icon;   // 아이콘이 있는 알림은 가운데 정렬, 확인/입력 창은 왼쪽 정렬

  // 열릴 때마다 입력값을 비운다
  useEffect(() => { setValue(""); }, [title, message]);

  const confirm = () => {
    if (input && !value.trim()) return;
    onConfirm?.(input ? value.trim() : undefined);
  };

  return createPortal(
    <Dim onClick={() => (alertonly ? onConfirm?.() : onCancel?.())}>
      <Box onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {icon && ICONS[icon] && <IconWrap $kind={icon}>{ICONS[icon]}</IconWrap>}
        {title && <Title $center={center}>{title}</Title>}
        {message && <Message $center={center} $hasTitle={!!title}>{message}</Message>}

        {input && (
          <Input
            autoFocus
            value={value}
            placeholder={input.placeholder || ""}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) confirm(); }}
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
