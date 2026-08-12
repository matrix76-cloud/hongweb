/**
 * 이메일 인증코드 로그인 + 이메일 찾기 (형 지시 2026-08-12)
 *
 *   sendLoginCode   : 이메일로 6자리 코드를 보낸다
 *   verifyLoginCode : 코드가 맞으면 Firebase 커스텀 토큰을 준다
 *   findMaskedEmail : 대화명이 맞으면 가려진 이메일을 알려준다
 *
 * 비밀번호를 두지 않는다. 코드가 그 메일함에 도착한다는 사실이 본인 확인이다.
 * 마스킹은 반드시 서버에서 한다 — 앱에서 조회하면 원본이 그대로 보인다.
 *
 * 메일 발송기는 Resend 를 쓴다. 키가 없으면(아직 못 받았으면) 메일을 보내지 않고
 * devCode 로 코드를 돌려준다 — 흐름부터 확인할 수 있게. 배포 후 키를 넣으면 자동으로 실제 발송으로 바뀐다.
 *   키 넣는 법: firebase functions:config:set resend.key="re_xxx"  또는 환경변수 RESEND_API_KEY
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const CODES = "EMAIL_CODES";      // 발급한 코드 보관
const USERS = "USERS";
const CODE_TTL_MS = 5 * 60 * 1000;  // 5분
const MAX_TRY = 5;                  // 코드 확인 시도 한도
const RESEND_COOLDOWN_MS = 60 * 1000;

const db = () => admin.firestore();

const normEmail = (v) => String(v || "").trim().toLowerCase();
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const sixDigit = () => String(Math.floor(100000 + Math.random() * 900000));

/** 보낸 사람에게는 알아볼 만큼, 남에게는 알 수 없을 만큼 가린다 (ho****@gmail.com) */
const maskEmail = (email) => {
  const [id, domain] = String(email).split("@");
  if (!domain) return "";
  const head = id.slice(0, 2);
  const stars = "*".repeat(Math.max(3, id.length - 2));
  return `${head}${stars}@${domain}`;
};

/** Resend 로 메일 발송. 키가 없으면 false 를 돌려준다(개발 모드). */
const sendMail = async ({ to, code }) => {
  const key = process.env.RESEND_API_KEY
    || (require("firebase-functions").config().resend || {}).key;
  if (!key) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "구해줘 홍여사 <onboarding@resend.dev>",   // 도메인 연결 후 우리 주소로 바꾼다
      to: [to],
      subject: `[구해줘 홍여사] 인증코드 ${code}`,
      text: `인증코드는 ${code} 입니다. 5분 안에 입력해 주세요.`,
      html: `
        <div style="font-family:-apple-system,'Malgun Gothic',sans-serif;padding:28px 24px;color:#131313">
          <div style="font-size:18px;font-weight:700;margin-bottom:14px">구해줘 홍여사</div>
          <div style="font-size:16px;line-height:1.6;color:#555">아래 인증코드를 앱에 입력해 주세요.</div>
          <div style="margin:20px 0;font-size:32px;font-weight:800;letter-spacing:6px;color:#FF4E19">${code}</div>
          <div style="font-size:14px;color:#888">5분 안에 입력해야 합니다. 요청하지 않았다면 이 메일은 무시하세요.</div>
        </div>`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("resend fail", res.status, body);
    throw new HttpsError("internal", "메일을 보내지 못했습니다.");
  }
  return true;
};

