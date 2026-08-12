// 🔧 최신 탭 + 구분선 연동 완전 적용 (UI 구조 반영)
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LottieAnimation from "../common/LottieAnimation";
import { imageDB } from "../utility/imageData";
import { toast, Toaster } from "sonner";
import HongButton from "./HongButton";
import { getFontSize } from "../utility/fontsize";
import { WORKNAME } from "../utility/work";
import { UserContext } from "../context/User";
import { distanceFunc } from "../utility/region";
import { Column } from "../common/Column";
import { checkExistingRoom, createVirtualWork, ReadWorkByIndividually } from "../service/WorkService";
import { Readuserbyusersid } from "../service/UserService";
import { CreateChat, NewCreateMessage } from "../service/ChatService";
import { CreateContact } from "../service/ContactService";
import { CHATCONTENTTYPE, CONTACTTYPE, PCMAINMENU } from "../utility/screen";
import { BetweenRow, FlexstartRow, Row } from "../common/Row";

const Container = styled.div`
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  z-index: 9999;
`;


const TopPhoto = styled.div`
  width: 100%;
  height: 340px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const CloseButton = styled.div`
  position: fixed;
  top: 36px;
  left: 16px;
  width: 36px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: ${() => getFontSize(25)}px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
`;

const TooltipWrapper = styled.div`
  position: absolute;
  bottom: 22px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

    &:hover > div {
    opacity: 1;
    transform: translateY(0px);
    pointer-events: auto;
  }
    
`;

const AIThumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  object-fit: cover;
  background-color: #fff;
  cursor: pointer;

  &:hover + div {
    opacity: 1;
    transform: translateY(0px);
    pointer-events: auto;
  }
`;

const Tooltip = styled.div`
  background-color: #222;
  color: #fff;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  margin-bottom: 6px;
  opacity: 0;
  transition: all 0.2s ease;
  transform: translateY(5px);
  pointer-events: none;
`;



const StickyTabBar = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1000;
  border-bottom: 1px solid #eee;
  padding-left: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
`;

const TabItem = styled.div`
  padding: 12px 16px;
  font-family: ${({ active }) => (active ? 'Pretendard-SemiBold' : 'Pretendard')};
  font-size: ${() => getFontSize(16)}px !important;
  color: ${({ active }) => (active ? '#1e64ff' : '#444')};
  position: relative;
  cursor: pointer;
  white-space: nowrap;
`;

const Underline = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #1e64ff;
  transition: transform 0.3s ease;
  transform: ${({ index }) => `translateX(${index * 100}%)`};
  width: 100px;
`;

const Content = styled.div`
  padding: 0 0px 50px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding : 0px 20px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(19)}px !important;
  color: #111;
  margin-bottom: 12px;
  font-family: 'Pretendard-Bold', sans-serif !important;
`;

const Text = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  line-height: 1.8;
  white-space: pre-line;
  color: #222;
`;

const InfoCard = styled.div`
  position: absolute;
  top: 260px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: left;
  z-index: 100;
`;



const OverlayTitle = styled.div`
  font-size: ${() => getFontSize(25)}px !important;
  font-weight: 900 !important;
  margin-bottom: 8px;
  color: #111;
  font-family: 'Pretendard-Bold', sans-serif !important;
`;

const OverlayText = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #444;
  margin-bottom: 12px;
`;

const PhoneRow = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  padding: 8px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FF6B6B, #ee5a24);
  color: #fff;
  font-size: ${() => getFontSize(15)}px !important;
  font-weight: 700;
  text-decoration: none;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(238, 90, 36, 0.25);
`;

const TagIconBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const TagIcon = styled.div`
  background: #f2f4f8;
  padding: 6px 10px;
  border-radius: 50px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  color: #333;
`;

const TagImage = styled.img`
  width: 45px;
  height: 45px;
`;

const Seperateor = styled.div`
  height: 3px;
  background: #f0f0f0;
  margin: 20px 0;
`
const TagName = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #333;

  margin-top: 4px;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PhotoGrid = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 16px;
  padding-bottom: 4px;
  grid-template-columns: repeat(2, 1fr);
`;

