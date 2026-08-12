// 📁 ContractView.js
import React from "react";
import styled from "styled-components";
import MobileContract from "./MobileContract";


const ContractView = ({ ITEM, user, CONTACTITEM }) => {
    return (
        <Container>
            <MobileContract
                WORKTYPE={ITEM.INFO?.WORKTYPE}
                CONTACTITEM={CONTACTITEM}
                CHAT_ID={ITEM.CHAT_ID}
                ID={ITEM.INFO?.WORK_ID}
                OWNER_ID={ITEM.OWNER_ID}
                SUPPORTER_ID={ITEM.SUPPORTER_ID}
                NAME={ITEM.INFO?.WORKTYPE}
                LEFTNAME={ITEM.SUPPORTER?.USERINFO?.nickname ?? "지원자"}
                RIGHTNAME={ITEM.OWNER?.USERINFO?.nickname ?? "의뢰자"}
            />
        </Container>
    );
};

export default ContractView;

const Container = styled.div`
  padding: 0;
  background: #fff;
`;
