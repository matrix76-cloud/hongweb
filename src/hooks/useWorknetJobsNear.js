import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../api/config";
import { distanceFunc } from "../utility/region";

const kmToLat = (km) => km / 111.32;
const kmToLng = (km, lat) => km / (111.32 * Math.cos((lat * Math.PI) / 180));

/**
 * 워크넷 일자리 단발성 조회 훅 (페이지네이션 없음)
 * - Firestore: latitude로만 범위쿼리(+orderBy) → 나머지는 클라이언트 필터링
 * - 필요 로그: debug=true 로 켜기
 */
export default function useWorknetJobsNear({
    centerLat,
    centerLng,
    radiusKm = 3,
    catKey = null,
    keyword = "",
    pageLimit = 800,            // 너무 크면 줄이세요
    collectionName = "worknet_v2_jobs",
    debug = true,               // 로그 출력 스위치
    sampleLog = 10,             // 샘플 로깅 개수
} = {}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const kw = useMemo(() => (keyword || "").trim().toLowerCase(), [keyword]);

    const fetchOnce = useCallback(async () => {
        // 좌표 없으면 바로 종료
        if (typeof centerLat !== "number" || typeof centerLng !== "number") {
            debug && console.log("[useWorknetJobsNear] ❌ centerLat/centerLng 없음", { centerLat, centerLng });
            setItems([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1) BBox 계산
            const dLat = kmToLat(radiusKm);
            const dLng = kmToLng(radiusKm, centerLat);
            const minLat = centerLat - dLat;
            const maxLat = centerLat + dLat;
            const minLng = centerLng - dLng;
            const maxLng = centerLng + dLng;

            debug && console.log("[useWorknetJobsNear] ▶ 파라미터", { centerLat, centerLng, radiusKm, catKey, kw });
            debug && console.log("[useWorknetJobsNear] ▶ BBox", { minLat, maxLat, minLng, maxLng });

            // 2) Firestore 쿼리 (⚠️ latitude만 범위 + orderBy)
            const col = collection(db, collectionName);
            const q = query(
                col,
                where("latitude", ">=", minLat),
                where("latitude", "<=", maxLat),
                orderBy("latitude", "asc")
            );

            const snap = await getDocs(q);
            debug && console.log("[useWorknetJobsNear] ▶ 위도 박스 히트:", snap.size);

            // 3) 클라이언트 필터링(경도/거리/카테고리/키워드)
            let total = 0;
            let passLng = 0, passCircle = 0, passCat = 0, passKw = 0;
            let pushed = 0;

            const bucket = [];
            snap.forEach((doc) => {
                total++;
                const d = doc.data();

                // 좌표 파싱
                const lat = Number(d.latitude);
                const lng = Number(d.longitude);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

                // 경도 박스
                if (lng < minLng || lng > maxLng) return;
                passLng++;

                // 실제 원거리
                const km = distanceFunc(centerLat, centerLng, lat, lng);
                if (km > radiusKm) return;
                passCircle++;

                // 카테고리 필터
                const getCats = (d) =>
                    Array.isArray(d.workCategories)
                        ? d.workCategories
                        : (d.workcategory ? [d.workcategory] : []);

                if (catKey) {
                    const cats = getCats(d).map((s) => (s ?? "").toString().trim());
                    if (!cats.includes(catKey)) return;
                }
                passCat++;

                // 키워드 필터 (필요한 필드들을 모아서 검색)
                const text = [
                    d.wantedTitle, d.title, d.company, d.plbizNm, d.plDetAddr,
                    d.indTpNm, d.jobsNm, d.RECRUT_FIELD_NM, d.PBANC_CONT
                ].filter(Boolean).join(" ").toLowerCase();
                if (kw && !text.includes(kw)) return;
                passKw++;

                bucket.push({ id: doc.id, distanceKm: Number(km.toFixed(1)), ...d });
                pushed++;
            });

            // 거리순 정렬
            bucket.sort((a, b) => a.distanceKm - b.distanceKm);

            // (선택) 상한 제한
            const final = bucket.slice(0, pageLimit);

            // 로그
            // if (debug) {
            //     console.log("[useWorknetJobsNear] ▶ 필터링 통계", {
            //         totalDocsInLatBox: total,
            //         passLng,
            //         passCircle,
            //         passCat,
            //         passKw,
            //         finalCount: final.length,
            //     });
            //     final.slice(0, sampleLog).forEach((it, i) => {
            //         console.log(`  #${i + 1}`, {
            //             id: it.id,
            //             cat: it.workcategory,
            //             distanceKm: it.distanceKm,
            //             title: it.wantedTitle || it.title || it.jobsNm || it.RECRUT_FIELD_NM || it.company,
            //         });
            //     });
            // }

            setItems(final);
        } catch (e) {
            console.error("useWorknetJobsNear error", e);
            setError(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [centerLat, centerLng, radiusKm, catKey, kw, collectionName, debug, sampleLog, pageLimit]);

    // 의존성 바뀔 때마다 한 번만 가져오기
    useEffect(() => {
        fetchOnce();
    }, [fetchOnce]);

    // 외부에서 강제 재조회 필요 시 사용
    const refresh = useCallback(() => {
        fetchOnce();
    }, [fetchOnce]);

    return { items, loading, error, refresh };
}
