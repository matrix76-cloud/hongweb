// src/components/chat/AIMessageBody.jsx
import React from "react";
import CampCardList from "../card/CampCardList";
import styled from "styled-components";
import { getFontSize } from "../../utility/fontsize";


// 필요한 카드들 계속 import 예정 (tour/med 등)

const AIMessageBody = ({ data, _handleimgView }) => {
    const item = data.ITEM || data.item || {};
    const card = item.AI_CARD;

    // 카드 + 텍스트 둘 다 가능
    if (card && card.type === "camp_list") {
        return (
            <>
                {data.TEXT ? <Bubble>{data.TEXT}</Bubble> : null}
                <CampCardList items={card.items || []} onImageClick={_handleimgView} />
            </>
        );
    }

    // 기본: 텍스트
    return <div style={{ whiteSpace: "pre-wrap" }}>{data.TEXT}</div>;
};

export default AIMessageBody;

const Bubble = styled.div`
  background: #413e3ec4;
  border-radius: 20px;
  padding: 14px 18px;
  color: #fff;
  font-size: ${() => getFontSize(15)}px !important;
  line-height: 1.6;
  max-width: 80%;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);

`;