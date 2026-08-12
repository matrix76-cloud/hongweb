// Local storage helpers for fortune profile (JS version)

const keyFor = (userId) => `fortune_profile_${userId || "anon"}`;

const safeParse = (s) => {
    if (!s) return null;
    try { return JSON.parse(s); } catch { return null; }
};

const isValidDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
const isValidTime = (t) => /^\d{2}:\d{2}$/.test(t);

/** 읽기 */
export function getFortuneProfile(userId) {
    try {
        return safeParse(localStorage.getItem(keyFor(userId)));
    } catch {
        return null;
    }
}

/** 저장 */
export function saveFortuneProfile(userId, p) {
    if (!p || !isValidDate(p.dob)) {
        throw new Error("Invalid dob format. Use YYYY-MM-DD.");
    }
    if (!p.unknownTime && (!p.time || !isValidTime(p.time))) {
        throw new Error("Invalid time format. Use HH:mm or set unknownTime=true.");
    }
    try {
        localStorage.setItem(keyFor(userId), JSON.stringify({
            dob: p.dob,
            time: p.unknownTime ? null : p.time,
            unknownTime: !!p.unknownTime,
            cal: p.cal === "lunar" ? "lunar" : "solar",
            tz: p.tz || "Asia/Seoul",
        }));
    } catch {
        // ignore write errors
    }
}

/** 삭제 */
export function clearFortuneProfile(userId) {
    try {
        localStorage.removeItem(keyFor(userId));
    } catch {
        // ignore
    }
}
