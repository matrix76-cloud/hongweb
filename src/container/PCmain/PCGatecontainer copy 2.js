// PCGatecontainer Keyfin 스타일 전체 리팩토링
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { imageDB } from "../../utility/imageData";
import StoreInfo from "../../components/StoreInfo";
import { getFontSize } from "../../utility/fontsize";

const TopBanner = styled.div`
  width: 100%;
  background-color: #fdf2e8;
  padding: 14px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard-Bold';
    font-size: ${() => getFontSize(18)}px !important;
  color: #111;
  border-bottom: 1px solid #f0e0d8;
  z-index: 10;
  position: sticky;
  top: 100;
  height:30px;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #fff;
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

const MainTitle = styled.div`
  font-size: 40px !important;
  font-family: 'Pretendard-Bold';
  color: #111;
  margin-bottom: 16px;
`;

const SubText = styled.p`
  font-size: 16px !important;
  color: #555;
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const CTAButton = styled.a`
  padding: 14px 32px;
  background-color: #ff7e19;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease;
  font-size: 16px !important;
  &:hover {
    background-color: #e66700;
  }
  margin-top:30px;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: ${props => props.reverse ? "row-reverse" : "row"};
  gap: 60px;
  margin : 20px 0px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const TextBox = styled.div`
  flex: 1;
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
  gap: 12px;
  margin-top: 24px;

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  }
`;
const HeroSectionLayer = styled.section`
  width: 100%;
  height: 700px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 450px;
  }
`;


const HeroImageWrapper = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const HeroImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: opacity 1.2s ease-in-out;
`;


const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const HeroContent = styled.div`
  z-index: 2;
  color: #fff;
  padding: 0 20px;
  text-align: left;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;

  h1 {
    font-size: 44px;
    font-family: 'Pretendard-Bold';
    margin-bottom: 18px;
  }

  p {
    font-size: 18px;
    margin-bottom: 24px;
    font-family: 'Pretendard-Regular';
  }

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 14px;
    }
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
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <HeroSectionLayer>
      <HeroImageWrapper>
        {images.map((src, i) => (
          <HeroImage
            key={i}
            src={src}
            alt={`슬라이드 ${i}`}
            active={i === index}
          />
        ))}
      </HeroImageWrapper>
      <Overlay />
      <HeroContent>
        <h1>가장 쉬운 동네 알바 연결 서비스</h1>
        <p>AI가 분석하고 연결까지 도와드립니다</p>
        <ButtonGroup>
          <CTAButton href="https://play.google.com/store/apps/details?id=com.hongapp">
            안드로이드 다운로드
          </CTAButton>
          <CTAButton href="https://apps.apple.com/kr/app/id6743770592">
            아이폰 다운로드
          </CTAButton>
        </ButtonGroup>
      </HeroContent>
    </HeroSectionLayer>
  );
};




const PCGatecontainer = () => {
  return (
    <Container>
      <TopBanner>
        혹시 지금 내 위치에서 바로 가능한 알바가 있는지 확인해보셨나요?
      </TopBanner>

      {/* Hero Section */}
      <HeroSection />


      {/* <Section bg="#f9f9f9">
        <ContentWrapper>
          <TextBox>
            <SubText>
              우리 서비스는 당신이 요청을 남기는 순간부터 시작됩니다.
            </SubText>
            <MainTitle>
              단 10초만에 요청 등록이 완료됩니다
            </MainTitle>
          </TextBox>
          <TextBox>
            <div style={{ marginBottom: "16px", fontSize: "16px", color: "#333" }}>✔️ AI 이미지 자동 생성으로 프로필 완성도 향상</div>
            <div style={{ marginBottom: "16px", fontSize: "16px", color: "#333" }}>✔️ 지원서를 분석해 적합한 일감을 자동 추천</div>
            <div style={{ marginBottom: "16px", fontSize: "16px", color: "#333" }}>✔️ 내 위치에서 가장 가까운 일꾼 실시간 매칭</div>
            <div style={{ fontSize: "16px", color: "#333" }}>✔️ 영상/사진/소개 기반 스마트 매칭 알고리즘</div>
          </TextBox>
        </ContentWrapper>
      </Section>


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
              <img src={imageDB.sectio3_LEFT1} alt="AI 후보 1" />
              <img src={imageDB.sectio3_LEFT2} alt="AI 후보 2" />
              <img src={imageDB.sectio3_LEFT3} alt="AI 후보 3" />
              <img src={imageDB.sectio3_LEFT4} alt="AI 후보 3" />
            </ImageGrid>

          </TextBox>
          <MobilePreviewBox>
            <img src={imageDB.section3_1} alt="AI 기반 분석 예시" />
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
            <img src={imageDB.section3_2} alt="위치기반 지도 표시" />
          </MobilePreviewBox>
        </ContentWrapper>

        <ContentWrapper>
          <TextBox>
            <SubText style={{ color: '#1a8f5c', fontWeight: 600, marginBottom: '10px' }}>03. 자기소개 기반 추천</SubText>
            <MainTitle style={{ marginBottom: '12px' }}>말투, 성향까지 반영한 AI 매칭</MainTitle>
            <SubText>
              자기소개 텍스트/영상 내용을 기반으로 <br />
              성향까지 분석해 최적화된 매칭이 가능합니다.
            </SubText>
          </TextBox>
          <MobilePreviewBox>
            <img src={imageDB.section3_3} alt="자기소개 영상" />
          </MobilePreviewBox>
        </ContentWrapper>

        <ContentWrapper reverse>
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
            <img src={imageDB.IntroCarousel6} alt="영상채팅" />
          </MobilePreviewBox>
        </ContentWrapper>

      </Section>

   
      <Section bg="#f9f9f9">
        <ContentWrapper reverse>
          <TextBox>
            <MainTitle>알바 지원서 작성은 이제 AI로</MainTitle>
            <SubText>
              자소서 쓰기 어렵고 막막하셨나요?
              AI가 성향과 경험을 분석해 자연스럽게 작성해드려요.<br />
              이제는 버튼 한 번으로 지원 완료! <br />
            </SubText>
          </TextBox>
       
            <video
              src={imageDB.introduce8}
              controls
              playsInline
              muted={false}
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "12px",
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.05)",
              }}/>
        
        </ContentWrapper>
      </Section> */}

      {/* Section 5: 마무리 CTA */}
      {/* <Section>
        <ColumnBox>
          <MainTitle>어디에도 없던 가장 쉬운 연결 시스템</MainTitle>
          <SubText>
            AI 기반 데이터로 신뢰도 높은 일꾼을 매칭하고 <br />
            영상과 이미지로 확인하며 선택할 수 있습니다.
          </SubText>
        </ColumnBox>
        <TripleCardWrapper>
          <TripleCard center large z={3}>
      
          </TripleCard>
          <TripleCard left z={2}>
      
          </TripleCard>
          <TripleCard right z={1}>

          </TripleCard>
        </TripleCardWrapper>
      </Section> */}

      {/* <p style={{ fontSize: '12px', color: '#999', marginTop: '60px' }}>
        알바 구해줘 · 알바 구하기 · 알바 구합니다 · 알바 찾기 · AI 알바 매칭 · 영상 알바 지원 · 구인구직 · 동네 알바
      </p>
      <StoreInfo padding={12} /> */}
      
    </Container>
  );
};

export default PCGatecontainer;
