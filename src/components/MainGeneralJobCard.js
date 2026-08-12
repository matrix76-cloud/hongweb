import React, { useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import GeneralJobPopup from "../modal/GeneralJobPopup";
import dayjs from "dayjs";
import { COLORS } from "../utility/colors";

const MainGeneralJobCard = ({ job, jobId, compact = false, height }) => {
  const [showPopup, setShowPopup] = useState(false);

  const isToday =
    job?.createdAt &&
    dayjs(job.createdAt.toDate ? job.createdAt.toDate() : job.createdAt).isSame(dayjs(), "day");

  // 급여 파싱
  const salaryColorMap = {
    시급: { text: "#1E88E5", bg: "rgba(30,136,229,.12)", bd: "rgba(30,136,229,.35)" },
    월급: { text: "#FF7A00", bg: "rgba(255,122,0,.12)", bd: "rgba(255,122,0,.35)" },
    연봉: { text: "#43A047", bg: "rgba(67,160,71,.12)", bd: "rgba(67,160,71,.35)" },
  };

  const getSalaryText = () => {
    const raw = job?.SALARY_COND || "";
    const sliced = raw.split("~")[0].trim().replace(/원자/g, "").trim();
    const match = sliced.match(/^([가-힣]+)\s*([\d,]+.*)$/);
    if (!match) return { label: sliced, number: "" };
    const [, label, number] = match;
    return { label, number };
  };
  const salary = getSalaryText();
  const salStyle = salaryColorMap[salary.label] || { text: "#444", bg: "rgba(0,0,0,.06)", bd: "rgba(0,0,0,.12)" };

  // 태그(모집분야) → 최대 2개만
  const rawTags = String(job?.RECRUT_FIELD_NM || "")
    .replace(/\s+/g, " ")
    .replace(/[|/]/g, ",");
  const tags = rawTags
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);
  
  
  const regionRaw = job?.WORK_REGION_CONT || "";
  // 너무 길면 앞쪽 2~3 단어만 (예: "경기 남양주시 다산동" → "경기 남양주시")
  const regionShort = regionRaw.trim().split(/\s+/).slice(0, 1).join(" ");


  const open = () => setShowPopup(true);

  const salaryText = salary.label && salary.number ? `${salary.label} ${salary.number}` : '';   // 화면에 찍을 문자열

  return (
    <>
      <CardWrapper compact={compact} height={height} onClick={open}>
        <HeaderRow>
          <Title compact={compact}>{job.PBANC_CONT}</Title>
          {/* {isToday && <NewBadge>new</NewBadge>} */}
        </HeaderRow>

        <ChipsRow>
          
          <SalaryChip
            style={{ color: salStyle.text, background: salStyle.bg, borderColor: salStyle.bd }}>
            {salaryText || "연봉기재없음"}
          </SalaryChip>
          {/* {tags.map((t, i) => (
            <SmallPill key={i}>{t}</SmallPill>
          ))} */}
        </ChipsRow>

        {/* <FooterRow>
          <ApplyBtn
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            지원하기
          </ApplyBtn>
        </FooterRow> */}

        <FooterRow>
          <LocationChip title={regionRaw}>{regionShort || "지역 정보 없음"}</LocationChip>
          <ApplyChip onClick={(e) => {
            e.stopPropagation();
            open();
            }}>지원하기</ApplyChip>
        </FooterRow>


      </CardWrapper>

      {showPopup && <GeneralJobPopup job={job} jobId={jobId} onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default MainGeneralJobCard;

/* ===== styled ===== */

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 14px 12px;
  background: #ffffff;
  border: 1px solid #f1efe9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  // width: ${({ compact }) => (compact ? "calc((100% - 10px) / 2)" : "100%")};
  // min-height: 148px;

  width: 100%;           /* ✅ 컨테이너(슬라이드) 기준으로 꽉 채움 */
  min-width: 0;          /* ✅ iOS/Safari 줄바꿈 시 오버플로 방지 */

  box-sizing: border-box;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
`;


const FixedHeaderRow = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  right: 12px;
  height: 48px;                  /* 위 변수와 같은 값 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  /* 한 줄 유지(줄바꿈 방지) */
  white-space: nowrap;
`;



const Title = styled.div`
  flex: 1;
  font-size: ${({ compact }) => (compact ? getFontSize(15) : getFontSize(16))}px !important;
  font-family: Pretendard-SemiBold;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: ${({ compact }) => (compact ? 4 : 2)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
  white-space: normal;
  // height: 65px;
   min-height: 80px;
`;

const NewBadge = styled.span`
  background-color: ${COLORS.primary};
  color: #fff;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 2px;
  line-height: 1;
  white-space: nowrap;
`;

const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const SalaryChip = styled.div`

  padding: 6px 10px;
  border-radius: 999px;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 700;
  border: 1px solid transparent;
  line-height: 1;
`;

const SmallPill = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  background: #f6f6f6;
  color: #333;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 500;
  line-height: 1;
`;



const ApplyBtn = styled.button`
  background: #ffffff;
  color: #333;
  border: 1.5px solid #e4e0d5;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  transition: transform .08s ease, box-shadow .08s ease, background .12s;
  &:active {
    transform: scale(.98);
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
  }
`;

// 하단 한 줄(지역 + 버튼)
const FooterRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

// 지역 표시 칩
const LocationChip = styled.div`
    flex: 1 1 auto;
    display: inline-flex;
    align-items: center;
    height: 28px;
    border-radius: 10px;
    color: #333;
    font-size: 9px !important;
    font-family: Pretendard-SemiBold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

// 지원하기 칩(이전 ApplyChip을 div 버전으로 썼다면 그대로 사용)
const ApplyChip = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #eadfcb;
  background: #fff;
  color: #222;
  font-size: ${() => getFontSize(12)}px !important;
  font-family: Pretendard-SemiBold;
  line-height: 1;
  white-space: nowrap;
  width: fit-content;
  inline-size: max-content;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  transition: transform .06s ease;
  &:active { transform: translateY(1px); }
`;

