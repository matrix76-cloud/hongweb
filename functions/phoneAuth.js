/**
 * 휴대폰 번호 인증 + 기존 회원 흡수 (형 결정 2026-08-23)
 *
 *   sendPhoneCode   : 문자로 6자리 코드를 보낸다 (팝빌)
 *   verifyPhoneCode : 코드가 맞으면 그 번호로 예전 USERS 문서를 찾아 지금 로그인(소셜) 계정에 잇는다
 *
 * 왜 서버에서 하나: 합치는 일은 "남의 계정을 내 것으로" 가져오는 일이라 코드 확인과 한 트랜잭션으로
 * 서버가 해야 한다. 앱이 번호만 보고 합치게 두면 번호를 아는 사람이 계정을 가져간다.
 *
 * 흡수 규칙:
 *   · 번호가 예전 USERS(USERINFO.phone)에 있으면 → 그 문서에 AUTH_UID/DEVICEID 를 지금 uid 로 바꿔 잇는다.
 *     소셜 로그인 때 새로 생긴 빈 문서는 지운다(활동이 있으면 MERGED_INTO 표시만).
 *   · 없으면 → 지금 문서에 번호만 적는다(신규).
 *   · 그 번호가 이미 다른 Auth 계정에 붙어 있으면 → 거절(already-exists).
 *
 * 발송: 카카오 알림톡(루나소프트, 템플릿 50051 '인증번호' — 2026-06-17 심사 승인) + 카카오 미사용자는 문자 대체발송(use_sms=1).
 *   키(functions/.env 의 LUNA_USERID/LUNA_API_KEY)가 없으면 보내지 않고 devCode 로 코드를 돌려준다 — 흐름부터 확인할 수 있게.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const crypto = require("crypto");
const { sendAlimtalk, LUNA } = require("./alimtalk");

const CODES = "PHONE_CODES";
const USERS = "USERS";
const CODE_TTL_MS = 5 * 60 * 1000;
const MAX_TRY = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

const db = () => admin.firestore();
const sixDigit = () => String(Math.floor(100000 + Math.random() * 900000));
const hash = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

/** "010-1234-5678" · "+82 10 1234 5678" → "01012345678" (DB 에 저장된 모양) */
const normPhone = (v) => {
  let d = String(v || "").replace(/\D/g, "");
  if (d.startsWith("82")) d = "0" + d.slice(2);
  return d;
};
const isMobile = (d) => /^01[016789]\d{7,8}$/.test(d);


/** 예전 회원 찾기 — 번호가 같은 USERS 중 탈퇴/삭제 아닌 것. 여럿이면 마지막 로그인이 최근인 것 */
const findOldUserByPhone = async (phone) => {
  const snap = await db().collection(USERS).where("USERINFO.phone", "==", phone).get();
  const rows = snap.docs
    .filter((d) => { const x = d.data(); return !x.WITHDRAWN && !x.ISDELETED && !x.MERGED_INTO; })
    .sort((a, b) => (b.data().LASTLOGINDT || 0) - (a.data().LASTLOGINDT || 0));
  return rows[0] || null;
};
const findUserByAuthUid = async (uid) => {
  const snap = await db().collection(USERS).where("AUTH_UID", "==", uid).limit(1).get();
  return snap.empty ? null : snap.docs[0];
};
const isEmptyDoc = (x) =>
  !(x.ACTIVITY || []).length && !(x.CHATINFO || []).length && !(x.REVIEWITEMS || []).length && !(x.COMMUNITYITEMS || []).length;

