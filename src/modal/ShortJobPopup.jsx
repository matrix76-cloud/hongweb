import ReactDOM from "react-dom";
import React from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 9998;
`;

const Sheet = styled.div`
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default function ShortJobPopup({ open, onClose, children, onBackdropClose = true }) {
    if (!open) return null;

    const root = document.getElementById("modal-root");
    if (!root) return null;

    return ReactDOM.createPortal(
        <>
            <Backdrop onClick={onBackdropClose ? onClose : undefined} />
            <Sheet role="dialog" aria-modal="true">
                {children}
            </Sheet>
        </>,
        root
    );
}
