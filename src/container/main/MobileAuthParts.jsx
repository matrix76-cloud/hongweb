import styled from "styled-components";

/**
 * 로그인 · 회원가입 · 계정 찾기 화면이 함께 쓰는 부품. (형 지시 2026-08-12)
 * 세 화면이 같은 모양이어야 하니 여기 한 곳에 둔다.
 */
export const Wrap = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  background: #F7F7F8;
  padding: 40px 20px calc(32px + env(safe-area-inset-bottom, 0px));
`;

export const Logo = styled.img`
  width: 52px;
  height: 52px;
  display: block;
  margin: 0 auto 14px;
`;

export const PageTitle = styled.h1`
  margin: 0 0 24px;
  font-size: 26px;
  font-weight: 800;
  color: var(--text);
  text-align: center;
`;

export const Card = styled.div`
  background: var(--surface);
  border-radius: 16px;
  padding: 24px 20px;
`;

export const Field = styled.div`
  & + & { margin-top: 18px; }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  height: 52px;
  padding: 0 14px;
  border: 1px solid ${({ $error }) => ($error ? "#c02020" : "var(--border)")};
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  color: var(--text);
  outline: none;
  background: var(--surface);
  &:focus { border-color: #FF4E19; }
  &::placeholder { color: #BDBDC2; }
  &:disabled { background: var(--bg-soft); color: #71717a; }
`;

export const Hint = styled.div`
  margin-top: 7px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ $error }) => ($error ? "#c02020" : "#A3A3A3")};
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  height: 54px;
  margin-top: 22px;
  border: none;
  border-radius: 10px;
  background: #FF4E19;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  &:disabled { opacity: .45; cursor: default; }
`;

export const Divider = styled.div`
  margin: 26px 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #A3A3A3;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #EDEDED;
  }
`;

export const SocialBtn = styled.button`
  width: 100%;
  height: 54px;
  border-radius: 10px;
  border: ${({ $kind }) => ($kind === "google" ? "1px solid var(--border)" : "none")};
  background: ${({ $kind }) => ($kind === "kakao" ? "#FEE500" : "#fff")};
  color: var(--text);
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  & + & { margin-top: 10px; }
`;

export const Bottom = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 15px;
  color: #71717a;

  button {
    background: none;
    border: none;
    font-size: 15px;
    font-family: inherit;
    font-weight: 700;
    color: #FF4E19;
    cursor: pointer;
    padding: 4px;
  }
`;

/* 계정 찾기 — 이메일 찾기 / 비밀번호 찾기 탭 */
export const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #E9E9EC;
`;

export const Tab = styled.button`
  flex: 1;
  height: 48px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $on }) => ($on ? "#FF4E19" : "transparent")};
  color: ${({ $on }) => ($on ? "#131313" : "#A3A3A3")};
  font-size: 16px;
  font-weight: ${({ $on }) => ($on ? 700 : 500)};
  font-family: inherit;
  cursor: pointer;
`;

export const ResultBox = styled.div`
  margin-top: 20px;
  padding: 18px 16px;
  border: 1px solid #FFD9CC;
  border-radius: 12px;
  background: #FFF8F5;
`;

export const ResultLine = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  & + & { margin-top: 8px; }

  small {
    display: block;
    margin-top: 3px;
    font-size: 14px;
    font-weight: 500;
    color: #71717a;
  }
`;
