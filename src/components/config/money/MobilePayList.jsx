import React from "react";
import styled from "styled-components";
import Empty from "../../Empty";

/**
 * 내 정보 > 결제관리 / 입금관리 (형 리뷰 2026-08-13 "모두 처리 해줘").
 *
 * 아직 앱 안에서 돈이 오가지 않는다 — 금액은 채팅으로 정하고 만나서 주고받는 구조다.
 * 그래서 보여줄 내역이 없다. 눌러도 "준비 중" 알럿만 뜨던 자리에,
 * 지금 어떻게 돌아가는지와 앞으로 무엇이 들어올지를 알려준다.
 */

const Container = styled.div`
  padding: 20px 20px 40px;
  min-height: 420px;
`;
const Head = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
`;
const Desc = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #71717a;
  margin-bottom: 18px;
`;
const Notice = styled.div`
  margin-top: 18px;
  padding: 16px 18px;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  background: var(--bg-soft);
  font-size: 15px;
  line-height: 1.7;
  color: #4B4B4B;
`;

/** kind: 'pay'(결제) | 'deposit'(입금) */
const MobilePayList = ({ kind = "pay" }) => {
  const pay = kind === "pay";
  return (
    <Container>
      <Head>{pay ? "결제관리" : "입금관리"}</Head>
      <Desc>
        {pay
          ? "일감에 쓴 돈의 내역을 모아 보여드리는 곳입니다."
          : "일하고 받은 돈의 내역을 모아 보여드리는 곳입니다."}
      </Desc>

      <Empty content={pay ? "결제 내역이 없습니다" : "입금 내역이 없습니다"} height={160} />

      <Notice>
        지금은 앱 안에서 돈이 오가지 않습니다. 금액은 채팅으로 정하고 만나서 직접 주고받습니다.
        그래서 아직 쌓일 내역이 없습니다.
        {"\n\n"}
        앱에서 바로 결제하는 기능이 들어오면 그때부터 이 자리에 내역이 남습니다.
      </Notice>
    </Container>
  );
};

export default MobilePayList;
