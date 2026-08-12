// 📄 src/components/ShortJobCard.jsx
import React from "react";
import styled, { css } from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { imageDB } from "../utility/imageData";
import { COLORS } from "../utility/colors";
import ShortJobPopup from "../modal/ShortJobPopup";
import ShortJobDetail from "./ShortJobDetail";

/* ---------- Helpers ---------- */
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

const safe = (v) => (v ?? "").toString().trim();
const workTypeLabel = (job) =>
    safe(job?.WORKTYPE ?? job?.worktype ?? job?.workType) || "단기 알바";

/* ---------- UI ---------- */
const Card = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 14px;
  background: #fff;
  margin-bottom: 12px;
  transition: box-shadow 0.18s ease, transform 0.12s ease;
  &:active {
    transform: scale(0.995);
  }
  ${({ $clickable }) =>
        $clickable &&
        css`
      cursor: pointer;
      &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }
    `}
`;

const Hero = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  background: #f6f7f9;
  border: 1px solid #eee;
  @supports not (aspect-ratio: 16/9) {
    height: 0;
    padding-top: 56.25%;
  }
`;
const HeroImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Body = styled.div`
  display: grid;
  gap: 6px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const Title = styled.div`
  flex: 1;
  min-width: 0;
  font-size: ${() => getFontSize(16)}px !important;
  font-family : Pretendard-SemiBold;
  color: #111;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ListenButton = styled.div`
  flex-shrink: 0;
  padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px;
  background: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: auto;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: #e5e7eb;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const PriceChip = styled.span`
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
`;

const Region = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  color: #374151;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Memo = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  color: #6b7280;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  color: #6b7280;
  font-size: 11px;
`;

const DistanceText = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  color: #374151 !important;
  font-weight: 500 !important;
  display: inline-block;
`;

const WhenText = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  color: #6b7280 !important;
  display: inline-block;
`;

/* ---------- Component ---------- */
export default function ShortJobCard({ job, onClick }) {

    console.log("ShortJobCard", job);




    const img = safe(job?.imageUrl) || imageDB.hirecharacter;
    const amount = toPrice(job?.pay?.amount);
    const wt = workTypeLabel(job);

    const title = safe(job?.title) || safe(job?.WORKNAME) || "단기 일감";
    const region = safe(job?.region || job?.WORK_REGION_CONT);
    const memo = safe(job?.memo);

    const createdAt =
        job?.createdAt?.toMillis?.() ??
        (typeof job?.CREATEDT === "number"
            ? job.CREATEDT
            : job?.CREATEDT?.toMillis?.() ?? null);

    const when = createdAt ? timeAgo(createdAt) : "";

    const [src, setSrc] = React.useState(img);
    React.useEffect(() => setSrc(img), [img]);

    // AI 음성 듣기 클릭
    const handleListenClick = (e) => {
        e.stopPropagation();
        const url = safe(job?.ttsUrl);
        const text = safe(job?.summaryText || memo);
        if (url) {
            const audio = new Audio(url);
            audio.play().catch((err) => console.log("❌ 오디오 재생 실패:", err));
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
        <>
            <Card
                $clickable={!!onClick}
                onClick={onClick}
                role={onClick ? "button" : undefined}
            >
                <Hero>
                    <HeroImg
                        src={src}
                        alt=""
                        loading="lazy"
                        onError={() => setSrc(imageDB.hirecharacter)}
                    />
                </Hero>

                <Body>
                    {/* 제목 + AI 버튼 */}
                    <TitleRow>
                        <Title>{wt}</Title>
                        {(safe(job?.ttsUrl) || safe(job?.summaryText || memo)) && (
                            <ListenButton onClick={handleListenClick}>
                                🎧 AI 요약 듣기
                            </ListenButton>
                        )}
                    </TitleRow>

                    <MetaRow>
                        {amount && <PriceChip>총 {amount}</PriceChip>}
                    </MetaRow>

                    {memo && <Memo>{memo}</Memo>}

                    {(when || job?.distanceKm != null) && (
                        <FooterRow>
                            {job?.distanceKm != null && (
                                <DistanceText>📍 내 위치로부터 {Number(job.distanceKm).toFixed(1)}km</DistanceText>
                            )}
                            {when && <WhenText>· ⏱ {when}</WhenText>}
                        </FooterRow>
                    )}

                </Body>
            </Card>
  
        </>

    );
}
