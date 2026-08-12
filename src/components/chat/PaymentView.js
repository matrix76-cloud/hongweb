// ✅ PaymentView (리팩터 버전 with useContractFlow)
import React, { useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../../utility/fontsize";
import HongButton from "../HongButton";
import { Toaster, toast } from 'sonner';
import { Bootpay } from '@bootpay/client-js';
import { CreateMessageEx2 } from "../../service/ChatService";
import { UpdateContactByPURCHASE } from "../../service/ContactService";
import useContractFlow from "../../hooks/useContractFlow";

const PaymentView = ({ ITEM, user, CONTACTITEM }) => {
  const flow = useContractFlow(CONTACTITEM.CONTACT_ID);

  const confirmedAmount = flow.CONTACT_INFO?.find(x => x.requesttype === "금액")?.result;
  const realprice = Number(confirmedAmount || 0);

  console.log("💰 확인된 금액:", confirmedAmount);
  console.log("👉 realprice:", realprice);


  const [usePoint, setUsePoint] = useState(true);
  const [status, setStatus] = useState("ready"); // 'ready' | 'done' | 'error'

  const payable = usePoint ? Math.max(0, realprice - 5000) : realprice;

  const handleBootpayRequest = async () => {
    const orderId = `contract-${Date.now()}`;

    try {
      const response = await Bootpay.requestPayment({
        application_id: "67ae91a13aa7c4faf96e5699",
        price: payable,
        order_name: `구해줘알바용역 ${ITEM.INFO.WORKTYPE}`,
        order_id: orderId,
        method: "카드",
        user: {
          id: ITEM.INFO.USERS_ID,
          username: ITEM.OWNER.USERINFO.nickname,
          phone: ITEM.OWNER.USERINFO.phone,
          email: "test@test.com"
        },
        items: [{ id: orderId, name: "구해줘알바용역", qty: 1, price: payable }],
        extra: {
          open_type: 'iframe', "card_quota": "0,2,3",
          "escrow": false, }
      });

      if (response.event === "done") {
        await CreateMessageEx2({
          CHAT_ID: ITEM.CHAT_ID,
          msgitems: [`${user.USERINFO.nickname}님이 결제를 완료하였습니다.`],
          users_id: user.USERS_ID,
          read: [user.USERS_ID],
          CHAT_CONTENT_TYPE: "PURCHASE",
          ITEM
        });

        await UpdateContactByPURCHASE({ CONTACT_ID: flow.CONTACT_ID });
        toast.success("결제가 완료되었습니다.");
        setStatus("done");
      }

      if (response.event === "cancel") {
        toast.info("결제가 취소되었습니다.");
        setStatus("ready");
      }

    } catch (e) {
      console.error("결제 오류", e.message);
      toast.error("결제 중 오류가 발생했습니다.");
      setStatus("error");

  
    }
  };

  const renderButtonArea = () => {
    if (flow.isPaymentDone || status === "done") {
      return <NoticeText>✅ 결제가 완료되었습니다.</NoticeText>;
    }

    if (user.USERS_ID !== ITEM.OWNER_ID) {
      return <NoticeText>의뢰자님만 결제를 진행할 수 있습니다.</NoticeText>;
    }

    return (
      <>
        {status === "error" && <NoticeText style={{ color: "#e65b00" }}>❌ 결제에 실패했습니다. 다시 시도해주세요.</NoticeText>}
        <HongButton variant="primary" fullWidth onClick={handleBootpayRequest}>결제</HongButton>
      </>
    );
  };

  return (
    <Container>
      <Content>
        <PaymentContainer>
          <Title>결제 정보 확인</Title>
          <InfoTable>
            <tbody>
              <tr><td className="label">일감명</td><td className="value">{ITEM.INFO.WORKTYPE}</td></tr>
              <tr><td className="label">확정 금액</td><td className="value">{realprice.toLocaleString()}원</td></tr>
              <tr><td className="label">보유 포인트</td><td className="value">5000P</td></tr>
              <tr>
                <td className="label">포인트 사용</td>
                <td className="value">
                  <PointToggle active={usePoint} onClick={() => setUsePoint(!usePoint)}>
                    {usePoint ? '사용 중' : '사용 안함'}
                  </PointToggle>
                </td>
              </tr>
              <tr>
                <td className="label">최종 결제 금액</td>
                <td className="value" style={{ fontWeight: "bold", color: "#e65b00" }}>
                  {payable.toLocaleString()}원
                </td>
              </tr>
            </tbody>
          </InfoTable>
        </PaymentContainer>

        {realprice > 0 ? renderButtonArea() : (
          <NoticeText>계약서에서 금액이 확정된 후 결제할 수 있습니다.</NoticeText>
        )}
      </Content>
      <Toaster position="bottom-right" richColors />
    </Container>
  );
};

export default PaymentView;

const Container = styled.div`
  padding: 16px;
`;

const Content = styled.div`
  background: #fefefe;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const PaymentContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 10px 24px;
  width: 80%;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-family: 'Pretendard-Regular';
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-SemiBold;
  margin-bottom: 20px;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;

  td {
    padding: 12px 8px;
    border-bottom: 1px solid #eee;
    font-size: ${() => getFontSize(15)}px !important;
  }

  td.label {
    font-weight: 600;
    width: 40%;
    color: #555;
  }

  td.value {
    text-align: right;
    color: #131313;
  }
`;

const PointToggle = styled.button`
  background: ${({ active }) => active ? '#ff7e1b' : '#f3f3f3'};
  color: ${({ active }) => active ? '#fff' : '#333'};
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: ${() => getFontSize(14)}px !important;
  cursor: pointer;
  min-height:30px;l
`;

const NoticeText = styled.div`
  margin-top: 16px;
  text-align: center;
  color: #999;
  font-size: ${() => getFontSize(14)}px !important;
`;
