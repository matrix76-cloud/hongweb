import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { imageDB } from "../utility/imageData";
import { WORKNAME } from "../utility/work";
// import { toast } from "sonner"; // 이미 쓰고 있다면 유지
// 필요시: import { WORKNAME } from "../utility/work";

// ---------- helpers ----------
const safe = (v) => (v ?? "").toString().trim();
const toPrice = (n) =>
    typeof n === "number" && !isNaN(n) ? `${n.toLocaleString("ko-KR")}원` : null;
const timeAgo = (tsLike) => {
    if (!tsLike) return "";
    const ms = tsLike?.toMillis ? tsLike.toMillis() : tsLike;
    const diff = Date.now() - ms;
    if (diff < 60_000) return "방금";
    const m = Math.floor(diff / 60_000);
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    const d = Math.floor(h / 24);
    return `${d}일 전`;
};

// (요청) worktype 라벨
const workTypeLabel = (job) =>
    safe(job?.WORKTYPE ?? job?.worktype ?? job?.workType) || "단기 알바";


const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house, bgcolor: "#f9f9f9" },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business, bgcolor: "#f9f9f9" },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move, bgcolor: "#f9f9f9" },
  { name: WORKNAME.STORECLEAN, img: imageDB.storeclean, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ERRAND, img: imageDB.help, bgcolor: "#c6e2ff" },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook, bgcolor: "#c6e2ff" },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping, bgcolor: "#c6e2ff" },
  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool, bgcolor: "#f4f4f4" },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare, bgcolor: "#f4f4f4" },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent, bgcolor: "#f4f4f4" },
  { name: WORKNAME.LESSON, img: imageDB.lesson, bgcolor: "#f4f4f4" },
  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare, bgcolor: "#fff1c6" },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital, bgcolor: "#fff1c6" },
  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital, bgcolor: "#f9f9f9" },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CARRYLOAD, img: imageDB.carry, bgcolor: "#c6e2ff" },
  { name: WORKNAME.AIRCON, img: imageDB.aircon, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CURTAIN, img: imageDB.curtain, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ASSEMBLE, img: imageDB.assemble, bgcolor: "#f9f9f9" },
  { name: WORKNAME.STORAGE, img: imageDB.hongladywebtoon, bgcolor: "#f9f9f9" },
];



const findWorkImage = (tag) => {
const item = WorkItems.find((w) => w.name === tag);

console.log("items", tag, WorkItems);

return item?.img || imageDB.hongladywebtoon;
};

// (요청) worktype별 배지 이미지 매핑
const worktypeToImage = (wt) => {


    const key = safe(wt);

    console.log("worktypeToImage", wt, key);

    // 👉 여기서 너네가 쓰는 워크타입 키와 imageDB 매핑을 자유롭게 보강해줘
    const map = {
        // 예시 매핑 (이미지 키는 기존 프로젝트 imageDB에 맞춰 사용)
        "집 청소": imageDB.house,
        "사업장청소": imageDB.business,
        "이사청소": imageDB.move,
        "가게청소": imageDB.storeclean,
        "심부름": imageDB.help,
        "처방전전송": imageDB.recipe,
        "음식준비": imageDB.cook,
        "장보기": imageDB.shopping,
        "등하원도우미": imageDB.gooutschool,
        "아기돌봄": imageDB.babycare,
        "행사도우미": imageDB.schoolevent,
        "과외/레슨": imageDB.lesson,
        "환자돌봄": imageDB.patientcare,
        "병원이동": imageDB.hospital,
        "강아지병원": imageDB.doghospital,
        "강아지산책": imageDB.dog,
        "짐나르기": imageDB.carry,
        "에어컨": imageDB.aircon,
        "커튼": imageDB.curtain,
        "가구조립": imageDB.assemble,
        "창고정리": imageDB.hongladywebtoon,

        // 영문/코드형 키도 함께 매핑 가능 (예: WORKNAME.HOMECLEAN 등)
        HOMECLEAN: imageDB.house,
        BUSINESSCLEAN: imageDB.business,
        MOVECLEAN: imageDB.move,
        STORECLEAN: imageDB.storeclean,
        ERRAND: imageDB.help,
        RECIPETRANSMIT: imageDB.recipe,
        FOODPREPARE: imageDB.cook,
        SHOPPING: imageDB.shopping,
        GOOUTSCHOOL: imageDB.gooutschool,
        BABYCARE: imageDB.babycare,
        GOSCHOOLEVENT: imageDB.schoolevent,
        LESSON: imageDB.lesson,
        PATIENTCARE: imageDB.patientcare,
        GOHOSPITAL: imageDB.hospital,
        GODOGHOSPITAL: imageDB.doghospital,
        GODOGWALK: imageDB.dog,
        CARRYLOAD: imageDB.carry,
        AIRCON: imageDB.aircon,
        CURTAIN: imageDB.curtain,
        ASSEMBLE: imageDB.assemble,
        STORAGE: imageDB.hongladywebtoon,
    };
    return map[key] || null;
};

// ---------- styled ----------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;
`;

const CloseButton = styled.div`
  position: fixed; top: 14px; left: 14px;
  width: 36px; height: 36px;
  border: 0; border-radius: 50%;
  background: rgba(17,17,17,.65); color: #fff;
  font-size: ${() => getFontSize(22)}px !important;
  display: grid; place-items: center;
  z-index: 10001;
