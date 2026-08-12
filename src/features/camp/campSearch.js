// src/features/camp/campSearch.server.js
// Firebase Storage에 있는 camping.json (XML 문자열이 들어있는 배열)을 읽어와
// DOMParser로 파싱 → 표준 도큐먼트로 정규화 → 메모리 인덱스에서 검색

import { ReadCampingRegion } from "../../service/LifeService";


/* =========================
 * 캐시
 * ========================= */
let _campIndex = null;

/* =========================
 * Utils
 * ========================= */
const toArray = (v) => (Array.isArray(v) ? v.filter(Boolean) : v ? [v] : []);
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

const splitTokens = (s) => {
    if (!s) return [];
    return String(s)
        .replace(/마트\.편의점/g, "마트/편의점") // 특수 케이스
        .split(/[,\./|·\s]+/)
        .map((t) => t.trim())
        .filter(Boolean);
};

// 지역 매핑 (doNm/addr1 기반)
const mapDoToRegion = (doNm = "", addr1 = "") => {
    const src = `${doNm} ${addr1}`;
    if (/서울/.test(src)) return "서울";
    if (/경기도|경기/.test(src)) return "경기";
    if (/강원도|강원/.test(src)) return "강원";
    if (/경상북도|경북/.test(src)) return "경북";
    if (/경상남도|경남/.test(src)) return "경남";
    if (/충청남도|충남/.test(src)) return "충남";
    if (/충청북도|충북/.test(src)) return "충북";
    if (/전라남도|전남/.test(src)) return "전남";
    if (/전라북도|전북/.test(src)) return "전북";
    if (/제주/.test(src)) return "제주";
    return "";
};

export const normalizeRegion = (raw) => {
    const t = (raw || "").replace(/\s+/g, "").toLowerCase();
    if (!t) return null;
    if (/(서울근교|서울근처|서울근거리)/.test(t))
        return { region: "서울/경기", broaden: ["서울", "경기"] };
    if (/서울/.test(t)) return { region: "서울", broaden: ["서울", "경기"] };
    if (/경기/.test(t)) return { region: "경기", broaden: ["경기", "서울"] };
    if (/강원/.test(t)) return { region: "강원" };
    if (/제주/.test(t)) return { region: "제주" };
    if (/경북/.test(t)) return { region: "경북" };
    if (/경남/.test(t)) return { region: "경남" };
    if (/충남/.test(t)) return { region: "충남" };
    if (/충북/.test(t)) return { region: "충북" };
    if (/전남/.test(t)) return { region: "전남" };
    if (/전북/.test(t)) return { region: "전북" };
    return { region: raw };
};

const intersectsAny = (need, have) => {
    if (!need?.length) return true;
    if (!have?.length) return false;
    const set = new Set(have);
    return need.some((x) => set.has(x));
};

/* =========================
 * 모델 응답 JSON 파서
 * ========================= */
export const parseSearchPlan = (text) => {
    const m = text.match(/\{[\s\S]*\}$/m) || text.match(/\{[\s\S]*?\}/m);
    if (!m) return null;
    try {
        const plan = JSON.parse(m[0]);
        if (plan?.action !== "search" || plan?.source !== "camping") return null;
        const f = plan.filters || {};
        plan.filters = {
            region: f.region || null,
            theme: toArray(f.theme),
            pet_friendly: f.pet_friendly === true,
            amenities_any: toArray(f.amenities_any),
            industry: toArray(f.industry),
            reserve_type: toArray(f.reserve_type),
            fire_type: toArray(f.fire_type),
            unit_type: toArray(f.unit_type),
            keywords: toArray(f.keywords),
        };
        plan.sort = plan.sort || { by: "relevance", order: "desc" };
        plan.limit = plan.limit || 20;
        return plan;
    } catch {
        return null;
    }
};

/* =========================
 * XML → 표준 도큐먼트
 * ========================= */
