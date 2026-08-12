// PCGatecontainer Keyfin 스타일 전체 리팩토링
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { imageDB } from "../../utility/imageData";
import StoreInfo from "../../components/StoreInfo";
import { getFontSize } from "../../utility/fontsize";
import { useInView } from "react-intersection-observer";
import { db } from "../../api/config";
import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAllJobList } from "../../service/jobService";
import SeniorJobSwiperSection from "../../components/SeniorJobSwiperSection";
import { Column } from "../../common/Column";
import SeniorJobSwiperSectionPC from "../../components/SeniorJobSwiperSectionPC";


const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  min-height: 100vh;
`;


const Section = styled.section`
  width: 100%;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.bg || "#fff"};
`;
const ColumnBox = styled.div`
  text-align: center;
`;

const ProductName = styled.div`
  font-size: 45px !important;
  color: #ff7e19;
  font-family: 'Pretendard-Bold';
  margin-bottom: 12px;
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;



const ImageBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  max-height: 350px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    max-height: 350px;
    object-fit: contain; // or 'cover' if 더 꽉 차게
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  }
`;

const MobilePreviewBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top:70px;

  img {
    width: 100%;
    max-width: 350px;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  @media (max-width: 768px) {
    img {
      max-width: 280px;
    }
  }
`;


const StyledImg = styled.img`
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
`;



const MobilePreviewBox2 = styled.div`
  width: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;


  img {
    width: auto;
    height: 100%;
    max-height: 200px;
    border-radius: 12px;
    object-fit: contain;
  }
`;


const CenteredCardImage = styled.img`
  width: auto;
  height: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 12px;
`;

const TripleCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 400px;
  margin: 40px auto;
  margin-top:50px;

  @media (max-width: 768px) {
    height: 320px;
  }
`;

const TripleCard = styled.div`
  position: absolute;
  width: ${props => props.large ? '320px' : '260px'};
  height: ${props => props.large ? '260px' : '200px'};
  top: ${props => props.large ? '50%' : '55%'};
  left: ${props =>
    props.center ? '50%' :
      props.left ? 'calc(50% - 180px)' :
        'calc(50% + 180px)'};
  transform: ${props =>
    props.center ? 'translate(-50%, -50%)' :
      props.left ? 'translate(-100%, -40%)' :
        'translate(0%, -40%)'};

  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: ${props => props.z};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredCardImage2 = styled.img`
  width: 100%;
  max-width: 240px;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 34px;
  margin-top: 44px;

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  }
`;




const HeroSectionWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 700px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 480px;
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 1;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: #fff;
  z-index: 2;
  text-align: left;
  max-width: 600px;

  h1 {
    font-size: 48px;
    font-family: 'Pretendard-Bold';
    margin-bottom: 12px;
  }

  p {
    font-size: 18px;
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    h1 { font-size: 28px; }
    p { font-size: 14px; }
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  background-color: #ff7e19;
  color: #fff;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  margin-right: 12px;

  &:hover {
    background-color: #e76c00;
  }
`;

const HeroMain = styled.div`
    font-size: ${() => getFontSize(50)}px !important;
    font-family : Pretendard-Bold;

`

const HeroSubMain = styled.div`
    font-size: ${() => getFontSize(22)}px !important;
    font-family : Pretendard-SemiBold;
    margin-top:10px;

`
const AppButtonsWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AppButton = styled.a`
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 40px;
  color: white;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  background-color: transparent;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }

  img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
`;


const HeroSection = () => {
  const images = [
    imageDB.hero1,
    imageDB.hero2,
    imageDB.hero3,
    imageDB.hero4,
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const _handleAndroidEvent = async () => {
    await addDoc(collection(db, "WEB_VISITS"), {
      event: "install_android_click",

      timestamp: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
      userAgent: navigator.userAgent,
      cookies: document.cookie || "none",
    });
  }

  const _handleIphoneEvent = async () => {
    await addDoc(collection(db, "WEB_VISITS"), {
      event: "install_iphone_click",

      timestamp: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
      userAgent: navigator.userAgent,
      cookies: document.cookie || "none",
    });
  }


  return (
    <HeroSectionWrapper>
      {images.map((src, i) => (
        <BackgroundImage key={i} src={src} active={i === index} />
      ))}
      <Overlay />
      <HeroContent>
        <HeroMain>가장 쉬운 동네 알바<br/> 연결 서비스</HeroMain>
        <HeroSubMain>AI가 분석하고 연결까지 도와드립니다</HeroSubMain>

        
        <AppButtonsWrapper>
          <AppButton href="https://play.google.com/store/apps/details?id=com.hongapp"
            onClick={_handleAndroidEvent}
            target="_blank">
            <img src={imageDB.android} alt="Google Play" />
            Google Play
          </AppButton>
          <AppButton href="https://apps.apple.com/kr/app/id6743770592"
            onClick={_handleIphoneEvent}
            target="_blank">
            <img src={imageDB.iphone} alt="App Store" />
            App Store
          </AppButton>
        </AppButtonsWrapper>

      </HeroContent>
    </HeroSectionWrapper>
  );
};





// 섹션 래퍼
const InfoSection = styled.section`
  background-color: #f9f9f9;
  padding: 100px 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

