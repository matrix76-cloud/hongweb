// functions/worknetV2.js
// Node 18+
// 의존성: xml-js, axios
// npm install xml-js axios

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { xml2json } = require("xml-js");
const axios = require("axios");
const { onRequest } = require("firebase-functions/v2/https");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

/* ──────────────────────────────────────────────────────────────
 * 설정
 * ────────────────────────────────────────────────────────────── */
const WORKNET_KEY = process.env.WORKNET_KEY || functions.config().worknet?.key;

const CONFIG = {
    SCHEDULE_CRON: "every 1 hours",
    REGION: "asia-northeast1",
    TIMEZONE: "Asia/Seoul",
    TIMEOUT: 300,
    HARD_DEADLINE_MS: 240_000,

    DISPLAY: 100,            // Work24 페이지 크기
    FETCH_PAGES_MAX: 4,      // 한 런에 4페이지(=최대 400건만 확인)
    UPSERT_MAX: 300,         // 실행당 신규 저장 상한
    GEOCODE_MAX: 30,         // 실행당 지오코딩 상한 (센트로이드는 제한 없음)
};

const INITIAL_BACKFILL = false; // 초기 적재 중 true, 끝나면 false

const COL = {
    JOBS: "worknet_v2_jobs",
    META: "_meta",
    STATE_DOC: "worknet_v2_state",
    LOGS_DOC: "worknet_v2_logs",
};

const GEO = {
    DONG: "geo_dong_centroids",       // docId: "시도|시군구|동"
    SIGUNGU: "geo_sigungu_centroids", // docId: "시도|시군구"
};

/* ──────────────────────────────────────────────────────────────
 * 상태/로그
 * ────────────────────────────────────────────────────────────── */
