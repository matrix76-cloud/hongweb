/**
 * 카카오로 시작하기 (형 지시 2026-08-18)
 *
 * 카카오는 파이어베이스가 기본으로 지원하는 로그인이 아니다. 그래서 한 단계를 우리가 놓는다.
 *
 *   앱(네이티브 카카오 로그인) → accessToken → 이 함수 → 파이어베이스 커스텀 토큰 → 웹이 로그인
 *
 * 이 함수가 하는 일은 둘뿐이다.
 *   ① 받은 accessToken 이 진짜인지 카카오에 물어본다 (이걸 건너뛰면 아무나 남의 계정으로 들어온다)
 *   ② 그 카카오 회원번호로 파이어베이스 계정을 만들어 커스텀 토큰을 내준다
 *
 * ※ 커스텀 토큰 발급에는 서비스 계정에 'Service Account Token Creator' 역할이 있어야 한다.
 *   없으면 iam.serviceAccounts.signBlob denied 로 실패한다.
 *   (78320292657-compute@developer.gserviceaccount.com 에 부여함, 2026-08-18)
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const KAKAO_ME = "https://kapi.kakao.com/v2/user/me";

/** 카카오 회원번호를 파이어베이스 uid 로. 다른 로그인과 섞이지 않게 앞에 표시를 둔다 */
const uidOf = (kakaoId) => `kakao:${kakaoId}`;

exports.kakaoCustomToken = onCall(async (req) => {
  const accessToken = String(req.data?.accessToken || "").trim();
  if (!accessToken) {
    throw new HttpsError("invalid-argument", "카카오 토큰이 없습니다.");
  }

  // ① 토큰의 주인을 카카오에게 확인한다
  let me;
  try {
    const res = await fetch(KAKAO_ME, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[kakao] 사용자 조회 실패", res.status, body);
      throw new HttpsError("unauthenticated", "카카오 로그인 정보를 확인하지 못했습니다.");
    }
    me = await res.json();
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    console.error("[kakao] 사용자 조회 중 오류", e);
    throw new HttpsError("internal", "카카오와 연결하지 못했습니다.");
  }

  if (!me || !me.id) {
    throw new HttpsError("unauthenticated", "카카오 회원 정보를 받지 못했습니다.");
  }

  const account = me.kakao_account || {};
  const profile = account.profile || {};
  const uid = uidOf(me.id);
  const email = account.email || null;
  const nickname = profile.nickname || "";
  const photoURL = profile.profile_image_url || null;

  // ② 파이어베이스 계정을 맞춰둔다 (없으면 만들고, 있으면 바뀐 값만 갱신)
  try {
    await admin.auth().updateUser(uid, {
      ...(email ? { email } : {}),
      ...(nickname ? { displayName: nickname } : {}),
      ...(photoURL ? { photoURL } : {}),
    });
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      await admin.auth().createUser({
        uid,
        ...(email ? { email } : {}),
        ...(nickname ? { displayName: nickname } : {}),
        ...(photoURL ? { photoURL } : {}),
      });
    } else if (e.code === "auth/email-already-exists") {
      // 같은 메일로 다른 방법(구글·이메일)으로 이미 가입한 사람이다.
      // 메일은 건드리지 않고 그대로 진행한다 — 계정 합치기는 웹에서 USERS 로 처리한다.
      console.warn("[kakao] 같은 이메일의 계정이 이미 있다", email);
      await admin.auth().createUser({ uid, ...(nickname ? { displayName: nickname } : {}) })
        .catch(() => { /* 이미 있으면 그대로 쓴다 */ });
    } else {
      console.error("[kakao] 계정 준비 실패", e);
      throw new HttpsError("internal", "계정을 준비하지 못했습니다.");
    }
  }

  let token;
  try {
    token = await admin.auth().createCustomToken(uid, { provider: "kakao" });
  } catch (e) {
    console.error("[kakao] 커스텀 토큰 발급 실패", e);
    throw new HttpsError("internal", "로그인 토큰을 만들지 못했습니다.");
  }

  return { token, profile: { email, nickname, photoURL } };
});
