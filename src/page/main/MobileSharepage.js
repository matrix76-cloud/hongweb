// 📄 ShareViewPage.jsx
import React, { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import MobileGameRankContent from "../../components/config/activity/MobileGameRankContent";
import { UserContext } from "../../context/User";
import MobileSale from "../../components/MobileSale";
import ShareCTA from "../../common/ShareCTA";

// 기존 구현된 내부 컴포넌트 import
const MobileSharepage = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    if (!type) return <div>❌ type이 지정되지 않았습니다.</div>;

    let ContentComponent = null;
    switch (type) {
        case "game":
            ContentComponent = <MobileGameRankContent />;
            break;
        case "sale":
            ContentComponent = <MobileSale />;
            break;
        default:
            return <div>❌ 지원되지 않는 공유 유형입니다: {type}</div>;
    }

    return (
        <>
            {ContentComponent}
            <ShareCTA />
        </>
    );
};


export default MobileSharepage;