// 📄 GeneralJobPopup.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { IoArrowBackOutline } from "react-icons/io5";
import { COLORS } from "../utility/colors";
import CharacterCTA from "../common/CharacterCTA";
import { imageDB } from "../utility/imageData";
import { toast, Toaster } from "sonner";
import { AIPopup } from "./AIPopup";
import { saveJobIntro } from "../service/jobService";
import { UserContext } from "../context/User";
import { db } from "../api/config";
import { doc, getDoc } from "firebase/firestore";

/* ---------- helpers ---------- */
const ensurePortalTarget = (id = "modal-root") => {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement("div");
        el.id = id;
        document.body.appendChild(el);
    }
    return el;
};

const decodeHtml = (s = "") => {
    const t = document.createElement("textarea");
    t.innerHTML = s;
    return t.value;
};

const toText = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(" ");
    if (typeof v === "object") {
        try {
            return Object.values(v)
                .filter((x) => typeof x !== "object")
                .map(String)
                .join(" ");
        } catch {
            return "";
        }
    }
    return String(v);
};

const joinText = (...parts) =>
    parts.map(toText).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const stripTags = (s = "") =>
    decodeHtml(s)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "");

const toDisplayString = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.map(toDisplayString).filter(Boolean).join(", ");
    if (typeof v === "object") {
        try {
            return Object.values(v).filter(Boolean).join("-");
        } catch {
            return String(v);
        }
    }
    return String(v);
};

const formatDate = (date) => {
    if (!date) return "";
    const str = String(date);
    if (/^\d{8}$/.test(str))
        return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`;
    return str;
};

// 숫자/문자 포맷
const clean = (v) => (toText(v) || "").trim();
const asPeopleText = (v) => {
    const s = clean(v);
    if (!s) return null;

    if (/명$/.test(s)) return s;

    return s;
};
const asHomepageText = (v) => {
    const s = clean(v);
    if (!s) return "";
    return /^https?:\/\//i.test(s)
        ? s
        : `https://${s.replace(/^\/*/, "")}`;
};

// "12000 백만원" → "1,200억 원" 변환
const parseMoneyToKRW = (v) => {
    const s = clean(v).replace(/[^0-9]/g, "");
    if (!s) return null;
    const num = parseInt(s, 10) * 100000; // '백만원' = 100,000원
    if (num === 0) return null;           // 0이면 표시 안 함 (정보 없음)

    const eok = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);

    if (eok > 0 && man > 0) {
        return `${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만 원`;
    } else if (eok > 0) {
        return `${eok.toLocaleString("ko-KR")}억 원`;
    } else {
        return `${man.toLocaleString("ko-KR")}만 원`;
    }
};



