import localforage from "localforage";

// ✅ fallback 지원 함수
export const safeGetCouponHiddenUntil = async () => {
    try {
        const val = await localforage.getItem("0615coupon");
        return val || localStorage.getItem("0615coupon");
    } catch {
        return localStorage.getItem("0615coupon");
    }
};

export const safeSetCouponHiddenUntil = async (value) => {
    try {
        await localforage.setItem("0615coupon", value);
    } catch {
        localStorage.setItem("0615coupon", value);
    }
};