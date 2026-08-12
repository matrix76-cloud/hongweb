// 📄 MobileResultMapcontainer.js
import React, { useEffect, useMemo, useState } from "react";
import GeneralJobPopup from "../../modal/GeneralJobPopup";
import { DEFAULT_ITEMS } from "../../utility/categories";

/* ===== 상수 ===== */
const HEADER_PX = 52;
const FOOTER_PX = 65;
const LAYER_ID = "result-map-layer";

const BALLOON_WIDTH = 'clamp(130px, 38vw, 150px)';
const BANNER_HEIGHT = 58;

const TAIL_SIZE = 10;

const INITIAL_ZOOM_OUT_STEPS = 6;

/* ===== 유틸 ===== */
const cut12 = (s = "") => (s?.length > 12 ? s.slice(0, 12) + "…" : s);

// 줌 레벨 → 마커 크기
const sizeByLevel = (level) => {
  if (level <= 3) return 76;
  if (level <= 4) return 60;
  if (level <= 5) return 48;
  if (level <= 6) return 42;
  return 36;
};

// 숫자 → ₩xx,xxx
const money = (n) => `₩${Number(n).toLocaleString()}`;

// "3만5천" 등 간단 한국어 금액 처리 + 범위 처리
function parseKoreanMoney(str = "") {
  const s = String(str).trim();
  if (!s) return null;
  if (/협의|면접/i.test(s)) return { text: "협의" };

  // 범위 "12,000~15,000"
  const mRange = s.match(/([\d,.\s만천]+)\s*[~\-]\s*([\d,.\s만천]+)/);
  if (mRange) return { min: toWon(mRange[1]), max: toWon(mRange[2]) };

  // 단일 값
  const n = toWon(s);
  return n ? { n } : null;

  // 내부: "3만5천", "12,000", "35000" → 숫자(원)
  function toWon(t) {
    let x = String(t).replace(/\s/g, "");
    // "3만5천" "3.5만" 처리
    const mMan = x.match(/([\d.]+)\s*만/);
    const mCheon = x.match(/([\d.]+)\s*천/);
    if (mMan || mCheon) {
      let won = 0;
      if (mMan) won += Math.round(parseFloat(mMan[1]) * 10000);
      if (mCheon) won += Math.round(parseFloat(mCheon[1]) * 1000);
      return won || null;
    }
    // "12,000원"
    const digits = x.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : null;
  }
}

// 단위 추출: 시급/일급/월급/건당
function detectUnit({ job, hint = "" }) {
  const u = (job?.payUnit || job?.PAY_UNIT || hint || "").toString();
  if (/시급|hour/i.test(u)) return "/시";
  if (/일급|day/i.test(u)) return "/일";
  if (/월급|month/i.test(u)) return "/월";
  if (/건|piece|task/i.test(u)) return "/건";
  return ""; // 모르면 공백
}

// 다양한 형태(price, amount, {min,max}, WORK_INFO 등)를 문자열로
function getPriceText(job) {
  const tryNormalize = (val, unitHint) => {
    if (val == null) return null;
    if (typeof val === "number") return { n: val, unitHint };
    if (typeof val === "string") {
      const r = parseKoreanMoney(val);
      return r ? { ...r, unitHint } : null;
    }
    if (Array.isArray(val)) {
      for (const v of val) {
        const r = tryNormalize(v, unitHint);
        if (r) return r;
      }
      return null;
    }
    if (typeof val === "object") {
      // 흔한 키 케이스
      const cand = val.value ?? val.amount ?? val.price ?? val.pay ?? val.text ?? null;
      const unitHint2 = val.unit ?? val.payUnit ?? unitHint ?? "";
      if (cand != null) return tryNormalize(cand, unitHint2);
      // 범위 {min,max}
      if (val.min != null || val.max != null) return { min: val.min ?? val.max, max: val.max ?? val.min, unitHint };
      return null;
    }
    return null;
  };

  // 1) 최상위 키들
  const rootKeys = ["price", "PRICE", "pay", "PAY", "amount", "AMOUNT", "salary", "SALARY", "wage", "WAGE", "payAmount", "PAY_AMOUNT"];
  for (const k of rootKeys) {
    const norm = tryNormalize(job?.[k]);
    if (norm) return formatOut(norm, detectUnit({ job }));
  }

  // 2) WORK_INFO에서 가격/급여류 항목 찾기
  const info = Array.isArray(job?.WORK_INFO) ? job.WORK_INFO : [];
  const priceLike = ["가격", "금액", "급여", "비용", "시급", "일급", "월급", "페이"];
  for (const it of info) {
    const label = (it?.requesttype || it?.title || it?.name || "").toString();
    if (priceLike.some(w => label.includes(w))) {
      const unitHint = label; // "시급" 같은 단어가 들어있으면 단위로 활용
      const norm = tryNormalize(it?.amount ?? it?.value ?? it?.price ?? it?.pay ?? it?.text, unitHint);
      if (norm) return formatOut(norm, detectUnit({ job, hint: unitHint }));
    }
  }

  return ""; // 없으면 빈 문자열

  function formatOut(obj, unitSuffix) {
    if (obj.text) return obj.text; // "협의"
    const suf = unitSuffix || "";
    if (obj.min != null && obj.max != null) {
      return `${money(obj.min)}~${money(obj.max)}${suf}`;
    }
    if (obj.n != null) return `${money(obj.n)}${suf}`;
    return "";
  }
}

