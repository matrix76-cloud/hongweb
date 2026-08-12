// 📄 src/pages/mobile/MobileListcontainer.jsx
// (Worknet 리스트 + 카테고리 탭/카운트 + 검색 + 정렬(최근/거리) + 배치 렌더 + 지도보기)

import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useDeferredValue } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import { imageDB } from "../../utility/imageData";
import { COLORS } from "../../utility/colors";
import { CiSearch } from "react-icons/ci";

import { useWorknet } from "../../context/WorknetContext";
import { useCategoryPrefs } from "../../hooks/useCategoryPrefs";
import { DEFAULT_ITEMS } from "../../utility/categories";
import GeneralJobCard from "../../components/GeneralJobCard";
import IconButton from "../../common/IconButton";
import Spinner from "../../components/DotSpinner";
import dayjs from "dayjs";

/* ───────── Const ───────── */
const HEADER_HEIGHT = 52;
const FOOT_HEIGHT = 65;
const ALL = "전체";

// ✅ Android만 미세 보정 (필요하면 2→4)
const isAndroid = /Android/i.test(navigator.userAgent);
const ANDROID_FIX = isAndroid ? 4 : 0;
const TOP_OFFSET = `calc(env(safe-area-inset-top, 0px) + ${HEADER_HEIGHT + ANDROID_FIX}px)`;
const TABS_H = 48;

/* ───────── Styles ───────── */
const Container = styled.div`
  margin-top: ${TOP_OFFSET};
  height: calc(100dvh - (${TOP_OFFSET}) - ${FOOT_HEIGHT}px);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: none;
  background-color: #fff;
  padding: 0 16px;
`;

/* ✅ 첫 진입 “빈 프레임/분홍 번쩍” 방지용: 전체 로딩 오버레이 */
const PageLoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
`;

const PageLoadingCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const LoadingTitle = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(14)}px !important;
  color: #111827;
`;

const LoadingDesc = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  color: #6b7280;
`;

const StickyTabs = styled.div`
  position: sticky;
  top: 0;

  background: #fff;
  z-index: 10;
  padding-bottom: 8px;
  height: ${TABS_H}px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;
const EmptySubTitle = styled.div`
  margin: 5px 0px;
`;

const WorkCountBadge = styled.div`
  opacity: 0;
  animation: fadeInBadge 0.8s ease-in-out forwards;
  background: rgba(255, 255, 255, 0.85);
  color: #222;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: fit-content;

  @keyframes fadeInBadge {
    from {
      transform: translateY(4px);
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
`;

const CountAndSortRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 20px 0 8px 0;
`;

const SortSelect = styled.select`
  height: 36px;
  border-radius: 999px;
  padding: 0 36px 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-weight: 700;
  font-size: ${() => getFontSize(13)}px !important;
  color: ${COLORS.text};
  outline: none;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background: #fff
    url("data:image/svg+xml;utf8,<svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>")
    no-repeat right 12px center;
  background-size: 16px 16px;
`;

const SearchHeader = styled.div`
  padding: 8px 0 0;
  background: #fff;
`;
const TabsRow = styled.div`
  display: flex;
  gap: 6px;
  padding-top: 12px;
`;

const TabItem = styled.div`
  position: relative;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 700;
  white-space: nowrap;
  background: ${({ active }) => (active ? COLORS.primary : "#f1f1f1")};
  color: ${({ active }) => (active ? "#fff" : COLORS.text)};
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.18s ease;
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  padding: 0 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;
const LeftIcon = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: #555;
`;
const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  border: 0;
  outline: 0;
  padding: 0 8px;
  font-size: 14px;
  background: transparent;
`;

const List = styled.div`
  padding: 8px 0px;
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 14px 0;
  margin: 8px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: #fafafa;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
  &:active {
    background: #f0f0f0;
  }
`;

const BottomSpacer = styled.div`
  height: 110px;
`;

const FilterEx2 = styled.div`
  position: fixed;
  z-index: 2;
  right: 10px;
  display: flex;
  flex-direction: row;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 70px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  &:active {
    transform: scale(0.97);
  }
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? "12px" : "0")}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  will-change: transform, opacity;
`;

