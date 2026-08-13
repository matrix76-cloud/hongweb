import localforage from "localforage";

/**
 * 로그인 안 된 사람을 어디로 보낼지 한 곳에서 정한다. (형 지시 2026-08-13)
 *
 *   온보딩 안 봤으면 → 온보딩
 *   봤으면          → 홈 (둘러보기)
 *
 * ★ 로그인 화면으로 밀어넣지 않는다. 동네에 일감이 있는지 먼저 보고 가입을 정하는
 *   서비스라, 보는 것까지는 열어둔다. 무언가 하려는 순간(등록·지원·채팅)에 로그인을 받는다.
 *   약관 동의는 가입을 시작할 때 로그인·가입 화면이 알아서 먼저 받는다.
 *
 * 예전에는 자리마다 제각각 /Mobilegate(옛 진입 화면)로 보내고 있었다.
 * 새 화면을 만들어도 옛 화면이 계속 튀어나오던 이유가 이것이다.
 *
 * 키는 MobileOnboardingcontainer 가 쓰는 값과 같아야 한다.
 */
const ONBOARDING_KEY = "onboarding.done";

export const ENTRY = {
  ONBOARDING: "/Mobileonboarding",
  HOME: "/Mobilemain",
  AGREE: "/Mobileagree",
  LOGIN: "/Mobilelogin",
};

export const resolveEntryRoute = async () => {
  try {
    const seen = (await localforage.getItem(ONBOARDING_KEY)) === true;
    return seen ? ENTRY.HOME : ENTRY.ONBOARDING;
  } catch {
    // 저장소를 못 읽으면 처음 온 사람으로 본다
    return ENTRY.ONBOARDING;
  }
};
