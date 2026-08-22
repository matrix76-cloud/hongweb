import React from "react";
import styled from "styled-components";
import { QRCodeSVG } from "qrcode.react";
import { imageDB } from "../utility/imageData";

/**
 * PC 로 첫 주소(/)에 들어왔을 때 보여주는 안내. (형 지시 2026-08-21)
 *
 * 구해줘 홍여사는 휴대폰에서 쓰는 서비스라 PC 화면은 만들지 않는다.
 * PC 에서는 앱을 돌리지 않고 휴대폰으로 넘어가는 길만 알려준다 —
 * 주소를 그대로 보여주고, 폰 카메라로 바로 열 수 있게 코드를 같이 둔다.
 *
 * 리뷰 페이지(/review)와 시안 페이지들은 PC 에서 그대로 열린다. 여기서 막지 않는다.
 */
const Page = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  background: #ffffff;
  color: #1b1f27;
  font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 26px 40px;

  img { width: 34px; height: 34px; }
  span { font-size: 19px; font-weight: 800; letter-spacing: -0.01em; }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Panel = styled.div`
  display: flex;
  align-items: center;
  gap: 56px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 900px;
`;

const Words = styled.div`
  max-width: 460px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.02em;
`;

const Lead = styled.p`
  margin: 18px 0 0;
  font-size: 17px;
  line-height: 1.75;
  color: #1b1f27;
`;

const AddrLabel = styled.div`
  margin-top: 30px;
  font-size: 15px;
  font-weight: 700;
`;

const Addr = styled.div`
  margin-top: 8px;
  padding: 14px 18px;
  border: 1px solid #d9dde3;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  word-break: break-all;
`;

const QrBox = styled.div`
  flex: none;
  padding: 20px;
  border: 1px solid #d9dde3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const QrWord = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const Foot = styled.div`
  padding: 22px 40px 34px;
  font-size: 15px;
  line-height: 1.7;
  border-top: 1px solid #eceff3;
`;

const PcOnlyNotice = () => {
  /* 개발 중에는 localhost, 배포본에서는 실제 주소가 그대로 들어간다 */
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const host = typeof window !== 'undefined' ? window.location.host : '';

  return (
    <Page>
      <Head>
        <img src={imageDB.logo} alt="" />
        <span>구해줘 홍여사</span>
      </Head>

      <Body>
        <Panel>
          <Words>
            <Title>휴대폰에서<br />열어주세요</Title>
            <Lead>
              구해줘 홍여사는 휴대폰에서 쓰는 서비스입니다.
              내 위치 주변의 일감을 보고, 대화하고, 결제까지 휴대폰 안에서 이루어집니다.
            </Lead>

            <AddrLabel>휴대폰 브라우저에 아래 주소를 넣어주세요</AddrLabel>
            <Addr>{host}</Addr>
          </Words>

          <QrBox>
            <QRCodeSVG value={origin} size={188} level="M" bgColor="#ffffff" fgColor="#1b1f27" />
            <QrWord>휴대폰 카메라로 비춰보세요</QrWord>
          </QrBox>
        </Panel>
      </Body>

      <Foot>
        문의 · 주식회사 홍컴즈
      </Foot>
    </Page>
  );
};

export default PcOnlyNotice;
