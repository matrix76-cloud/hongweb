import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";
import { RiArrowRightSLine } from "react-icons/ri";
import { CONFIGMOVE } from "../../utility/screen";
import { createPortal } from "react-dom";
import MobileUseLaw from "../../components/MobileUseLaw";
import MobilePrivacyLaw from "../../components/MobilePrivacyLaw";
import MobileGpsLaw from "../../components/MobileGpsLaw";
import { Wrap, PageTitle, Card, PrimaryBtn } from "./MobileAuthParts";

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

const Lead = styled.p`
  margin: -8px 0 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #71717a;
  text-align: center;
  white-space: pre-line;
`;

const AllRow = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 2px 18px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid var(--border-soft);

  div {
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 2px;
`;

const RowLabel = styled.label`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  /* "(필수) 위치기반 서비스 이용약관" 이 두 줄로 접혀 줄 높이가 들쭉날쭉했다.
     한 줄로 두고, 그래도 모자라면 말줄임으로 끊는다. (형 리뷰 2026-08-13) */
  span {
    font-size: 15px;
    color: var(--text);
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  b {
    font-size: 15px;
    font-weight: 700;
    color: #71717a;
  }
`;

const View = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  font-size: 14px;
  font-family: inherit;
  color: #A3A3A3;
  cursor: pointer;
  padding: 4px 0 4px 4px;
  white-space: nowrap;
`;

const Check = styled.input`
  flex: none;
  width: 22px;
  height: 22px;
  accent-color: #FF4E19;
  cursor: pointer;
`;

const Note = styled.div`
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.6;
  color: #A3A3A3;
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
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--border-soft);

  button {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 10px;
    background: #FF4E19;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
  }
`;

// 필수 세 가지 + 선택 하나
const ITEMS = [
  { key: "use", label: "이용약관", required: true, view: "use" },
  { key: "privacy", label: "개인정보 처리지침", required: true, view: "privacy" },
  { key: "gps", label: "위치기반 서비스 이용약관", required: true, view: "gps" },
  { key: "marketing", label: "마케팅 정보 수신", required: false, view: null },
];

const LAW_TITLE = { use: "이용약관", privacy: "개인정보 처리지침", gps: "위치기반 서비스 이용약관" };

const MobileAgreecontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
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
    navigate("/Mobilelogin");
  };

  return (
    <Wrap style={containerStyle}>
      <PageTitle>약관에 동의해주세요</PageTitle>
      <Lead>{"가입하기 전에 한 번만 확인합니다.\n필수 항목에 동의해야 시작할 수 있습니다."}</Lead>

      <Card>
        <AllRow>
          <Check type="checkbox" checked={allDone} onChange={toggleAll} />
          <div>모두 동의합니다</div>
        </AllRow>

        {ITEMS.map((item) => (
          <Row key={item.key}>
            <RowLabel>
              <Check type="checkbox" checked={!!checked[item.key]} onChange={() => toggle(item.key)} />
              <span>
                <b>{item.required ? "(필수) " : "(선택) "}</b>
                {item.label}
              </span>
            </RowLabel>
            {item.view && (
              <View onClick={() => setLaw(item.view)}>
                보기 <RiArrowRightSLine size={16} />
              </View>
            )}
          </Row>
        ))}

        <PrimaryBtn disabled={!canGo} onClick={_handleNext}>동의하고 계속하기</PrimaryBtn>

        <Note>
          마케팅 정보 수신은 동의하지 않아도 서비스를 쓸 수 있습니다.
        </Note>
      </Card>

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
