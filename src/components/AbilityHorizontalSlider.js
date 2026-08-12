// components/AbilityHorizontalSlider.js
import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { abilityOptions } from "../utility/abilityOptions";
import { imageDB } from "../utility/imageData";
import { checkExistingRoom, ReadWorkByIndividually, createVirtualWork } from "../service/WorkService";
import { Readuserbyusersid } from "../service/UserService";
import { CreateChat, NewCreateMessage } from "../service/ChatService";
import { CHATCONTENTTYPE, CONTACTTYPE, PCMAINMENU } from "../utility/screen";
import { UserContext } from "../context/User";
import { CreateContact } from "../service/ContactService";
import { shuffleArray } from "../utility/common";
import MobileWorkerPopup from "../modal/MobileWorkerPopup";

/* -------------------- styled -------------------- */
const SliderWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 12px 4px 12px 12px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  width: calc(100vw - 70px);
  max-width: 100vw;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  ${props => props.single && css`
    width: 100%;
    gap: 0;
    padding: 0;              /* 좌우 여백 제거 */
    scroll-snap-type: none;  /* 스냅 해제 */
    overflow-x: hidden;      /* 불필요 스크롤 제거 */
  `}
`;

const SectionContainer = styled.div` margin-top: 32px; `;

const SectionTitle = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family : Pretendard-SemiBold;
  color: #111;
  margin: 0 0 0px 0px;
`;

const SectionLine = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #666;
  margin: 4px 0 8px 8px;
  line-height: 1.5;
`;

const Card = styled.div`
  flex: 0 0 50%; /* 기본: 2개 정도 보이게 */
  scroll-snap-align: start;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

  ${props => props.single && css`
    flex: 1 1 100%;   /* 1개일 때 가득 */
  `}
`;

/* ✅ 싱글일 때 사진 잘림 최소화:
   - aspect-ratio로 세로 확보
   - 이미지 자체는 contain으로 전체 보이기
   - 뒤에 블러 배경을 깔아 빈 공간 방지 */
const ImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 160px;                 /* 기본(여러 개일 때) */
  background: #f1f3f5;
  overflow: hidden;

  ${props => props.single && css`
    height: auto;
    aspect-ratio: 6/ 3;         /* 싱글일 때 더 세로 확보 */
  `}

  /* 블러 배경 (싱글일 때만) */
  ${props => props.single && css`
    &::before{
      content: "";
      position: absolute; inset: 0;
      background-size: cover;
      background-position: center 25%;
      filter: blur(12px) brightness(0.92);
      transform: scale(1.08);
      z-index: 0;
    }
  `}
`;

const ProfileImage = styled.img`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;             /* 기본: 꽉 채우기 */
  object-position: center 25%;   /* 얼굴 쪽 위로 포커스 */

  ${props => props.single && css`
    object-fit: contain;         /* 싱글: 전체 보이기 */
    height: 100%;
  `}
`;

const InfoSection = styled.div` display: flex; flex-direction: column; gap: 6px; `;

const Name = styled.div`
  font-family: Pretendard-Bold;
  color: #1f2937;
  font-size: ${() => getFontSize(14)}px !important;
`;

const Meta = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #6b7280;
`;

const BetweenRow = styled.div` display: flex; justify-content: space-between; align-items: center; `;

const EmptyNotice = styled.div`
  flex: 1 0 auto;
  min-width: 100%;
  height: 120px;
  border-radius: 10px;
  background: #f7f8fa;
  border: 1px dashed #d7dbe2;
  display: grid;
  place-items: center;
  color: #6b7280;
  font-size: ${() => getFontSize(14)}px !important;
`;

/* -------------------- utils -------------------- */
const convertGender = (gender) => {
  if (gender === 'male') return '남성';
  if (gender === 'female') return '여성';
  return gender;
};

/* -------------------- component -------------------- */
/**
 * @param {Array} workeritems - 근처 지원자 전체 배열
 * @param {Array<string>} visibleKeys - 보이도록 사용자가 선택한 능력 태그들
 */
const AbilityHorizontalSlider = ({ workeritems = [], visibleKeys }) => {
  const { dispatch, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState(null);

  // 섹션 목록: visibleKeys가 주어지면 그 목록만, 없으면 전체(하위 호환)
  const sections = useMemo(() => {
    const base = Array.isArray(visibleKeys)
      ? abilityOptions.filter(opt => visibleKeys.includes(opt.tag))
      : abilityOptions;
    return base.filter(opt => opt.title && opt.tag);
  }, [visibleKeys]);

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

  const hasTag = (w, tag) => {
    const list = Array.isArray(w?.abilities) ? w.abilities : (Array.isArray(w?.tags) ? w.tags : []);
    return list.includes(tag);
  };

  return (
    <>
      {sections.map((opt) => {
        const matched = workeritems.filter(w => hasTag(w, opt.tag));
        const shuffled = shuffleArray(matched);
        const isSingle = shuffled.length === 1;

        return (
          <SectionContainer key={opt.tag}>
            <SectionTitle>{opt.title}</SectionTitle>
            <SectionLine>{opt.line}</SectionLine>

            <SliderWrapper single={isSingle}>
              {shuffled.length === 0 ? (
                <EmptyNotice>아직 선택된 능력자가 없습니다</EmptyNotice>
              ) : (
                shuffled.map((worker) => {
                  const src = worker.profileImg || imageDB.hongladywebtoon;
                  return (
                    <Card
                      key={worker.USERS_ID}
                      single={isSingle}
                      onClick={() => {
                        setSelectedWorker(worker);
                        dispatch({ popupOpen: true });
                      }}
                    >
                      <ImageSection
                        single={isSingle}
                        style={isSingle ? { backgroundImage: `url(${src})` } : undefined}  // 블러 배경 소스 주입
                      >
                        <ProfileImage
                          src={src}
                          alt="프로필"
                          single={isSingle}
                          loading="lazy"
                          decoding="async"
                        />
                      </ImageSection>
                      <InfoSection>
                        <BetweenRow>
                          <Name>{worker.chatName}</Name>
                          <Meta>{convertGender(worker.gender)} / {worker.age}</Meta>
                        </BetweenRow>
                      </InfoSection>
                    </Card>
                  );
                })
              )}
            </SliderWrapper>
          </SectionContainer>
        );
      })}

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

export default AbilityHorizontalSlider;
