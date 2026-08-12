// src/components/cards/CampCardList.js
import React, { useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../../utility/fontsize";
import CampingData from "./CampingData";


/**
 * props:
 * - items: Array<{
 *     id?: string|number,
 *     name?: string,               // fallback: facltNm
 *     region?: string,             // fallback: doNm or `${doNm} ${sigunguNm}`
 *     pet_friendly?: boolean,      // fallback: animalCmgCl === '가능' or '가능(소형견)'
 *     theme_tags?: string[],
 *     amenities?: string[],
 *     industry?: string[],         // ['일반야영장','글램핑','카라반' 등]
 *     firstImageUrl?: string,
 *     addr1?: string,
 *     tel?: string,
 *     homepage?: string
 *   }>
 * - onImageClick?: (url, item) => void
 * - onSelect?: (item) => void
 */

const CampCardList = ({ items = [], onImageClick, onSelect }) => {

    const [selected, setSelected] = useState(null);

    if (!items.length) {
        return <Empty>조건에 맞는 캠핑장을 찾지 못했어요.</Empty>;
    }

    const handleSelect = (item) => {
        setSelected(item);

    
    }
    return (
        <>
            <Grid>
                {items.map((raw, idx) => {
                    const item = normalizeItem(raw);


                    const key = item.id ?? `${item.name}-${idx}`;

                    return (
                        <Card key={key} onClick={() => handleSelect(item)}>
                            <ThumbBox
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.firstImageUrl) onImageClick?.(item.firstImageUrl, item);
                                }}
                            >
                                {item.firstImageUrl ? (
                                    <Thumb src={item.firstImageUrl} alt={item.name} loading="lazy" />
                                ) : (
                                    <ThumbFallback>이미지 없음</ThumbFallback>
                                )}



                            </ThumbBox>
             
                            <Content>
                                <Title>{item.name}</Title>
                                <Meta>{item.address || "주소 정보 없음"}</Meta>

                                {item.theme_tags?.length ? (
                                    <TagRow>
                                        {item.theme_tags.slice(0, 3).map((t) => (
                                            <Tag key={t}>{t}</Tag>
                                        ))}
                                    </TagRow>
                                ) : null}

                                {item.amenities?.length ? (
                                    <AmenRow>
                                        {item.amenities.slice(0, 4).map((a) => (
                                            <Amen key={a}>{a}</Amen>
                                        ))}
                                    </AmenRow>
                                ) : null}

                                {(item.tel || item.homepage) && (
                                    <LinkRow onClick={(e) => e.stopPropagation()}>
                                        {item.tel && <MiniLink href={`tel:${item.tel}`}>전화</MiniLink>}
                                        {item.homepage && (
                                            <MiniLink href={item.homepage} target="_blank" rel="noreferrer">
                                                홈페이지
                                            </MiniLink>
                                        )}
                                    </LinkRow>
                                )}
                            </Content>
                        </Card>
                    );
                })}
            </Grid>
            <CampingData camping={selected} onClose={() => setSelected(null)} />
        </>

    );
};

export default CampCardList;

/* ----------------- helpers ----------------- */

function normalizeItem(d = {}) {
    // name
    const name = d.name || d.facltNm || "캠핑장";

    // region
    const region =
        d.region ||
        d.doNm ||
        [d.doNm, d.sigunguNm].filter(Boolean).join(" ") ||
        "";

    // pet friendly
    const petFriendly =
        typeof d.pet_friendly === "boolean"
            ? d.pet_friendly
            : normalizePet(d.animalCmgCl);

    // 이미지 URL — 소스별 다양한 키 대응
    const firstImageUrl =
        d.firstImageUrl ||
        d.first_image_url ||
        d.firstImage ||
        d.firstimage ||
        d.imageUrl ||
        d.imgUrl ||
        d.mainImage ||
        d.image ||
        d.img ||
        (Array.isArray(d.images) && d.images.length ? d.images[0] : null) ||
        (Array.isArray(d.photos) && d.photos.length ? d.photos[0] : null);
    
    
    const address =
        d.address ||
        d.addr1 ||
        [d.doNm, d.sigunguNm, d.addr1, d.addr2].filter(Boolean).join(" ") ||
        [d.doNm, d.sigunguNm].filter(Boolean).join(" ");

    // arrays
    const themeTags = arrSafe(d.theme_tags || parseCSV(d.themaEnvrnCl));
    const amenities = arrSafe(d.amenities || parseCSV(d.sbrsCl));
    const industry = arrSafe(d.industry || parseCSV(d.induty));

    // 연락처/홈페이지도 키 변형 커버(선택)
    const tel = d.tel || d.telNo || d.phone || d.mobile || "";
    const homepage = d.homepage || d.homePage || d.hmpgUrl || d.siteUrl || "";

    return {
        ...d,
        name,
        region,
        address,
        pet_friendly: petFriendly,
        theme_tags: themeTags,
        amenities,
        industry,
        firstImageUrl,   // ✅ 카드가 이 값을 사용
        tel,
        homepage,
    };
}
  
