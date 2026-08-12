// 📄 src/components/config/etc/MobileDevContact.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { getFontSize } from "../../../utility/fontsize";
import { useNavigate } from "react-router-dom";

import { CONFIGMOVE } from "../../../utility/screen";
import { getPublishedDevProjects } from "../../../service/DevProjectService";

const DEV = {
    title: "개발자 연락하기",
    subtitle: "이 앱을 만든 개발자가 모든걸 만들어 드릴수 있어요",
    phone: "010-6214-9756",
};

export default function MobileDevContact() {
    const navigate = useNavigate();
  

    const phoneDigits = String(DEV.phone || "").replace(/[^0-9]/g, "");
    const telUrl = phoneDigits ? `tel:${phoneDigits}` : "";

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const callNow = () => {
        if (!telUrl) return;
        window.location.href = telUrl;
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const list = await getPublishedDevProjects();
                console.log("Dev projects:", list);

                if (!mounted) return;
                setProjects(list || []);
            } catch (e) {
                console.error("Dev projects fetch error:", e);
                if (!mounted) return;
                setProjects([]);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);


    const onProjectClick = (p) => {
        const projectId = p?.projectId || p?.id;
        if (!projectId) return;

        console.log("Navigate to project detail:", projectId);


        navigate("/Mobileconfigcontent?projectId=" + encodeURIComponent(projectId), {
            state: { NAME: CONFIGMOVE.DEV_PROJECT_DETAIL, TYPE: projectId },
        });

    };

    return (
        <Wrap>
            <Hero>
                <Title>{DEV.title}</Title>
                <Sub>{DEV.subtitle}</Sub>

                {/* <PrimaryBtn onClick={callNow} role="button" aria-label="개발자에게 직접 전화하기">
                    <span className="txt">개발자에게 직접 전화하기</span>
                </PrimaryBtn> */}

                <InfoRow>
                    <PhoneBox role="button" aria-label="전화번호">
                        <span className="label">전화번호</span>
                        <span className="value">{DEV.phone}</span>
                        {/* <span className="hint">통화 연결은 위 버튼</span> */}
                    </PhoneBox>
                </InfoRow>

                <Guide>* 연락이 안될 경우 문자로 “무슨 앱/기능/예산/일정”만 보내주셔도 됩니다.</Guide>
            </Hero>

            <Section>
                <SectionTitle>제가 만든 프로젝트</SectionTitle>

                {loading ? (
                    <SkeletonBox>불러오는 중…</SkeletonBox>
                ) : (
                    <List>
                        {projects.map((p) => {
                            const thumb = p?.imageUrls?.[0] || p?.thumbnailUrl || null;

                            return (
                                <ProjectCard
                                    key={p?.projectId || p?.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onProjectClick(p)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") onProjectClick(p);
                                    }}
                                >
                                    <Thumb>
                                        {thumb ? <ThumbImg src={thumb} alt={p.title} /> : <ThumbPlaceholder />}
                                    </Thumb>

                                    <Meta>
                                        <PTitle title={p.title}>{p.title}</PTitle>
                                        {!!p.desc && <PDesc>{p.desc}</PDesc>}

                                        {!!p.tags?.length && (
                                            <TagRow>
                                                {p.tags.slice(0, 3).map((t) => (
                                                    <TagPill key={`${p.projectId || p.id}-${t}`}>{t}</TagPill>
                                                ))}
                                            </TagRow>
                                        )}
                                    </Meta>

                                    <Chevron aria-hidden>›</Chevron>
                                </ProjectCard>
                            );
                        })}
                    </List>
                )}
            </Section>
        </Wrap>
    );
}

/* =========================
   styles
========================= */

const Wrap = styled.div`
  padding: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;   /* ✅ 핵심 */
`;

const Chevron = styled.div`
  flex: 0 0 auto;
  font-size: 22px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.35);
  margin-left: 2px;
  transition: color 160ms ease, transform 160ms ease;
`;


const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 180ms ease;
`;


const Hero = styled.div`
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(180deg, #eaf3ff 0%, #ffffff 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.06);
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.3px;
`;

const Sub = styled.div`
  margin-top: 6px;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.72);
  line-height: 1.45;
`;

const pulse = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.01); }
`;

const shimmer = keyframes`
  0%   { transform: translateX(-160%) rotate(12deg); opacity: 0; }
  10%  { opacity: .55; }
  35%  { opacity: .65; }
  60%  { opacity: .45; }
  100% { transform: translateX(160%) rotate(12deg); opacity: 0; }
`;

const cardFloat = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(-2px); }
`;

const chevronNudge = keyframes`
  0%,100% { transform: translateX(0); }
  50%     { transform: translateX(2px); }
