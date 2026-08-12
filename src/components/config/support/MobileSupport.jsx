import React, { useState } from "react";
import styled from "styled-components";
import { RiArrowDownSLine } from "react-icons/ri";

/**
 * 내 정보 > 고객센터 · 자주묻는 질문 · 홍여사 알아보기 (형 리뷰 2026-08-13 "모두 처리 해줘").
 * 셋 다 읽는 화면이라 한 파일에서 kind 로 나눠 그린다.
 */

const Container = styled.div`
  padding: 20px 20px 40px;
  min-height: 420px;
`;
const Head = styled.div`
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
`;
const Desc = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: #71717a;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;
const Block = styled.div`
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
  background: var(--surface);
`;
const BlockTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
`;
const BlockText = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: #4B4B4B;
  white-space: pre-wrap;
`;
const Row = styled.div`
  border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
`;
const Q = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 2px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.5;
  word-break: keep-all;
`;
const Chevron = styled.div`
  flex-shrink: 0;
  color: #B0B0B0;
  display: flex;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform .18s ease;
`;
const A = styled.div`
  padding: 0 2px 18px;
  font-size: 15px;
  line-height: 1.75;
  color: #555;
  white-space: pre-wrap;
`;
const Step = styled.div`
  display: flex;
  gap: 10px;
  font-size: 15px;
  line-height: 1.7;
  color: #4B4B4B;
  & + & { margin-top: 10px; }
`;
const No = styled.span`
  flex-shrink: 0;
  color: #FF4E19;
  font-weight: 700;
