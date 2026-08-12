import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { findMaskedEmails, sendResetPassword, authErrorText } from "../../service/AuthService";
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import {
  Wrap, PageTitle, Card, Field, Label, Input, Hint, PrimaryBtn,
  Tabs, Tab, ResultBox, ResultLine, Bottom,
} from "./MobileAuthParts";

/**
 * 계정 찾기 (형 지시 2026-08-12)
 *
 *   이메일 찾기   : 쓰던 대화명을 적으면 가입한 이메일을 가려서 알려준다.
 *                  마스킹은 서버(findMaskedEmail)에서 한다 — 앱에서 조회하면 원본이 보인다.
 *   비밀번호 찾기 : 가입한 이메일로 재설정 메일을 보낸다 (Firebase 가 보낸다).
 */
const MobileFindAccountcontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState(location.state?.tab === "password" ? "password" : "email");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [found, setFound] = useState(null);   // null=아직 / []=없음 / [{email,provider}]
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);

  const alertBox = (title, message) =>
    setDialog({ title, message, alertonly: true, onConfirm: () => setDialog(null) });

  const switchTab = (next) => {
    setTab(next);
    setFound(null);
    setSent(false);
  };

  /** 대화명으로 이메일 찾기 */
  const _handleFindEmail = async () => {
    if (busy) return;
    if (nickname.trim().length < 2) {
      alertBox("대화명을 확인해주세요", "두 글자 이상 적어주세요.");
      return;
    }
    setBusy(true);
    try {
      const list = await findMaskedEmails(nickname.trim());
      setFound(list);
    } catch (e) {
      alertBox("찾지 못했습니다", authErrorText(e));
    }
    setBusy(false);
  };

  /** 비밀번호 재설정 메일 보내기 */
  const _handleSendReset = async () => {
    if (busy) return;
    if (!email.trim()) {
      alertBox("이메일을 적어주세요", "재설정 메일을 보낼 주소가 필요합니다.");
      return;
    }
    setBusy(true);
    try {
      await sendResetPassword(email.trim());
      setSent(true);
    } catch (e) {
      alertBox("보내지 못했습니다", authErrorText(e));
    }
    setBusy(false);
  };

  return (
    <Wrap style={containerStyle}>
      <PageTitle>계정 찾기</PageTitle>

      <Card>
        <Tabs>
          <Tab $on={tab === "email"} onClick={() => switchTab("email")}>이메일 찾기</Tab>
          <Tab $on={tab === "password"} onClick={() => switchTab("password")}>비밀번호 찾기</Tab>
        </Tabs>

        {tab === "email" ? (
          <>
            <Field>
              <Label htmlFor="nickname">대화명</Label>
              <Input
                id="nickname" autoFocus
                value={nickname} placeholder="쓰던 대화명을 적어주세요"
                onChange={(e) => { setNickname(e.target.value); setFound(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") _handleFindEmail(); }}
              />
              <Hint>대화명이 맞으면 가입한 이메일을 일부만 알려드립니다.</Hint>
            </Field>

            <PrimaryBtn disabled={busy} onClick={_handleFindEmail}>
              {busy ? "찾는 중..." : "이메일 찾기"}
            </PrimaryBtn>

            {found !== null && (
              found.length === 0 ? (
                <ResultBox>
                  <ResultLine>
                    찾지 못했습니다
                    <small>그 대화명으로 가입한 계정이 없습니다. 카카오·구글로 시작했는지도 확인해보세요.</small>
                  </ResultLine>
                </ResultBox>
              ) : (
                <ResultBox>
                  {found.map((f, k) => (
                    <ResultLine key={k}>
                      {f.email}
                      <small>{f.provider === "email" ? "이메일로 가입" : `${f.provider}로 가입`}</small>
                    </ResultLine>
                  ))}
                </ResultBox>
              )
            )}
          </>
        ) : (
          <>
            <Field>
              <Label htmlFor="resetEmail">이메일</Label>
              <Input
                id="resetEmail" type="email" inputMode="email" autoFocus
                value={email} placeholder="가입한 이메일"
                onChange={(e) => { setEmail(e.target.value); setSent(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") _handleSendReset(); }}
              />
              <Hint>그 주소로 비밀번호를 새로 정할 수 있는 메일을 보냅니다.</Hint>
            </Field>

            <PrimaryBtn disabled={busy} onClick={_handleSendReset}>
              {busy ? "보내는 중..." : "재설정 메일 보내기"}
            </PrimaryBtn>

            {sent && (
              <ResultBox>
                <ResultLine>
                  메일을 보냈습니다
                  <small>받은 편지함에서 링크를 눌러 새 비밀번호를 정해주세요. 메일이 안 보이면 스팸함도 확인해보세요.</small>
                </ResultLine>
              </ResultBox>
            )}
          </>
        )}
      </Card>

      <Bottom>
        <button onClick={() => navigate("/Mobilelogin")}>로그인으로 돌아가기</button>
      </Bottom>

      {dialog && <MobileConfirmPopup {...dialog} onCancel={() => setDialog(null)} />}
    </Wrap>
  );
};

export default MobileFindAccountcontainer;