async function readState() {
    const ref = db.collection(COL.META).doc(COL.STATE_DOC);
    const snap = await ref.get();
    return snap.exists ? snap.data() : {};
}
async function writeState(patch) {
    const ref = db.collection(COL.META).doc(COL.STATE_DOC);
    await ref.set(
        { updatedAt: admin.firestore.FieldValue.serverTimestamp(), ...patch },
        { merge: true }
    );
}
function yyyyMMddKST() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}${m}${day}`;
}
async function writeRunLog(runId, summary) {
    const ref = db
        .collection(COL.META)
        .doc(COL.LOGS_DOC)
        .collection(yyyyMMddKST())
        .doc(runId);
    await ref.set(summary, { merge: true });
}

// 단일 라인 JSON 지오 소스 로그
function logGeoSource(payload = {}) {
    try {
        functions.logger.info(`[geo] ${JSON.stringify(payload)}`);
    } catch (e) {
        functions.logger.warn(`[geo] log failed: ${e?.message}`);
    }
}

/* ──────────────────────────────────────────────────────────────
 * 유틸
 * ────────────────────────────────────────────────────────────── */
function stripTextValues(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(stripTextValues);
    const out = {};
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v && typeof v === "object" && "_text" in v) out[k] = v._text;
        else out[k] = stripTextValues(v);
    }
    return out;
}

function deepFindByKey(obj, targetKey) {
    if (!obj || typeof obj !== "object") return null;
    if (Object.prototype.hasOwnProperty.call(obj, targetKey)) return obj[targetKey];
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v && typeof v === "object") {
            const found = deepFindByKey(v, targetKey);
            if (found) return found;
        }
    }
    return null;
}

function hash(str = "") {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
    return (h >>> 0).toString(36);
}
function buildSignature(obj) {
    const base = [
        obj?.wantedTitle || obj?.title,
        obj?.company,
        obj?.basicAddr || obj?.workRegion || obj?.region,
        obj?.closeDt,
        obj?.empTpCd, obj?.jobsCd, obj?.salTpNm, obj?.sal,
    ].map(v => (v ?? "") + "").join("|");
    return hash(base);
}

/* ──────────────────────────────────────────────────────────────
 * 카테고리(형이 준 풀버전 그대로)
 * ────────────────────────────────────────────────────────────── */
const CATEGORY_KEYWORDS = {
    government: ["정부", "지자체", "공공기관", "행정복지센터", "시청", "군청", "구청", "주민센터"],
    construction: ["건설", "토목", "시공", "현장직", "인부", "크레인", "타설", "비계", "전기공사", "용접", "조경"],
    education: ["교육", "강사", "강의", "학원", "교사", "교원", "강의보조", "튜터", "멘토", "선생"],
    healthcare: ["병원", "의원", "약국", "간호사", "간호조무사", "의료", "진료", "응급", "물리치료", "한의원", "병동", "치과"],
    social_worker: ["사회복지", "복지관", "복지센터", "사회복지사", "상담사", "케어매니저", "데이케어", "재가"],
    caregiver: ["요양", "요양보호사", "돌봄", "간병", "재가요양", "방문요양", "노인요양", "할머니", "할아버지", "노인", "어르신"],
    it_developer: ["it", "프로그래머", "프론트엔드", "백엔드", "웹개발", "앱개발", "소프트웨어"],
    delivery: ["배달", "배송", "운전", "납품", "퀵서비스", "라이더", "택배", "운송", "드라이버", "물류", "물류관리", "물류센터", "쿠팡", "현장운영", "필드어드민", "헬퍼리더", "cls"],
    sales: ["영업", "세일즈", "영업사원", "영업관리", "판매", "영업지원", "딜러"],
    disability_friendly: ["장애인", "장애우", "장애", "장애인우대", "장애인채용"],
    food_service: ["요식", "외식", "카페", "레스토랑", "패스트푸드", "주방보조", "조리사", "홀서빙", "주방장"],
    tourism: ["관광", "여행", "가이드", "안내원", "서비스직", "호텔리어", "레저", "리조트"],
    agriculture: ["농업", "농장", "축사", "수확", "농작물", "사육", "재배", "농촌"],
    cleaning: ["환경", "청소", "미화", "시설관리", "환경미화원", "클리닝", "청소원", "설비", "유지보수", "보수", "교대기사", "입주청소", "이사청소", "방역", "가사도우미", "홈클리닝", "집청소"],
    parking: ["검침", "주차", "주차관리", "주차요원", "주차도우미", "주차안내", "계량"],
    ceremony: ["결혼", "웨딩", "장례", "의전", "혼례", "예식", "장례식장", "장례도우미"],
    security: ["경비", "경비원", "보안요원", "시설경비", "보안경비", "경비실", "수위", "행사보안", "경호"],
    pet_service: ["애견", "반려견", "반려동물", "펫", "애완견", "펫샵", "동물병원", "애견미용"],
    childcare: ["돌봄", "아이돌봄", "보육", "보육교사", "유치원", "어린이집", "방문돌봄", "아동"],
    restaurant: ["식당", "서빙", "홀서빙", "주방", "주방보조", "조리", "캐셔", "구내식당", "조리원", "찬모", "급식"],
    lodging: ["숙박", "여관", "호텔", "모텔", "펜션", "리조트", "프론트", "하우스키핑", "룸메이드", "객실", "하우스메이드"],
    chef: ["주방장", "셰프", "조리장", "키친", "조리사", "요리사"],
    accounting: ["세무", "회계", "기장", "경리", "전산회계", "세무법인", "세무사사무실"],
    marketing: ["마케팅", "ae", "바이럴", "제안서", "기획서"],
    customer_service: ["cs", "고객센터", "상담원", "콜센터", "전화"],
    fashion_design: ["의류", "패션", "디자이너", "컨템포러리", "패턴", "봉제"],
    sports_leisure: ["골프", "파크골프", "스크린골프", "골프장", "클럽하우스", "스포츠"],
    legal_admin: ["행정사", "민원", "사무장"],
    office_admin: ["사무", "사무직", "일반사무", "총무", "행정", "문서", "사무보조", "OA", "엑셀", "더존", "경영지원", "관리사무", "사무원", "행정업무"],
    manufacturing: [
        "생산", "제조", "조립", "라인", "공정", "공장", "생산직",
        "제조업", "기계조립", "전자조립", "자동차부품", "사출", "프레스",
        "금형", "용접", "주조", "검사원", "포장", "식품가공", "식품제조"
    ],
};
function composeSearchText(data) {
    return [
        data?.details?.wantedInfo?.jobCont,
        data?.details?.corpInfo?.busiCont
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}
function scoreCategories(textLower) {
    const scores = {}, reasons = {};
    for (const cat of Object.keys(CATEGORY_KEYWORDS)) {
        let s = 0;
        for (const kw of CATEGORY_KEYWORDS[cat]) {
            if (textLower.includes(String(kw).toLowerCase())) {
                s++;
                (reasons[cat] ||= []).push(`kw:${kw}`);
            }
        }
        if (s > 0) scores[cat] = s;
    }
    const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    return { ranked, reasons };
}

/* ──────────────────────────────────────────────────────────────
 * 주소/지오코딩 (basicAddr만 사용)
 * ────────────────────────────────────────────────────────────── */
const getGeoFromAddress = async (address) => {
    try {
        const key = "AIzaSyCLHECQRnVwQCq3HFj35OQxa5JXjBAs-8Q"; // 형이 쓰던 키
        if (!key) { functions.logger.warn("GOOGLE_MAPS_KEY 미설정"); return null; }
        const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: { address, key }
        });
        const result = res.data.results?.[0];
        if (!result) {
            functions.logger.info(`📭 주소 결과 없음: ${address}`);
            return null;
        }
        const geo = { lat: result.geometry.location.lat, lng: result.geometry.location.lng };
        return geo;
    } catch (e) {
        functions.logger.error("❌ 구글 주소 변환 실패:", e?.response?.data || e.message);
        return null;
    }
};
async function geocodeAddress(addrBasic) {
    if (!addrBasic) return null;
    const geo = await getGeoFromAddress(addrBasic);
    if (geo) return { lat: geo.lat, lng: geo.lng, geoReason: "geocoding_api" };
    return null;
}

/* ──────────────────────────────────────────────────────────────
 * 센트로이드 조회 유틸
 * ────────────────────────────────────────────────────────────── */
function normalizeAdminSuffix(s) {
    if (!s) return "";
    return String(s).trim()
        .replace(/^서울시$/, "서울특별시")
        .replace(/^부산시$/, "부산광역시")
        .replace(/^대구시$/, "대구광역시")
        .replace(/^인천시$/, "인천광역시")
        .replace(/^광주시$/, "광주광역시")
        .replace(/^대전시$/, "대전광역시")
        .replace(/^울산시$/, "울산광역시")
        .replace(/^세종시$/, "세종특별자치시")
        .replace(/^경기$/, "경기도")
        .replace(/^강원도?$/, "강원도")
        .replace(/^충북$/, "충청북도")
        .replace(/^충남$/, "충청남도")
        .replace(/^전북$/, "전라북도")
        .replace(/^전남$/, "전라남도")
        .replace(/^경북$/, "경상북도")
        .replace(/^경남$/, "경상남도")
        .replace(/^제주도?$/, "제주특별자치도");
}
function normalizeParts({ sido, sigungu, dong, basicAddr }) {
    let S = normalizeAdminSuffix(sido || "");
    let G = (sigungu || "").trim();
    let D = (dong || "").trim();
    return { sido: S, sigungu: G, dong: D, keyDong: `${S}|${G}|${D}`, keySigungu: `${S}|${G}` };
}
async function lookupDongCentroid(sido, sigungu, dong) {
    if (!sido || !sigungu || !dong) return null;
    const id = `${sido}|${sigungu}|${dong}`;
    const snap = await db.collection(GEO.DONG).doc(id).get();
    if (!snap.exists) return null;
    const { lat, lng } = snap.data() || {};
    if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
    return null;
}
async function lookupSigunguCentroid(sido, sigungu) {
    if (!sido || !sigungu) return null;
    const id = `${sido}|${sigungu}`;
    const snap = await db.collection(GEO.SIGUNGU).doc(id).get();
    if (!snap.exists) return null;
    const { lat, lng } = snap.data() || {};
    if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
    return null;
}

/* ──────────────────────────────────────────────────────────────
 * Work24 API
 * ────────────────────────────────────────────────────────────── */
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

async function fetchWorknetDetail(wantedAuthNo) {
    const url =
        `https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210D01.do?` +
        `authKey=${WORKNET_KEY}&callTp=D&returnType=XML&infoSvc=VALIDATION&wantedAuthNo=${encodeURIComponent(wantedAuthNo)}`;

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Node Fetch)" }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let xml = await res.text();
        xml = xml.replace(/^\uFEFF/, "").replace(/<script\/?>.*?<\/script>/gis, "");

        const json = JSON.parse(xml2json(xml, { compact: true }));

        if (json?.wantedDtl) return stripTextValues(json.wantedDtl);
        if (json?.wantedRoot?.wantedDtl) return stripTextValues(json.wantedRoot.wantedDtl);
        if (json?.wantedRoot?.wantedDetail) return stripTextValues(json.wantedRoot.wantedDetail);

        const found = deepFindByKey(json, "wantedDtl") || deepFindByKey(json, "wantedDetail");
        if (found) return stripTextValues(found);

        functions.logger.warn(`[WORKNET][DETAIL] 구조 인식 실패: ${wantedAuthNo} / xml head: ${xml.slice(0, 200)}`);
        return null;
    } catch (err) {
        functions.logger.warn(`[WORKNET][DETAIL] 예외: ${wantedAuthNo} / ${err.message}`);
        return null;
    }
}

async function callWorknetList(page, display) {
    const url = `https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L01.do?authKey=${WORKNET_KEY}&callTp=L&returnType=XML&startPage=${page}&display=${display}&sortOrderBy=DESC`;
    functions.logger.info(`[LIST] page=${page} 요청`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`LIST HTTP ${res.status}`);
    const xml = await res.text();
    const json = JSON.parse(xml2json(xml, { compact: true }));
    const items = json?.wantedRoot?.wanted;
    const arr = items ? (Array.isArray(items) ? items : [items]).map(stripTextValues) : [];
    functions.logger.info(`[LIST] page=${page} 수신 ${arr.length}건`);
    return arr;
}

/* ──────────────────────────────────────────────────────────────
 * 문서 생성: 원본 그대로 + 보강 필드만 추가
 * ────────────────────────────────────────────────────────────── */
async function buildDocData(item, opts = { wantGeocode: true, geocodeCount: 0 }) {
    const id = item.wantedAuthNo;
    const smodStr = item.smodifyDtm || null;

    // 상세는 항상 호출
    let details = null;
    try {
        details = await fetchWorknetDetail(id);
    } catch (e) {
        functions.logger.warn(`DETAIL 실패: ${id} ${e?.message || e}`);
    }

    // 원본 그대로 + 보강 필드
    const base = {
        ...item,
        ...(details ? { details } : {}),
        lastModifiedAtForWorknet: smodStr,
        status: isClosedByDate(item.closeDt) ? "CLOSE" : "OPEN",
        sig: buildSignature(item),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 카테고리
    const text = composeSearchText({ ...item, details });
    const { ranked, reasons } = scoreCategories(text);
    base.primaryCategory = ranked[0] || null;
    base.workCategories = ranked.slice(0, 3);
    base.categoryReasons = base.workCategories.flatMap(c => reasons[c] || []);

    // ★ 좌표 부여: 센트로이드 → 구 폴백 → (상한 내) 지오코딩
    const addrBasic = (item.basicAddr || "").toString().trim();
    base.basicAddr = addrBasic; // 원문 주소 보존

    // 형이 말한 "주소 3단 분리값"이 item에 있다고 가정 (없으면 빈값)
    const parts = normalizeParts({
        sido: item.sido || item.siDo || item.workRegionSido,
        sigungu: item.sigungu || item.siGunGu || item.workRegionGu,
        dong: item.dong || item.dongName || item.workRegionDong,
        basicAddr: addrBasic
    });

    let loc = null, source = "none", level = "none";

    // 1) 동 센트로이드
    if (parts.sido && parts.sigungu && parts.dong) {
        const c = await lookupDongCentroid(parts.sido, parts.sigungu, parts.dong);
        if (c) { loc = c; source = "dong_centroid"; level = "dong"; }
    }
    // 2) 구 센트로이드
    if (!loc && parts.sido && parts.sigungu) {
        const c = await lookupSigunguCentroid(parts.sido, parts.sigungu);
        if (c) { loc = c; source = "sigungu_centroid"; level = "sigungu"; }
    }
    // 3) 지오코딩(상한)
    if (!loc && opts.wantGeocode && opts.geocodeCount < CONFIG.GEOCODE_MAX && addrBasic) {
        const geo = await geocodeAddress(addrBasic);
        if (geo) { loc = { lat: geo.lat, lng: geo.lng }; source = "geocoding_api"; level = "geocoded"; }
    }

    if (loc) {
        base.latitude = loc.lat;
        base.longitude = loc.lng;
        base.geoReason = source; // "dong_centroid" | "sigungu_centroid" | "geocoding_api"
        logGeoSource({
            source,
            jobId: id,
            addr: addrBasic,
            sido: parts.sido,
            sigungu: parts.sigungu,
            dong: parts.dong,
            level,
            lat: loc.lat,
            lng: loc.lng,
            cacheHit: source !== "geocoding_api"
        });
        functions.logger.info(`✅ 좌표 부여(${source}): ${id} ${parts.keyDong} -> (${loc.lat}, ${loc.lng})`);
    } else {
        base.geoReason = "none";
        logGeoSource({
            source: "none",
            jobId: id,
            addr: addrBasic,
            sido: parts.sido,
            sigungu: parts.sigungu,
            dong: parts.dong,
            level: "none",
            cacheHit: false
        });
        functions.logger.info(`📭 좌표 부여 실패: ${id} ${parts.keyDong}`);
    }

    return base;
}

function isClosedByDate(closeDtStr) {
    if (!closeDtStr) return false;
    if (/채용시까지|채용 시까지/i.test(closeDtStr)) return false;
    const d = new Date(closeDtStr.replace("T", " "));
    if (isNaN(d.getTime())) return false;
    return d.getTime() < Date.now();
}

/* ──────────────────────────────────────────────────────────────
 * 메인 파이프라인
 * ────────────────────────────────────────────────────────────── */
exports.syncWorknetV2 = functions
    .runWith({ timeoutSeconds: CONFIG.TIMEOUT, memory: "1GB" })
    .region(CONFIG.REGION)
    .pubsub.schedule(CONFIG.SCHEDULE_CRON)
    .timeZone(CONFIG.TIMEZONE)
    .onRun(async () => {
        const startedAt = Date.now();
        const runId = `${startedAt}-${Math.random().toString(36).slice(2, 8)}`;
        functions.logger.info(`V2 RUN START runId=${runId}`);

        if (!WORKNET_KEY) {
            functions.logger.error("WORKNET_KEY 미설정");
            return null;
        }

        const state = await readState();
        let lastModifiedAt = state.lastModifiedAt || null;
        let lastWantedAuthNo = state.lastWantedAuthNo || null;

        const seen = new Set();
        let pagesScanned = 0;
        let listCalls = 0, geocodeCalls = 0;
        let fetched = 0, skippedExisting = 0, skippedUnchanged = 0;
        let upserts = 0, updates = 0, closes = 0, errors = 0;
        const newSamples = [];   // 이번 런 신규 샘플 10개
        let earlyStop = false;
        let maxSeenModify = lastModifiedAt;
        let maxSeenIdAtThatTime = lastWantedAuthNo;
        let oldPageStreak = 0;

        try {
            for (let p = 1; p <= CONFIG.FETCH_PAGES_MAX; p++) {
                if (Date.now() - startedAt > CONFIG.HARD_DEADLINE_MS) {
                    functions.logger.warn("⏳ HARD DEADLINE, 안전 종료");
                    earlyStop = true; break;
                }

                listCalls++; pagesScanned++;
                const list = await callWorknetList(p, CONFIG.DISPLAY);
                fetched += list.length;
                if (list.length === 0) break;

                let pageHasOnlyOld = true;

                for (const item of list) {
                    if (upserts >= CONFIG.UPSERT_MAX) { earlyStop = true; break; }

                    const id = item.wantedAuthNo;
                    if (!id || seen.has(id)) continue;
                    seen.add(id);

                    const smodStr = item.smodifyDtm;
                    const newerThanCursor =
                        !lastModifiedAt || (smodStr && smodStr > lastModifiedAt) ||
                        (smodStr === lastModifiedAt && id > (lastWantedAuthNo || ""));
                    if (newerThanCursor) pageHasOnlyOld = false;

                    const ref = db.collection(COL.JOBS).doc(id);
                    const snap = await ref.get();

                    // ✅ 이미 존재하면 그냥 넘어간다 (형 전략 유지)
                    if (snap.exists) {
                        skippedExisting++;
                        if (
                            !maxSeenModify ||
                            smodStr > maxSeenModify ||
                            (smodStr === maxSeenModify && id > (maxSeenIdAtThatTime || ""))
                        ) {
                            maxSeenModify = smodStr;
                            maxSeenIdAtThatTime = id;
                        }
                        continue;
                    }

                    // ✅ 신규 문서만 저장: 좌표 부여 포함 (지오코딩은 상한 내에서만)
                    const docData = await buildDocData(item, {
                        wantGeocode: true,
                        geocodeCount: geocodeCalls
                    });

                    await ref.set(docData, { merge: true });
                    upserts++;

                    if (docData.geoReason === "geocoding_api") geocodeCalls++;

                    if (newSamples.length < 10) {
                        newSamples.push({
                            id,
                            smod: smodStr || null,
                            title: (item.title || item.wantedTitle || "").slice(0, 40)
                        });
                    }

                    if (isClosedByDate(item.closeDt)) {
                        await ref.set({ status: "CLOSE" }, { merge: true });
                        closes++;
                    }

                    if (
                        !maxSeenModify ||
                        smodStr > maxSeenModify ||
                        (smodStr === maxSeenModify && id > (maxSeenIdAtThatTime || ""))
                    ) {
                        maxSeenModify = smodStr;
                        maxSeenIdAtThatTime = id;
                    }

                    // 지오코딩 상한 도달 시 이후 항목은 자동으로 센트로이드만 시도됨
                    if (geocodeCalls >= CONFIG.GEOCODE_MAX) {
                        functions.logger.warn(`🧯 Geocoding cap reached: ${geocodeCalls}/${CONFIG.GEOCODE_MAX}`);
                    }
                }

                if (pageHasOnlyOld) oldPageStreak++; else oldPageStreak = 0;
                if (oldPageStreak >= 2) { functions.logger.info("🛑 조기 중단: 구커서 이하 페이지 연속"); earlyStop = true; break; }
                if (earlyStop) break;
            }

            await writeState({
                lastModifiedAt: maxSeenModify || lastModifiedAt,
                lastWantedAuthNo: maxSeenIdAtThatTime || lastWantedAuthNo,
                lastRun: admin.firestore.FieldValue.serverTimestamp(),
                lastPagesScanned: pagesScanned,
            });

        } catch (e) {
            errors++; functions.logger.error("❌ syncWorknetV2 실패:", e?.message || e);
        } finally {
            const endedAt = Date.now();
            const summary = {
                runId, startedAt, endedAt, durationMs: endedAt - startedAt,
                pagesScanned, earlyStop,
                fetched, listCalls, geocodeCalls,
                skippedExisting,
                upserts, closes, errors,
                lastModifiedAt_before: state.lastModifiedAt || null,
                lastWantedAuthNo_before: state.lastWantedAuthNo || null,
                lastModifiedAt_after: maxSeenModify || state.lastModifiedAt || null,
                lastWantedAuthNo_after: maxSeenIdAtThatTime || state.lastWantedAuthNo || null,
            };

            functions.logger.info(`[RUN SUMMARY] ${JSON.stringify(summary)}`);
            await writeRunLog(runId, summary);

            const totalSnap = await db.collection(COL.JOBS).count().get();
            const totalCount = totalSnap.data().count;
            functions.logger.info(`TOTAL worknet_v2_jobs = ${totalCount}`);

            if (upserts > 0) {
                functions.logger.info(
                    `INCREMENTAL NEW count=${upserts} sample=${JSON.stringify(newSamples)}`
                );
            } else {
                functions.logger.info(
                    `INCREMENTAL NEW count=0 (no new since cursor) ` +
                    `cursor.lastModifiedAt=${maxSeenModify} lastWantedAuthNo=${maxSeenIdAtThatTime}`
                );
            }
        }

        return null;
    });

/* ──────────────────────────────────────────────────────────────
* Nightly: 오늘 보인 ID 수집기(Collector) 00:05
* - Work24 전 페이지를 훑고, _meta/worknet_seen/<YYYYMMDD>/ids/<wantedAuthNo> 마커 생성
* - 상태: _meta/worknet_seen/<YYYYMMDD> 문서에 lastPage/collected/phase 기록
* - 재시작 가능: lastPage 기반 이어 붙이기
* ────────────────────────────────────────────────────────────── */
const SEEN_ROOT = "_meta/worknet_seen";

function kstTagYYYYMMDD() {  // KST 기준 날짜 태그
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
}

exports.nightlyWorknetCollector = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" }) // 9분
    .region(CONFIG.REGION)
    .pubsub.schedule("every day 00:05")
    .timeZone(CONFIG.TIMEZONE)
    .onRun(async () => {
        const startedAt = Date.now();
        const tag = kstTagYYYYMMDD(); // 오늘 태그
        const stateRef = db.collection(SEEN_ROOT).doc(tag);

        // 상태 로드
        const stateSnap = await stateRef.get();
        const state = stateSnap.exists ? stateSnap.data() : {};
        let startPage = Math.max(1, Number(state.lastPage || 1));
        let collected = Number(state.collected || 0);
        let pagesScanned = 0;

        await stateRef.set({
            phase: "collecting",
            startedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        try {
            const DISPLAY = 100;
            const MAX_PAGES_PER_RUN = 150; // 150 페이지(= 15,000건)
            const idsCol = stateRef.collection("ids");

            for (let p = startPage; p < startPage + MAX_PAGES_PER_RUN; p++) {
                // 하드 데드라인 가드
                if (Date.now() - startedAt > (CONFIG.HARD_DEADLINE_MS || 240_000)) {
                    functions.logger.warn(`[Collector] Hard deadline; lastPage=${p}`);
                    await stateRef.set({ lastPage: p, collected, phase: "collecting" }, { merge: true });
                    return null;
                }

                pagesScanned++;
                const list = await callWorknetList(p, DISPLAY);
                if (!list.length) {
                    functions.logger.info(`[Collector] page=${p} empty. Done.`);
                    await stateRef.set({
                        lastPage: p,
                        collected,
                        phase: "collect_done",
                        finishedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    return null;
                }

                // 마커 저장(배치)
                let batch = db.batch();
                let pending = 0;
                for (const item of list) {
                    const id = item?.wantedAuthNo;
                    if (!id) continue;
                    const ref = idsCol.doc(id);
                    batch.set(ref, { seenAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
                    pending++; collected++;

                    if (pending >= 450) { // 배치 안전한 크기
                        await batch.commit();
                        batch = db.batch();
                        pending = 0;
                    }
                }
                if (pending > 0) await batch.commit();

                // 진행 저장
                await stateRef.set({ lastPage: p + 1, collected, phase: "collecting" }, { merge: true });

                functions.logger.info(`[Collector] page=${p} stored; total collected=${collected}`);
            }

            // 이 런이 소화한 만큼 저장하고 종료(다음날 00:05에 이어감)
            await stateRef.set({
                lastPage: startPage + MAX_PAGES_PER_RUN,
                collected,
                phase: "collecting",
            }, { merge: true });

            return null;
        } catch (e) {
            functions.logger.error(`[Collector] fail: ${e?.message || e}`);
            await stateRef.set({ phase: "collect_error", errorAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            return null;
        }
    });

/* ──────────────────────────────────────────────────────────────
 * Morning: 마커에 없는 문서 CLOSE(Closer) 06:00
 * - worknet_v2_jobs 전체를 커서로 스캔하며, 마커에 없는 Doc는 status="CLOSE"
 * - 상태: _meta/worknet_seen/<YYYYMMDD> 문서에 lastCursor/closed/phase 기록
 * - 재시작 가능: lastCursor 기반 이어 붙이기
 * ────────────────────────────────────────────────────────────── */
exports.nightlyWorknetCloser = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" }) // 9분
    .region(CONFIG.REGION)
    .pubsub.schedule("every day 06:00")
    .timeZone(CONFIG.TIMEZONE)
    .onRun(async () => {
        const startedAt = Date.now();
        const tag = kstTagYYYYMMDD();
        const stateRef = db.collection(SEEN_ROOT).doc(tag);
        const stateSnap = await stateRef.get();
        const state = stateSnap.exists ? stateSnap.data() : {};

        // 안전장치: Collector가 충분히 돌지 않았으면 스킵
        if (state.phase !== "collect_done" && (state.collected || 0) < 1000) {
            functions.logger.warn(`[Closer] Collector not finished or too small collected(${state.collected || 0}). Skip.`);
            return null;
        }

        const idsCol = stateRef.collection("ids");

        // 스캔 파라미터
        const BATCH_LIMIT = 500;   // 한 번에 CLOSE 업데이트할 최대 건수
        const READ_PAGE = 1500;    // 한 런에서 읽어볼 문서 수
        let readCount = 0;
        let closeCount = Number(state.closed || 0);
        let lastCursorId = state.lastCursor || null;

        await stateRef.set({
            phase: "closing",
            closingStartedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        try {
            while (readCount < READ_PAGE) {
                // 하드 데드라인 가드
                if (Date.now() - startedAt > (CONFIG.HARD_DEADLINE_MS || 240_000)) {
                    functions.logger.warn(`[Closer] Hard deadline; lastCursor=${lastCursorId}`);
                    break;
                }

                let qry = db.collection(COL.JOBS).orderBy(admin.firestore.FieldPath.documentId());
                if (lastCursorId) {
                    const curSnap = await db.collection(COL.JOBS).doc(lastCursorId).get();
                    if (curSnap.exists) qry = qry.startAfter(curSnap);
                }
                const snap = await qry.limit(BATCH_LIMIT).get();
                if (snap.empty) {
                    functions.logger.info(`[Closer] end of collection reached.`);
                    await stateRef.set({
                        phase: "close_done",
                        closed: closeCount,
                        closingFinishedAt: admin.firestore.FieldValue.serverTimestamp(),
                        lastCursor: null,
                    }, { merge: true });
                    return null;
                }

                // 마커에 없는 놈 CLOSE
                let batch = db.batch();
                let pending = 0;
                for (const doc of snap.docs) {
                    readCount++;
                    lastCursorId = doc.id;
                    const marker = await idsCol.doc(doc.id).get();
                    if (!marker.exists) {
                        batch.set(doc.ref, { status: "CLOSE" }, { merge: true });
                        pending++;
                        closeCount++;
                    }

                    if (pending >= 450) {
                        await batch.commit();
                        batch = db.batch();
                        pending = 0;
                    }
                }
                if (pending > 0) await batch.commit();

                // 진행 저장
                await stateRef.set({
                    lastCursor: lastCursorId,
                    closed: closeCount,
                    phase: "closing",
                }, { merge: true });

                functions.logger.info(`[Closer] scanned=${readCount}, closed(total)=${closeCount}, lastCursor=${lastCursorId}`);

                if (readCount >= READ_PAGE) break;
            }

            // 아직 끝나지 않았다면 다음 실행 이어가기
            await stateRef.set({
                lastCursor: lastCursorId,
                closed: closeCount,
                phase: "closing",
            }, { merge: true });

            return null;
        } catch (e) {
            functions.logger.error(`[Closer] fail: ${e?.message || e}`);
            await stateRef.set({ phase: "close_error", errorAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            return null;
        }
    });