`;

const FAQ = [
  ["일감은 어떻게 올리나요?",
   "홈 화면에서 필요한 일을 고르면 몇 가지를 묻습니다. 답만 하시면 등록이 끝납니다.\n마지막에 참고 사진을 넣으실 수 있는데, 사진이 있으면 홍여사가 상황을 훨씬 빨리 파악합니다."],
  ["홍여사로 일하려면 무엇이 필요한가요?",
   "내 정보에서 홍여사 등록을 마치시면 모든 일감에 지원할 수 있습니다.\n등록할 때 신분 확인을 거칩니다."],
  ["돈은 언제, 어떻게 주고받나요?",
   "지금은 앱에서 결제하지 않습니다. 금액은 채팅으로 정하고 만나서 직접 주고받습니다.\n일을 시작하기 전에 시간과 금액을 채팅으로 남겨 서로 확인해 주세요."],
  ["지원했는데 연락이 없어요.",
   "일감을 올린 분이 여러 지원자 중에서 고릅니다. 조금 기다려 주세요.\n채팅으로 먼저 인사를 남기시면 선택될 가능성이 높아집니다."],
  ["일감이 몇 개 안 보여요.",
   "기본은 내 주변만 보여드립니다. 내 정보 > 나의 범위설정에서 찾는 거리를 넓히시면 더 많이 보입니다."],
  ["대화명을 바꾸고 싶어요.",
   "내 정보에서 대화명 옆 연필을 누르면 그 자리에서 바꾸실 수 있습니다.\n6자까지 쓸 수 있고 하루에 한 번만 바꿀 수 있습니다."],
  ["거래하다 문제가 생기면요?",
   "선입금을 요구하거나 앱 밖으로 대화를 옮기자고 하면 응하지 마세요.\n이상한 점이 있으면 고객센터로 알려주시면 확인해 드립니다."],
  ["탈퇴하면 어떻게 되나요?",
   "내 정보 맨 아래 계정에서 탈퇴하실 수 있습니다.\n주고받은 대화는 상대방 쪽에 남지만 개인정보는 지워집니다."],
];

/** kind: 'support' | 'faq' | 'about' */
const MobileSupport = ({ kind = "support" }) => {
  const [open, setOpen] = useState(0);

  if (kind === "faq") {
    return (
      <Container>
        <Head>자주묻는 질문</Head>
        <Desc>많이 들어오는 질문을 모았습니다. 여기서 답을 못 찾으시면 고객센터로 문의해 주세요.</Desc>
        {FAQ.map(([q, a], i) => (
          <Row key={q}>
            <Q onClick={() => setOpen(open === i ? -1 : i)}>
              {q}
              <Chevron $open={open === i}><RiArrowDownSLine size={22} /></Chevron>
            </Q>
            {open === i && <A>{a}</A>}
          </Row>
        ))}
      </Container>
    );
  }

  if (kind === "about") {
    return (
      <Container>
        <Head>구해줘 홍여사</Head>
        <Desc>집안일·돌봄·심부름처럼 사람 손이 필요한 일을 이웃과 이어주는 서비스입니다.</Desc>

        <Block>
          <BlockTitle>일이 필요하신 분</BlockTitle>
          <Step><No>1</No>홈에서 필요한 일을 골라 등록합니다.</Step>
          <Step><No>2</No>가까운 홍여사들이 지원합니다.</Step>
          <Step><No>3</No>마음에 드는 분을 골라 채팅으로 연결됩니다.</Step>
        </Block>

        <Block>
          <BlockTitle>일을 하고 싶으신 분</BlockTitle>
          <Step><No>1</No>내 정보에서 홍여사 등록을 마칩니다.</Step>
          <Step><No>2</No>내 주변 일감을 보고 지원합니다.</Step>
          <Step><No>3</No>선택되면 채팅으로 일정과 금액을 정합니다.</Step>
        </Block>

        <Block>
          <BlockTitle>어떤 일을 맡길 수 있나요</BlockTitle>
          <BlockText>{"청소 — 집 청소 · 사무실 청소 · 이사 청소\n집안일 — 식사 준비 · 장봐주기 · 짐 나르기 · 심부름\n아이 — 아이돌봄 · 등원하원 · 아이레슨 · 학교행사\n돌봄 — 간병하기 · 병원가기\n반려 — 애견산책 · 애견 병원"}</BlockText>
        </Block>

        <Block>
          <BlockTitle>안전하게 쓰시려면</BlockTitle>
          <BlockText>{"대화는 앱 안에서 나눠주세요.\n일을 시작하기 전에 시간과 금액을 글로 남겨 서로 확인하세요.\n선입금 요구나 개인 계좌 송금 요청에는 응하지 마세요."}</BlockText>
        </Block>
      </Container>
    );
  }

  return (
    <Container>
      <Head>고객센터</Head>
      <Desc>{"쓰시다가 막히거나 이상한 점이 있으면 알려주세요.\n확인하고 답을 드리겠습니다."}</Desc>

      <Block>
        <BlockTitle>문의 메일</BlockTitle>
        <BlockText>help@hongcomz.com</BlockText>
      </Block>

      <Block>
        <BlockTitle>운영 시간</BlockTitle>
        <BlockText>{"평일 오전 10시 ~ 오후 6시\n점심시간 오후 12시 ~ 1시\n주말·공휴일 휴무"}</BlockText>
      </Block>

      <Block>
        <BlockTitle>문의하실 때 알려주시면 빠릅니다</BlockTitle>
        <BlockText>{"· 어느 화면에서 생긴 일인지\n· 무엇을 누르셨는지\n· 화면 사진이 있으면 함께"}</BlockText>
      </Block>

      <Block>
        <BlockTitle>신고</BlockTitle>
        <BlockText>{"선입금 요구, 앱 밖으로 대화를 옮기자는 제안, 불쾌한 말을 받으셨다면\n대화방에서 신고하시거나 위 메일로 알려주세요."}</BlockText>
      </Block>

      <Block>
        <BlockTitle>만든 곳</BlockTitle>
        <BlockText>{"주식회사 홍컴즈\n서울특별시 서초구 사임당로8길 13, 4층\n사업자등록번호 480-86-03245"}</BlockText>
      </Block>
    </Container>
  );
};

export default MobileSupport;
