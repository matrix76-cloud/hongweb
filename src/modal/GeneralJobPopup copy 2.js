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
import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, limit, arrayUnion, getDoc } from 'firebase/firestore';

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

// HTML 엔티티 → 문자
const decodeHtml = (s = "") => {
    const t = document.createElement("textarea");
    t.innerHTML = s;
    return t.value;
};

// 값 → 보기용 텍스트(문자/배열/객체 모두 대응)
const toText = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;

    // 배열이면 각 요소를 재귀 변환 후 공백 결합
    if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(" ");

    // 객체면 주소/문자 후보 키 우선적으로 뽑기
    if (typeof v === "object") {
        const cand =
            v.address_name || v.roadAddress || v.roadAddr ||
            v.addr || v.address || v.fullAddr ||
            v.detailAddr || v.addrDetail || v.detail ||
            [v.si || v.city || v.sido, v.gungu || v.sigungu, v.dong || v.emd, v.ri, v.bunji]
                .filter(Boolean).join(" ");

        if (cand) return toText(cand);

        // 그래도 없으면, 하위 원시값만 모아 조합
        try {
            return Object.values(v)
                .filter(x => typeof x !== "object")
                .map(String)
                .join(" ");
        } catch {
            return "";
        }
    }
    return String(v);
};

// 여러 조각을 공백으로 붙이되, 공백 정리
const joinText = (...parts) =>
    parts.map(toText).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

// 본문에 섞인 태그 제거(+ <br> → 개행)
const stripTags = (s = "") =>
    decodeHtml(s).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");

// 전화/연락처 포맷 (문자/배열/객체 모두 대응)
const toDisplayString = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.map(toDisplayString).filter(Boolean).join(", ");
    if (typeof v === "object") {
        const keys = [
            "contactTelno", "telno", "telNo", "tel", "phone", "mobile", "mobileNo",
            "areaNo", "middleNo", "endNo", "AREACD", "AREATEL"
        ];
        const picked = keys.map(k => v[k]).filter(Boolean);
        if (picked.length) return picked.join("-");
        try { return Object.values(v).filter(Boolean).join("-"); }
        catch { return String(v); }
    }
    return String(v);
};

