// 📄 src/components/JobCategoryCards.jsx
import React, { useMemo, useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import { getFontSize } from "../utility/fontsize";
import { DEFAULT_ITEMS, DEFAULT_VISIBLE_KEYS } from "../utility/categories";
import { UserContext } from "../context/User";
import useWorkStatus from "../hooks/useWorkStatus";
import { imageDB } from "../utility/imageData";
import { decodeHtml } from "../utility/html";
import GeneralJobPopup from "../modal/GeneralJobPopup";

SwiperCore.use([Autoplay]);

/* ===========================
   인기 카테고리 키
   =========================== */
const POPULAR_KEYS = ["caregiver", "security", "delivery"];
const POPULAR_JOB_LIMIT = 10;

/* ===========================
   전체 카테고리 그룹 분류
   =========================== */
const CATEGORY_GROUPS = [
  {
    title: "돌봄·복지",
    desc: "요양·간병·보육·복지 관련 일자리",
    keys: ["caregiver", "healthcare", "social_worker", "childcare", "disability_friendly"],
  },
  {
    title: "음식·외식",
    desc: "조리·서빙·주방·외식업 일자리",
    keys: ["food_service", "restaurant", "chef"],
  },
  {
    title: "현장·물류",
    desc: "건설·배송·생산·환경 현장 일자리",
    keys: ["construction", "delivery", "agriculture", "cleaning"],
  },
  {
    title: "보안·경비",
    desc: "시설경비·보안·경호 일자리",
    keys: ["security", "guard"],
  },
  {
    title: "서비스·관광",
    desc: "관광·숙박·의전·반려동물 서비스",
    keys: ["tourism", "lodging", "ceremony", "pet_service", "parking"],
  },
  {
    title: "사무·전문",
    desc: "IT·영업·교육 전문직 일자리",
    keys: ["it_developer", "sales", "education"],
  },
  {
    title: "기타",
    desc: "분류 외 전체 공고 모음",
    keys: ["NOSEARCH"],
  },
];

/* ===========================
   공고 데이터 간단 파싱
   =========================== */
function pickField(obj, keys, fallback = "") {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return fallback;
}

function parseJobForCard(raw = {}) {
  const title = pickField(raw, ["wantedTitle", "title", "PBANC_CONT"], "(제목 없음)");
  const company = pickField(raw, ["company", "plbizNm", "ENTRPRS_NM", "oranNm"], "");
  const region = pickField(raw, ["plDetAddr", "workAddr", "WORK_REGION_CONT", "work_region_cont"], "");
  const distanceKm = typeof raw.distanceKm === "number" ? raw.distanceKm : null;
  const distanceText = distanceKm !== null ? `${distanceKm.toFixed(1)}km` : "";

  const minSal = Number(pickField(raw, ["minSal", "min_sal"])) || 0;
  const maxSal = Number(pickField(raw, ["maxSal", "max_sal"])) || 0;
  const salTxt = pickField(raw, ["sal", "PAY_TXT"], "");
  let payLabel = "";
  let payAmount = "";
  let payType = "";
  const salVal = minSal || maxSal;
  if (salVal) {
    const formatted = salVal.toLocaleString();
    if (salVal >= 10000000) { payLabel = "연봉"; payType = "annual"; }
    else if (salVal >= 1000000) { payLabel = "월급"; payType = "monthly"; }
    else { payLabel = "시급"; payType = "hourly"; }
    payAmount = `${formatted}원`;
  } else if (salTxt) {
    payAmount = salTxt;
  }

  return { title, company, region, distanceText, payLabel, payAmount, payType };
}

function matchesCategory(job, catKey) {
  const wc = Array.isArray(job.workCategories) ? job.workCategories : [];
  if (wc.length) return wc.includes(catKey);
  const primary = job.primaryCategory;
  if (typeof primary === "string") return primary === catKey;
  const legacy = job.workcategory || job.category;
  if (typeof legacy === "string") return legacy === catKey;
  return false;
}

export default function JobCategoryCards({
  items = DEFAULT_ITEMS,
  visibleKeys = DEFAULT_VISIBLE_KEYS,
  countsMap = {},
  jobList = [],
  isLoading = false,
  onSelect,
}) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { status } = useWorkStatus(
    user?.USERINFO?.latitude,
    user?.USERINFO?.longitude
  );

  const visibleItems = useMemo(
    () => items.filter((it) => visibleKeys.includes(it.key)),
    [items, visibleKeys]
  );

  const popularItems = useMemo(
    () => POPULAR_KEYS.map((k) => visibleItems.find((it) => it.key === k)).filter(Boolean),
    [visibleItems]
  );

  // 인기 카테고리별 실제 공고 필터링
  const popularJobsMap = useMemo(() => {
    const map = {};
    for (const catKey of POPULAR_KEYS) {
      map[catKey] = jobList
        .filter((j) => matchesCategory(j, catKey))
        .slice(0, POPULAR_JOB_LIMIT);
    }
    return map;
  }, [jobList]);

  const handleClick = (item) => {
    if (item?.key === "__dev_portfolio__" || item?.type === "dev_portfolio") {
      navigate("/DeveloperPortfolio");
      return;
    }
    if (onSelect) return onSelect(item);
    navigate("/MobileResult", {
      state: { type: "general", catKey: item.key, name: item.label, radiusKm: 4 },
    });
  };

  const getCount = (item) => {
    const keyL = String(item.key || "").toLowerCase();
    return countsMap[keyL] ?? countsMap[item.key] ?? item.count ?? 0;
  };

  if (isLoading) {
    return (
      <LoadingWrap>
        <DotContainer>
          <Dot delay="0s" />
          <Dot delay="0.15s" />
          <Dot delay="0.3s" />
        </DotContainer>
        <LoadingText>일자리를 불러오는 중</LoadingText>
      </LoadingWrap>
    );
  }

  return (
    <Wrap>
      {/* ===== 인기 카테고리별 공고 슬라이드 ===== */}
      {popularItems.map((catItem, idx) => {
        const jobs = popularJobsMap[catItem.key] || [];
        const count = getCount(catItem);
        return (
          <PopularSection key={catItem.key}>
            <PopularHeader>
              <PopularHeaderLeft>
                <PopularCatIcon src={catItem.image} alt={catItem.label} />
                <PopularSectionTitle>{catItem.label}</PopularSectionTitle>
                <PopularBadge>{count}건</PopularBadge>
              </PopularHeaderLeft>
              <MoreButton onClick={() => handleClick(catItem)}>
                더보기 &rsaquo;
              </MoreButton>
            </PopularHeader>

            {jobs.length > 0 ? (
              <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                freeMode={true}
                autoplay={{ delay: 3000 + idx * 1000, disableOnInteraction: false }}
                speed={800}
                loop={jobs.length > 2}
                style={{ paddingRight: 16 }}
              >
                {jobs.map((job) => (
                  <SwiperSlide key={job.id} style={{ width: "auto" }}>
                    <MiniJobCard job={job} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <EmptySlide onClick={() => handleClick(catItem)}>
                공고를 확인하려면 탭하세요
              </EmptySlide>
            )}
          </PopularSection>
        );
      })}

      {/* ===== 전체 카테고리 그룹별 아이콘 그리드 ===== */}
      <AllSectionTitle>전체 카테고리</AllSectionTitle>
      {CATEGORY_GROUPS.map((group, idx) => {
        const groupItems = group.keys
          .map((k) => visibleItems.find((it) => it.key === k))
          .filter(Boolean);
        if (groupItems.length === 0) return null;
        return (
          <React.Fragment key={group.title}>
            {idx > 0 && <GroupDivider />}
            <GroupCard>
              <GroupHeader>
                <GroupTitleRow>
                  <GroupTitle>{group.title}</GroupTitle>
                  <GroupCount>
                    {groupItems.reduce((sum, it) => sum + getCount(it), 0)}건
                  </GroupCount>
                </GroupTitleRow>
                <GroupDesc>{group.desc}</GroupDesc>
              </GroupHeader>
              <IconGrid>
                {groupItems.map((item) => {
                  const count = getCount(item);
                  return (
                    <IconCell key={item.key} onClick={() => handleClick(item)}>
                      <IconCircle>
                        <IconImage src={item.image} alt={item.label} />
                      </IconCircle>
                      <IconLabel>{item.label}</IconLabel>
                    </IconCell>
                  );
                })}
              </IconGrid>
            </GroupCard>
          </React.Fragment>
        );
      })}
    </Wrap>
  );
}

/* ===== 미니 공고 카드 컴포넌트 ===== */
function MiniJobCard({ job }) {
  const [showPopup, setShowPopup] = useState(false);
  const { title, company, region, distanceText, payLabel, payAmount, payType } = useMemo(
    () => parseJobForCard(job),
    [job]
  );

  return (
    <>
      <JobCard onClick={() => setShowPopup(true)}>
        <JobTitle>{decodeHtml(title)}</JobTitle>
        {company && <JobCompany>{company}</JobCompany>}
        <JobMeta>
          {region && <JobRegion>{region}</JobRegion>}
          {distanceText && <JobDistance>{distanceText}</JobDistance>}
        </JobMeta>
        {payAmount && (
          <JobPayRow>
            {payLabel && <PayBadge $type={payType}>{payLabel}</PayBadge>}
            <PayAmount $type={payType}>{payAmount}</PayAmount>
          </JobPayRow>
        )}
      </JobCard>
      {showPopup && (
        <GeneralJobPopup job={job} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

/* ========== styled-components ========== */

const Wrap = styled.div`
  width: 100%;
  margin: 0 auto;
`;

/* --- 점 세 개 로딩 --- */
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0 80px;
  min-height: 30vh;
`;

const DotContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #00C7AE;
  animation: ${bounce} 1.2s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
`;

const LoadingText = styled.div`
  margin-top: 16px;
  font-size: ${() => getFontSize(14)}px !important;
  color: #888;
`;

/* --- 인기 카테고리 섹션 --- */
const PopularSection = styled.div`
  margin-bottom: 24px;
`;

const PopularHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PopularHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PopularCatIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const PopularSectionTitle = styled.span`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 900;
  color: #1a1a1a;
  font-family: "Pretendard-Bold";
  letter-spacing: -0.2px;
`;

const PopularBadge = styled.span`
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #FF6B6B, #ee5a24);
  padding: 3px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(238, 90, 36, 0.3);
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: ${() => getFontSize(13)}px !important;
  color: #999;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
`;

/* --- 미니 공고 카드 --- */
const JobCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 200px;
  height: 150px;
  padding: 14px;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  text-align: left;
  transition: transform 0.08s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const JobTitle = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
  margin-bottom: 6px;
`;

const JobCompany = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const JobRegion = styled.span`
  font-size: ${() => getFontSize(11)}px !important;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const JobDistance = styled.span`
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 700;
  color: #00c7ae;
`;

const PAY_COLORS = {
  hourly:  { bg: "#FFF0F0", badge: "#E53E3E", text: "#C53030" },
  monthly: { bg: "#EBF5FF", badge: "#3182F6", text: "#1E60D0" },
  annual:  { bg: "#F0FFF4", badge: "#38A169", text: "#276749" },
};

const JobPayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
`;

const PayBadge = styled.span`
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 500;
  color: #fff;
  background: ${({ $type }) => PAY_COLORS[$type]?.badge || "#E53E3E"};
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: -0.2px;
  flex-shrink: 0;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const PayAmount = styled.span`
  font-size: ${() => getFontSize(15)}px !important;
  font-weight: 500;
  color: ${({ $type }) => PAY_COLORS[$type]?.text || "#E53E3E"};
  letter-spacing: -0.3px;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const EmptySlide = styled.button`
  width: 100%;
  padding: 24px 16px;
  border: 1px dashed #ddd;
  border-radius: 14px;
  background: #fafafa;
  color: #aaa;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

/* --- 전체 카테고리 그룹 --- */
const GroupDivider = styled.div`
  height: 8px;
  background: #eef0f3;
  margin: 12px -16px 12px;
`;

const GroupCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 18px 16px 12px;
  margin-bottom: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const GroupHeader = styled.div`
  margin-bottom: 16px;
`;

const GroupTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const GroupTitle = styled.span`
  font-size: ${() => getFontSize(17)}px !important;
  font-weight: 900;
  color: #1a1a1a;
  font-family: "Pretendard-Bold";
  letter-spacing: -0.3px;
`;

const GroupCount = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 3px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(118, 75, 162, 0.3);
`;

const GroupDesc = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 400;
  color: #999;
  line-height: 1.3;
`;

/* --- 전체 카테고리 아이콘 그리드 --- */
const AllSectionTitle = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 900;
  color: #1a1a1a;
  font-family: "Pretendard-Bold";
  letter-spacing: -0.2px;
  margin-bottom: 14px;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 12px;
`;

const IconCell = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.08s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IconImage = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
`;

const IconLabel = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
  text-align: center;
  word-break: keep-all;
`;

const IconCount = styled.span`
  font-size: ${() => getFontSize(10)}px !important;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #FF6B6B, #ee5a24);
  padding: 2px 7px;
  border-radius: 999px;
  line-height: 1.2;
`;
