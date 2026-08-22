// 온보딩 3단계 그림 — 안(variant)별로 세 장(①올리기 ②지원 ③고르기)을 한 묶음으로 둔다. (2026-08-23)
// /onboardlab 에서 안끼리 비교하고, MobileOnboardingcontainer 는 고른 안 하나만 쓴다.
import React from "react";
import styled from "styled-components";
import { imageDB } from "../utility/imageData";
import illustGroup from "../assets/imageset/honggroup.png";
import { GrandmaSvg, HelperSvg, PuppySvg, HospitalSvg, CleanerSvg, KidSvg } from "./BannerFigures";

const ORANGE = "#FF4E19";

/* ── 공용 ── */
export const Stage = styled.div`
  position: relative;
  width: 260px;
  height: 240px;
  overflow: visible;
`;
const Bubble = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? ORANGE : "#F4F4F5")};
  color: ${({ $on }) => ($on ? "#fff" : "#71717a")};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`;
const Fig = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  bottom: ${({ $b }) => $b}px;
  line-height: 0;
`;
const PickMark = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: 30px; height: 30px; border-radius: 50%;
  background: ${ORANGE}; color: #fff; font-size: 16px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid #fff;
`;
const PickBox = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  bottom: ${({ $b }) => $b}px;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  border: 3px solid ${ORANGE};
  border-radius: 10px;
  box-sizing: border-box;
`;
const JobCard = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: ${({ $w }) => $w || 176}px;
  box-sizing: border-box;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0,0,0,.07);
  text-align: left;
`;
const JobTitle = styled.div`font-size: 15px; font-weight: 800; color: var(--text); line-height: 1.3;`;
const JobMeta = styled.div`font-size: 13px; color: var(--text); opacity: .8; margin-top: 3px; line-height: 1.35;`;
const JobPrice = styled.div`
  font-size: 15px; font-weight: 800; color: ${ORANGE}; margin-top: 4px;
  span { font-size: 13px; font-weight: 500; color: var(--text); opacity: .8; margin-left: 4px; }
`;
const SampleJob = ({ x, y, w }) => (
  <JobCard $x={x} $y={y} $w={w}>
    <JobTitle>집 청소</JobTitle>
    <JobMeta>다산동 · 2시간 · 오늘 오후</JobMeta>
    <JobPrice>30,000원<span>협의 가능</span></JobPrice>
  </JobCard>
);

/* ══ 0안 — 지금 배포된 것: 온보딩 그림 + 로고 심볼 ══ */
const Symbol = styled.img`
  position: absolute;
  width: ${({ $size }) => $size}px; height: ${({ $size }) => $size}px;
  left: ${({ $x }) => $x}px; top: ${({ $y }) => $y}px;
  border-radius: 50%; background: #FFF3EE; padding: 6px; box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`;
const PickRing = styled.div`
  position: absolute; left: ${({ $x }) => $x}px; top: ${({ $y }) => $y}px;
  width: ${({ $size }) => $size}px; height: ${({ $size }) => $size}px;
  border-radius: 50%; border: 3px solid ${ORANGE}; box-sizing: border-box;
`;
const GroupImg = styled.img`
  position: absolute; left: 0; top: 0; width: 260px; height: 240px; object-fit: contain;
`;
const L1 = () => <Stage><GroupImg src={illustGroup} alt="" /></Stage>;
const L2 = () => (
  <Stage>
    <Symbol src={imageDB.logo} $size={72} $x={14} $y={92} />
    <Symbol src={imageDB.logo} $size={88} $x={92} $y={64} />
    <Symbol src={imageDB.logo} $size={72} $x={186} $y={92} />
    <Bubble $x={0} $y={44} $on>지원할게요</Bubble>
    <Bubble $x={150} $y={26}>저도요</Bubble>
  </Stage>
);
const L3 = () => (
  <Stage>
    <Symbol src={imageDB.logo} $size={64} $x={12} $y={112} style={{ opacity: .35 }} />
    <Symbol src={imageDB.logo} $size={104} $x={80} $y={72} />
    <PickRing $size={116} $x={74} $y={66} />
    <PickMark $x={158} $y={140}>✓</PickMark>
    <Symbol src={imageDB.logo} $size={64} $x={186} $y={112} style={{ opacity: .35 }} />
    <Bubble $x={64} $y={24} $on>이분으로 할게요</Bubble>
  </Stage>
);

