import React, { useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import GeneralJobPopup from "../modal/GeneralJobPopup";
import dayjs from "dayjs";
import { COLORS } from "../utility/colors";

const GeneralJobCard = ({ job, jobId, compact = false, height }) => {
  const [showPopup, setShowPopup] = useState(false);

  const isToday = job?.createdAt &&
    dayjs(job.createdAt.toDate ? job.createdAt.toDate() : job.createdAt).isSame(dayjs(), 'day');

  const salaryColorMap = {
    시급: "#1E88E5",
    월급: "#FF7A00",
    연봉: "#43A047",
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
  const color = salaryColorMap[salary.label] || "#666";
  const rawTags = job?.RECRUT_FIELD_NM || "";

  return (
    <>
      <CardWrapper compact={compact} onClick={() => setShowPopup(true)} height={height}>
        <CardTitle compact={compact}>
          {job.PBANC_CONT}
          {isToday && <RibbonBadge>new</RibbonBadge>}
        </CardTitle>

        <CardCompany>{job.ENTRPRS_NM}</CardCompany>

        {compact ? (
          <>
            <CardContent>{job.WORK_REGION_CONT}</CardContent>
            <TagContainer>
              <HashTag>{rawTags}</HashTag>
            </TagContainer>
            <CardFooter>
              <SalaryLabel style={{ color }}>{salary.label}</SalaryLabel> {salary.number}
            </CardFooter>
          </>
        ) : (
          <InlineRow>
            <CardContent>{job.WORK_REGION_CONT}</CardContent>
            <HashTag>{rawTags}</HashTag>
            <SalaryText style={{ color }}>{salary.label} {salary.number}</SalaryText>
          </InlineRow>
        )}
      </CardWrapper>

      {showPopup && (
        <GeneralJobPopup job={job} jobId={jobId} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};

export default GeneralJobCard;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 14px 10px;
  margin-bottom: 8px;
  background: #fff;
  border: none;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  justify-content: space-between;
  box-sizing: border-box;
  width: ${({ compact }) =>
    compact ? "calc((100vw - 32px - 20px) / 2)" : "100%"};
  max-width: 100%;
  min-height: 130px;
  height: ${({ height }) =>
    height ? "160px" : "auto"};
`;

const CardTitle = styled.div`
  font-size: ${({ compact }) => compact ? getFontSize(14) : getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold;
  height: ${({ compact }) =>
    compact ? "calc(1.4em * 3)" : "calc(1.4em * 2)"};
  -webkit-line-clamp: ${({ compact }) =>
    compact ? "3" : "2"};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: normal;
  max-width: 100%;
  margin-bottom: 6px;
`;

const CardCompany = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  color: #222;
  margin-bottom: 10px;
`;

const CardContent = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  color: #444;
  line-height: 1.4;
`;

const HashTag = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #666;
  font-weight: 500;
  word-break: keep-all;
  white-space: nowrap;
  line-height: 1.4;
  overflow-wrap: break-word;
  letter-spacing: -0.9px;
`;

const SalaryLabel = styled.span`
  font-weight: 600;
  font-size: ${() => getFontSize(13)}px !important;
`;

const SalaryText = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  font-weight: 600;
  font-family: Pretendard-SemiBold;
`;

const TagContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
`;

const CardFooter = styled.div`
  font-size: ${() => `${getFontSize(12)}px`} !important;
  margin-top: 12px;
  color: #FF7A00;
  font-weight: 600;
  font-family: Pretendard-SemiBold;
`;

const InlineRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  margin-top: 8px;
`;

const RibbonBadge = styled.span`
  background-color: ${COLORS.primary};
  color: #fff;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 6px;
  vertical-align: middle;
  line-height: 1;
`;

const FooterBadge = styled.div`
  background-color: #fff;
  color: #333;
  border-radius: 12px;
  font-size: ${() => `${getFontSize(12)}px`} !important;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;
