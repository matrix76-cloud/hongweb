import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { COLORS } from "../utility/colors";
import GeneralJobPopup from "../modal/GeneralJobPopup";
import { decodeHtml } from "../utility/html";

/**
 * Worknet 전용 카드
 * - job: Firestore "worknet_v2_jobs" 문서의 원본 Object
 */
export default function GeneralJobCard({ job = {} }) {
  const [showPopup, setShowPopup] = useState(false);

  const data = useMemo(() => normalize(job), [job]);
  const {
    title,
    company,
    region,
    categoryText,
    payLabel,
    payAmount,
    payType,
    badges,
    distanceText,
    postedText,
    closeText,
    descText,
  } = data;

  return (
    <Card onClick={() => setShowPopup(true)} tabIndex={0}>
      <TopRow>
        <Title>{decodeHtml(title)}</Title>
        {distanceText && <Pill>{distanceText}</Pill>}
      </TopRow>

      <MetaRow>
        {company && <MetaItem>{company}</MetaItem>}
        {region && <MetaDot>·</MetaDot>}
        {region && <MetaItem>{region}</MetaItem>}
      </MetaRow>

      {(categoryText || payAmount) && (
        <MetaRow2>
          {categoryText && <Tag>{categoryText}</Tag>}
          {payAmount && (
            <PayRow>
              {payLabel && <PayBadge $type={payType}>{payLabel}</PayBadge>}
              <PayAmount $type={payType}>{payAmount}</PayAmount>
            </PayRow>
          )}
        </MetaRow2>
      )}

      {badges?.length > 0 && (
        <BadgeRow>
          {badges.slice(0, 3).map((b, i) => (
            <SoftBadge key={i}>{b}</SoftBadge>
          ))}
        </BadgeRow>
      )}

      {descText && <Desc>{descText}</Desc>}

      {showPopup && (
        <GeneralJobPopup job={job} onClose={() => setShowPopup(false)} />
      )}

      <FootRow>
        <FootTextWrap>
          {postedText && <FootText>{postedText}</FootText>}
          {postedText && closeText && <FootDot>·</FootDot>}
          {closeText && <FootText>{closeText}</FootText>}
        </FootTextWrap>
      </FootRow>
    </Card>
  );
}

/* ========= Normalizer ========= */
function normalize(raw = {}) {
  // 제목
  const title = pick(raw, ["wantedTitle", "title", "PBANC_CONT"], "(제목 없음)");

  // 회사/기관명
  const company = pick(raw, ["company", "plbizNm", "ENTRPRS_NM", "oranNm"], "");

  // 지역 텍스트
  const region = pick(
    raw,
    ["plDetAddr", "workAddr", "WORK_REGION_CONT", "work_region_cont"],
    ""
  );

  // 직무/분류
  const jobsNm = pick(raw, ["jobsNm", "RECRUT_FIELD_NM"], "");
  const indTpNm = pick(raw, ["indTpNm"], "");
  const categoryText = [jobsNm, indTpNm].filter(Boolean).join(" · ") || "";

  // 급여
  const minSalRaw = tryNumber(pick(raw, ["minSal", "min_sal"]));
  const maxSalRaw = tryNumber(pick(raw, ["maxSal", "max_sal"]));
  const salTxt = pick(raw, ["sal", "PAY_TXT"], "");
  let payLabel = "";
  let payAmount = "";
  let payType = "";
  const salVal = minSalRaw || maxSalRaw;
  if (salVal) {
    const formatted = new Intl.NumberFormat("ko-KR").format(salVal);
    if (salVal >= 10000000) { payLabel = "연봉"; payType = "annual"; }
    else if (salVal >= 1000000) { payLabel = "월급"; payType = "monthly"; }
    else { payLabel = "시급"; payType = "hourly"; }
    payAmount = `${formatted}원`;
  } else if (salTxt) {
    payAmount = salTxt;
  }

  // 거리
  const distanceKm = tryNumber(raw.distanceKm);
  const distanceText =
    typeof distanceKm === "number" ? `${distanceKm.toFixed(1)}km` : "";

  // 등록/마감
  const postedRaw = pick(
    raw,
    ["regDt", "postedAt", "insertDt", "createDt"],
    ""
  );
  const closeRaw = pick(raw, ["closeDt", "closeDate", "clseDd"], "");
  const postedText = postedRaw ? `등록: ${fmtDate(postedRaw)}` : "";
  const closeText = closeRaw ? `마감: ${fmtDate(closeRaw)}` : "";

  // 간략 설명
  const descText = pick(
    raw,
    ["etcItm", "PBANC_FORM_DIV", "CAREER_DIV", "ACDMCR_DIV"],
    ""
  );

  // 뱃지 후보
  const empType = pick(raw, ["empTpNm", "empType", "WORK_TYPE"], "");
  const acpt = mapAcptMethod(pick(raw, ["acptMthdCd", "applyMethod"], ""));
  const career = pick(raw, ["CAREER_DIV", "career", "careerNm"], "");
  const edu = pick(raw, ["ACDMCR_DIV", "education", "eduNm"], "");
  const badges = [empType, acpt, career, edu].filter(Boolean);

  return {
    title,
    company,
    region,
    categoryText,
    payLabel,
    payAmount,
    payType,
    distanceText,
    postedText,
    closeText,
    descText,
    badges,
  };
}

