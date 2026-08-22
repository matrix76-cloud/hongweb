// 앱 안 푸시 배너 (2026-08-22)
//
// 앱(HongLady)을 보고 있는 중에 알림이 오면 앱이 PUSH_EVENT 로 제목·본문·링크를 넘긴다.
// (소리는 앱이 이미 냈다 — 여기서 재생하면 두 번 울린다)
// 화면 위에서 내려오는 흰 배너. 누르면 그 화면으로, 4.5초 지나면 스스로 사라진다.
// 연속으로 오면 마지막 것만 보여준다.
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { isInApp, listenApp } from "../service/appBridge";
import imgHong from "../assets/imageset/honglady.png";

const INK = "#1b1f27";
const SHOW_MS = 4500;

const slideIn = keyframes`
  from { transform: translateY(-120%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

const Wrap = styled.div`
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 10px);
  left: 12px; right: 12px;
  z-index: 9999;
  animation: ${slideIn} .28s ease-out;
`;
const Card = styled.div`
  display: flex; align-items: flex-start; gap: 12px;
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .14);
  padding: 14px 14px 14px 16px;
  cursor: pointer;
`;
const Mark = styled.img`
  width: 36px; height: 36px; border-radius: 10px; flex: 0 0 36px;
`;
const Text = styled.div`
  flex: 1; min-width: 0;
`;
const Title = styled.div`
  font-size: 16px; font-weight: 800; color: ${INK}; line-height: 1.3; letter-spacing: -.01em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const Body = styled.div`
  font-size: 15px; color: ${INK}; line-height: 1.45; margin-top: 3px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
`;
const Close = styled.button`
  border: 0; background: none; padding: 2px 4px; margin: -2px -4px 0 0;
  font-size: 18px; line-height: 1; color: ${INK}; cursor: pointer;
`;

const PushBanner = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (!isInApp()) return undefined;
    const stop = listenApp((type, data) => {
      if (type !== "PUSH_EVENT") return;
      if (!data?.title && !data?.body) return;
      setItem({ title: data.title, body: data.body, link: data.link, key: data.messageId || Date.now() });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setItem(null), SHOW_MS);
    });
    return () => { stop(); clearTimeout(timer.current); };
  }, []);

  if (!item) return null;

  const open = () => {
    setItem(null);
    if (item.link) navigate(item.link);
  };
  const close = (e) => { e.stopPropagation(); setItem(null); };

  return (
    <Wrap key={item.key}>
      <Card onClick={open}>
        <Mark src={imgHong} alt="" />
        <Text>
          <Title>{item.title || "구해줘 홍여사"}</Title>
          {item.body ? <Body>{item.body}</Body> : null}
        </Text>
        <Close onClick={close} aria-label="닫기">×</Close>
      </Card>
    </Wrap>
  );
};

export default PushBanner;
