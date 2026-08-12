import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { updateDoc, doc, query, collection, getDoc, getDocs, where } from 'firebase/firestore';
import { UserContext } from '../../../context/User';
import { db } from '../../../api/config';

import { Row } from '../../../common/Row';
import { getFontSize } from '../../../utility/fontsize';
import GeneralJobCard from '../../GeneralJobCard';
import SeniorJobCard from '../../SeniorJobCard';

const MobileAIDocs = () => {
  const { user } = useContext(UserContext);
  const [aiDocs, setAIDocs] = useState([]);

  useEffect(() => {
    const fetchAIDocs = async () => {
      if (!user?.USERS_ID) return;

      const q = query(
        collection(db, "job_intros"),
        where("USERS_ID", "==", user.USERS_ID)
      );
      const snap = await getDocs(q);

      const results = [];
      for (const docSnap of snap.docs) {
        const data = docSnap.data();

        console.log("📦 job_intros 항목:", data);

        // 일자리 정보 불러오기
        let jobData = null;
        try {
          const jobRef = doc(db, data.jobType, data.jobId);
          const jobSnap = await getDoc(jobRef);
          if (jobSnap.exists()) {
            jobData = jobSnap.data();
          } else {
            console.warn("❌ 해당 job 문서 없음:", data.jobId);
          }
        } catch (e) {
          console.warn("🔥 공고 불러오기 실패:", e);
        }

        results.push({
          ...data,  // job_intros 필드 (aiIntro 등)
          ...jobData,    // 실제 공고 정보 (wantedTitle, plbizNm 등)
        });
      }

      console.log("✅ 전체 조합 결과:", results);
      setAIDocs(results);
    };

    fetchAIDocs();
  }, [user]);
  
  return (
    <Wrapper>
      <Grid>
        {aiDocs.map((item) => {
          if (item.jobType === "gg_jobs") {
            return (
              <GeneralJobCard
                height={80}
                key={item.job_intros_id}
                job={item}         // 그대로 전달
                jobId={item.jobId}
                compact
              />
            );
          }

          if (item.jobType === "jobs") {
            return (
              <SeniorJobCard
                height={80}
                key={item.job_intros_id}
                job={item}         // 그대로 전달
                jobId={item.jobId}
                compact
              />
            );
          }

          // 혹시 jobType 이상한 게 들어올 경우 예외 처리
          return null;
        })}
      </Grid>


    </Wrapper>
  );
};

export default MobileAIDocs;

// 스타일
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 100px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 16px;
`;