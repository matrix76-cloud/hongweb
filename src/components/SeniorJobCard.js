import React, { useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import SeniorJobPopup from "../modal/SeniorJobPopup";
import dayjs from "dayjs";

const SeniorJobCard = ({ job, jobId, compact = false, height }) => {
  const [showPopup, setShowPopup] = useState(false);

  const formatDate = (date) => {
    const str = String(date);
    if (str.length === 8 && /^\d{8}$/.test(str)) {
      return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`;
    }
    return str;
  };

  const isToday =
    job?.createdAt &&
    dayjs(job.createdAt.toDate ? job.createdAt.toDate() : job.createdAt).isSame(
      dayjs(),
      "day"
    );

  return (
    <>
      <CardWrapper compact={compact} onClick={() => setShowPopup(true)} height={height}>
        <CardTitle compact={compact}>
          {job.wantedTitle}
          {isToday && <RibbonBadge>new</RibbonBadge>}
        </CardTitle>

        {/* 회사명 · 지역 */}
        <RowWrap>
          <InlineText>{job.plbizNm}</InlineText>
          <Separator />
          <InlineText>{job.plDetAddr?.split(" ").slice(1, 3).join(" ")}</InlineText>
        </RowWrap>

        {/* 마감일 배지 + 지원하기 칩 버튼 */}
        <FooterRow>
          <DeadlineBadge>
            <span className="icon">⏰</span>
            <span className="label">마감일</span>
            <span className="date">{formatDate(job.toAcptDd)}</span>
          </DeadlineBadge>

          <ApplyChip
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(true);
            }}
          >
            지원하기
          </ApplyChip>
        </FooterRow>
      </CardWrapper>

      {showPopup && (
        <SeniorJobPopup job={job} jobId={jobId} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};

export default SeniorJobCard;

/* ---------------- styles ---------------- */

const RibbonBadge = styled.span`
  background-color: #ff7e19;
  color: #fff;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 6px;
  vertical-align: middle;
  line-height: 1;
`;

const CardWrapper = styled.div`
  width: 100%;
  padding: ${({ compact }) => (compact ? "10px 8px" : "14px")};
  font-size: ${() => getFontSize(14)}px !important;
  margin-bottom: 12px;
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.06);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  height: ${({ height }) => (height ? "160px" : "auto")};
`;

const CardTitle = styled.div`
  font-size: ${({ compact }) => (compact ? getFontSize(15) : getFontSize(16))}px !important;
  font-family: Pretendard-SemiBold;
  margin-bottom: ${({ compact }) => (compact ? "3px" : "6px")};
  letter-spacing: 0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: ${() => `${getFontSize(15) * 1.4 * 2}px`};
`;

const RowWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: auto;
`;

const InlineText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  font-weight: 400;
`;

const Separator = styled.div`
  width: 1px;
  height: 12px;
  background: #ccc;
`;

const FooterRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DeadlineBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  border: 1px solid #ffd9b0;
  background: linear-gradient(180deg, #fff7ea 0%, #fff 100%);
  box-shadow: 0 1px 3px rgba(0,0,0,.04);

  .icon { font-size: 1em; }
  .label {
    font-size: ${() => getFontSize(12)}px !important;
    color: #a25a00;
    font-weight: 600;
  }
  .date {
    font-size: ${() => getFontSize(12)}px !important;
    color: #ff7a00;
    font-weight: 700;
    padding-left: 2px;
  }
`;

const ApplyChip = styled.div`
  height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #eadfcb;
  background: #fff;
  color: #222;
  font-size: ${() => getFontSize(13)}px !important;
  font-family: Pretendard-SemiBold;
  line-height: 30px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  transition: transform .06s ease, box-shadow .06s ease;
  user-select: none;
  &:active { transform: translateY(1px); }
`;
