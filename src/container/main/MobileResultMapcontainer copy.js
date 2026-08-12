// 📄 MobileResultMapcontainer.js (클러스터 최초 표출 개선 버전)
import React, { useEffect, useMemo, useState } from "react";
import GeneralJobPopup from "../../modal/GeneralJobPopup";
import { DEFAULT_ITEMS } from "../../utility/categories";

// 고정 레이어 치수
const HEADER_PX = 52;
const FOOTER_PX = 65;
const LAYER_ID = "result-map-layer";

// 합성 마커 이미지 캐시 (DPR 대응)
const circleImageCache = new Map();
function makeCircleMarkerImage(
  kakao,
  src,
  { size = 40, inner = 28, stroke = 2, border = "#2D6FF7", fill = "#FFFFFF" } = {}
) {
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const cacheKey = `${src}|${size}|${inner}|${stroke}|${border}|${fill}|${DPR}`;
  if (circleImageCache.has(cacheKey)) return Promise.resolve(circleImageCache.get(cacheKey));

  return new Promise((resolve) => {
    const imgEl = new Image();
    imgEl.crossOrigin = "anonymous";
    imgEl.src = src;

    imgEl.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size * DPR;
        canvas.height = size * DPR;
        const ctx = canvas.getContext("2d");

        ctx.scale(DPR, DPR);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // 배경 원
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, (size - stroke) / 2, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.lineWidth = stroke;
        ctx.strokeStyle = border;
        ctx.stroke();

        // 중앙 아이콘
        const x = (size - inner) / 2;
        const y = (size - inner) / 2;
        ctx.drawImage(imgEl, x, y, inner, inner);

        const dataURL = canvas.toDataURL("image/png");
        const markerImage = new kakao.maps.MarkerImage(
          dataURL,
          new kakao.maps.Size(size, size),
          { offset: new kakao.maps.Point(size / 2, size / 2) }
        );

        circleImageCache.set(cacheKey, markerImage);
        resolve(markerImage);
      } catch {
        // CORS 등으로 toDataURL 실패 시 undefined 반환 → 기본 마커로 폴백
        resolve(undefined);
      }
    };

    imgEl.onerror = () => resolve(undefined);
  });
}

// 제목 라벨 DOM 생성(글자만, 작게, 아래로)
function createLabelDiv(text) {
  const div = document.createElement("div");
  const set = (prop, val) => div.style.setProperty(prop, val, "important");

  set("display", "inline-block");
  set("max-width", "80px");
  set("padding", "0 2px");
  set("border", "none");
  set("background", "transparent");
  set("color", "#333");
  set("font-family", "Pretendard-SemiBold, Pretendard, system-ui, -apple-system, sans-serif");
  set("font-size", "11px");
  set("line-height", "14px");
  set("white-space", "nowrap");
  set("overflow", "hidden");
  set("text-overflow", "ellipsis");
  set("transform", "translateY(14px)");
  set("pointer-events", "auto");
  set("user-select", "none");
  // 지도 위 가독성 보강(얇은 흰색 외곽)
  set("text-shadow", "0 1px 2px rgba(255,255,255,.9), 0 0 2px rgba(255,255,255,.9)");

  div.textContent = text;
  return div;
}

