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

/* ---------------- styles ---------------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  display: flex;
  flex-direction: column;
  min-height: 240px;   /* 최소 높이만 보장 */
  height: auto;        /* 내용에 따라 유동 */
`;

const Intro = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #374151;
  line-height: 1.4;
  margin-top: 2px;          /* 위아래 여백 최소화 */
  display: -webkit-box;
  -webkit-line-clamp: 2;    /* 최대 2줄까지만 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* ✅ 정사각 */
  background: #f3f4f6;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    padding-top: 100%; /* aspect-ratio 폴백 */
  }

  > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
  }
`;

const ListenOverlay = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;   /* ✅ 위아래 줄임 */
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 8px;
  background: rgba(255,255,255,0.75);
  color: #111;
  border: 1px solid #ddd;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  transition: background .2s;
  &:hover { background: #f3f4f6; }
`;

const Info = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const Name = styled.div`
  font-family: Pretendard-Bold;
  color: #1f2937;
  font-size: ${() => getFontSize(14)}px !important;
`;

const Meta = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #6b7280;
`;

const Tags = styled.div` display: flex; gap: 4px; flex-wrap: wrap; `;
const Tag = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  background: #f1f5f9;
  color: #334155;
  border-radius: 6px;
  padding: 2px 6px;
  font-weight: 500;
`;



/* ---------------- helpers ---------------- */

const convertGender = (gender) => (gender === 'male' ? '남성' : gender === 'female' ? '여성' : (gender || ''));

/* ---------------- component ---------------- */

const ExpertWorkerList = ({ workers, excludedIds = new Set(), limit = 4 }) => {
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const { dispatch, user } = useContext(UserContext);

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
    const CHAT_ID = await CreateChat({ OWNER, OWNER_ID: OWNER.USERS_ID, SUPPORTER: SUPPORTER_INFO, SUPPORTER_ID: SUPPORTER.users_id, INFO: { ...WORK_DATA, isVirtualWork: true }, TYPE: PCMAINMENU.HOMEMENU });
    await CreateContact({ OWNER_ID: OWNER.USERS_ID, SUPPORTER_ID: SUPPORTER.users_id, CONTACT_STATUS: CONTACTTYPE.INIT, CONTACT_INFO: WORK_INFO, ID: CHAT_ID, RIGHT_SIGN: '', WORKTYPE: PCMAINMENU.HOMEMENU });
    await NewCreateMessage({ CHAT_ID, msg: `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`, users_id: user.USERS_ID, read: [user.USERS_ID, SUPPORTER.users_id], CHAT_CONTENT_TYPE: CHATCONTENTTYPE.ENTER, AlarmTarget_ID: SUPPORTER.users_id });
    navigate("/Mobilechat");
  };

  return (
    <>
      <Grid>
        {four.map((worker) => {
          const tagList = worker.tags || [];
          return (
            <Card key={worker.USERS_ID || worker.users_id} onClick={() => { setSelectedWorker(worker); dispatch({ popupOpen: true }); }}>
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
          onClose={() => { setSelectedWorker(null); dispatch({ popupOpen: false }); }}
        />
      )}
    </>
  );
};

export default ExpertWorkerList;
