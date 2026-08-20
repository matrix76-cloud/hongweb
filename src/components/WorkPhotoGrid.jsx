import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { PiXBold, PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

/**
 * 일감 상세의 참고 사진 (형 리뷰 2026-08-12
 * "지도 위에 격자로 1열에 3개까지 · 누르면 확대된 상태에서 다음을 볼 수 있게").
 *
 * 한 줄에 세 칸 정사각 격자. 누르면 전체화면 뷰어가 열리고
 * 좌우 버튼 · 좌우로 밀기(스와이프) · 키보드 화살표로 다음 장을 본다.
 */

/* 위아래 칸(요청 내용·위치)과 제목 서식·간격을 똑같이 맞춘다 (형 지적 2026-08-18) */
const Section = styled.div`
  width: 100%;
  margin: 22px 0 0;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 10px;
`;
/* 한 줄에 세 칸. 사진이 한두 장이면 왼쪽으로 몰리지 않고 가운데에 온다 (형 지시 2026-08-18) */
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;
const Cell = styled.div`
  position: relative;
  flex: 0 0 calc((100% - 16px) / 3);
  max-width: calc((100% - 16px) / 3);
  padding-top: calc((100% - 16px) / 3);
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg);
  cursor: pointer;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:active { opacity: .85; }
`;
/* 네 장 이상이면 세 번째 칸에 남은 장수를 덮어 알려준다 */
const More = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(19,19,19,.5);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const fadein = keyframes`from{opacity:0}to{opacity:1}`;
const Viewer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #0D0D0D;
  animation: ${fadein} .18s ease-out;
  display: flex;
  flex-direction: column;
`;
const ViewerTop = styled.div`
  flex: 0 0 auto;
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 15px;
`;
const CloseBtn = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const Stage = styled.div`
  flex: 1 1 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }
`;
const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => ($side === "left" ? "left: 10px;" : "right: 10px;")}
  width: 42px;
  height: 42px;
  border-radius: 100px;
  background: rgba(255,255,255,.16);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:active { background: rgba(255,255,255,.3); }
`;
const Dots = styled.div`
  flex: 0 0 auto;
  padding: 16px 0 calc(20px + var(--safe-bottom));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;
const Dot = styled.span`
  width: ${({ $on }) => ($on ? "18px" : "6px")};
  height: 6px;
  border-radius: 100px;
  background: ${({ $on }) => ($on ? "var(--surface)" : "rgba(255,255,255,.38)")};
  transition: width .18s ease;
`;

const WorkPhotoGrid = ({ photos, title = "참고 사진" }) => {
  const list = (photos || []).filter(Boolean);
  const [at, setAt] = useState(-1);          // -1 이면 뷰어가 닫힌 상태
  const open = at >= 0;

  const go = (d) => setAt((i) => (i + d + list.length) % list.length);

  /* 뷰어가 열려 있는 동안 뒤 화면이 같이 스크롤되지 않게 */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setAt(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, list.length]);

  /* 손가락으로 좌우로 미는 것도 받는다 */
  const touch = React.useRef(null);
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  if (!list.length) return null;

  // 첫 줄 세 칸만 보여주고, 넘치면 세 번째 칸에 남은 장수를 겹쳐 알린다
  const shown = list.slice(0, 3);
  const rest = list.length - shown.length;

  return (
    <Section>
      <Title>{title}</Title>
      <Grid>
        {shown.map((url, i) => (
          <Cell key={url + i} onClick={() => setAt(i)}>
            <img src={url} alt={`참고 사진 ${i + 1}`} />
            {i === 2 && rest > 0 && <More>+{rest}</More>}
          </Cell>
        ))}
      </Grid>

      {open && (
        <Viewer onClick={(e) => { if (e.target === e.currentTarget) setAt(-1); }}>
          <ViewerTop>
            <span>{at + 1} / {list.length}</span>
            <CloseBtn onClick={() => setAt(-1)}><PiXBold size={22} /></CloseBtn>
          </ViewerTop>
          <Stage onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <img src={list[at]} alt={`참고 사진 ${at + 1}`} />
            {list.length > 1 && (
              <>
                <Arrow $side="left" onClick={() => go(-1)}><PiCaretLeftBold size={20} /></Arrow>
                <Arrow $side="right" onClick={() => go(1)}><PiCaretRightBold size={20} /></Arrow>
              </>
            )}
          </Stage>
          <Dots>
            {list.map((u, i) => <Dot key={u + i} $on={i === at} />)}
          </Dots>
        </Viewer>
      )}
    </Section>
  );
};

export default WorkPhotoGrid;