const xmlItemToDoc = (it) => {
    const id = it.contentId;
    const name = it.facltNm || "";
    const name_lc = name.toLowerCase();

    // 지역
    const region = mapDoToRegion(it.doNm, it.addr1);
    const region_group = region === "서울" || region === "경기" ? "서울/경기" : null;

    // 업종/형태
    const industry = uniq(splitTokens(it.induty || it.facltDivNm));

    // 예약 타입
    const reserve_type = uniq(splitTokens(it.resveCl));

    // 화로/불멍
    const fire_type = uniq(
        splitTokens(it.brazierCl).map((s) =>
            s
                .replace(/개별화로|개별/g, "개별")
                .replace(/장작.*/g, "장작")
                .replace(/불멍.*/g, "불멍")
        )
    );

    // 편의시설
    const amenities = uniq(splitTokens(it.sbrsCl).concat(splitTokens(it.sbrsEtc)));

    // 객실 내부 시설(글램핑/카라반 합치기)
    const unit_type = uniq([
        ...splitTokens(it.caravInnerFclty),
        ...splitTokens(it.glampInnerFclty),
    ]);

    // 반려견
    const petText = it.animalCmgCl || "";
    const pet_friendly = /가능/.test(petText) && !/불가능/.test(petText);
    const pet_note = /소형견/.test(petText) ? "소형견" : "";

    // 테마 추론
    const src = [
        it.lineIntro,
        it.intro,
        it.featureNm,
        it.lctCl,
        it.themaEnvrnCl,
        it.posblFcltyCl,
        it.posblFcltyEtc,
    ].join(" ");

    const theme = new Set();
    if (/가족|패밀리/.test(src)) theme.add("가족");
    if (/커플|로맨틱/.test(src)) theme.add("커플");
    if (/글램핑/.test(src)) theme.add("글램핑");
    if (/카라반/.test(src)) theme.add("카라반");
    if (/차박/.test(src)) theme.add("차박");
    if (/계곡/.test(src) || /계곡/.test(it.lctCl || "")) theme.add("계곡");
    if (/숲|산림/.test(src) || /숲/.test(it.lctCl || "")) theme.add("숲");
    if (/산|능선/.test(src) || /산/.test(it.lctCl || "")) theme.add("산");
    if (/강|강\/물놀이/.test(src) || /강/.test(it.lctCl || "")) theme.add("강");
    if (/바다|해변|해수욕|일몰|일출/.test(src) || /해변/.test(it.lctCl || "")) {
        if (/해변|바다|해수욕/.test(src) || /해변/.test(it.lctCl || "")) {
            theme.add("해변");
            theme.add("바다");
        }
        if (/일몰/.test(src)) theme.add("야경");
        if (/일출/.test(src)) theme.add("일출");
    }

    return {
        id,
        name,
        name_lc,
        region,
        region_group,
        theme_tags: Array.from(theme),
        amenities,
        industry,
        reserve_type,
        fire_type,
        unit_type,
        pet_friendly,
        pet_note, // (옵션) "소형견" 등
        keywords: uniq([
            name_lc,
            ...splitTokens(it.addr1).map((s) => s.toLowerCase()),
            ...splitTokens(it.induty).map((s) => s.toLowerCase()),
            ...splitTokens(it.lctCl).map((s) => s.toLowerCase()),
        ]),
        firstImageUrl: it.firstImageUrl || "",
        addr1: it.addr1 || "",
        doNm: it.doNm || "",
        sigunguNm: it.sigunguNm || "",
        tel: it.tel || "",
        homepage: it.homepage || "",
        mapX: it.mapX || null,
        mapY: it.mapY || null,
        updatedAt: it.modifiedtime || it.createdtime || Date.now(),
        raw: it,
    };
};

/* =========================
 * 인덱스 빌드 (camping.json → XML 파싱)
 * ========================= */
const buildCampIndex = async () => {
    if (_campIndex) return _campIndex;

    const campingitemArr = await ReadCampingRegion(); // [{ campingitem: "<xml>...</xml>" }, ...]
    const items = [];

    (campingitemArr || []).forEach((entry) => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(entry.campingitem, "text/xml");
            const xmlitems = xmlDoc.getElementsByTagName("item");
            const g = (node, tag) => {
                const el = node.getElementsByTagName(tag)[0];
                return el ? (el.textContent || "").trim() : "";
            };

            for (let i = 0; i < xmlitems.length; i++) {
                const n = xmlitems[i];
                const it = {
                    contentId: g(n, "contentId"),
                    facltNm: g(n, "facltNm"),
                    lineIntro: g(n, "lineIntro"),
                    intro: g(n, "intro"),
                    featureNm: g(n, "featureNm"),
                    induty: g(n, "induty"),
                    facltDivNm: g(n, "facltDivNm"),
                    lctCl: g(n, "lctCl"),
                    doNm: g(n, "doNm"),
                    sigunguNm: g(n, "sigunguNm"),
                    addr1: g(n, "addr1"),
                    resveCl: g(n, "resveCl"),
                    caravInnerFclty: g(n, "caravInnerFclty"),
                    glampInnerFclty: g(n, "glampInnerFclty"),
                    brazierCl: g(n, "brazierCl"),
                    sbrsCl: g(n, "sbrsCl"),
                    sbrsEtc: g(n, "sbrsEtc"),
                    posblFcltyCl: g(n, "posblFcltyCl"),
                    posblFcltyEtc: g(n, "posblFcltyEtc"),
                    themaEnvrnCl: g(n, "themaEnvrnCl"),
                    animalCmgCl: g(n, "animalCmgCl"),
                    firstImageUrl: g(n, "firstImageUrl"),
                    mapX: g(n, "mapX"),
                    mapY: g(n, "mapY"),
                    tel: g(n, "tel"),
                    homepage: g(n, "homepage"),
                    createdtime: g(n, "createdtime"),
                    modifiedtime: g(n, "modifiedtime"),
                };
                items.push(xmlItemToDoc(it));
            }
        } catch (e) {
            console.warn("XML parse skip:", e);
        }
    });

    // contentId 중복 제거
    const seen = new Set();
    _campIndex = items.filter((d) => {
        if (!d.id || seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
    });

    return _campIndex;
};

