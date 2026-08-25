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
import PushBanner from "./components/PushBanner";
import OnboardLab from "./dev/OnboardLab";

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
import MobilePhoneVerifypage from "./page/main/MobilePhoneVerifypage";
import MobileFindAccountpage from "./page/main/MobileFindAccountpage";
import MobileLoginpage from "./page/main/MobileLoginpage";
import MobileOnboardingpage from "./page/main/MobileOnboardingpage";
import MobileMapPickpage from "./page/main/MobileMapPickpage";
import MobileMapReconfigpage from "./page/main/MobileMapReconfigpage";
import MobileMappage from "./page/main/Mobilemappage";
import MobileRegistpage from "./page/main/MobileRegistpage";
import MobileSearchHistorypage from "./page/main/MobileSearchHistorypage";
import MobileWorkerspage from "./page/main/MobileWorkerspage";
import MobileSearchpage from "./page/main/MobileSearchpage";
import MobileNoticepage from "./page/main/MobileNoticepage";
import MobilePaypage from "./page/main/MobilePaypage";
import { MobilePaySuccesspage, MobilePayFailpage } from "./page/main/MobilePayResultpage";
import MobileSplashpage from "./page/main/MobileSplashpage";
import MobileWorkpage from "./page/main/Mobileworkpage";
import MobileWorkregistserpage from "./page/main/MobileWorkregisterpage";

import ReviewPage from "./dev/ReviewPage";
import IconLab from "./dev/IconLab";
import SoundLab from "./dev/SoundLab";
import ListLab from "./dev/ListLab";
import BannerLab from "./dev/BannerLab";
import StatLab from "./dev/StatLab";
import MapLab from "./dev/MapLab";
import GridLab from "./dev/GridLab";
import AgreeLab from "./dev/AgreeLab";
import StripLab from "./dev/StripLab";
import DesktopPromo from "./components/DesktopPromo";
import "./screen/css/desktop.css";
import PushToast from "./components/PushToast";
import PcOnlyNotice from "./components/PcOnlyNotice";
import { isDesktopBrowser } from "./utility/device";

import { Provider as MyProvider, useDispatch } from 'react-redux';
import localforage from 'localforage';
import { ALLWORK } from "./store/menu/MenuSlice";
import { APP_TO_WEB, isInApp, listenApp, rememberAppAbilities, saveAppPushToken, sendToApp, setAppMainScreen } from "./service/appBridge";
import { coordToAddress } from "./utility/geocode";

/* 폰 목업 껍데기 (PC 랜딩 + 가운데 폰 화면).
 *
 * ★ 이 컴포넌트는 반드시 App 밖에 있어야 한다.
 *   App 안에 선언하면 App 이 다시 그려질 때마다 새로운 컴포넌트 타입이 되어,
 *   리액트가 <Routes> 아래를 통째로 버리고 새로 만든다. 그러면 스플래시가
 *   위치를 잡아 dispatch 하는 순간 자기 자신이 재생성되어 처음부터 다시 시작하고,
 *   그게 끝없이 반복된다 — 앱(WebView)에서 스플래시가 안 넘어가던 원인. (2026-08-18)
 */
