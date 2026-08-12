// src/hooks/useWorknetCountsNear.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../api/config";
import { DEFAULT_VISIBLE_KEYS } from "../utility/categories";
import { distanceFunc } from "../utility/region";

// 1도 ≈ 111.32km
const kmToLatDelta = (km) => km / 111.32;
const kmToLngDelta = (km, lat) => km / (111.32 * Math.cos((lat * Math.PI) / 180));

/**
 * 사용자 좌표 기준 반경 내 문서 집계 훅
 */
export function useWorknetCountsNear({
    userLat,
    userLng,
    keys = DEFAULT_VISIBLE_KEYS,
    radiusKm = 3,
    collectionName = "worknet_v2_jobs",
    categoryField = "workCategories",           // ✅ 기본: 배열 필드
    fallbackCategoryFields = ["workcategory"],   // ✅ 레거시 하위호환
    debug = false,
    sample = 20,
} = {}) {
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const keysMemo = useMemo(
        () => Array.from(new Set(keys)).filter(Boolean),
        [keys]
    );

    const fetchCounts = useCallback(async () => {
        const latNum = Number(userLat);
        const lngNum = Number(userLng);

        if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
            if (debug) {
                console.log("[countsNear] ❌ invalid user coords", {
                    userLat, userLng, typeofLat: typeof userLat, typeofLng: typeof userLng,
                });
            }
            setCounts({});
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const dLat = kmToLatDelta(radiusKm);
            const dLng = kmToLngDelta(radiusKm, latNum);
            const minLat = latNum - dLat;
            const maxLat = latNum + dLat;
            const minLng = lngNum - dLng;
            const maxLng = lngNum + dLng;

            const col = collection(db, collectionName);
            const qy = query(
                col,
                where("latitude", ">=", minLat),
                where("latitude", "<=", maxLat),
                where("longitude", ">=", minLng),
                where("longitude", "<=", maxLng)
            );

            const snap = await getDocs(qy);
            if (debug) console.log("[countsNear] ▶ docs in box:", snap.size);

            const next = {};
            for (const k of keysMemo) next[k] = 0;

            const norm = (s) => (s ?? "").toString().trim();
            const toArray = (v) =>
                Array.isArray(v) ? v : (v != null ? [v] : []);

            let total = 0, counted = 0, logged = 0;
            let skippedNoGeo = 0, skippedNoCat = 0, skippedNotKey = 0, skippedOutCircle = 0;

            snap.forEach((doc) => {
                total++;
                const d = doc.data();

                const lat = Number(d.latitude);
                const lng = Number(d.longitude);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                    skippedNoGeo++;
                    if (debug && logged < sample) console.log("❌ no/invalid geo", { id: doc.id, lat: d.latitude, lng: d.longitude });
                    return;
                }

                // ✅ 카테고리 배열 우선 + 하위호환
                let cats = toArray(d[categoryField]);
                if (cats.length === 0 && fallbackCategoryFields?.length) {
                    for (const f of fallbackCategoryFields) {
                        const cand = toArray(d[f]);
                        if (cand.length) { cats = cand; break; }
                    }
                }
                cats = cats.map(norm).filter(Boolean);

                if (cats.length === 0) {
                    skippedNoCat++;
                    if (debug && logged < sample) console.log("❌ no category", { id: doc.id });
                    return;
                }

                const km = distanceFunc(latNum, lngNum, lat, lng);
                if (!(km <= radiusKm)) {
                    skippedOutCircle++;
                    if (debug && logged < sample) console.log("❌ out of circle", { id: doc.id, km: Number(km.toFixed(2)) });
                    return;
                }

                // ✅ keys에 해당하는 것만 카운트 (문서 하나가 여러 키에 매칭되면 각각 +1)
                const matched = cats.filter((c) => Object.prototype.hasOwnProperty.call(next, c));
                if (matched.length === 0) {
                    skippedNotKey++;
                    if (debug && logged < sample) console.log("❌ key mismatch", { id: doc.id, cats, allowed: keysMemo });
                    return;
                }

                matched.forEach((c) => { next[c] += 1; counted++; });
                if (debug && logged < sample) {
                    console.log("✅ counted", {
                        id: doc.id, cats: matched, km: Number(km.toFixed(2)), lat, lng,
                    });
                    logged++;
                }
            });

            if (debug) {
                console.log("[countsNear] ▶ stats", {
                    total, counted, skippedNoGeo, skippedNoCat, skippedNotKey, skippedOutCircle,
                });
            }

            setCounts(next);
        } catch (e) {
            console.error("🔥 useWorknetCountsNear error:", e);
            setError(e);
            setCounts({});
        } finally {
            setLoading(false);
        }
    }, [userLat, userLng, radiusKm, keysMemo, collectionName, categoryField, fallbackCategoryFields, debug, sample]);

    useEffect(() => { fetchCounts(); }, [fetchCounts]);

    return { counts, loading, error, refresh: fetchCounts };
}
