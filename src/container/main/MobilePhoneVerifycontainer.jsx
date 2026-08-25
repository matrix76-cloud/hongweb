import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { UserContext } from "../../context/User";
import { requestPhoneCode, confirmPhoneCode } from "../../service/AuthService";
import { clearGuest } from "../../utility/guest";
import { imageDB } from "../../utility/imageData";
import { Wrap, Logo, PageTitle, Card, Field, Label, Input, Hint, PrimaryBtn } from "./MobileAuthParts";

/**
 * 휴대폰 번호 인증 (형 결정 2026-08-23 — 도우미 VerifyPage 구조)
 *
 * 소셜 로그인 직후 한 번만 거친다. 번호는 계정을 잇는 열쇠다:
 *   예전(2025) 홍여사 회원이면 그 번호로 예전 정보(지원서·채팅·일감)가 그대로 이어지고,
 *   처음이면 그냥 번호만 적힌다. 사용자는 어느 쪽인지 알 필요 없다 — 그래서 안내 팝업도 없다.
 *
 * 인증번호는 카카오 알림톡으로, 카카오가 없으면 문자로 온다.
 * 번호칸은 autocomplete="tel" — 안드로이드는 키보드 위에 내 번호가 떠서 한 번 탭하면 들어간다.
 */
const Lead = styled.div`
  margin: -10px 0 22px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--text);
  text-align: center;
  white-space: pre-line;
`;
const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;
const SendBtn = styled.button`
  flex: none;
  height: 52px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: ${({ $on }) => ($on ? "#1b1f27" : "var(--bg-soft)")};
  color: ${({ $on }) => ($on ? "#fff" : "#A3A3A3")};
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  &:disabled { cursor: default; }
`;
const Resend = styled.button`
  display: block;
  margin: 14px auto 0;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  &:disabled { opacity: .5; text-decoration: none; cursor: default; }
`;

/** "+82 10-6214-9756"(자동완성) · "010-6214-9756" → "01062149756" — 서버 normPhone 과 같은 규칙 */
const toDigits = (raw) => {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("82")) d = "0" + d.slice(2);
  return d.slice(0, 11);
};
const fmtPhone = (raw) => {
  const d = toDigits(raw);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

const MobilePhoneVerifycontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [msg, setMsg] = useState(null);        // { text, err }
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const digits = toDigits(phone);
  const phoneOk = /^01[016789]\d{7,8}$/.test(digits);
  const codeOk = code.replace(/\D/g, "").length === 6;

  const startCooldown = () => {
    setCooldown(60);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCooldown((c) => { if (c <= 1) { clearInterval(timer.current); return 0; } return c - 1; });
    }, 1000);
  };

  const sendCode = async () => {
    if (sending) return;
    if (cooldown > 0) { setMsg({ text: `${cooldown}초 후에 다시 받을 수 있어요.`, err: true }); return; }
    if (!phoneOk) { setMsg({ text: "휴대폰 번호를 확인해 주세요.", err: true }); return; }
    setSending(true); setMsg(null);
    try {
      const res = await requestPhoneCode(digits);
      setSent(true); setCode("");
      if (res?.devCode) {
        // 발송 키가 없는 개발 환경 — 코드를 바로 넣어준다
        setCode(res.devCode);
        setMsg({ text: "개발 환경: 인증번호가 자동으로 입력됐어요.", err: false });
      } else {
        setMsg({ text: "카카오톡(또는 문자)으로 인증번호를 보냈어요. 확인 후 입력해 주세요.", err: false });
      }
      startCooldown();
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (e) {
      setMsg({ text: e?.message || "인증번호를 보내지 못했어요. 잠시 후 다시 시도해 주세요.", err: true });
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    if (verifying) return;
    if (!sent || !codeOk) { setMsg({ text: "인증번호 6자리를 입력해 주세요.", err: true }); return; }
    setVerifying(true); setMsg(null);
    try {
      const res = await confirmPhoneCode({ phone: digits, code: code.replace(/\D/g, "") });
      const cfg = res?.cfg;
      if (!cfg) throw new Error("회원 정보를 불러오지 못했어요. 다시 로그인해 주세요.");
      await localforage.setItem("userconfig", cfg);
      await clearGuest();
      dispatch(cfg);
      clearInterval(timer.current);
      // 예전 회원이든 처음이든 똑같이 홈으로 — 합쳐졌다는 건 알릴 필요가 없다 (형 2026-08-23)
      navigate("/Mobilemain", { replace: true });
    } catch (e) {
      setMsg({ text: e?.message || "인증번호가 올바르지 않아요.", err: true });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Wrap style={containerStyle}>
      <Logo src={imageDB.logo} alt="" />
      <PageTitle>휴대폰 번호 인증</PageTitle>
      <Lead>{"처음 한 번만 확인해요.\n인증번호는 카카오톡(또는 문자)으로 보내드려요."}</Lead>

      <Card>
        <Field>
          <Label htmlFor="phone">휴대폰 번호</Label>
          <Row>
            <Input
              id="phone" type="tel" inputMode="numeric" autoComplete="tel"
              value={fmtPhone(phone)} placeholder="010-0000-0000"
              onChange={(e) => { setPhone(e.target.value); setMsg(null); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) sendCode(); }}
              disabled={sent && cooldown > 0}
            />
            <SendBtn type="button" $on={phoneOk && !sending && cooldown === 0} disabled={sending} onClick={sendCode}>
              {sending ? "보내는 중" : sent ? (cooldown > 0 ? `${cooldown}초` : "다시 받기") : "인증번호 받기"}
            </SendBtn>
          </Row>
        </Field>

        {sent && (
          <Field>
            <Label htmlFor="code">인증번호</Label>
            <Input
              id="code" ref={codeRef} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
              value={code} placeholder="6자리"
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setMsg(null); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) verify(); }}
            />
          </Field>
        )}

        {msg && <Hint $error={msg.err}>{msg.text}</Hint>}

        <PrimaryBtn disabled={!sent || !codeOk || verifying} onClick={verify}>
          {verifying ? "확인 중..." : "확인"}
        </PrimaryBtn>

        {sent && (
          <Resend type="button" onClick={sendCode} disabled={sending || cooldown > 0}>
            {cooldown > 0 ? `${cooldown}초 후 다시 받을 수 있어요` : "인증번호가 안 오나요? 다시 받기"}
          </Resend>
        )}
      </Card>

    </Wrap>
  );
};

export default MobilePhoneVerifycontainer;