`;

const PrimaryBtn = styled.div`
  position: relative;
  margin-top: 12px;
  height: 46px;
  border-radius: 14px;
  background: #4286de;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 900;
  cursor: pointer;
  user-select: none;

  box-shadow: 0 10px 20px rgba(2, 6, 23, 0.12);
  animation: ${pulse} 2.6s ease-in-out infinite;

  &:active {
    transform: scale(0.99);
    opacity: 0.96;
    animation: none;
  }

  &::after{
    content:"";
    position:absolute;
    top:-20%;
    left:-60%;
    width:60%;
    height:140%;
    pointer-events:none;
    border-radius: 999px;
    background: linear-gradient(
      115deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.75) 45%,
      rgba(255,255,255,0.15) 70%,
      rgba(255,255,255,0) 100%
    );
    transform: translateX(-160%) rotate(12deg);
    animation: ${shimmer} 3.2s ease-in-out infinite;
    mix-blend-mode: screen;
    opacity: .55;
  }

  @media (prefers-reduced-motion: reduce){
    animation: none;
    &::after{ animation: none; }
  }

  .txt{
    position: relative;
    z-index: 1;
  }
`;

const InfoRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

const PhoneBox = styled.div`
  flex: 1;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.05);
  padding: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;

  user-select: none;

  .label{
    font-size: ${() => getFontSize(11)}px !important;
    font-weight: 900;
    color: rgba(15, 23, 42, 0.65);
  }
  .value{
    font-size: ${() => getFontSize(15)}px !important;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: 0.2px;
  }
  .hint{
    font-size: ${() => getFontSize(11)}px !important;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.45);
  }
`;

const Guide = styled.div`
  margin-top: 12px;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.58);
  line-height: 1.45;
`;

const Section = styled.div`
  margin-top: 14px;
  margin-bottom: 60px;
`;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.2px;
`;

const SkeletonBox = styled.div`
  margin-top: 10px;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgba(15,23,42,0.08);
  color: rgba(15,23,42,0.6);
  font-weight: 800;
`;

const List = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const ProjectCard = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.05);
  padding: 14px;

  display: flex;
  gap: 14px;
  align-items: center;

  cursor: pointer;
  user-select: none;

  position: relative;
  transform: translateZ(0);

  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  /* ✨ 은은한 '눌러보세요' 하이라이트 (빛 스윕) */
  &::before{
    content:"";
    position:absolute;
    top:-40%;
    left:-70%;
    width:70%;
    height:180%;
    border-radius: 999px;
    background: linear-gradient(
      115deg,
      rgba(66,134,222,0) 0%,
      rgba(66,134,222,0.10) 45%,
      rgba(66,134,222,0.04) 70%,
      rgba(66,134,222,0) 100%
    );
    transform: translateX(-140%) rotate(12deg);
    opacity: 0;
    pointer-events:none;
    transition: opacity 180ms ease;
  }

  /* 데스크톱/웹뷰에서도 “클릭 카드” 느낌 */
  &:hover{
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(2, 6, 23, 0.10);
    border-color: rgba(66, 134, 222, 0.22);
    background: linear-gradient(180deg, rgba(234,243,255,0.55) 0%, #fff 60%);

    &::before{
      opacity: 1;
      animation: ${shimmer} 1.9s ease-in-out 1;
    }
  }

  /* 모바일 탭 피드백 */
  &:active{
    transform: scale(0.992);
    box-shadow: 0 6px 16px rgba(2, 6, 23, 0.08);
    opacity: .98;
  }

  /* 키보드 접근성까지 챙기기(탭 이동 시) */
  &:focus-visible{
    outline: 0;
    box-shadow:
      0 10px 24px rgba(2, 6, 23, 0.10),
      0 0 0 3px rgba(66, 134, 222, 0.28);
    border-color: rgba(66, 134, 222, 0.35);
  }

  /* 내부 요소 인터랙션 연동 */
  &:hover ${Chevron}{
    color: rgba(66,134,222,0.75);
    animation: ${chevronNudge} 700ms ease-in-out infinite;
  }

  &:hover ${ThumbImg}{
    transform: scale(1.04);
  }

  @media (prefers-reduced-motion: reduce){
    transition: none;
    &:hover{
      transform: none;
    }
    &::before{
      transition: none;
      animation: none;
    }
    &:hover ${Chevron}{
      animation: none;
    }
  }
`;


const Thumb = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 20px;
  overflow: hidden;
  flex: 0 0 auto;

  background: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.08);

  display: grid;
  place-items: center;
`;

const ThumbPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(66,134,222,0.22), rgba(15,23,42,0.06));
`;

const Meta = styled.div`
  flex: 1;
  min-width: 0;
`;

const PTitle = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PDesc = styled.div`
  margin-top: 6px;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.65);
  text-decoration: none;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  line-height: 1.45;
`;

const TagRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TagPill = styled.div`
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;

  background: #eaf3ff;
  border: 1px solid rgba(66, 134, 222, 0.28);
  color: #1d4ed8;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 900;
  white-space: nowrap;
`;


