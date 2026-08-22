import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { RiArrowRightSLine } from "react-icons/ri";
import { CONFIGMOVE } from "../../utility/screen";
import { createPortal } from "react-dom";
import MobileUseLaw from "../../components/MobileUseLaw";
import MobilePrivacyLaw from "../../components/MobilePrivacyLaw";
import MobileGpsLaw from "../../components/MobileGpsLaw";

/**
 * 약관 동의 — 가입 단계의 가장 처음 (형 지시 2026-08-12)
 *
 * 이메일이든 소셜이든, 계정을 만들기 전에 여기를 먼저 지난다.
 * 소셜 버튼을 누르는 순간 계정이 생기기 때문에, 그 전에 동의를 받아둬야 한다.
 *
 * 동의한 내용은 localforage 에 남기고, 계정을 만들 때 USERS 문서에도 함께 적는다.
 */
const AGREE_KEY = "policy.agree";

export const loadAgreement = async () => {
  try { return (await localforage.getItem(AGREE_KEY)) || null; }
  catch { return null; }
};

export const isAgreed = async () => {
  const a = await loadAgreement();
  return !!(a && a.agreed);
};

const INK = "#1b1f27";

/* 4번 시안 확정 (형 선택 2026-08-23, /agreelab)
   카드 없이 흰 바탕, 왼쪽 정렬, 체크 30px·글씨 18px, 항목마다 한 줄 설명, 버튼은 화면 맨 아래.
   다른 로그인 화면(MobileAuthParts)과 모양이 달라서 여기 부품은 따로 둔다. */
const Wrap = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--surface);
`;

const Body = styled.div`
  flex: 1;
  padding: 52px 22px 0;
`;

const Title = styled.h1`
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text);
`;

const Lead = styled.p`
  margin: 0 0 24px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--text);
`;

const AllRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 0;
  border-bottom: 2px solid ${INK};
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
  user-select: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 19px 0;
  border-bottom: 1px solid var(--border-soft);
`;

const RowLabel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  user-select: none;

  span {
    min-width: 0;
    font-size: 18px;
    line-height: 1.3;
    color: var(--text);
  }
  b {
    font-weight: 700;
    color: ${({ $required }) => ($required ? "var(--text)" : "var(--text-sub)")};
  }
  small {
    display: block;
    margin-top: 2px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-sub);
  }
`;

const View = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-weak);
  cursor: pointer;
  padding: 6px 0 6px 6px;
`;

/* 네모 체크 30px — 먹색 */
const Check = styled.button`
  flex: none;
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  padding: 0;
  border: 1.5px solid ${({ $on }) => ($on ? INK : "#C9C9CC")};
  border-radius: 0;
  background: ${({ $on }) => ($on ? INK : "var(--surface)")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CheckMark = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Foot = styled.div`
  flex: none;
  padding: 12px 22px calc(28px + var(--safe-bottom));
`;

const PrimaryBtn = styled.button`
  width: 100%;
  height: 58px;
  border: none;
  border-radius: 0;
  background: ${INK};
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  &:disabled { opacity: .35; cursor: default; }
`;

/* 전문 보기 시트 — 예전엔 하단탭이 있는 화면(/Mobileconfigcontent)으로 넘어가서,
   가입 도중인데 홈·지도·채팅 탭이 보였다. 이 화면을 벗어나지 않게 시트로 띄운다. (형 지시 2026-08-13) */
const LawDim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: flex-end;
`;
const LawSheet = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 82vh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;
const LawHead = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--border-soft);

  b { flex: 1; font-size: 17px; color: var(--text); }
  button {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    color: #71717a;
    cursor: pointer;
    padding: 0 4px;
  }
`;
const LawBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  font-size: 15px;
  line-height: 1.7;
  color: #3f4850;
`;
const LawFoot = styled.div`
  flex: none;
  padding: 12px 16px calc(12px + var(--safe-bottom));
  border-top: 1px solid var(--border-soft);

  button {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 0;
    background: #1b1f27;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
  }
`;