/* ══ 1안 — 일감 카드 + 홍여사들 (카드가 위, 사람이 아래) ══ */
const C1 = () => (
  <Stage>
    <SampleJob x={62} y={6} w={190} />
    <Fig $x={24} $b={0}><GrandmaSvg width={96} /></Fig>
    <Bubble $x={126} $y={104} $on>이 일 좀 부탁해요</Bubble>
    <Fig $x={150} $b={2}><PuppySvg width={54} /></Fig>
  </Stage>
);
const C2 = () => (
  <Stage>
    <SampleJob x={42} y={0} w={176} />
    <Bubble $x={0} $y={86} $on>지원할게요</Bubble>
    <Bubble $x={180} $y={96}>저도요</Bubble>
    <Fig $x={0} $b={0}><HelperSvg width={82} /></Fig>
    <Fig $x={89} $b={0}><HelperSvg width={82} hair="#2B1A10" apron="#F0752B" /></Fig>
    <Fig $x={178} $b={0}><HelperSvg width={82} hair="#6B3A1A" apron="#3F7F5F" /></Fig>
  </Stage>
);
const C3 = () => (
  <Stage>
    <SampleJob x={42} y={0} w={176} />
    <Bubble $x={62} $y={86} $on>이분으로 할게요</Bubble>
    <Fig $x={0} $b={0}><HelperSvg width={82} raise={false} dim /></Fig>
    <PickBox $x={82} $b={-6} $w={96} $h={130} />
    <Fig $x={89} $b={0}><HelperSvg width={82} hair="#2B1A10" apron="#F0752B" raise={false} /></Fig>
    <PickMark $x={160} $y={110}>✓</PickMark>
    <Fig $x={178} $b={0}><HelperSvg width={82} hair="#6B3A1A" apron="#3F7F5F" raise={false} dim /></Fig>
  </Stage>
);

/* ══ 2안 — 홈 배너와 같은 거리 장면 (복숭아 배경 + 길) ══ */
const Street = styled(Stage)`
  width: 300px;
  background: linear-gradient(180deg, #FFF6F1 0%, #FFE9DD 100%);
  border-radius: 12px;
  overflow: hidden;
`;
const Road = styled.div`
  position: absolute; left: 0; right: 0; bottom: 0; height: 40px; background: #FFD9C4;
`;
const S1 = () => (
  <Street>
    <Road />
    <Fig $x={8} $b={38}><HospitalSvg width={70} /></Fig>
    <SampleJob x={104} y={8} w={176} />
    <Bubble $x={204} $y={104} $on>부탁해요</Bubble>
    <Fig $x={104} $b={34}><GrandmaSvg width={78} /></Fig>
    <Fig $x={196} $b={38}><PuppySvg width={46} /></Fig>
  </Street>
);
const S2 = () => (
  <Street>
    <Road />
    <SampleJob x={62} y={4} w={176} />
    <Bubble $x={6} $y={88} $on>지원할게요</Bubble>
    <Bubble $x={224} $y={96}>저도요</Bubble>
    <Fig $x={26} $b={30}><HelperSvg width={64} /></Fig>
    <Fig $x={118} $b={30}><HelperSvg width={64} hair="#2B1A10" apron="#F0752B" /></Fig>
    <Fig $x={210} $b={30}><HelperSvg width={64} hair="#6B3A1A" apron="#3F7F5F" /></Fig>
  </Street>
);
const S3 = () => (
  <Street>
    <Road />
    <SampleJob x={62} y={4} w={176} />
    <Bubble $x={60} $y={88} $on>이분으로 할게요</Bubble>
    <Fig $x={26} $b={30}><HelperSvg width={64} raise={false} dim /></Fig>
    <PickBox $x={110} $b={24} $w={80} $h={106} />
    <Fig $x={118} $b={30}><HelperSvg width={64} hair="#2B1A10" apron="#F0752B" raise={false} /></Fig>
    <PickMark $x={176} $y={100}>✓</PickMark>
    <Fig $x={210} $b={30}><HelperSvg width={64} hair="#6B3A1A" apron="#3F7F5F" raise={false} dim /></Fig>
  </Street>
);

