// 📄 context/WorknetContext.js
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../api/config";
import { distanceFunc } from "../utility/region";

const Ctx = createContext(null);
export const useWorknet = () => useContext(Ctx);

// 1도 ≈ 111.32km
const kmToLat = (km) => km / 111.32;
const kmToLng = (km, lat) => km / (111.32 * Math.cos((lat * Math.PI) / 180));

/* ───────── regDt: 'YY-MM-DD' 전용 파서 ───────── */
function toMillisFromRegDt(regDt) {
    if (regDt == null) return null;
    const s = String(regDt).trim();

    // YY-MM-DD 또는 "YY-MM-DD HH:mm" / "YY-MM-DD HH:mm:ss"
    const m = s.match(/^(\d{2})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):?(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return null;

    const yy = +m[1];
    const y = yy >= 70 ? 1900 + yy : 2000 + yy; // 70~99는 1900s, 나머진 2000s
    const mo = +m[2], d = +m[3];
    const hh = +(m[4] ?? 0), mm = +(m[5] ?? 0), ss = +(m[6] ?? 0);

    const t = new Date(y, mo - 1, d, hh, mm, ss).getTime();
    return Number.isFinite(t) ? t : null;
}

function isTodayMs(ms) {
    if (!Number.isFinite(ms)) return false;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 오늘 00:00
    const next = new Date(start); next.setDate(start.getDate() + 1);         // 내일 00:00
    return ms >= start.getTime() && ms < next.getTime(); // [오늘 00:00, 내일 00:00)
}


export function WorknetProvider({
    centerLat,
    centerLng,
    radiusKm = 4,
    visibleKeys = [],
    collectionName = "worknet_v2_jobs",
    children,
}) {
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [counts, setCounts] = useState({});
    const [error, setError] = useState(null);

    const lastParamsRef = useRef({});

    async function fetchAll() {
        const lat = Number(centerLat);
        const lng = Number(centerLng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            setList([]); setCounts({}); setInitialized(true); setLoading(false);
            return;
        }

        setLoading(true); setError(null);

        try {
            // 1) BBox
            const dLat = kmToLat(radiusKm);
            const dLng = kmToLng(radiusKm, lat);
            const minLat = lat - dLat, maxLat = lat + dLat;
            const minLng = lng - dLng, maxLng = lng + dLng;

            // 2) Firestore 쿼리
            const qy = query(
                collection(db, collectionName),
                where("latitude", ">=", minLat),
                where("latitude", "<=", maxLat),
                where("longitude", ">=", minLng),
                where("longitude", "<=", maxLng),
                orderBy("latitude", "asc")
            );

            const snap = await getDocs(qy);

            const listNext = [];
            const countsNext = {};
            let totalToday = 0;

            snap.forEach((doc) => {
                const d = doc.data();

                console.log("[WRK] doc", doc.id, d);
                const lat2 = Number(d.latitude), lng2 = Number(d.longitude);
                if (!Number.isFinite(lat2) || !Number.isFinite(lng2)) return;

                const dist = distanceFunc(lat, lng, lat2, lng2);
                if (dist > radiusKm) return;

                // 등록일
                const postedMs = toMillisFromRegDt(d.regDt);
                const isNewToday = isTodayMs(postedMs);

                listNext.push({
                    id: doc.id,
                    distanceKm: Number(dist.toFixed(1)),
                    isNewToday,
                    ...d,
                });


                // 카테고리 정규화(소문자 고정)
                const categories = Array.isArray(d.workCategories)
                    ? d.workCategories.map(s => (s ?? "").toString().trim().toLowerCase()).filter(Boolean)
                    : [(d.workcategory ?? "").toString().trim().toLowerCase()].filter(Boolean);

                // 집계
                categories.forEach((cat) => {
                    if (!cat) return;
                    countsNext[cat] = (countsNext[cat] || 0) + 1;
                    if (isNewToday) {
                        const todayKey = `${cat}_today`;
                        countsNext[todayKey] = (countsNext[todayKey] || 0) + 1;
                    }
                });

                if (isNewToday) totalToday += 1;
            });

            // 거리순 정렬
            listNext.sort((a, b) => a.distanceKm - b.distanceKm);

            // 전체 today 합산
            countsNext.newcount = totalToday;

            console.log("[WRK] countsNext result:", countsNext);

            setList(listNext);
            setCounts(countsNext);
            setInitialized(true);
        } catch (e) {
            console.error("[WRK] fetchAll error", e);
            setError(e);
            setList([]); setCounts({}); setInitialized(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const now = { centerLat, centerLng, radiusKm, visibleKeys: JSON.stringify(visibleKeys) };
        const last = lastParamsRef.current;
        const changed =
            now.centerLat !== last.centerLat ||
            now.centerLng !== last.centerLng ||
            now.radiusKm !== last.radiusKm ||
            now.visibleKeys !== last.visibleKeys;

        if (changed) {
            lastParamsRef.current = now;
            fetchAll();
        }
    }, [centerLat, centerLng, radiusKm, JSON.stringify(visibleKeys)]);

    const value = useMemo(() => ({
        initialized,
        loading,
        list,
        counts,
        error,
        refresh: fetchAll,
    }), [initialized, loading, list, counts, error]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
