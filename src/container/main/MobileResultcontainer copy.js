// 📄 MobileResultcontainer.jsx

import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import { Column } from "../../common/Column";
import { getGeneralJobs, getJobList } from "../../service/jobService";

import SeniorJobCard from "../../components/SeniorJobCard";
import GeneralJobCard from "../../components/GeneralJobCard";
import { getNearbyWorkers } from "../../service/WorkerService";
import MobileWorkerCard from "../../components/MobileWorkerCard";
import { extractCityName } from "../../utility/region";
import { CiSearch } from "react-icons/ci";
import { COLORS } from "../../utility/colors";
import VoiceDictateButton from "../../common/VoiceDictateButton";
import Spinner from "../../components/DotSpinner";


const HEADER_HEIGHT = 47;
const FOOT_HEIGHT = 65;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  background-color: #fff;
  padding: 0 16px;
`;



const FooterSummary = styled.div`
  padding: 24px 0;
  font-size: 13px;
  color: #888;
  text-align: center;
`;

const SearchHeader = styled.div`
  position: sticky;
  top: calc(env(safe-area-inset-top, 0px) + ${0}px);
  background-color: #fff;
  z-index: 10;
  padding: 16px 0 8px;

    /* 애니메이션 */
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? "12px" : "0")}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  will-change: transform, opacity;
  transition: opacity .18s, transform .18s;
  transition-timing-function: cubic-bezier(.22,.61,.36,1);

`;





const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 999px; /* ✅ 둥글게 */
  background: #fff;
  height: 48px;
  padding-left: 12px;
  padding-right: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const SearchIconArea = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

const IconDiv = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 18px;
  color: #555;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0 8px;
  background: transparent; /* ✅ 배경 제거 */
`;

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 6px;
`;





const MobileResultcontainer = ({ containerStyle, TYPE }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const latitude = user.USERINFO.latitude;
  const longitude = user.USERINFO.longitude;

  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let last = el.scrollTop;
    let showTimer = null;

    const onScroll = () => {
      const st = el.scrollTop;

      // 아래로 빠르게 내리면 숨김, 위로 올리면 보이게
      if (st > last && st - last > 4) setHidden(true);
      else if (st < last) setHidden(false);

      last = st;

      // 스크롤 멈추면 잠시 후 다시 보이게
      clearTimeout(showTimer);
      showTimer = setTimeout(() => setHidden(false), 150);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(showTimer);
    };
  }, []);


  useEffect(() => {
    async function FetchData() {

      setIsLoading(true);


      await new Promise(res => setTimeout(res, 300));

      let result = [];
      if (TYPE === "general") {

        const fullAddress = user.USERINFO.address_name || "";
        const baseCity = extractCityName(fullAddress);  // ex: '서울시', '남양주시'
        
        result = await getGeneralJobs({ addressName: baseCity });

        console.log("result", result);
      } else if (TYPE === "senior") {
        result = await getJobList({ latitude, longitude });
      } else if (TYPE === "worker") {
        result = await getNearbyWorkers({ latitude, longitude });
      }
      setJobs(result);
      setIsLoading(false);
    }
    FetchData();
  }, [TYPE]);

  const filteredJobs = jobs.filter((item) => {
    const keywordLower = keyword.toLowerCase();

    if (TYPE === "senior") {
      const acptMethod = {
        CM0801: "온라인",
        CM0802: "이메일",
        CM0803: "팩스",
        CM0804: "방문",
      }[item?.acptMthdCd] ?? "";

      const fields = [
        item?.wantedTitle,
        item?.plbizNm,
        item?.plDetAddr,
        item?.etcItm,
        acptMethod,
      ];

      const text = fields.filter(Boolean).join(" ").toLowerCase();

      if (keyword) {
        console.log("🔍 검색 text:", text);
        console.log("🔍 keyword:", keywordLower);
      }

      return text.includes(keywordLower);
    } else if (TYPE === "general") {
      const fields = [
        item?.PBANC_CONT,
        item?.ENTRPRS_NM,
        item?.WORK_REGION_CONT,
        item?.RECRUT_FIELD_NM,
        item?.PBANC_FORM_DIV,
        item?.ACDMCR_DIV,
        item?.CAREER_DIV,
      ];

      const text = fields.filter(Boolean).join(" ").toLowerCase();
      return text.includes(keywordLower);
    }
    
    // 기본 로직 (일반 일자리, 구직자 등)
    const fields = [
      item?.wantedTitle,
      item?.plbizNm,
      item?.oranNm,
      item?.nickname,
      item?.intro,
    ];

    const text = fields.filter(Boolean).join(" ").toLowerCase();
    return text.includes(keywordLower);
  });
  
  

  return (
    <Container ref={scrollRef} style={containerStyle}>

      <SearchHeader $hidden={hidden}>
        <SearchField>
          {/* 🔎 왼쪽 아이콘 */}
          <SearchIconArea>
            <IconDiv aria-label="검색">
              <CiSearch size={24} />
            </IconDiv>
          </SearchIconArea>

          {/* 검색 인풋 */}
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }} // 엔터 시 키보드 내림
          />


        </SearchField>
      </SearchHeader>


      {isLoading ? (
        <div style={{ padding: "30px 0" }}>
        <Spinner
              size={32}
              dotSize={4}         // 점 크기 작게
              color="rgba(0,0,0,.6)" // 연한 블랙톤
              dotCount={12}       // 점 더 많게 (부드러움 ↑)
              duration={1.2}      // 조금 느리게 회전
            />
        </div>
      ) : (
        <>
          <Column gap={16}>
            {filteredJobs.map((item, i) => {
              if (TYPE === "general") return <GeneralJobCard key={i} job={item} jobId={item.id} />;
              if (TYPE === "senior") return <SeniorJobCard key={i} job={item} jobId={item.id} />;
              if (TYPE === "worker") return <MobileWorkerCard key={i}
                data={{
                  ...item,
                  type: "personal",
                }} />;
              return null;
            })}
          </Column>

          {/* 📊 현황 안내 */}
          <FooterSummary>
            총 {jobs.length}건 중 {filteredJobs.length}건 표시 중
          </FooterSummary>

        </>)}

    </Container>
  );
};

export default MobileResultcontainer;
