// 📄 src/pages/mobile/MobileListcontainer.jsx
// (Worknet + 단기알바 탭/카운트 + 빠른 초가시 + 배치 렌더 + 거리 계산)

import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useDeferredValue } from "react";
import styled, { css } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import { imageDB } from "../../utility/imageData";
import { COLORS } from "../../utility/colors";
import { CiSearch } from "react-icons/ci";
import VoiceDictateButton from "../../common/VoiceDictateButton";

import { useWorknet } from "../../context/WorknetContext";
import { useCategoryPrefs } from "../../hooks/useCategoryPrefs";
import { DEFAULT_ITEMS } from "../../utility/categories";
import GeneralJobCard from "../../components/GeneralJobCard";
import ShortJobCard from "../../components/ShortJobCard";
import { ReadWork } from "../../service/WorkService";
import IconButton from "../../common/IconButton";
import Spinner from "../../components/DotSpinner";

/* ───────── Const ───────── */
const HEADER_HEIGHT = 46;
const FOOT_HEIGHT = 65;
const BRAND = "#7C3AED";
const BRAND_RGB = "124,58,237";
const ALL = "전체";
const SHORT = "short";
const SHORT_LABEL = "단기일거리";

/* ───────── Styles ───────── */
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  background-color: #fff;
  padding: 0 16px;
`;

const EmptyImage = styled.img`
  width: 120px; height: 120px; object-fit: contain; background: #fff; border-radius: 12px;
`;
const EmptySubTitle = styled.div` margin: 5px 0px; `;
const WorkCountBadge = styled.div`
  opacity: 0; animation: fadeInBadge .8s ease-in-out forwards;
  background: rgba(255,255,255,.85); color: #222;
  font-size: ${() => getFontSize(14)}px !important; font-weight: 500;
  padding: 6px 12px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.1);
  margin: 20px auto 8px auto; text-align: center; width: fit-content;
  @keyframes fadeInBadge { from{transform:translateY(4px);opacity:0} to{transform:none;opacity:1} }
`;

const TABS_H = 48;
const StickyTabs = styled.div`
  position: sticky; top: calc(env(safe-area-inset-top, 0px));
  background: #fff; z-index: 10; padding-bottom: 8px; height: ${TABS_H}px;
  overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain;
  &::-webkit-scrollbar { display: none; } scrollbar-width: none;
`;

const SearchHeader = styled.div` padding: 8px 0 0; background: #fff; `;
const TabsRow = styled.div` display: flex; gap: 6px; padding-top: 12px; `;

const TabItem = styled.div`
  position: relative; padding: 8px 14px; border-radius: 20px;
  font-size: ${() => getFontSize(14)}px !important; font-weight: 700; white-space: nowrap;
  background: ${({ active, $short }) => (active ? COLORS.primary : ($short ? "#F3E8FF" : "#f1f1f1"))};
  color: ${({ active }) => (active ? "#fff" : COLORS.text)};
  cursor: pointer; transition: background-color .2s ease, color .2s ease, transform .18s ease;
  ${({ $short, active }) => $short && css`
    padding-left: 44px;
    &::before{
      content: "★"; position:absolute; left:12px; top:50%; transform:translateY(-50%);
      width:20px; height:20px; border-radius:999px; display:grid; place-items:center;
      font-size:12px; line-height:1; font-weight:900; background:#fff; color:${COLORS.primary};
      box-shadow: 0 0 0 2px ${active ? "#fff" : COLORS.primary};
    }
    ${active && css` box-shadow: 0 6px 18px rgba(124,58,237,.18); `}
  `}
`;

const SearchField = styled.div`
  display:flex; align-items:center; height:48px; background:#fff;
  border:1px solid rgba(0,0,0,.1); border-radius:999px; padding:0 12px; box-shadow:0 1px 3px rgba(0,0,0,.06);
`;
const LeftIcon = styled.div` display:grid; place-items:center; width:40px; height:40px; border-radius:999px; color:#555; `;
const SearchInput = styled.input` flex:1; height:100%; border:0; outline:0; padding:0 8px; font-size:14px; background:transparent; `;
const RightIcons = styled.div` display:flex; align-items:center; gap:8px; `;

