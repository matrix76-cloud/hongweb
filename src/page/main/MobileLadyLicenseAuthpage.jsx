
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



import MobileLadyLicenseAuthcontainer from "../../container/main/MobileLadyLicenseAuthcontainer";
import MobileCommunityLayout from "../../screen/Layout/Layout/MobileCommunityLayout";
import { MOBILEMAINMENU } from "../../utility/screen";


const MobileLadyLicenseAuthpage = () => {

  const location = useLocation();


  return (
    <MobileCommunityLayout name={location.state.NAME} type={MOBILEMAINMENU.CONFIGMENU} image=''>
      <MobileLadyLicenseAuthcontainer />
    </MobileCommunityLayout>
  );
};

export default MobileLadyLicenseAuthpage;
