// functions/worknet.js
// ─────────────────────────────────────────────
// Worknet 관련 스케줄 & 유틸 모음
// ─────────────────────────────────────────────

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const xml2js = require("xml-js");
const axios = require("axios");
const moment = require("moment-timezone");

try { admin.app(); } catch (_) { admin.initializeApp(); }

const db = admin.firestore();
const WORKNET_KEY = functions.config().worknet?.key || "";

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────

// JSON 객체에서 특정 키를 깊이 검색
function deepFindByKey(obj, key) {
    if (!obj || typeof obj !== "object") return null;
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
    for (const k of Object.keys(obj)) {
        const child = obj[k];
        if (typeof child === "object") {
            const res = deepFindByKey(child, key);
            if (res) return res;
        }
    }
    return null;
}

function stripTextValues(obj) {
    if (Array.isArray(obj)) return obj.map(stripTextValues);
    else if (typeof obj === "object" && obj !== null) {
        if (Object.keys(obj).length === 1 && obj._text !== undefined) {
            return obj._text;
        }
        const newObj = {};
        for (const key in obj) newObj[key] = stripTextValues(obj[key]);
        return newObj;
    }
    return obj;
}

async function fetchWorknetDetail(wantedAuthNo) {
    const url =
        `https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210D01.do?` +
        `authKey=${WORKNET_KEY}&callTp=D&returnType=XML&infoSvc=VALIDATION&wantedAuthNo=${encodeURIComponent(wantedAuthNo)}`;

    try {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Node Fetch)" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let xml = await res.text();
        xml = xml.replace(/^\uFEFF/, "").replace(/<script\/?>.*?<\/script>/gis, "");

        const json = JSON.parse(xml2js.xml2json(xml, { compact: true }));

        if (json?.wantedDtl) return stripTextValues(json.wantedDtl);
        if (json?.wantedRoot?.wantedDtl) return stripTextValues(json.wantedRoot.wantedDtl);
        if (json?.wantedRoot?.wantedDetail) return stripTextValues(json.wantedRoot.wantedDetail);

        const found = deepFindByKey(json, "wantedDtl") || deepFindByKey(json, "wantedDetail");
        if (found) return stripTextValues(found);

        functions.logger.warn(`[WORKNET][DETAIL] 구조 인식 실패: ${wantedAuthNo}`);
        return null;
    } catch (err) {
        functions.logger.warn(`[WORKNET][DETAIL] 예외: ${wantedAuthNo} / ${err.message}`);
        return null;
    }
}

// ─────────────────────────────────────────────
// Worknet 스케줄러: 목록 수집
// ─────────────────────────────────────────────
exports.scheduleWorknetJob = functions
    .runWith({ timeoutSeconds: 300, memory: "1GB" })
    .region("asia-northeast1")
    .pubsub.schedule("every 1 minutes")
    .timeZone("Asia/Seoul")
    .onRun(async () => {
        const metaRef = db.collection("CRAWL_META").doc("WORKNET");
        const metaSnap = await metaRef.get();
        const lastPage = metaSnap.exists ? metaSnap.data().LAST_PAGE_INDEX || 1 : 1;

        if (lastPage > 540) {
            functions.logger.info(`🛑 page ${lastPage} → 540 초과. 종료.`);
            return null;
        }

        const url = `https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L01.do?authKey=${WORKNET_KEY}&callTp=L&returnType=XML&startPage=${lastPage}&display=100`;
        functions.logger.info(`📡 [WORKNET] page ${lastPage} 요청 시작`);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const xml = await response.text();
            const data = JSON.parse(xml2js.xml2json(xml, { compact: true }));
            const items = data?.wantedRoot?.wanted;
            if (!items) {
                functions.logger.warn(`📭 page ${lastPage} → 데이터 없음`);
                await metaRef.set({ LAST_PAGE_INDEX: lastPage + 1 }, { merge: true });
                return null;
            }

            const jobs = Array.isArray(items) ? items : [items];
            let count = 0;

            for (const job of jobs) {
                const id = job?.wantedAuthNo?._text;
                if (!id) continue;

                const ref = db.collection("worknet_jobs").doc(id);
                const existing = await ref.get();
                if (existing.exists) continue;

                const cleanedJob = stripTextValues(job);
                const detailData = await fetchWorknetDetail(id);

                await ref.set({
                    ...cleanedJob,
                    details: detailData || {},
                });

                count++;
            }

            await metaRef.set({ LAST_PAGE_INDEX: lastPage + 1 }, { merge: true });
            functions.logger.info(`✅ page ${lastPage} 저장 완료 / ${count}건`);
        } catch (err) {
            functions.logger.error("❌ 워크넷 수집 실패:", err.message);
        }
        return null;
    });

