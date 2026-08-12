// src/components/cards/CampDetailSheet.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { ReadCampingRegion } from "../../service/LifeService";
import { getFontSize } from "../../utility/fontsize";

async function getCampingDetailById(campId) {
  const regions = await ReadCampingRegion(); // [{ campingitem: "<xml...>" }, ...]
  const parser = new DOMParser();

  const items = regions.flatMap((r) => {
    const xmlDoc = parser.parseFromString(r.campingitem, "text/xml");
    const els = Array.from(xmlDoc.getElementsByTagName("item"));
    const get = (el, tag) => el.getElementsByTagName(tag)[0]?.textContent ?? "";
    return els.map((el) => ({
      id: get(el, "contentId"),
      name: get(el, "facltNm"),
      facltNm: get(el, "facltNm"),
      addr1: get(el, "addr1"),
      animalCmgCl: get(el, "animalCmgCl"),
      firstImageUrl: get(el, "firstImageUrl"),
      tel: get(el, "tel"),
      homepage: get(el, "homepage"),
      caravInnerFclty: get(el, "caravInnerFclty"),
      lineIntro: get(el, "lineIntro"),
      intro: get(el, "intro"),
      mapX: get(el, "mapX"),
      mapY: get(el, "mapY"),
    }));
  });

  return items.find((c) => String(c.id) === String(campId)) || null;
}

const BasicLevel = 8;

const detailmapstyle = {
  overflow: "hidden",
  width: "100%",
  height: "170px",
  marginTop: "10px",
  borderRadius: "12px",
};

const CampingData = ({ open = true, camping, item, onClose }) => {
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);     // 지도 컨테이너
  const mapObjRef = useRef(null);  // 생성된 지도 객체 저장

  // 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // 상세 로딩 (camping.id 기반)
  useEffect(() => {
    if (!open || !camping?.id) {
      setCamp(null);
      return;
    }
    let alive = true;
    (async () => {
      setLoading(true);
      const detail = await getCampingDetailById(camping.id);
      if (alive) setCamp(detail);
      if (alive) setLoading(false);
      console.log("Fetched camping data:", detail);
    })();
    return () => { alive = false; };
  }, [open, camping?.id]);

  // camp 상세 준비 후 지도 그리기
  useEffect(() => {
    if (!open || !camp || !mapRef.current) return;
    const { kakao } = window;
    if (!kakao?.maps) {
      console.warn("kakao.maps가 로드되지 않았습니다. 스크립트 로딩을 확인하세요.");
      return;
    }

    const lat = Number(camp.mapY);
    const lng = Number(camp.mapX);
    const hasCoord = isFinite(lat) && isFinite(lng);

    const center = hasCoord
      ? new kakao.maps.LatLng(lat, lng)
      : new kakao.maps.LatLng(37.5665, 126.9780); // fallback: 서울 시청

    const map = new kakao.maps.Map(mapRef.current, { center, level: BasicLevel });
    mapObjRef.current = map;

    if (hasCoord) {
      const marker = new kakao.maps.Marker({ position: center });
      marker.setMap(map);
    }

    // 모달 렌더 후 레이아웃 다시 계산
    setTimeout(() => {
      map.relayout();
      map.setCenter(center);
    }, 0);
  }, [open, camp?.mapX, camp?.mapY]);

  const stop = (e) => e.stopPropagation();
  if (!open || !camping) return null;

  return createPortal(
    <Overlay role="dialog" aria-modal="true" onClick={onClose}>
      <Panel onClick={stop} tabIndex={-1}>
        <Header>
          <Title>{camp?.facltNm || camp?.name || "캠핑장"}</Title>
          <CloseBtn onClick={onClose} aria-label="닫기">×</CloseBtn>
        </Header>

        {camp?.firstImageUrl && (
          <Hero>
            <img src={camp.firstImageUrl} alt={camp?.name || ""} />
          </Hero>
        )}

        <Body>
          {loading && <StateText>불러오는 중…</StateText>}

          {!loading && camp && (
            <>
              {camp.addr1 && (
                <Section>
                  <Label>주소</Label>
                  <Value>{camp.addr1}</Value>
                </Section>
              )}

              {camp.animalCmgCl && (
                <Section>
                  <Label>반려동물</Label>
                  <Value>{camp.animalCmgCl}</Value>
                </Section>
              )}

              {camp.caravInnerFclty && (
                <Section>
                  <Label>시설</Label>
                  <Value>{camp.caravInnerFclty}</Value>
                </Section>
              )}

              {camp.lineIntro && (
                <Section>
                  <Label>요약</Label>
                  <Value>{camp.lineIntro}</Value>
                </Section>
              )}

              {camp.intro && (
                <Section>
                  <Label>소개글</Label>
                  <Value>{camp.intro}</Value>
                </Section>
              )}

              <Section>
                <Label>위치정보</Label>
                <div ref={mapRef} style={detailmapstyle} />
              </Section>

              {(camp.tel || camp.homepage) && (
                <Section>
                  <Label>연락/홈페이지</Label>
                  <Links>
                    {camp.tel && <a href={`tel:${camp.tel}`}>{camp.tel}</a>}
                    {camp.homepage && (
                      <a href={camp.homepage} target="_blank" rel="noreferrer">
                        {camp.homepage}
                      </a>
                    )}
                  </Links>
                </Section>
              )}

              <BottomPad />
            </>
          )}
        </Body>
      </Panel>
    </Overlay>,
    document.body
  );
};

export default CampingData;

/* ---------------- styles ---------------- */

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
  overscroll-behavior: contain;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 720px;
  background: #111; color: #fff;
  border-radius: 16px 16px 0 0;
  display: flex; flex-direction: column;
  max-height: calc(100dvh - 10px);
  overflow: hidden;
`;

const Header = styled.div`
  position: sticky; top: 0; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: #111;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

const Title = styled.div`
  font-weight: 700; font-size: 18px;
`;

const CloseBtn = styled.div`
  width: 36px; height: 36px; border: 0; border-radius: 10px;
  background: rgba(255,255,255,0.1); color: #fff; line-height: 1;
  cursor: pointer; touch-action: manipulation;
  font-size: ${() => getFontSize(22)}px !important;
  display: flex; align-items: center; justify-content: center;

`;

const Hero = styled.div`
  padding: 12px 12px 0;
  img { width: 100%; max-height: 42vh; object-fit: cover; border-radius: 12px; display:block; }
`;

const Body = styled.div`
  flex: 1; min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 12px 16px 0;
`;

const Section = styled.div`
  & + & { margin-top: 14px; }
`;

const Label = styled.div`
  font-size: 12px; color: #aaa; margin-bottom: 6px;
`;

const Value = styled.div`
  line-height: 1.55; font-size: 14px;
`;

const Links = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap;
  a { color: #99d0ff; text-decoration: none; border-bottom: 1px dashed #99d0ff80; }
`;

const StateText = styled.div`
  color: #bbb; padding: 18px 0; text-align: center;
`;

const BottomPad = styled.div`
  height: calc(20px + env(safe-area-inset-bottom));
`;
