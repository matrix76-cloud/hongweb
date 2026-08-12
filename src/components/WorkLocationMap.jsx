import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { ensureKakao } from "../utility/kakaoReady";

/**
 * 일감 상세의 위치 지도 — 아이콘을 눌러 팝업을 띄우는 대신 화면에 바로 보여준다.
 * (형 리뷰 2026-08-12: "화면이 남으니 아예 지도가 처음부터 나오게")
 */
const Wrap = styled.div`
  width: 90%;
  margin: 18px auto 0;
`;

const Label = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #131313;
  margin-bottom: 8px;
`;

const Addr = styled.div`
  font-size: 14px;
  color: #71717a;
  margin-bottom: 10px;
`;

const MapBox = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  border: 1px solid #E3E3E3;
  overflow: hidden;
`;

const WorkLocationMap = ({ latitude, longitude, address, markerimg }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!latitude || !longitude) return;
      const kakao = await ensureKakao();
      if (!kakao || !alive || !boxRef.current) return;

      const center = new kakao.maps.LatLng(latitude, longitude);
      const map = new kakao.maps.Map(boxRef.current, { center, level: 4 });
      map.setDraggable(false);
      map.setZoomable(false);

      const marker = markerimg
        ? new kakao.maps.Marker({
            position: center,
            image: new kakao.maps.MarkerImage(markerimg, new kakao.maps.Size(40, 40)),
          })
        : new kakao.maps.Marker({ position: center });
      marker.setMap(map);
    })();
    return () => { alive = false; };
  }, [latitude, longitude, markerimg]);

  if (!latitude || !longitude) return null;

  return (
    <Wrap>
      <Label>위치</Label>
      {address && <Addr>{address}</Addr>}
      <MapBox ref={boxRef} />
    </Wrap>
  );
};

export default WorkLocationMap;
