import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "./context/User";
import { useMediaQuery } from "react-responsive";

import { Suspense, lazy } from 'react';

const MobileSplashpage = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

import MobileSplashpage from "./page/main/MobileSplashpage";
import MobileMainpage from "./page/main/MobileMainpage";
import MobileWorkregistserpage from "./page/main/MobileWorkregisterpage";
import MobileRegistpage from "./page/main/MobileRegistpage";
import MobileMappage from "./page/main/Mobilemappage";
import MobileSearchHistorypage from "./page/main/MobileSearchHistorypage";
import MobileGatepage from "./page/main/MobileGatepage";
import MobilePolicypage from "./page/main/MobilePolicypage";
import MobilePhonepage from "./page/main/MobilePhonepage";
import PCLifepage from "./page/PCmain/PCLifepage";
import MobileCommunityppage from "./page/main/MobileCommunitypage";
import MobileWorkpage from "./page/main/Mobileworkpage";
import MobileChatpage from "./page/main/MobileChatpage";
import MobileContentpage from "./page/main/MobileContentpage";
import MobileCommunityContentpage from "./page/main/MobileCommunityContentpage";
import MobileMapReconfigpage from "./page/main/MobileMapReconfigpage";
import MobileConfigpage from "./page/main/MobileConfigpage";
import MobileLifeTourDetailPicturepage from "./page/main/MobileLifeTourDetailPicturepage";
import MobileLifeTourAutoPicturepage from "./page/main/MobileLifeTourAutoPicturepage";
import MobileConfigContentpage from "./page/main/MobileConfigContentpage";
import MobileEventdetailpage from "./page/main/MobileEventdetailpage";
import MobileLadyLicenseAuthpage from "./page/main/MobileLadyLicenseAuthpage";

import MobileContactDocpage from "./page/main/MobileContactDocpage";
import MobileLifeTourRegionpage from "./page/main/MobileLifeTourRegionpage";
import MobileWorkMapconfigpage from "./page/main/MobileWorkMapconfigpage";
import MobileListpage from "./page/main/MobileListpage";
import MobileCompletepage from "./page/main/MobileCompletepage";
import MobileReviewpage from "./page/main/MobileReviewpage";
import MobileLadyResumepage from "./page/main/MobileLadyResumepage";
import MobileLifeItempage from "./page/main/MobileLifeItempage";
import MobileProfilepage from "./page/main/MobileProfilepage";
import MobileAICategoryCreatepage from "./page/main/MobileAICategoryCreatepage";
import MobileAICategoryListpage from "./page/main/MobileAICategoryListpage";
import MobileAICategoryContentpage from "./page/main/MobileAICategoryContentpage";

import MobileFreezeRecipepage from "./page/main/MobileFreezeRecipepage";
import MobileTourCourseTracepage from "./page/main/MobileTourCourseTracepage";
import MobileTourCourseAnalyzepage from "./page/main/MobileTourCourseAnalyzepage";
import MobileLeisureppage from "./page/main/MobileLeisurepage";
import MobileLeisureContentpage from "./page/main/MobileLeisureContentpage";
import MobileAIResultpage from "./page/main/MobileAIResultpage";
import MobileLifeMedicalDrugDetailpage from "./page/main/MobileLifeMedicalDrugDetailpage";
import MobileLifeFoodDrugDetailpage from "./page/main/MobileLifeFoodDrugDetailpage";




import PCGatepage from "./page/PCmain/PCGatepage";


import PCListpage from "./page/PCmain/PCListpage";
import PCMappage from "./page/PCmain/PCMappage";
import PCAppDownloadpage from "./page/PCmain/PCAppDownloadpage";
import PCEventpage from "./page/PCmain/PCEventpage";

import PCLeisurepage from "./page/PCmain/PCLeisurepage";
import PCGuidepage from "./page/PCmain/PCGuidepage";
import PCPolicypage from "./page/PCmain/PCPolicypage";




