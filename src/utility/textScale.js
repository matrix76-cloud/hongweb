import localforage from "localforage";

/**
 * 글자 크기 — 작게 / 보통 / 크게 (형 지시 2026-08-19
 * "화면 뿐만 아니라 글자 보기를 세 단계로 나눠서 볼 수 있게")
 *
 * 화면 모드(밝게·어둡게)와 같은 방식으로 다룬다. html 의 font-size 를 바꾸고,
 * 화면들이 쓰는 px 값이 그대로라도 rem 로 잡힌 곳과 브라우저 기본 배율이 함께 움직인다.
 *
 * ※ 우리 화면 대부분은 px 로 적혀 있다. px 는 배율을 안 따라가므로
 *   html 에 data-textscale 을 붙이고, 그 값에 따라 화면 전체를 확대·축소한다.
 *   글자만 키우면 칸이 안 늘어나 글이 잘리는데, 이 방식은 여백까지 같이 늘어난다.
 */

export const TEXT_SCALE = {
  SMALL: 'small',
  NORMAL: 'normal',
  LARGE: 'large',
};

export const TEXT_SCALE_LABEL = {
  [TEXT_SCALE.SMALL]: '작게',
  [TEXT_SCALE.NORMAL]: '보통',
  [TEXT_SCALE.LARGE]: '크게',
};

const KEY = 'hong.textscale';

const isValid = (v) => v === TEXT_SCALE.SMALL || v === TEXT_SCALE.NORMAL || v === TEXT_SCALE.LARGE;

/** html 에 적용 */
export const applyTextScale = (scale) => {
  const real = isValid(scale) ? scale : TEXT_SCALE.NORMAL;
  document.documentElement.setAttribute('data-textscale', real);
  return real;
};

export const readTextScale = async () => {
  const v = await localforage.getItem(KEY).catch(() => null);
  return isValid(v) ? v : TEXT_SCALE.NORMAL;
};

export const saveTextScale = async (scale) => {
  await localforage.setItem(KEY, scale).catch(() => {});
  return applyTextScale(scale);
};

/** 앱이 뜰 때 한 번 부른다 */
export const initTextScale = async () => {
  const scale = await readTextScale();
  applyTextScale(scale);
  return scale;
};
