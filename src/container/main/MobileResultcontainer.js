// 📄 src/pages/mobile/MobileResultcontainer.js
import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { Column } from "../../common/Column";
import { COLORS } from "../../utility/colors";
import VoiceDictateButton from "../../common/VoiceDictateButton";
import { CiSearch } from "react-icons/ci";
import GeneralJobCard from "../../components/GeneralJobCard";
import ShortJobCard from "../../components/ShortJobCard";                 // ✅ 단기 카드
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/DotSpinner";
import { UserContext } from "../../context/User";                        // ✅ 위치
import { ReadWork } from "../../service/WorkService";                    // ✅ 단기 로드
import ShortJobPopup from "../../modal/ShortJobPopup";
import ShortJobDetail from "../../components/ShortJobDetail";
// (참고) dayjs가 필요하면 import dayjs from "dayjs"; 추가

const HEADER_HEIGHT = 52;
const FOOT_HEIGHT = 65;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  background-color: #fff;
  padding: 0 16px;
`;

const FooterSummary = styled.div`
  padding: 24px 0;
  font-size: 13px;
  color: #888;
  text-align: center;
`;

const SearchHeader = styled.div`
  top: calc(env(safe-area-inset-top, 0px));
  background-color: #fff;
  padding: 16px 0 8px;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? "12px" : "0")}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  will-change: transform, opacity;
  transition: opacity 0.18s, transform 0.18s;
  transition-timing-function: cubic-bezier(.22, .61, .36, 1);
`;

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 999px;
  background: #fff;
  height: 48px;
  padding-left: 12px;
  padding-right: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const IconDiv = styled.div`
  display: grid; place-items: center;
  width: 40px; height: 40px; border-radius: 999px;
  cursor: pointer; font-size: 18px; color: #555;
  &:hover { background: rgba(0,0,0,0.04); }
`;

const SearchInput = styled.input`
  flex: 1; height: 100%; border: none; outline: none;
  font-size: 14px; padding: 0 8px; background: transparent;
`;

const RightIcons = styled.div` display: flex; align-items: center; gap: 8px; padding-right: 6px; `;
const List = styled.div` padding: 8px 0px; `;

/* ▶ Count + Sort 행 */
const CountAndSortRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 2px 0;
`;

const CountBadge = styled.div`
  background: rgba(255, 255, 255, 0.85);
  color: #222;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
`;

const SortSelect = styled.select`
  height: 36px;
  border-radius: 999px;
  padding: 0 36px 0 12px;        /* 오른쪽 여유 */
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  font-weight: 700;
  font-size: 13px;
  color: ${COLORS.text};
  outline: none;
  -webkit-tap-highlight-color: transparent;

  /* 기본 화살표 제거 */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* 커스텀 화살표 */
  background-image: url("data:image/svg+xml;utf8,<svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
`;

const MapFab = styled.button`
  position: fixed; right: 12px;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 84px);
  z-index: 20;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 9999px;
  font-weight: 700; font-size: 15px; background: rgba(0,0,0,.72);
  color: #fff; border: 0; cursor: pointer; -webkit-tap-highlight-color: transparent;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  will-change: transform, opacity;
  transition: opacity .18s, transform .18s;
  transition-timing-function: cubic-bezier(.22,.61,.36,1);
  box-shadow: 0 6px 16px rgba(0,0,0,.18);
`;
const LoadMoreButton = styled.button`
  width: 100%;
  padding: 14px 0;
  margin: 8px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: #fafafa;
  font-family: Pretendard-SemiBold;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
  &:active {
    background: #f0f0f0;
  }
`;
const BottomSpacer = styled.div` height: 96px; `;

/* ───────── 거리 유틸 ───────── */
const toRad = (d) => (d * Math.PI) / 180;
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

/* ───────── 느슨한 파서/정렬 도우미 ───────── */
const _num = (v) => (Number.isFinite(v) ? v : NaN);
function toMillisLoose(v) {
  if (!v) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (v?.toMillis) return v.toMillis();
  if (v instanceof Date) return v.getTime();
  if (typeof v === "string") {
    const dt = new Date(v);
    return isNaN(dt.getTime()) ? null : dt.getTime();
  }
  return null;
}
function getPostedMs(job) {
  const cand =
    job?.regDt ?? job?.postedAt ?? job?.insertDt ?? job?.createDt ?? job?.CREATEDT ?? null;

  if (typeof cand === "string" && /^\d{8}$/.test(cand)) {
    const y = +cand.slice(0, 4), m = +cand.slice(4, 6), d = +cand.slice(6, 8);
    const t = new Date(y, m - 1, d, 0, 0, 0).getTime();
    return Number.isFinite(t) ? t : 0;
  }
  const t = toMillisLoose(cand);
  if (Number.isFinite(t)) return t;

  const closeRaw = job?.closeDt ?? job?.closeDate ?? null;
  if (closeRaw) {
    if (typeof closeRaw === "string" && /^\d{8}$/.test(closeRaw)) {
      const y = +closeRaw.slice(0, 4), m = +closeRaw.slice(4, 6), d = +closeRaw.slice(6, 8);
      const tt = new Date(y, m - 1, d, 0, 0, 0).getTime();
      if (Number.isFinite(tt)) return tt - 1;
    } else {
      const tt = toMillisLoose(closeRaw);
      if (Number.isFinite(tt)) return tt - 1;
    }
  }
  return 0;
}

