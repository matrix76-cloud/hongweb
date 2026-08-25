import React, { useEffect } from "react";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import MobileWorkerscontainer from "../../container/main/MobileWorkerscontainer";
import { MOBILEMAINMENU } from "../../utility/screen";

/* 홈 [활동 중인 홍여사] → 내 범위 안 홍여사 목록 (형 지시 2026-08-23) */
const MobileWorkerspage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <MobileCommunityLayout name="활동 중인 홍여사" type={MOBILEMAINMENU.HOMEMENU}>
      <MobileWorkerscontainer />
    </MobileCommunityLayout>
  );
};

export default MobileWorkerspage;
