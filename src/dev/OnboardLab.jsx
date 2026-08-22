// 온보딩 그림 시안 (형 요청 2026-08-23 "온보딩은 시안을 보여줘, 각각 3장")
// 안마다 ①올리기 ②지원 ③고르기 세 장을 실제 크기(Stage 260×240)로 나란히 둔다.
import React from "react";
import styled from "styled-components";
import { ONBOARD_VARIANTS } from "../components/OnboardStages";

const INK = "#1b1f27";
const Page = styled.div`
  width: 100%; box-sizing: border-box; padding: 20px; background: #f3f3f3; min-height: 100vh; color: ${INK};
`;
const Variant = styled.div`background: #fff; border: 1px solid #e3e3e3; padding: 16px 18px 20px; margin-bottom: 18px;`;
const Title = styled.div`font-size: 17px; font-weight: 800; margin-bottom: 4px;`;
const Desc = styled.div`font-size: 14px; margin-bottom: 16px;`;
const Row = styled.div`display: flex; gap: 18px; flex-wrap: nowrap; overflow-x: auto;`;
const Col = styled.div`
  flex: 0 0 330px; width: 330px; border: 1px solid #ececec; background: #fff; padding: 22px 16px 16px; box-sizing: border-box;
  display: flex; flex-direction: column; align-items: center; gap: 18px;
`;
const StageBox = styled.div`height: 250px; display: flex; align-items: flex-end; justify-content: center;`;
const Copy = styled.div`width: 100%; text-align: left;`;
const Step = styled.div`font-size: 14px; font-weight: 800; color: #FF4E19; margin-bottom: 6px;`;
const Head = styled.div`font-size: 22px; font-weight: 800; line-height: 1.3; white-space: pre-line; b { color: #FF4E19; }`;
const Sub = styled.div`font-size: 15px; line-height: 1.5; margin-top: 8px; white-space: pre-line;`;

const COPY = [
  { step: "STEP 01", head: <>필요한 일을{"\n"}<b>올리세요</b></>, sub: "집 청소부터 병원 동행까지,\n필요한 일을 골라 올리면 됩니다." },
  { step: "STEP 02", head: <>가까운 <b>홍여사들이</b>{"\n"}지원합니다</>, sub: "일을 올려두면 근처에 있는 분들이\n먼저 손을 듭니다." },
  { step: "STEP 03", head: <>마음에 드는 분을{"\n"}<b>고르세요</b></>, sub: "고른 뒤 채팅으로 이야기하고,\n결제까지 앱 안에서 끝납니다." },
];

export default function OnboardLab() {
  const only = new URLSearchParams(window.location.search).get("only");
  const list = only ? ONBOARD_VARIANTS.filter((v) => v.no === `${only}안`) : ONBOARD_VARIANTS;
  return (
    <Page>
      {list.map((v) => (
        <Variant key={v.key}>
          <Title>{v.no}</Title>
          <Desc>{v.desc}</Desc>
          <Row>
            {v.steps.map((S, i) => (
              <Col key={i}>
                <StageBox><S /></StageBox>
                <Copy>
                  {v.copy ? (
                    <>
                      <Step>{v.copy[i].step}</Step>
                      <Head>{v.copy[i].title.map((seg, k) => (k % 2 === 1 ? <b key={k}>{seg}</b> : <React.Fragment key={k}>{seg}</React.Fragment>))}</Head>
                      <Sub>{v.copy[i].sub}</Sub>
                    </>
                  ) : (
                    <>
                      <Step>{COPY[i].step}</Step>
                      <Head>{COPY[i].head}</Head>
                      <Sub>{COPY[i].sub}</Sub>
                    </>
                  )}
                </Copy>
              </Col>
            ))}
          </Row>
        </Variant>
      ))}
    </Page>
  );
}
