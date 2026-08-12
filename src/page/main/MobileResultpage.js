// 📄 MobileResultpage.jsx
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/User";
import MobileResultLayout from "../../screen/Layout/Layout/MobileResultLayout";
import MobileResultcontainer from "../../container/main/MobileResultcontainer";
import { useWorknet } from "../../context/WorknetContext";

const MobileResultpage = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { list, loading } = useWorknet();

  console.log("resultpage", list);

  // 안전하게 구조분해 (없으면 기본값)
  const {
    type = "general",
    name = "일자리 목록",
    catKey = null,
    radiusKm = 4,
  } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MobileResultLayout NAME={name}>
      <MobileResultcontainer
        items={list}
        name={name}
        initialLoading={loading}
        type={type}
        catKey={catKey}
        radiusKm={radiusKm}
      />
    </MobileResultLayout>
  );
};

export default MobileResultpage;
