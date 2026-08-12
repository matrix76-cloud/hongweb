import React, { useContext, useMemo, useState } from 'react';
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
import { Toaster, toast } from 'sonner';

/* ========= styles (영화 순위 말풍선 + 꼬리) ========= */

const TAIL_SIZE = 10;               // 삼각형 높이
const CARD_BG = '#2c2f38';          // 말풍선 본체 색
const CARD_BG_DARK = '#1f2025';     // 이미지 자리 비었을 때 배경

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Card = styled.div`
  position: relative;
  background: ${CARD_BG};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  min-height: 240px;
  height: auto;
  margin-bottom: ${TAIL_SIZE + 6}px; /* 꼬리 공간 */

  /* 말풍선 꼬리 */
  &::after{
    content: "";
    position: absolute;
    left: 50%;
    bottom: -${TAIL_SIZE}px;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: ${TAIL_SIZE}px solid transparent;
    border-right: ${TAIL_SIZE}px solid transparent;
    border-top: ${TAIL_SIZE}px solid ${CARD_BG};
  }
  /* 꼬리 그림자 살짝 */
  &::before{
    content: "";
    position: absolute;
    left: calc(50% - ${TAIL_SIZE}px);
    bottom: -${TAIL_SIZE + 2}px;
    width: ${TAIL_SIZE * 2}px;
    height: ${TAIL_SIZE}px;
    filter: blur(4px);
    background: rgba(0,0,0,0.25);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: ${CARD_BG_DARK};
  overflow: hidden;

  &::before { content: ""; display: block; padding-top: 100%; }

  > img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
  }
`;

const ListenOverlay = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;                 /* 위아래 줄임 */
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px;
  background: rgba(255,255,255,0.15);   /* 투명 흰 배경 */
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
  cursor: pointer;
  transition: background .2s, transform .1s;
  backdrop-filter: saturate(120%) blur(2px);
  &:active { transform: scale(0.98); }
  &:hover  { background: rgba(255,255,255,0.25); }
`;

const Info = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const Name = styled.div`
  font-family: Pretendard-Bold;
  color: #fff;
  font-size: ${() => getFontSize(13)}px !important;
`;

const Meta = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #ddd;
`;

const Tags = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  background: rgba(255,255,255,0.15);
  color: #fff;
  border-radius: 6px;
  padding: 2px 6px;
  font-weight: 500;
`;

const Intro = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #f5f5f5;
  line-height: 1.3;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ========= helpers ========= */

const convertGender = (gender) =>
  gender === 'male' ? '남성' : gender === 'female' ? '여성' : (gender || '');

/* ========= component ========= */

const ExpertWorkerList = ({ workers, excludedIds = new Set(), limit = 4 }) => {
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const { dispatch, user } = useContext(UserContext);

  // 능력자 제외 → 랜덤 → 상위 N(4)
  const four = useMemo(() => {
    const pool = (workers || []).filter(w => {
      const id = w.users_id || w.USERS_ID;
      return id && !excludedIds.has(id);
    });
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, limit);
  }, [workers, excludedIds, limit]);

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
      <Grid>
        {four.map((worker) => {
          const tagList = worker.tags || [];
          return (
            <Card
              key={worker.USERS_ID || worker.users_id}
              onClick={() => { setSelectedWorker(worker); dispatch({ popupOpen: true }); }}
            >
              <ImageWrap>
                <img
                  src={worker.profileImg || imageDB.hongladywebtoon}
                  alt="프로필"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                />

                {worker.official && worker.tts_audio_url && (
                  <ListenOverlay
                    onClick={(e) => {
                      e.stopPropagation();
                      const audio = new Audio(worker.tts_audio_url);
                      const toastId = toast.loading("🎧 음성 준비 중...", { duration: Infinity });
                      audio.onloadeddata = () => { toast.dismiss(toastId); audio.play(); };
                      audio.onerror = () => { toast.dismiss(toastId); toast.error("음성 재생 실패"); };
                    }}
                  >
                    🎧 AI 요약 듣기
                  </ListenOverlay>
                )}
              </ImageWrap>

              <Info>
                <BetweenRow>
                  <Name>{worker.chatName}</Name>
                  <Meta>{convertGender(worker.gender)} / {worker.age}</Meta>
                </BetweenRow>

                <Tags>
                  {tagList.length > 0 && <Tag>{tagList[0]}</Tag>}
                  {tagList.length > 1 && <Tag>+{tagList.length - 1}</Tag>}
                </Tags>

                <Intro>{worker.selfIntro || ''}</Intro>
              </Info>
            </Card>
          );
        })}
      </Grid>

      <Toaster position="bottom-right" richColors />

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