/* ========= Helpers ========= */
function pick(obj, keys, fallback = "") {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return fallback;
}

function tryNumber(v) {
  if (v === undefined || v === null) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

function parseMoney(v) {
  if (v === undefined || v === null || v === "") return "";
  const n = tryNumber(v);
  if (!Number.isFinite(n)) return String(v);
  try {
    return new Intl.NumberFormat("ko-KR").format(n);
  } catch {
    return String(n);
  }
}

function fmtDate(v) {
  const s = String(v);
  if (/^\d{8}$/.test(s))
    return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  }
  return s;
}

function mapAcptMethod(code) {
  const map = {
    CM0801: "온라인",
    CM0802: "이메일",
    CM0803: "팩스",
    CM0804: "방문",
  };
  return map[code] || "";
}

/* ========= Styles ========= */
const Card = styled.div`
  position: relative;
  border: 1px solid #efefef;
  border-radius: 14px;
  background: #fff;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.065s ease, box-shadow 0.08s ease;
  &:active {
    transform: scale(0.99);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }
  width: 90%;
  margin: 10px auto;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const Title = styled.div`
  flex: 1;
  font-size: ${() => getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold;
  color: #222;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;

const Pill = styled.div`
  flex: none;
  align-self: center;
  background: ${COLORS.primary};
  color: #fff;
  font-size: ${() => getFontSize(12)}px !important;
  padding: 4px 8px;
  border-radius: 999px;
  white-space: nowrap;
  font-weight: 700;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  color: #555;
  font-size: ${() => getFontSize(13)}px !important;
`;

const MetaRow2 = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const MetaItem = styled.div``;
const MetaDot = styled.div`
  opacity: 0.6;
`;

const Tag = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  padding: 6px 8px;
  border-radius: 8px;
  background: #f5f5f5;
  color: #555;
  font-weight: 700;
`;

const PAY_COLORS = {
  hourly:  { bg: "#FFF0F0", badge: "#E53E3E", text: "#C53030" },
  monthly: { bg: "#EBF5FF", badge: "#3182F6", text: "#1E60D0" },
  annual:  { bg: "#F0FFF4", badge: "#38A169", text: "#276749" },
};

const PayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: ${({ $type }) => PAY_COLORS[$type]?.bg || "#FFF0F0"};
`;

const PayBadge = styled.span`
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 500;
  color: #fff;
  background: ${({ $type }) => PAY_COLORS[$type]?.badge || "#E53E3E"};
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: -0.2px;
  flex-shrink: 0;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const PayAmount = styled.span`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  color: ${({ $type }) => PAY_COLORS[$type]?.text || "#C53030"};
  letter-spacing: -0.3px;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const SoftBadge = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f6f6f6;
  color: #666;
  border: 1px solid #eee;
`;

const Desc = styled.div`
  margin-top: 10px;
  color: #666;
  font-size: ${() => getFontSize(13)}px !important;
  line-height: 1.45;
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const FootTextWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const FootText = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #888;
`;

const FootDot = styled.span`
  color: #c1c1c1;
  line-height: 1;
`;