// 필수 세 가지 + 선택 하나
const ITEMS = [
  { key: "use", label: "이용약관", required: true, view: "use", desc: "서비스를 이용하는 기본 규칙" },
  { key: "privacy", label: "개인정보 처리지침", required: true, view: "privacy", desc: "내 정보를 어떻게 다루는지" },
  { key: "gps", label: "위치기반 서비스 이용약관", required: true, view: "gps", desc: "일감 거리를 계산하기 위해 위치를 씁니다" },
  { key: "marketing", label: "마케팅 정보 수신", required: false, view: null, desc: "동의하지 않아도 서비스를 쓸 수 있습니다" },
];

const LAW_TITLE = { use: "이용약관", privacy: "개인정보 처리지침", gps: "위치기반 서비스 이용약관" };

const MobileAgreecontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState({});
  const [law, setLaw] = useState(null);   // 전문 보기 시트

  const requiredKeys = ITEMS.filter((x) => x.required).map((x) => x.key);
  const allDone = ITEMS.every((x) => checked[x.key]);
  const canGo = requiredKeys.every((k) => checked[k]);

  const toggleAll = () => {
    const next = !allDone;
    const map = {};
    ITEMS.forEach((x) => { map[x.key] = next; });
    setChecked(map);
  };

  const toggle = (key) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  const _handleNext = async () => {
    if (!canGo) return;
    await localforage.setItem(AGREE_KEY, {
      agreed: true,
      at: Date.now(),
      use: !!checked.use,
      privacy: !!checked.privacy,
      gps: !!checked.gps,
      marketing: !!checked.marketing,
    });
    /* 어떤 로그인 버튼을 누르다 여기로 왔는지 들고 돌아간다.
       동의만 하면 그 로그인이 곧바로 이어진다 — 버튼을 두 번 누르지 않게 (형 지적 2026-08-18) */
    const after = location.state?.after || null;

    /* 이메일 회원가입을 누르다 온 경우는 이어서 할 '로그인' 이 없다. 가입 화면으로 보낸다.
       예전에는 이 경우도 로그인 화면으로 보내서, 거기 자동로그인 처리가
       카카오가 아니면 구글로 보고 엉뚱하게 구글 로그인을 띄웠다. (형 지시 2026-08-21) */
    if (after === "signup") { navigate("/Mobilesignup", { replace: true }); return; }

    navigate("/Mobilelogin", { replace: true, state: { autoLogin: after } });
  };

  return (
    <Wrap style={containerStyle}>
      <Body>
        <Title>약관에 동의해주세요</Title>
        <Lead>필수 항목에 동의해야 시작할 수 있습니다.</Lead>

        <AllRow onClick={toggleAll}>
          <Check $on={allDone} aria-pressed={allDone}>{allDone && <CheckMark />}</Check>
          모두 동의합니다
        </AllRow>

        {ITEMS.map((item) => (
          <Row key={item.key}>
            <RowLabel $required={item.required} onClick={() => toggle(item.key)}>
              <Check $on={!!checked[item.key]} aria-pressed={!!checked[item.key]}>{checked[item.key] && <CheckMark />}</Check>
              <span>
                <b>{item.required ? "(필수) " : "(선택) "}</b>
                {item.label}
                <small>{item.desc}</small>
              </span>
            </RowLabel>
            {item.view && (
              <View onClick={() => setLaw(item.view)} aria-label={`${item.label} 보기`}>
                <RiArrowRightSLine size={24} />
              </View>
            )}
          </Row>
        ))}
      </Body>

      <Foot>
        <PrimaryBtn disabled={!canGo} onClick={_handleNext}>동의하고 계속하기</PrimaryBtn>
      </Foot>

      {law && createPortal(
        <LawDim onClick={() => setLaw(null)}>
          <LawSheet onClick={(e) => e.stopPropagation()}>
            <LawHead>
              <b>{LAW_TITLE[law]}</b>
              <button onClick={() => setLaw(null)} aria-label="닫기">×</button>
            </LawHead>
            <LawBody>
              {law === "use" && <MobileUseLaw />}
              {law === "privacy" && <MobilePrivacyLaw />}
              {law === "gps" && <MobileGpsLaw />}
            </LawBody>
            <LawFoot>
              {/* 읽고 나면 그 자리에서 켜지게 — 다시 찾아 누르지 않아도 된다 */}
              <button onClick={() => { setChecked((p) => ({ ...p, [law]: true })); setLaw(null); }}>
                확인했습니다
              </button>
            </LawFoot>
          </LawSheet>
        </LawDim>,
        document.body
      )}
    </Wrap>
  );
};

export default MobileAgreecontainer;
