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


const GridWrapper = styled.div`
  column-count: 2;
  column-gap: 12px;
  position: relative;

  &::after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 1px;
  }
`;

const Card = styled.div`
  break-inside: avoid; // 💡 핵심! 카드가 쪼개지지 않도록
  margin-bottom: 12px;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  display: inline-block;
  width: 100%;
`;

// const GridWrapper = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 16px;
//   padding: 8px;
// `;

// const Card = styled.div`
//   display: flex;
//   flex-direction: column;
//   border-radius: 6px;
//   overflow: hidden;
// `;

const ImageSection = styled.div`
  width: 100%;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
  height: auto; // 💡 여기 핵심
`;

const ProfileImage = styled.img`
  width: 100%;
  height: auto; // 💡 혹은 제거
  object-fit: cover;
  display: block;

`;

const InfoSection = styled.div`
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
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

const CategoryList = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const CategoryTag = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  background: #f1f5f9; // 더 은은하고 modern
  color: #334155; // 좀 더 눈에 띄는 색 (dark slate)
  border-radius: 8px; // 완전 동그라미 → 약간 둥글게
  padding: 4px 8px;
  white-space: nowrap;
  border: none;
  font-weight: 500;
    
`;

const Intro = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #374151;

`;

const convertGender = (gender) => {
  if (gender === 'male') return '남성';
  if (gender === 'female') return '여성';
  return gender;
};

const ExpertWorkerList = ({ workers }) => {
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState(null);
  

  const { dispatch, user } = useContext(UserContext);

  const SHUFFLE_KEY = 'hong_ai_shuffle_date';
  const SHUFFLED_DATA_KEY = 'hong_ai_shuffle_data';
  const [shuffledList, setShuffledList] = useState([]);




  // 셔플 함수
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {

    console.log("expert workers", workers);

    const today = dayjs().format('YYYY-MM-DD');
    const hourlySeed = dayjs().format('YYYY-MM-DD-HH');


    const featuredAbilityUserIds = workers
      .filter(w => (w.abilities || []).length > 0)
      .map(w => w.users_id);
    

    const filtered = workers.filter(
      w => w.official === true && !featuredAbilityUserIds.includes(w.users_id)
    );

    const baseList = filtered.length > 0 ? filtered : workers;

    // const newShuffled = shuffleArray(baseList).slice(0, 10);

    const newShuffled = deterministicShuffle(baseList, hourlySeed).slice(0, 15);

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

    const CHAT_ID = await CreateChat({ OWNER, OWNER_ID: OWNER.USERS_ID, SUPPORTER: SUPPORTER_INFO, SUPPORTER_ID: SUPPORTER.users_id, INFO: { ...WORK_DATA, isVirtualWork: true }, TYPE: PCMAINMENU.HOMEMENU });

    await CreateContact({ OWNER_ID: OWNER.USERS_ID, SUPPORTER_ID: SUPPORTER.users_id, CONTACT_STATUS: CONTACTTYPE.INIT, CONTACT_INFO: WORK_INFO, ID: CHAT_ID, RIGHT_SIGN: '', WORKTYPE: PCMAINMENU.HOMEMENU });

    await NewCreateMessage({ CHAT_ID, msg: `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`, users_id: user.USERS_ID, read: [user.USERS_ID, SUPPORTER.users_id], CHAT_CONTENT_TYPE: CHATCONTENTTYPE.ENTER, AlarmTarget_ID: SUPPORTER.users_id });

    navigate("/Mobilechat");
  };

  return (
    <>
      <GridWrapper>
        {shuffledList.map((worker) => {
          const tagList = worker.tags || [];
          const displayedTags = tagList.slice(0, 2);
          return (
            <Card key={worker.USERS_ID} onClick={() => {
              setSelectedWorker(worker);
              dispatch({ popupOpen: true });
            }}>
              <ImageSection>
                <ProfileImage src={worker.profileImg || imageDB.hongladywebtoon} alt="프로필" />
              </ImageSection>
              <InfoSection>
                <BetweenRow>
                  <Name>{worker.chatName}</Name>
                  <Meta>{convertGender(worker.gender)} / {worker.age}</Meta>
                </BetweenRow>
                <CategoryList>
                  {tagList.map((cat, idx) => (
                    <CategoryTag key={idx}>{cat}</CategoryTag>
                  ))}
                  {/* {tagList.length > 2 && <CategoryTag>+{tagList.length - 2}</CategoryTag>} */}
                </CategoryList>
                <Intro>
                  {worker.selfIntro?.slice(0, 30)}
                  {worker.selfIntro?.length > 30 && '...'}
                </Intro>
              </InfoSection>
            </Card>
          );
        })}
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
