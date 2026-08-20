import React from "react";
import MobilePayResultcontainer from "../../container/main/MobilePayResultcontainer";

/** 결제 결과 — 돌아온 자리라 헤더 없이 전체 화면으로 */
export const MobilePaySuccesspage = () => <MobilePayResultcontainer kind="success" />;
export const MobilePayFailpage = () => <MobilePayResultcontainer kind="fail" />;