const List = styled.div` padding: 8px 0px; `;

const MapFab = styled.button`
  position: fixed; right: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 140px); z-index: 20;
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 9999px;
  font-weight: 700; font-size: 15px; background: rgba(0,0,0,.72); color: #fff; border: 0; cursor: pointer;
  -webkit-tap-highlight-color: transparent; opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  will-change: transform, opacity; transition: opacity .18s, transform .18s; box-shadow: 0 6px 16px rgba(0,0,0,.18);
`;

const BottomSpacer = styled.div` height: 110px; `;

const FloatingActionButton = styled.button`
  position: fixed; right: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 135px); z-index: 2;
  display: inline-flex; align-items: center; padding: 0 12px; border-radius: 9999px;
  font-weight: 700; font-size: ${() => getFontSize(15)}px !important; height: 40px; border: 0; cursor: pointer;
  -webkit-tap-highlight-color: transparent; transition: opacity .18s, transform .18s, box-shadow .18s, background .18s;
  &:active { transform: scale(.97); }
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  will-change: transform, opacity; position: fixed;
  ${({ $variant }) => {
    switch ($variant) {
      case 'shortlike':
        return css`
          background:#fff; color:${COLORS.primary}; border:1px solid ${COLORS.primary};
          box-shadow:0 6px 18px rgba(124,58,237,.18); padding-left:44px; height:40px;
          &::before{
            content:"★"; position:absolute; left:12px; top:50%; transform:translateY(-50%);
            width:20px; height:20px; border-radius:999px; display:grid; place-items:center;
            font-size:12px; line-height:1; font-weight:900; background:#fff; color:${COLORS.primary};
            box-shadow:0 0 0 2px ${COLORS.primary};
          }`;
      case 'solid':   return css`background:${BRAND}; color:#fff; box-shadow:0 6px 16px rgba(${BRAND_RGB},.28);`;
      case 'outline': return css`background:#fff; color:${BRAND}; border:1.5px solid rgba(${BRAND_RGB},.45); box-shadow:0 6px 16px rgba(0,0,0,.08);`;
      case 'glass':   return css`background:rgba(255,255,255,.78); color:${BRAND}; border:1px solid rgba(255,255,255,.9); backdrop-filter: blur(10px) saturate(140%); box-shadow:0 10px 24px rgba(0,0,0,.10);`;
      default:        return css`background:rgba(${BRAND_RGB},.12); color:${BRAND}; border:1px solid rgba(${BRAND_RGB},.28); box-shadow:0 6px 16px rgba(0,0,0,.08);`;
    }
  }}
