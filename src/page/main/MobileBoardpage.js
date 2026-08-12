/* eslint-disable */
import React from "react";
import MobileLayout from "../../screen/Layout/Layout/MobileLayout";

import { MOBILEMAINMENU } from "../../utility/screen";
import MobileBoardcontainer from "../../container/main/MobileBoardcontainer";
import MobileBoardLayout from "../../screen/Layout/Layout/MobileBoardLayout";

const MobileBoardpage = () => {
    return (
        <MobileBoardLayout registbtn={true} name={MOBILEMAINMENU.BOARDMENU} type={MOBILEMAINMENU.BOARDMENU}>
            <MobileBoardcontainer />
        </MobileBoardLayout>
    );
};

export default MobileBoardpage;
