// 📄 ModalWrapper.jsx (styled-components ver.)
// - h3/button → div(접근성 role/aria 유지)
// - ESC/오버레이 닫기 지원, 로딩 중 닫기 방지
// - body 스크롤 락, 닫기 버튼 포커스

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import HongButton from "../components/HongButton";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalBox = styled.div`
  width: min(640px, 92vw);
  max-height: 85dvh;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px 16px;
  border-bottom: 1px solid #eee;
`;

const ModalTitleDiv = styled.div.attrs({
  role: "heading",
  "aria-level": 3,
})`
  font-size: ${() => getFontSize(18)}px !important;
  line-height: 1.4;
  font-family:Pretendard-SemiBold;
  margin: 0;
`;

const ModalCloseDiv = styled.div.attrs({
  role: "button",
  tabIndex: 0,
  "aria-label": "닫기",
})`
  font-size: ${() => getFontSize(22)}px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  padding: 2px 6px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: 2px solid rgba(124, 58, 237, 0.35);
    outline-offset: 2px;
  }

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
`;

const ModalContent = styled.div`
  padding: 16px;
  overflow: auto;
  font-size: ${() => getFontSize(15)}px;
`;

const ModalActions = styled.div`
  padding: 12px 16px 16px 16px;
  border-top: 1px solid #eee;
`;

const ModalWrapper = ({
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "확인",
  closeOnOverlay = true,            // 오버레이 클릭으로 닫기
  closeOnEsc = true,                // ESC로 닫기
  disableCloseWhenLoading = true,   // 로딩 중 닫힘 방지
}) => {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);

  // Body 스크롤 락 + 닫기 버튼 포커스
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 포커스
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev || "";
      mountedRef.current = false;
    };
  }, []);

  // ESC 닫기
  useEffect(() => {
    if (!closeOnEsc) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (loading && disableCloseWhenLoading) return;
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOnEsc, loading, disableCloseWhenLoading, onClose]);

  // 오버레이 클릭 닫기
  const handleOverlayClick = (e) => {
    if (!closeOnOverlay) return;
    if (loading && disableCloseWhenLoading) return;
    if (e.target === overlayRef.current) onClose?.();
  };

  // 제출 (Promise 안전 처리)
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await Promise.resolve(onSubmit?.());
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const titleId = "modal-title-" + Math.random().toString(36).slice(2, 8);

  return (
    <ModalOverlay
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <ModalBox>
        <ModalHeader>
          <ModalTitleDiv id={titleId}>{title}</ModalTitleDiv>

          <ModalCloseDiv
            ref={closeBtnRef}
            $disabled={loading && disableCloseWhenLoading}
            onClick={() => {
              if (loading && disableCloseWhenLoading) return;
              onClose?.();
            }}
            onKeyDown={(e) => {
              if (loading && disableCloseWhenLoading) return;
              if (e.key === "Enter" || e.key === " ") onClose?.();
            }}
          >
            ×
          </ModalCloseDiv>
        </ModalHeader>

        <ModalContent>{children}</ModalContent>

        <ModalActions>
          <HongButton variant="primary" disabled={loading} fullWidth onClick={handleSubmit}>
            {loading ? "처리 중..." : submitLabel}
          </HongButton>
        </ModalActions>
      </ModalBox>
    </ModalOverlay>
  );
};

export default ModalWrapper;