/* =========================
 * 스코어링 & 정렬
 * ========================= */
const scoreDoc = (d, filters) => {
    let score = 0;
    const kws = (filters.keywords || []).map((s) => String(s).toLowerCase());
    const keySet = new Set(d.keywords || []);
    const nameLc = (d.name_lc || d.name || "").toLowerCase();

    kws.forEach((k) => {
        if (nameLc.includes(k)) score += 5;
        if (keySet.has(k)) score += 3;
    });

    const inter = (a, b) => (a || []).filter((x) => (b || []).includes(x)).length;
    score += inter(filters.theme, d.theme_tags);
    score += inter(filters.amenities_any, d.amenities);
    return score;
};

const sortDocs = (docs, sort) => {
    const by = sort?.by || "relevance";
    const order = (sort?.order || "desc").toLowerCase();
    const dir = order === "asc" ? 1 : -1;

    if (by === "updatedAt") {
        return [...docs].sort(
            (a, b) => (new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0)) * dir
        );
    }
    if (by === "rating") {
        return [...docs].sort(((a, b) => ((a.rating || 0) - (b.rating || 0)) * dir));
    }
    // relevance
    return [...docs].sort((a, b) => ((b._score || 0) - (a._score || 0)) * 1);
};

/* =========================
 * 1회 필터
 * ========================= */
const filterOnce = (list, filters) => {
    const norm = normalizeRegion(filters.region);
    let out = list;

    // 지역
    if (norm?.region) {
        if (norm.region === "서울/경기") {
            const hasGroup = out.some((d) => d.region_group === "서울/경기");
            out = hasGroup
                ? out.filter((d) => d.region_group === "서울/경기")
                : out.filter((d) => d.region === "서울" || d.region === "경기");
        } else {
            out = out.filter((d) => d.region === norm.region);
        }
    }

    // 반려견
    if (filters.pet_friendly === true) {
        out = out.filter((d) => d.pet_friendly === true);
    }

    // 태그류 ANY
    if (filters.theme?.length) out = out.filter((d) => intersectsAny(filters.theme, d.theme_tags));
    if (filters.amenities_any?.length) out = out.filter((d) => intersectsAny(filters.amenities_any, d.amenities));
    if (filters.industry?.length) out = out.filter((d) => intersectsAny(filters.industry, d.industry));
    if (filters.reserve_type?.length) out = out.filter((d) => intersectsAny(filters.reserve_type, d.reserve_type));
    if (filters.fire_type?.length) out = out.filter((d) => intersectsAny(filters.fire_type, d.fire_type));
    if (filters.unit_type?.length) out = out.filter((d) => intersectsAny(filters.unit_type, d.unit_type));

    // 점수
    out = out.map((d) => ({ ...d, _score: scoreDoc(d, filters) }));
    return out;
};

/* =========================
 * 공개 API: 파일 기반 검색
 * ========================= */
export const searchCampsFromServer = async (plan) => {
    const { filters, sort, limit } = plan;
    const all = await buildCampIndex();

    // 1차
    let docs = filterOnce(all, filters);
    if (docs.length) return { docs: sortDocs(docs, sort).slice(0, limit || 20), relaxed: false };

    // 2차 — 지역 확장
    const norm = normalizeRegion(filters.region);
    if (norm?.broaden?.length) {
        let merged = [];
        for (const r of norm.broaden) {
            merged = merged.concat(filterOnce(all, { ...filters, region: r }));
        }
        if (merged.length) {
            return {
                docs: sortDocs(uniq(merged.map((d) => d.id)).map((id) => merged.find((x) => x.id === id)), sort).slice(0, limit || 20),
                relaxed: true,
                reason: "region_broaden",
            };
        }
    }

    // 3차 — 편의시설 축소
    if (filters.amenities_any?.length) {
        const fewer = { ...filters, amenities_any: filters.amenities_any.slice(0, 1) };
        const d2 = filterOnce(all, fewer);
        if (d2.length) {
            return { docs: sortDocs(d2, sort).slice(0, limit || 20), relaxed: true, reason: "amenities_relaxed" };
        }
    }

    return { docs: [], relaxed: true, reason: "no_result" };
};