/* ══ 3안 — 앱 화면 미니어처 (그림 없이 실제 UI 모양으로) ══ */
const Phone = styled.div`
  position: absolute; left: 20px; top: 0; width: 220px; height: 240px;
  background: #fff; border: 1px solid #e3e3e3; border-radius: 14px; box-sizing: border-box;
  padding: 12px 12px; overflow: hidden; text-align: left;
  box-shadow: 0 6px 18px rgba(0,0,0,.07);
`;
const PTitle = styled.div`font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 8px;`;
const Chips = styled.div`display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;`;
const Chip = styled.div`
  padding: 6px 10px; border: 1px solid ${({ $on }) => ($on ? ORANGE : "#e3e3e3")};
  background: ${({ $on }) => ($on ? ORANGE : "#fff")}; color: ${({ $on }) => ($on ? "#fff" : "var(--text)")};
  border-radius: 8px; font-size: 13px; font-weight: 600;
`;
const Field = styled.div`
  border: 1px solid #e3e3e3; border-radius: 8px; padding: 8px 10px; font-size: 13px; color: var(--text);
  margin-bottom: 6px; span { color: ${ORANGE}; font-weight: 800; }
`;
const PBtn = styled.div`
  background: ${ORANGE}; color: #fff; border-radius: 8px; text-align: center; padding: 9px 0;
  font-size: 14px; font-weight: 700;
`;
const Row = styled.div`
  display: flex; align-items: center; gap: 10px; padding: 8px 8px; border-radius: 8px;
  border: ${({ $pick }) => ($pick ? `2px solid ${ORANGE}` : "1px solid #eee")};
  margin-bottom: 6px; opacity: ${({ $dim }) => ($dim ? .45 : 1)};
`;
const Avatar = styled.div`
  width: 30px; height: 30px; border-radius: 50%; background: ${({ $c }) => $c}; flex: 0 0 30px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
`;
const RName = styled.div`font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.25; flex: 1;
  small { display: block; font-size: 12px; font-weight: 500; opacity: .75; }`;
const RTag = styled.div`font-size: 12px; font-weight: 700; color: ${ORANGE};`;
const U1 = () => (
  <Stage>
    <Phone>
      <PTitle>어떤 일을 올릴까요?</PTitle>
      <Chips><Chip $on>집 청소</Chip><Chip>병원가기</Chip><Chip>아이돌봄</Chip><Chip>장봐주기</Chip></Chips>
      <Field>오늘 오후 · 2시간</Field>
      <Field><span>30,000원</span> 협의 가능</Field>
      <PBtn>올리기</PBtn>
    </Phone>
  </Stage>
);
const people = [
  ["#2E4FA8", "김영희 홍여사", "다산동 · 1.2km"],
  ["#F0752B", "박순자 홍여사", "도농동 · 0.8km"],
  ["#3F7F5F", "이미경 홍여사", "지금동 · 2.1km"],
];
const U2 = () => (
  <Stage>
    <Phone>
      <PTitle>3명이 지원했어요</PTitle>
      {people.map(([c, n, m]) => (
        <Row key={n}><Avatar $c={c}><HelperSvg width={26} raise={false} apron={c} /></Avatar><RName>{n}<small>{m}</small></RName><RTag>지원</RTag></Row>
      ))}
    </Phone>
  </Stage>
);
const U3 = () => (
  <Stage>
    <Phone>
      <PTitle>마음에 드는 분을 고르세요</PTitle>
      {people.map(([c, n, m], i) => (
        <Row key={n} $pick={i === 1} $dim={i !== 1}><Avatar $c={c}><HelperSvg width={26} raise={false} apron={c} /></Avatar><RName>{n}<small>{m}</small></RName><RTag>{i === 1 ? "선택" : "지원"}</RTag></Row>
      ))}
    </Phone>
  </Stage>
);

