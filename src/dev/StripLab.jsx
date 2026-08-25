// 홈 맨 위 "소개로 가는 전폭 배너" 시안 (형 지시 2026-08-23 "그 위에 100% 자리 배너를 하나 만들자, 누르면 소개 페이지로")
//
// 0번이 지금 들어가 있는 얇은 한 줄이고, 1~6번이 전폭 배너 안이다.
// 폭 390px 실측. 헤더(위치·검색) 바로 아래 자리라 헤더 흉내를 같이 그려서 붙어 있는 느낌을 본다.
// 번호로 골라주시면 그대로 홈에 넣는다. 섞어도 된다("3번 그림에 1번 색").
import React from "react";
import styled from "styled-components";
import { RiArrowRightSLine } from "react-icons/ri";
import { IoSearchOutline, IoMegaphoneOutline } from "react-icons/io5";
import { PiMapPinBold } from "react-icons/pi";
import { HelperSvg, CleanerSvg, GrandmaSvg } from "../components/BannerFigures";
import HongAvatar from "../components/HongAvatar";

const INK = "#1b1f27";
const ORANGE = "#FF4E19";
const TEXT = "#131313";
const FONT = "'Pretendard Variable', Pretendard, -apple-system, 'Malgun Gothic', sans-serif";

const Page = styled.div`
  padding: 28px 24px 90px;
  background: #fff;
  color: ${INK};
  font-family: ${FONT};
`;
const H1 = styled.h1` margin: 0 0 6px; font-size: 23px; font-weight: 800; `;
const Lead = styled.p` margin: 0 0 28px; font-size: 15px; line-height: 1.65; color: #2b2f36; `;
const Cases = styled.div` display: flex; flex-wrap: wrap; gap: 26px; align-items: flex-start; `;
const Case = styled.section` width: 390px; `;
const CaseHead = styled.div` display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; `;
const CaseNo = styled.span` font-size: 17px; font-weight: 800; `;
const CaseName = styled.span` font-size: 15px; font-weight: 700; `;
const CaseNote = styled.div` font-size: 13px; line-height: 1.55; color: #2b2f36; margin-bottom: 10px; min-height: 42px; `;
const Stage = styled.div`
  width: 390px; box-sizing: border-box; border: 1px solid #e6e6e6; overflow: hidden; background: #fff; color: ${TEXT};
`;

/* 헤더 흉내 — 실제 홈 헤더와 같은 높이·구성 */
const FakeHead = styled.div`
  height: 50px; display: flex; align-items: center; gap: 8px; padding: 0 14px;
  font-size: 17px; font-weight: 700;
  .sp { flex: 1; }
`;
/* 아래 이어지는 그림 배너 윗부분 — 배너가 어디까지인지 보이게 살짝만 */
const Below = styled.div`
  height: 70px; background: linear-gradient(180deg, #FFF6F1 0%, #FFE9DD 100%);
`;

const Head = () => (
  <FakeHead>
    <HongAvatar size={30} />
    <PiMapPinBold size={18} /> 남양주시 다산동 <RiArrowRightSLine size={18} />
    <span className="sp" />
    <IoSearchOutline size={22} /> <IoMegaphoneOutline size={22} />
  </FakeHead>
);

/* 0. 현재 — 얇은 한 줄 */
const Strip0 = styled.div`
  height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px;
  border-bottom: 1px solid #EFEFEF; font-size: 15px; font-weight: 600;
  span:last-child { display: flex; align-items: center; font-size: 14px; font-weight: 700; }
`;

/* 1. 먹색 띠 */
const Strip1 = styled.div`
  > div:not(.fig) { flex: 1; min-width: 0; }
  height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px;
  background: ${INK}; color: #fff;
  b { display: block; font-size: 16px; font-weight: 700; }
  small { display: block; font-size: 13px; opacity: .8; margin-top: 2px; }
  .go { flex: none; display: flex; align-items: center; font-size: 14px; font-weight: 700; }
`;

/* 2. 연한 면 + 테두리 */
const Strip2 = styled.div`
  > div:not(.fig) { flex: 1; min-width: 0; }
  margin: 10px 15px 12px; padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: #F1F4F8; border: 1px solid #DADADA;
  b { display: block; font-size: 17px; font-weight: 800; }
  small { display: block; font-size: 14px; color: #2b2f36; margin-top: 4px; line-height: 1.45; }
  .go { flex: none; display: flex; align-items: center; font-size: 14px; font-weight: 700; }
`;

/* 3. 그림 있는 브랜드톤 배너 */
const Strip3 = styled.div`
  > div:not(.fig) { flex: 1; min-width: 0; }
  position: relative; height: 96px; padding: 0 18px; display: flex; align-items: center; gap: 14px;
  background: #FFF1EA; border-bottom: 1px solid #F3DED2;
  .fig { flex: none; display: flex; align-items: flex-end; gap: 4px; }
  b { display: block; font-size: 17px; font-weight: 800; line-height: 1.3; }
  small { display: block; font-size: 14px; color: #2b2f36; margin-top: 4px; }
  .go { position: absolute; right: 16px; bottom: 12px; display: flex; align-items: center; font-size: 14px; font-weight: 700; }
`;

/* 4. 먹색 큰 배너 — 제목 + 설명 + 버튼 */
const Strip4 = styled.div`
  padding: 20px 18px 18px; background: ${INK}; color: #fff;
  b { display: block; font-size: 20px; font-weight: 800; line-height: 1.3; }
  small { display: block; font-size: 14px; opacity: .85; margin-top: 6px; line-height: 1.5; }
  .cta { display: inline-flex; align-items: center; margin-top: 14px; height: 36px; padding: 0 14px; background: #fff; color: ${INK}; font-size: 14px; font-weight: 700; }
`;

