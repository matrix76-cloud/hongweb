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
import MobileWorkerRegistpage from "./page/main/MobileWorkerRegistpage";
import MobileMainpage from "./page/main/MobileMainpage";
import MobileAgreepage from "./page/main/MobileAgreepage";
import MobileSignuppage from "./page/main/MobileSignuppage";
import MobileFindAccountpage from "./page/main/MobileFindAccountpage";
import MobileLoginpage from "./page/main/MobileLoginpage";
import MobileOnboardingpage from "./page/main/MobileOnboardingpage";
import MobileMapPickpage from "./page/main/MobileMapPickpage";
import MobileMapReconfigpage from "./page/main/MobileMapReconfigpage";
import MobileMappage from "./page/main/Mobilemappage";
import MobilePhonepage from "./page/main/MobilePhonepage";
import MobilePolicypage from "./page/main/MobilePolicypage";
import MobileRegistpage from "./page/main/MobileRegistpage";
import MobileSearchHistorypage from "./page/main/MobileSearchHistorypage";
import MobileSearchpage from "./page/main/MobileSearchpage";
import MobileNoticepage from "./page/main/MobileNoticepage";
import MobileSplashpage from "./page/main/MobileSplashpage";
import MobileWorkpage from "./page/main/Mobileworkpage";
import MobileWorkregistserpage from "./page/main/MobileWorkregisterpage";

import ReviewPage from "./dev/ReviewPage";
import PushToast from "./components/PushToast";

import { Provider as MyProvider, useDispatch } from 'react-redux';
import localforage from 'localforage';
import { ALLWORK } from "./store/menu/MenuSlice";
import { APP_TO_WEB, isInApp, listenApp, saveAppPushToken, sendToApp, setAppMainScreen } from "./service/appBridge";

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

  /* 앱(WebView) 안에서 열렸을 때 — 앱이 준 토큰을 저장하고 딥링크를 따라간다.
     앱은 껍데기라 저장·이동은 웹이 한다 (2026-08-13) */
  useEffect(() => {
    if (!isInApp()) return undefined;

    const stop = listenApp(async (type, data) => {
      if (type === APP_TO_WEB.INIT) {
        if (data.token && user?.users_id) {
          await saveAppPushToken({ USERS_ID: user.users_id, token: data.token, platform: data.platform });
        }
        if (data.latitude && data.longitude) {
          user.latitude = data.latitude;
          user.longitude = data.longitude;
          dispatch(user);
        }
        if (data.pushLink) navigate(data.pushLink);
      }

      if (type === APP_TO_WEB.PUSH_OPENED && data.link) navigate(data.link);
    });

    sendToApp('ready');
    return stop;
  }, [user?.users_id]);

  // 지금 화면이 메인인지 앱에 알려준다 — 앱의 뒤로가기 동작이 갈린다
  useEffect(() => {
    const mains = ['/Mobilemain', '/Mobilemap', '/Mobilechat', '/Mobileconfig', '/'];
    setAppMainScreen(mains.includes(location.pathname));
  }, [location.pathname]);

  return (
    <>
    {/* 화면을 보고 있을 때 오는 알림은 OS 가 안 띄운다 -> 상단에 직접 (형 지시 2026-08-12) */}
    <PushToast />

    <Routes>

      <Route
          path="/"
          element={isMobile ? (<MobileSplashpage />) : (<PCSplashpage />)}
        />

      {/* 가입 / 인증 */}
      <Route path="/Mobileonboarding" element={<MobileOnboardingpage />} />
      <Route path="/Mobilegate" element={<MobileGatepage />} />
      {/* 가입 흐름: 온보딩 → 약관 동의 → 로그인/가입 (형 지시 2026-08-12) */}
      <Route path="/Mobileagree" element={<MobileAgreepage />} />
      <Route path="/Mobilelogin" element={<MobileLoginpage />} />
      <Route path="/Mobilesignup" element={<MobileSignuppage />} />
      <Route path="/Mobilefindaccount" element={<MobileFindAccountpage />} />
      <Route path="/Mobilepolicy" element={<MobilePolicypage />} />
      <Route path="/Mobilephone" element={<MobilePhonepage />} />
      <Route path="/Mobileregist" element={<MobileRegistpage />} />
      <Route path="/Mobileladylicense" element={<MobileLadyLicenseAuthpage />} />
      {/* 홍여사(일하는 사람) 등록 — 공급자 입구. 라우트가 없어 화면에 도달할 수 없었다 (2026-08-12) */}
      <Route path="/Mobileworkerregist" element={<MobileWorkerRegistpage />} />

      {/* ① 일 올리기 · 리스트 */}
      <Route path="/Mobilemain" element={<MobileMainpage />} />
      <Route path="/Mobileworkregister" element={<MobileWorkregistserpage />} />
      <Route path="/Mobilework" element={<MobileWorkpage />} />
      <Route path="/Mobilecontent" element={<MobileContentpage />} />

      {/* 찾기 */}
      <Route path="/Mobilemap" element={<MobileMappage />} />
      <Route path="/Mobilesearch" element={<MobileSearchpage />} />
      {/* 공지사항 (형 리뷰 2026-08-12) */}
      <Route path="/Mobilenotice" element={<MobileNoticepage />} />
      <Route path="/Mobilesearchhistory" element={<MobileSearchHistorypage />} />
      <Route path="/Mobilemapreconfig" element={<MobileMapReconfigpage />} />
      <Route path="/Mobilemappick" element={<MobileMapPickpage />} />

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
    </>
  );
}

export default App;