const FixedButtonWrapper = styled.div`

  width: calc(100% - 40px);
  margin : 0 auto;
  z-index: 10000;
  padding-bottom: 0px; // 별도 패딩 필요 없음 (bottom에 계산)
`;

const TopPhotoWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TopPhotoImg = styled.img`
  width: 100%;

  object-fit: cover;
`;

const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house, bgcolor: "#f9f9f9" },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business, bgcolor: "#f9f9f9" },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move, bgcolor: "#f9f9f9" },
  { name: WORKNAME.STORECLEAN, img: imageDB.storeclean, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ERRAND, img: imageDB.help, bgcolor: "#c6e2ff" },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook, bgcolor: "#c6e2ff" },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping, bgcolor: "#c6e2ff" },
  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool, bgcolor: "#f4f4f4" },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare, bgcolor: "#f4f4f4" },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent, bgcolor: "#f4f4f4" },
  { name: WORKNAME.LESSON, img: imageDB.lesson, bgcolor: "#f4f4f4" },
  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare, bgcolor: "#fff1c6" },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital, bgcolor: "#fff1c6" },
  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital, bgcolor: "#f9f9f9" },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CARRYLOAD, img: imageDB.carry, bgcolor: "#c6e2ff" },
  { name: WORKNAME.AIRCON, img: imageDB.aircon, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CURTAIN, img: imageDB.curtain, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ASSEMBLE, img: imageDB.assemble, bgcolor: "#f9f9f9" },
  { name: WORKNAME.STORAGE, img: imageDB.hongladywebtoon, bgcolor: "#f9f9f9" },
];


const ListenButton = styled.div`
  margin-top: 4px;
  padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  width: fit-content;
  align-self: flex-start;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left:5px;

  &:hover {
    background-color: #e5e7eb;
  }
`;




