import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../../context/User";
import { signInWithEmail, signInWithGoogle, signInWithKakao, authErrorText } from "../../service/AuthService";
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import { isAgreed } from "./MobileAgreecontainer";
import { imageDB } from "../../utility/imageData";
import { enterGuest, clearGuest } from "../../utility/guest";
import {
  Wrap, Logo, PageTitle, Card, Field, Label, Input, PrimaryBtn,
  SocialBtn, Divider, Bottom,
} from "./MobileAuthParts";

/**
 * 로그인 (형 지시 2026-08-12 — 숨고 화면 그대로)
 *
 *   이메일 + 비밀번호
 *   이메일 찾기 | 비밀번호 찾기   → /Mobilefindaccount
 *   카카오 · 구글로 시작하기      (네이버는 넣지 않는다)
 */
const Links = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 15px;

  span { color: #E3E3E3; }
  button {
    background: none;
    border: none;
    font-size: 15px;
    font-family: inherit;
    color: #71717a;
    cursor: pointer;
    padding: 4px;
  }
`;

const LookAround = styled.button`
  display: block;
  margin: 6px auto 30px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-sub);
  text-decoration: underline;
  cursor: pointer;
  padding: 8px;
`;

const MobileLogincontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);

  // 주소로 곧장 들어온 경우에도 약관을 먼저 지나게 한다 (형 지시 2026-08-12)
  useEffect(() => {
    let alive = true;
    isAgreed().then((ok) => { if (alive && !ok) navigate("/Mobileagree", { replace: true }); });
    return () => { alive = false; };
  }, []);

  /* 둘러보기 — 게스트로 표시하고 홈으로 */
  const _handleLookAround = async () => {
    await enterGuest();
    navigate("/Mobilemain");
  };

  const alertBox = (title, message) =>
    setDialog({ title, message, alertonly: true, onConfirm: () => setDialog(null) });

  const done = async (userconfig) => {
    await localforage.setItem("userconfig", userconfig);
    await clearGuest();   // 로그인했으면 둘러보기 표시를 지운다 (형 리뷰 2026-08-13)
    dispatch(userconfig);
    navigate("/Mobilemain");
  };

  const _handleLogin = async () => {
    if (busy) return;
    if (!email.trim() || !password) {
      alertBox("입력을 확인해주세요", "이메일과 비밀번호를 모두 적어주세요.");
      return;
    }
    setBusy(true);
    try {
      const cfg = await signInWithEmail({ email: email.trim(), password });
      await done(cfg);
    } catch (e) {
      alertBox("로그인하지 못했습니다", authErrorText(e));
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
      alertBox("로그인하지 못했습니다", authErrorText(e));
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
      <PageTitle>로그인</PageTitle>

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
            id="password" type="password" autoComplete="current-password"
            value={password} placeholder="비밀번호를 입력해 주세요."
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") _handleLogin(); }}
          />
        </Field>

        <PrimaryBtn disabled={busy} onClick={_handleLogin}>
          {busy ? "로그인 중..." : "이메일 로그인"}
        </PrimaryBtn>

        <Links>
          <button onClick={() => navigate("/Mobilefindaccount", { state: { tab: "email" } })}>이메일 찾기</button>
          <span>|</span>
          <button onClick={() => navigate("/Mobilefindaccount", { state: { tab: "password" } })}>비밀번호 찾기</button>
        </Links>

        <Divider>다른 방법으로 시작하기</Divider>

        <SocialBtn $kind="kakao" onClick={_handleKakao}>
          <RiKakaoTalkFill size={20} /> 카카오로 시작하기
        </SocialBtn>
        <SocialBtn $kind="google" onClick={_handleGoogle}>
          <FcGoogle size={20} /> 구글로 시작하기
        </SocialBtn>
      </Card>

      <Bottom>
        아직 회원이 아니신가요?
        <button onClick={() => navigate("/Mobilesignup")}>회원가입</button>
      </Bottom>

      {/* 가입 전에 동네에 일감이 있는지부터 보게 한다 (형 리뷰 2026-08-13).
          보는 건 열어두고, 등록·지원·채팅에서 로그인을 받는다. */}
      <LookAround onClick={_handleLookAround}>로그인 없이 먼저 둘러보기</LookAround>

      {dialog && <MobileConfirmPopup {...dialog} onCancel={() => setDialog(null)} />}
    </Wrap>
  );
};

export default MobileLogincontainer;