/* ───────── 단기 판별 ───────── */
const isShortKey = (key = "", name = "") => {
  const k = (key || "").toLowerCase();
  const n = (name || "").toLowerCase();
  return (
    k === "short" || k === "alba" || k === "short_job" || k === "shortjob" ||
    /단기|알바/.test(n)
  );
};


/* ── regDt 전용 파서 ───────────────────────────────────── */
function parseYMDToMs(y, m, d) {
  const Y = y < 100 ? 2000 + y : y; // '25-09-03' → 2025-09-03
  const t = new Date(Y, m - 1, d, 0, 0, 0).getTime();
  return Number.isFinite(t) ? t : NaN;
}

function getRegDtMs(job) {
  const v = job?.regDt;
  if (!v) return NaN;

  // Firestore Timestamp
  if (v?.toMillis) return v.toMillis();

  // number (epoch or 20250903)
  if (typeof v === "number") {
    if (v > 1e11) return v;              // epoch ms
    const s = String(v);
    if (/^\d{8}$/.test(s))               // YYYYMMDD
      return parseYMDToMs(+s.slice(0, 4), +s.slice(4, 6), +s.slice(6, 8));
  }

  // string
  if (typeof v === "string") {
    const t = v.trim();
    if (/^\d{8}$/.test(t))               // YYYYMMDD
      return parseYMDToMs(+t.slice(0, 4), +t.slice(4, 6), +t.slice(6, 8));

    let m = t.match(/^(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})$/); // YYYY-MM-DD
    if (m) return parseYMDToMs(+m[1], +m[2], +m[3]);

    m = t.match(/^(\d{2})[.\-\/](\d{1,2})[.\-\/](\d{1,2})$/);     // YY-MM-DD
    if (m) return parseYMDToMs(+m[1], +m[2], +m[3]);

    const dt = new Date(t);
    if (!isNaN(dt.getTime())) return dt.getTime();
  }
  return NaN;
}

/* regDt 없는 경우를 위한 느슨한 보조 */
function getCreatedAtMsLoose(job) {
  const cand = job?.createdAt ?? job?.CREATEDT ?? job?.insertDt ?? job?.createDt ?? job?.postedAt ?? null;

  if (cand?.toMillis) return cand.toMillis();

  if (typeof cand === "number") {
    if (cand > 1e11) return cand; // epoch ms
    const s = String(cand);
    if (/^\d{8}$/.test(s))
      return parseYMDToMs(+s.slice(0, 4), +s.slice(4, 6), +s.slice(6, 8));
  }

  if (typeof cand === "string") {
    const t = cand.trim();
    if (/^\d{8}$/.test(t))
      return parseYMDToMs(+t.slice(0, 4), +t.slice(4, 6), +t.slice(6, 8));

    let m = t.match(/^(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})$/);
    if (m) return parseYMDToMs(+m[1], +m[2], +m[3]);

    m = t.match(/^(\d{2})[.\-\/](\d{1,2})[.\-\/](\d{1,2})$/);
    if (m) return parseYMDToMs(+m[1], +m[2], +m[3]);

    const dt = new Date(t);
    if (!isNaN(dt.getTime())) return dt.getTime();
  }
  return NaN;
}


