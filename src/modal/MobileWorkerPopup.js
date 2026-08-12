import ReactDOM from "react-dom";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';

import MobileWorkerDetail from "../components/MobileWorkerDetail";


const Overlay = styled.div`
  position: fixed;
  top: 10%; /* ✅ 화면 위쪽에서부터 시작 */
  left: 0;
  width: 100%;
  background: white;

  box-shadow: 0 -2px 10px rgba(0,0,0,0.15);
  z-index: 9999 !important;

  overflow-y: auto;
  height: calc(100vh - 40px); /* 💡 거의 전체 높이 차지 */
`;

const CloseButton = styled.div`
  text-align: right;
  padding: 10px 16px 0 0;
  font-size: 18px;
  cursor: pointer;
`;





const MobileWorkerPopup = ({ containerStyle, data, onClose, onChat }) => {

  return ReactDOM.createPortal(
    <>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Overlay style={containerStyle}>
        <MobileWorkerDetail data={data} onClose={onClose} onChat={onChat} containerStyle={containerStyle} />
      </Overlay>
    </>,
    document.getElementById("modal-root")
  );
};

export default MobileWorkerPopup;
