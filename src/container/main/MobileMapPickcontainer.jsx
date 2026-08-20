import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdPlace, MdMyLocation, MdSearch } from "react-icons/md";
import localforage from "localforage";
import { UserContext } from "../../context/User";
import { DataContext } from "../../context/Data";
import { coordToRegion, getCurrentCoords, waitKakao } from "../../utility/geo";
import { ReadWork } from "../../service/WorkService";

/**
 * 지도로 위치지정 — seekone 의 MapPick 을 그대로 옮겼다. (형 리뷰 2026-08-12)
 *
 * 카카오맵 + 화면 중앙 고정핀. 지도를 드래그하면 핀은 중앙에 붙어 있고 지도가 움직인다.
 * 멈출 때(idle)마다 중심 좌표를 역지오코딩해서 "시 구 동" 을 위에 띄운다.
 * 하단: [이 위치로 검색] = 저장 후 홈 / [내 위치로 저장] = 저장 후 뒤로.
 *
 * 기존 /Mobilemapreconfig(다음 우편번호로 주소 등록·관리)는 그대로 두고, 이 화면을 따로 뒀다.
 */

// 지도 초기 중심 폴백 — GPS·저장좌표 둘 다 없을 때만 쓴다 (남양주시 다산동)
const BASE = { lat: 37.6104, lng: 127.1626 };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
  background: var(--surface);
`;

const MapArea = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const MapCanvas = styled.div`
  position: absolute;
  inset: 0;
`;

const FailBox = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  color: #71717a;
  font-size: 15px;
  line-height: 1.6;
  background: repeating-linear-gradient(45deg, #eef1f4, #eef1f4 18px, #e7ebef 18px, #e7ebef 36px);
`;

// 화면 중앙 고정핀 — 지도를 움직여도 항상 가운데
const CenterPin = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -100%);
  z-index: 20;
  pointer-events: none;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
`;

const LabelPill = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  max-width: calc(100% - 32px);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CurrentBtn = styled.button`
  position: absolute;
  right: 16px;
  bottom: 20px;
  z-index: 30;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BottomBar = styled.div`
  flex: none;
  display: flex;
  gap: 10px;
  padding: 12px 16px calc(12px + var(--safe-bottom));
  border-top: 1px solid var(--border-soft);
`;

const GhostBtn = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 12px;
  border: 1px solid #FF4E19;
  background: var(--surface);
  color: #FF4E19;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  opacity: ${({$enable}) => ($enable ? 1 : 0.5)};
`;

const PrimaryBtn = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 12px;
  border: none;
  background: #FF4E19;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  opacity: ${({$enable}) => ($enable ? 1 : 0.5)};
`;

const MobileMapPickcontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const { data, datadispatch } = useContext(DataContext);

  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const [label, setLabel] = useState("");
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 지도 초기화 후 idle 마다 중심 좌표를 역지오코딩한다
    const setupMap = (kakao, map) => {
      let timer = null;
      const resolveCenter = () => {
        const c = map.getCenter();
        const lat = c.getLat();
        const lng = c.getLng();
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          coordToRegion(lat, lng)
            .then(({ label: l }) => { if (!cancelled) setLabel(l); })
            .catch(() => { if (!cancelled) setLabel(""); });
        }, 120);
      };
      kakao.maps.event.addListener(map, "idle", resolveCenter);
      resolveCenter();
    };

    const createMap = (kakao, { lat, lng }) => {
      if (cancelled || !mapEl.current || mapRef.current) return;
      const map = new kakao.maps.Map(mapEl.current, {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4,
      });
      mapRef.current = map;
      setupMap(kakao, map);
    };

    // SDK 는 index.html 에서 autoload=false 로 받으므로 준비될 때까지 기다린다.
    // 그다음 GPS 우선, 실패하면 저장된 좌표 → 기본 좌표 순으로 폴백한다.
    waitKakao()
      .then((kakao) => {
        getCurrentCoords()
          .then((coords) => createMap(kakao, coords))
          .catch(() => {
            const saved = user.latitude != null ? { lat: user.latitude, lng: user.longitude } : BASE;
            createMap(kakao, saved);
          });
      })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => { cancelled = true; };
  }, []);

  // 우하단 — 현재 위치로 지도 이동
  const _handlecurrent = () => {
    const map = mapRef.current;
    if (!map) return;
    getCurrentCoords()
      .then(({ lat, lng }) => {
        map.setCenter(new window.kakao.maps.LatLng(lat, lng));
      })
      .catch(() => {});
  };

  /**
   * 지도 중심 좌표와 라벨을 함께 저장한다.
   * 화면에 보이는 지역과 거리 계산에 쓰는 좌표가 어긋나지 않게 한 번에 넣는다.
   */
  const save = async (gohome) => {
    const center = mapRef.current?.getCenter();
    if (!label || !center || saving) return;

    setSaving(true);
    const latitude = center.getLat();
    const longitude = center.getLng();

    user.address_name = label;
    user.latitude = latitude;
    user.longitude = longitude;

    try {
      await localforage.setItem("userconfig", user);
    } catch (err) {
      console.error("Error saving userconfig:", err);
    }
    dispatch(user);

    if (gohome) {
      // 이 위치 기준으로 일감을 다시 읽어 홈으로
      try {
        const workitems = await ReadWork({ latitude, longitude });
        data.workitems = workitems;
        datadispatch(data);
      } catch (err) {
        console.error("Error reading work:", err);
      }
      setSaving(false);
      navigate("/Mobilemain");
      return;
    }

    setSaving(false);
    navigate(-1);
  };

  return (
    <Container style={containerStyle}>
      <MapArea>
        <MapCanvas ref={mapEl} />

        {failed && (
          <FailBox>
            지도를 불러오지 못했어요.
            <br />
            네트워크·지도 키 설정을 확인해 주세요.
          </FailBox>
        )}

        {!failed && (
          <CenterPin>
            <MdPlace size={44} color="#FF4E19" />
          </CenterPin>
        )}

        <LabelPill>
          <MdPlace size={16} color="#FF4E19" style={{ flex: "none" }} />
          {label || "지도를 움직여 위치를 맞춰주세요"}
        </LabelPill>

        {!failed && (
          <CurrentBtn onClick={_handlecurrent} aria-label="현재 위치">
            <MdMyLocation size={22} color="#FF4E19" />
          </CurrentBtn>
        )}
      </MapArea>

      <BottomBar>
        <GhostBtn $enable={!!label} disabled={!label || saving} onClick={() => save(true)}>
          <MdSearch size={18} /> 이 위치로 검색
        </GhostBtn>
        <PrimaryBtn $enable={!!label} disabled={!label || saving} onClick={() => save(false)}>
          내 위치로 저장
        </PrimaryBtn>
      </BottomBar>
    </Container>
  );
};

export default MobileMapPickcontainer;
