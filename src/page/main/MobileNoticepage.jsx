import React, { useEffect } from "react";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import MobileNoticecontainer from "../../container/main/MobileNoticecontainer";
import { MOBILEMAINMENU } from "../../utility/screen";

/** 공지사항 (형 리뷰 2026-08-12) */
const MobileNoticepage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MobileCommunityLayout name={"공지사항"} type={MOBILEMAINMENU.REGIONMENU} image="">
      <MobileNoticecontainer />
    </MobileCommunityLayout>
  );
};

export default MobileNoticepage;