// WorkType 표기
const getWorkTypeText = (job) =>
  (job?.worktype ?? job?.WORKTYPE ?? job?.workcategory ?? "일감").toString();


// 리치/심플 임계
const RICH_LEVEL_MAX = 7;                 // level <= 7 : 리치(사각+풍선), 8~ : 심플(동그라미)
const isRichMode = (level) => level <= RICH_LEVEL_MAX;

// 라벨 DOM
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

// 좌표 파싱
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
    lat = num(region?.latitude);
    lng = num(region?.longitude);
  }
  if (lat === null || lng === null) return null;
  return new kakao.maps.LatLng(lat, lng);
}

/* ===== 마커 이미지(사각/원형) ===== */
const squareImageCache = new Map();
const circleImageCache = new Map();

function makeSquareThumbMarkerImage(kakao, src, opts = {}) {
  const { size = 48, radius = 10, stroke = 2, border = "#2D6FF7", bg = "#FFFFFF" } = opts;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const key = `${src}|sq|${size}|${radius}|${stroke}|${border}|${bg}|${DPR}`;
  if (squareImageCache.has(key)) return Promise.resolve(squareImageCache.get(key));

  return new Promise((resolve) => {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size * DPR; canvas.height = size * DPR;
        const ctx = canvas.getContext("2d"); ctx.scale(DPR, DPR); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
        const r = Math.max(0, Math.min(radius, size / 2)); const w = size, h = size;

        ctx.beginPath();
        ctx.moveTo(r, 0); ctx.lineTo(w - r, 0); ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath(); ctx.fillStyle = bg; ctx.fill();

        const iw = img.width, ih = img.height;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale, dh = ih * scale;
        const dx = (w - dw) / 2, dy = (h - dh) / 2;

        ctx.save(); ctx.clip(); ctx.drawImage(img, dx, dy, dw, dh); ctx.restore();
        ctx.lineWidth = stroke; ctx.strokeStyle = border; ctx.stroke();

        const dataURL = canvas.toDataURL("image/png");
        const markerImage = new kakao.maps.MarkerImage(dataURL, new kakao.maps.Size(size, size), { offset: new kakao.maps.Point(size / 2, size) });
        squareImageCache.set(key, markerImage); resolve(markerImage);
      } catch { resolve(undefined); }
    };
    img.onerror = () => resolve(undefined);
  });
}