// ─────────────────────────────────────────────
// 카테고리 분류 + 배치 처리
// ─────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
    government: ["정부", "지자체", "공공기관", "행정복지센터", "시청", "군청", "구청", "주민센터"],
    construction: ["건설", "토목", "시공", "현장직", "인부", "크레인", "타설", "비계", "전기공사", "용접", "조경"],
    education: ["교육", "강사", "강의", "학원", "교사", "교원"],
    healthcare: ["병원", "의원", "약국", "간호사", "간호조무사"],
    delivery: ["배달", "배송", "운전", "납품", "퀵서비스", "라이더", "택배", "운송"],
    // … (중략: 나머지 키워드도 그대로 붙여넣기)
};

function composeSearchText(data) {
    return [
        data?.title,
        data?.jobTitle,
        data?.company,
        data?.wantedTitle,
        data?.jobsNm,
        data?.details?.jobsNm,
        data?.details?.jobCont,
    ].filter(Boolean).join(" ").toLowerCase();
}

function pickAddress(data) {
    const candidates = [
        data?.basicAddr,
        data?.companyAddr,
        data?.workPlace,
        data?.workRegion,
        data?.details?.workRegion,
        data?.details?.workAddr,
    ].filter(Boolean).map(String);
    return { basic: (candidates[0] || "").trim() };
}

function classify(text) {
    for (const key of Object.keys(CATEGORY_KEYWORDS)) {
        const kws = CATEGORY_KEYWORDS[key];
        if (kws.find(k => text.includes(k.toLowerCase()))) return key;
    }
    return "NOSEARCH";
}

function hashDocId(id) {
    let h = 5381;
    for (let i = 0; i < id.length; i++) h = ((h << 5) + h) + id.charCodeAt(i);
    return h >>> 0;
}

function stateDocRef(shardIndex) {
    return db.collection("_meta").doc(`worknet_jobs_batch_S${shardIndex}`);
}

async function runBatchCoreShard(shardIndex, shardCount) {
    const BATCH_LIMIT = 50;
    const READ_PAGE_SIZE = 500;
    const MAX_PAGES = 10;

    const stateRef = stateDocRef(shardIndex);
    const stateSnap = await stateRef.get();
    let cursorId = stateSnap.exists ? stateSnap.get("lastDocId") : null;

    let processed = 0, pagesScanned = 0, lastSeenDoc = null;

    while (processed < BATCH_LIMIT && pagesScanned < MAX_PAGES) {
        let qry = db.collection("worknet_jobs").orderBy(admin.firestore.FieldPath.documentId());
        if (cursorId) {
            const curSnap = await db.collection("worknet_jobs").doc(cursorId).get();
            if (curSnap.exists) qry = qry.startAfter(curSnap);
        }

        const snap = await qry.limit(READ_PAGE_SIZE).get();
        if (snap.empty) break;

        pagesScanned++;
        lastSeenDoc = snap.docs[snap.docs.length - 1];

        for (const doc of snap.docs) {
            if (processed >= BATCH_LIMIT) break;
            const bucket = hashDocId(doc.id) % shardCount;
            if (bucket !== shardIndex) continue;

            const data = doc.data();
            if (data.workcategory) continue;

            const text = composeSearchText(data);
            const base = classify(text);

            await doc.ref.update({
                workcategory: base,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            processed++;
        }
        cursorId = lastSeenDoc.id;
    }

    if (lastSeenDoc) {
        await stateRef.set({ lastDocId: lastSeenDoc.id, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } else {
        await stateRef.set({ lastDocId: null, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    }

    functions.logger.info(`[Shard ${shardIndex}] processed=${processed}`);
    return processed;
}

// ─────────────────────────────────────────────
// 샤드별 스케줄 export
// ─────────────────────────────────────────────
for (let i = 0; i < 12; i++) {
    exports[`batchUpdateCategoriesS${i}`] = functions
        .pubsub.schedule("every 5 minutes")
        .timeZone("Asia/Seoul")
        .onRun(() => runBatchCoreShard(i, 12));
}
