import ReactDOM from "react-dom";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import {
    MdBusiness, MdLocationOn, MdPerson, MdWorkHistory, MdAttachMoney, MdLanguage,
} from "react-icons/md";
import { FaUserClock, FaUsers, FaPhone, FaGraduationCap } from "react-icons/fa";
import { LuFileText, LuTag } from "react-icons/lu";
import { useEffect, useState } from "react";
import { AIPopup } from "../modal/AIPopup";
import { useContext } from "react";
import { UserContext } from "../context/User";
import { toast, Toaster } from "sonner";
import { saveAIIntroToGeneralJob, saveJobIntro } from "../service/jobService";

import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, limit, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from "../api/config";
import { IoArrowBackOutline } from "react-icons/io5";
import CharacterCTA from "../common/CharacterCTA";
import { imageDB } from "../utility/imageData";


const GeneralJobPopup = ({ job, jobId, onClose }) => {
    const { user } = useContext(UserContext);
    const [showAI, setShowAI] = useState(false);

    const [aiIntro, setAiIntro] = useState("");


    console.log("GeneralJobPopup", jobId, job);



    useEffect(() => {
        const fetchAIIntro = async () => {
            try {
                const ref = doc(db, "job_intros", `${user.USERS_ID}_${jobId}`);
                const snap = await getDoc(ref);


                if (snap.exists()) {
                    setAiIntro(snap.data().aiIntro);
                }
            } catch (err) {
                console.error("🔥 AI 자기소개 불러오기 실패:", err);
            }
        };

        fetchAIIntro();
    }, [jobId, user.USERS_ID]);


    const workMeta = {
        company: job.ENTRPRS_NM,
        location: job.WORK_REGION_CONT,
        type: job.PBANC_FORM_DIV,
        field: job.RECRUT_FIELD_NM,
        education: job.ACDMCR_DIV,
        career: job.CAREER_DIV,
        salary: job.SALARY_COND
      };

    const formatDate = (date) => {
        if (!date) return "";
        const str = String(date);
        if (str.length === 8 && /^\d{8}$/.test(str)) {
            return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`;
        }
        return str;
    };

    return ReactDOM.createPortal(
        <FullscreenWrapper>
            <TopBar>
                <IoArrowBackOutline size={28} onClick={onClose}  color="#333" />
                <Title>{job?.PBANC_CONT || "공고 제목 없음"}</Title>
            </TopBar>

            <SummaryBox>
                {job.WORK_REGION_CONT}에서 진행되는 민간 일자리예요.<br />
                모집 인원은 {job.EMPLMNT_PSNCNT || "미정"}명이며, 접수 마감일은 {formatDate(job.RCPT_END_DE)}입니다.
            </SummaryBox>




            <CharacterCTA
                title="자기소개"
                subtitle="AI가 자기소개 작성 도와줄게요"
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

         

            <Section style={{ marginTop: 15 }}>
                <SectionTitle>기업명</SectionTitle>
                <SectionContent>{job.ENTRPRS_NM}</SectionContent>
            </Section>
            <Section>
                <SectionTitle>근무 위치</SectionTitle>
                <SectionContent>{job.WORK_REGION_CONT}</SectionContent>
            </Section>
            <Section>
                <SectionTitle>근무형태</SectionTitle>
                <SectionContent>{job.PBANC_FORM_DIV}</SectionContent>
            </Section>
            <Section>
                <SectionTitle>근무 종류</SectionTitle>
                <SectionContent>{job.RECRUT_FIELD_NM}</SectionContent>
            </Section>
            <Section>
                <SectionTitle>학력 조건</SectionTitle>
                <SectionContent>{job.ACDMCR_DIV}</SectionContent>
            </Section>
            <Section>
                <SectionTitle>경력 조건</SectionTitle>
                <SectionContent>{job.CAREER_DIV}</SectionContent>
            </Section>
            <Section>
                <SectionTitle>연봉 조건</SectionTitle>
                <SectionContent>{job.SALARY_COND}</SectionContent>
            </Section>
            {job.CHARGER_NM && (
                <Section>
                    <SectionTitle>담당자</SectionTitle>
                    <SectionContent>
                        {job.CHARGER_NM}
                        {job.CHARGER_RELATE_TELNO && ` (${job.CHARGER_RELATE_TELNO})`}
                    </SectionContent>
                </Section>
            )}
            {job.URL && (
                <Section>
                    <SectionTitle>홈페이지</SectionTitle>
                    <SectionContent>
                        <Link href={job.URL} target="_blank" rel="noopener noreferrer">{job.URL}</Link>
                    </SectionContent>
                </Section>
            )}

            <CloseButton onClick={onClose}>닫기</CloseButton>

    
        
            {/* ✅ AI 팝업 연결 */}
            {showAI && (
                <AIPopup
                    original=""
                    workMeta={{
                        promptText: `
                        - 기업명: ${job.ENTRPRS_NM}
                        - 근무 위치: ${job.WORK_REGION_CONT}
                        - 근무 형태: ${job.PBANC_FORM_DIV}
                        - 근무 분야: ${job.RECRUT_FIELD_NM}
                        - 학력 조건: ${job.ACDMCR_DIV}
                        - 경력 조건: ${job.CAREER_DIV}
                        - 연봉 조건: ${job.SALARY_COND}
                          `,   
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
        </FullscreenWrapper>,
        document.getElementById("modal-root")
    );
};

export default GeneralJobPopup;


const FullscreenWrapper = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
    margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-SemiBold;
  padding-left:10px;

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
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
  font-family: Pretendard-SemiBold;
`;

const SectionContent = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  line-height: 1.4;
  word-break: break-word;
  padding-bottom: 4px;  // ✅ 추가
`;
const SectionAIContent = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  line-height: 1.8;
  word-break: break-word;
  padding-bottom: 4px;  // ✅ 추가
`;



const Link = styled.a`
  color: #007aff;
  text-decoration: underline;
  display: inline-block;
  padding: 4px 0;        // ✅ 여기도 추가하면 완벽
  word-break: break-word;
`;
const CloseButton = styled.button`
  background: #ff7e19;
  color: white;
  width: 90%;
  padding: 10px 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: ${() => getFontSize(15)}px !important;
  cursor: pointer;
  display: block;
  margin: 24px auto 0;
`;

const AIButton = styled.button`
  font-size: ${() => getFontSize(16)}px !important;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  color: #ff7e19;
  width: 100%;
  margin: -10px 0 16px;
  cursor: pointer;
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
    font-size: ${() => getFontSize(12)}px;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;

    &:hover {
      background-color: #e96a00;
    }
  }
`;