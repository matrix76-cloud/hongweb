/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiChevronLeft, FiX } from "react-icons/fi";
import { IoSearchOutline, IoClose, IoTimeOutline } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";

import { useWorknet } from "../../context/WorknetContext";
import { KR_AREAS } from "../../utility/constants";
import { COLORS, withAlpha } from "../../utility/colors";
import { getFontSize } from "../../utility/fontsize";
import GeneralJobCard from "../../components/GeneralJobCard";

/* ========= constants ========= */
const RECENT_LS_KEY = "hong.recentSearch.v1";
const MAX_RECENT = 10;
const PREVIEW_COUNT = 5;

const POPULAR_KEYWORDS = [
  "서울", "강남", "식당", "카페", "편의점",
  "주방", "서빙", "배달", "사무", "경기",
];

const SALARY_FILTERS = [
  { label: "시급 1만+", type: "hourly", min: 10000 },
  { label: "시급 1.2만+", type: "hourly", min: 12000 },
  { label: "시급 1.5만+", type: "hourly", min: 15000 },
  { label: "월급 200만+", type: "monthly", min: 2000000 },
  { label: "월급 250만+", type: "monthly", min: 2500000 },
  { label: "월급 300만+", type: "monthly", min: 3000000 },
];

/* ========= helpers ========= */
function loadRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_LS_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((s) => typeof s === "string" && s.trim()).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(list) {
  localStorage.setItem(RECENT_LS_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
}

function addRecent(keyword) {
  const k = keyword.trim();
  if (!k) return loadRecent();
  const prev = loadRecent().filter((s) => s !== k);
  const next = [k, ...prev].slice(0, MAX_RECENT);
  saveRecent(next);
  return next;
}

function matchText(text, keyword) {
  if (!text || !keyword) return false;
  return String(text).toLowerCase().includes(keyword.toLowerCase());
}

function extractPayWon(job) {
  const minSal = tryNum(job?.minSal || job?.min_sal);
  const maxSal = tryNum(job?.maxSal || job?.max_sal);
  if (minSal > 0) return minSal;
  if (maxSal > 0) return maxSal;

  const salTxt = String(job?.sal || job?.PAY_TXT || "").trim();
  if (!salTxt) return 0;

  const m = salTxt.match(/([\d,]+)\s*(만원|원)/);
  if (!m) return 0;
  const num = Number(String(m[1]).replace(/,/g, ""));
  if (!Number.isFinite(num)) return 0;
  return m[2] === "만원" ? num * 10000 : num;
}

function tryNum(v) {
  if (v == null) return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/* ========= component ========= */
export default function MobileJobSearchcontainer() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { list: worknetList } = useWorknet() || { list: [] };

  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recentList, setRecentList] = useState(() => loadRecent());
  const [activeSalary, setActiveSalary] = useState(null);

  // 자동 포커스
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  /* ---------- 검색 실행 ---------- */
  const doSearch = useCallback((keyword) => {
    const k = (keyword || "").trim();
    if (!k) return;
    setQuery(k);
    setSubmitted(true);
    setActiveSalary(null);
    const next = addRecent(k);
    setRecentList(next);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    doSearch(query);
  };

  const clearQuery = () => {
    setQuery("");
    setSubmitted(false);
    setActiveSalary(null);
    inputRef.current?.focus();
  };

  /* ---------- 최근 검색어 관리 ---------- */
  const removeRecent = (keyword) => {
    const next = recentList.filter((s) => s !== keyword);
    saveRecent(next);
    setRecentList(next);
  };

  const clearAllRecent = () => {
    saveRecent([]);
    setRecentList([]);
  };

  /* ---------- 급여 필터 ---------- */
  const toggleSalary = (filter) => {
    if (activeSalary?.label === filter.label) {
      setActiveSalary(null);
    } else {
      setActiveSalary(filter);
      setSubmitted(true);
      setQuery("");
    }
  };

  /* ---------- 검색 결과 ---------- */
  const keyword = submitted ? query.trim().toLowerCase() : "";

  // 지역 매칭
  const matchedAreas = useMemo(() => {
    if (!keyword) return [];
    const results = [];
    KR_AREAS.forEach((area) => {
      if (matchText(area.sido, keyword)) {
        results.push({ sido: area.sido, gu: "전체" });
      }
      area.guList.forEach((gu) => {
        if (matchText(gu, keyword)) {
          results.push({ sido: area.sido, gu });
        }
      });
    });
    return results.slice(0, 10);
  }, [keyword]);

  // 기관(회사) 매칭
  const matchedCompanies = useMemo(() => {
    if (!keyword) return [];
    const map = new Map();

    (worknetList || []).forEach((job) => {
      const company = String(job?.company || job?.plbizNm || job?.ENTRPRS_NM || job?.oranNm || "").trim();
      if (company && matchText(company, keyword) && !map.has(company)) {
        const region = String(job?.plDetAddr || job?.workAddr || job?.WORK_REGION_CONT || "").trim();
        map.set(company, { name: company, region });
      }
    });

    return Array.from(map.values()).slice(0, 10);
  }, [keyword, worknetList]);

  // 공고 매칭
  const matchedWorknet = useMemo(() => {
    const source = worknetList || [];

    // 급여 필터만 (키워드 없이)
    if (activeSalary && !keyword) {
      return source.filter((job) => {
        const won = extractPayWon(job);
        if (won <= 0) return false;
        if (activeSalary.type === "hourly") return won >= activeSalary.min && won < 1000000;
        if (activeSalary.type === "monthly") return won >= activeSalary.min;
        return false;
      });
    }

    if (!keyword) return [];

    let filtered = source.filter((job) => {
      const fields = [
        job?.wantedTitle || job?.title || job?.PBANC_CONT || "",
        job?.company || job?.plbizNm || job?.ENTRPRS_NM || job?.oranNm || "",
        job?.plDetAddr || job?.workAddr || job?.WORK_REGION_CONT || "",
        job?.PBANC_CONT || "",
        job?.jobsNm || "",
      ];
      return fields.some((f) => matchText(f, keyword));
    });

    // 급여 필터 병용
    if (activeSalary) {
      filtered = filtered.filter((job) => {
        const won = extractPayWon(job);
        if (won <= 0) return false;
        if (activeSalary.type === "hourly") return won >= activeSalary.min && won < 1000000;
        if (activeSalary.type === "monthly") return won >= activeSalary.min;
        return false;
      });
    }

    return filtered;
  }, [keyword, worknetList, activeSalary]);

  // 더보기 상태
  const [showAllWorknet, setShowAllWorknet] = useState(false);

  useEffect(() => {
    setShowAllWorknet(false);
  }, [keyword, activeSalary]);

  const visibleWorknet = showAllWorknet ? matchedWorknet : matchedWorknet.slice(0, PREVIEW_COUNT);

  const hasResults = matchedAreas.length > 0 || matchedCompanies.length > 0 || matchedWorknet.length > 0;
  const isSearchActive = submitted && (keyword || activeSalary);

  /* ---------- 지역 클릭 → 메인 ---------- */
  const handleAreaClick = (area) => {
    localStorage.setItem("hong.region.v1", JSON.stringify(area));
    window.dispatchEvent(new CustomEvent("region-changed", { detail: area }));
    navigate("/Mobilemain");
  };

  /* ---------- 기관 클릭 → 재검색 ---------- */
  const handleCompanyClick = (company) => {
    doSearch(company.name);
  };

  /* ========= render ========= */
  return (
    <PageContainer>
      {/* 검색 헤더 */}
      <SearchHeader>
        <BackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <FiChevronLeft size={24} />
        </BackBtn>

        <SearchForm onSubmit={handleSubmit}>
          <SearchIcon>
            <IoSearchOutline size={18} />
          </SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="지역, 업체, 키워드 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
          />
          {query && (
            <ClearBtn type="button" onClick={clearQuery} aria-label="지우기">
              <FiX size={12} />
            </ClearBtn>
          )}
        </SearchForm>
      </SearchHeader>

      {/* 스크롤 영역 */}
      <ScrollArea>
        {!isSearchActive ? (
          <>
            {/* 인기 검색어 */}
            <Section>
              <SectionHeader>
                <MdTrendingUp size={16} style={{ color: COLORS.primary }} />
                <SectionTitle>인기 검색어</SectionTitle>
              </SectionHeader>
              <ChipRow>
                {POPULAR_KEYWORDS.map((kw) => (
                  <Chip key={kw} onClick={() => doSearch(kw)}>{kw}</Chip>
                ))}
              </ChipRow>
            </Section>

            {/* 최근 검색어 */}
            <Section>
              <SectionHeader>
                <IoTimeOutline size={16} style={{ color: "#888" }} />
                <SectionTitle>최근 검색어</SectionTitle>
                {recentList.length > 0 && (
                  <ClearAllBtn onClick={clearAllRecent}>전체 삭제</ClearAllBtn>
                )}
              </SectionHeader>
              {recentList.length === 0 ? (
                <EmptyText>최근 검색어가 없습니다</EmptyText>
              ) : (
                <RecentList>
                  {recentList.map((kw) => (
                    <RecentItem key={kw}>
                      <RecentKeyword onClick={() => doSearch(kw)}>{kw}</RecentKeyword>
                      <RecentDeleteBtn onClick={() => removeRecent(kw)} aria-label="삭제">
                        <IoClose size={14} />
                      </RecentDeleteBtn>
                    </RecentItem>
                  ))}
                </RecentList>
              )}
            </Section>

            {/* 급여 빠른필터 */}
            <Section>
              <SectionHeader>
                <SectionTitle>급여 빠른필터</SectionTitle>
              </SectionHeader>
              <ChipRow>
                {SALARY_FILTERS.map((f) => (
                  <SalaryChip
                    key={f.label}
                    $active={activeSalary?.label === f.label}
                    onClick={() => toggleSalary(f)}
                  >
                    {f.label}
                  </SalaryChip>
                ))}
              </ChipRow>
            </Section>
          </>
        ) : (
          <>
            {/* 급여 필터 칩 (검색 중에도 표시) */}
            <FilterRow>
              {SALARY_FILTERS.map((f) => (
                <SalaryChip
                  key={f.label}
                  $active={activeSalary?.label === f.label}
                  onClick={() => toggleSalary(f)}
                  $small
                >
                  {f.label}
                </SalaryChip>
              ))}
            </FilterRow>

            {!hasResults && (
              <NoResult>
                <NoResultText>검색 결과가 없습니다</NoResultText>
                <NoResultSub>다른 키워드로 검색해보세요</NoResultSub>
              </NoResult>
            )}

            {/* 지역 섹션 */}
            {matchedAreas.length > 0 && (
              <Section>
                <SectionHeader>
                  <SectionTitle>지역</SectionTitle>
                  <SectionCount>{matchedAreas.length}건</SectionCount>
                </SectionHeader>
                <AreaList>
                  {matchedAreas.map((a, i) => (
                    <AreaItem key={i} onClick={() => handleAreaClick(a)}>
                      <AreaName>{a.sido} {a.gu}</AreaName>
                      <AreaAction>이 지역으로 보기</AreaAction>
                    </AreaItem>
                  ))}
                </AreaList>
              </Section>
            )}

            {/* 기관/업체 섹션 */}
            {matchedCompanies.length > 0 && (
              <Section>
                <SectionHeader>
                  <SectionTitle>업체</SectionTitle>
                  <SectionCount>{matchedCompanies.length}건</SectionCount>
                </SectionHeader>
                <CompanyList>
                  {matchedCompanies.map((c, i) => (
                    <CompanyItem key={i} onClick={() => handleCompanyClick(c)}>
                      <CompanyName>{c.name}</CompanyName>
                      {c.region && <CompanyRegion>{c.region}</CompanyRegion>}
                    </CompanyItem>
                  ))}
                </CompanyList>
              </Section>
            )}

            {/* 공고 섹션 */}
            {matchedWorknet.length > 0 && (
              <Section>
                <SectionHeader>
                  <SectionTitle>일자리 공고</SectionTitle>
                  <SectionCount>{matchedWorknet.length}건</SectionCount>
                </SectionHeader>
                <CardList>
                  {visibleWorknet.map((job) => (
                    <GeneralJobCard key={job.id} job={job} />
                  ))}
                </CardList>
                {matchedWorknet.length > PREVIEW_COUNT && !showAllWorknet && (
                  <MoreBtn onClick={() => setShowAllWorknet(true)}>
                    {matchedWorknet.length - PREVIEW_COUNT}건 더보기
                  </MoreBtn>
                )}
              </Section>
            )}

            <BottomSpacer />
          </>
        )}
      </ScrollArea>
    </PageContainer>
  );
}

/* ========= Styles ========= */

const PageContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const SearchHeader = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 6px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
`;

const BackBtn = styled.div`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 0 0 auto;
  color: rgba(17, 24, 39, 0.85);
  -webkit-tap-highlight-color: transparent;
  &:active { transform: translateY(1px); }
`;

const SearchForm = styled.form`
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 0 10px;
  height: 36px;
  gap: 6px;
  margin-right: 6px;
`;

const SearchIcon = styled.div`
  color: #999;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: ${() => getFontSize(13)}px;
  font-family: Pretendard-Medium;
  color: #222;
  &::placeholder { color: #aaa; }
`;

const ClearBtn = styled.button`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  color: #999;
  flex: 0 0 auto;
  -webkit-tap-highlight-color: transparent;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: calc(env(safe-area-inset-top, 0px) + 52px);
  -webkit-overflow-scrolling: touch;
`;

/* ---- 섹션 공통 ---- */
const Section = styled.div`
  padding: 14px 16px 6px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const SectionTitle = styled.span`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(13)}px;
  color: #222;
`;

const SectionCount = styled.span`
  font-size: ${() => getFontSize(11)}px;
  color: #888;
  margin-left: auto;
`;

/* ---- 칩 ---- */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.div`
  padding: 6px 12px;
  border-radius: 999px;
  background: #f5f5f5;
  border: 1px solid #eee;
  font-size: ${() => getFontSize(12)}px;
  font-family: Pretendard-Medium;
  color: #444;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  &:active { background: #eee; }
`;

const SalaryChip = styled.div`
  padding: ${({ $small }) => ($small ? "5px 8px" : "6px 12px")};
  border-radius: 999px;
  font-size: ${({ $small }) => ($small ? `${getFontSize(11)}px` : `${getFontSize(12)}px`)};
  font-family: Pretendard-Medium;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s ease;

  background: ${({ $active }) => ($active ? withAlpha(COLORS.primary, 0.12) : "#f5f5f5")};
  border: 1px solid ${({ $active }) => ($active ? withAlpha(COLORS.primary, 0.3) : "#eee")};
  color: ${({ $active }) => ($active ? COLORS.primary : "#444")};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};

  &:active { transform: scale(0.96); }
`;

/* ---- 최근 검색어 ---- */
const ClearAllBtn = styled.span`
  margin-left: auto;
  font-size: ${() => getFontSize(11)}px;
  color: #999;
  cursor: pointer;
`;

const EmptyText = styled.div`
  font-size: ${() => getFontSize(12)}px;
  color: #bbb;
  padding: 8px 0;
`;

const RecentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const RecentItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  border-radius: 999px;
  background: #f8f8f8;
  border: 1px solid #eee;
`;

const RecentKeyword = styled.span`
  font-size: ${() => getFontSize(12)}px;
  font-family: Pretendard-Medium;
  color: #444;
  cursor: pointer;
`;

const RecentDeleteBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: #bbb;
  display: flex;
  align-items: center;
`;

/* ---- 필터 row (검색 중) ---- */
const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  padding: 12px 16px 4px;
  overflow-x: auto;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; }
`;

/* ---- 검색 결과 없음 ---- */
const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const NoResultText = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px;
  color: #666;
`;

const NoResultSub = styled.div`
  font-size: ${() => getFontSize(11)}px;
  color: #aaa;
  margin-top: 8px;
`;

/* ---- 지역 ---- */
const AreaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AreaItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &:active { background: #f8f8f8; }
`;

const AreaName = styled.span`
  font-family: Pretendard-Medium;
  font-size: ${() => getFontSize(13)}px;
  color: #333;
`;

const AreaAction = styled.span`
  font-size: ${() => getFontSize(11)}px;
  color: ${() => COLORS.primary};
  font-weight: 600;
`;

/* ---- 기관/업체 ---- */
const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CompanyItem = styled.div`
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &:active { background: #f8f8f8; }
`;

const CompanyName = styled.div`
  font-family: Pretendard-Medium;
  font-size: ${() => getFontSize(13)}px;
  color: #333;
`;

const CompanyRegion = styled.div`
  font-size: ${() => getFontSize(11)}px;
  color: #999;
  margin-top: 3px;
`;

/* ---- 카드 리스트 ---- */
const CardList = styled.div`
  display: flex;
  flex-direction: column;
`;

/* ---- 더보기 버튼 ---- */
const MoreBtn = styled.div`
  text-align: center;
  padding: 12px;
  font-size: ${() => getFontSize(12)}px;
  font-family: Pretendard-SemiBold;
  color: ${() => COLORS.primary};
  cursor: pointer;
  border: 1px solid ${() => withAlpha(COLORS.primary, 0.2)};
  border-radius: 12px;
  margin: 8px 16px;
  -webkit-tap-highlight-color: transparent;
  &:active { background: ${() => withAlpha(COLORS.primary, 0.06)}; }
`;

const BottomSpacer = styled.div`
  height: 40px;
`;
