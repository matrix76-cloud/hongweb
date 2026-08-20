import React from "react";
import MobilePaycontainer from "../../container/main/MobilePaycontainer";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";

/** 결제 화면 — 헤더에 뒤로가기만 두고 하단 탭은 없앤다 (결제 중에 나가면 안 된다) */
const MobilePaypage = () => (
  <MobileCommunityLayout name={"결제"}>
    <MobilePaycontainer />
  </MobileCommunityLayout>
);

export default MobilePaypage;
