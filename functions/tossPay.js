/**
 * 토스페이먼츠 결제 승인 (2026-08-20)
 *
 * 결제는 두 단계로 끝난다.
 *   ① 앞단에서 결제창을 띄우고 손님이 결제한다 → 토스가 paymentKey 를 주며 우리 화면으로 돌려보낸다
 *   ② 서버가 그 paymentKey 로 "승인" 을 요청해야 실제로 돈이 빠진다
 *
 * ②를 앞단에서 하면 안 된다. 금액을 손댈 수 있고 시크릿 키가 노출된다.
 * 그래서 이 함수가 한다. 여기서 금액도 우리가 기록해둔 값과 맞는지 다시 본다.
 *
 * 시크릿 키 넣는 법 (둘 중 하나)
 *   · 환경변수  firebase functions:secrets:set TOSS_SECRET_KEY
 *   · 아래 상수 TOSS_SECRET_KEY_FALLBACK 에 직접 (테스트 키만. 운영 키는 절대 넣지 말 것)
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

/* 토스가 문서에 공개해둔 테스트 시크릿 키다. 가입·계약 없이 누구나 쓸 수 있고
   실제로 돈이 빠지지 않는다. 앞단의 test_gck_docs_… 클라이언트 키와 한 쌍이다.
   (2026-08-20 실제로 승인 API 에 붙여 인증되는 것 확인)

   ★ 운영 키는 절대 여기 두지 말 것 — firebase functions:secrets:set TOSS_SECRET_KEY 로 넣는다.
     환경변수가 있으면 그 값이 먼저 쓰인다. */
const TOSS_SECRET_KEY_FALLBACK = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

const secretKey = () => process.env.TOSS_SECRET_KEY || TOSS_SECRET_KEY_FALLBACK;

const db = () => admin.firestore();

/**
 * 결제를 시작하기 전에 주문을 먼저 적어둔다.
 * 승인할 때 "손님이 결제한 금액" 과 "우리가 적어둔 금액" 이 같은지 보기 위해서다.
 * 이 기록이 없으면 금액을 바꿔치기해도 알 길이 없다.
 */
exports.tossPrepare = onCall(async (req) => {
  const { orderId, amount, orderName, workId } = req.data || {};

  if (!orderId || !amount) {
    throw new HttpsError("invalid-argument", "주문 정보가 모자랍니다.");
  }
  if (Number(amount) <= 0) {
    throw new HttpsError("invalid-argument", "금액이 올바르지 않습니다.");
  }

  await db().collection("payments").doc(String(orderId)).set({
    orderId: String(orderId),
    amount: Number(amount),
    orderName: orderName || "구해줘 홍여사",
    workId: workId || null,
    usersId: req.auth?.uid || null,
    status: "READY",              // READY -> DONE / FAILED
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { ok: true };
});

/**
 * 결제 승인. 여기까지 와야 실제로 돈이 빠진다.
 */
exports.tossConfirm = onCall(async (req) => {
  const { paymentKey, orderId, amount } = req.data || {};

  if (!paymentKey || !orderId || !amount) {
    throw new HttpsError("invalid-argument", "결제 정보가 모자랍니다.");
  }
  if (!secretKey()) {
    throw new HttpsError("failed-precondition", "서버에 결제 키가 설정되지 않았습니다.");
  }

  const ref = db().collection("payments").doc(String(orderId));
  const snap = await ref.get();

  // 우리가 적어둔 금액과 다르면 여기서 끊는다
  if (snap.exists && Number(snap.data().amount) !== Number(amount)) {
    console.error("[toss] 금액이 다르다", orderId, snap.data().amount, amount);
    throw new HttpsError("failed-precondition", "결제 금액이 맞지 않습니다.");
  }
  // 이미 끝난 주문을 또 승인하지 않는다
  if (snap.exists && snap.data().status === "DONE") {
    return { ok: true, already: true, payment: snap.data().payment || null };
  }

  let result;
  try {
    const res = await fetch(CONFIRM_URL, {
      method: "POST",
      headers: {
        // 시크릿 키 뒤에 콜론을 붙여 base64 로 감싼다 (토스 규격)
        Authorization: `Basic ${Buffer.from(`${secretKey()}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    });

    result = await res.json();

    if (!res.ok) {
      console.error("[toss] 승인 실패", res.status, result);
      await ref.set({
        status: "FAILED",
        failCode: result?.code || String(res.status),
        failMessage: result?.message || "승인에 실패했습니다.",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      throw new HttpsError("aborted", result?.message || "결제 승인에 실패했습니다.");
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    console.error("[toss] 승인 중 오류", e);
    throw new HttpsError("internal", "결제사와 연결하지 못했습니다.");
  }

  await ref.set({
    status: "DONE",
    paymentKey,
    method: result.method || null,          // 카드 · 가상계좌 등
    approvedAt: result.approvedAt || null,
    receiptUrl: result.receipt?.url || null,
    payment: result,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return {
    ok: true,
    orderId,
    amount: Number(amount),
    method: result.method || null,
    approvedAt: result.approvedAt || null,
    receiptUrl: result.receipt?.url || null,
  };
});
