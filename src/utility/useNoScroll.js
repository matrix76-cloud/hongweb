import { useEffect } from "react";

/**
 * 이 화면이 떠 있는 동안 틀(.app-frame)이 스크롤되지 않게 한다.
 *
 * 온보딩·로그인·스플래시처럼 한 화면에 다 들어가는 화면은 스크롤할 일이 없는데도
 * 오른쪽에 스크롤 막대가 잠깐씩 보였다. 내용이 1px 이라도 넘치면 틀이 스크롤 가능해지기
 * 때문이다. 그런 화면에서만 이 훅을 부른다. (형 지시 2026-08-18)
 *
 * 화면을 떠날 때 원래대로 되돌린다 — 다른 화면은 스크롤이 되어야 한다.
 */
export const useNoScroll = () => {
  useEffect(() => {
    const frame = document.getElementById("app-frame");
    const beforeFrame = frame ? frame.style.overflowY : null;
    const beforeBody = document.body.style.overflow;

    if (frame) frame.style.overflowY = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      if (frame) frame.style.overflowY = beforeFrame || "";
      document.body.style.overflow = beforeBody || "";
    };
  }, []);
};

export default useNoScroll;
