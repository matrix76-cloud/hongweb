import React, { useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/**
 * 수수료 입력 — 의뢰한 사람이 금액을 정해 보내는 창. (형 지시 2026-08-20)
 *
 * 예전에는 대화로 금액을 주고받았다. 처음 쓰는 사람은 어디까지가 합의인지 알 수 없었고,
 * 합의가 됐는지 여부를 시스템이 알 방법도 없었다. 이제 여기서 한 번 정해 보내고,
 * 일하는 사람이 수락하면 그때 계약이 선다.
 *
 * 금액은 자유 입력이다 — 일감에 적어둔 금액과 달라도 된다. (형 확인 2026-08-21)
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
  padding: 22px 20px 16px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
`;

const Message = styled.div`
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.6;
  color: #636363;
`;

/* 금액 칸 — 숫자를 크게 보여주고 '원' 을 붙여둔다. 단위를 헷갈리지 않게. */
const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  height: 56px;
  padding: 0 14px;
  border: 1px solid ${({ $on }) => ($on ? "#FF4E19" : "var(--border)")};
  border-radius: 10px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  text-align: right;
  font-family: inherit;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  &::placeholder { font-weight: 500; color: #b5b5b5; }
`;

const Unit = styled.div`
  flex: none;
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
`;

const Hint = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #636363;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
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

const onlyNumber = (v) => String(v ?? "").replace(/[^0-9]/g, "").slice(0, 9);
const comma = (v) => (v ? Number(v).toLocaleString("ko-KR") : "");

/**
 * @param amount    이미 보낸 금액이 있으면 채워둔다 (다시 보낼 때)
 * @param workPrice 일감에 적힌 금액 — 참고로만 보여준다
 * @param onSubmit  (숫자) => void
 */
const MobileFeeOfferPopup = ({ amount, workPrice, onSubmit, onClose }) => {
  const [value, setValue] = useState(onlyNumber(amount));
  const [busy, setBusy] = useState(false);

  const num = Number(value) || 0;
  const ok = num > 0 && !busy;

  const submit = async () => {
    if (!ok) return;
    setBusy(true);
    await onSubmit?.(num);
  };

  const ref = Number(onlyNumber(workPrice)) || 0;

  return createPortal(
    <Dim onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Title>수수료 입력</Title>
        <Message>일하는 분에게 드릴 금액을 적어주세요.</Message>

        <Field $on={num > 0}>
          <Input
            autoFocus
            inputMode="numeric"
            value={comma(value)}
            placeholder="0"
            onChange={(e) => setValue(onlyNumber(e.target.value))}
            onKeyDown={(e) => {
              // 한글 조합 중 Enter 가 두 번 들어오는 것을 막는다 (숫자 칸이지만 같은 규칙을 지킨다)
              if (e.nativeEvent?.isComposing || e.keyCode === 229) return;
              if (e.key === "Enter") { e.preventDefault(); submit(); }
            }}
          />
          <Unit>원</Unit>
        </Field>

        {ref > 0 && (
          <Hint>일감에 적어두신 금액은 {ref.toLocaleString("ko-KR")}원입니다. 다르게 정하셔도 됩니다.</Hint>
        )}

        <Hint>
          보내면 일하는 분 화면에 이 금액이 뜹니다. 수락하면 계약이 되고, 그때부터 결제할 수 있습니다.
        </Hint>

        <Buttons>
          <Btn $kind="ghost" onClick={onClose}>취소</Btn>
          <Btn onClick={submit} disabled={!ok}>
            {busy ? "보내는 중..." : "보내기"}
          </Btn>
        </Buttons>
      </Box>
    </Dim>,
    document.body
  );
};

export default MobileFeeOfferPopup;
