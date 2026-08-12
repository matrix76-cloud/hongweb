// 📄 MobileResultMapcontainer.js
// - workCategories 단일 기준 (필터/아이콘/라벨)
// - 풍선 제거 → 마커/라벨 클릭 시 팝업 직행 (Short/General 분기)
// - 좌표 판별 단일화(getLatLngFromJob)
// - 초기 확대 조정 및 setBounds padding 축소
// - 마커 이미지 병렬 생성 + 확대시 연한 보더

import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_ITEMS } from "../../utility/categories";

import ShortJobPopup from "../../modal/ShortJobPopup";
import ShortJobDetail from "../../components/ShortJobDetail";
import GeneralJobPopup from "../../modal/GeneralJobPopup";

/* ===== 상수 ===== */
const HEADER_PX = 52;
const FOOTER_PX = 65;
const LAYER_ID = "result-map-layer";

// 줌 레벨 → 마커 크기
const sizeByLevel = (level) => {
  if (level <= 3) return 76;
  if (level <= 4) return 60;
  if (level <= 5) return 48;
  if (level <= 6) return 42;
  return 36;
};

// 리치/심플 임계: level <= 7 → 리치(확대된 상태)
const RICH_LEVEL_MAX = 1;
const isRichMode = (level) => level <= RICH_LEVEL_MAX;

// === Marker border styles ===
const RICH_BORDER = "rgba(45, 111, 247, 0.28)";   // 확대: 연한 테두리
const RICH_STROKE = 1;
const SIMPLE_BORDER = "#2D6FF7";                  // 축소: 선명한 테두리
const SIMPLE_STROKE = 2;



// 짧은 텍스트 자르기
const cut12 = (s = "") => (s?.length > 12 ? s.slice(0, 12) + "…" : s);

// 최후 폴백 라벨
const getWorkTypeText = (job) => (job?.worktype ?? job?.WORKTYPE ?? "일감").toString();

/* ===== CATEGORY MAPS (module-scope) ===== */
const ICON_MAP = Object.fromEntries(DEFAULT_ITEMS.map((i) => [i.key, i.image]));



const LABEL_MAP = Object.fromEntries(
  DEFAULT_ITEMS.map(i => [String(i.key), i.title ?? i.label ?? i.name ?? String(i.key)])
);



// ===== Key normalizer (case-insensitive DEFAULT_ITEMS key 매핑) =====
const KEY_LOOKUP_UPPER = new Map(DEFAULT_ITEMS.map(i => [String(i.key).toUpperCase(), String(i.key)]));
const toKnownKey = (k) => {
  if (k == null) return null;
  const u = String(k).toUpperCase().trim();
  return KEY_LOOKUP_UPPER.get(u) || null;  // DEFAULT_ITEMS에 있으면 표준 키 반환
};

// 런타임 정규화: workCategories(배열) 우선, 없으면 workcategory/category(단일) 승격
function resolveCategoryKeys(job) {
  const list = Array.isArray(job?.workCategories) ? job.workCategories : [];
  if (list.length) return list;
  const s = job?.workcategory ?? job?.category ?? null;
  return s ? [s] : [];
}


/* ===== 라벨 DOM ===== */
function createLabelDiv(text) {
  const div = document.createElement("div");
  const set = (p, v) => div.style.setProperty(p, v, "important");
  set("display", "inline-block");
  set("max-width", "140px");
  set("padding", "2px 6px");
  set("border", "none");
  set("background", "rgba(255,255,255,.9)");
  set("border-radius", "8px");
  set("color", "#333");
  set("font-family", "Pretendard-SemiBold, Pretendard, system-ui, -apple-system, sans-serif");
  set("font-size", "12px");
  set("line-height", "18px");
  set("white-space", "nowrap");
  set("overflow", "hidden");
  set("text-overflow", "ellipsis");
  set("transform", "translateY(12px)");
  set("pointer-events", "auto");
  set("user-select", "none");
  div.textContent = text;
  return div;
}

/* ===== 좌표 파싱(단일 신뢰 경로) ===== */
function getLatLngFromJob(kakao, job) {
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  let lat = num(job?.latitude);
  let lng = num(job?.longitude);

  if (lat === null || lng === null) {
    const info = Array.isArray(job?.WORK_INFO) ? job.WORK_INFO : [];
    const region = info.find((x) => x?.requesttype === "지역");
    lat = lat ?? num(region?.latitude);
    lng = lng ?? num(region?.longitude);
  }

  // 🔁 추가 좌표 후보(단기 일자리 등 스키마 차이 대응)
  if (lat === null || lng === null) {
    const candidates = [
      [job?.regionLat, job?.regionLng],
      [job?.addrLat, job?.addrLng],
      [job?.location?.latitude, job?.location?.longitude],
      [job?.location?.lat, job?.location?.lng],
      [job?.geo?.latitude, job?.geo?.longitude],
      [job?.geo?.lat, job?.geo?.lng],
      [job?.coordinates?.latitude, job?.coordinates?.longitude],
      [job?.coordinates?.lat, job?.coordinates?.lng],
      [job?.LATITUDE, job?.LONGITUDE],
    ];
    for (const [a, b] of candidates) {
      const la = num(a), lb = num(b);
      if (la !== null && lb !== null) { lat = la; lng = lb; break; }
    }
  }

  if (lat === null || lng === null) return null;
  return new kakao.maps.LatLng(lat, lng);
}

