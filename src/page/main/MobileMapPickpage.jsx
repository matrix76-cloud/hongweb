import React from "react";
import MobileMapPickcontainer from "../../container/main/MobileMapPickcontainer";
import MobilePrevheader from "../../screen/Layout/Header/MobilePrevheader";

/**
 * 지도로 위치지정 (seekone MapPick 방식) — 헤더 위치 시트에서 들어온다.
 */
const MobileMapPickpage = () => {
  return (
    <div>
      <MobilePrevheader name={"지도로 위치지정"} />
      <MobileMapPickcontainer />
    </div>
  );
};

export default MobileMapPickpage;
