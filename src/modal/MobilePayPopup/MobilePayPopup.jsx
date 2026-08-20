import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { httpsCallable, getFunctions } from "firebase/functions";
import { firebaseApp } from "../../api/config";
import {
  TOSS_CLIENT_KEY, TOSS_SUCCESS_PATH, TOSS_FAIL_PATH, makeOrderId, won,
} from "../../utility/tossConfig";

/**
 * 대화방에서 여는 결제 (형 지시 2026-08-20 "여기 결제 버튼 있으니 여기에 붙여줘")
 *
 * 원래 있던 것은 토스 문서의 예제 코드가 그대로 들어와 있었다.
 * 금액이 5만원으로 박혀 있고, 주문 이름이 "토스 티셔츠 외 2건", 사는 사람이 "김토스" 였고,
 * 결제가 끝나면 /sandbox/success 로 돌아가는데 그런 화면이 우리에겐 없어서
 * 눌러도 결제가 끝나지 않았다. 실제 일감에 맞춰 다시 만든다.
 *
 * 흐름
 *   ① 서버에 주문(주문번호·금액)을 먼저 적어둔다 — 금액 바꿔치기를 막기 위해
 *   ② 결제창을 띄운다
 *   ③ 끝나면 /Mobilepaysuccess 로 돌아오고, 거기서 서버가 승인한다 (그때 돈이 빠진다)
 */

const Dim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 1200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;
const Sheet = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--surface);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 18px 16px calc(20px + var(--safe-bottom));
  box-sizing: border-box;
`;
const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
`;
const Close = styled.button`
  border: none;
  background: none;
  font-size: 22px;
  line-height: 1;
  color: var(--text-sub);
  cursor: pointer;
  padding: 4px 6px;
`;
const Summary = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  font-size: 15px;
  color: var(--text-sub);

  b { font-size: 16px; font-weight: 700; color: var(--text); }
`;
const Total = styled(Row)`
  border-top: 1px solid var(--border-soft);
  margin-top: 8px;
  padding-top: 11px;

  b { font-size: 21px; font-weight: 800; }
`;
const PayBtn = styled.button`
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 12px;
  background: ${({ disabled }) => (disabled ? '#D9DEE4' : '#3C6E9F')};
  color: #fff;
  font-family: inherit;
  font-size: 17px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  margin-top: 12px;
`;
const Warn = styled.div`
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid #FF4E19;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #C43A10;
`;
const Notice = styled.div`
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-sub);
  white-space: pre-wrap;
`;

/** 등록된 금액 문자열에서 숫자만 뽑는다 ("50,000원" -> 50000) */
const toNumber = (v) => {
  const n = Number(String(v ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const MobilePayPopup = ({ callback, amount, orderName, workId }) => {
  const value = toNumber(amount) || 50000;

  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const orderIdRef = useRef(makeOrderId());

  const close = () => { if (typeof callback === 'function') callback([]); };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const toss = await loadTossPayments(TOSS_CLIENT_KEY);
        if (!alive) return;

        const w = toss.widgets({ customerKey: ANONYMOUS });
        await w.setAmount({ currency: "KRW", value });

        await Promise.all([
          w.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          w.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ]);

        if (!alive) return;
        setWidgets(w);
        setReady(true);
      } catch (e) {
        console.log("TCL: 결제창 준비 실패", e?.message);
        if (alive) setErr("결제창을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    })();
    return () => { alive = false; };
  }, [value]);

  const pay = async () => {
    if (!widgets || busy) return;
    setBusy(true);
    setErr("");
    try {
      const prepare = httpsCallable(getFunctions(firebaseApp), "tossPrepare");
      await prepare({
        orderId: orderIdRef.current,
        amount: value,
        orderName: orderName || "구해줘 홍여사",
        workId: workId || null,
      });

      const origin = window.location.origin;
      await widgets.requestPayment({
        orderId: orderIdRef.current,
        orderName: orderName || "구해줘 홍여사",
        successUrl: `${origin}${TOSS_SUCCESS_PATH}`,
        failUrl: `${origin}${TOSS_FAIL_PATH}`,
      });
    } catch (e) {
      console.log("TCL: 결제 요청 실패", e?.code, e?.message);
      setErr(e?.message || "결제를 시작하지 못했습니다.");
      setBusy(false);
    }
  };

  return (
    <Dim onClick={close}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Head>
          <Title>결제</Title>
          <Close onClick={close} aria-label="닫기">×</Close>
        </Head>

        <Summary>
          <Row>일감<b>{orderName || "구해줘 홍여사"}</b></Row>
          <Total>결제 금액<b>{won(value)}</b></Total>
        </Summary>

        <div id="payment-method" />
        <div id="agreement" />

        {err && <Warn>{err}</Warn>}

        <PayBtn onClick={pay} disabled={!ready || busy}>
          {busy ? "결제창을 여는 중..." : `${won(value)} 결제하기`}
        </PayBtn>

        <Notice>
          {"결제한 돈은 일이 끝날 때까지 홍컴즈가 맡아둡니다.\n"
            + "일이 끝나고 확인되면 홍여사에게 전달됩니다."}
        </Notice>
      </Sheet>
    </Dim>
  );
};

export default MobilePayPopup;