function parseCSV(v) {
    if (!v || typeof v !== "string") return [];
    return v
        .split(/[,\s/·|]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

function arrSafe(v) {
    return Array.isArray(v) ? v.filter(Boolean) : [];
}

function normalizePet(v) {
    if (!v) return false;
    const s = String(v).replace(/\s+/g, "");
    // 가능, 가능(소형견) 등
    return /가능/.test(s) && !/불가|불가능/.test(s);
}

/* ----------------- styles ----------------- */



const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 420px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0,0,0,0.25);
  transition: transform .12s ease, box-shadow .12s ease;
  cursor: pointer;

  &:active { transform: scale(.995); }
  &:hover { box-shadow: 0 10px 22px rgba(0,0,0,0.32); }
`;

const ThumbBox = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  background: #2a2a2a;
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display:block;
`;

const ThumbFallback = styled.div`
  width: 100%; height: 100%;
  display:flex; align-items:center; justify-content:center;
  color:#bbb; font-size: 13px;
`;

const ChipBar = styled.div`
  position:absolute; left:10px; bottom:10px;
  display:flex; gap:6px; flex-wrap:wrap;
`;

const Chip = styled.span`
  background: ${({ $ok }) => ($ok ? "rgba(0, 200, 120, 0.9)" : "rgba(0,0,0,0.55)")};
  color: #fff;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
`;

const Content = styled.div`
  padding: 12px 12px 14px 12px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 700;
  color: #fff;
  line-height: 1.35;
`;

const Meta = styled.div`
  margin-top: 4px;
  color: #cfcfcf;
  font-size: 12px;
  display:flex; align-items:center; gap:6px;
`;

const Dot = styled.span`
  width: 4px; height: 4px; border-radius:50%; background:#777; display:inline-block;
`;

const TagRow = styled.div`
  margin-top: 8px;
  display:flex; gap:6px; flex-wrap:wrap;
`;

const Tag = styled.span`
  background: rgba(255,255,255,0.08);
  color: #eaeaea;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
`;

const AmenRow = styled.div`
  margin-top: 8px;
  display:flex; gap:6px; flex-wrap:wrap;
`;

const Amen = styled.span`
  background: rgba(255,255,255,0.06);
  color: #d6f3ff;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(100, 180, 220, 0.25);
`;

const LinkRow = styled.div`
  margin-top: 10px;
  display:flex; gap:10px; flex-wrap:wrap;
`;

const MiniLink = styled.a`
  font-size: ${() => getFontSize(12)}px !important;
  color: #99d0ff;
  text-decoration: none;
  border-bottom: 1px dashed rgba(153, 208, 255, .6);
  padding-bottom: 1px;

  &:hover { opacity: .85; }
`;

const Empty = styled.div`
  color: #ddd;
  font-size: ${() => getFontSize(14)}px !important;
  padding: 12px;
  text-align: center;
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 12px;
`;

const PopupWorkEx = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,.45);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 16px;
  box-sizing: border-box;

  /* 입력창 높이만큼 하단 여백 + 안전영역 */
  padding-bottom: calc(${p => p.$bottomGap || 0}px + env(safe-area-inset-bottom));
`;

const Sheet = styled.div`
  width: 100%;
  /* 시트 높이 = 화면의 85% - 입력창 높이 */
  max-height: calc(85dvh - ${p => p.$bottomGap || 0}px);
  background: #fff;
  border-radius: 16px 16px 0 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* 시트 자체도 안전영역 고려 */
  margin-bottom: env(safe-area-inset-bottom);
`;