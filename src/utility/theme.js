import localforage from "localforage";

/**
 * 화면 모드 — 밝게 / 어둡게 / 기기 설정 따름 (형 요청 2026-08-13).
 *
 * 색을 CSS 변수로 빼두고 html 에 data-theme 을 붙여 통째로 바꾼다.
 * 컴포넌트는 var(--...) 만 쓰면 되고, 브랜드 주황은 두 모드에서 같다.
 */

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const THEME_LABEL = {
  [THEME.LIGHT]: '밝게',
  [THEME.DARK]: '어둡게',
  [THEME.SYSTEM]: '기기 설정 따름',
};

const KEY = 'hong.theme';

/** 기기가 어두운 화면을 쓰고 있는지 */
const systemPrefersDark = () => {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
};

/** 고른 값 -> 실제로 칠할 모드 */
export const resolveTheme = (mode) =>
  mode === THEME.SYSTEM ? (systemPrefersDark() ? THEME.DARK : THEME.LIGHT) : mode;

/** html 에 적용 */
export const applyTheme = (mode) => {
  const real = resolveTheme(mode || THEME.LIGHT);
  document.documentElement.setAttribute('data-theme', real);
  return real;
};

export const readThemeMode = async () => {
  const v = await localforage.getItem(KEY).catch(() => null);
  return v === THEME.DARK || v === THEME.SYSTEM ? v : THEME.LIGHT;
};

export const saveThemeMode = async (mode) => {
  await localforage.setItem(KEY, mode).catch(() => {});
  return applyTheme(mode);
};

/**
 * 앱이 뜰 때 한 번 부른다.
 * 기기 설정을 따르는 중이면, 기기에서 모드를 바꿨을 때 화면도 같이 따라가게 붙여둔다.
 */
export const initTheme = async () => {
  const mode = await readThemeMode();
  applyTheme(mode);
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = async () => {
      if ((await readThemeMode()) === THEME.SYSTEM) applyTheme(THEME.SYSTEM);
    };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
  } catch (e) { /* 지원 안 하는 브라우저는 그냥 둔다 */ }
  return mode;
};
