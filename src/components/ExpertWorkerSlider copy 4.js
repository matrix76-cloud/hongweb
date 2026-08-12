// src/components/ExpertWorkerList.jsx
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import MobileWorkerPopup from '../modal/MobileWorkerPopup';
import { BetweenRow } from '../common/Row';
import { UserContext } from '../context/User';
import { checkExistingRoom, createVirtualWork, ReadWorkByIndividually } from '../service/WorkService';
import { Readuserbyusersid } from '../service/UserService';
import { CreateContact } from '../service/ContactService';
import { CreateChat, NewCreateMessage } from '../service/ChatService';
import { CHATCONTENTTYPE, CONTACTTYPE, PCMAINMENU } from '../utility/screen';
import { useNavigate } from 'react-router-dom';
import { imageDB } from '../utility/imageData';
import dayjs from "dayjs";
import { deterministicShuffle } from '../utility/shuffle';
import { Toaster, toast } from 'sonner';

/* ---------------- styles ---------------- */

const GridWrapper = styled.div`
  /* 멀티컬럼 레이아웃 */
  column-count: 2;
  column-gap: 12px;
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  /* 가로 넘침 방지(최후 안전망) */
  overflow-x: clip;
`;

const Card = styled.div`
  break-inside: avoid;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 6px;
  /* 가로 넘침 방지 */
  overflow: hidden;
  display: block;   /* inline-block → block (미세 넘침 방지) */
  width: 100%;
  min-width: 0;
`;

const ImageSection = styled.div`
  width: 100%;
  max-width: 100%;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
  contain: layout paint; /* 일부 단말 1px 넘침 방지 */
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
`;

const ClampInline = `
  overflow-wrap: anywhere;
  word-break: break-word;
  min-width: 0;
`;

const InfoSection = styled.div`
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${ClampInline}
`;

const Name = styled.div`
  font-family: Pretendard-Bold;
  color: #1f2937;
  font-size: ${() => getFontSize(14)}px !important;
  ${ClampInline}
`;

const Meta = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #6b7280;
  ${ClampInline}
`;

const CategoryList = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  ${ClampInline}
`;

const CategoryTag = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  background: #f1f5f9;
  color: #334155;
  border-radius: 8px;
  padding: 4px 8px;
  white-space: normal; /* 길면 줄바꿈 허용 */
  border: none;
  font-weight: 500;
`;

const ListenButton = styled.div`
  margin-top: 4px;
  padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  display: inline-block; /* fit-content 이슈 회피 */
  align-self: flex-start;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: #e5e7eb; }
`;

const Intro = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #374151;
  ${ClampInline}
`;

/* ---------------- helpers ---------------- */

const convertGender = (gender) => {
  if (gender === 'male') return '남성';
  if (gender === 'female') return '여성';
  return gender || '';
};

/* ---------------- component ---------------- */

const ExpertWorkerList = ({ workers }) => {
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const { dispatch, user } = useContext(UserContext);

  const [shuffledList, setShuffledList] = useState([]);

  useEffect(() => {
    const hourlySeed = dayjs().format('YYYY-MM-DD-HH');

    const featuredAbilityUserIds = (workers || [])
      .filter(w => (w.abilities || []).length > 0)
      .map(w => w.users_id);

    const filtered = (workers || []).filter(
      w => w.official === true && !featuredAbilityUserIds.includes(w.users_id)
    );

    const baseList = filtered.length > 0 ? filtered : (workers || []);
    const newShuffled = deterministicShuffle(baseList, hourlySeed).slice(0, 10);
    setShuffledList(newShuffled);
  }, [workers]);

  const handleChat = async (SUPPORTER) => {
    const OWNER = user;
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

    const CHAT_ID = await CreateChat({
      OWNER,
      OWNER_ID: OWNER.USERS_ID,
      SUPPORTER: SUPPORTER_INFO,
      SUPPORTER_ID: SUPPORTER.users_id,
      INFO: { ...WORK_DATA, isVirtualWork: true },
      TYPE: PCMAINMENU.HOMEMENU
    });

    await CreateContact({
      OWNER_ID: OWNER.USERS_ID,
      SUPPORTER_ID: SUPPORTER.users_id,
      CONTACT_STATUS: CONTACTTYPE.INIT,
      CONTACT_INFO: WORK_INFO,
      ID: CHAT_ID,
      RIGHT_SIGN: '',
      WORKTYPE: PCMAINMENU.HOMEMENU
    });

    await NewCreateMessage({
      CHAT_ID,
      msg: `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`,
      users_id: user.USERS_ID,
      read: [user.USERS_ID, SUPPORTER.users_id],
      CHAT_CONTENT_TYPE: CHATCONTENTTYPE.ENTER,
      AlarmTarget_ID: SUPPORTER.users_id
    });

    navigate("/Mobilechat");
  };

  return (
    <>
      <GridWrapper>
        {shuffledList.map((worker) => {
          const tagList = worker.tags || [];
          return (
            <Card
              key={worker.USERS_ID || worker.users_id}
              onClick={() => {
                setSelectedWorker(worker);
                dispatch({ popupOpen: true });
              }}
            >
              <ImageSection>
                <ProfileImage
                  src={worker.profileImg || imageDB.hongladywebtoon}
                  alt="프로필"
                />
              </ImageSection>

              <InfoSection>
                <BetweenRow>
                  <Name>{worker.chatName}</Name>
                  <Meta>{convertGender(worker.gender)} / {worker.age}</Meta>
                </BetweenRow>

                <CategoryList>
                  {tagList.length > 0 && <CategoryTag>{tagList[0]}</CategoryTag>}
                  {tagList.length > 1 && <CategoryTag>+{tagList.length - 1}</CategoryTag>}
                </CategoryList>

                <Intro>
                  {worker.selfIntro?.slice(0, 30)}
                  {worker.selfIntro?.length > 30 && '...'}
                </Intro>

                {worker.official && worker.tts_audio_url && (
                  <ListenButton
                    onClick={(e) => {
                      e.stopPropagation();
                      const audio = new Audio(worker.tts_audio_url);

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
                        toast.dismiss(toastId);
                        const playToastId = toast("🎧 음성을 재생 중입니다...", {
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
                        audio.play();
                        audio.onended = () => toast.dismiss(playToastId);
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
              </InfoSection>
            </Card>
          );
        })}
        <Toaster position="bottom-right" richColors />
      </GridWrapper>

      {selectedWorker && (
        <MobileWorkerPopup
          data={selectedWorker}
          containerStyle={{ height: 'calc(100vh - 40px)' }}
          onChat={() => handleChat(selectedWorker)}
          onClose={() => {
            setSelectedWorker(null);
            dispatch({ popupOpen: false });
          }}
        />
      )}
    </>
  );
};

export default ExpertWorkerList;