function makeCircleThumbMarkerImage(kakao, src, opts = {}) {
  const { size = 48, stroke = 2, border = "#2D6FF7", bg = "#FFFFFF" } = opts;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const key = `${src}|ci|${size}|${stroke}|${border}|${bg}|${DPR}`;
  if (circleImageCache.has(key)) return Promise.resolve(circleImageCache.get(key));

  return new Promise((resolve) => {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size * DPR; canvas.height = size * DPR;
        const ctx = canvas.getContext("2d"); ctx.scale(DPR, DPR); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";

        const r = size / 2; const cx = r, cy = r;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.closePath(); ctx.fillStyle = bg; ctx.fill();

        const iw = img.width, ih = img.height;
        const scale = Math.max(size / iw, size / ih);
        const dw = iw * scale, dh = ih * scale;
        const dx = (size - dw) / 2, dy = (size - dh) / 2;

        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh); ctx.restore();

        ctx.lineWidth = stroke; ctx.strokeStyle = border;
        ctx.beginPath(); ctx.arc(cx, cy, r - stroke / 2, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

        const dataURL = canvas.toDataURL("image/png");
        const markerImage = new kakao.maps.MarkerImage(dataURL, new kakao.maps.Size(size, size), { offset: new kakao.maps.Point(size / 2, size) });
        circleImageCache.set(key, markerImage); resolve(markerImage);
      } catch { resolve(undefined); }
    };
    img.onerror = () => resolve(undefined);
  });
}





/* ===== 영화 순위 말풍선 DOM (헤더: worktype + 금액) ===== */
function buildBalloonContent({ headerText, coverSrc, onClick }) {
  const root = document.createElement("div");
  const set = (el, s) => Object.assign(el.style, s);

  // ✅ inline !important 적용 유틸
  const setI = (el, styles) => {
    Object.entries(styles).forEach(([k, v]) => {
      el.style.setProperty(k, String(v), "important");
    });
  };

  set(root, {
    position: "relative",
    width: BALLOON_WIDTH,
    background: "#2c2f38",
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,.35)",
    overflow: "hidden",
    pointerEvents: "auto",
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif",
    transformOrigin: "50% 100%",
  });

  // ===== 헤더 =====
  const header = document.createElement("div");
  // 컨테이너 스타일은 보통 중요도 충분하지만, 필요 속성은 !important로 강제
  setI(header, {
    padding: "8px 12px",
    background: "#3a3e48",
    display: "flex",
    "align-items": "center",
    "justify-content": "space-between",
  });

  // 제목을 span으로 감싸서 폰트 크기/굵기를 inline !important로 강제
  const titleSpan = document.createElement("span");
  titleSpan.textContent = headerText || "일감";
  setI(titleSpan, {
    "font-size": "13px",      // ✅ index의 !important 보다 강함
    "font-weight": "800",
    "letter-spacing": "-0.2px",
    flex: "1 1 auto",
    overflow: "hidden",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
  });

  const arrow = document.createElement("span");
  arrow.textContent = "›";
  setI(arrow, { opacity: ".7", "font-size": "16px" });

  header.appendChild(titleSpan);
  header.appendChild(arrow);
  root.appendChild(header);

  // ===== 배너 =====
  const banner = document.createElement("div");
  set(banner, { position: "relative", height: `${BANNER_HEIGHT}px`, overflow: "hidden" });
  const img = document.createElement("img");
  img.src = coverSrc;
  img.alt = "cover";
  set(img, { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" });
  banner.appendChild(img);

  const grad = document.createElement("div");
  set(grad, {
    position: "absolute", left: 0, right: 0, bottom: 0, height: "40px",
    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 75%)"
  });
  banner.appendChild(grad);
  root.appendChild(banner);

  // 클릭 시 상세
  root.addEventListener("click", onClick);

  // ===== 꼬리 =====
  const tail = document.createElement("div");
  set(tail, {
    position: "absolute",
    left: "calc(50% - 10px)",
    bottom: `-${TAIL_SIZE}px`,
    width: "0",
    height: "0",
    borderLeft: `${TAIL_SIZE}px solid transparent`,
    borderRight: `${TAIL_SIZE}px solid transparent`,
    borderTop: `${TAIL_SIZE}px solid #2c2f38`,
    filter: "drop-shadow(0 3px 3px rgba(0,0,0,.2))",
  });
  root.appendChild(tail);

  return root;
}


