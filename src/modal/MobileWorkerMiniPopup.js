// MobileWorkerMiniPopup.jsx
import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getFontSize } from '../utility/fontsize';

import { WORKNAME } from '../utility/work';
import { imageDB } from '../utility/imageData';
import HongButton from '../components/HongButton';
import { Row } from '../common/Row';
import { checkExistingRoom, createVirtualWork, ReadWorkByIndividually } from '../service/WorkService';
import { Readuserbyusersid } from '../service/UserService';
import { CreateChat, NewCreateMessage } from '../service/ChatService';
import { CreateContact } from '../service/ContactService';
import { CHATCONTENTTYPE, CONTACTTYPE, PCMAINMENU } from '../utility/screen';
import { UserContext } from '../context/User';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
`;
const TagGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 14px;
  margin-top: 10px;
`;

const TagIconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
`;

const TagIcon = styled.img`
  width: 40px;
  height: 40px;
  background: #ffeeee;
  border-radius: 50%;
  padding: 8px;
`;

const TagLabel = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #222;
  margin-top: 6px;
  text-align: center;
`;



const PopupContainer = styled.div`
  position: fixed;
  bottom: 50px;
  width: 100%;
  background: #fff;
  box-shadow: 0 -6px 20px rgba(0,0,0,0.06);
  padding: 20px 16px 24px;
  padding-right: 20px; /* ✅ 오른쪽 패딩 추가 */

  z-index: 10;

  animation: ${slideUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; // 더 부드럽고 강하게
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  border: 2px solid #ddd;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(17)}px !important;
  font-family: Pretendard-Bold;
`;

const CloseIcon = styled.div`
  font-size: ${() => getFontSize(28)}px !important;
  color: #888;
  cursor: pointer;
`;

const Info = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
  line-height: 1.6;
  margin-top: 8px;
  margin-bottom: 14px;
  width:95%;
`;

const LabelRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
`;

const GenderBadge = styled.div`
  background: ${({ gender }) => gender === 'female' ? '#FF6B6B' : '#2D6FF7'};
  color: #fff;
  font-size: ${() => getFontSize(12)}px !important;
  padding: 4px 8px;
  border-radius: 12px;
`;

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

const TagBadge = styled.div`
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: ${() => getFontSize(13)}px;
  color: #333;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-right: 4px;
  width: 90%;
  margin-bottom: 10px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  flex-wrap: wrap; // 혹시 화면 작을 때 줄바꿈
`;


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

  &:hover {
    background-color: #e5e7eb;
  }
`;



const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move },
  { name: WORKNAME.STORECLEAN, img: imageDB.storeclean },
  { name: WORKNAME.ERRAND, img: imageDB.help },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping },
  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent },
  { name: WORKNAME.LESSON, img: imageDB.lesson },
  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital },
  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog },
  { name: WORKNAME.CARRYLOAD, img: imageDB.carry },
  { name: WORKNAME.AIRCON, img: imageDB.aircon },
  { name: WORKNAME.CURTAIN, img: imageDB.curtain },
  { name: WORKNAME.ASSEMBLE, img: imageDB.assemble },
  { name: WORKNAME.STORAGE, img: imageDB.assemble },
];

function getKoreanGender(gender) {
  if (!gender) return '미지정';
  const lower = gender.toLowerCase();
  if (lower === 'male') return '남성';
  if (lower === 'female') return '여성';
  return '기타';
}


export default function MobileWorkerMiniPopup({ data, onClose, onChat, onDetail }) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!data) return null;


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
    <PopupContainer>
      <Header>
        <ProfileSection>
          <ProfileImage src={data.profileImg || imageDB.defaultProfile} alt="프로필" />
          {/* <div>
            <Title>{data.chatName || '아르바이트 지원자'}</Title>
            <LabelRow>
              <GenderBadge gender={data.gender}>{getKoreanGender(data.gender)} / {data.age || '30대'}</GenderBadge>
            </LabelRow>
          </div> */}

          <NameRow>
            <Title>{data.chatName || '아르바이트 지원자'}</Title>
            <GenderBadge gender={data.gender}>{getKoreanGender(data.gender)} / {data.age || '30대'}</GenderBadge>
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
          </NameRow>

        </ProfileSection>
        <CloseIcon onClick={onClose}>×</CloseIcon>
      </Header>

      

      <Info>{data.selfIntro?.slice(0, 100)}{data.selfIntro?.length > 100 ? '...' : ''}</Info>



      <TagGrid>
        {(data.tags || []).map(tag => {
          const matched = WorkItems.find(w => w.name === tag);
          return (
            <TagIconCard key={tag}>
              <TagIcon src={matched?.img || imageDB.defaultProfile} alt={tag} />
              <TagLabel>{tag}</TagLabel>
            </TagIconCard>
          );
        })}
      </TagGrid>

      <ButtonWrapper>
        <HongButton style={{ height: 42, width: '48%' }} onClick={handleChat}
          disabled={isSubmitting}
        >
          {isSubmitting ? "요청 중..." : "바로지원요청"}
        </HongButton>
        <HongButton style={{ height: 42, width: '48%' }} onClick={() => onDetail?.(data)}>
          프로필보기
        </HongButton>
      </ButtonWrapper>
      <Toaster position="bottom-right" richColors />
    </PopupContainer>
  );
}