/** ① 코드 보내기 */
exports.sendLoginCode = onCall(async (req) => {
  const email = normEmail(req.data && req.data.email);
  if (!isEmail(email)) throw new HttpsError("invalid-argument", "이메일 형식이 올바르지 않습니다.");

  const ref = db().collection(CODES).doc(email);
  const snap = await ref.get();
  const now = Date.now();

  // 너무 자주 요청하는 것 막기
  if (snap.exists) {
    const prev = snap.data();
    if (prev.sentAt && now - prev.sentAt < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - prev.sentAt)) / 1000);
      throw new HttpsError("resource-exhausted", `${wait}초 뒤에 다시 요청해 주세요.`);
    }
  }

  const code = sixDigit();
  await ref.set({ email, code, sentAt: now, expiresAt: now + CODE_TTL_MS, tries: 0 });

  const sent = await sendMail({ to: email, code });

  // 이미 가입한 사람인지 알려준다 — 화면에서 '로그인' / '가입' 문구를 맞추는 데 쓴다
  const exists = !(await db().collection(USERS).where("EMAIL", "==", email).limit(1).get()).empty;

  return { ok: true, exists, ...(sent ? {} : { devCode: code }) };
});

/** ② 코드 확인 → 커스텀 토큰 */
exports.verifyLoginCode = onCall(async (req) => {
  const email = normEmail(req.data && req.data.email);
  const code = String((req.data && req.data.code) || "").trim();
  if (!isEmail(email) || code.length !== 6) {
    throw new HttpsError("invalid-argument", "이메일과 6자리 코드를 확인해 주세요.");
  }

  const ref = db().collection(CODES).doc(email);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "코드를 다시 받아주세요.");

  const saved = snap.data();
  if (Date.now() > saved.expiresAt) {
    await ref.delete();
    throw new HttpsError("deadline-exceeded", "코드가 만료되었습니다. 다시 받아주세요.");
  }
  if ((saved.tries || 0) >= MAX_TRY) {
    await ref.delete();
    throw new HttpsError("resource-exhausted", "여러 번 틀렸습니다. 코드를 다시 받아주세요.");
  }
  if (saved.code !== code) {
    await ref.update({ tries: (saved.tries || 0) + 1 });
    throw new HttpsError("permission-denied", "코드가 맞지 않습니다.");
  }

  await ref.delete();

  // 이 이메일로 쓰던 Auth 계정이 있으면 그걸 쓰고, 없으면 만든다
  let uid;
  try {
    uid = (await admin.auth().getUserByEmail(email)).uid;
  } catch {
    uid = (await admin.auth().createUser({ email, emailVerified: true })).uid;
  }

  const token = await admin.auth().createCustomToken(uid);
  return { ok: true, token };
});

/**
 * ③ 이메일 찾기 — 대화명이 맞으면 가려진 이메일을 알려준다.
 * 대화명은 채팅·일감에서 이미 보이는 값이라, 원본 이메일은 절대 내보내지 않는다.
 */
exports.findMaskedEmail = onCall(async (req) => {
  const nickname = String((req.data && req.data.nickname) || "").trim();
  if (nickname.length < 2) throw new HttpsError("invalid-argument", "대화명을 정확히 적어주세요.");

  const snap = await db().collection(USERS)
    .where("USERINFO.nickname", "==", nickname)
    .limit(5)
    .get();

  const found = [];
  snap.forEach((d) => {
    const x = d.data();
    if (x.WITHDRAWN) return;
    if (x.EMAIL) found.push({ email: maskEmail(x.EMAIL), provider: x.PROVIDER || "email" });
  });

  if (!found.length) return { ok: true, found: [] };
  return { ok: true, found };
});

/**
 * 탈퇴 — 로그인 계정(Auth)을 지운다. (형 지시 2026-08-13)
 *
 * USERS 문서는 앱에서 탈퇴 표시만 남긴다(상대에게 남은 대화·일감이 깨지지 않게).
 * 여기서는 Auth 계정만 지운다 — 안 지우면 같은 이메일로 다시 가입할 수 없다.
 */
exports.withdrawAccount = onCall(async (req) => {
  const uid = req.auth && req.auth.uid;
  if (!uid) throw new HttpsError("unauthenticated", "로그인 상태가 아닙니다.");

  try {
    await admin.auth().deleteUser(uid);
  } catch (e) {
    console.error("withdrawAccount", e);
    throw new HttpsError("internal", "탈퇴 처리에 실패했습니다.");
  }
  return { ok: true };
});
