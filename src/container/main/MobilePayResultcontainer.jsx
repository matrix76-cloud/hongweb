import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { httpsCallable, getFunctions } from "firebase/functions";
import { firebaseApp } from "../../api/config";
import { won } from "../../utility/tossConfig";

/**
 * 결제 결과 (형 지시 2026-08-20)
 *
 * 토스 결제창에서 돌아오는 자리다. 주소에 paymentKey · orderId · amount 가 붙어 온다.
 * 이 화면이 서버에 승인을 요청하고, 그때 비로소 돈이 빠진다.
 *
 * 사용자가 새로고침해도 두 번 승인되지 않는다 — 서버가 이미 끝난 주문을 다시 승인하지 않는다.
 */

const Wrap = styled.div`
  min-height: 100%;
  box-sizing: border-box;
  padding: 40px 20px calc(28px + var(--safe-bottom));
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const Mark = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ $ok }) => ($ok ? '#3E7D5A' : '#C43A10')};
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;
const Title = styled.div`
  font-size: 21px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 8px;
`;
const Sub = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-sub);
  margin-bottom: 24px;
  white-space: pre-wrap;
`;
const Box = styled.div`
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 6px 16px;
  margin-bottom: 22px;
  text-align: left;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-soft);
  font-size: 15px;
  color: var(--text-sub);
  &:last-child { border-bottom: none; }

  b { font-weight: 700; color: var(--text); word-break: break-all; text-align: right; }
`;
const Btn = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 12px;
  border: ${({ $ghost }) => ($ghost ? '1px solid var(--border)' : 'none')};
  background: ${({ $ghost }) => ($ghost ? 'var(--surface)' : '#3C6E9F')};
  color: ${({ $ghost }) => ($ghost ? 'var(--text)' : '#fff')};
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
`;

/** kind: 'success' | 'fail' */
const MobilePayResultcontainer = ({ kind = "success" }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const done = useRef(false);

  const [state, setState] = useState(kind === "success" ? "confirming" : "failed");
  const [info, setInfo] = useState(null);
  const [message, setMessage] = useState(params.get("message") || "");

  useEffect(() => {
    if (kind !== "success" || done.current) return;
    done.current = true;

    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setState("failed");
      setMessage("결제 정보를 받지 못했습니다.");
      return;
    }

    (async () => {
      try {
        const confirm = httpsCallable(getFunctions(firebaseApp), "tossConfirm");
        const res = await confirm({ paymentKey, orderId, amount: Number(amount) });
        setInfo({ orderId, amount: Number(amount), ...(res.data || {}) });
        setState("done");
      } catch (e) {
        console.log("TCL: 결제 승인 실패", e?.code, e?.message);
        setMessage(e?.message || "결제를 마치지 못했습니다.");
        setState("failed");
      }
    })();
  }, [kind, params]);

  if (state === "confirming") {
    return (
      <Wrap>
        <Title>결제를 확인하고 있습니다</Title>
        <Sub>{"잠시만 기다려주세요.\n이 화면을 닫지 마세요."}</Sub>
      </Wrap>
    );
  }

  if (state === "failed") {
    return (
      <Wrap>
        <Mark>!</Mark>
        <Title>결제를 마치지 못했습니다</Title>
        <Sub>{message || "다시 시도해주세요."}</Sub>
        <Btn onClick={() => navigate(-1)}>다시 시도하기</Btn>
        <Btn $ghost onClick={() => navigate("/Mobilemain")}>홈으로</Btn>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Mark $ok>✓</Mark>
      <Title>결제가 끝났습니다</Title>
      <Sub>{"일이 끝날 때까지 홍컴즈가 맡아둡니다.\n일이 확인되면 홍여사에게 전달됩니다."}</Sub>

      <Box>
        <Row>결제 금액<b>{won(info?.amount)}</b></Row>
        {info?.method && <Row>결제 수단<b>{info.method}</b></Row>}
        <Row>주문번호<b style={{ fontSize: 13 }}>{info?.orderId}</b></Row>
        {info?.approvedAt && (
          <Row>승인 시각<b style={{ fontSize: 13 }}>{new Date(info.approvedAt).toLocaleString("ko-KR")}</b></Row>
        )}
      </Box>

      {info?.receiptUrl && (
        <Btn $ghost onClick={() => window.open(info.receiptUrl, "_blank")}>영수증 보기</Btn>
      )}
      <Btn onClick={() => navigate("/Mobilemain")}>홈으로</Btn>
    </Wrap>
  );
};

export default MobilePayResultcontainer;
