import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PiCheckBold } from "react-icons/pi";
import { THEME, THEME_LABEL, readThemeMode, saveThemeMode, resolveTheme } from "../../../utility/theme";

/**
 * 내 정보 > 화면 설정 (형 요청 2026-08-13 "다크모드로 볼건지 일반 모드로 볼건지").
 *
 * 고르면 바로 화면이 바뀌고 기기에 저장된다. 다음에 열어도 그대로다.
 * "기기 설정 따름"은 휴대폰이 밤에 어두운 화면으로 바뀌면 같이 따라간다.
 */

const OPTIONS = [
  { key: THEME.LIGHT,  desc: '흰 바탕에 검은 글자' },
  { key: THEME.DARK,   desc: '어두운 바탕에 밝은 글자' },
  { key: THEME.SYSTEM, desc: '휴대폰 설정을 그대로 따라갑니다' },
];

const Container = styled.div`
  padding: 20px 20px 40px;
  min-height: 420px;
`;
const Head = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
`;
const Desc = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-sub);
  margin-bottom: 20px;
`;
const Option = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1.5px solid ${({ $on }) => ($on ? '#FF4E19' : 'var(--border)')};
  background: var(--surface);
  cursor: pointer;
  &:active { transform: scale(0.99); }
  transition: border-color .12s ease, transform .12s ease;
`;
const OptionText = styled.div`
  min-width: 0;
`;
const OptionTitle = styled.div`
  font-size: 16px;
  font-weight: ${({ $on }) => ($on ? 700 : 500)};
  color: ${({ $on }) => ($on ? '#FF4E19' : 'var(--text)')};
`;
const OptionDesc = styled.div`
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 4px;
  line-height: 1.5;
`;
const Mark = styled.div`
  flex-shrink: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF4E19;
`;
/* 지금 실제로 어떤 화면인지 — "기기 설정 따름"을 골랐을 때 헷갈리지 않게 */
const Now = styled.div`
  margin-top: 14px;
  font-size: 14px;
  color: var(--text-sub);
`;

const MobileThemeSetting = () => {
  const [mode, setMode] = useState(THEME.LIGHT);

  useEffect(() => {
    let alive = true;
    readThemeMode().then((m) => { if (alive) setMode(m); });
    return () => { alive = false; };
  }, []);

  const pick = async (next) => {
    setMode(next);
    await saveThemeMode(next);
  };

  return (
    <Container>
      <Head>화면 설정</Head>
      <Desc>눈이 편한 쪽으로 골라주세요. 고르면 바로 바뀌고 다음에 열어도 그대로입니다.</Desc>

      {OPTIONS.map((o) => (
        <Option key={o.key} $on={mode === o.key} onClick={() => pick(o.key)}>
          <OptionText>
            <OptionTitle $on={mode === o.key}>{THEME_LABEL[o.key]}</OptionTitle>
            <OptionDesc>{o.desc}</OptionDesc>
          </OptionText>
          <Mark>{mode === o.key && <PiCheckBold size={18} />}</Mark>
        </Option>
      ))}

      {mode === THEME.SYSTEM && (
        <Now>지금 기기 설정은 {THEME_LABEL[resolveTheme(THEME.SYSTEM)]} 입니다.</Now>
      )}
    </Container>
  );
};

export default MobileThemeSetting;