const formatDate = (date) => {
    if (!date) return "";
    const str = String(date);
    if (/^\d{8}$/.test(str)) return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`;
    return str; // 이미 25-08-04 형태면 그대로
};

/* ---------- component ---------- */
const GeneralJobPopup = ({ job, onClose }) => {
    const portalTarget = ensurePortalTarget("modal-root");
    const { user } = useContext(UserContext);

    const title = decodeHtml(job?.title || job?.PBANC_TTL_NM || "공고 제목 없음");

    // 주소/요약은 객체/배열 안전 변환
    const summaryAddr = joinText(job?.region, job?.detailAddr, job?.details?.workRegion);
    const fullAddr = joinText(job?.region, job?.basicAddr, job?.detailAddr, job?.details?.workRegion);

    const closeLimit = formatDate(job?.closeDt) || "없음";
    const regDate = formatDate(job?.regDt);

    const corpName = toText(job?.company || job?.corpInfo?.corpNm || "");


    
    const industry = toText(job?.indTpNm || "");
    const bizDesc = toText(job?.corpInfo?.busiCont || "");

    const jobCont = stripTags(job?.details?.wantedInfo?.jobCont || "");

    const wageText = joinText(job?.salTpNm, job?.sal || job?.minSal);

    const contact = toDisplayString(job?.details?.empchargeInfo?.contactTelno);
    const fax = toDisplayString(job?.details?.empchargeInfo?.chargerFaxNo);

    const wantedUrl = job?.wantedMobileInfoUrl || job?.wantedInfoUrl || "#";

    const mapRef = useRef(null);

    const [showAI, setShowAI] = useState(false); 
    const [aiIntro, setAiIntro] = useState("");

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

    
    const formatEmplCnt = (v) => {
        const s = (toText(v) || "").trim();
        if (!s) return "미정";
        // "미정", "협의", "무관" 등의 케이스는 단위 붙이지 않음
        if (/미정|협의|무관/i.test(s)) return s.replace(/명$/, '');
        // 이미 단위가 있으면 그대로
        if (/명$/.test(s)) return s;
        // 숫자만 오면 명 붙이기
        if (/^\d+$/.test(s)) return `${s}명`;
        // 그 외 텍스트는 있는 그대로 노출
        return s;
    };
    

    // 숫자/문자 정리
    const clean = (v) => (toText(v) || "").trim();
    const asPeopleText = (v) => {
        const s = clean(v);
        if (!s) return "";
        if (/미정|무관|협의/.test(s)) return s;
        if (/명$/.test(s)) return s;
        if (/^\d+$/.test(s)) return `${s}명`;
        return s;
    };
    const asMoneyText = (v) => {
        const s = clean(v);
        if (!s || /^0\s*백만.?원?$/.test(s)) return "";  // 0 백만원 → 숨김
        return s;
    };
    const asHomepageText = (v) => {
        const s = clean(v);
        if (!s) return "";
        const url = /^https?:\/\//i.test(s) ? s : `https://${s.replace(/^\/*/, "")}`;
        return url;
    };

    // 한국어 문장 자연스레 이어붙이기
    const joinSentences = (...arr) => arr.filter(Boolean).join(" ");


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
    

    useEffect(() => {
        const { kakao } = window || {};
        if (!mapRef.current || !kakao?.maps) return;

        let map, marker;
        const lat = Number(job?.latitude);
        const lng = Number(job?.longitude);

        const buildMapAt = (pos) => {
            map = new kakao.maps.Map(mapRef.current, { center: pos, level: 3 });
            marker = new kakao.maps.Marker({ position: pos });
            marker.setMap(map);

            // 🔧 UX: 휠줌 비활성(스크롤 충돌 방지), 드래그 가능, 줌컨트롤 추가
            map.setZoomable(false);
            map.setDraggable(true);
            const zc = new kakao.maps.ZoomControl();
            map.addControl(zc, kakao.maps.ControlPosition.RIGHT);
        };

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            buildMapAt(new kakao.maps.LatLng(lat, lng));
        } else if (fullAddr) {
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(fullAddr, (result, status) => {
                if (status === kakao.maps.services.Status.OK && result[0]) {
                    const pos = new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x));
                    buildMapAt(pos);
                }
            });
        }

        return () => {
            if (mapRef.current) mapRef.current.innerHTML = "";
            map = null;
            marker = null;
        };
    }, [fullAddr, job?.latitude, job?.longitude]);
      

    return createPortal(
        <FullscreenWrapper onClick={(e) => e.stopPropagation()}>
            <TopBar>
                <IoArrowBackOutline
                    size={28}
                    onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                    color="#333"
                />
       
            </TopBar>

            <SummaryBox>

                <Title>{title}</Title>
                {summaryAddr && (<>{summaryAddr}에서 진행되는 일자리예요.<br /></>)}
                모집 인원: {formatEmplCnt(job?.emplCnt) || "미정"}<br />
                마감일: {closeLimit}
            </SummaryBox>

            <CharacterCTA
            title="자기소개"
            subtitle="AI가 자기소개 작성 도와드릴께요  여기를 클릭해주세요"
            tone="purple"
            character={imageDB.aiwritercharacter}      // 만든 캐릭터 이미지
            onClick={() => setShowAI(true)}
            />

            {aiIntro && (
                <AIArea>
                    <Section>
                        <SectionTitle>AI 자기소개</SectionTitle>
                        <SectionAIContent>{aiIntro}</SectionAIContent>
                    </Section>
                    {/* ✅ 복사 버튼 */}
                    <CopyButtonBox onClick={() => {
                        navigator.clipboard.writeText(aiIntro);
                        toast.success("자기소개가 복사되었어요!");
                    }}>
                        📋 복사하기
                    </CopyButtonBox>
                
                </AIArea>
            
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

            {corpName && (
                <Section>
                    <SectionTitle>기업명</SectionTitle>
                    <SectionContent>{corpName}</SectionContent>
                </Section>
            )}

            {industry && (
                <Section>
                    <SectionTitle>업종</SectionTitle>
                    <SectionContent>{industry}</SectionContent>
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
                    <SectionContent>{fullAddr}
                        <MapBox ref={mapRef} aria-label="근무지 지도" />
                    </SectionContent>
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
                    <SectionContent>{toText(job.details.wantedInfo.empTpNm)}</SectionContent>
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
            <Toaster position="bottom-right" richColors />
            <CloseButton onClick={(e) => { e.stopPropagation(); onClose?.(); }}>
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
  font-size: ${() => getFontSize(14)}px !important;
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

const MapBox = styled.div`
  width: 100%;
  height: 260px;   /* 220 → 260으로 살짝 여유 */
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.05);
`;

const SectionAIContent = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  line-height: 1.8;
  word-break: break-word;
  padding-bottom: 4px;  // ✅ 추가
`;

const AIArea = styled.div`
  background: #fff8ec;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #ffd9a0;
  margin-bottom: 20px;
  border-left: 5px solid #ff7a00;  // 🔥 포인트 컬러
`;

const CopyButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;

  & > button {
    background-color: #ff7a00;
    color: white;
    font-size: ${() => getFontSize(12)}px !important;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;

    &:hover {
      background-color: #e96a00;
    }
  }
`;