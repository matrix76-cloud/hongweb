import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdMyLocation, MdMap, MdChevronRight, MdClose } from "react-icons/md";
import { getCurrentRegion } from "../../utility/geo";

/**
 * 위치 설정 시트 — seekone 의 LocationSheet 방식 (형 리뷰 2026-08-12)
 *
 * 헤더의 위치 영역을 누르면 뜬다. 하는 일은 두 가지뿐이다.
 *   ① 현재 위치로 재검색 — GPS + 카카오 역지오코딩으로 "시 구 동" 을 다시 잡는다
 *   ② 지도로 위치지정   — 기존 /Mobilemapreconfig 화면으로 넘긴다
 *
 * 기존엔 핀 아이콘(GPS 팝업)과 화살표(지도 재설정)가 따로 흩어져 있었다. 하나로 묶는다.
 */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
`;

const Sheet = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: var(--surface);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
`;

const SheetHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SheetTitle = styled.b`
  flex: 1;
  font-size: 17px;
  color: var(--text);
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const RowBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 6px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

const IconBox = styled.span`
  flex: none;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RowTitle = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
`;

const RowDesc = styled.span`
  display: block;
  font-size: 14px;
  color: #71717a;
  margin-top: 2px;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1300;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const MobileLocationSheet = ({ open, onClose, onRelocated }) => {
  const navigation = useNavigate();
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1600);
  };

  // ① 현재 위치 → 시·구·동 역지오코딩. 실패하면 기존 지역을 그대로 둔다.
  const _handleRelocate = () => {
    setLocating(true);
    getCurrentRegion()
      .then(({ label, lat, lng }) => {
        setLocating(false);
        onRelocated?.({ label, lat, lng });
        onClose?.();
        showToast("현재 위치로 다시 잡았어요");
      })
      .catch(() => {
        setLocating(false);
        showToast("현재 위치를 확인할 수 없어요");
      });
  };

  // ② 지도로 위치지정 — 중앙 고정핀 화면 (seekone MapPick 방식)
  const _handleMapPick = () => {
    onClose?.();
    navigation("/Mobilemappick");
  };

  if (!open && !toast) return null;

  return createPortal(
    <>
      {open && (
        <Dim onClick={onClose}>
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetHead>
              <SheetTitle>위치 설정</SheetTitle>
              <CloseBtn onClick={onClose} aria-label="닫기">
                <MdClose size={22} color="#71717a" />
              </CloseBtn>
            </SheetHead>

            <RowBtn onClick={_handleRelocate} disabled={locating}>
              <IconBox>
                <MdMyLocation size={20} color="#FF4E19" />
              </IconBox>
              <span style={{ flex: 1, minWidth: 0 }}>
                <RowTitle>현재 위치로 재검색</RowTitle>
                <RowDesc>{locating ? "현재 위치를 찾는 중..." : "GPS로 내 위치를 다시 잡아요"}</RowDesc>
              </span>
              <MdChevronRight size={20} color="#a3a3a3" style={{ flex: "none" }} />
            </RowBtn>

            <RowBtn onClick={_handleMapPick} style={{ marginTop: 4 }}>
              <IconBox>
                <MdMap size={20} color="#FF4E19" />
              </IconBox>
              <span style={{ flex: 1, minWidth: 0 }}>
                <RowTitle>지도로 위치지정</RowTitle>
                <RowDesc>지도를 움직여 원하는 위치를 직접 선택해요</RowDesc>
              </span>
              <MdChevronRight size={20} color="#a3a3a3" style={{ flex: "none" }} />
            </RowBtn>
          </Sheet>
        </Dim>
      )}
      {toast && <Toast>{toast}</Toast>}
    </>,
    document.body
  );
};

export default MobileLocationSheet;