exports.create = () => {
  const live = !!(LUNA.userid && LUNA.api_key);

  const sendPhoneCode = onCall(async (req) => {
    const uid = req.auth && req.auth.uid;
    if (!uid) throw new HttpsError("unauthenticated", "먼저 로그인해 주세요.");
    const phone = normPhone(req.data && req.data.phone);
    if (!isMobile(phone)) throw new HttpsError("invalid-argument", "휴대폰 번호를 확인해 주세요.");

    const ref = db().collection(CODES).doc(phone);
    const prev = await ref.get();
    if (prev.exists && Date.now() - (prev.data().sentAt || 0) < RESEND_COOLDOWN_MS) {
      throw new HttpsError("resource-exhausted", "잠시 후 다시 받을 수 있어요.");
    }

    const code = sixDigit();
    await ref.set({ codeHash: hash(code), uid, sentAt: Date.now(), exp: Date.now() + CODE_TTL_MS, tries: 0 });

    if (live) {
      try {
        await sendAlimtalk("auth", phone, "", { 인증번호: code }, { failover: true });
      } catch (e) {
        await ref.delete();
        throw new HttpsError("unavailable", "인증번호를 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
      return { ok: true };
    }
    return { ok: true, devCode: code };
  });

  const verifyPhoneCode = onCall(async (req) => {
    const uid = req.auth && req.auth.uid;
    if (!uid) throw new HttpsError("unauthenticated", "먼저 로그인해 주세요.");
    const phone = normPhone(req.data && req.data.phone);
    const code = String((req.data && req.data.code) || "").replace(/\D/g, "");
    if (!isMobile(phone) || code.length !== 6) throw new HttpsError("invalid-argument", "인증번호 6자리를 입력해 주세요.");

    const ref = db().collection(CODES).doc(phone);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError("not-found", "인증번호를 먼저 받아주세요.");
    const c = snap.data();
    if (c.uid !== uid) throw new HttpsError("permission-denied", "다른 계정에서 요청한 번호예요. 다시 받아주세요.");
    if (Date.now() > c.exp) { await ref.delete(); throw new HttpsError("deadline-exceeded", "인증번호가 만료됐어요. 다시 받아주세요."); }
    if ((c.tries || 0) >= MAX_TRY) { await ref.delete(); throw new HttpsError("resource-exhausted", "여러 번 틀렸어요. 인증번호를 다시 받아주세요."); }
    if (c.codeHash !== hash(code)) {
      await ref.update({ tries: admin.firestore.FieldValue.increment(1) });
      throw new HttpsError("invalid-argument", "인증번호가 올바르지 않아요.");
    }

    // ── 코드 OK → 계정 잇기 ──
    const now = Date.now();
    const old = await findOldUserByPhone(phone);
    const cur = await findUserByAuthUid(uid);
    let merged = false, USERS_ID = null;

    if (old && (!cur || old.id !== cur.id)) {
      const o = old.data();
      if (o.AUTH_UID && o.AUTH_UID !== uid) {
        throw new HttpsError("already-exists", "이 번호는 이미 다른 계정에 연결돼 있어요. 그 계정으로 로그인해 주세요.");
      }
      const cx = cur ? cur.data() : {};
      const patch = {
        AUTH_UID: uid,
        DEVICEID: uid,                       // 스플래시가 이 값으로 사람을 찾는다 (소셜 계정 규칙)
        DEVICETYPE: "web",
        PROVIDER: cx.PROVIDER || o.PROVIDER || "",
        EMAIL: cx.EMAIL || o.EMAIL || "",
        AGREE: cx.AGREE || o.AGREE || null,
        LASTLOGINDT: now,
        PHONE_VERIFIED_AT: now,
        MERGED_FROM: cur ? cx.USERS_ID : null,
      };
      if (!(o.USERINFO && o.USERINFO.userimg) && cx.USERINFO && cx.USERINFO.userimg) patch["USERINFO.userimg"] = cx.USERINFO.userimg;
      await old.ref.update(patch);
      if (cur) {
        if (isEmptyDoc(cx)) await cur.ref.delete();
        else await cur.ref.update({ AUTH_UID: admin.firestore.FieldValue.delete(), MERGED_INTO: o.USERS_ID, MERGED_AT: now });
      }
      merged = true; USERS_ID = o.USERS_ID;
    } else if (cur) {
      await cur.ref.update({ "USERINFO.phone": phone, PHONE_VERIFIED_AT: now, LASTLOGINDT: now });
      USERS_ID = cur.data().USERS_ID;
    } else {
      throw new HttpsError("failed-precondition", "회원 정보를 찾지 못했어요. 다시 로그인해 주세요.");
    }

    await ref.delete();
    // 화면이 USERS 를 다시 읽지 않아도 되게 이어진(또는 지금) 문서를 같이 돌려준다 — 두 번째 조회가 비어 화면이 멈추던 것(2026-08-24)
    const finalSnap = await db().collection(USERS).where("AUTH_UID", "==", uid).limit(1).get();
    const user = finalSnap.empty ? null : finalSnap.docs[0].data();
    return { ok: true, merged, USERS_ID, phone, user };
  });

  return { sendPhoneCode, verifyPhoneCode };
};
