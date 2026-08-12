/* eslint-disable */
import React from "react";
import MobileLayout from "../../screen/Layout/Layout/MobileLayout";

import { MOBILEMAINMENU } from "../../utility/screen";
import MobileBoardDetailcontainer from "../../container/main/MobileBoardDetailcontainer";
import MobileListLayout from "../../screen/Layout/Layout/MobileListLayout";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";

const MobileBoardDetailpage = () => {
    return (
        <MobilePrevLayout name={'도움 요청한 일이 여기에 모여있어요.'} type={MOBILEMAINMENU.BOARDMENU}>
            <MobileBoardDetailcontainer />
        </MobilePrevLayout >
    );
};

export default MobileBoardDetailpage;
