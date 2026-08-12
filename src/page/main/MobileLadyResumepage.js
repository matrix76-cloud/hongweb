
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



import MobileLadyLicenseAuthcontainer from "../../container/main/MobileLadyLicenseAuthcontainer";
import MobileLadyResumecontainer from "../../container/main/MobileLadyResumecontainer";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import MobileOnlyPrevLayout from "../../screen/Layout/Layout/MobileOnlyPrevLayout";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";
import { MOBILEMAINMENU } from "../../utility/screen";


const MobileLadyResumepage = () => {

  const location = useLocation();


  return (

    <MobileOnlyPrevLayout name={'소개글'} type={MOBILEMAINMENU.COMMUNITYMENU}>
      <MobileLadyResumecontainer  REALNAME = {location.state.REALNAME} />
    </MobileOnlyPrevLayout>

 
  );
};

export default MobileLadyResumepage;