/* 5. 흰 카드 + 먹색 작은 버튼 */
const Strip5 = styled.div`
  > div:not(.fig) { flex: 1; min-width: 0; }
  margin: 10px 15px 12px; padding: 16px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: #fff; border: 1px solid #DADADA;
  b { display: block; font-size: 16px; font-weight: 800; }
  small { display: block; font-size: 14px; color: #2b2f36; margin-top: 4px; line-height: 1.45; }
  .cta { flex: none; height: 38px; padding: 0 14px; display: flex; align-items: center; background: ${INK}; color: #fff; font-size: 14px; font-weight: 700; }
`;

/* 6. 브랜드 주황 면 — 지금 홈 색을 유지하고 싶을 때 */
const Strip6 = styled.div`
  > div:not(.fig) { flex: 1; min-width: 0; }
  height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; gap: 12px;
  background: ${ORANGE}; color: #fff;
  .fig { flex: none; }
  b { display: block; font-size: 16px; font-weight: 800; }
  small { display: block; font-size: 13px; opacity: .9; margin-top: 2px; }
  .go { flex: none; display: flex; align-items: center; font-size: 14px; font-weight: 700; }
`;

const CASES = [
  { no: 0, name: "현재 — 얇은 한 줄", note: "지금 들어가 있는 것. 선 하나로만 구분돼서 배너로 안 읽힘.",
    C: () => <Strip0><span>같은 동네 여성 홍여사가 직접 와요</span><span>소개 보기<RiArrowRightSLine size={18} /></span></Strip0> },
  { no: 1, name: "먹색 띠 64px", note: "헤더 바로 아래 먹색 띠. 두 줄 문구 + 소개 보기. 한 가지 색이라 홈이 안 어지러움.",
    C: () => <Strip1><div><b>우리 동네를 잘 아는 여성 홍여사가 와요</b><small>구해줘 홍여사는 어떤 서비스인가요?</small></div><span className="go">소개 보기<RiArrowRightSLine size={18} /></span></Strip1> },
  { no: 2, name: "연한 면 카드", note: "좌우 15px 여백 두고 연한 면 + 1px 테두리. 제목 17px + 설명 한 줄.",
    C: () => <Strip2><div><b>구해줘 홍여사가 뭔가요?</b><small>같은 동네 여성 홍여사에게 집안일·돌봄을 맡기는 곳</small></div><span className="go">소개 보기<RiArrowRightSLine size={18} /></span></Strip2> },
  { no: 3, name: "그림 있는 브랜드톤", note: "아래 그림 배너와 같은 연주황 바탕에 홍여사 그림. 둘이 한 덩어리처럼 이어짐.",
    C: () => <Strip3><div className="fig"><CleanerSvg width={44} /><HelperSvg width={48} /></div><div><b>우리 동네 여성 홍여사가<br />직접 와요</b></div><span className="go">소개 보기<RiArrowRightSLine size={18} /></span></Strip3> },
  { no: 4, name: "먹색 큰 배너 + 버튼", note: "제목 20px + 설명 두 줄 + 흰 버튼. 제일 눈에 띄지만 높이가 130px 정도로 큼.",
    C: () => <Strip4><b>구해줘 홍여사, 처음이세요?</b><small>같은 동네에 사는 여성 홍여사만 활동해요.<br />일을 올리면 근처 홍여사가 지원하고, 마음에 드는 분을 고르면 돼요.</small><span className="cta">소개 보기<RiArrowRightSLine size={18} /></span></Strip4> },
  { no: 5, name: "흰 카드 + 먹색 버튼", note: "흰 바탕 1px 테두리 카드, 오른쪽에 각진 먹색 버튼. 동의 화면 톤과 같은 계열.",
    C: () => <Strip5><div><b>구해줘 홍여사가 뭔가요?</b><small>같은 동네 여성 홍여사가 직접 와요</small></div><span className="cta">소개 보기</span></Strip5> },
  { no: 6, name: "브랜드 주황 띠", note: "지금 홈 주황을 그대로 쓴 띠. 눈에 확 띄지만 '빨간 계열 눈에 띔' 지적과 같은 결.",
    C: () => <Strip6><div className="fig"><GrandmaSvg width={40} /></div><div><b>우리 동네 여성 홍여사가 와요</b><small>구해줘 홍여사는 어떤 서비스인가요?</small></div><span className="go">소개 보기<RiArrowRightSLine size={18} /></span></Strip6> },
];

export default function StripLab() {
  return (
    <Page>
      <H1>홈 상단 소개 배너 시안</H1>
      <Lead>0번이 지금 들어간 얇은 줄, 1~6번이 전폭 배너 안. 폭 390px 실측. 위 헤더와 아래 그림 배너 윗부분은 자리를 보려고 같이 그렸다. 번호로 골라주면 그대로 홈에 넣는다. 섞어도 된다.</Lead>
      <Cases>
        {CASES.map(({ no, name, note, C }) => (
          <Case key={no}>
            <CaseHead><CaseNo>{no}</CaseNo><CaseName>{name}</CaseName></CaseHead>
            <CaseNote>{note}</CaseNote>
            <Stage>
              <Head />
              <C />
              <Below />
            </Stage>
          </Case>
        ))}
      </Cases>
    </Page>
  );
}