const MobileWorkerDetail = ({ containerStyle, data, onClose, onChat }) => {

  console.log("detail log", data);
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, user } = useContext(UserContext);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  
  const [activeTab, setActiveTab] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const tabList = [
    "자기소개",
    "가능시간",
    "가능한일",
    "위치",
    "보수정보",
    data.photos?.length > 0 && "지원자 참고사진",
    data.videoUrl && "자기소개 영상",
    data.career?.trim() !== "" && "활동이력",
  ].filter(Boolean); // falsy 항목 제거

  const sectionRefs = useRef([]);
  const underlineRef = useRef();
  const containerRef = useRef(null);


  let distanceKm = null;
  if (user?.USERINFO?.latitude && user?.USERINFO?.longitude && data?.latitude && data?.longitude) {
    const raw = distanceFunc(user?.USERINFO?.latitude, user?.USERINFO?.longitude, data.latitude, data.longitude);
    distanceKm = raw.toFixed(1);
  }
  
  
  const handleTabClick = (index) => {
    const section = sectionRefs.current[index];
    const container = containerRef.current;

    console.log("handleTabClick", index, section, container);

    if (section && container) {
      const sectionTop = section.offsetTop;
      container.scrollTo({ top: sectionTop - 100, behavior: 'smooth' });
      setActiveTab(index);
    }
  };



  useEffect(() => {
    if (!window.kakao?.maps) return;

    const container = document.getElementById("map");
    if (!container || !data.latitude || !data.longitude) return;

    const options = {
      center: new window.kakao.maps.LatLng(data.latitude, data.longitude),
      level: 4,
      draggable: false,      // ❌ 지도 이동 막기

    };

    const map = new window.kakao.maps.Map(container, options);
    map.setZoomable(true);          // ✅ 확대/축소는 허용 (모바일도 포함)

    new window.kakao.maps.Marker({
      map,
      position: options.center
    });
  }, [data.latitude, data.longitude]);

  useEffect(() => {
    if (data.photos && data.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % data.photos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data.photos]);



  const findWorkImage = (tag) => {
    const item = WorkItems.find((w) => w.name === tag);

    console.log("items", tag, WorkItems);

    return item?.img || imageDB.hongladywebtoon;
  };



  const handleChat = async () => {
    const OWNER = user;
    const SUPPORTER = data;
    if (!SUPPORTER || !OWNER || OWNER.USERS_ID === SUPPORTER.users_id) return;

    const CHAT_ID = await checkExistingRoom({ OWNER_ID: OWNER.USERS_ID, SUPPORTER_ID: SUPPORTER.users_id });
    if (CHAT_ID) return (window.location.href = `/chat/${CHAT_ID}`);

    const { id: WORK_ID, WORK_INFO } = await createVirtualWork({ OWNER });
    if (WORK_ID === -1) return alert("일감 생성 실패. 잠시 후 다시 시도해주세요.");
    await ChatRequestComplete(WORK_ID, SUPPORTER, WORK_INFO);
  };

  const ChatRequestComplete = async (WORK_ID, SUPPORTER, WORK_INFO) => {
    const WORK_DATA = await ReadWorkByIndividually({ WORK_ID });
    const OWNER = await Readuserbyusersid({ USERS_ID: WORK_DATA.USERS_ID });
    const SUPPORTER_INFO = await Readuserbyusersid({ USERS_ID: SUPPORTER.users_id });
    if (!SUPPORTER_INFO?.USERS_ID || !SUPPORTER_INFO.USERINFO) return alert("지원자 정보 없음");

    const CHAT_ID = await CreateChat({ OWNER, OWNER_ID: OWNER.USERS_ID, SUPPORTER: SUPPORTER_INFO, SUPPORTER_ID: SUPPORTER.users_id, INFO: { ...WORK_DATA, isVirtualWork: true }, TYPE: PCMAINMENU.HOMEMENU });

    await CreateContact({ OWNER_ID: OWNER.USERS_ID, SUPPORTER_ID: SUPPORTER.users_id, CONTACT_STATUS: CONTACTTYPE.INIT, CONTACT_INFO: WORK_INFO, ID: CHAT_ID, RIGHT_SIGN: '', WORKTYPE: PCMAINMENU.HOMEMENU });

    await NewCreateMessage({ CHAT_ID, msg: `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`, users_id: user.USERS_ID, read: [user.USERS_ID, SUPPORTER.users_id], CHAT_CONTENT_TYPE: CHATCONTENTTYPE.ENTER, AlarmTarget_ID: SUPPORTER.users_id });

    navigate("/Mobilechat");
  };

  return (
    <Container style={containerStyle} ref={containerRef}>


      <TopPhotoWrapper>
        <TopPhotoImg src={data.profileImg} />
        {data.AI_NEWIMAGE_COMPRESSED && 
          <TooltipWrapper>
            <Tooltip>AI 생성 이미지</Tooltip>
            <AIThumbnail src={data.AI_NEWIMAGE_COMPRESSED} />
          </TooltipWrapper>
        }
      </TopPhotoWrapper>
      
      <CloseButton onClick={onClose}>×</CloseButton>



      
      <StickyTabBar>
        {tabList.map((label, idx) => (
          <TabItem
            key={idx}
            active={activeTab === idx}
            onClick={() => handleTabClick(idx)}
          >
            {label}
          </TabItem>
        ))}
      </StickyTabBar>

      <Content>

        <Section ref={(el) => (sectionRefs.current[0] = el)}>

          <BetweenRow>
            <Title>자기소개</Title>

            {data.official && data.tts_audio_url && (
              <ListenButton
                onClick={(e) => {
                  e.stopPropagation();
                  const audio = new Audio(data.tts_audio_url);

                  // 🎧 로딩 표시
                  const toastId = toast.loading("🎧 음성 준비 중입니다...", {
                    duration: Infinity,
                    style: {
                      fontSize: '13px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: '#f4f4f5',
                      color: '#111',
                      boxShadow: 'none',
                    }
                  });

                  audio.onloadeddata = () => {
                    // 로딩 토스트 제거
                    toast.dismiss(toastId);

                    // 🎧 재생 중 표시
                    const playToastId = toast("🎧 음성을 재생 중입니다...", {
                      duration: Infinity, // ✅ 직접 닫기 전까지 유지
                      style: {
                        fontSize: '13px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#f4f4f5',
                        color: '#111',
                        boxShadow: 'none',
                      }
                    });

                    audio.play();

                    audio.onended = () => {
                      toast.dismiss(playToastId); // ✅ 재생 끝나면 닫기
                    };
                  };

                  audio.onerror = () => {
                    toast.dismiss(toastId);
                    toast.error("음성 재생에 실패했습니다 😢");
                  };
                  
                }}
              >
                🎧 AI 요약 듣기
              </ListenButton>
            )}
            

          </BetweenRow>


          <OverlayTitle>{data.chatName} 님</OverlayTitle>
          <OverlayText>
            {data.type === 'business'
              ? `사업자 / ${data.businessName}`
              : `${data.gender === 'male' ? '남성' : data.gender === 'female' ? '여성' : '-'} / ${data.age}`}
          </OverlayText>
          <OverlayText>  {data.address?.length > 30
            ? `${data.address.slice(0, 30)}...`
            : data.address}
            {' '} / 📍 내 위치로부터 약 {distanceKm}km
          </OverlayText>

          {data.phone?.trim() && (
            <PhoneRow href={`tel:${data.phone.trim()}`}>
              📞 {data.phone.trim()}
            </PhoneRow>
          )}

          <Text>{data.selfIntro}</Text>
        </Section>

        <Seperateor />

        <Section ref={(el) => (sectionRefs.current[1] = el)}>
          <Title>가능 시간</Title>
          <Text>{data.availableTime}</Text>
        </Section>

        <Seperateor />

        <Section ref={(el) => (sectionRefs.current[2] = el)}>
          <Title>가능한 일</Title>
          <TagIconBox>
            {data.tags.map((tag, index) => (
              <Column>
                <TagIcon key={index}>
                  <TagImage src={findWorkImage(tag)} alt={tag} />
                </TagIcon>
                <TagName>
                  {tag}
                </TagName>
              
              </Column>
         
            ))}
          </TagIconBox>
        </Section>

        <Seperateor />


        <Section ref={(el) => (sectionRefs.current[3] = el)}>
          <Title>위치</Title>
          <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f5f5f5', marginTop: '12px' }}>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
          </div>
        </Section>

        <Seperateor />

        <Section ref={(el) => (sectionRefs.current[4] = el)}>
          <Title>보수 정보</Title>
          <Text>{data.rewardInfo}</Text>
        </Section>
        <Seperateor />


        {(data.photos?.length > 0) && (
          <Section ref={(el) => (sectionRefs.current[5] = el)}>
            <Title>지원자 참고사진</Title>
            <PhotoGrid>
              {data.photos.slice(0, 5).map((url, idx) => {
                const isSingle = data.photos.length === 1;
                const isLastOdd = data.photos.length % 2 === 1 && idx === data.photos.length - 1;

                const spanStyle = (isSingle || isLastOdd)
                  ? { gridColumn: 'span 2' }
                  : {};

                return (
                  <div key={idx} style={{ position: 'relative', ...spanStyle }}>
                    <img
                      src={url}
                      alt={`작업사진${idx + 1}`}
                      style={{
                        width: '100%',
                        aspectRatio: (isSingle || isLastOdd) ? '2/1' : '1/1',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                );
              })}
            </PhotoGrid>
          </Section>
        )}
        {(data.photos?.length >0) && <Seperateor />}

        {
          data.videoUrl && <Section ref={(el) => (sectionRefs.current[6] = el)}>
            <Title>{"자기소개 영상"}</Title>
            <div style={{ marginBottom: 16 }}>
              <video
                src={data.videoUrl}
                controls
                playsInline
                muted
                style={{
                  width: "100%",
                  borderRadius: 12,
                  objectFit: "cover",
                  maxHeight: 480
                }}
              />
            </div>
          </Section>

        }
        {(data.videoUrl) && <Seperateor />}
        
        {
          data.career != '' && <Section ref={(el) => (sectionRefs.current[7] = el)}>
            <Title>활동 이력</Title>
            <Text>{data.career}</Text>
          </Section>
        }


      </Content>


      <FixedButtonWrapper>
        <HongButton
          style={{ marginTop: 5, color: '#FFF', border: 'none', marginBottom:20 }}
          variant="primary"
          fullWidth
          onClick={handleChat}
          disabled={isSubmitting}
        >
          {isSubmitting ? "요청 중..." : "바로지원요청"}
        </HongButton>
      </FixedButtonWrapper>
      

      <Toaster position="bottom-right" richColors />
    </Container>
  );
};

export default MobileWorkerDetail;