/* ---------- component ---------- */
const GeneralJobPopup = ({ job, onClose }) => {
    
    console.log("General JobPopup", job);
    const portalTarget = ensurePortalTarget("modal-root");
    const { user } = useContext(UserContext);

    const title = decodeHtml(job?.title || job?.PBANC_TTL_NM || "공고 제목 없음");

    const summaryAddr = joinText(
        job?.region,
        job?.detailAddr,
        job?.details?.workRegion
    );
    const fullAddr = joinText(
        job?.region,
        job?.basicAddr,
        job?.detailAddr,
        job?.details?.workRegion
    );

    const closeLimit = formatDate(job?.closeDt) || "없음";
    const regDate = formatDate(job?.regDt);

    const corpName = toText(job?.company || job?.corpInfo?.corpNm || "");
    const industry = toText(job?.indTpNm || "");
    const bizDesc = toText(job?.details?.corpInfo?.busiCont || "");
    const jobCont = stripTags(job?.details?.wantedInfo?.jobCont || "");
    const wageText = joinText(job?.salTpNm, job?.sal || job?.minSal);

    const contact = toDisplayString(job?.details?.empchargeInfo?.contactTelno);
    const fax = toDisplayString(job?.details?.empchargeInfo?.chargerFaxNo);
    const wantedUrl =
        job?.wantedMobileInfoUrl || job?.wantedInfoUrl || "#";

    const mapRef = useRef(null);

    const [showAI, setShowAI] = useState(false);
    const [aiIntro, setAiIntro] = useState("");

    // corpInfo 파싱
    const corp = job?.details?.corpInfo || {};
    const corpSummary = {
        name: clean(job?.company || job?.corpInfo?.corpNm || ""),
        industry: clean(corp.indTpCdNm || toText(job?.indTpNm) || ""),
        biz: clean(corp.busiCont || ""),
        size: clean(corp.busiSize || ""),
        headcount: asPeopleText(corp.totPsncnt),
        ceo: clean(corp.reperNm || ""),
        capital: parseMoneyToKRW(corp.capitalAmt),   // 0이면 null
        sales: parseMoneyToKRW(corp.yrSalesAmt),     // 0이면 null
        addr: clean(corp.corpAddr || fullAddr || ""),
        homepage: asHomepageText(corp.homePg || ""),
    };

    const roleName = toText(job?.details?.wantedInfo?.jobsNm || job?.jobsNm || job?.jobsCd);
    const eduReq = toText(job?.details?.wantedInfo?.eduNm);
    const empTypeTxt = toText(job?.details?.wantedInfo?.empTpNm);
    const hoursTxt = stripTags(job?.details?.wantedInfo?.workdayWorkhrCont || "");
    const insTxt = toText(job?.details?.wantedInfo?.fourIns);
    const holidays = toText(job?.holidayTpNm);
    

    const aiPrompt = `
        [채용 요약]
        - 공고 제목: ${title}
        - 기업명: ${corpName || "미공개"}
        - 직무/분야: ${roleName || industry || "미기재"}
        - 위치: ${fullAddr || summaryAddr || "미기재"}
        - 고용형태: ${empTypeTxt || "미기재"}
        - 임금: ${wageText || "미기재"}
        - 경력: ${toText(job?.career) || toText(job?.details?.wantedInfo?.enterTpNm) || "무관/미기재"}
        - 학력: ${eduReq || "무관/미기재"}
        - 근무시간: ${hoursTxt || "미기재"}
        - 휴일: ${holidays || "미기재"}
        - 복리후생(4대보험 등): ${insTxt || "미기재"}
        - 마감일: ${closeLimit || "미기재"}

        [상세 업무]
        ${jobCont || "상세 업무 미기재"}

        [요청]
        위 정보를 반영해 600~900자 한국어 자기소개 초안을 작성해줘.
        구성: 지원 동기 → 보유 역량/경험 2~3개(직무 연관성) → 근무 가능 일정·형태 적합성 → 마무리 다짐.
        문체는 정중·간결, 추정 금지(미기재는 일반 표현으로), 단락은 줄바꿈으로 구분.
        `;

    
    const corpIntro = (() => {
        const s1 =
            (corpSummary.name || corpSummary.industry)
                ? `${corpSummary.name}${corpSummary.industry ? "는 " : "은 "}${corpSummary.industry ? `${corpSummary.industry}을(를) 하는` : ""} ${corpSummary.size || ""} 기업이에요.`
                : "";

        const s2 = corpSummary.biz ? `주요 사업은 ${corpSummary.biz} 입니다.` : "";

        const s3 = corpSummary.addr
            ? `${corpSummary.addr}에 위치해 있어요.`
            : "";

        const s3b = corpSummary.headcount
            ? `임직원은 약 ${corpSummary.headcount} 규모예요.`
            : `임직원 수 정보는 제공되지 않았어요.`;

        const capText = corpSummary.capital
            ? `자본금은 ${corpSummary.capital}`
            : `자본금 정보는 확인되지 않았어요`;

        const salesText = corpSummary.sales
            ? `연 매출은 ${corpSummary.sales}예요`
            : `연 매출 정보는 확인되지 않았어요`;

        const s4 = `${capText}, ${salesText}.`;

        const s5 = corpSummary.ceo ? `대표자는 ${corpSummary.ceo} 님이에요.` : "";

        const s6 = corpSummary.homepage
            ? `자세한 정보는 홈페이지에서 확인하실 수 있어요.`
            : "";

        return [s1, s2, s3, s3b, s4, s5, s6].filter(Boolean).join(" ");
    })();

    // AI 자기소개 불러오기
    useEffect(() => {
        const fetchAIIntro = async () => {
            try {
                const ref = doc(db, "job_intros", `${user.USERS_ID}_${job.id}`);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setAiIntro(snap.data().aiIntro);
                }
            } catch (err) {
                console.error("🔥 AI 자기소개 불러오기 실패:", err);
            }
        };
        fetchAIIntro();
    }, [job.id, user.USERS_ID]);

    return createPortal(
        <FullscreenWrapper onClick={(e) => e.stopPropagation()}>
            <TopBar>
                <IoArrowBackOutline
                    size={28}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                    color="#333"
                />
            </TopBar>

            <SummaryBox>
                <Title>{title}</Title>
                {summaryAddr && (
                    <>
                        {summaryAddr}에서 진행되는 일자리예요.<br />
                    </>
                )}
                모집 인원: {job?.emplCnt || "미정"} <br />
                마감일: {closeLimit}
            </SummaryBox>

            <CharacterCTA
                title="자기소개"
                subtitle={`AI가 자기소개 작성 도와드릴께요
                여기를 클릭해주세요`}   // ↩️ 그냥 줄바꿈 넣기
                tone="purple"
                character={imageDB.aiwritercharacter}
                onClick={() => setShowAI(true)}
            />

            {aiIntro && (
                <AIArea>
                    <Section>
                        <SectionTitle>AI 자기소개</SectionTitle>
                        <SectionAIContent>{aiIntro}</SectionAIContent>
                    </Section>
                </AIArea>
            )}

            {corpName && (
                <Section>
                    <SectionTitle>기업명</SectionTitle>
                    <SectionContent>{corpName}</SectionContent>
                </Section>
            )}

            {corpIntro && (
                <Section>
                    <SectionTitle>기업 소개</SectionTitle>
                    <CompanyNarrative>
                        {corpIntro}
                        {corpSummary.homepage && (
                            <>
                                <br />
                                <Link
                                    href={corpSummary.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {corpSummary.homepage}
                                </Link>
                            </>
                        )}
                    </CompanyNarrative>
                </Section>
            )}

            {bizDesc && (
                <Section>
                    <SectionTitle>사업내용</SectionTitle>
                    <SectionContent>{bizDesc}</SectionContent>
                </Section>
            )}

            {jobCont && (
                <Section>
                    <SectionTitle>상세 내용</SectionTitle>
                    <SectionContent style={{ whiteSpace: "pre-line" }}>
                        {jobCont}
                    </SectionContent>
                </Section>
            )}

            {fullAddr && (
                <Section>
                    <SectionTitle>근무지역</SectionTitle>
                    <SectionContent>{fullAddr}</SectionContent>
                </Section>
            )}

            {(job?.salTpNm || job?.sal || job?.minSal) && (
                <Section>
                    <SectionTitle>임금</SectionTitle>
                    <SectionContent>{wageText}</SectionContent>
                </Section>
            )}

            {toText(job?.career) && (
                <Section>
                    <SectionTitle>경력</SectionTitle>
                    <SectionContent>{toText(job.career)}</SectionContent>
                </Section>
            )}

            {toText(job?.holidayTpNm) && (
                <Section>
                    <SectionTitle>휴일</SectionTitle>
                    <SectionContent>{toText(job.holidayTpNm)}</SectionContent>
                </Section>
            )}

            {job?.details?.wantedInfo?.empTpNm && (
                <Section>
                    <SectionTitle>고용형태</SectionTitle>
                    <SectionContent>
                        {toText(job.details.wantedInfo.empTpNm)}
                    </SectionContent>
                </Section>
            )}

            {regDate && (
                <Section>
                    <SectionTitle>등록일</SectionTitle>
                    <SectionContent>{regDate}</SectionContent>
                </Section>
            )}

            {(contact || fax) && (
                <Section>
                    <SectionTitle>연락처</SectionTitle>
                    <SectionContent>
                        {contact && <>☎ {contact}</>}
                        {contact && fax && " / "}
                        {fax && <>Fax {fax}</>}
                    </SectionContent>
                </Section>
            )}

            {wantedUrl && wantedUrl !== "#" && (
                <Section>
                    <SectionTitle>홈페이지</SectionTitle>
                    <SectionContent>
                        <Link href={wantedUrl} target="_blank" rel="noopener noreferrer">
                            워크넷 상세보기
                        </Link>
                    </SectionContent>
                </Section>
            )}

            {/* ✅ AI 팝업 연결 */}
                {showAI && (
                    <AIPopup
                        original=""
                        workMeta={{
                            promptText:aiPrompt,   
                            }}
                        onApply={async (text) => {
                            console.log("✨ 생성된 자기소개:", text);
                            toast.success("AI 자기소개가 생성되었어요!");
                            setShowAI(false);
                            await saveJobIntro({
                                USERS_ID: user.USERS_ID,
                                jobId: job.id,
                                jobType: "gg_jobs", // 또는 "jobs"
                                aiIntroText: text,
                                });
                            setAiIntro(text); // 💡 상태 업데이트
                        }}
                        onCancel={() => setShowAI(false)}
                    />
                )}
            

            <Toaster position="bottom-right" richColors />
            <CloseButton
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                }}
            >
                닫기
            </CloseButton>
        </FullscreenWrapper>,
        portalTarget
    );
};