/* ══ 4안 — 큰 인물 한둘 중심 (말풍선으로 이야기) ══ */
const D1 = () => (
  <Stage>
    <Fig $x={0} $b={0}><GrandmaSvg width={124} /></Fig>
    <SampleJob x={104} y={0} w={166} />
    <Bubble $x={132} $y={112} $on>부탁해요</Bubble>
    <Fig $x={200} $b={0}><PuppySvg width={58} /></Fig>
  </Stage>
);
const D2 = () => (
  <Stage>
    <Fig $x={60} $b={0}><HelperSvg width={146} hair="#2B1A10" apron="#F0752B" /></Fig>
    <Bubble $x={0} $y={34} $on>제가 할게요</Bubble>
    <Bubble $x={196} $y={126}>저도요</Bubble>
    <Bubble $x={0} $y={150}>저도 가능해요</Bubble>
  </Stage>
);
const D3 = () => (
  <Stage>
    <Fig $x={8} $b={0}><GrandmaSvg width={120} /></Fig>
    <Fig $x={130} $b={0}><HelperSvg width={120} hair="#2B1A10" apron="#F0752B" raise={false} /></Fig>
    <Bubble $x={50} $y={14} $on>이분으로 할게요</Bubble>
    <PickMark $x={214} $y={34}>✓</PickMark>
  </Stage>
);


/* ══ 5·6안 — 흐름(올리기→지원→고르기)은 홈 배너가 이미 설명하니, 온보딩은 "이 앱의 특징"을 보여준다
   (형 지시 2026-08-23: 3단계 '고르기' 화면이 실제로 있는 줄 오해할 수 있다. 채팅으로 정하기·실시간 알림 같은 특징으로) ══ */
const Card = styled.div`
  position: absolute; left: ${({ $x }) => $x || 0}px; top: ${({ $y }) => $y || 0}px;
  width: ${({ $w }) => $w || 244}px; box-sizing: border-box; text-align: left;
  background: #fff; border: 1px solid #e3e3e3; border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,.07); overflow: hidden;
`;
const CardHead = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #f0f0f0;
  font-size: 14px; font-weight: 800; color: var(--text);
  small { font-weight: 500; opacity: .7; margin-left: auto; font-size: 12px; }
`;
const ChatBody = styled.div`padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 7px;`;
const Msg = styled.div`
  max-width: 82%; padding: 8px 11px; font-size: 13px; line-height: 1.4; color: var(--text);
  border-radius: 12px; align-self: ${({ $me }) => ($me ? "flex-end" : "flex-start")};
  background: ${({ $me }) => ($me ? ORANGE : "#F4F4F5")}; color: ${({ $me }) => ($me ? "#fff" : "var(--text)")};
`;
const Agree = styled.div`
  margin-top: 2px; padding: 8px 10px; border: 1px solid ${ORANGE}; border-radius: 8px; font-size: 13px; font-weight: 700;
  color: ${ORANGE}; text-align: center;