/* ───────── 거리 유틸 ───────── */
const toRad = (d) => (d * Math.PI) / 180;
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

/* ───────── createdAt helpers ───────── */
function getCreatedAtMs(job) {
  const ms =
    job?.createdAt?.toMillis?.() ??
    (typeof job?.CREATEDT === "number"
      ? job.CREATEDT
      : job?.CREATEDT?.toMillis?.() ?? null);
  return Number.isFinite(ms) ? ms : NaN;
}
function formatCreatedAt(job, fmt = "YY-MM-DD") {
  const ms = getCreatedAtMs(job);
  return Number.isFinite(ms) ? dayjs(ms).format(fmt) : "";
}

const normalizeKey = (s) => (s ?? "").toString().trim();
const normEquals = (a, b) => normalizeKey(a) === normalizeKey(b);

const matchKeyword = (job, kw) => {
  if (!kw) return true;
  const q = kw.toLowerCase();
  const fields = [
    job.title,
    job.company,
    job.region,
    job.memo,
    String(job?.pay?.amount || ""),
    job?.ENTRPRS_NM,
    job?.WORK_NM,
    job?.WORK_REGION_CONT,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return fields.includes(q);
};

const dateValue = (job) => {
  const s =
    job.regDt ||
    job.insertDt ||
    job.createDt ||
    job.CREATEDT ||
    job.closeDt ||
    job.closeDate ||
    "";
  if (/^\d{8}$/.test(String(s))) {
    const ys = String(s);
    const d = new Date(
      `${ys.slice(0, 4)}-${ys.slice(4, 6)}-${ys.slice(6, 8)}T00:00:00`
    );
    return d.getTime() || 0;
  }
  const d = new Date(s?.toMillis ? s.toMillis() : s);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

/* ───────── Component ───────── */
export default function MobileListcontainer({ containerStyle, TYPE }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  // ✅ Worknet만 사용
  const { list = [], counts = {}, loading } = useWorknet();

  // ✅ 카테고리 노출키 (단기 관련은 이제 안씀)
  const { visibleKeys: visibleKeysRaw = [] } = useCategoryPrefs({ autoSave: false });

  // 탭
  const typeFromLocation = location?.state?.TYPE;
  const initialTab = useMemo(
    () => (typeFromLocation ? typeFromLocation : ALL),
    [typeFromLocation]
  );
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // 검색/스크롤
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);
  const [hidden, setHidden] = useState(false);
  const scrollRef = useRef(null);

  // 페이지네이션 (15개씩)
  const PAGE_SIZE = 15;
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 탭/검색어 변경 시 displayCount 초기화
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [selectedTab, deferredKeyword]);

  // 잔재 초기화
  useEffect(() => {
    const ghost = document.getElementById("result-map-layer");
    if (ghost) ghost.remove();
    if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
  }, []);

  // ✅ 1) selectedTab 안전망: 혹시 alba로 들어오면 전체로 강제
  useEffect(() => {
    if (selectedTab === "alba") setSelectedTab(ALL);
  }, [selectedTab]);

  // ✅ 2) visibleKeys 정규화에서 alba(단기) 제거
  const visibleKeys = useMemo(() => {
    const set = new Set();
    for (const k of visibleKeysRaw || []) {
      const nk = normalizeKey(k);
      if (!nk) continue;
      if (nk === "alba" || nk === "short") continue;
      set.add(nk);
    }
    return Array.from(set);
  }, [visibleKeysRaw]);

  const LABEL_MAP = useMemo(() => {
    const map = Object.fromEntries(DEFAULT_ITEMS.map((i) => [i.key, i.label]));
    return (key) => map[key] || key;
  }, []);

  useEffect(() => {
    if (selectedTab !== ALL && !visibleKeys.includes(selectedTab)) {
      setSelectedTab(ALL);
    }
  }, [visibleKeys, selectedTab]);

  // 스크롤 UI 토글
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop,
      showTimer;
    const onScroll = () => {
      const st = el.scrollTop;
      if (st > last && st - last > 4) setHidden(true);
      else if (st < last) setHidden(false);
      last = st;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => setHidden(false), 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(showTimer);
    };
  }, []);

  // 정렬 모드
  const [sortMode, setSortMode] = useState(() => {
    const saved = localStorage.getItem("jobs.sortMode");
    return saved === "distance" ? "distance" : "recent";
  });
  useEffect(() => {
    localStorage.setItem("jobs.sortMode", sortMode);
  }, [sortMode]);

  // ✅ Worknet 리스트에 distanceKm 주입(있을 때만)
  const listWithDistance = useMemo(() => {
    const latUser = user?.USERINFO?.latitude;
    const lngUser = user?.USERINFO?.longitude;

    return (list || []).map((j) => {
      const latJob =
        typeof j?.latitude === "number"
          ? j.latitude
          : typeof j?.LAT === "number"
            ? j.LAT
            : typeof j?.region?.latitude === "number"
              ? j.region.latitude
              : null;

      const lngJob =
        typeof j?.longitude === "number"
          ? j.longitude
          : typeof j?.LON === "number"
            ? j.LON
            : typeof j?.region?.longitude === "number"
              ? j.region.longitude
              : null;

      let distanceKm = null;
      if (
        typeof latUser === "number" &&
        typeof lngUser === "number" &&
        typeof latJob === "number" &&
        typeof lngJob === "number"
      ) {
        distanceKm = haversineKm(latUser, lngUser, latJob, lngJob);
      }
      return { ...j, distanceKm };
    });
  }, [list, user?.USERINFO?.latitude, user?.USERINFO?.longitude]);

  // ✅ 초기 로딩이면 화면 자체를 “전체 스피너”로 막아버림 (첫 진입 번쩍 방지)
  const isLoadingInitial = loading && listWithDistance.length === 0;
  if (isLoadingInitial) {
    return (
      <PageLoadingOverlay>
        <PageLoadingCenter>
          <Spinner size={34} dotSize={4} color="rgba(0,0,0,.55)" dotCount={12} duration={1.1} />
          <LoadingTitle>일자리를 불러오는 중</LoadingTitle>
          <LoadingDesc>잠시만 기다려주세요</LoadingDesc>
        </PageLoadingCenter>
      </PageLoadingOverlay>
    );
  }

  // 필터링
  const filteredJobs = useMemo(() => {
    let base = listWithDistance;

    if (selectedTab !== ALL) {
      base = base.filter((j) => {
        if (Array.isArray(j.workCategories) && j.workCategories.includes(selectedTab)) return true;
        if (j.primaryCategory && j.primaryCategory === selectedTab) return true;
        if (j.workcategory && normEquals(j.workcategory, selectedTab)) return true;
        return false;
      });
    }

    if (deferredKeyword.trim()) {
      base = base.filter((j) => matchKeyword(j, deferredKeyword));
    }
    return base;
  }, [listWithDistance, selectedTab, deferredKeyword]);

  // 거리 정렬 가능 여부
  const canDistanceSort = useMemo(
    () => filteredJobs.some((j) => Number.isFinite(j?.distanceKm)),
    [filteredJobs]
  );

  useEffect(() => {
    if (sortMode === "distance" && !canDistanceSort) setSortMode("recent");
  }, [sortMode, canDistanceSort]);

  // 최종 표시 목록(정렬)
  const visibleJobs = useMemo(() => {
    const base = [...filteredJobs];

    return base.sort((a, b) => {
      if (sortMode === "distance" && canDistanceSort) {
        const da = Number.isFinite(a?.distanceKm) ? a.distanceKm : Infinity;
        const db = Number.isFinite(b?.distanceKm) ? b.distanceKm : Infinity;
        if (da !== db) return da - db;

        const ta = getCreatedAtMs(a);
        const tb = getCreatedAtMs(b);
        if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
        if (Number.isFinite(ta)) return -1;
        if (Number.isFinite(tb)) return 1;
        return dateValue(b) - dateValue(a);
      }

      const ta = getCreatedAtMs(a);
      const tb = getCreatedAtMs(b);
      if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
      if (Number.isFinite(ta)) return -1;
      if (Number.isFinite(tb)) return 1;

      const da = Number.isFinite(a?.distanceKm) ? a.distanceKm : Infinity;
      const db = Number.isFinite(b?.distanceKm) ? b.distanceKm : Infinity;
      if (da !== db) return da - db;

      return dateValue(a) - dateValue(b);
    });
  }, [filteredJobs, sortMode, canDistanceSort]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  }, [PAGE_SIZE]);

  // 탭 렌더
  const renderTabs = () => {
    const baseKeys = [ALL, ...visibleKeys];
    const seen = new Set();
    const tabsKeys = baseKeys.filter((k) => {
      const nk = normalizeKey(k);
      if (seen.has(nk)) return false;
      seen.add(nk);
      return true;
    });

    return (
      <TabsRow>
        {tabsKeys.map((key) => {
          const active = selectedTab === key;
          const label = key === ALL ? ALL : LABEL_MAP(key);
          const cnt = key === ALL ? listWithDistance.length : counts?.[key] ?? 0;

          return (
            <TabItem key={key} active={active} onClick={() => setSelectedTab(key)}>
              {label}
              {cnt > 0 ? ` (${cnt})` : ""}
            </TabItem>
          );
        })}
      </TabsRow>
    );
  };

  const handleMapClick = () => {
    const name = selectedTab === ALL ? "구인하기" : LABEL_MAP(selectedTab);
    const payload = {
      source: "JobsList",
      type: "general",
      catKey: selectedTab === ALL ? null : selectedTab,
      name,
      radiusKm: 4,
      items: visibleJobs,
    };
    navigate("/MobileResultMap", { state: payload });
  };

  /* ───────── Render ───────── */
  const showTopSpinner = !visible;

  return (
    <Container style={containerStyle} ref={scrollRef}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <StickyTabs>{renderTabs()}</StickyTabs>

        <SearchHeader>
          <SearchField>
            <LeftIcon>
              <CiSearch size={24} />
            </LeftIcon>
            <SearchInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </SearchField>
        </SearchHeader>

        {showTopSpinner && (
          <div style={{ padding: "30px 0" }}>
            <Spinner size={32} dotSize={4} color="rgba(0,0,0,.6)" dotCount={12} duration={1.2} />
          </div>
        )}

        {visible &&
          (visibleJobs.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <EmptyImage src={imageDB.hirecharacter} loading="eager" />
              <EmptySubTitle style={{ marginTop: 20 }}>
                이 근처 일감이 아직 없어요.
              </EmptySubTitle>
            </div>
          ) : (
            <>
              <CountAndSortRow>
                <WorkCountBadge>총 {visibleJobs.length}건의 일감이 있어요</WorkCountBadge>
                <SortSelect
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  aria-label="정렬 방식 선택"
                >
                  <option value="recent">최근 등록일순</option>
                  <option value="distance" disabled={!canDistanceSort}>
                    가까운 거리순
                  </option>
                </SortSelect>
              </CountAndSortRow>

              <List>
                {visibleJobs.slice(0, displayCount).map((job) => {
                  const key = job.id || job.docId || job.jobId;
                  const createdAtLabel = formatCreatedAt(job); // YY-MM-DD
                  return <GeneralJobCard key={key} job={job} createdAtLabel={createdAtLabel} />;
                })}
              </List>

              {displayCount < visibleJobs.length && (
                <LoadMoreButton onClick={handleLoadMore}>
                  더보기 ({displayCount} / {visibleJobs.length})
                </LoadMoreButton>
              )}
              <BottomSpacer />
            </>
          ))}

        {/* 지도 보기 버튼 */}
        <FilterEx2 $hidden={hidden} style={{ height: "60px" }}>
          <IconButton
            onPress={handleMapClick}
            icon={"map"}
            iconcolor={"#fff"}
            width={"100%"}
            radius={"5px"}
            bgcolor={"#fff"}
            color={"#fff"}
            text={"지도로보기"}
            containerStyle={{
              fontSize: getFontSize(16),
              padding: "8px 5px",
              background: "#000000b0",
              borderRadius: "20px",
              boxShadow: "none",
              border: "1px solid #ededed",
              width: "110px",
              height: "30px",
            }}
          />
        </FilterEx2>
      </div>
    </Container>
  );
}