`;

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

/* ───────── Component ───────── */
export default function MobileListcontainer({ containerStyle, TYPE }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { list = [], counts = {}, loading } = useWorknet();
  const { visibleKeys: visibleKeysRaw = [] } = useCategoryPrefs({ autoSave: false });

  // 초기 탭
  const typeFromLocation = location?.state?.TYPE;
  const initialTab = useMemo(
    () => (typeFromLocation === 'short' || TYPE === 'short' ? SHORT : ALL),
    [typeFromLocation, TYPE]
  );
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // 검색/스크롤
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);
  const [hidden, setHidden] = useState(false);
  const scrollRef = useRef(null);

  // 배치 렌더
  const [renderCount, setRenderCount] = useState(0);
  const BATCH_SIZE = 24;
  const BATCH_INTERVAL = 16;

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const rIC = useCallback((fn) => {
    if (typeof window.requestIdleCallback === "function") return window.requestIdleCallback(fn);
    return setTimeout(fn, BATCH_INTERVAL);
  }, []);

  // 단기알바 상태
  const [shortJobs, setShortJobs] = useState([]);
  const [shortLoading, setShortLoading] = useState(false);

  // 잔재 초기화
  useEffect(() => {
    const ghost = document.getElementById("result-map-layer");
    if (ghost) ghost.remove();
    if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
  }, []);

  // visibleKeys 정규화
  const visibleKeys = useMemo(
    () => Array.from(new Set(visibleKeysRaw)).filter(Boolean),
    [visibleKeysRaw]
  );

  const LABEL_MAP = useMemo(() => {
    const map = Object.fromEntries(DEFAULT_ITEMS.map(i => [i.key, i.label]));
    return (key) => map[key] || key;
  }, []);

  useEffect(() => {
    if (selectedTab !== ALL && selectedTab !== SHORT && !visibleKeys.includes(selectedTab)) {
      setSelectedTab(ALL);
    }
  }, [visibleKeys, selectedTab]);

  // ⬇️ 단기알바 로드 + 거리 계산 주입
  useEffect(() => {
    const latUser = user.USERINFO.latitude;
    const lngUser = user.USERINFO.longitude;

    let cancelled = false;
    (async () => {
      try {
        setShortLoading(true);
        const res = await ReadWork({
          latitude: latUser ?? 37.5665,
          longitude: lngUser ?? 126.9780,
          checkdistance: 10,
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
            workcategory: SHORT,
            distanceKm, // ✅ 카드에서 그대로 사용
          };
        });

        setShortJobs(normalized);
      } catch (e) {
        console.log("❌ ReadWork(short) 로드 에러:", e?.message);
        setShortJobs([]);
      } finally {
        setShortLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  // 스크롤 UI 토글
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop, showTimer;
    const onScroll = () => {
      const st = el.scrollTop;
      if (st > last && st - last > 4) setHidden(true);
      else if (st < last) setHidden(false);
      last = st;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => setHidden(false), 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(showTimer); };
  }, []);

  // 검색/정렬
  const normalizeKey = (s) => (s ?? "").toString().trim();
  const normEquals = (a, b) => normalizeKey(a) === normalizeKey(b);

  const matchKeyword = (job, kw) => {
    if (!kw) return true;
    const q = kw.toLowerCase();
    const fields = [
      job.title, job.company, job.region, job.memo, String(job?.pay?.amount || ""),
    ].filter(Boolean).join(" ").toLowerCase();
    return fields.includes(q);
  };

  const dateValue = (job) => {
    const s = job.regDt || job.insertDt || job.createDt || job.CREATEDT || job.closeDt || job.closeDate || "";
    if (/^\d{8}$/.test(String(s))) {
      const ys = String(s);
      const d = new Date(`${ys.slice(0,4)}-${ys.slice(4,6)}-${ys.slice(6,8)}T00:00:00`);
      return d.getTime() || 0;
    }
    const d = new Date(s?.toMillis ? s.toMillis() : s);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const visibleJobs = useMemo(() => {
    let base;
    if (selectedTab === SHORT) base = shortJobs;
    else {
      base = list;
      if (selectedTab !== ALL) base = base.filter((j) => normEquals(j.workcategory, selectedTab));
    }
    if (deferredKeyword.trim()) base = base.filter((j) => matchKeyword(j, deferredKeyword));

    return [...base].sort((a, b) => {
      const da = Number.isFinite(a?.distanceKm) ? a.distanceKm : Infinity;
      const db = Number.isFinite(b?.distanceKm) ? b.distanceKm : Infinity;
      if (da !== db) return da - db;
      return dateValue(b) - dateValue(a);
    });
  }, [list, shortJobs, selectedTab, deferredKeyword]);

  // 배치 렌더
  useEffect(() => {
    let cancelled = false;
    setRenderCount(Math.min(BATCH_SIZE, visibleJobs.length));
    const step = () => {
      if (cancelled) return;
      setRenderCount((prev) => (prev >= visibleJobs.length ? prev : Math.min(prev + BATCH_SIZE, visibleJobs.length)));
      if (!cancelled) rIC(step);
    };
    rIC(step);
    return () => { cancelled = true; };
  }, [visibleJobs]);

  // 탭 렌더
  const renderTabs = () => {
    const tabs = [ALL, SHORT, ...visibleKeys.filter((k) => k !== SHORT)];
    return (
      <TabsRow>
        {tabs.map((key) => {
          const active = selectedTab === key;
          const label = key === ALL ? ALL : key === SHORT ? SHORT_LABEL : LABEL_MAP(key);
          const cnt =
            key === ALL ? (list.length + shortJobs.length) : // ✅ 전체 = 일반+단기
            key === SHORT ? shortJobs.length :
            (counts?.[key] ?? 0);
          return (
            <TabItem key={key} active={active} $short={key === SHORT} onClick={() => setSelectedTab(key)}>
              {label}{cnt > 0 ? ` (${cnt})` : ""}
            </TabItem>
          );
        })}
      </TabsRow>
    );
  };

  const handleMapClick = () => {
    const name = selectedTab === ALL ? "구인하기" : selectedTab === SHORT ? SHORT_LABEL : LABEL_MAP(selectedTab);
    const payload = { source: "JobsList", type: "general", catKey: selectedTab === ALL ? null : selectedTab, name, radiusKm: 10, items: visibleJobs };
    navigate("/MobileResultMap", { state: payload });
  };

  /* ───────── Render ───────── */
  const isLoadingInitial =
    selectedTab === SHORT ? (shortLoading && shortJobs.length === 0)
                          : (loading && list.length === 0);

  const showTopSpinner = !visible || isLoadingInitial;

  return (
    <Container style={containerStyle} ref={scrollRef}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <StickyTabs>{renderTabs()}</StickyTabs>

        <SearchHeader>
          <SearchField>
            <LeftIcon><CiSearch size={24} /></LeftIcon>
            <SearchInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
            />
            {/* <RightIcons>
              <VoiceDictateButton
                mode="toggle"
                size={36}
                color={COLORS.primary}
                onPartial={(t) => setKeyword(t)}
                onFinal={(t) => setKeyword(t)}
              />
            </RightIcons> */}
          </SearchField>
        </SearchHeader>

        {showTopSpinner && (
          <div style={{ padding: "30px 0" }}>
            <Spinner size={32} dotSize={4} color="rgba(0,0,0,.6)" dotCount={12} duration={1.2} />
          </div>
        )}

        {visible && (
          visibleJobs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 }}>
              <EmptyImage src={imageDB.hirecharacter} loading="eager" />
              <EmptySubTitle style={{ marginTop: 20 }}>이 근처 단기 일감이 아직 없어요.</EmptySubTitle>
            </div>
          ) : (
            <>
              <WorkCountBadge>총 {visibleJobs.length}건의 일감이 있어요</WorkCountBadge>
              <List>
                {visibleJobs.slice(0, renderCount).map((job) => {
                  const key = job.id || job.docId || job.jobId;
                  if (selectedTab === SHORT || job.workcategory === SHORT) {
                    return (
                      <ShortJobCard
                        key={key}
                        job={job}
                        onClick={() => {
                          // TODO: 단기 상세 연결
                          // navigate("/ShortJobDetail", { state: { jobId: job.id } });
                        }}
                      />
                    );
                  }
                  return <GeneralJobCard key={key} job={job} />;
                })}
              </List>

              {renderCount < visibleJobs.length && (
                <div style={{ padding: "10px 0 18px" }}>
                  <Spinner size={32} dotSize={4} color="rgba(0,0,0,.6)" dotCount={12} duration={1.2} />
                </div>
              )}
              <BottomSpacer />
            </>
          )
        )}
      </div>

      {/* 알바 등록 FAB */}
      <FloatingActionButton
        $hidden={hidden}
        $variant="shortlike"
        aria-label="일거리등록"
        onClick={() => navigate("/Mobilecategory")}
      >
        일거리등록
      </FloatingActionButton>

      {/* 지도 보기 버튼 */}
      <IconButton
        onPress={handleMapClick}
        icon={"map"} iconcolor={"#fff"} width={"100%"} radius={"5px"}
        bgcolor={"#fff"} color={"#fff"} text={"지도로보기"}
        containerStyle={{
          position:"fixed", right:10,
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${70}px)`,
          fontSize: getFontSize(16),
          padding: "8px 5px",
          background: "#000000b0",
          borderRadius: "20px",
          boxShadow: "none",
          border: "1px solid #ededed",
          width: "110px",
          height: "30px",
          zIndex: 2
        }}
      />
    </Container>
  );
}