// 내부 컨텐츠 정렬
const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  max-width: 1200px;
  margin: 100px auto 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 40px; // 👉 오른쪽 여백
`;


const SubText = styled.div`
    font-size: ${() => getFontSize(25)}px !important;
    font-family : Pretendard-SemiBold;
    margin-top:10px;
    color :#666;
`;


const SubWhiteText = styled.div`
    font-size: ${() => getFontSize(22)}px !important;
    font-family : Pretendard-SemiBold;
    margin-top:30px;
    color :#fff;
`;

const MainTitle = styled.div`
    font-size: ${() => getFontSize(40)}px !important;
    font-family : Pretendard-SemiBold;
    margin-top:10px;
    color :#333;
`;


const MainWhiteTitle = styled.div`
    font-size: ${() => getFontSize(40)}px !important;
    font-family : Pretendard-SemiBold;
    margin-top:10px;
    color :#fff;
`;

const fadeInRight = keyframes`
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Bullet = styled.div`
  font-size: ${() => getFontSize(22)}px !important;
  color: #ff7e19;
  background-color: #fff;
  border: 2px solid #FF7E19; // ✅ 강조 컬러
  border-radius: 28px;
  padding: 14px 16px;
  margin-bottom: 20px;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  opacity: 1;
  transform: translateX(30px);
  transition: all 0.8s ease;
  text-align : center;

  &.visible {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInKeyframes = keyframes`
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AdvertiseText = styled.div`
    font-size: ${() => getFontSize(8)}px !important;
    color :#273050;
    background-color :#273050;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 60px 16px 0;
  max-width: 900px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: #ededed;

  border-radius: 16px;
  padding: 20px;
  height:50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: ${() => getFontSize(16)}px;
  color: #333;
  font-family: Pretendard-SemiBold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    transform: translateY(-2px);
    transition: all 0.2s ease;
  }
`;


const RequestInfoSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3, // 30% 보이면 시작
    triggerOnce: true, // 한 번만
  });

  const [seniorJobs, setSeniorJobs] = useState([]);
  
    // useEffect(() => {
    //   const fetch = async () => {

    //     const senior = await getAllJobList(); // 노인일자리
    //     setSeniorJobs(senior);
        
    //   };
    //   fetch();
    // }, []);
  

  return (
    <InfoSection ref={ref}>
      <ContentWrapper>
        <TextBox>
          <SubText>
            우리 서비스는 당신이 요청을 남기는 순간부터 시작됩니다.
          </SubText>
          <MainTitle>단 10초만에 요청 등록이 완료됩니다</MainTitle>
        </TextBox>
        <Column>
          <FeatureGrid>
            <FeatureCard>AI 이미지 자동 생성으로<br />프로필 완성도 향상</FeatureCard>
            <FeatureCard>지원서를 분석해<br />적합한 일감을 자동 추천</FeatureCard>
            <FeatureCard>내 위치에서 가까운 일꾼<br />실시간 매칭</FeatureCard>
            <FeatureCard>영상/사진 기반<br />스마트 매칭 알고리즘</FeatureCard>
          </FeatureGrid>


        </Column>
   

      </ContentWrapper>
      <SeniorJobSwiperSectionPC width={1600} jobs={seniorJobs} />
    </InfoSection>
  );
};


const FadeInImage = styled.img`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? "translateY(0px)" : "translateY(30px)")};
  transition: opacity 1.2s ease, transform 1.2s ease;
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

// ⭐ IntersectionObserver로 스크롤 감지
const useOnScreen = (ref, threshold = 0.2) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return visible;
};
const ImageWithFadeIn = ({ src, alt }) => {
  const ref = useRef();
  const isVisible = useOnScreen(ref);

  return <FadeInImage ref={ref} src={src} alt={alt} visible={isVisible} />;
};

const CommunitySection = styled.section`
  background-color: #273050;
  padding: 100px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 60px 20px;
  }
`;

const CommunityText = styled.div`

  margin-top:50px;
  flex: 1;
  color: #fff;



  @media (max-width: 768px) {
    h2 {
      font-size: 28px;
    }
    p {
      font-size: 16px;
    }
  }
