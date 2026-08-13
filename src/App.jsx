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
import MobileCallpage from "./page/main/MobileCallpage";
import MobileConfigContentpage from "./page/main/MobileConfigContentpage";
import MobileConfigpage from "./page/main/MobileConfigpage";
import MobileContentpage from "./page/main/MobileContentpage";
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
import MobileRegistpage from "./page/main/MobileRegistpage";
import MobileSearchHistorypage from "./page/main/MobileSearchHistorypage";
import MobileSearchpage from "./page/main/MobileSearchpage";
import MobileNoticepage from "./page/main/MobileNoticepage";
import MobileSplashpage from "./page/main/MobileSplashpage";
import MobileWorkpage from "./page/main/Mobileworkpage";
import MobileWorkregistserpage from "./page/main/MobileWorkregisterpage";

import ReviewPage from "./dev/ReviewPage";
import DesktopPromo from "./components/DesktopPromo";
import "./screen/css/desktop.css";
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

  /* PC 랜딩 + 폰 목업 (형 지시 2026-08-13, seekone 방식).
     리뷰페이지와 PC 전용 화면은 넓게 써야 하니 목업 밖에 그대로 둔다. */
  const path = (location.pathname || "").toLowerCase();
  const wideScreen = path.startsWith("/review") || path.startsWith("/pc");

  const PhoneShell = ({ children }) => (
    wideScreen ? children : (
      <>
        <div className="desktop-shell">
          {/* 랜딩은 shell 안에 있어야 grid-area(hdr·land)가 먹는다 (형 리뷰 2026-08-13) */}
          <DesktopPromo />
          <div className="phone-stage">
            <div className="app-frame" id="app-frame">
              {children}
            </div>
          </div>
        </div>
      </>
    )
  );

  return (
    <>
    {/* 화면을 보고 있을 때 오는 알림은 OS 가 안 띄운다 -> 상단에 직접 (형 지시 2026-08-12) */}
    <PushToast />

    <PhoneShell>
    <Routes>

      {/* PC 도 같은 모바일 화면을 쓴다 — 폰 목업 안에서 돈다 (형 지시 2026-08-13, seekone 방식).
          기존 PC 전용 화면들(/PCmain 등)은 주소로 들어가면 그대로 열린다. */}
      <Route path="/" element={<MobileSplashpage />} />

      {/* 가입 / 인증 — 옛 화면(게이트·전화번호 인증·구 약관)은 라우트에서 뺐다 (형 지시 2026-08-13).
          파일은 남겨뒀지만 아무 데서도 열리지 않는다. */}
      <Route path="/Mobileonboarding" element={<MobileOnboardingpage />} />
      {/* 가입 흐름: 온보딩 → 약관 동의 → 로그인/가입 (형 지시 2026-08-12) */}
      <Route path="/Mobileagree" element={<MobileAgreepage />} />
      <Route path="/Mobilelogin" element={<MobileLoginpage />} />
      <Route path="/Mobilesignup" element={<MobileSignuppage />} />
      <Route path="/Mobilefindaccount" element={<MobileFindAccountpage />} />
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
      {/* 보이스톡 — 인앱 배너[받기]와 OS 알림[탭] 이 모두 이 화면으로 들어온다 */}
      <Route path="/Mobilecall" element={<MobileCallpage />} />


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

      {/* 화면 리뷰 — 배포본에서도 연다. 폰으로 실물을 보며 메모를 남겨야 하기 때문 (2026-08-13).
          어디에도 링크하지 않는 숨은 경로이고, 저장은 Firestore(reviewThreads) 로 간다. */}
      <Route path="/review" element={<ReviewPage />} />

    </Routes>
    </PhoneShell>
    </>
  );
}

export default App;