const PhoneShell = ({ wide, children }) => (
  wide ? children : (
    <div className="desktop-shell">
      {/* 랜딩은 shell 안에 있어야 grid-area(hdr·land)가 먹는다 (형 리뷰 2026-08-13) */}
      <DesktopPromo />
      <div className="phone-stage">
        <div className="app-frame" id="app-frame">
          {children}
        </div>
      </div>
    </div>
  )
);

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
        // 이 앱이 직접 할 수 있는 일(네이티브 소셜 로그인 등)을 기억해둔다
        rememberAppAbilities(data);
        if (data.token && user?.users_id) {
          await saveAppPushToken({ USERS_ID: user.users_id, token: data.token, platform: data.platform });
        }
        if (data.latitude && data.longitude) {
          user.latitude = Number(data.latitude);
          user.longitude = Number(data.longitude);

          /* 앱이 준 좌표가 진짜 현재 위치다. 지역 이름도 여기에 맞춰 다시 적는다.
             예전에는 좌표만 바꾸고 이름은 그대로여서, 스플래시가 기본 좌표로 넘어간 날은
             화면 위에 엉뚱한 동네가 계속 떠 있었다. (형 지적 2026-08-18) */
          const addr = await coordToAddress(user.latitude, user.longitude);
          if (addr) user.address_name = addr;

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
  const wideScreen = path.startsWith("/review") || path.startsWith("/pc") || path.startsWith("/iconlab") || path.startsWith("/soundlab") || path.startsWith("/listlab") || path.startsWith("/bannerlab") || path.startsWith("/onboardlab") || path.startsWith("/statlab") || path.startsWith("/maplab") || path.startsWith("/gridlab") || path.startsWith("/agreelab") || path.startsWith("/striplab");

  /* PC 는 지원하지 않는다 — 첫 주소로 들어오면 "휴대폰에서 열어주세요" 만 보여준다.
     (형 지시 2026-08-21 "루트로 들어갔을 때만 · 리뷰페이지는 지원하고")

     첫 주소에서만 막는 이유: 앱(WebView)·리뷰 페이지 미리보기도 첫 주소로 들어오는데
     그쪽은 isDesktopBrowser 가 걸러낸다. 다른 주소로 직접 들어온 화면은 건드리지 않는다. */
  const pcOnly = path === "/" && isDesktopBrowser();

  return (
    <>
    {/* 화면을 보고 있을 때 오는 알림은 OS 가 안 띄운다 -> 상단에 직접 (형 지시 2026-08-12) */}
    <PushToast />

    <PhoneShell wide={wideScreen || pcOnly}>
    {/* 앱 안에서 알림이 왔을 때 위에서 내려오는 배너 — 앱 밖(브라우저)에선 아무것도 안 그린다 (2026-08-22) */}
    <PushBanner />
    <Routes>

      {/* PC 도 같은 모바일 화면을 쓴다 — 폰 목업 안에서 돈다 (형 지시 2026-08-13, seekone 방식).
          기존 PC 전용 화면들(/PCmain 등)은 주소로 들어가면 그대로 열린다. */}
      <Route path="/" element={pcOnly ? <PcOnlyNotice /> : <MobileSplashpage />} />

      {/* 마켓에 이미 올라간 앱은 웹뷰 주소가 help-4902e.web.app/mobile 로 박혀 있다.
          그 앱들은 다시 올리기 전까지 이 주소로만 들어오는데 여기 라우트가 없어서 빈 화면이 떴다.
          앱을 새로 올리지 않고 지금 쓰는 분들이 바로 되게 웹이 이 주소를 받아준다 (형 지시 2026-08-16). */}
      <Route path="/mobile" element={<MobileSplashpage />} />
      <Route path="/mobile/*" element={<MobileSplashpage />} />

      {/* 가입 / 인증 — 옛 화면(게이트·전화번호 인증·구 약관)은 라우트에서 뺐다 (형 지시 2026-08-13).
          파일은 남겨뒀지만 아무 데서도 열리지 않는다. */}
      <Route path="/Mobileonboarding" element={<MobileOnboardingpage />} />
      {/* 가입 흐름: 온보딩 → 약관 동의 → 로그인/가입 (형 지시 2026-08-12) */}
      <Route path="/Mobileagree" element={<MobileAgreepage />} />
      <Route path="/Mobilelogin" element={<MobileLoginpage />} />
      <Route path="/Mobilesignup" element={<MobileSignuppage />} />
      <Route path="/Mobilephoneverify" element={<MobilePhoneVerifypage />} />
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
      {/* 결제 (형 지시 2026-08-20 — 토스페이먼츠) */}
      <Route path="/Mobilepay" element={<MobilePaypage />} />
      <Route path="/Mobilepaysuccess" element={<MobilePaySuccesspage />} />
      <Route path="/Mobilepayfail" element={<MobilePayFailpage />} />

      <Route path="/Mobilenotice" element={<MobileNoticepage />} />
      <Route path="/Mobilesearchhistory" element={<MobileSearchHistorypage />} />
      {/* 활동 중인 홍여사 목록 — 홈 요약 칸에서 들어온다 (형 지시 2026-08-23) */}
      <Route path="/Mobileworkers" element={<MobileWorkerspage />} />
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

      {/* 홈 아이콘 색 조합 시안 — 형이 케이스를 고르는 임시 페이지 (2026-08-15) */}
      <Route path="/iconlab" element={<IconLab />} />
      <Route path="/soundlab" element={<SoundLab />} />

      {/* 일감 리스트 카드/테이블 시안 — 형이 표현 방식을 고르는 임시 페이지 (2026-08-15) */}
      <Route path="/listlab" element={<ListLab />} />

      {/* 홈 상단 홍보 배너 시안 — 형이 안을 고르는 임시 페이지 (2026-08-16) */}
      <Route path="/bannerlab" element={<BannerLab />} />
      <Route path="/onboardlab" element={<OnboardLab />} />
      <Route path="/statlab" element={<StatLab />} />
      <Route path="/maplab" element={<MapLab />} />
      <Route path="/gridlab" element={<GridLab />} />
      {/* 약관 동의 화면 시안 — 형이 번호로 고르는 임시 페이지 (2026-08-23) */}
      <Route path="/agreelab" element={<AgreeLab />} />
      {/* 홈 상단 소개 배너 시안 (2026-08-23) */}
      <Route path="/striplab" element={<StripLab />} />

    </Routes>
    </PhoneShell>
    </>
  );
}

export default App;
