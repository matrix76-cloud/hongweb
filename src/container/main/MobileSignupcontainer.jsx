import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../../context/User";
import { signUpWithEmail, signInWithGoogle, signInWithKakao, authErrorText } from "../../service/AuthService";
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import { isAgreed } from "./MobileAgreecontainer";
import { imageDB } from "../../utility/imageData";
import {
  Wrap, Logo, PageTitle, Card, Field, Label, Input, Hint, PrimaryBtn,
  SocialBtn, Divider, Bottom,
} from "./MobileAuthParts";

/**
 * 회원가입 (형 지시 2026-08-12)
 *
 * 이메일 · 비밀번호 · 비밀번호 확인 · 대화명.
 * 약관 동의는 이 화면 앞(/Mobileagree)에서 이미 받았다.
 * 대화명은 나중에 이메일 찾기의 열쇠가 되므로 여기서 꼭 받는다.
 */
const MobileSignupcontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);

  // 주소로 곧장 들어온 경우에도 약관을 먼저 지나게 한다 (형 지시 2026-08-12)
  useEffect(() => {
    let alive = true;
    isAgreed().then((ok) => { if (alive && !ok) navigate("/Mobileagree", { replace: true }); });
    return () => { alive = false; };
  }, []);

  const alertBox = (title, message) =>
    setDialog({ title, message, alertonly: true, onConfirm: () => setDialog(null) });

  const pwMismatch = password2.length > 0 && password !== password2;

  const done = async (userconfig) => {
    await localforage.setItem("userconfig", userconfig);
    dispatch(userconfig);
    navigate("/Mobilemain");
  };

  const _handleSignup = async () => {
    if (busy) return;
    if (!email.trim() || !password || !nickname.trim()) {
      alertBox("입력을 확인해주세요", "이메일 · 비밀번호 · 대화명을 모두 적어주세요.");
      return;
    }
    if (password.length < 6) {
      alertBox("비밀번호가 짧습니다", "6자 이상으로 정해주세요.");
      return;
    }
    if (password !== password2) {
      alertBox("비밀번호가 다릅니다", "두 번 적은 비밀번호가 같아야 합니다.");
      return;
    }

    setBusy(true);
    try {
      const cfg = await signUpWithEmail({ email: email.trim(), password, nickname: nickname.trim() });
      await done(cfg);
    } catch (e) {
      alertBox("가입하지 못했습니다", authErrorText(e));
    }
    setBusy(false);
  };

  const _handleGoogle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const cfg = await signInWithGoogle();
      await done(cfg);
    } catch (e) {
      alertBox("가입하지 못했습니다", authErrorText(e));
    }
    setBusy(false);
  };

  const _handleKakao = async () => {
    try { await signInWithKakao(); }
    catch (e) { alertBox("카카오로 시작하기", e.message); }
  };

  return (
    <Wrap style={containerStyle}>
      <Logo src={imageDB.logo} alt="" />
      <PageTitle>회원가입</PageTitle>

      <Card>
        <Field>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email" type="email" inputMode="email" autoComplete="email"
            value={email} placeholder="example@hong.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password" type="password" autoComplete="new-password"
            value={password} placeholder="6자 이상"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field>
          <Label htmlFor="password2">비밀번호 확인</Label>
          <Input
            id="password2" type="password" autoComplete="new-password" $error={pwMismatch}
            value={password2} placeholder="한 번 더 적어주세요"
            onChange={(e) => setPassword2(e.target.value)}
          />
          {pwMismatch && <Hint $error>비밀번호가 다릅니다.</Hint>}
        </Field>

        <Field>
          <Label htmlFor="nickname">대화명</Label>
          <Input
            id="nickname"
            value={nickname} placeholder="채팅에서 보일 이름"
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") _handleSignup(); }}
          />
          <Hint>이메일을 잊었을 때 이 대화명으로 찾을 수 있습니다.</Hint>
        </Field>

        <PrimaryBtn disabled={busy} onClick={_handleSignup}>
          {busy ? "가입 중..." : "가입하기"}
        </PrimaryBtn>

        <Divider>다른 방법으로 시작하기</Divider>

        <SocialBtn $kind="kakao" onClick={_handleKakao}>
          <RiKakaoTalkFill size={20} /> 카카오로 시작하기
        </SocialBtn>
        <SocialBtn $kind="google" onClick={_handleGoogle}>
          <FcGoogle size={20} /> 구글로 시작하기
        </SocialBtn>
      </Card>

      <Bottom>
        이미 회원이신가요?
        <button onClick={() => navigate("/Mobilelogin")}>로그인</button>
      </Bottom>

      {dialog && <MobileConfirmPopup {...dialog} onCancel={() => setDialog(null)} />}
    </Wrap>
  );
};

export default MobileSignupcontainer;
