// 📄 MobileResultpage.jsx
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/User";
import MobileResultLayout from "../../screen/Layout/Layout/MobileResultLayout";
import MobileResultcontainer from "../../container/main/MobileResultcontainer";
import { useWorknet } from "../../context/WorknetContext";
import MobileResultMapcontainer from "../../container/main/MobileResultMapcontainer";

const MobileResultMappage = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { list, loading } = useWorknet();

  const {
    type = "general",
    name = "일자리 목록",
    catKey = null,
    radiusKm = 4,
    items: passedItems = null,
  } = location.state || {};

  const items = passedItems ?? list;
  const initialLoading = passedItems ? false : loading;


  // 사용자 위치
  const centerLat = user?.USERINFO?.latitude;
  const centerLng = user?.USERINFO?.longitude;


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MobileResultLayout NAME={name}>
      <MobileResultMapcontainer
        items={items}
        loading={initialLoading}
        type={type}
        catKey={catKey}
        radiusKm={radiusKm}
        centerLat={centerLat}
        centerLng={centerLng}
      />
    </MobileResultLayout>
  );
};

export default MobileResultMappage;
