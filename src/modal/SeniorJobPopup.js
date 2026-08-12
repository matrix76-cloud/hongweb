import ReactDOM from "react-dom";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import {
  MdBusiness,
  MdInfoOutline,
  MdPerson,
  MdLanguage,
  MdLocationOn,
} from "react-icons/md";
import { FaUsers, FaUserClock, FaPhone } from "react-icons/fa";
import { AIPopup } from "./AIPopup";
import { saveAIIntroToJob, saveJobIntro } from "../service/jobService";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User";
import { db } from "../api/config";
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, limit, arrayUnion, getDoc } from 'firebase/firestore';

import { toast, Toaster } from "sonner";
import { IoArrowBackOutline } from "react-icons/io5";
import CharacterCTA from "../common/CharacterCTA";
import { imageDB } from "../utility/imageData";



// senior 전용 서브타이틀 빌더
// 
 const buildSubtitleSenior = (job) => {
  // 기관/회사명 후보
  const org =
    job?.plbizNm?.trim?.() ||   // 모집 기관명
    job?.instNm?.trim?.() ||     // 기관명(데이터셋에 따라)
    job?.orgName?.trim?.() ||    // 기타 백업
    "";

  // 직무/포지션 후보
  const role =
    job?.wantedTitle?.trim?.() ||  // 공고 제목(직무명에 가장 가깝게 표시되는 필드)
    job?.jssfcNm?.trim?.() ||      // 직종/직무명 유사 필드(있을 때)
    job?.workDivNm?.trim?.() ||    // 업무 구분
    "";

  // "기관 · 직무 자기소개 초안 만들어줘요" 형태
  if (org && role) return `${org} · ${role} 자기소개 초안 만들어줘요`;
  if (org) return `${org} 자기소개 초안 만들어줘요`;
  if (role) return `${role} 자기소개 초안 만들어줘요`;
  return `자기소개 초안 만들어줘요`;
};


const SeniorJobPopup = ({ job, jobId, onClose }) => {

    const [showAI, setShowAI] = useState(false);
    const [aiIntro, setAiIntro] = useState("");  
    
    const { user } = useContext(UserContext);

    console.log("Senior", jobId, user.USERS_ID);
    

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

  return ReactDOM.createPortal(
    <FullscreenWrapper>
        <TopBar>
        <IoArrowBackOutline size={28} onClick={onClose}  color="#333" />
        <Title>{job?.wantedTitle || "일자리 제목"}</Title>
      </TopBar>

      <SummaryBox>
        {job.plDetAddr}에서 진행하는 공공 일자리예요.<br />
        모집 인원은 {job.clltPrnnum}명이며,{" "}
        {job.age ? `${job.age}세 이상 가능` : "연령 제한 없음"}입니다.
      </SummaryBox>



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

      <Section style={{marginTop:15}}>
        <SectionTitle>모집 기관</SectionTitle>
        <SectionContent>{job.plbizNm}</SectionContent>
      </Section>

      <Section>
        <SectionTitle>근무 위치</SectionTitle>
        <SectionContent>{job.plDetAddr}</SectionContent>
      </Section>

      <Section>
        <SectionTitle>참고 내용</SectionTitle>
        <SectionContent>{job.etcItm || "별도 내용 없음"}</SectionContent>
      </Section>

      <CharacterCTA
          title="자기소개 작성을 도와드려요"
          subtitle={buildSubtitleSenior(job)}
          tone="purple"
          character={imageDB.aiwritercharacter}      // 만든 캐릭터 이미지
          onClick={() => setShowAI(true)}
      />
      

      <Section>
        <SectionTitle>접수 방법</SectionTitle>
        <SectionContent>
          {
            {
              CM0801: "온라인",
              CM0802: "이메일",
              CM0803: "팩스",
              CM0804: "방문",
            }[job.acptMthdCd] || job.acptMthdCd
          }
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>마감일</SectionTitle>
        <SectionContent>{job.toAcptDd}</SectionContent>
      </Section>

      {job.homepage && (
        <Section>
          <SectionTitle>홈페이지</SectionTitle>
          <SectionContent>
            <a href={job.homepage} target="_blank" rel="noreferrer">
              {job.homepage}
            </a>
          </SectionContent>
        </Section>
      )}

      {job.clerk && (
        <Section>
          <SectionTitle>담당자</SectionTitle>
          <SectionContent>
            {job.clerk}
            {job.clerkContt && ` (${job.clerkContt})`}
          </SectionContent>
        </Section>
      )}

          <CloseButton onClick={() => {
              console.log("닫기 버튼 눌림");
              onClose();
          }}>닫기</CloseButton>

          {/* ✅ AI 팝업 연결 */}
          {showAI && (
              <AIPopup
                  original=""
                  workMeta={{
                      promptText: `
                    - 모집 기관: ${job.plbizNm}
                    - 근무 위치: ${job.plDetAddr}
                    - 참고 내용: ${job.etcItm}
     
                      `,
                  }}
                  onApply={async (text) => {
                      console.log("✨ 생성된 자기소개:", text);
                      toast.success("AI 자기소개가 생성되었어요!");
                      setShowAI(false);
                       await saveJobIntro({
                        USERS_ID: user.USERS_ID,
                        jobId: job.id,
                        jobType: "jobs", // 또는 "jobs"
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

export default SeniorJobPopup;

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

const CloseIcon = styled.div`
  font-size: 20px;
  cursor: pointer;
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

`;

const SectionAIContent = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  line-height: 1.8;
  word-break: break-word;
  padding-bottom: 4px;  // ✅ 추가
`;

const CloseButton = styled.button`
  background: #ff7e19;
  color: white;
  width: fit-content;
  padding: 10px 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: ${() => getFontSize(15)}px !important;
  cursor: pointer;
  display: block;
  margin-left: 0;  // 왼쪽 정렬
  width : 90%;
  margin : 24px auto;
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