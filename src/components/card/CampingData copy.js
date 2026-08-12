// src/components/cards/CampDetailSheet.jsx
import React, { useEffect } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { ReadCampingRegion } from "../../service/LifeService";

async function getCampingDetailById(campId) {
  const regions = await ReadCampingRegion(); // [{ campingitem: "<xml...>" }, ...] 라는 가정
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
      mapX : get(el, "mapX"),
      mapY: get(el, "mapY"),
      // 필요시 더 추가…
    }));
  });

  return items.find((c) => String(c.id) === String(campId)) || null;
}

const BasicLevel = 8;

const detailmapstyle = {
  overflow: "hidden",
  width: '100%',
  height: '370px',
  marginTop: "10px"
};

const { kakao } = window;

const CampingData = ({ open = true, camping, item, onClose }) => {
  // ✅ 훅 없이 단순 계산: 훅 개수 변동 없음
 
  const [camp, setCamp] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // ✅ 훅은 항상 동일 순서/개수로 호출
  // 배경 스크롤 잠금 + ESC 닫기 (open && camp 일 때만 동작)
  useEffect(() => {
    if (!open || !camping) return;

    setLoading(false);

    async function DetailListmapDraw() {

      const latitude = parseFloat(camp.mapY);
      const longitude = parseFloat(camp.mapX);

      var mapContainer = document.getElementById('detailmap'), // 지도를 표시할 div 
        mapOption = {
          center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
          level: BasicLevel // 지도의 확대 레벨
        };

      var map = new kakao.maps.Map(mapContainer, mapOption);



      var imageSrc = imageDB.movegps; // 마커 이미지의 URL
      var imageSize = new kakao.maps.Size(36, 36); // 마커 이미지의 크기
      var imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커의 좌표에 일치시킬 이미지 안의 좌표

      // MarkerImage 객체 생성
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);


      const marker = new kakao.maps.Marker({
        position: markerPosition, // 시작점에 마커 배치
        image: markerImage, //
        map,
      });


    }
    async function fetchDetail() {
      const detail = await getCampingDetailById(camping.id); // camp 전체 말고 id만
      setCamp(detail);
      console.log("Fetched camping data:", detail);

      DetailListmapDraw();
     
      
      setLoading(true);
    }
    fetchDetail();

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
  }, [open, camping, onClose]);

  const stop = (e) => e.stopPropagation();

  // ✅ 훅 호출 다 끝난 다음에 반환
  if (!open || !camping) return null;

  return createPortal(
    <Overlay role="dialog" aria-modal="true" onClick={onClose}>

      {loading && (<Panel onClick={stop} tabIndex={-1}>
        <Header>
          <Title>{camp.facltNm || "캠핑장"}</Title>
          <CloseBtn onClick={onClose} aria-label="닫기">×</CloseBtn>
        </Header>

        {(camp.firstImageUrl) && (
          <Hero>
            <img src={camp.firstImageUrl} alt={camp.name || ""} />
          </Hero>
        )}

        <Body>
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

          {camp.theme_tags?.length ? (
            <Section>
              <Label>테마</Label>
              <Chips>
                {camp.theme_tags.map((t) => <Chip key={t}>{t}</Chip>)}
              </Chips>
            </Section>
          ) : null}

          {camp.amenities?.length ? (
            <Section>
              <Label>편의시설</Label>
              <Chips>
                {camp.amenities.map((a) => <Chip key={a}>{a}</Chip>)}
              </Chips>
            </Section>
          ) : null}

          {(camp.tel || camp.homepage) && (
            <Section>
              <Label>연락/홈페이지</Label>
              <Links>
                {camp.tel && <a href={`tel:${camp.tel}`}>{camp.tel}</a>}
                {camp.homepage && (
                  <a href={camp.homepage} target="_blank" rel="noreferrer">{camp.homepage}</a>
                )}
              </Links>
            </Section>
          )}


          {
            camp.caravInnerFclty &&
            <Section>
            <Label>시설</Label>
            <Value>{camp.caravInnerFclty}</Value>
            </Section>
          }
          {
            camp.lineIntro &&
            <Section>
              <Label>요약</Label>
                <Value>{camp.lineIntro}</Value>
            </Section>
          }
          {
            camp.intro &&
            <Section>
              <Label>소개글</Label>
                <Value>{camp.intro}</Value>
            </Section>
          }

          <Section>
            <Label>위치정보</Label>
            <div id="detailmap" className="Map" style={detailmapstyle}></div>
          </Section>


          <BottomPad />
        </Body>
      </Panel>)}
    
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
  max-height: calc(100dvh - 10px); /* 화면 높이 제한 */
  overflow: hidden;                /* 헤더/히어로 고정 */
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

const CloseBtn = styled.button`
  width: 36px; height: 36px; border: 0; border-radius: 10px;
  background: rgba(255,255,255,0.1); color: #fff; font-size: 22px; line-height: 1;
  cursor: pointer; touch-action: manipulation;
`;

const Hero = styled.div`
  padding: 12px 12px 0;
  img { width: 100%; max-height: 42vh; object-fit: cover; border-radius: 12px; display:block; }
`;

const Body = styled.div`
  flex: 1; min-height: 0;           /* 🔑 flex 내부 스크롤 */
  overflow-y: auto;                 /* 내부만 스크롤 */
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

const Chips = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px;
`;

const Chip = styled.span`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px; padding: 4px 8px; font-size: 12px;
`;

const Links = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap;
  a { color: #99d0ff; text-decoration: none; border-bottom: 1px dashed #99d0ff80; }
`;

const BottomPad = styled.div`
  height: calc(20px + env(safe-area-inset-bottom));
`;
