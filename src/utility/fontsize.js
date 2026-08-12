

// fontSize.js (웹 전용)
export const isIOS = () =>
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

export const getFontSize = (size) => {
    return isIOS() ? size + 1.5 : size;
};

export const getFontSizeEx = (size) => {
    return isIOS() ? size + 2.5 : size;
};

export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
};

export const isAndroid = () =>
    typeof navigator !== 'undefined' &&
    /Android/i.test(navigator.userAgent);

// 안드로이드 WebView에서는 safe-area-inset-top이 0이라 헤더가 작게 보임
// 안드로이드일 때 추가 패딩을 줘서 보정
export const HEADER_TOP_EXTRA = isAndroid() ? 14 : 0;