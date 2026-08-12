import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth, db } from "../api/config";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "../api/config";
import { FIXED_LOCATION } from "../utility/devLocation";
import { loadAgreement } from "../container/main/MobileAgreecontainer";

/**
 * 로그인 · 회원가입 (형 지시 2026-08-12 — 숨고 화면 방식)
 *
 *   · 이메일 + 비밀번호
 *   · 카카오로 시작하기   (커스텀 토큰 발급용 Cloud Function 이 있어야 동작한다)
 *   · 구글로 시작하기
 *
 * Firebase Auth 로 사람을 확인하고, 우리 USERS 문서를 그 계정에 붙인다.
 * 화면들이 쓰는 값은 예전부터 USERS 의 납작한 형태(users_id · nickname · address_name …)라
 * 로그인 성공 시 그 형태로 만들어 돌려준다.
 */

/** Firebase Auth 계정(uid)에 붙은 우리 USERS 문서를 찾는다 */
const findUserByAuthUid = async (uid) => {
  const snap = await getDocs(query(collection(db, "USERS"), where("AUTH_UID", "==", uid)));
  if (snap.empty) return null;
  return snap.docs[0].data();
};

/** 이메일로 만든 계정을 찾는다 (예전 가입자 호환) */
const findUserByEmail = async (email) => {
  if (!email) return null;
  const snap = await getDocs(query(collection(db, "USERS"), where("EMAIL", "==", email)));
  if (snap.empty) return null;
  return snap.docs[0].data();
};

/** USERS 문서를 만든다 */
const createUserDoc = async ({ uid, email, nickname, userimg, provider }) => {
  const ref = doc(collection(db, "USERS"));
  const now = Date.now();

  // 약관 동의는 가입 전(/Mobileagree)에 받아둔 것을 그대로 옮겨 적는다 (형 지시 2026-08-12)
  const agree = await loadAgreement();

  const newuser = {
    USERS_ID: ref.id,
    AUTH_UID: uid,
    EMAIL: email || "",
    PROVIDER: provider,              // email · google · kakao
    DEVICEID: uid,                   // 스플래시가 이 값으로 사람을 찾는다
    DEVICETYPE: "web",
    CREATEDT: now,
    LASTLOGINDT: now,
    ACTIVITY: [],
    REVIEWITEMS: [],
    COMMUNITYITEMS: [],
    CHATINFO: [],
    AGREE: agree || null,
    USERINFO: {
      nickname: nickname || (email ? email.split("@")[0] : "홍여사 회원"),
      userimg: userimg || "",
      phone: "",
      token: "",
      address_name: FIXED_LOCATION.address_name,
      latitude: FIXED_LOCATION.latitude,
      longitude: FIXED_LOCATION.longitude,
      users_id: ref.id,
    },
  };

  await setDoc(ref, newuser);
  return newuser;
};

/** 화면들이 쓰는 납작한 형태로 바꾼다 */
export const toUserConfig = (userdoc) => {
  const info = userdoc.USERINFO || {};
  return {
    users_id: userdoc.USERS_ID,
    deviceid: userdoc.DEVICEID || "",
    nickname: info.nickname || "",
    userimg: info.userimg || "",
    phone: info.phone || "",
    token: info.token || "",
    address_name: info.address_name || "",
    latitude: info.latitude ?? null,
    longitude: info.longitude ?? null,
  };
};

/** 로그인한 계정에 USERS 문서를 잇는다. 없으면 만든다. */
const attachUserDoc = async (cred, provider) => {
  const u = cred.user;
  let userdoc = await findUserByAuthUid(u.uid);

  if (!userdoc) {
    // 예전에 같은 이메일로 만든 문서가 있으면 그 문서에 계정을 잇는다
    const byEmail = await findUserByEmail(u.email);
    if (byEmail) {
      const snap = await getDocs(query(collection(db, "USERS"), where("USERS_ID", "==", byEmail.USERS_ID)));
      if (!snap.empty) await updateDoc(snap.docs[0].ref, { AUTH_UID: u.uid, LASTLOGINDT: Date.now() });
      userdoc = { ...byEmail, AUTH_UID: u.uid };
    } else {
      userdoc = await createUserDoc({
        uid: u.uid,
        email: u.email,
        nickname: u.displayName,
        userimg: u.photoURL,
        provider,
      });
    }
  } else {
    const snap = await getDocs(query(collection(db, "USERS"), where("USERS_ID", "==", userdoc.USERS_ID)));
    if (!snap.empty) await updateDoc(snap.docs[0].ref, { LASTLOGINDT: Date.now() });
  }

  return toUserConfig(userdoc);
};

