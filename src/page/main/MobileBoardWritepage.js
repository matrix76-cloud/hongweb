/* eslint-disable */
import React from "react";


import { MOBILEMAINMENU } from "../../utility/screen";
import MobileBoardWritecontainer from "../../container/main/MobileBoardWritecontainer";

import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";

const MobileBoardWritepage = () => {
    return (
        <MobilePrevLayout name={'도움 요청한 일이 여기에 모여있어요.'} type={MOBILEMAINMENU.BOARDMENU}>
            <MobileBoardWritecontainer />
        </MobilePrevLayout>
    );
};

export default MobileBoardWritepage;
