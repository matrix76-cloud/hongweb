import React, { useEffect } from "react";
import styled from 'styled-components';
import { Toaster } from 'sonner';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  background: #f9f9f9;
`;

const MobiileDirectInstallContainer = () => {

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    setTimeout(() => {
      if (/android/i.test(userAgent)) {
        window.location.href = "https://play.google.com/store/apps/details?id=com.hongapp";
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        window.location.href = "https://apps.apple.com/kr/app/id6743770592";
      } else {
        window.location.href = "https://play.google.com/store/apps/details?id=com.hongapp";
      }
    }, 300); // 0.3초 정도 딜레이
  }, []);

  return (
    <>
      <Container>
        <p style={{ fontSize: "18px", color: "#333" }}>잠시만 기다려주세요...</p>
      </Container>
      <Toaster position="bottom-left" richColors />
    </>
  );
};

export default MobiileDirectInstallContainer;