const App =() =>  {



  const { user, dispatch } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){

    } 
    FetchData();

  }, [])
  useEffect(()=>{

  },[refresh])





  return (
   
    <Routes>
      <Suspense>


      <Route
          path="/"
          element={isMobile ?  (<MobileSplashpage />) :   (<PCGatepage />)} 
        />

      <Route path="/Mobilegate" element={<MobileGatepage />} />
      <Route path="/Mobilepolicy" element={<MobilePolicypage />} />
      <Route path="/Mobilephone" element={<MobilePhonepage />} />
      <Route path="/Mobilemain" element={<MobileMainpage />} />
      <Route path="/Mobilecommunity" element={<MobileCommunityppage />} />
      <Route path="/Mobilecommunitycontent" element={<MobileCommunityContentpage />} />
      <Route path="/Mobileleisure" element={<MobileLeisureppage />} />
      <Route path="/Mobileleisurecontent" element={<MobileLeisureContentpage />} />   
      <Route path="/Mobileworkregister" element={<MobileWorkregistserpage />} />
      <Route path="/Mobileregist" element={<MobileRegistpage />} />
      <Route path="/Mobilemap" element={<MobileMappage />} />
      <Route path="/Mobilework" element={<MobileWorkpage />} />
      <Route path="/Mobilechat" element={<MobileChatpage />} />
      <Route path="/Mobilecontent" element={<MobileContentpage />} />
      <Route path="/MobileLifeMedicalDrugDetail" element={<MobileLifeMedicalDrugDetailpage />} />
      <Route path="/MobileLifeFoodDrugDetail" element={<MobileLifeFoodDrugDetailpage />} />
      <Route path="/Mobileairesult" element={<MobileAIResultpage/>} />
      <Route path="/Mobileaicategorycreate" element={<MobileAICategoryCreatepage />} />
      <Route path="/Mobileaicategorylist" element={<MobileAICategoryListpage />} />
      <Route path="/Mobileaicategorycontent" element={<MobileAICategoryContentpage />} />
      <Route path="/Mobileprofile" element={<MobileProfilepage />} />
      <Route path="/Mobilesearchhistory" element={<MobileSearchHistorypage />} />
      <Route path="/Mobilemapreconfig" element={<MobileMapReconfigpage />} />
      <Route path="/Mobileworkmapconfig" element={<MobileWorkMapconfigpage />} />
      <Route path="/Mobileconfig" element={<MobileConfigpage />} />
      <Route path="/Mobileconfigcontent" element={<MobileConfigContentpage />} />
      <Route path="/Mobiletourdetailpicture" element={<MobileLifeTourDetailPicturepage />} />
      <Route path="/Mobiletourautopicture" element={<MobileLifeTourAutoPicturepage />} />
      <Route path="/Mobileeventdetail" element={<MobileEventdetailpage />} />
      <Route path="/Mobileladylicense" element={<MobileLadyLicenseAuthpage />} />
     
      <Route path="/Mobilecontactdoc" element={<MobileContactDocpage />} />
      <Route path="/Mobilelifetourregion" element={<MobileLifeTourRegionpage />} />
      <Route path="/Mobilelist" element={<MobileListpage />} />
      <Route path="/Mobilecomplete" element={<MobileCompletepage />} />
      <Route path="/Mobilereview" element={<MobileReviewpage />} />
      <Route path="/Mobilelifeitem" element={<MobileLifeItempage/>}/>

      <Route path="/Mobilefreezerecipe" element={<MobileFreezeRecipepage/>}/>
      <Route path="/Mobiletourcoursetrace" element={<MobileTourCourseTracepage/>}/>
      <Route path="/Mobiletourcourseanalyze" element={<MobileTourCourseAnalyzepage/>}/>
      <Route path="/Mobileladyresume" element={<MobileLadyResumepage />} />



      <Route path="/PCGate" element={<PCGatepage />} />
      <Route path="/PClist" element={<PCListpage />} />
      <Route path="/PCmap" element={<PCMappage />} />
      <Route path="/PCguide" element={<PCGuidepage />} />
      <Route path="/PClife" element={<PCLifepage />} />
      <Route path="/PCleisure" element={<PCLeisurepage />} />
      <Route path="/PCEvent" element={<PCEventpage />} />
      <Route path="/PCPolicy" element={<PCPolicypage />} />
      <Route path="/PCAppDownload" element={<PCAppDownloadpage />} />


      </Suspense>


  

    </Routes>

  );

  
 
}

export default App;
