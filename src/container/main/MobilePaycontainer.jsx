import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { httpsCallable, getFunctions } from "firebase/functions";
import { firebaseApp } from "../../api/config";
import {
  TOSS_CLIENT_KEY, TOSS_SUCCESS_PATH, TOSS_FAIL_PATH,
  isTossKeyReady, makeOrderId, won,
} from "../../utility/tossConfig";

/**
 * 결제 화면 (형 지시 2026-08-20 — 토스페이먼츠 연동)
 *
 * 흐름은 이렇다.
 *   ① 서버에 주문을 먼저 적어둔다 (금액을 나중에 대조하기 위해)
 *   ② 토스 결제창을 띄운다
 *   ③ 결제가 끝나면 성공 화면으로 돌아오고, 거기서 서버가 승인한다
 *
 * 승인까지 끝나야 돈이 빠진다. 그 승인은 앞단이 아니라 서버(functions/tossPay.js)가 한다.
 */

const Wrap = styled.div`
  min-height: 100%;
  box-sizing: border-box;
  padding: 18px 16px calc(28px + var(--safe-bottom));
  background: var(--surface);
`;
const Head = styled.div`
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
`;
const Sub = styled.div`
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 16px;
`;
const Summary = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
`;
const SumRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  font-size: 15px;
  color: var(--text-sub);

  b { font-size: 16px; font-weight: 700; color: var(--text); }
`;
const Total = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-top: 1px solid var(--border-soft);
  margin-top: 8px;
  padding-top: 12px;
  font-size: 15px;
  color: var(--text-sub);

  b { font-size: 22px; font-weight: 800; color: var(--text); }
`;
const Slot = styled.div`
  margin-bottom: 8px;
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
  margin-top: 10px;
`;
const Notice = styled.div`
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  background: var(--bg-soft);
  font-size: 14px;
  line-height: 1.65;
  color: #4B4B4B;
  white-space: pre-wrap;
`;
const KeyWarn = styled(Notice)`
  border-color: #FF4E19;
  color: #C43A10;
`;

const MobilePaycontainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* 어디서 들어왔는지에 따라 값이 다르다. 없으면 보여주기용 기본값으로 둔다. */
  const st = location.state || {};
  const amount = Number(st.amount) || 50000;
  const orderName = st.orderName || "집 청소";
  const workId = st.workId || null;

  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const orderIdRef = useRef(makeOrderId());

  useEffect(() => {
    if (!isTossKeyReady()) return undefined;

    let alive = true;
    (async () => {
      try {
        const toss = await loadTossPayments(TOSS_CLIENT_KEY);
        if (!alive) return;

        // 로그인 없이도 결제할 수 있게 익명으로 연다
        const w = toss.widgets({ customerKey: ANONYMOUS });
        await w.setAmount({ currency: "KRW", value: amount });

        await Promise.all([
          w.renderPaymentMethods({ selector: "#toss-methods", variantKey: "DEFAULT" }),
          w.renderAgreement({ selector: "#toss-agreement", variantKey: "AGREEMENT" }),
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
  }, [amount]);

  const pay = async () => {
    if (!widgets || busy) return;
    setBusy(true);
    setErr("");

    try {
      // 승인할 때 대조할 수 있게 주문을 먼저 서버에 적어둔다
      const prepare = httpsCallable(getFunctions(firebaseApp), "tossPrepare");
      await prepare({ orderId: orderIdRef.current, amount, orderName, workId });

      const origin = window.location.origin;
      await widgets.requestPayment({
        orderId: orderIdRef.current,
        orderName,
        successUrl: `${origin}${TOSS_SUCCESS_PATH}`,
        failUrl: `${origin}${TOSS_FAIL_PATH}`,
      });
      // 여기서 화면이 결제창으로 넘어간다
    } catch (e) {
      console.log("TCL: 결제 요청 실패", e?.code, e?.message);
      setErr(e?.message || "결제를 시작하지 못했습니다.");
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <Head>결제</Head>
      <Sub>결제 수단을 고르고 결제하기를 눌러주세요.</Sub>

      <Summary>
        <SumRow>일감<b>{orderName}</b></SumRow>
        <SumRow>주문번호<span style={{ fontSize: 13 }}>{orderIdRef.current}</span></SumRow>
        <Total>결제 금액<b>{won(amount)}</b></Total>
      </Summary>

      {!isTossKeyReady() ? (
        <KeyWarn>
          {"아직 토스페이먼츠 클라이언트 키를 넣지 않았습니다.\n"
            + "developers.tosspayments.com 에서 테스트 키를 받아\n"
            + "src/utility/tossConfig.js 의 TOSS_CLIENT_KEY 에 넣으면 이 화면에서 바로 결제창이 열립니다."}
        </KeyWarn>
      ) : (
        <>
          <Slot id="toss-methods" />
          <Slot id="toss-agreement" />

          {err && <KeyWarn>{err}</KeyWarn>}

          <PayBtn onClick={pay} disabled={!ready || busy}>
            {busy ? "결제창을 여는 중..." : `${won(amount)} 결제하기`}
          </PayBtn>
        </>
      )}

      <Notice>
        {"결제한 돈은 일이 끝날 때까지 홍컴즈가 맡아둡니다.\n"
          + "일이 끝나고 확인되면 홍여사에게 전달됩니다.\n"
          + "테스트 키로 열려 있는 동안에는 실제로 돈이 빠지지 않습니다."}
      </Notice>
    </Wrap>
  );
};

export default MobilePaycontainer;