`;
/* ① 채팅으로 먼저 정한다 */
const F1 = () => (
  <Stage>
    <Card $x={8} $y={10}>
      <CardHead><Avatar $c="#F0752B"><HelperSvg width={26} raise={false} apron="#F0752B" /></Avatar>박순자 홍여사<small>다산동 · 0.8km</small></CardHead>
      <ChatBody>
        <Msg $me>내일 오전 10시 괜찮으세요?</Msg>
        <Msg>네 좋아요. 2시간이면 3만원으로 할게요</Msg>
        <Msg $me>좋아요, 그렇게 해요</Msg>
        <Agree>내일 10시 · 30,000원 확정</Agree>
      </ChatBody>
    </Card>
  </Stage>
);
/* ② 알림이 바로 온다 — 푸시 배너가 차곡차곡 */
const Noti = styled.div`
  position: absolute; left: ${({ $x }) => $x}px; top: ${({ $y }) => $y}px; width: 236px;
  display: flex; align-items: flex-start; gap: 10px; padding: 11px 12px; box-sizing: border-box;
  background: #fff; border: 1px solid #e3e3e3; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.10);
  opacity: ${({ $dim }) => $dim || 1}; transform: scale(${({ $sc }) => $sc || 1}); transform-origin: top center;
  text-align: left;
