import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PiCheckBold } from "react-icons/pi";
import {
  TEXT_SCALE, TEXT_SCALE_LABEL, readTextScale, saveTextScale,
} from "../../../utility/textScale";

/**
 * 내 정보 > 글자 크기 (형 지시 2026-08-19
 * "화면 뿐만 아니라 글자 보기를 세 단계로 — 작게 / 보통 / 크게")
 *
 * 화면 설정과 같은 모양으로 둔다. 고르면 바로 바뀌고 다음에 열어도 그대로다.
 */

const OPTIONS = [
  { key: TEXT_SCALE.SMALL,  desc: '한 화면에 더 많이 보입니다' },
  { key: TEXT_SCALE.NORMAL, desc: '기본 크기입니다' },
  { key: TEXT_SCALE.LARGE,  desc: '글자가 커서 읽기 편합니다' },
];

/* 고르기 전에 얼마나 커지는지 보이게 — 숫자만 보고는 감이 안 온다 */
const PREVIEW_PX = {
  [TEXT_SCALE.SMALL]: 14,
  [TEXT_SCALE.NORMAL]: 16,
  [TEXT_SCALE.LARGE]: 19,
};

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
  font-size: ${({ $px }) => $px}px;
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

const MobileTextSizeSetting = () => {
  const [scale, setScale] = useState(TEXT_SCALE.NORMAL);

  useEffect(() => {
    let alive = true;
    readTextScale().then((v) => { if (alive) setScale(v); });
    return () => { alive = false; };
  }, []);

  const pick = async (next) => {
    setScale(next);
    await saveTextScale(next);
  };

  return (
    <Container>
      <Head>글자 크기</Head>
      <Desc>읽기 편한 크기로 골라주세요. 고르면 바로 바뀌고 다음에 열어도 그대로입니다.</Desc>

      {OPTIONS.map((o) => (
        <Option key={o.key} $on={scale === o.key} onClick={() => pick(o.key)}>
          <OptionText>
            <OptionTitle $on={scale === o.key} $px={PREVIEW_PX[o.key]}>
              {TEXT_SCALE_LABEL[o.key]}
            </OptionTitle>
            <OptionDesc>{o.desc}</OptionDesc>
          </OptionText>
          <Mark>{scale === o.key && <PiCheckBold size={18} />}</Mark>
        </Option>
      ))}
    </Container>
  );
};

export default MobileTextSizeSetting;