export default function MobileResultcontainer({
  type: typeProp = "general",
  TYPE,
  catKey: catKeyProp = null,
  radiusKm = 4,
  containerStyle,
  name,
  item = null,
  items: itemsProp = [],
  loading = false,
}) {
  const type = TYPE ?? typeProp;
  const { user } = useContext(UserContext);
  const [keyword, setKeyword] = useState("");
  const [hidden, setHidden] = useState(false);

  // 페이지네이션 (15개씩)
  const PAGE_SIZE = 15;
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // 정렬 모드 (recent | distance)
  const [sortMode, setSortMode] = useState(() => {
    const saved = localStorage.getItem("result.sortMode");
    return saved === "distance" ? "distance" : "recent";
  });
  useEffect(() => {
    localStorage.setItem("result.sortMode", sortMode);
  }, [sortMode]);

  const [selected, setSelected] = React.useState(null);
  const open = (job) => setSelected(job);
  const close = () => setSelected(null);

  // 지도 레이어/잠금 잔재 초기화
  useEffect(() => {
    const ghost = document.getElementById("result-map-layer");
    if (ghost) ghost.remove();
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
  }, []);

  // catKey 보정
  const catKey = useMemo(() => catKeyProp ?? item?.key ?? null, [catKeyProp, item]);

  // ✅ 이번 화면이 "단기"인지 판별
  const isShort = useMemo(
    () => type === "short" || isShortKey(catKey, name),
    [type, catKey, name]
  );

  /* ───────── 단기 일감 로드 ───────── */
  const [shortJobs, setShortJobs] = useState([]);
  const [shortLoading, setShortLoading] = useState(false);

  useEffect(() => {
    if (!isShort) return;
    const latUser = user?.USERINFO?.latitude;
    const lngUser = user?.USERINFO?.longitude;

    let cancelled = false;
    (async () => {
      try {
        setShortLoading(true);
        const res = await ReadWork({
          latitude: latUser ?? 37.5665,
          longitude: lngUser ?? 126.9780,
          checkdistance: radiusKm || 4,
          type: "short",
        });
        if (cancelled) return;
        const arr = Array.isArray(res) ? res : [];

        const normalized = arr.map((d, idx) => {
          const info = Array.isArray(d?.WORK_INFO) ? d.WORK_INFO : [];
          const getInfo = (name) => info.find((x) => x?.requesttype === name)?.result ?? "";
          const regionRow = info.find((x) => x?.requesttype === "지역");
          const amountInfo = info.find((x) => x?.requesttype === "금액")?.result;
          const amount =
            typeof d?.pay?.amount === "number" ? d.pay.amount :
              (typeof amountInfo === "number" ? amountInfo : null);

          // 거리 계산
          const latJob = typeof regionRow?.latitude === "number" ? regionRow.latitude : null;
          const lngJob = typeof regionRow?.longitude === "number" ? regionRow.longitude : null;
          let distanceKm = null;
          if (
            typeof latUser === "number" && typeof lngUser === "number" &&
            typeof latJob === "number" && typeof lngJob === "number"
          ) {
            distanceKm = haversineKm(latUser, lngUser, latJob, lngJob);
          }

          return {
            ...d,
            id: d.id || d.docId || d.WORK_ID || `short_${idx}_${d?.CREATEDT ?? ""}`,
            title: d.WORKNAME || d.title || getInfo("간단설명") || "단기 일감",
            company: d.ENTRPRS_NM || d.company || getInfo("회사명") || "",
            region: d.WORK_REGION_CONT || d.region || getInfo("지역") || "",
            memo: getInfo("요청메모") || "",
            pay: { type: d?.pay?.type || "TOTAL", amount, currency: "KRW" },
            imageUrl: d?.imageUrl || "",
            workcategory: "short",
            distanceKm,
          };
        });

        setShortJobs(normalized);
      } catch (e) {
        console.log("❌ ReadWork(short) error:", e?.message);
        setShortJobs([]);
      } finally {
        setShortLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isShort, user, radiusKm]);

  // 클라이언트 필터/정렬
  const baseFiltered = useMemo(() => {
    let arr = isShort ? shortJobs : itemsProp;

    // 카테고리 필터 (일반)
    if (!isShort && catKey) {
      arr = arr.filter((j) => {
        const wc = Array.isArray(j.workCategories) ? j.workCategories : [];
        const primary = j.primaryCategory;
        const legacy = j.workcategory || j.category;

        if (wc.length) return wc.includes(catKey);
        if (typeof primary === "string") return primary === catKey;
        if (typeof legacy === "string") return legacy === catKey;
        return false;
      });
    }

    // 키워드
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      arr = arr.filter((j) => {
        const t = `${j.title || ""} ${j.companyName || j.company || ""} ${j.PBANC_CONT || ""}`.toLowerCase();
        return t.includes(q);
      });
    }
    return arr;
  }, [itemsProp, isShort, catKey, keyword, shortJobs]);

  // 거리 정렬 가능 여부
  const canDistanceSort = useMemo(
    () => baseFiltered.some((j) => Number.isFinite(j?.distanceKm)),
    [baseFiltered]
  );



  // 불가능하면 자동 복귀
  useEffect(() => {
    if (sortMode === "distance" && !canDistanceSort) setSortMode("recent");
  }, [sortMode, canDistanceSort]);


  const jobs = useMemo(() => {
    const arr = [...baseFiltered];

    return arr.sort((a, b) => {
      if (sortMode === "distance" && canDistanceSort) {
        // ① 가까운 거리순
        const da = Number.isFinite(a?.distanceKm) ? a.distanceKm : Infinity;
        const db = Number.isFinite(b?.distanceKm) ? b.distanceKm : Infinity;
        if (da !== db) return da - db;

        // tie-breaker: regDt 최신
        const ra = getRegDtMs(a);
        const rb = getRegDtMs(b);
        if (Number.isFinite(ra) && Number.isFinite(rb)) return rb - ra;

        const ca = getCreatedAtMsLoose(a), cb = getCreatedAtMsLoose(b);
        if (Number.isFinite(ca) && Number.isFinite(cb)) return cb - ca;

        return String(a.id || "").localeCompare(String(b.id || ""));
      }

      // ② 최근 등록일순 (regDt만 신뢰, 거리는 사용하지 않음)
      const ra = getRegDtMs(a);
      const rb = getRegDtMs(b);
      if (Number.isFinite(ra) && Number.isFinite(rb)) return rb - ra;
      if (Number.isFinite(ra)) return -1;
      if (Number.isFinite(rb)) return 1;

      // regDt가 둘 다 없으면 보조 createdAt류로
      const ca = getCreatedAtMsLoose(a), cb = getCreatedAtMsLoose(b);
      if (Number.isFinite(ca) && Number.isFinite(cb)) return cb - ca;
      if (Number.isFinite(ca)) return -1;
      if (Number.isFinite(cb)) return 1;

      return String(a.id || "").localeCompare(String(b.id || ""));
    });

  }, [baseFiltered, sortMode, canDistanceSort]);


  // 키워드 변경 시 displayCount 초기화
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [keyword]);

  // 스크롤 시 헤더/FAB 숨김
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop;
    let timer = null;

    const onScroll = () => {
      const st = el.scrollTop;
      if (st > last && st - last > 4) setHidden(true);
      else if (st < last) setHidden(false);
      last = st;
      clearTimeout(timer);
      timer = setTimeout(() => setHidden(false), 150);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleMapClick = () => {
    const payload = {
      source: "MobileResult",
      type: isShort ? "short" : "general",
      catKey: isShort ? "short" : (catKey ?? item?.key ?? null),
      name,
      radiusKm,
      keyword,
      items: jobs, // 현재 필터/정렬된 리스트 그대로
    };
    navigate("/MobileResultMap", { state: payload });
  };

  /* ───────── 단기 일감 팝업 (채팅 플로우는 기존과 동일) ───────── */
  const handleApplyForJob = async (job) => {
    alert("채팅 플로우는 기존 파일과 동일하게 유지하세요 :)");
  };

  const showLoading = (isShort ? shortLoading && jobs.length === 0 : loading && itemsProp.length === 0);

  return (
    <Container ref={scrollRef} style={containerStyle}>
      <SearchHeader $hidden={hidden}>
        <SearchField>
          <IconDiv aria-label="검색"><CiSearch size={24} /></IconDiv>
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
          {/* <RightIcons>
            <VoiceDictateButton
              mode="toggle"
              size={36}
              color="#3182f6"
              onPartial={(t) => setKeyword(t)}
              onFinal={(t) => setKeyword(t)}
            />
          </RightIcons> */}
        </SearchField>
      </SearchHeader>

      {/* ▶ 카운트 + 정렬 콤보 */}
      <CountAndSortRow>
        <CountBadge>총 {jobs.length}건 표시 중</CountBadge>
        <SortSelect
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          aria-label="정렬 방식 선택"
        >
          <option value="recent">최근 등록일순</option>
          <option value="distance" disabled={!canDistanceSort}>가까운 거리순</option>
        </SortSelect>
      </CountAndSortRow>

      {/* 단기 일감 팝업 */}
      <ShortJobPopup open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <ShortJobDetail
            job={selected}
            onClose={() => setSelected(null)}
            onChat={() => handleApplyForJob(selected)}
          />
        )}
      </ShortJobPopup>

      {showLoading ? (
        <div style={{ padding: "30px 0" }}>
          <Spinner size={32} dotSize={4} color="rgba(0,0,0,.6)" dotCount={12} duration={1.2} />
        </div>
      ) : (
        <>
          <List>
            {jobs.slice(0, displayCount).map((job, i) => {
              const key = job.id || job.docId || i;
              return isShort
                ? <ShortJobCard key={key} job={job} onClick={() => setSelected(job)} />
                : <GeneralJobCard key={key} job={job} />;
            })}
          </List>

          {displayCount < jobs.length && (
            <LoadMoreButton onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}>
              더보기 ({displayCount} / {jobs.length})
            </LoadMoreButton>
          )}

          <BottomSpacer />

          <MapFab $hidden={hidden} aria-label="지도로 보기" onClick={handleMapClick}>
            지도로보기
          </MapFab>
        </>
      )}
    </Container>
  );
}