`;
const NotiMark = styled.img`width: 30px; height: 30px; border-radius: 8px; flex: 0 0 30px;`;
const NotiText = styled.div`
  flex: 1; min-width: 0;
  b { display: block; font-size: 13px; font-weight: 800; color: var(--text); line-height: 1.3; }
  span { display: block; font-size: 12px; color: var(--text); opacity: .85; line-height: 1.35; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;
const NotiTime = styled.div`font-size: 11px; color: var(--text); opacity: .6; flex: 0 0 auto;`;
const F2 = () => (
  <Stage>
    <Noti $x={12} $y={8} $dim={.45} $sc={.92}><NotiMark src={imageDB.logo} alt="" /><NotiText><b>새 일감이 올라왔어요</b><span>다산동 집 청소 · 30,000원</span></NotiText><NotiTime>10분 전</NotiTime></Noti>
    <Noti $x={12} $y={72} $dim={.75} $sc={.96}><NotiMark src={imageDB.logo} alt="" /><NotiText><b>박순자 홍여사가 지원했어요</b><span>0.8km · 후기 32개</span></NotiText><NotiTime>3분 전</NotiTime></Noti>
    <Noti $x={12} $y={140}><NotiMark src={imageDB.logo} alt="" /><NotiText><b>채팅이 도착했어요</b><span>내일 오전 10시 괜찮으세요?</span></NotiText><NotiTime>방금</NotiTime></Noti>
  </Stage>
);
/* ③-A 내 주변 — 반경 안의 홍여사만 */
const MapCard = styled(Card)`
  height: 220px; background: #F1F4F8;
  background-image: linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px);
  background-size: 28px 28px;
`;
const Radius = styled.div`
  position: absolute; left: 42px; top: 28px; width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,78,25,.10); border: 2px dashed ${ORANGE};
`;
const Pin = styled.div`
  position: absolute; left: ${({ $x }) => $x}px; top: ${({ $y }) => $y}px; width: 30px; height: 30px; border-radius: 50%;
  background: ${({ $c }) => $c}; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.18);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
`;
const Me = styled.div`
  position: absolute; left: 112px; top: 98px; width: 18px; height: 18px; border-radius: 50%;
  background: ${ORANGE}; border: 3px solid #fff; box-shadow: 0 0 0 3px rgba(255,78,25,.25);
`;
const MapLabel = styled.div`
  position: absolute; left: 10px; bottom: 10px; padding: 7px 10px; background: #fff; border: 1px solid #e3e3e3;
  border-radius: 8px; font-size: 13px; font-weight: 700; color: var(--text);
  b { color: ${ORANGE}; }
`;
const F3 = () => (
  <Stage>
    <MapCard $x={8} $y={10}>
      <Radius />
      <Me />
      <Pin $x={70} $y={52} $c="#2E4FA8"><HelperSvg width={22} raise={false} apron="#2E4FA8" /></Pin>
      <Pin $x={150} $y={70} $c="#F0752B"><HelperSvg width={22} raise={false} apron="#F0752B" /></Pin>
      <Pin $x={92} $y={138} $c="#3F7F5F"><HelperSvg width={22} raise={false} apron="#3F7F5F" /></Pin>
      <Pin $x={160} $y={128} $c="#B07A3B"><HelperSvg width={22} raise={false} apron="#B07A3B" /></Pin>
      <MapLabel>내 주변 3km · 홍여사 <b>1,110명</b></MapLabel>
    </MapCard>
  </Stage>
);
/* ③-B 안심 — 인증·후기·신고 */
const Prof = styled(Card)`padding: 14px 14px 12px;`;
const ProfTop = styled.div`display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  b { font-size: 15px; font-weight: 800; color: var(--text); display: block; }
  small { font-size: 12px; color: var(--text); opacity: .7; }`;
const Line = styled.div`
  display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-top: 1px solid #f0f0f0;
  font-size: 13px; color: var(--text); span { font-weight: 800; color: ${({ $warn }) => ($warn ? "#E5392B" : ORANGE)}; }
`;
const F3B = () => (
  <Stage>
    <Prof $x={8} $y={10}>
      <ProfTop><Avatar $c="#F0752B" style={{ width: 40, height: 40, flex: "0 0 40px" }}><HelperSvg width={34} raise={false} apron="#F0752B" /></Avatar><div><b>박순자 홍여사</b><small>다산동 · 활동 2년</small></div></ProfTop>
      <Line>본인 인증<span>완료</span></Line>
      <Line>받은 후기<span>32개 · 4.9점</span></Line>
      <Line>거래 완료<span>118건</span></Line>
      <Line $warn>선입금 요구 시<span>바로 신고</span></Line>
    </Prof>
  </Stage>
);

/* ③-C 동네 — 컨셉(형 2026-08-23): 동네 일감은 동네를 잘 아는 사람이, 일은 여성 홍여사만 */
const TagRow = styled.div`
  position: absolute; left: 10px; top: 10px; display: flex; gap: 6px;
`;
const Tag = styled.div`
  padding: 5px 9px; background: #fff; border: 1px solid #e3e3e3; border-radius: 8px;
  font-size: 12px; font-weight: 800; color: ${ORANGE};
`;
const F4 = () => (
  <Stage>
    <MapCard $x={8} $y={10}>
      <Radius />
      <Me />
      <Pin $x={70} $y={52} $c="#2E4FA8"><HelperSvg width={22} raise={false} apron="#2E4FA8" /></Pin>
      <Pin $x={150} $y={70} $c="#F0752B"><HelperSvg width={22} raise={false} apron="#F0752B" /></Pin>
      <Pin $x={92} $y={138} $c="#3F7F5F"><HelperSvg width={22} raise={false} apron="#3F7F5F" /></Pin>
      <Pin $x={160} $y={128} $c="#B07A3B"><HelperSvg width={22} raise={false} apron="#B07A3B" /></Pin>
      <TagRow><Tag>여성만</Tag><Tag>같은 동네</Tag><Tag>본인 인증</Tag></TagRow>
      <MapLabel>다산동 홍여사 <b>1,110명</b></MapLabel>
    </MapCard>
  </Stage>
);
const TOWN_COPY = { step: "동네", title: ["우리 동네를 잘 아는\n", "아줌마가 와요"], sub: "같은 동네에 사는 여성 홍여사만 활동해요.\n본인 인증을 거친 분들이라 믿고 맡길 수 있어요." };

const FEATURE_COPY = (third) => [
  { step: "채팅", title: ["만나기 전에\n", "채팅으로 정해요"], sub: "시간도 금액도 대화방에서 맞춘 뒤에 만나요.\n정한 내용은 그대로 남아요." },
  { step: "알림", title: ["지원·채팅·새 일감을\n", "바로 알려드려요"], sub: "앱을 닫아도 알림이 와요.\n알림음도 내 취향으로 고를 수 있어요." },
  third === "map"
    ? { step: "내 주변", title: ["가까이 사는 분이\n", "직접 와요"], sub: "동네 반경을 정해두면 그 안의\n일감과 홍여사만 보여요." }
    : { step: "안심", title: ["인증된 분과\n", "안심하고 거래해요"], sub: "본인 인증과 후기를 보고 고르고,\n선입금을 요구하면 바로 신고할 수 있어요." },
];

export const ONBOARD_VARIANTS = [
  { key: "legacy", no: "0안", desc: "지금 배포된 것 — 온보딩 그림 + 로고 심볼(형: 얼굴이 없어 무섭다)", steps: [L1, L2, L3] },
  { key: "cards", no: "1안", desc: "일감 카드가 위, 사람이 아래 — 할머니가 올리고 홍여사들이 손을 든다", steps: [C1, C2, C3] },
  { key: "street", no: "2안", desc: "홈 배너와 같은 거리 장면(복숭아 배경·길·병원) — 앱 전체 톤이 하나로", steps: [S1, S2, S3] },
  { key: "ui", no: "3안", desc: "앱 화면 미니어처 — 그림 대신 실제 화면 모양(올리기 폼·지원자 목록·선택)으로 설명", steps: [U1, U2, U3] },
  { key: "duo", no: "4안", desc: "큰 인물 한둘 중심 — 말풍선으로 대화하듯. 제일 단순하고 정감 있음", steps: [D1, D2, D3] },
  { key: "feat-map", no: "5안", desc: "특징 3가지 — 채팅으로 정하기 · 실시간 알림 · 내 주변(지도). 흐름 설명은 홈 배너가 하니 온보딩은 '뭐가 좋은지'", steps: [F1, F2, F3], copy: FEATURE_COPY("map") },
  { key: "feat-safe", no: "6안", desc: "특징 3가지 — 채팅으로 정하기 · 실시간 알림 · 안심(인증·후기·신고). 5안에서 세 번째만 다름", steps: [F1, F2, F3B], copy: FEATURE_COPY("safe") },
  { key: "feat-post", no: "7안", desc: "6안 앞에 '원하는 일 올리기' 한 장 추가(4장): 올리기 · 채팅 · 알림 · 안심", steps: [U1, F1, F2, F3B],
    copy: [
      { step: "올리기", title: ["원하는 일을\n", "직접 올려요"], sub: "집 청소부터 병원 동행까지,\n일·시간·금액을 적어 올리면 돼요." },
      ...FEATURE_COPY("safe"),
    ] },
  { key: "town4", no: "8안", desc: "컨셉 반영 4장 — 올리기 · 동네(여성만·같은 동네·본인 인증을 지도 한 장에) · 채팅 · 알림. 안심은 동네 장에 합침", steps: [U1, F4, F1, F2],
    copy: [
      { step: "올리기", title: ["원하는 일을\n", "직접 올려요"], sub: "집 청소부터 병원 동행까지,\n일·시간·금액을 적어 올리면 돼요." },
      TOWN_COPY,
      ...FEATURE_COPY("safe").slice(0, 2),
    ] },
  { key: "town5", no: "9안", desc: "확정(2026-08-23) — 컨셉 반영 5장 — 올리기 · 동네 · 채팅 · 알림 · 안심(인증·후기·신고 따로)", steps: [U1, F4, F1, F2, F3B],
    copy: [
      { step: "올리기", title: ["원하는 일을\n", "직접 올려요"], sub: "집 청소부터 병원 동행까지,\n일·시간·금액을 적어 올리면 돼요." },
      TOWN_COPY,
      ...FEATURE_COPY("safe"),
    ] },
];
export const onboardVariant = (key) => ONBOARD_VARIANTS.find((v) => v.key === key) || ONBOARD_VARIANTS[1];