/** 이메일 회원가입 */
export const signUpWithEmail = async ({ email, password, nickname }) => {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  if (nickname) {
    try { await cred.user.updateProfile({ displayName: nickname }); } catch { /* noop */ }
  }
  const userdoc = await createUserDoc({
    uid: cred.user.uid,
    email,
    nickname,
    provider: "email",
  });
  return toUserConfig(userdoc);
};

/** 이메일 로그인 */
export const signInWithEmail = async ({ email, password }) => {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  return attachUserDoc(cred, "email");
};

/** 구글로 시작하기 */
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await auth.signInWithPopup(provider);
  return attachUserDoc(cred, "google");
};

/* ── 이메일 인증코드 로그인 (형 지시 2026-08-12) ──
   비밀번호를 두지 않는다. 코드가 그 메일함에 도착한다는 사실이 본인 확인이다.
   서버(functions/emailAuth.js)가 코드를 보내고 확인한 뒤 커스텀 토큰을 준다. */
const fns = () => getFunctions(firebaseApp);

/** 코드 보내달라고 요청. 아직 메일 키가 없으면 devCode 로 코드가 내려온다 */
export const requestLoginCode = async (email) => {
  const call = httpsCallable(fns(), "sendLoginCode");
  const res = await call({ email });
  return res.data;   // { ok, exists, devCode? }
};

/** 코드 확인 → 로그인 (계정이 없으면 그 자리에서 만들어진다) */
export const loginWithCode = async ({ email, code }) => {
  const call = httpsCallable(fns(), "verifyLoginCode");
  const res = await call({ email, code });

  const cred = await auth.signInWithCustomToken(res.data.token);
  return attachUserDoc(cred, "email");
};

/** 이메일 찾기 — 대화명이 맞으면 가려진 이메일을 알려준다 (마스킹은 서버에서) */
export const findMaskedEmails = async (nickname) => {
  const call = httpsCallable(fns(), "findMaskedEmail");
  const res = await call({ nickname });
  return res.data.found || [];
};

/**
 * 카카오로 시작하기.
 * 카카오는 Firebase 기본 제공이 아니라, 카카오 토큰을 받아 Cloud Function 에서
 * 커스텀 토큰으로 바꿔야 한다. 그 함수가 아직 없어서 여기서는 알려만 준다.
 * (필요한 것: functions 의 kakaoCustomToken + IAM 의 Service Account Token Creator)
 */
export const signInWithKakao = async () => {
  throw new Error("카카오 로그인은 준비 중입니다");
};

/** 비밀번호 재설정 메일 */
export const sendResetPassword = async (email) => {
  await auth.sendPasswordResetEmail(email);
};

/** 탈퇴 — 로그인 계정(Auth)을 서버에서 지운다. USERS 문서는 표시만 남긴다 */
export const withdrawAccount = async () => {
  const call = httpsCallable(fns(), "withdrawAccount");
  await call({});
};

/** 로그아웃 */
export const signOutAll = async () => {
  try { await auth.signOut(); } catch { /* noop */ }
};

/** Firebase 가 주는 오류 문구를 사람 말로 */
export const authErrorText = (e) => {
  const code = (e && e.code) || "";
  if (code.includes("email-already-in-use")) return "이미 가입된 이메일입니다.";
  if (code.includes("invalid-email")) return "이메일 형식이 올바르지 않습니다.";
  if (code.includes("weak-password")) return "비밀번호는 6자 이상으로 정해주세요.";
  if (code.includes("user-not-found")) return "가입되지 않은 이메일입니다.";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "비밀번호가 맞지 않습니다.";
  if (code.includes("too-many-requests")) return "잠시 후 다시 시도해주세요.";
  if (code.includes("popup-closed-by-user")) return "로그인 창이 닫혔습니다.";
  // 서버(onCall)에서 올려보낸 문구는 그대로 보여준다
  if (e && e.message && !e.message.startsWith("Firebase:")) return e.message;
  return (e && e.message) || "로그인에 실패했습니다.";
};
