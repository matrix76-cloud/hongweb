import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./context/User";
import { useMediaQuery } from "react-responsive";

// sub
import Configpage from "./page/main/Configpage";
import Mainpage from "./page/main/Mainpage";
import Mappage from "./page/main/Mappage";
import Workpage from "./page/main/Workpage";
import Splashpage from "./page/sub/Splash/Splashpage";

// PC
import PCCenterpage from "./page/PCmain/PCCenterpage";
import PCChatpage from "./page/PCmain/PCChatpage";
import PCHongguidepage from "./page/PCmain/PCHongguidepage";
import PCLoginpage from "./page/PCmain/PCLoginpage";
import PCMainpage from "./page/PCmain/PCMainpage";
import PCMappage from "./page/PCmain/PCMappage";
import PCPolicypage from "./page/PCmain/PCPolicypage";
import PCProfilepage from "./page/PCmain/PCProfilepage";
import PCRegistpage from "./page/PCmain/PCRegistpage";
import PCSplashpage from "./page/PCmain/PCSplashpage";
import PCWorkregistserpage from "./page/PCmain/PCWorkregisterpage";

// Mobile
import MobileChatpage from "./page/main/MobileChatpage";
import MobileConfigContentpage from "./page/main/MobileConfigContentpage";
import MobileConfigpage from "./page/main/MobileConfigpage";
import MobileContentpage from "./page/main/MobileContentpage";
import MobileGatepage from "./page/main/MobileGatepage";
import MobileLadyLicenseAuthpage from "./page/main/MobileLadyLicenseAuthpage";
import MobileMainpage from "./page/main/MobileMainpage";
import MobileMapReconfigpage from "./page/main/MobileMapReconfigpage";
import MobileMappage from "./page/main/Mobilemappage";
import MobilePhonepage from "./page/main/MobilePhonepage";
import MobilePolicypage from "./page/main/MobilePolicypage";
import MobileRegistpage from "./page/main/MobileRegistpage";
import MobileSearchHistorypage from "./page/main/MobileSearchHistorypage";
import MobileSearchpage from "./page/main/MobileSearchpage";
import MobileSplashpage from "./page/main/MobileSplashpage";
import MobileWorkpage from "./page/main/Mobileworkpage";
import MobileWorkregistserpage from "./page/main/MobileWorkregisterpage";

import ReviewPage from "./dev/ReviewPage";

import { Provider as MyProvider, useDispatch } from 'react-redux';
import localforage from 'localforage';
import { ALLWORK } from "./store/menu/MenuSlice";

const App = () => {

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

  useEffect(() => {
    async function FetchData() {
    }
    FetchData();
  }, [])

  useEffect(() => {
  }, [refresh])

  return (

    <Routes>

      <Route
          path="/"
          element={isMobile ? (<MobileSplashpage />) : (<PCSplashpage />)}
        />

      {/* 가입 / 인증 */}
      <Route path="/Mobilegate" element={<MobileGatepage />} />
      <Route path="/Mobilepolicy" element={<MobilePolicypage />} />
      <Route path="/Mobilephone" element={<MobilePhonepage />} />
      <Route path="/Mobileregist" element={<MobileRegistpage />} />
      <Route path="/Mobileladylicense" element={<MobileLadyLicenseAuthpage />} />

      {/* ① 일 올리기 · 리스트 */}
      <Route path="/Mobilemain" element={<MobileMainpage />} />
      <Route path="/Mobileworkregister" element={<MobileWorkregistserpage />} />
      <Route path="/Mobilework" element={<MobileWorkpage />} />
      <Route path="/Mobilecontent" element={<MobileContentpage />} />

      {/* 찾기 */}
      <Route path="/Mobilemap" element={<MobileMappage />} />
      <Route path="/Mobilesearch" element={<MobileSearchpage />} />
      <Route path="/Mobilesearchhistory" element={<MobileSearchHistorypage />} />
      <Route path="/Mobilemapreconfig" element={<MobileMapReconfigpage />} />

      {/* ④ 연결 */}
      <Route path="/Mobilechat" element={<MobileChatpage />} />


      {/* 내 정보 */}
      <Route path="/Mobileconfig" element={<MobileConfigpage />} />
      <Route path="/Mobileconfigcontent" element={<MobileConfigContentpage />} />

      {/* PC */}
      <Route path="/PCmain" element={<PCMainpage />} />
      <Route path="/PCmap" element={<PCMappage />} />
      <Route path="/PCchat" element={<PCChatpage />} />
      <Route path="/PChongguide" element={<PCHongguidepage />} />
      <Route path="/PClogin" element={<PCLoginpage />} />
      <Route path="/PCprofile" element={<PCProfilepage />} />
      <Route path="/PCcenter" element={<PCCenterpage />} />
      <Route path="/PCpolicy" element={<PCPolicypage />} />
      <Route path="/PCworkregister" element={<PCWorkregistserpage />} />
      <Route path="/PCregist" element={<PCRegistpage />} />

      <Route path="/main" element={<Mainpage />} />
      <Route path="/work" element={<Workpage />} />
      <Route path="/map" element={<Mappage />} />
      <Route path="/config" element={<Configpage />} />

      {/* 개발 전용 — 형/카스 화면 리뷰 (프로덕션 빌드에서는 백엔드 플러그인이 빠진다) */}
      {import.meta.env.DEV && <Route path="/review" element={<ReviewPage />} />}

    </Routes>

  );
}

export default App;
