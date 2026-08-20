import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../../context/User";
import { signInWithGoogle, signInWithKakao, authErrorText, completeGoogleRedirect } from "../../service/AuthService";
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import { isAgreed } from "./MobileAgreecontainer";
import { imageDB } from "../../utility/imageData";
import { useNoScroll } from "../../utility/useNoScroll";
import { enterGuest, clearGuest } from "../../utility/guest";
import { SocialBtn } from "./MobileAuthParts";

/**
 * 로그인 (형 지시 2026-08-18 — 소셜 로그인만)
 *
 *   카카오 · 구글로 시작하기      (네이버는 넣지 않는다)
 *
 * 이메일 로그인을 걷어내고 나니 남은 게 버튼 두 개뿐인데 위쪽에만 몰려 있고
 * 아래가 텅 비어 허전했다 (형 지적 2026-08-18). 그래서 이 화면만 따로 짠다.
 *  · 공용 Wrap/Card 를 쓰지 않는다 — 흰 카드 안에 버튼 두 개만 있는 꼴이 어색했다
 *  · 로고~버튼을 화면 가운데에 두고, 둘러보기는 아래에 붙인다
 *  · 버튼 아래 안내 문구는 뺐다 — 없어도 무슨 화면인지 안다 (형 지시)
 *
 * /Mobilesignup · /Mobilefindaccount 라우트와 AuthService.signInWithEmail 은
 * 지우지 않고 남겨뒀다. 들어가는 길만 없앤 상태다.
 */
const Screen = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--surface);
  padding: 40px 24px calc(28px + var(--safe-bottom));
  display: flex;
  flex-direction: column;
`;

const Middle = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
  display: block;
  margin: 0 auto 16px;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: var(--text);
  text-align: center;
  letter-spacing: -.02em;
`;

const Sub = styled.div`
  margin: 10px 0 32px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text);
  opacity: .75;
  text-align: center;
  word-break: keep-all;
`;

const LookAround = styled.button`
  display: block;
  margin: 0 auto;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-sub);
  text-decoration: underline;
  cursor: pointer;
  padding: 10px;
`;

const MobileLogincontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(UserContext);

  useNoScroll();   // 한 화면에 다 들어간다 — 스크롤 막대도 밀리는 느낌도 없앤다

  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);

  /* 약관에서 동의하고 돌아온 길이면 로그인 화면을 보여주지 않는다.
     버튼을 이미 한 번 눌렀는데 같은 화면이 또 나오면 안 된다 (형 지적 2026-08-18).
     첫 그림부터 가림막이 뜨게 초기값을 여기서 정한다. */
  const autoLogin = location.state?.autoLogin || null;
  const [autoRunning, setAutoRunning] = useState(!!autoLogin);

  /* 앱에서 구글 로그인은 리다이렉트로 다녀온다 — 돌아오면 여기서 마무리한다.
     결과가 있으면 약관 검사보다 먼저 처리해야 방금 로그인한 사람을 도로 밀어내지 않는다. */
  useEffect(() => {
    let alive = true;

    (async () => {
      /* ① 약관에서 동의하고 돌아온 길 — 누르려던 로그인을 곧바로 이어서 한다.
            한 번 쓰고 흘려보내야 뒤로가기로 다시 들어와도 또 돌지 않는다. */
      if (autoLogin) {
        navigate(location.pathname, { replace: true, state: {} });
        try {
          const cfg = autoLogin === "kakao" ? await signInWithKakao() : await signInWithGoogle();
          if (!alive) return;
          await done(cfg);
          return;                       // 성공하면 이 화면을 떠난다
        } catch (e) {
          if (!alive) return;
          alertBox("로그인하지 못했습니다", authErrorText(e));
        }
        setAutoRunning(false);          // 실패했을 때만 로그인 화면을 보여준다
        return;
      }

      /* ② 옛 앱에서 구글 리다이렉트로 다녀온 경우 */
      const { cfg, error } = await completeGoogleRedirect();
      if (!alive) return;
      if (cfg) { await done(cfg); return; }
      if (error) { alertBox("로그인하지 못했습니다", authErrorText(error)); return; }

      /* 예전에는 여기서 약관을 안 봤으면 곧장 /Mobileagree 로 튕겼다.
         그래서 온보딩을 마치면 로그인 화면이 잠깐 스치고 약관이 떴다.
         약관은 '로그인 화면을 여는 순간'이 아니라 '실제로 로그인을 시작할 때' 받는다.
         (형 지시 2026-08-18 — 온보딩 다음은 바로 로그인 페이지) */
    })();

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

  /* 로그인을 시작하기 전에 약관을 받는다. 아직이면 약관 화면으로 보내고,
     거기서 동의하면 다시 이 화면으로 돌아온다. */
  const passAgreement = async (provider) => {
    if (await isAgreed()) return true;
    navigate("/Mobileagree", { state: { after: provider } });
    return false;
  };

  const _handleGoogle = async () => {
    if (busy) return;
    if (!(await passAgreement("google"))) return;
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
    if (busy) return;
    if (!(await passAgreement("kakao"))) return;
    setBusy(true);
    try {
      // 예전에는 로그인만 하고 결과를 버려서, 성공해도 화면이 그대로 있었다
      const cfg = await signInWithKakao();
      await done(cfg);
    } catch (e) {
      alertBox("카카오로 시작하기", authErrorText(e));
    }
    setBusy(false);
  };

  /* 동의하고 넘어온 직후 — 로그인 창이 뜨기까지 아주 잠깐이지만
     그 사이에 로그인 화면이 번쩍이면 버튼을 또 눌러야 하는 줄 안다 */
  if (autoRunning) {
    return (
      <Screen style={containerStyle}>
        <Middle>
          <Logo src={imageDB.logo} alt="" />
          <Title>구해줘 홍여사</Title>
          <Sub>로그인 중입니다</Sub>
        </Middle>
        {dialog && <MobileConfirmPopup {...dialog} onCancel={() => setDialog(null)} />}
      </Screen>
    );
  }

  return (
    <Screen style={containerStyle}>
      <Middle>
        <Logo src={imageDB.logo} alt="" />
        <Title>구해줘 홍여사</Title>
        <Sub>동네 일손이 필요할 때, 홍여사</Sub>

        <SocialBtn $kind="kakao" onClick={_handleKakao}>
          <RiKakaoTalkFill size={20} /> 카카오로 시작하기
        </SocialBtn>
        <SocialBtn $kind="google" disabled={busy} onClick={_handleGoogle}>
          <FcGoogle size={20} /> 구글로 시작하기
        </SocialBtn>
      </Middle>

      {/* 가입 전에 동네에 일감이 있는지부터 보게 한다 (형 리뷰 2026-08-13).
          보는 건 열어두고, 등록·지원·채팅에서 로그인을 받는다. */}
      <LookAround onClick={_handleLookAround}>로그인 없이 먼저 둘러보기</LookAround>

      {dialog && <MobileConfirmPopup {...dialog} onCancel={() => setDialog(null)} />}
    </Screen>
  );
};

export default MobileLogincontainer;
