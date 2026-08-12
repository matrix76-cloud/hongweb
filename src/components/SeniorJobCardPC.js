
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";
import SeniorJobPopup from "../modal/SeniorJobPopup";




const SeniorJobCardPC = ({ job, compact = false }) => {

    const [showPopup, setShowPopup] = useState(false);

    const formatDate = (date) => {
        const str = String(date);
        if (str.length === 8 && /^\d{8}$/.test(str)) {
            return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`;
        }
        return str;
    };

    return (
        <CardWrapper compact={compact} onClick={() => setShowPopup(true)}>
            <CardTitle compact={compact}>
            {job.wantedTitle}

            </CardTitle>
            <CardCompany>{job.plbizNm}</CardCompany>
            {/* <CardContent>{job.etcItm}</CardContent> */}
            {/* <CardContent>연령: {job.age ? `${job.age}세 이상` : '제한 없음'}</CardContent> */}
            <CardContent>  {job.plDetAddr?.split(" ").slice(1, 3).join(" ")}</CardContent>

            <CardFooter style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                    {
                        !compact && <FooterBadge>
                            📝 {(job.acptMthdCd && {
                                CM0801: '온라인',
                                CM0802: '이메일',
                                CM0803: '팩스',
                                CM0804: '방문'
                            }[job.acptMthdCd]) || job.acptMthdCd}
                        </FooterBadge>
                    }
      

                    <FooterBadge>
                        ⏰ 마감일 <span className="deadline">{formatDate(job.toAcptDd)}</span>
                    </FooterBadge>
                </div>
            </CardFooter>


            {showPopup && (
              <SeniorJobPopup job={job} jobid={job.id}  onClose={() => setShowPopup(false)} />
            )}

        </CardWrapper>
    );
};
  

export default SeniorJobCardPC;


const CardWrapper = styled.div`
  width: ${({ compact }) => compact ? '100%' : '100%'};
  max-width: ${({ compact }) => compact ? '100%' : '100%'};
  padding: ${({ compact }) => compact ? '10px 8px' : '14px'};
  font-size: ${({ compact }) => getFontSize(compact ? 12 : 14)}px !important;

  border: 1px solid #eee;
  border-radius: 12px;

  margin-bottom: ${({ compact }) => (compact ? '0' : '12px')}; // ✅ compact 모드일 때만 제거

  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  padding :20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 12px;

  margin-right: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  box-sizing: border-box;
  height: 200px;
`;

const CardTitle = styled.div`
  font-size: ${({ compact }) => getFontSize(compact ? 15 : 20)}px !important;
  font-family: Pretendard-SemiBold;
  margin-bottom: ${({ compact }) => compact ? '0px' : '6px'};

  display: -webkit-box;
  -webkit-line-clamp: ${({ compact }) => compact ? 3 : 2};  // ❗ compact일 땐 1줄만
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
    height: 80px;

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

  .deadline {
    color: #FF7A00;
    font-weight: 600;
    padding-left:5px;
    font-size: ${() => `${getFontSize(12)}px`} !important;
  }
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
  background-color: #f1f1f1;
  color: #333;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: ${() => `${getFontSize(12)}px`} !important;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;
