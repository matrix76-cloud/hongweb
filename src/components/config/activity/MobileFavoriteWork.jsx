import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { ReadWorkByIndividually } from "../../../service/WorkService";
import { ReadFavorites, ToggleFavorite } from "../../../service/FavoriteService";
import { FILTERITMETYPE } from "../../../utility/screen";
import MobileWorkItem from "../../MobileWorkItem";
import Empty from "../../Empty";
import LottieAnimation from "../../../common/LottieAnimation";
import { imageDB } from "../../../utility/imageData";

/**
 * 내 정보 > 찜한 일감 (형 리뷰 2026-08-13 "모두 처리 해줘").
 * 일감 상세에서 하트를 누른 것들이 여기 모인다.
 */

const Container = styled.div`
  padding: 16px 16px 40px;
  min-height: 420px;
`;
const Summary = styled.div`
  font-size: 15px;
  color: #71717a;
  padding: 4px 2px 14px;
  b { color: #FF4E19; font-weight: 700; font-size: 17px; }
`;
const LoadingAnimationStyle = { zIndex: 11, position: "absolute", top: "40%", left: "40%" };

const MobileFavoriteWork = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ids = await ReadFavorites(user?.users_id);
      // 찜한 뒤 지워진 일감이 있을 수 있어 실제로 남아 있는 것만 모은다
      const works = await Promise.all(ids.map((id) => ReadWorkByIndividually({ WORK_ID: id }).catch(() => null)));
      if (!alive) return;
      setItems(works.filter((w) => w && w.WORK_ID).map((w) => ({ ...w, TYPE: FILTERITMETYPE.HONG })));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user?.users_id]);

  if (loading) {
    return (
      <Container>
        <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge} width={"100px"} height={"100px"} />
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container>
        <Empty content={"찜한 일감이 없습니다"} height={180} />
        <Summary style={{ textAlign: "center" }}>일감 상세에서 하트를 누르면 여기에 모입니다</Summary>
      </Container>
    );
  }

  return (
    <Container>
      <Summary>찜한 일감 <b>{items.length}</b>건</Summary>
      {items.map((w, i) => (
        <MobileWorkItem
          key={w.WORK_ID}
          index={i}
          width={"100%"}
          workdata={w}
          onPress={() => navigate("/Mobilework", { state: { WORK_ID: w.WORK_ID, TYPE: FILTERITMETYPE.HONG, WORKTYPE: w.WORKTYPE } })}
        />
      ))}
    </Container>
  );
};

export default MobileFavoriteWork;