/* ===== 원형 썸네일 마커 이미지 ===== */
const circleImageCache = new Map();
async function makeCircleThumbMarkerImage(kakao, src, opts = {}) {
  const { size = 48, stroke = 2, border = "#2D6FF7", bg = "#FFFFFF" } = opts;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const key = `${src}|ci|${size}|${stroke}|${border}|${bg}|${DPR}`;
  if (circleImageCache.has(key)) return circleImageCache.get(key);

  const markerImage = await new Promise((resolve) => {
    if (!src) return resolve(undefined);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size * DPR; canvas.height = size * DPR;
        const ctx = canvas.getContext("2d");
        ctx.scale(DPR, DPR);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const r = size / 2; const cx = r, cy = r;
        // 배경 원
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.closePath();
        ctx.fillStyle = bg; ctx.fill();

        // 이미지 채우기(cover)
        const iw = img.width, ih = img.height;
        const scale = Math.max(size / iw, size / ih);
        const dw = iw * scale, dh = ih * scale;
        const dx = (size - dw) / 2, dy = (size - dh) / 2;

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        // 테두리
        if (stroke > 0) {
          ctx.lineWidth = stroke; ctx.strokeStyle = border;
          ctx.beginPath(); ctx.arc(cx, cy, r - stroke / 2, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
        }

        const dataURL = canvas.toDataURL("image/png");
        const image = new kakao.maps.MarkerImage(
          dataURL,
          new kakao.maps.Size(size, size),
          { offset: new kakao.maps.Point(size / 2, size) }
        );
        resolve(image);
      } catch {
        resolve(undefined);
      }
    };
    img.onerror = () => resolve(undefined);
  });

  if (markerImage) circleImageCache.set(key, markerImage);
  return markerImage;
}

/* ===== Short 카테고리 판별 ===== */
const SHORT_KEYS = ["SHORT", "SHORT_JOB", "SHORTJOBS", "SHORTTERM", "SHORT-TERM", "SHORTJOB", "단기", "단기알바"].map((s) => s.toUpperCase());
function isShortJob(job) {
  if (!job) return false;
  const arr = resolveCategoryKeys(job);
  if (!arr.length) return false;
  const upper = arr.map((k) => String(k).toUpperCase());
  return upper.some((k) => SHORT_KEYS.includes(k));
}

