import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ensureKakao } from "../utility/kakaoReady";

/**
 * 일감 상세의 위치 지도 — 아이콘을 눌러 팝업을 띄우는 대신 화면에 바로 보여준다.
 * (형 리뷰 2026-08-12: "화면이 남으니 아예 지도가 처음부터 나오게")
 *
 * 지도는 기본으로 잠겨 있다.
 * 화면 가운데에 지도가 있으면 손가락이 지도에 닿는 순간 지도가 터치를 먹어
 * 페이지가 내려가지 않는다. 그래서 잠긴 동안에는 터치를 통과시키고,
 * 지도를 움직여 봐야 할 때만 버튼으로 풀어 쓰게 했다. (형 지시 2026-08-18)
 */
const Wrap = styled.div`
  /* 위아래 형제(정보 목록·사진 격자)와 같은 폭이어야 한다.
     예전에는 여기만 90% 라 이 칸부터 갑자기 안으로 들어가 보였다. (형 지적 2026-08-18) */
  width: 100%;
  margin: 22px 0 0;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 6px;
`;

/* 위 칸들(요청 내용·참고 사진)과 같은 제목 서식 (형 지적 2026-08-18) */
const Label = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
`;

const Toggle = styled.button`
  border: 1px solid var(--border);
  background: ${({ $on }) => ($on ? "var(--text)" : "var(--surface)")};
  color: ${({ $on }) => ($on ? "var(--surface)" : "var(--text)")};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
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
  border: 1px solid var(--border);
  overflow: hidden;

  /* 잠겨 있을 때는 터치가 지도를 지나쳐 페이지가 그대로 스크롤된다 */
  pointer-events: ${({ $unlocked }) => ($unlocked ? "auto" : "none")};
`;

/* 로드뷰는 지도와 같은 자리에 겹쳐 둔다 — 버튼으로 앞뒤를 바꾼다 */
const RoadviewBox = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
`;

const WorkLocationMap = ({ latitude, longitude, address, markerimg }) => {
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const [unlocked, setUnlocked] = useState(false);

  /* 로드뷰 (형 지시 2026-08-19)
     찾아가는 일이 많아서, 골목이 어떤지 미리 보면 도움이 된다.
     항상 띄우지는 않는다 — 파노라마는 계속 받아와서 화면이 무거워진다.
     그리고 근처에 로드뷰가 아예 없는 골목도 많다. 없으면 버튼을 아예 안 보여준다.
     (눌렀는데 검은 화면이 뜨는 게 제일 나쁘다) */
  const rvBoxRef = useRef(null);
  const panoRef = useRef(null);
  const kakaoRef = useRef(null);
  const [hasRoadview, setHasRoadview] = useState(false);
  const [roadview, setRoadview] = useState(false);

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
      mapRef.current = map;

      const marker = markerimg
        ? new kakao.maps.Marker({
            position: center,
            image: new kakao.maps.MarkerImage(markerimg, new kakao.maps.Size(40, 40)),
          })
        : new kakao.maps.Marker({ position: center });
      marker.setMap(map);

      // 근처에 로드뷰가 있는지만 먼저 확인한다 (파노라마는 아직 안 받는다)
      kakaoRef.current = kakao;
      try {
        const client = new kakao.maps.RoadviewClient();
        client.getNearestPanoId(center, 100, (panoId) => {
          if (!alive) return;
          panoRef.current = panoId || null;
          setHasRoadview(!!panoId);
        });
      } catch (e) {
        setHasRoadview(false);
      }
    })();
    return () => { alive = false; };
  }, [latitude, longitude, markerimg]);

  /* 로드뷰를 켤 때 그 자리에서 파노라마를 만든다 */
  useEffect(() => {
    if (!roadview) return;
    const kakao = kakaoRef.current;
    if (!kakao || !rvBoxRef.current || !panoRef.current) return;

    const rv = new kakao.maps.Roadview(rvBoxRef.current);
    rv.setPanoId(panoRef.current, new kakao.maps.LatLng(latitude, longitude));
  }, [roadview, latitude, longitude]);

  const toggle = () => {
    const next = !unlocked;
    setUnlocked(next);
    const map = mapRef.current;
    if (!map) return;
    map.setDraggable(next);
    map.setZoomable(next);
    map.relayout();   // 잠금이 바뀌면서 크기 계산이 틀어지는 걸 막는다
  };

  if (!latitude || !longitude) return null;

  return (
    <Wrap>
      <Head>
        <Label>위치</Label>
        <Buttons>
          {hasRoadview && (
            <Toggle type="button" $on={roadview} onClick={() => setRoadview((v) => !v)}>
              {roadview ? "지도로" : "로드뷰"}
            </Toggle>
          )}
          {!roadview && (
            <Toggle type="button" $on={unlocked} onClick={toggle}>
              {unlocked ? "지도 잠그기" : "지도 움직이기"}
            </Toggle>
          )}
        </Buttons>
      </Head>
      {address && <Addr>{address}</Addr>}

      {/* 지도는 자리를 지키게 두고 로드뷰만 위에 얹는다 — 다시 돌아왔을 때 새로 그리지 않아도 된다 */}
      <MapBox ref={boxRef} $unlocked={unlocked} style={roadview ? { display: 'none' } : undefined} />
      {roadview && <RoadviewBox ref={rvBoxRef} />}
    </Wrap>
  );
};

export default WorkLocationMap;