/* ===== 컴포넌트 ===== */
export default function MobileResultMapcontainer({
  type: typeProp = "general",
  TYPE,
  catKey: catKeyProp = null,
  radiusKm = 10,
  items: itemsProp = [],
  loading = false,
  centerLat,
  centerLng,
}) {
  const type = TYPE ?? typeProp;
  const catKey = useMemo(() => (catKeyProp ?? null), [catKeyProp]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const ICON_MAP = useMemo(
    () => Object.fromEntries(DEFAULT_ITEMS.map((i) => [i.key, i.image])),
    []
  );

  const jobs = useMemo(() => {
    let arr = itemsProp || [];
    if (catKey) {
      const k = String(catKey).trim();
      arr = arr.filter((j) => {
        // 새 구조: workCategories 배열
        if (Array.isArray(j.workCategories) && j.workCategories.includes(k)) {
          return true;
        }
        // 새 구조: primaryCategory
        if (j.primaryCategory && String(j.primaryCategory).trim() === k) {
          return true;
        }

        return false;
      });
    }

    if (arr.length && typeof arr[0]?.distanceKm === "number") {
      arr = [...arr].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return arr;
  }, [itemsProp, type, catKey]);


  useEffect(() => {
    const { kakao } = window || {};
    if (!kakao?.maps) return;


    function syncLabelsToMarkers() {
      labelPairs.forEach(({ marker, overlay }) => {
        const visible = !!marker.getMap();          // 클러스터링 등으로 숨겨진 마커는 off
        overlay.setMap(labelEnabled && visible ? map : null);
      });
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 레이어
    let layer = document.getElementById(LAYER_ID);
    if (!layer) { layer = document.createElement("div"); layer.id = LAYER_ID; document.body.appendChild(layer); }
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
    Object.assign(mapDiv.style, { width: "100%", height: "100%", touchAction: "none", overscrollBehavior: "contain", opacity: "0", visibility: "hidden" });
    layer.appendChild(mapDiv);

    const hasUserCenter = Number.isFinite(Number(centerLat)) && Number.isFinite(Number(centerLng));
    const defaultCenter = hasUserCenter ? new kakao.maps.LatLng(Number(centerLat), Number(centerLng)) : new kakao.maps.LatLng(37.5665, 126.978);

    const map = new kakao.maps.Map(mapDiv, {
      center: defaultCenter,
      level: 10,                               // 좀 더 축소된 기본 레벨
      disableDoubleClick: true,
      disableDoubleClickZoom: false,
    });
    map.setZoomable(true);
    map.setDraggable(true);

    const zc = new kakao.maps.ZoomControl();
    map.addControl(zc, kakao.maps.ControlPosition.RIGHT);

    // 좌표 있는 것만
    const withPos = jobs.filter((j) => {
      const info = Array.isArray(j?.WORK_INFO) ? j.WORK_INFO : [];
      const region = info.find((x) => x?.requesttype === "지역");
      return (Number.isFinite(Number(j?.latitude)) && Number.isFinite(Number(j?.longitude))) ||
        (Number.isFinite(Number(region?.latitude)) && Number.isFinite(Number(region?.longitude)));
    });

    const markers = [];
    const markerSrcs = [];
    const labelPairs = [];
    const bounds = new kakao.maps.LatLngBounds();

    let clusterer = null;
    let firstShown = false;
    const hasClusterer = !!kakao?.maps?.MarkerClusterer;

    // 상태
    let activeBalloon = null;
    let currentRich = isRichMode(map.getLevel());
    let labelEnabled = !currentRich;             // ✅ 라벨은 '심플 모드'에서만 보임
    let didInitialZoomOut = false;

    // 지도 빈 곳 클릭 → 풍선 닫고 라벨 재표시(심플 구간이면)
    kakao.maps.event.addListener(map, "click", () => {
      if (activeBalloon) { activeBalloon.setMap(null); activeBalloon = null; }
      labelEnabled = !currentRich;
      syncLabelsToMarkers();
    });

    const applyBalloonScale = () => {
      if (!activeBalloon || !activeBalloon._content) return;
      const el = activeBalloon._content;
      el.style.transformOrigin = "50% 100%";
      el.style.transform = "translateZ(0) scale(1)";   // 항상 고정 크기
    };

    const openBalloon = ({ pos, job, src }) => {
      if (!pos) return;
      if (!isRichMode(map.getLevel())) return;  // 축소 상태에선 풍선 미표시

      if (activeBalloon) { activeBalloon.setMap(null); activeBalloon = null; }

      const workType = getWorkTypeText(job);
      


      const priceText = getPriceText(job);           // ← 항상 문자열 반환
      const headerText = priceText ? `${workType} · ${priceText}` : workType;

      

      const content = buildBalloonContent({
        headerText,
        coverSrc: src,
        onClick: () => { setSelectedJob(job); setShowPopup(true); },
      });

      const balloon = new kakao.maps.CustomOverlay({
        position: pos,
        content,
        xAnchor: 0.5,
        yAnchor: 1,
        clickable: true,
        zIndex: 10000,
      });

      balloon._content = content;
      balloon.setMap(map);
      activeBalloon = balloon;
      applyBalloonScale();

      // ✅ 풍선이 뜨면 라벨 감추기
      labelEnabled = false;
      syncLabelsToMarkers();
    };

    const openNearestBalloon = () => {
      if (!withPos.length || !isRichMode(map.getLevel())) return;
      const center = map.getCenter();
      let bestIdx = 0, best = Infinity;

      withPos.forEach((job, i) => {
        const p = getLatLngFromJob(kakao, job); if (!p) return;
        const dx = p.getLat() - center.getLat(); const dy = p.getLng() - center.getLng();
        const d2 = dx * dx + dy * dy; if (d2 < best) { best = d2; bestIdx = i; }
      });

      const job = withPos[bestIdx];
      const pos = getLatLngFromJob(kakao, job);
      const src = markerSrcs[bestIdx] || job?.imageUrl || ICON_MAP[String(job.workcategory || "NOSEARCH").trim()];
      openBalloon({ pos, job, src });
    };

    (async () => {
      const level = map.getLevel();
      const initialSize = sizeByLevel(level);

      for (const job of withPos) {
        const pos = getLatLngFromJob(kakao, job);
        if (!pos) continue;

        const src = job?.imageUrl || ICON_MAP[String(job.workcategory || "NOSEARCH").trim()];
        const markerImg =
          (currentRich
            ? await makeSquareThumbMarkerImage(kakao, src, { size: initialSize, radius: 10, stroke: 2, border: "#2D6FF7", bg: "#FFFFFF" })
            : await makeCircleThumbMarkerImage(kakao, src, { size: initialSize, stroke: 2, border: "#2D6FF7", bg: "#FFFFFF" })
          ) || undefined;

        const marker = markerImg ? new kakao.maps.Marker({ position: pos, image: markerImg }) : new kakao.maps.Marker({ position: pos });
        markers.push(marker);
        markerSrcs.push(src);
        bounds.extend(pos);

        // ✅ 라벨 텍스트 = worktype (심플 모드에서만 보여줄 예정)
        const labelText = cut12(getWorkTypeText(job));
        const div = createLabelDiv(labelText);
        const overlay = new kakao.maps.CustomOverlay({ position: pos, content: div, xAnchor: 0.5, yAnchor: 0, clickable: true });
        labelPairs.push({ marker, overlay });

        div.addEventListener("click", (e) => {
          e.stopPropagation();
          openBalloon({ pos, job, src });
        });

        kakao.maps.event.addListener(marker, "click", () => openBalloon({ pos, job, src }));
      }

      if (hasClusterer && markers.length > 0) {
        clusterer = new kakao.maps.MarkerClusterer({
          map: null, averageCenter: true, minLevel: 1, disableClickZoom: true,
          calculator: [10, 30, 100],
          styles: [
            { width: "36px", height: "36px", background: "linear-gradient(135deg,#EAF3FF 0%,#FFFFFF 100%)", color: "#2D6FF7", border: "2px solid #2D6FF7", borderRadius: "18px", textAlign: "center", lineHeight: "36px", fontWeight: "800", boxShadow: "0 3px 10px rgba(0,0,0,.15)" },
            { width: "42px", height: "42px", background: "linear-gradient(135deg,#E0ECFF 0%,#FFFFFF 100%)", color: "#1D5EEA", border: "2px solid #1D5EEA", borderRadius: "21px", textAlign: "center", lineHeight: "42px", fontWeight: "800", boxShadow: "0 4px 12px rgba(0,0,0,.18)" },
            { width: "48px", height: "48px", background: "linear-gradient(135deg,#D6E6FF 0%,#FFFFFF 100%)", color: "#104AC6", border: "2px solid #104AC6", borderRadius: "24px", textAlign: "center", lineHeight: "48px", fontWeight: "800", boxShadow: "0 5px 14px rgba(0,0,0,.22)" },
          ],
        });
        clusterer.addMarkers(markers);
        kakao.maps.event.addListener(clusterer, "clusterclick", (cluster) => map.setLevel(map.getLevel() - 1, { anchor: cluster.getCenter() }));
      }

      if (withPos.length > 0 && !bounds.isEmpty()) map.setBounds(bounds, 40);
      else map.setCenter(defaultCenter);

      const syncLabelsToMarkers = () => {
        labelPairs.forEach(({ marker, overlay }) => {
          const vis = !!marker.getMap();
          overlay.setMap(labelEnabled && vis ? map : null);
        });
      };

      const firstTilesloaded = () => {
        if (firstShown) return;
        firstShown = true;

        if (hasClusterer && clusterer) clusterer.setMap(map);
        else markers.forEach((m) => m.setMap(map));

        mapDiv.style.visibility = "visible";
        mapDiv.style.opacity = "1";

        // 첫 진입 더 축소
        if (!didInitialZoomOut) {
          const cur = map.getLevel();
          const target = Math.min(13, cur + INITIAL_ZOOM_OUT_STEPS);
          if (target !== cur) map.setLevel(target);
          didInitialZoomOut = true;
        }

        // 현재 모드 반영하여 라벨/풍선 처리
        currentRich = isRichMode(map.getLevel());
        labelEnabled = !currentRich;
        syncLabelsToMarkers();
        if (currentRich) openNearestBalloon();
      };

      const switchByLevel = async () => {
        const levelNow = map.getLevel();
        const newSize = sizeByLevel(levelNow);
        const nextRich = isRichMode(levelNow);

        if (nextRich !== currentRich) {
          const imgs = await Promise.all(
            markerSrcs.map((src) =>
              nextRich
                ? makeSquareThumbMarkerImage(kakao, src, { size: newSize, radius: 10, stroke: 2, border: "#2D6FF7", bg: "#FFFFFF" })
                : makeCircleThumbMarkerImage(kakao, src, { size: newSize, stroke: 2, border: "#2D6FF7", bg: "#FFFFFF" })
            )
          );
          markers.forEach((m, i) => { const img = imgs[i]; if (img) m.setImage(img); });

          currentRich = nextRich;
          labelEnabled = !currentRich;            // ✅ 심플일 때만 라벨 ON
          syncLabelsToMarkers();

          if (!nextRich && activeBalloon) { activeBalloon.setMap(null); activeBalloon = null; }
          if (nextRich && !activeBalloon) openNearestBalloon();
        } else {
          const imgs = await Promise.all(
            markerSrcs.map((src) =>
              currentRich
                ? makeSquareThumbMarkerImage(kakao, src, { size: newSize, radius: 10, stroke: 2, border: "#2D6FF7", bg: "#FFFFFF" })
                : makeCircleThumbMarkerImage(kakao, src, { size: newSize, stroke: 2, border: "#2D6FF7", bg: "#FFFFFF" })
            )
          );
          markers.forEach((m, i) => { const img = imgs[i]; if (img) m.setImage(img); });
          syncLabelsToMarkers();
        }

        if (currentRich) applyBalloonScale();
      };

      kakao.maps.event.addListener(map, "tilesloaded", firstTilesloaded);
      kakao.maps.event.addListener(map, "zoom_changed", switchByLevel);
    })();

    return () => {
      try { layer._cleanup?.(); } catch { }
      document.body.style.overflow = prevOverflow;
      const el = document.getElementById(LAYER_ID);
      if (el) { el.innerHTML = ""; el.remove(); }
    };
  }, [jobs, ICON_MAP, centerLat, centerLng]);

  return (
    <>
      {showPopup && selectedJob && (
        <GeneralJobPopup job={selectedJob} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