export default GeneralJobPopup;

/* ===== styled-components ===== */
const FullscreenWrapper = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: #fff;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
`;
const TopBar = styled.div`
  display: flex; align-items: center;
  margin-bottom: 12px;
`;
const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-SemiBold;
`;
const SummaryBox = styled.div`
  background: #f9f9f9;
  padding: 14px;
  font-size: ${() => getFontSize(16)}px !important;
  color: #333;
  line-height: 1.6;
  border-radius: 12px;
  margin-bottom: 20px;
`;
const Section = styled.div`
  border-top: 1px solid #eee;
  padding: 14px 0;
`;
const SectionTitle = styled.div`
  font-size: ${() => getFontSize(15)}px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
  font-family: Pretendard-SemiBold;
`;
const SectionContent = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #444;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-wrap;
`;
const Link = styled.a`
  color: #007aff;
  text-decoration: underline;
  word-break: break-word;
`;
const CloseButton = styled.button`
  background: ${COLORS.primary};
  color: white;
  width: 90%;
  padding: 10px 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: ${() => getFontSize(15)}px;
  cursor: pointer;
  display: block;
  margin: 24px auto 0;
`;
const SectionAIContent = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  line-height: 1.8;
  word-break: break-word;
  padding-bottom: 4px;
`;
const AIArea = styled.div`
  background: #fff8ec;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #ffd9a0;
  margin-bottom: 20px;
  border-left: 5px solid #ff7a00;
`;
const CompanyNarrative = styled.div`
  font-size: ${() => getFontSize(13)}px;
  line-height: 1.8;
  color: #333;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px;
`;