// 텍스트 10자로 자르기
const cut10 = (s = "") => (s.length > 10 ? s.slice(0, 10) + "…" : s);

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

  // 팝업 상태
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // 카테고리 → 아이콘 이미지 매핑
  const ICON_MAP = useMemo(
    () => Object.fromEntries(DEFAULT_ITEMS.map(i => [i.key, i.image])),
    []
  );

  // 리스트와 동일한 필터/정렬
  const jobs = useMemo(() => {
    let arr = itemsProp;
    if (type === "general" && catKey) {
      const k = String(catKey).trim();
      arr = arr.filter(j => String(j.workcategory).trim() === k);
    }
    if (arr.length && typeof arr[0]?.distanceKm === "number") {
      arr = [...arr].sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return arr;
  }, [itemsProp, type, catKey]);

  useEffect(() => {
    const { kakao } = window || {};
    if (!kakao?.maps) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 고정 레이어
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

    // 지도 DOM (초기 프레임 숨김)
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

    const hasUserCenter =
      Number.isFinite(Number(centerLat)) && Number.isFinite(Number(centerLng));
    const defaultCenter = hasUserCenter
      ? new kakao.maps.LatLng(Number(centerLat), Number(centerLng))
      : new kakao.maps.LatLng(37.5665, 126.9780);

    const map = new kakao.maps.Map(mapDiv, {
      center: defaultCenter,
      level: 5,
      disableDoubleClick: true,
      disableDoubleClickZoom: true,
    });
    map.setZoomable(false); // 제스처 줌 OFF (컨트롤만 사용)
    map.setDraggable(true);

    const zc = new kakao.maps.ZoomControl();
    map.addControl(zc, kakao.maps.ControlPosition.RIGHT);

    const withPos = jobs.filter(
      j => Number.isFinite(Number(j.latitude)) && Number.isFinite(Number(j.longitude))
    );

    const markers = [];
    const labelPairs = []; // { marker, overlay }
    const bounds = new kakao.maps.LatLngBounds();

    let clusterer = null;
    const hasClusterer = !!kakao?.maps?.MarkerClusterer;
    let firstShown = false;

    (async () => {
      for (const j of withPos) {
        const lat = Number(j.latitude);
        const lng = Number(j.longitude);
        const pos = new kakao.maps.LatLng(lat, lng);

        // 합성 아이콘
        const key = String(j.workcategory || "NOSEARCH").trim();
        const src = ICON_MAP[key] || ICON_MAP["NOSEARCH"];
        const img = await makeCircleMarkerImage(kakao, src, {
          size: 40, inner: 28, stroke: 2, border: "#2D6FF7", fill: "#FFFFFF",
        });

        // 마커 (초기엔 지도에 올리지 않음)
        const marker = img
          ? new kakao.maps.Marker({ position: pos, image: img })
          : new kakao.maps.Marker({ position: pos }); // 폴백
        markers.push(marker);
        bounds.extend(pos);

        // 라벨(표출 타이밍에 붙일 예정)
        const title = cut10(j.title || j.PBANC_TTL_NM || "");
        if (title) {
          const div = createLabelDiv(title);
          const overlay = new kakao.maps.CustomOverlay({
            position: pos,
            content: div,
            xAnchor: 0.5,
            yAnchor: 0,
            clickable: true,
          });
          labelPairs.push({ marker, overlay });
          div.addEventListener("click", () => {
            setSelectedJob(j);
            setShowPopup(true);
          });
        }

        kakao.maps.event.addListener(marker, "click", () => {
          setSelectedJob(j);
          setShowPopup(true);
        });
      }

      // 클러스터러: map:null 로 시작 (첫 프레임 표출 시 적용)
      if (hasClusterer && markers.length > 0) {
        clusterer = new kakao.maps.MarkerClusterer({
          map: null,
          averageCenter: true,
          minLevel: 1,
          disableClickZoom: true,
          calculator: [10, 30, 100],
          styles: [
            {
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg,#EAF3FF 0%,#FFFFFF 100%)',
              color: '#2D6FF7', border: '2px solid #2D6FF7',
              borderRadius: '18px', textAlign: 'center', lineHeight: '36px',
              fontWeight: '800', boxShadow: '0 3px 10px rgba(0,0,0,.15)'
            },
            {
              width: '42px', height: '42px',
              background: 'linear-gradient(135deg,#E0ECFF 0%,#FFFFFF 100%)',
              color: '#1D5EEA', border: '2px solid #1D5EEA',
              borderRadius: '21px', textAlign: 'center', lineHeight: '42px',
              fontWeight: '800', boxShadow: '0 4px 12px rgba(0,0,0,.18)'
            },
            {
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg,#D6E6FF 0%,#FFFFFF 100%)',
              color: '#104AC6', border: '2px solid #104AC6',
              borderRadius: '24px', textAlign: 'center', lineHeight: '48px',
              fontWeight: '800', boxShadow: '0 5px 14px rgba(0,0,0,.22)'
            }
          ]
        });
        clusterer.addMarkers(markers);
        kakao.maps.event.addListener(clusterer, "clusterclick", (cluster) => {
          map.setLevel(map.getLevel() - 1, { anchor: cluster.getCenter() });
        });
      }

      // bounds 우선 적용
      if (withPos.length > 0 && !bounds.isEmpty()) {
        map.setBounds(bounds, 40);
      } else {
        map.setCenter(defaultCenter);
      }

      // 라벨 가시성 = '마커가 지도에 보일 때만'
      const syncLabelsToMarkers = () => {
        labelPairs.forEach(({ marker, overlay }) => {
          const isVisible = !!marker.getMap(); // 클러스터에 포함되면 null
          overlay.setMap(isVisible ? map : null);
        });
      };

      // 첫 타일 로딩 후 한 번에 표출 (초기 확대→축소 점프 제거)
      const firstTilesloaded = () => {
        if (firstShown) return;
        firstShown = true;

        if (hasClusterer && clusterer) {
          clusterer.setMap(map);
        } else {
          markers.forEach(m => m.setMap(map));
        }

        // 라벨 attach 후 동기화
        labelPairs.forEach(({ overlay }) => overlay.setMap(map));
        syncLabelsToMarkers();

        // 이제 보여주기
        mapDiv.style.visibility = "visible";
        mapDiv.style.opacity = "1";
      };

      kakao.maps.event.addListener(map, "tilesloaded", firstTilesloaded);
      kakao.maps.event.addListener(map, "idle", syncLabelsToMarkers);

      // 정리 핸들러 등록
      layer._cleanup = () => {
        try {
          kakao.maps.event.removeListener(map, "tilesloaded", firstTilesloaded);
          kakao.maps.event.removeListener(map, "idle", syncLabelsToMarkers);
        } catch { }
        try {
          labelPairs.forEach(({ overlay }) => overlay.setMap(null));
        } catch { }
        try {
          clusterer?.clear();
          clusterer?.setMap(null);
        } catch { }
      };
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
        <GeneralJobPopup
          job={selectedJob}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
