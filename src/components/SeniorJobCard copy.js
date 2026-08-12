
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";
import SeniorJobPopup from "../modal/SeniorJobPopup";

import dayjs from "dayjs";


const SeniorJobCard = ({ job,jobId, compact = false, height }) => {

    const [showPopup, setShowPopup] = useState(false);

    const formatDate = (date) => {
        const str = String(date);
        if (str.length === 8 && /^\d{8}$/.test(str)) {
            return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`;
        }
        return str;
    };

    const isToday = job?.createdAt &&
        dayjs(job.createdAt.toDate ? job.createdAt.toDate() : job.createdAt).isSame(dayjs(), 'day');
  


    return (
        <>
            <CardWrapper compact={compact} onClick={() => setShowPopup(true)} height={height}>
                <CardTitle compact={compact}>
                    {job.wantedTitle}
                    {isToday && (
                        <RibbonBadge>new</RibbonBadge>
                    )}
                </CardTitle>

                {/* {compact ? (
                    <>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", marginTop: "auto" }}>
                            <InlineText>{job.plbizNm}</InlineText>
                            <Separator />
                            <InlineText>{job.plDetAddr?.split(" ").slice(1, 3).join(" ")}</InlineText>

                        </div>
                        <FooterBadge>
                            ⏰ 마감일 <span className="deadline">{formatDate(job.toAcptDd)}</span>
                        </FooterBadge>
                    </>

                ) : (
                    <>
                        <CardCompany>{job.plbizNm}</CardCompany>
                        <CardContent>{job.plDetAddr?.split(" ").slice(1, 3).join(" ")}</CardContent>
                        <CardFooter>
                            <FooterBadge>
                                ⏰ 마감일 <span className="deadline">{formatDate(job.toAcptDd)}</span>
                            </FooterBadge>
                        </CardFooter>
                    </>
                )} */}

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", marginTop: "auto" }}>
            <InlineText>{job.plbizNm}</InlineText>
            <Separator />
            <InlineText>{job.plDetAddr?.split(" ").slice(1, 3).join(" ")}</InlineText>

          </div>
          <FooterBadge>
            ⏰ 마감일 <span className="deadline">{formatDate(job.toAcptDd)}</span>
          </FooterBadge>

            </CardWrapper>
            {showPopup && (
                <SeniorJobPopup job={job} jobId={jobId} onClose={() => setShowPopup(false)} />
            )}
      
        </>

    );
};
  

export default SeniorJobCard;


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
  max-width: ₩00%;
  padding: ${({ compact }) => compact ? '10px 8px' : '14px'};
  font-size: ${({ compact }) => getFontSize(compact ? 14 : 14)}px !important;

  margin-bottom: ${({ compact }) => (compact ? '0' : '12px')}; // ✅ compact 모드일 때만 제거
  background: #fff;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);  // ✅ 핵심 그림자
  flex-shrink: 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
    justify-content: space-between; // 👈 이거 핵심
  height:  ${({ height }) =>
      height ? "160px" : "auto"};
  `;

const CardTitle = styled.div`
  font-size: ${({ compact }) => compact ? getFontSize(15) : getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold;
  margin-bottom: ${({ compact }) => compact ? '3px' : '6px'};

  letter-spacing: 0.9px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: ${({ compact }) => compact ? `${getFontSize(15) * 1.4 * 2}px` : `${getFontSize(15) * 1.4 * 2}px`};

`;


const CardCompany = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  color: #222;
  margin-bottom: 10px;
  height: ${({ compact }) => compact ? `${getFontSize(13) * 1.4 * 2}px` : `${getFontSize(13) * 1.4 * 2}px`};
`;



const CardFooter = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  margin-top: 6px;
  color: #666;
  font-family: Pretendard-SemiBold;


`;
const CardContent = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  color: #444;
  line-height: 1.4;
`;

const WorkCountBadge = styled.div`
  opacity: 0;
  animation: fadeInBadge 0.8s ease-in-out forwards;
  background: rgba(255, 255, 255, 0.85);
  color: #222;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  margin: 0px auto 8px auto;
  text-align: center;
  width: fit-content;

  @keyframes fadeInBadge {
    from {
      transform: translateY(4px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;
const FooterBadge = styled.div`

  color: #333;
  margin-top:10px;

  font-size: ${() => `${getFontSize(12)}px`} !important;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;

    .deadline {
    color: #FF7A00;
    font-weight: 600;
    padding-left:5px;
    font-size: ${() => `${getFontSize(12)}px`} !important;
  }
`;

const InlineText = styled.div`
  font-size: ${() => `${getFontSize(13)}px`} !important;
  color: #444;
  font-weight: 400;
`;

const Separator = styled.div`
  width: 1px;
  height: 12px;
  background: #ccc;
`;