/* ===== 컴포넌트 ===== */
export default function MobileResultMapcontainer({
  type: typeProp = "general",
  TYPE,
  catKey: catKeyProp = null,
  radiusKm = 4,
  items: itemsProp = [],
  loading = false,
  centerLat,
  centerLng,
  onApplyForJob, // 선택: 지원(채팅 시작) 콜백
}) {

  console.log("items", itemsProp);
  const type = TYPE ?? typeProp;
  const catKey = useMemo(() => (catKeyProp ?? null), [catKeyProp]);

  // 팝업 선택 상태
  const [selected, setSelected] = useState(null);
  const close = () => setSelected(null);

  // items 정리: 필터/정렬
  const jobs = useMemo(() => {
    let arr = itemsProp || [];

    // 카테고리 필터: workCategories 기준 (대소문자 무시, 키 정규화)
    if (catKey) {
      const targetUpper = String(catKey).toUpperCase().trim();
      arr = arr.filter((j) => {
        const list = resolveCategoryKeys(j);
        return list.some((c) => String(c).toUpperCase().trim() === targetUpper);
      });
    }

    // 거리 정렬(있으면)
    if (arr.length && typeof arr[0]?.distanceKm === "number") {
      arr = [...arr].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return arr;
  }, [itemsProp, type, catKey]);

  useEffect(() => {
    const { kakao } = window || {};
    if (!kakao?.maps) return;

    // body 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 레이어 생성
    let layer = document.getElementById(LAYER_ID);
    if (!layer) {
      layer = document.createElement("div");
      layer.id = LAYER_ID;
      document.body.appendChild(layer);
    }
    Object.assign(layer.style, {
      position: "fixed",
      top: `${HEADER_PX}px`,
      left: "0px",
      width: "100%",
      height: `calc(100% - ${HEADER_PX}px - ${FOOTER_PX}px)`,
      zIndex: "999",
      touchAction: "none",
      overscrollBehavior: "contain",
      background: "#fff",
    });

    // 지도 컨테이너
    layer.innerHTML = "";
    const mapDiv = document.createElement("div");
    Object.assign(mapDiv.style, {
      width: "100%",
      height: "100%",
      touchAction: "none",
      overscrollBehavior: "contain",
      opacity: "0",
      visibility: "hidden",
    });
    layer.appendChild(mapDiv);

    // 지도 생성
    const hasUserCenter = Number.isFinite(Number(centerLat)) && Number.isFinite(Number(centerLng));
    const defaultCenter = hasUserCenter
      ? new kakao.maps.LatLng(Number(centerLat), Number(centerLng))
      : new kakao.maps.LatLng(37.5665, 126.9780);

    const map = new kakao.maps.Map(mapDiv, {
      center: defaultCenter,
      level: 8, // 기본을 더 확대
      disableDoubleClick: true,
      disableDoubleClickZoom: false,
    });
    map.setZoomable(true);
    map.setDraggable(true);

    const zc = new kakao.maps.ZoomControl();
    map.addControl(zc, kakao.maps.ControlPosition.RIGHT);

    // 좌표 있는 항목만 추리기(좌표 판별 단일화)
    const withPos = jobs.filter((j) => {
      try { return !!getLatLngFromJob(kakao, j); } catch { return false; }
    });

    const markers = [];
    const markerSrcs = [];
    const labelPairs = [];
    const bounds = new kakao.maps.LatLngBounds();

    let clusterer = null;
    let firstShown = false;
    const hasClusterer = !!kakao?.maps?.MarkerClusterer;

    // 상태: 확대/축소에 따른 라벨 플래그
    let currentRich = isRichMode(map.getLevel());
    let labelEnabled = !currentRich; // 심플 모드에서만 라벨 ON

    // 지도 빈곳 클릭 → 선택 해제(옵션)
    kakao.maps.event.addListener(map, "click", () => setSelected(null));

    // ===== 마커 & 라벨 생성 (병렬 이미지 생성) =====
    (async () => {
      const level = map.getLevel();
      const initialSize = sizeByLevel(level);

      // 준비: 위치/소스/라벨 계산
      const jobsMeta = withPos.map((job) => {
        const pos = getLatLngFromJob(kakao, job);
        const primaryRaw = (resolveCategoryKeys(job)[0]) || null;
        const normPrimary = primaryRaw ? (toKnownKey(primaryRaw) || primaryRaw) : null;
        const usingFilter = !!catKey;
        const displayKey = usingFilter ? (toKnownKey(catKey) || normPrimary) : normPrimary;

        // 아이콘: 우선 displayKey → 그다음 primary → 마지막 job.imageUrl
        let src = null;
        if (displayKey && ICON_MAP[displayKey]) src = ICON_MAP[displayKey];
        else if (normPrimary && ICON_MAP[normPrimary]) src = ICON_MAP[normPrimary];
        else src = job?.imageUrl;

        // 라벨: displayKey/primaryKey 기준, 없으면 폴백
        const labelKey = displayKey || normPrimary;
        const label = job?.WORKTYPE;


        return { job, pos, src, label };
      });

      // 확대/축소 상태에 따른 보더 스타일
      const borderStyle = currentRich
        ? { stroke: RICH_STROKE, border: RICH_BORDER }
        : { stroke: SIMPLE_STROKE, border: SIMPLE_BORDER };

      // 이미지 병렬 생성
      const images = await Promise.all(
        jobsMeta.map(({ src }) =>
          makeCircleThumbMarkerImage(kakao, src, { size: initialSize, ...borderStyle, bg: "#FFFFFF" })
        )
      );

      jobsMeta.forEach(({ job, pos, src, label }, idx) => {
        if (!pos) return;
        const img = images[idx];
        const marker = img
          ? new kakao.maps.Marker({ position: pos, image: img })
          : new kakao.maps.Marker({ position: pos });

        markers.push(marker);
        markerSrcs.push(src);
        bounds.extend(pos);

        // 라벨(심플 모드에서만 보임)
        const labelText = cut12(label || getWorkTypeText(job));
        const div = createLabelDiv(labelText);
        const overlay = new kakao.maps.CustomOverlay({ position: pos, content: div, xAnchor: 0.5, yAnchor: 0, clickable: true });
        labelPairs.push({ marker, overlay });

        // 클릭 → 팝업 열기
        div.addEventListener("click", (e) => { e.stopPropagation(); setSelected(job); });
        kakao.maps.event.addListener(marker, "click", () => setSelected(job));
      });

      // 클러스터러
      if (hasClusterer && markers.length > 0) {
        clusterer = new kakao.maps.MarkerClusterer({
          map: null,
          averageCenter: true,
          minLevel: 1,
          disableClickZoom: true,
          calculator: [10, 30, 100],
          styles: [
            { width: "36px", height: "36px", background: "linear-gradient(135deg,#EAF3FF 0%,#FFFFFF 100%)", color: "#2D6FF7", border: "2px solid #2D6FF7", borderRadius: "18px", textAlign: "center", lineHeight: "36px", fontWeight: "800", boxShadow: "0 3px 10px rgba(0,0,0,.15)" },
            { width: "42px", height: "42px", background: "linear-gradient(135deg,#E0ECFF 0%,#FFFFFF 100%)", color: "#1D5EEA", border: "2px solid #1D5EEA", borderRadius: "21px", textAlign: "center", lineHeight: "42px", fontWeight: "800", boxShadow: "0 4px 12px rgba(0,0,0,.18)" },
            { width: "48px", height: "48px", background: "linear-gradient(135deg,#D6E6FF 0%,#FFFFFF 100%)", color: "#104AC6", border: "2px solid #104AC6", borderRadius: "24px", textAlign: "center", lineHeight: "48px", fontWeight: "800", boxShadow: "0 5px 14px rgba(0,0,0,.22)" },
          ],
        });
        clusterer.addMarkers(markers);
        kakao.maps.event.addListener(clusterer, "clusterclick", (cluster) => {
          map.setLevel(map.getLevel() - 1, { anchor: cluster.getCenter() });
        });
      }

      // 범위/센터
      if (withPos.length > 0 && !bounds.isEmpty()) map.setBounds(bounds, 20); // padding 축소
      else map.setCenter(defaultCenter);

      // 라벨 표시 동기화
      const syncLabelsToMarkers = () => {
        labelPairs.forEach(({ marker, overlay }) => {
          const vis = !!marker.getMap();
          overlay.setMap(labelEnabled && vis ? map : null);
        });
      };

      // 첫 타일 로드 → 지도 보이기 + 첫 확대 조정(가변)
      const INITIAL_LEVEL_ADJUST = -2; // 음수면 확대(zoom-in)
      const firstTilesloaded = () => {
        if (firstShown) return;
        firstShown = true;

        if (hasClusterer && clusterer) clusterer.setMap(map);
        else markers.forEach((m) => m.setMap(map));

        mapDiv.style.visibility = "visible";
        mapDiv.style.opacity = "1";

        const cur = map.getLevel();
        const count = withPos.length;
        let adjust = INITIAL_LEVEL_ADJUST; // 기본 -2단계 확대
        if (count <= 2) adjust = Math.min(adjust, -3);
        else if (count <= 8) adjust = Math.min(adjust, -2);
        else adjust = Math.min(adjust, -1);
        const target = Math.max(1, Math.min(13, cur + adjust));
        if (target !== cur) map.setLevel(target);

        // 모드 갱신 + 라벨 반영
        currentRich = isRichMode(map.getLevel());
        labelEnabled = !currentRich;
        syncLabelsToMarkers();
      };

      // 확대/축소 시 마커 사이즈 & 라벨 노출 업데이트
      const switchByLevel = async () => {
        const levelNow = map.getLevel();
        const newSize = sizeByLevel(levelNow);
        const nextRich = isRichMode(levelNow);

        const imgs = await Promise.all(
          markerSrcs.map((src) =>
            makeCircleThumbMarkerImage(kakao, src, {
              size: newSize,
              stroke: nextRich ? RICH_STROKE : SIMPLE_STROKE,
              border: nextRich ? RICH_BORDER : SIMPLE_BORDER,
              bg: "#FFFFFF",
            })
          )
        );
        markers.forEach((m, i) => { const img = imgs[i]; if (img) m.setImage(img); });

        currentRich = nextRich;
        labelEnabled = !currentRich;
        // 라벨 동기화
        labelPairs.forEach(({ marker, overlay }) => {
          const vis = !!marker.getMap();
          overlay.setMap(labelEnabled && vis ? map : null);
        });
      };

      kakao.maps.event.addListener(map, "tilesloaded", firstTilesloaded);
      kakao.maps.event.addListener(map, "zoom_changed", switchByLevel);
    })();

    // 정리
    return () => {
      try { layer._cleanup?.(); } catch { }
      document.body.style.overflow = prevOverflow;
      const el = document.getElementById(LAYER_ID);
      if (el) { el.innerHTML = ""; el.remove(); }
    };
  }, [jobs, centerLat, centerLng]);

  return (
    <>
      {selected && isShortJob(selected) ? (
        <ShortJobPopup open={!!selected} onClose={close}>
          <ShortJobDetail
            job={selected}
            onClose={close}
            onChat={() => (typeof onApplyForJob === "function" ? onApplyForJob(selected) : null)}
          />
        </ShortJobPopup>
      ) : (
        selected && (
          <GeneralJobPopup job={selected} onClose={close} />
        )
      )}
    </>
  );
}