`;

const Hero = styled.div`
  position: relative; width: 100%;
  aspect-ratio: 16/9; background: #f6f7f9; overflow: hidden;
`;
const HeroImg = styled.img`
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
`;

// (요청) 우하단 원형 배지
const Badge = styled.div`
  position: absolute; right: 14px; bottom: 14px;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,.15);
  display: grid; place-items: center;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,.06);
`;
const BadgeImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

const Body = styled.div`
  padding: 18px 18px 96px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: ${() => getFontSize(20)}px !important;
  font-family: Pretendard-Bold, sans-serif;
  color: #111; line-height: 1.35;
`;

const MetaRow = styled.div`
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-bottom: 8px;
`;

const PriceChip = styled.span`
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff7ed; color: #c2410c;
  border: 1px solid #fed7aa;
`;

const Small = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  color: #374151;
`;

const Divider = styled.hr`
  border: none; height: 1px; background: #eee; margin: 16px 0;
`;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold, sans-serif;
  color: #111; margin-bottom: 8px;
`;

const Text = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  color: #222; line-height: 1.7; white-space: pre-line;
`;

const ListenButton = styled.div`
  margin-left: 6px; padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px; background: #f3f4f6; color: #111827;
  border: 1px solid #e5e7eb; cursor: pointer;
`;

const MapBox = styled.div`
  width: 100%; height: 220px;
  border-radius: 12px; overflow: hidden;
  background: #f5f5f5; margin-top: 8px;
`;

const FixedCTA = styled.div`
  position: fixed; left: 0; right: 0; bottom: 0px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 60px));
  background: rgba(255,255,255,.9);
  backdrop-filter: saturate(180%) blur(10px);
  border-top: 1px solid #eee;
`;
const CTAButton = styled.button`
  width: 100%; padding: 14px 16px;
  border-radius: 12px; border: 0;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 700; color: #fff; background: #1E88E5;
`;

// ---------- component ----------
export default function ShortJobDetail({ job, onClose, onChat }) {
    const img = safe(job?.imageUrl) || imageDB.hirecharacter;

    // (요청) 제목은 worktype으로
    const wt = workTypeLabel(job);
    const title = wt; // 기존: job.title || wt

    const memo = safe(job?.memo);
    const amount = toPrice(job?.pay?.amount);
    const region = safe(job?.region || job?.WORK_REGION_CONT);
    const createdAt =
        job?.createdAt?.toMillis?.() ??
        (typeof job?.CREATEDT === "number"
            ? job.CREATEDT
            : job?.CREATEDT?.toMillis?.() ?? null);
    const when = createdAt ? timeAgo(createdAt) : "";
    const distance = job?.distanceKm != null ? Number(job.distanceKm).toFixed(1) : null;

    const badgeSrc = worktypeToImage(wt); // (요청) 우하단 배지

    // kakao map
    const mapRef = useRef(null);
    useEffect(() => {
        if (!mapRef.current) return;
        const { latitude, longitude } = job || {};
        if (!latitude || !longitude) return;
        if (!window.kakao?.maps) return;
        const center = new window.kakao.maps.LatLng(latitude, longitude);
        const map = new window.kakao.maps.Map(mapRef.current, {
            center, level: 4, draggable: false,
        });
        map.setZoomable(true);
        new window.kakao.maps.Marker({ map, position: center });
        return () => { if (mapRef.current) mapRef.current.innerHTML = ""; };
    }, [job]);

    const handleListen = () => {
        const url = safe(job?.ttsUrl);
        const text = safe(job?.summaryText || memo);
        if (url) {
            const audio = new Audio(url);
            audio.play().catch(() => { });
        } else if (text) {
            const synth = window.speechSynthesis;
            if (synth) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = "ko-KR";
                synth.speak(u);
            }
        }
    };

    return (
        <Container>
            <CloseButton aria-label="닫기" onClick={onClose}>×</CloseButton>

            <Hero>
                <HeroImg src={img} onError={(e) => { e.currentTarget.src = imageDB.hirecharacter; }} alt="" />
                <Badge>
                    <BadgeImg src={findWorkImage(wt)} alt={wt} />
                </Badge>
            </Hero>

            <Body>
                <Title>{title}</Title>

                <MetaRow>
                    {amount && <PriceChip>총 {amount}</PriceChip>}
                    {region && <Small>📍 {region}</Small>}
                    {distance && <Small>· 내 위치로부터 {distance}km</Small>}
                    {when && <Small>· ⏱ {when}</Small>}
                    {(safe(job?.ttsUrl) || safe(job?.summaryText || memo)) && (
                        <ListenButton onClick={handleListen}>🎧 AI 요약 듣기</ListenButton>
                    )}
                </MetaRow>

                {memo && (
                    <>
                        <Divider />
                        <SectionTitle>상세 메모</SectionTitle>
                        <Text>{memo}</Text>
                    </>
                )}

                {(job?.latitude && job?.longitude) && (
                    <>
                        <Divider />
                        <SectionTitle>위치</SectionTitle>
                        <MapBox><div ref={mapRef} style={{ width: "100%", height: "100%" }} /></MapBox>
                    </>
                )}


            
            </Body>
            <FixedCTA>
                {onChat && <CTAButton onClick={onChat}>바로 지원 요청</CTAButton>}
            </FixedCTA>

        </Container>
    );
}