`;

const CommunityImage = styled.div`
  flex: 1;
  display: flex;f
  justify-content: center;

  img {
    width: 300px
    max-width: 300px;
    border-radius: 20px;
    transition: all 0.6s ease;
    opacity: 0;
    transform: translateX(50px);
  }

  &.active2 img {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PCCommunitySection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.4 });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <CommunitySection ref={ref}>
      <CommunityText>
        <MainWhiteTitle>알바 구해줘 하나로<br />동네 생활이 더 편해졌어요</MainWhiteTitle>
        <SubWhiteText>
          냉장고 관리부터 운세, 여행 정보까지<br />
          앱 하나로 우리 동네가 더 가까워집니다.
        </SubWhiteText>
      </CommunityText>

      <CommunityImage className={visible ? "active2" : ""}>
        <img src={imageDB.section4} alt=" 화면" />
      </CommunityImage>
    </CommunitySection>
  );
};
const ContentSection = () => {
  return (
    <Section>
      <ContentWrapper>
        <TextBox>
          <SubText style={{ color: '#1a8f5c', fontWeight: 600, marginBottom: '10px' }}>01. AI 기반 분석</SubText>
          <MainTitle style={{ marginBottom: '12px' }}>어떤 지원자가 가장 적합할까?</MainTitle>
          <SubText>
            다양한 요소를 바탕으로 AI가 실시간 분석하여 <br />
            매칭 우선순위를 자동으로 정리해드립니다.
          </SubText>


          <ImageGrid>
            <ImageWithFadeIn src={imageDB.sectio3_LEFT1} alt="AI 후보 1" />
            <ImageWithFadeIn src={imageDB.sectio3_LEFT2} alt="AI 후보 2" />
            <ImageWithFadeIn src={imageDB.sectio3_LEFT3} alt="AI 후보 3" />
            <ImageWithFadeIn src={imageDB.sectio3_LEFT4} alt="AI 후보 4" />
          </ImageGrid>

        </TextBox>
        <MobilePreviewBox>
          <ImageWithFadeIn src={imageDB.section3_1} alt="AI 기반 분석 예시" />
        </MobilePreviewBox>
      </ContentWrapper>

      <ContentWrapper reverse>
        <TextBox>
          <SubText style={{ color: '#1a8f5c', fontWeight: 600, marginBottom: '10px' }}>02. 위치 기반 추천</SubText>
          <MainTitle style={{ marginBottom: '12px' }}>가장 가까운 일꾼을 바로 찾습니다</MainTitle>
          <SubText>
            내 위치를 기준으로 반경 내 인력만 선별 매칭합니다. <br />
            실제 동선과 거리까지 고려한 스마트 연결.
          </SubText>
        </TextBox>
        <MobilePreviewBox>
          <ImageWithFadeIn src={imageDB.section3_2} alt="위치기반 지도 표시" />
        </MobilePreviewBox>
      </ContentWrapper>


      <ContentWrapper>

        <MobilePreviewBox>
          <ImageWithFadeIn src={imageDB.section3_3} alt="자기소개 영상" />
        </MobilePreviewBox>

        <TextBox>
          <SubText style={{ color: '#1a8f5c', fontWeight: 600, marginBottom: '10px' }}>03. 자기소개 기반 추천</SubText>
          <MainTitle style={{ marginBottom: '12px' }}>말투, 성향까지 반영한 AI 매칭</MainTitle>
          <SubText>
            자기소개 텍스트/영상 내용을 기반으로 <br />
            성향까지 분석해 최적화된 매칭이 가능합니다.
          </SubText>
        </TextBox>
      </ContentWrapper>


      <ContentWrapper reverse style={{marginTop:200}}>
        <TextBox>
          <SubText style={{ color: '#1a8f5c', fontWeight: 600, marginBottom: '10px' }}>04. 실시간 영상 채팅</SubText>
          <MainTitle style={{ marginBottom: '12px' }}>영상 채팅으로 더 빠르고 확실하게 연결됩니다</MainTitle>
          <SubText>
            채팅만으로는 부족했던 연결, <br />
            이제는 실시간 영상으로 상대방을 직접 확인하고 대화해보세요.<br />
            진짜 사람인지, 신뢰할 수 있는지 한 눈에 판단할 수 있습니다.
          </SubText>
        </TextBox>
        <MobilePreviewBox>
          <ImageWithFadeIn src={imageDB.IntroCarousel6} alt="영상채팅" />
        </MobilePreviewBox>
      </ContentWrapper>


    </Section>
  )
}

const PCGatecontainer = () => {

  useEffect(() => {
    const logVisit = async () => {
      try {
        await addDoc(collection(db, "WEB_VISITS"), {
          timestamp: serverTimestamp(),             // 서버 기준 접속 시간
          userAgent: navigator.userAgent,           // 브라우저 정보
          language: navigator.language,             // 언어 (예: "ko-KR")
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // 타임존
          cookies: document.cookie || "none",       // 쿠키 정보 (작으면 문자열로)
          event: "view",
        });
      } catch (err) {
        console.error("접속 로그 실패:", err);
      }
    };

    logVisit();
  }, []);




  return (
    <Container>
      <HeroSection />
      <RequestInfoSection />
      <ContentSection />
      <PCCommunitySection />
      <AdvertiseText>
        알바 구해줘 · 알바 구하기 · 알바 구합니다 · 알바 찾기 · AI 알바 매칭 · 영상 알바 지원 · 구인구직 · 동네 알바 · 일자리 구해줘
      </AdvertiseText>
      <StoreInfo padding={12} /> 
      
    </Container>
  );
};

export default PCGatecontainer;
